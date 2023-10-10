import mongoose, { connect } from "mongoose";

const connectDB = async () => {
    try {
        
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log(`DB Connected`);

    } catch (error) {
        console.log(`Error while connecting to MongoDB : ${error}`);
    }
}

export default connectDB;