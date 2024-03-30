import mongoose from "mongoose";

export const dbconnect= () =>{
    mongoose.connect
    (process.env.MONGO_URI,{dbName:"wysaChat"})
    .then((c)=>console.log(`Database connected with ${c.connection.host}`))
    .catch(err=>console.log(err))   
}