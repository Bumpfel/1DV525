'use strict'

const defaultDisplayInterval = 100
let activeInterval

function enableBoard (board, sentence, letterDisplayInterval) {
  let pointer = 0
  let tempVar = '' // used because spaces seems to not be handled correctly if assigned directly to innerText
  board.addEventListener('mousedown', () => {
    activeInterval = setInterval(() => {
      if (pointer < sentence.length) {
        tempVar += sentence.charAt(pointer)
        board.innerText = tempVar
        pointer++
        // board.innerText = sentence.substring(0, pointer % sentence.length)
      } else {
        tempVar += '\n'
        board.innerText = tempVar
        pointer = 0
      }
    }, letterDisplayInterval)
  })
}

document.addEventListener('mouseup', () => {
  clearInterval(activeInterval)
})

function registerTag (tagName) {
  // return document.registerElement(tagName
  window.customElements.define(tagName, class extends window.HTMLElement {
    constructor () {
      super()
      this.className = 'blackboard'
    }
  })
}

const sentences = [ 'I SAW NOTHING UNUSUAL IN THE TEACHERS LOUNGE',
  'I WILL NOT REPLACE A CANDY HEART WITH A FROG HEART',
  'I WILL NOT ENCOURAGE OTHERS TO FLY',
  'THEY ARE LAUGHING AT ME, NOT WITH ME',
  'I WILL NOT YELL "FIRE" IN A CROWDED CLASSROOM']

// enableBoard('board', 'I SAW NOTHING UNUSUAL IN THE TEACHERS LOUNGE', defaultDisplayInterval)
// enableBoard('board2', 'I WILL NOT REPLACE A CANDY HEART WITH A FROG HEART', defaultDisplayInterval)
registerTag('bart-board')
let bartBoards = document.getElementsByTagName('bart-board')
let sentenceIndex = Math.floor(Math.random() * sentences.length) // randomizes first sentence
for (let i = 0; i < bartBoards.length; i++) {
  enableBoard(bartBoards[i], sentences[sentenceIndex++ % sentences.length], defaultDisplayInterval)
}
