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
  projects: [
    {
      type: Schema.Types.ObjectId,
      ref: 'projects',
    },
  ],
});

module.exports = User = model('user', UserSchema);
