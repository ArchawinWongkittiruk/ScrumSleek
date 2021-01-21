const { Schema, model } = require('mongoose');

const ProjectSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    members: [
      {
        _id: false,
        user: {
          type: Schema.Types.ObjectId,
          ref: 'users',
        },
        name: {
          type: String,
          required: true,
        },
        role: {
          type: String,
          default: 'admin',
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = Project = model('project', ProjectSchema);
