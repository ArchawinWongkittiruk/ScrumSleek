const { Schema, model } = require('mongoose');

const chakraColors = [
  'gray',
  'red',
  'orange',
  'yellow',
  'green',
  'teal',
  'blue',
  'cyan',
  'purple',
  'pink',
];

const StatusSchema = new Schema({
  title: {
    type: String,
  },
  color: {
    type: String,
    enum: chakraColors,
    default: 'gray',
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
      enum: chakraColors,
      default: 'gray',
    },
    location: {
      type: String,
      enum: ['BACKLOG', 'SPRINTPLAN', 'SPRINT', 'COMPLETED'],
      default: 'BACKLOG',
    },
    status: {
      type: Schema.Types.ObjectId,
      ref: 'status',
    },
    sprintCompleted: {
      type: Schema.Types.ObjectId,
      ref: 'sprint',
    },
    members: [
      {
        _id: false,
        user: {
          type: Schema.Types.ObjectId,
          ref: 'user',
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
          ref: 'user',
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
    velocityLimited: {
      type: Boolean,
      default: false,
    },
    velocityLimit: {
      type: Number,
      default: 0,
    },
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
