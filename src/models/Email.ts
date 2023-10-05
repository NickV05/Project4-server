import { InferSchemaType, model, Schema } from "mongoose";

const emailSchema = new Schema(
    {email: { 
        type: String, 
        unique: true, 
        required: true }},
    {
        timestamps:true
    }
  );

type Email = InferSchemaType<typeof emailSchema>;

export default model<Email>("Email", emailSchema);