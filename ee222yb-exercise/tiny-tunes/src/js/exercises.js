'use strict'

export function ex01 () {
  document.getElementById('step01_hello').innerHTML = 'Hello World!'
}

function makeSubHeader () {
  let childElement = document.createElement('h2')
  childElement.innerHTML = 'This is a sub headline'
  return childElement
}

export function ex02 () {
  let child = makeSubHeader()
  document.getElementById('step02').appendChild(child)
}

export function ex03 () {
  let child = makeSubHeader()
  let headers = document.getElementsByTagName('h2')
  headers[4].parentElement.append(child)
}

export function ex04 () {
  let header = document.getElementById('step04').getElementsByTagName('h2')[0]
  header.style.color = 'red'
}

export function ex05 () {
  let parent = document.getElementById('step05')
  let clickBox = parent.getElementsByTagName('div')[0]

  clickBox.addEventListener('click', () => {
    let textNode = document.createElement('p')
    textNode.innerHTML = 'You clicked!'
    parent.append(textNode)
  })
}

export function ex06 () {
  let fragment = document.createDocumentFragment()
  let list = document.querySelector('#list06')
  for (let i = 0; i < 10; i++) {
    let item = document.createElement('li')
    fragment.append(item)
  }
  list.append(fragment)
}

export function ex07 () {
  let template = document.querySelector('#step07-template')
  let list = document.getElementById('list07')

  for (let i = 0; i < 5; i++) {
    let item = template.content.cloneNode(true)
    let link = item.querySelector('.greybox')
    link.setAttribute('href', 'http://www.google.com')
    link.innerText = 'google'
    list.append(item)
  }
}

export function ex08 () {
  let step = document.querySelector('#step08')
  let form = step.querySelector('#todolistform')
  let textBox = form.querySelector('input')
  let button = form.querySelector('button')
  let list = step.querySelector('#todolist')

  button.addEventListener('click', () => {
    let item = document.createElement('li')
    item.innerText = textBox.value
    list.append(item)
    textBox.value = ''
  })
}

export function ex09 () {
  let step = document.querySelector('#step09')
  let textBoxes = step.querySelector('#textboxes09')
  let inputs = []
  for (let i = 0; i < textBoxes.childElementCount; i++) {
    if (textBoxes.children[i].tagName === 'INPUT') {
      inputs.push(textBoxes.children[i])
    }
  }

  // create notification text (and hide by default)
  let notification = document.createElement('p')
  notification.innerText = 'Usernames do not match'
  notification.style.color = 'red'
  notification.style.visibility = 'hidden'
  step.appendChild(notification)

  // add event listeners to both inputs
  inputs.forEach(input => {
    input.addEventListener('blur', () => {
      if (inputs[0].value !== '' && inputs[1].value !== '' && inputs[0].value !== inputs[1].value) {
        notification.style.visibility = 'visible'
      } else {
        notification.style.visibility = 'hidden'
      }
    })
  })
}
