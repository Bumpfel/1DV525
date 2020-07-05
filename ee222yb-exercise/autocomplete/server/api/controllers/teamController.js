/**
 * Module for the team controller.
 *
 * @author Mats Loock
 * @version 1.0.0
 */

'use strict'

/**
 * Immutable array of teams.
 */
const teams = Object.freeze(require('./teams.json').sort((a, b) => a.name.localeCompare(b.name)))

/**
 * Sends a JSON response containing teams (based on the search
 * criteria specified by the query parameter q).
 *
 * @param {Object} req Node.js request object
 * @param {Object} res Node.js response object
 */
module.exports.list = (req, res) => {
  console.log('\n', req.originalUrl)

  // If a query is present filter the teams.
  let result = teams
  if (req.query.q) {
    const regexp = new RegExp(req.query.q, 'i')
    result = result.filter(team => regexp.test(team.name))
  }
  result = result.map(team => { return {id: team.id, name: team.name} })

  // Send json response with teams - if any.
  console.log(`Found ${result.length} team${result.length !== 1 ? 's' : ''}.`)
  res.json({
    query: req.query.q,
    count: result.length,
    teams: result
  })
}

/**
 * Sends a JSON response containing a team.
 *
 * @param {Object} req Node.js request object
 * @param {Object} res Node.js response object
 */
module.exports.get = (req, res) => {
  console.log('\n', req.originalUrl)

  let id = Number(req.params.id)

  // If the parameter id isn't an integer greater than 0 send a 400 (bad request).
  if (!id || Number.isNaN(id) || !Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      status: 400,
      message: 'Bad Request'
    })
  }

  // Get the first team that's id equals the parameter id.
  let team = teams.filter(team => team.id === id).shift()

  // If no team is found send a 404 (resource not found).
  if (!team) {
    return res.status(404).json({
      status: 404,
      message: 'Not Found'
    })
  }

  // Send json response with the wanted team.
  console.log(`Found ${team.name} with id ${team.id}.`)
  res.json(team)
}
