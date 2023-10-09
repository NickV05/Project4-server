import { model, Schema } from "mongoose";
const emailSchema = new Schema({ email: {
        type: String,
        unique: true,
        required: true
    } }, {
    timestamps: true
});
export default model("Email", emailSchema);
