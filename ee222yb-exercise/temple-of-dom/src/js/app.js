let nrOfElementNodes
let nrOfCommentNodes
let nrOfTextNodes

// includes template elements. cba to fix
function countAttributes () {
  let nrOfAttributes = 0
  for (let child of document.querySelectorAll('*')) {
    if (child.hasAttributes) {
      nrOfAttributes += child.attributes.length
    }
  }
  return nrOfAttributes
}

/**
 * @param { HTMLElement } element
 */
function countAll (element) {
  if (element === document) {
    nrOfElementNodes = 0
    nrOfCommentNodes = 0
    nrOfTextNodes = 0
  }

  for (let child of element.childNodes) {
    console.log(child)

    switch (child.nodeType) {
      case window.Node.ELEMENT_NODE:
        nrOfElementNodes++
        break
      case window.Node.COMMENT_NODE:
        nrOfCommentNodes++
        break
      case window.Node.TEXT_NODE:
        nrOfTextNodes++
        break
    }
    countAll(child)
  }
}

// presentation

/**
 * @param {string} title
 * @param {number} presentedValue
 */
function createPresentationTemplate (title, presentedValue) {
  let result = document.querySelector('#resultTemplate').cloneNode(true).content
  result.querySelector('h3').innerText = 'Number of ' + title
  result.querySelector('.resultText').innerText = presentedValue
  return result
}

countAll(document)
document.body.appendChild(createPresentationTemplate('elements', nrOfElementNodes))
document.body.appendChild(createPresentationTemplate('attributes', countAttributes()))
document.body.appendChild(createPresentationTemplate('comments', nrOfCommentNodes))
document.body.appendChild(createPresentationTemplate('text nodes', nrOfTextNodes))
