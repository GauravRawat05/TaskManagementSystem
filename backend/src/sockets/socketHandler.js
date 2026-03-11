import { Server } from "socket.io"

let io;

const socketHandler = (server) => {

  io = new Server(server, {
      cors : {
          origin : '*',
          methods : ["GET", "POST"]
      }
  } )

  const  onlineUser = {};


   io.on("connection", (socket) => {
        console.log("a user connected", socket.id);


        // Register User
        socket.on("registerUser", (userId)=>{
            onlineUser[userId]  = socket.id
            console.log("online User" , userId);
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
              console.log("user disconnect");

              for(const userId in onlineUser) {
                if(onlineUser[userId] === socket.id) {
                  delete onlineUser[userId]
                }
              }
          })
   })

}

export default socketHandler
