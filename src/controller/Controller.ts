import socket from 'socket.io'

export default class Controller {
  io: socket.Server
  constructor(io: socket.Server){
    this.io = io
  }
}