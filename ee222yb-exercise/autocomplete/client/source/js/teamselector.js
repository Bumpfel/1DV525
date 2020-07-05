const template = document.createElement('template')
template.innerHTML = `
  <input id='team-search' list='teams-list' autofocus placeholder='Search for team...'>
  <datalist id='teams-list'></datalist>
  `

class TeamSelector extends window.HTMLElement {
  constructor () {
    super()

    this.serverApiUrl = 'http://localhost:3000/api' // default
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(template.content.cloneNode(true))
    this.list = this.shadowRoot.querySelector('#teams-list')
  }

  // placing this here instead of in the constructor since this method will only run if and when the shadowDOM is appended to the document
  connectedCallback () {
    // set input text box listener to make a GET and populate list with results whenever input text is changed
    let searchInput = this.shadowRoot.querySelector('#team-search')
    searchInput.addEventListener('input', () => {
      this.clearList()
      if (searchInput.value.length > 1) { // only make GET request if search input is longer than specfied characters
        this.search(searchInput.value).then(result => {
          if (result.length === 1 && result[0].name === searchInput.value) {
            let searchEvent = new window.CustomEvent('foundTeam', { detail: result[0] })
            this.dispatchEvent(searchEvent)
            searchInput.blur()
            searchInput.focus()
          }
          this.populateList(result)
        })
      }
    })
  }

  static get observedAttributes () {
    return ['src']
  }

  attributeChangedCallback (name, oldValue, newValue) {
    if (name === 'src') {
      this.serverApiUrl = newValue
    }
  }

  async search (string) {
    const response = await window.fetch(this.serverApiUrl + '/teams?q=' + string)
    let result = await response.json()
    return result.teams
  }

  /**
   * @param {Element} list
   */
  clearList () {
    while (this.list.lastChild) {
      this.list.removeChild(this.list.lastChild)
    }
  }

  /**
   * @param {Iterable} teams
   */
  populateList (teams) {
    for (let team of teams) {
      let option = document.createElement('option')
      option.setAttribute('value', team.name)
      option.setAttribute('id', team.id)
      this.list.appendChild(option)
    }
  }
}

window.customElements.define('team-selector', TeamSelector)
