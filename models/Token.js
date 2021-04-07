// from https://gist.github.com/Sohan022/4bfd6ca8623a5a004367d70b044a958e#file-tokenschema-js

const { Schema, model } = require('mongoose');

const TokenSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user',
  },
  token: {
    type: String,
    required: true,
  },
  expireAt: {
    type: Date,
    default: Date.now,
    index: { expires: 86400000 },
  },
});

module.exports = Token = model('token', TokenSchema);
