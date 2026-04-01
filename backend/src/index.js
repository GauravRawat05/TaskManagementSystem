import dotenv from 'dotenv';
import connectDB from './db/index.js';
import socketHandler from './sockets/socketHandler.js';
import app from './app.js';
import http from 'http';

dotenv.config({
    path: './.env'
})

const server = http.createServer(app)

const port = process.env.PORT || 5002

connectDB().then(()=>{
      socketHandler(server)
      server.listen(port,()=>{

      })
}).catch((error)=>{
      console.error(error.messge || "something wen't wrong when database connection")
})



