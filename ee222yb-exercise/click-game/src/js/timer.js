export class Timer {
  constructor () {
    this.startTime = 0
    this.totalTime = 0
  }

  start () {
    this.startTime = new Date().getTime()
  }

  stop () {
    this.totalTime = new Date().getTime() - this.startTime
  }

  getTime () {
    return new Date().getTime() - this.startTime
  }
}
