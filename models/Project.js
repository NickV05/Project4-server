const {Schema, model} =require('mongoose');

const projectSchema = new Schema(
    {
        image: String,
        link: String,
        title: String,
        description: String
    },
    {
        timestamps: true
    }
)

module.exports = model('Project', projectSchema)