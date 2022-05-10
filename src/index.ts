import dotenv from 'dotenv'
import http from 'http'
import express from 'express'
import path from 'path'
import "./core/db"
import createRoutes from './core/routes'
import createSocket from './core/socket'
import { checkAuth } from './middlewares'
import cors from 'cors'

dotenv.config()

const app = express();

const corsOptions = {
  origin: process.env.ORIGIN_DEV,
  credentials: true
}

app.use(cors(corsOptions), express.json(), checkAuth, express.static(path.join(__dirname, 'static')))

const server = http.createServer(app);
const io = createSocket(server)

createRoutes(app, io)

app.use(express.static(path.join(__dirname, 'view')));
app.get('/*', function (_: any, res: any) {
  res.sendFile(path.join(__dirname, 'view', 'index.html'));
});

server.listen(process.env.PORT, () => {
  console.log(`Server: http://localhost:${process.env.PORT}`)
})