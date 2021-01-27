const { Schema, model } = require('mongoose');

const StatusSchema = new Schema({
  title: {
    type: String,
  },
  color: {
    type: String,
  },
});

const TaskSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    location: {
      type: String,
      enum: ['BACKLOG', 'SPRINTPLAN', 'SPRINT'],
      default: 'BACKLOG',
    },
    status: {
      type: Schema.Types.ObjectId,
      ref: 'statuses',
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
    tasks: [TaskSchema],
    statuses: {
      type: [StatusSchema],
      default: [
        { title: 'To Do', color: 'red' },
        { title: 'Doing', color: 'yellow' },
        { title: 'Done', color: 'green' },
      ],
    },
    sprint: {
      _id: false,
      start: {
        type: Date,
      },
      end: {
        type: Date,
      },
      goals: {
        type: String,
      },
      done: {
        type: Boolean,
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Project = model('project', ProjectSchema);
