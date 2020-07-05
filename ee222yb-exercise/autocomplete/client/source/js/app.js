import './teamselector.js'
import './teamcard.js'

const selector = document.querySelector('#team-select')
const cardContainer = document.body.querySelector('#card-container')

selector.addEventListener('foundTeam', async e => {
  while (cardContainer.lastChild) {
    cardContainer.lastChild.remove()
  }

  const card = document.createElement('team-card')
  card.setAttribute('src', selector.getAttribute('src'))
  card.setAttribute('id', e.detail.id)
  cardContainer.appendChild(card)
})
