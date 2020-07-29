import http from 'http'
import socket from 'socket.io'

export default (http: http.Server) => {
  
  const io = socket(http)
  return io
}