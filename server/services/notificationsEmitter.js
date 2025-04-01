const EventEmitter = require('events')
class notificationsEventEmitter extends EventEmitter {}
const notificationsEmitter =  new notificationsEventEmitter()

module.exports = notificationsEmitter