import './memory-card.js'

const highestImageId = 8
const defaultCols = 4
const defaultRows = 3
const showCardsTimeout = 1000 // delay (in ms) when presenting two open cards

class MemoryGame extends window.HTMLElement {
  constructor () {
    super()

    this.attachShadow({ mode: 'open' })
    this.cards = []
    this.openCards = []
    this.blockAction = false
    this.nrOfMoves = 0
    this.selectIndex = 0
  }

  connectedCallback () {
    const cols = parseInt(this.getAttribute('cols')) || defaultCols
    const rows = parseInt(this.getAttribute('rows')) || defaultRows
    // const cardSize = parseInt(this.getAttribute('cardsize')) || defaultCardSize
    // const cardSize = window.innerWidth / cols
    const cardSize = 200

    this.totalCards = rows * cols
    this.cardsLeft = this.totalCards

    if (this.totalCards % 2 !== 0) {
      throw new Error('Cannot instantiate game with uneven nr of cards')
    } else if (this.totalCards > highestImageId * 2) {
      throw new Error('Cannot instantiate game with more than ' + (highestImageId * 2) + ' cards')
    } else if (cols <= 0 || rows <= 0) {
      throw new Error('Negative or zero value \'rows\' or \'cols\'')
    }

    for (let i = 1; i <= this.totalCards / 2; i++) {
      for (let j = 0; j < 2; j++) {
        const card = document.createElement('memory-card')
        card.setAttribute('id', i) // (TODO lite dålig säkerhet att använda id för som identifierare av brickan. vem som helst som kollar html-koden kan se det)
        this.cards.push(card)

        card.addEventListener('click', () => this.interactWithCard(card)) // TODO vet inte om argumentet är fel. borde kanske vara event
      }
    }

    // shuffle cards and insert into game element with correct rows and columns
    this.shuffleCards()

    const table = document.createElement('table')
    const tr = document.createElement('tr')
    const td = document.createElement('td')
    this.shadowRoot.appendChild(table)

    let id = 0
    for (let row = 0; row < rows; row++) {
      const tRow = tr.cloneNode()
      tRow.style.height = cardSize + 'px'
      table.appendChild(tRow)
      for (let col = 0; col < cols; col++) {
        const tCell = td.cloneNode()
        tCell.setAttribute('id', 'card' + id++)
        tRow.appendChild(tCell)
        tCell.appendChild(this.cards.pop())
        tCell.style.width = cardSize + 'px'
      }
    }
    this.selectCard(0)

    this.enableKeyNavigation(cols)
  }

  enableKeyNavigation (cols) {
    const rowNavigationKeys = ['ArrowUp', '', 'ArrowDown']
    const colNavigationKeys = ['ArrowLeft', '', 'ArrowRight']
    document.addEventListener('keydown', e => {
      if (rowNavigationKeys.includes(e.key)) {
        const indexChange = (rowNavigationKeys.indexOf(e.key) - 1) * cols
        this.selectCard(indexChange)
      } else if (colNavigationKeys.includes(e.key)) {
        const indexChange = colNavigationKeys.indexOf(e.key) - 1
        this.selectCard(indexChange)
      } else if (e.key === ' ') {
        const card = this.getSelectedCard().firstChild
        this.interactWithCard(card)
      }
    })
  }

  selectCard (indexChange) {
    if (this.selectIndex + indexChange < 0 || this.selectIndex + indexChange > this.totalCards - 1) {
      return
    }

    const oldCard = this.getSelectedCard()
    oldCard.style.border = '0'
    // oldCard.style.opacity = '1'
    this.selectIndex += indexChange

    // let selectedIndex = [...cell.parentNode.children].indexOf(cell)
    const newCard = this.getSelectedCard()
    newCard.style.border = '2px solid red'
    // newCard.style.opacity = '.5'
  }

  getSelectedCard () {
    return this.shadowRoot.querySelector('#card' + this.selectIndex)
  }

  interactWithCard (card) {
    if (this.blockAction || !card.enabled || this.isGameOver()) {
      return
    }

    if (!this.openCards.includes(card) && this.openCards.length < 2) {
      this.openCards.push(card)
      this.nrOfMoves++
      card.show()
      if (this.openCards.length === 2) {
        if (this.openCards[0].id === this.openCards[1].id) {
          // shown cards match
          this.blockAction = true
          // card.removeEventListener('click', this.clickHandler, false)
          this.cardsLeft -= 2
          setTimeout(() => {
            this.removeMatchedCards()
            this.openCards = []
            this.blockAction = false
          }, showCardsTimeout)
        } else {
          // shown cards do not match
          this.blockAction = true
          setTimeout(() => {
            this.hideOpenCards()
            this.blockAction = false
          }, showCardsTimeout)
        }
      }
    }
  }

  checkIfGameIsOver () {
    if (this.isGameOver()) {
      let game = document.querySelector('memory-game')
      game.parentElement.removeChild(document.querySelector('memory-game'))
      let resultPresentation = document.createElement('h2')
      resultPresentation.innerText = 'Good job, you finished the game with ' + this.nrOfMoves + ' moves!'
      document.body.appendChild(resultPresentation)
      let resetButton = document.createElement('button')
      resetButton.innerText = 'Restart game'
      resetButton.addEventListener('click', () => window.location.reload())
      document.body.appendChild(resetButton)
    }
  }

  isGameOver () {
    return this.cardsLeft === 0
  }

  removeMatchedCards () {
    for (let card of this.openCards) {
      card.remove()
    }
    this.checkIfGameIsOver()
  }

  hideOpenCards () {
    for (let card of this.openCards) {
      card.hide()
    }
    this.openCards.length = 0
  }

  shuffleCards () {
    for (let currentIndex = this.cards.length - 1; currentIndex > 0; currentIndex--) {
      const randomIndex = Math.floor(Math.random() * (currentIndex + 1))
      const temp = this.cards[currentIndex]
      this.cards[currentIndex] = this.cards[randomIndex]
      this.cards[randomIndex] = temp
    }
  }
}

window.customElements.define('memory-game', MemoryGame)
