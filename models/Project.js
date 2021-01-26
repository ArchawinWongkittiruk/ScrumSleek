const { Schema, model } = require('mongoose');

const TaskSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    status: {
      type: String,
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
      },
    ],
  },
  {
    timestamps: true,
  }
);

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
    backlog: [TaskSchema],
    sprint: {
      start: {
        type: Date,
      },
      end: {
        type: Date,
      },
      goals: {
        type: String,
      },
      tasks: [TaskSchema],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Project = model('project', ProjectSchema);
