import http from 'http'
import socket from 'socket.io'

export default (http: http.Server) => {
  
  //var allowedOrigins = "http://localhost:3000 http://127.0.0.1:3000";
  const io = socket(http)
  return io
}