import { Timer } from './timer.js'

let selectColour
let timer = new Timer()

let startButton = document.createElement('button')
startButton.addEventListener('click', () => initGame())
startButton.innerText = 'Start game'
document.body.appendChild(startButton)

let resetButton = document.createElement('button')
resetButton.addEventListener('click', () => window.location.reload())
resetButton.innerText = 'Reset game'
document.body.appendChild(resetButton)

function initGame () {
  console.log('initializing')
  document.body.removeChild(startButton)
  startButton.style.visibility = 'hidden'
  timer.start()

  let boxesLeft = 3
  let gameBoard = document.querySelector('#board')
  let bricks = []
  let colours = ['yellow', 'blue', 'red']
  let timerInterval

  let randomColourIndex = Math.floor(Math.random() * colours.length)
  selectColour = colours[randomColourIndex]
  document.querySelector('#colorToClick').textContent += selectColour

  let timerDisplay = document.querySelector('#time')

  timerInterval = setInterval(() => {
    timerDisplay.textContent = (timer.getTime() / 1000).toFixed(1)
  }, 100)

  // insert three of each colour in an array and shuffle it
  for (let i = 0; i < gameBoard.children.length; i++) {
    bricks.push(colours[i % colours.length])
  }
  shuffleArray(bricks)

  // iterate through boxes and set box colour and listener
  for (let i = 0; i < gameBoard.children.length; i++) {
    let box = gameBoard.children[i]
    box.classList.add(bricks[i])

    const func = () => {
      if (box.classList.contains(selectColour)) {
        box.classList.remove(selectColour)
        boxesLeft--
        if (boxesLeft === 0) {
          timer.stop()
          clearInterval(timerInterval)
          let gameNotification = document.createElement('h2')
          gameNotification.innerText = 'Game finished'
          document.body.appendChild(gameNotification)
          document.body.appendChild(startButton)
        }
      }
    }
    box.addEventListener('click', func)
  }
}

function shuffleArray (array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1))
    let temp = array[i]
    array[i] = array[j]
    array[j] = temp
  }
}
