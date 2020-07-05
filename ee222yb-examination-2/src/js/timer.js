const strings = {
  timerAlreadyStarted: 'Timer is already started',
  timerNotStarted: 'Timer is not started'
}

export default class Timer {
  constructor (seconds) {
    this._startTime = 0
    this._lapTime = 0
    this._timeLeft = seconds * 1000
    this._isStarted = false
    this._totalTime = 0
  }

  start () {
    if (!this._isStarted) {
      this._startTime = new Date().getTime()
      this._isStarted = true
    }
    this._lapTime = new Date().getTime()
  }

  stop () {
    this._verifyStarted(true)
    this._totalTime += new Date().getTime() - this._lapTime
  }

  getTotalTimeElapsed () {
    return format(this._totalTime)
  }

  getTimeLeft () {
    return format(this._lapTime + this._timeLeft - new Date().getTime())
  }

  _verifyStarted (started) {
    if (this._isStarted !== started) {
      throw new Error(started ? strings.timerNotStarted : strings.timerAlreadyStarted)
    }
  }
}

function format (time) {
  return time / 1000
}
