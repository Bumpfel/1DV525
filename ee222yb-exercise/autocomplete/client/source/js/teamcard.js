const style = `
  display: block;
  margin-top: 10px;
  padding-left: 10px;
  padding-bottom: 10px;
  width: 300px;
  
  border: 1px solid black;
  background-color: #a6b8bb;
`

const template = document.createElement('template')
template.innerHTML = `
  <div style='${style}'>
    <h3 id='team-name'>test</h3>
    <p id='team-info'>Some info</p>
    <a target='_blank' id='team-url'></a>
  </div>
`

class TeamCard extends window.HTMLElement {
  constructor () {
    super()

    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(template.content.cloneNode(true))
  }

  async connectedCallback () {
    const serverApiUrl = this.getAttribute('src')
    const teamId = this.getAttribute('id')

    // fetches more detailed info on the team through a different api call
    const response = await window.fetch(serverApiUrl + '/teams/' + teamId)
    response.json().then(team => {
      const title = this.shadowRoot.querySelector('#team-name')
      title.innerText = team.name

      const text = this.shadowRoot.querySelector('#team-info')
      text.innerText = team.nickname

      const link = this.shadowRoot.querySelector('#team-url')
      link.setAttribute('href', team.url)
      link.innerText = team.url
    })
  }
}

window.customElements.define('team-card', TeamCard)
