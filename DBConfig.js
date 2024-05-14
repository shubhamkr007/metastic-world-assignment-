import mongoose from 'mongoose';

const connectDB = async ()=>{
    try{
        await mongoose.connect("mongodb+srv://Shubham:Zvfn3E5O6a0310YH@cluster0.zqyvbkp.mongodb.net/Assignment?retryWrites=true&w=majority");
        console.log(`connected to MongoDb ${mongoose.connection.host}`)
    }catch(err){
        console.log(`MongoDb database error: ${err}`);
    }
}

export default connectDB;
