import * as server from './server-communication.js'
import { eng, saveData } from './strings.js'
import Timer from './timer.js'

// Settings
const defaultTime = 20 // time in seconds per question
const toastTime = 3000 // time the toast window is shown in milliseconds
const maxNrOfHighscores = 5
const strings = eng

const usernameTemplate = document.createElement('template')
usernameTemplate.innerHTML = `
  <form id='nameForm'>
    <input type='text' id='username' placeholder='${strings.enterName}' autocomplete='off' autofocus>
    <br>
    <input type='submit' value='${strings.startGame}'>
  </form>
  `

const feedbackSnippet = document.createElement('p')
feedbackSnippet.id = 'feedback'
feedbackSnippet.classList.add('feedback')

const questionTemplate = document.createElement('template')
questionTemplate.innerHTML = `
  <form id='answerForm'>
    <p id='timer'></p>
    <p id='question'></p>
    <p id='answerOptions'>
    
    </p>
    <input type='submit' value='${strings.sendAnswer}'>
  </form>
  `

const textInputTemplate = document.createElement('template')
textInputTemplate.innerHTML = `
  <input type='text' id='answer' placeholder='${strings.answer}' autocomplete='off'>
  `

const radioInput = document.createElement('div')
radioInput.innerHTML = `
  <input type='radio' name='answer'>
  <label></label>
  `

const gameOverTemplate = document.createElement('template')
gameOverTemplate.innerHTML = `
  <button onclick='window.location.reload()'>${strings.restartGame}</button>
  `

const highscoreSnippet = document.createElement('div')
highscoreSnippet.id = 'highscore'
highscoreSnippet.innerHTML = `
<h3>Highscore</h3>
<table>
    <tbody id='highscoreBody'>
      <tr>
        <th>${strings.name}</th>
        <th>${strings.time}</th>
      </tr>
    </tbody>
  </table>
`

const highscoreRowTemplate = document.createElement('template')
highscoreRowTemplate.innerHTML = `
  <tr>
    <td></td>
    <td></td>
  </tr>
`

const styleSheetTemplate = document.createElement('template')
styleSheetTemplate.innerHTML = `
  <link rel='stylesheet' type='text/css' href='../css/quiz-game.css'>
`

class QuizGame extends window.HTMLElement {
  constructor () {
    super()

    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(styleSheetTemplate.content)
    this.shadowRoot.appendChild(usernameTemplate.content)
  }

  connectedCallback () {
    const userName = this.shadowRoot.querySelector('#username')
    const nameForm = this.shadowRoot.querySelector('#nameForm')

    nameForm.addEventListener('submit', async e => {
      e.preventDefault()
      this._userName = userName.value.trim()
      if (userName.value.length === 0) {
        return
      }
      this.shadowRoot.removeChild(nameForm)

      this.shadowRoot.appendChild(questionTemplate.content)
      this.shadowRoot.appendChild(feedbackSnippet)

      this._questionText = this.shadowRoot.querySelector('#question')
      this._feedback = this.shadowRoot.querySelector('#feedback')
      this._answerForm = this.shadowRoot.querySelector('#answerForm')
      this._answerOptions = this.shadowRoot.querySelector('#answerOptions')

      this._timer = new Timer(this.getAttribute('time') || defaultTime)
      this._timerElement = this.shadowRoot.querySelector('#timer')

      this._presentNextQuestion()

      // --------------------------
      // set form submit listener
      this._answerForm.addEventListener('submit', async e => {
        e.preventDefault()
        this._answerEventCallback()
      })
    })
  }

  async _answerEventCallback () {
    // get users' answer
    let answer
    const selectedAnswer = this.shadowRoot.querySelector('input[type="radio"]:checked')
    const writtenAnswer = this.shadowRoot.querySelector('#answer')
    if (selectedAnswer) {
      answer = selectedAnswer.value
    } else if (writtenAnswer) {
      if (!writtenAnswer.value.length) {
        this._showToast(strings.provideAnswer)
        return
      }
      answer = this.shadowRoot.querySelector('#answer').value
    } else {
      this._showToast(strings.chooseAlternative)
      return
    }

    this._haltTimerCounter()
    // send answer to server
    if (await server.sendAnswer(answer)) {
      // correct answer
      if (server.hasMoreQuestions()) {
        this._showToast(strings.correctAnswer(selectedAnswer ? selectedAnswer.id : writtenAnswer.value))
        this._presentNextQuestion()
      } else {
        const totalTime = this._timer.getTotalTimeElapsed()
        this._handleHighScoreData(totalTime)
        this._presentGameIsOver(strings.allDone, false)
      }
    } else {
      // wrong answer
      this._presentGameIsOver(strings.wrongAnswer, true)
    }
  }

