// based on https://github.com/bradtraversy/devconnector_2.0/blob/master/models/User.js

const { Schema, model } = require('mongoose');

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    default: '',
  },
  verified: {
    type: Boolean,
    default: false,
  },
  projects: [
    {
      type: Schema.Types.ObjectId,
      ref: 'project',
    },
  ],
});

module.exports = User = model('user', UserSchema);
