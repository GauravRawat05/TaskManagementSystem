import { Server } from "socket.io"

let io;

const socketHandler = (server) => {

  io = new Server(server, {
      cors : {
          origin : process.env.CORS,
          methods : ["GET", "POST"],
          credentials : true
      }
  } )

  const  onlineUser = {};


   io.on("connection", (socket) => {

        // Register User
        socket.on("registerUser", (userId)=>{
            onlineUser[userId]  = socket.id

        })


        // Assign Task
        socket.on("assignTask", (data)=>{
          const { internId, task } = data;

          const interScoket = onlineUser[internId]

          if(interScoket){
                 io.to(interScoket).emit("taksAssigned", task)
          }
        })

          // disconnect
          socket.io("disconnect",()=>{

              for(const userId in onlineUser) {
                if(onlineUser[userId] === socket.id) {
                  delete onlineUser[userId]
                }
              }
          })
   })

}

export default socketHandler