  async _presentNextQuestion () {
    // clear previous options/text fields
    const currentQuestion = await server.getNextQuestion()
    while (this._answerOptions.lastChild) {
      this._answerOptions.removeChild(this._answerOptions.lastChild)
    }

    const alternatives = server.getAlternativesForCurrentQuestion()
    if (alternatives) {
      // question with alternatives (radios)
      for (const key in alternatives) {
        const alternative = alternatives[key]
        const option = radioInput.cloneNode(true)
        const input = option.querySelector('input')
        const label = option.querySelector('label')
        input.value = key
        input.id = alternatives[key]
        label.setAttribute('for', alternatives[key])
        label.innerText = alternative

        this._answerOptions.appendChild(option)
      }
      this._answerOptions.querySelector('input').focus()
    } else {
      // question w/o alternatives (textbox)
      this._answerOptions.appendChild(textInputTemplate.content.cloneNode(true))
      const answerInput = this._answerForm.querySelector('#answer')
      answerInput.focus()
    }
    this._questionText.innerText = currentQuestion
    this._startTimerCounter()
  }

  _presentGameIsOver (reason, dueToError) {
    clearInterval(this._timerInterval)
    this._showFeedback(reason, dueToError)
    this.shadowRoot.removeChild(this._answerForm)
    this.shadowRoot.appendChild(gameOverTemplate.content)

    // highscore
    const highscoreData = JSON.parse(window.localStorage.getItem(saveData))
    if (highscoreData) {
      this.shadowRoot.appendChild(highscoreSnippet)
      const tbody = this.shadowRoot.querySelector('#highscoreBody')
      for (let i = 0; i < highscoreData.length; i++) {
        tbody.appendChild(highscoreRowTemplate.content.cloneNode(true))
        const row = tbody.querySelector('tr:last-child')
        row.querySelector('td:first-child').innerText = (i + 1) + '. ' + highscoreData[i].name
        row.querySelector('td:nth-child(2)').innerText = highscoreData[i].time
      }
    }
  }

  _handleHighScoreData (newTime) {
    const highscoreData = JSON.parse(window.localStorage.getItem(saveData)) || []

    const thisScore = {
      time: newTime,
      name: this._userName
    }

    highscoreData.push(thisScore)
    sortHighscore()
    highscoreData.length = Math.min(highscoreData.length, maxNrOfHighscores)

    function sortHighscore () {
      highscoreData.sort((a, b) => a.time - b.time)
    }

    window.localStorage.setItem(saveData, JSON.stringify(highscoreData))
  }

  _showFeedback (text, isErroneous = false) {
    isErroneous ? this._feedback.classList.add('red') : this._feedback.classList.remove('red')
    clearTimeout(this._currentToast)
    this._feedback.innerText = text
  }

  _showToast (text) {
    this._showFeedback(text)
    this._currentToast = setTimeout(() => {
      this._showFeedback('')
    }, toastTime)
  }

  _startTimerCounter () {
    const updateCounter = () => {
      this._timerElement.innerText = strings.timeLeft(Math.ceil(this._timer.getTimeLeft()))
    }

    if (this._timerInterval) {
      clearInterval(this._timerInterval)
    }
    this._timer.start()
    updateCounter()
    this._timerInterval = setInterval(() => {
      if (this._timer.getTimeLeft() <= 0) {
        this._presentGameIsOver(strings.timeRanOut, true)
        return
      }
      updateCounter()
    }, 1000)
  }

  _haltTimerCounter () {
    clearInterval(this._timerInterval)
    this._timer.stop()
  }
}

window.customElements.define('quiz-game', QuizGame)
