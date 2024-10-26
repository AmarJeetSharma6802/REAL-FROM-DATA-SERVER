import mongoose from "mongoose";

const connectDB = async()=>{
   try {
     const connects = await mongoose.connect(`${process.env.MONGODB_URL}/${process.env.PRACTICE_DATA}`)
     console.log(`MongoDB Connected: ${connects.connection.host}`)
   } catch (error) {
    console.log('MONGODB connection FAILED ', error);
        process.exit(1);
   }
}

export default connectDB