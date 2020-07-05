/**
 * Module for the team routes.
 *
 * @author Mats Loock
 * @version 1.0.0
 */

'use strict'

const teamController = require('../controllers/teamController')
const express = require('express')
const router = express.Router()

// /teams?q=
router.get('/', (req, res) => teamController.list(req, res))

// /teams/:id
router.get('/:id', (req, res) => teamController.get(req, res))

module.exports = router
