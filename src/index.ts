import dotenv from 'dotenv'
import http from 'http'
import express from 'express'
import path from 'path'
import "./core/db"
import createRoutes from './core/routes'
import createSocket from './core/socket'
dotenv.config()

const app = express();
const server = http.createServer(app);
const io = createSocket(server)

createRoutes(app, io)

app.use(express.static(path.join(__dirname, 'view')));
app.get('/*', function (_, res) {
  res.sendFile(path.join(__dirname, 'view', 'index.html'));
});

server.listen(process.env.PORT, () => {
  console.log(`Server: http://localhost:${process.env.PORT}`)
})