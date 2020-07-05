import * as styles from './cssStyles.js'

// const size = '200px'
// const cardStyle = 'width: ' + size + '; height: ' + size + '; display: inline-block'

class MemoryCard extends window.HTMLElement {
  constructor () {
    super()

    this.attachShadow({ mode: 'open' })
    // this.rootElement = document.createElement('div')
    // this.rootElement.style = cardStyle
    // this.shadowRoot.appendChild(this.rootElement)
    this.enabled = true
  }

  connectedCallback () {
    const gameParent = document.querySelector('memory-game')
    this.imageFolder = gameParent.getAttribute('src') // TODO ought to check in parent attr instead

    if (!this.imageFolder) {
      throw new Error('Cannot instantiate game without path to images')
    }

    this.id = this.getAttribute('id')

    // this.classList.add(styles.cardStyle)
    this.style.width = 'inherit'
    this.style.height = 'inherit'
    this.img = document.createElement('img')
    this.img.style.width = 'inherit'
    this.img.style.heigth = 'inherit'
    this.hide()
    this.shadowRoot.appendChild(this.img)
  }

  show () {
    const imagePath = this.imageFolder + '/' + this.id + '.png'
    this.img.setAttribute('src', imagePath)
    this.enabled = false
  }

  hide () {
    const imagePath = this.imageFolder + '/0.png'
    this.img.setAttribute('src', imagePath)
    this.enabled = true
  }

  remove () {
    this.shadowRoot.removeChild(this.shadowRoot.lastChild)
    this.enabled = false
  }
}

window.customElements.define('memory-card', MemoryCard)
