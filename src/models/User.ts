import { InferSchemaType, model, Schema } from "mongoose";

const userSchema = new Schema(
    {
    email: { 
        type: String, 
        unique: true, 
        required: true },
    password: { 
        type: String, 
        required: true },
    fullName: { 
        type: String, 
        required: true },
    location: { 
        type: String, 
        required: true },
    username: { 
        type: String, 
        required: true },
    image:{
        type:String,
        default:'https://res.cloudinary.com/dyto7dlgt/image/upload/v1691526692/project3/avatar_h1b0st.jpg'
    },
    },
    {
        timestamps:true
    }
  );

type User = InferSchemaType<typeof userSchema>;

export default model<User>("User", userSchema);