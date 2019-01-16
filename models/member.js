const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

// Define our model
const memberSchema = new Schema({
  email: { type: String, unique: true, lowercase: true },
  password: String,
  salt: String,
  active: Boolean
});

// On Save Hook, encrypt password
// Before saving a model, run this function
memberSchema.pre('save', (next) => {
  // get access to the member model
  const member = this;
  const salt = bcrypt.genSaltSync(10);
  member.password = bcrypt.hashSync(member.password, salt);
  member.salt = salt;
  next();
});

memberSchema.methods.comparePassword = (candidatePassword, callback) => {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    if (err) { return callback(err); }

    callback(null, isMatch);
  });
}

// Create the model class
const ModelClass = mongoose.model('member', memberSchema);

// Export the model
module.exports = ModelClass;