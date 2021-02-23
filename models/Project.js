const { Schema, model } = require('mongoose');

const StatusSchema = new Schema({
  title: {
    type: String,
  },
  color: {
    type: String,
  },
});

const SprintSchema = new Schema({
  start: {
    type: Date,
  },
  end: {
    type: Date,
  },
  target: {
    type: String,
  },
  review: {
    type: String,
    default: '',
  },
  retrospective: {
    type: String,
    default: '',
  },
});

const TaskSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    storyPoints: {
      type: Number,
      default: 1,
    },
    label: {
      type: String,
      enum: ['gray', 'red', 'orange', 'yellow', 'green', 'teal', 'blue', 'cyan', 'purple', 'pink'],
      default: 'gray',
    },
    location: {
      type: String,
      enum: ['BACKLOG', 'SPRINTPLAN', 'SPRINT', 'COMPLETED'],
      default: 'BACKLOG',
    },
    status: {
      type: Schema.Types.ObjectId,
      ref: 'statuses',
    },
    sprintCompleted: {
      type: Schema.Types.ObjectId,
      ref: 'sprints',
    },
    members: [
      {
        _id: false,
        user: {
          type: Schema.Types.ObjectId,
          ref: 'users',
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
        role: {
          type: String,
          enum: ['Admin', 'Product Owner', 'Scrum Master', 'Developer'],
          default: 'Admin',
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
    sprints: [SprintSchema],
    sprintOngoing: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Project = model('project', ProjectSchema);
