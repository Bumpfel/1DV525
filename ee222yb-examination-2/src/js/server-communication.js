const firstQuestionURL = 'http://vhost3.lnu.se:20080/question/1'

let latestGetResponse = {}
let latestPostResponse = {}

export async function getNextQuestion () {
  latestGetResponse = await fetch(latestPostResponse.nextURL || firstQuestionURL)
  latestGetResponse = await latestGetResponse.json()
  return latestGetResponse.question
}

/**
 * Sends the answer to the server asynchronously and returns true if the answer is correct
 * @param {*} answer The users answer. Should be the key rather than the value if it's a multi-alternative question
 */
export async function sendAnswer (answer) {
  const response = await fetch(latestGetResponse.nextURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ answer: answer })
  })
  latestPostResponse = await response.json()
  return response.ok
}

export function hasMoreQuestions () {
  return latestPostResponse && latestPostResponse.nextURL
}

export function getAlternativesForCurrentQuestion () {
  if (questionHasAlternatives) {
    return latestGetResponse.alternatives
  }
  return null
}

function questionHasAlternatives () {
  return latestGetResponse.alternatives && latestGetResponse.alternatives.length > 0
}
