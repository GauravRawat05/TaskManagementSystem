import mongoose from "mongoose";

const connectDB = async() =>{
  try {
      const promise = await mongoose.connect(`${process.env.MONGOURI}/${process.env.APP_NAME}`)
        console.log(`MONGODB_URI : `, promise.connections[0]._connectionString);
      return promise
  } catch (error) {
        process.exit(1)
  }
}

export default connectDB
