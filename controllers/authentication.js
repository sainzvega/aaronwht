const jwt = require('jwt-simple');
const bcrypt = require('bcrypt-nodejs');
const Member = require('../models/member');
const config = require('../config');

function tokenForMember(member) {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: member.id, iat: timestamp }, config.secret);
}

module.exports.signin = (req, res) => {
  // Member has already had their email and password auth'd
  // We just need to give them a token
  const { email } = req.body;
  const { password } = req.body;

  Member.findOne({ email }, (err, member) => {
    if (err) throw Error(err);

    if (member) {
      if (!member.active) return res.status(422).send({ error: 'There is a problem with your account' });

      const hashedPassword = bcrypt.hashSync(password, member.salt);
      if (member.password !== hashedPassword) return res.status(422).send({ error: 'Email or Password was incorrect' });

      return res.send({ token: tokenForMember(member) });
    }
    return res.status(422).send({ error: 'Email or Password was incorrect' });

  });
};

module.exports.signup = (req, res) => {
  const { email } = req.body;
  const { password } = req.body;

  if (!email || !password) {
    return res.status(422).send({ error: 'You must provide email and password' });
  }

  // See if a member with the given email exists
  Member.findOne({ email }, (err, existingMember) => {
    if (err) throw Error(err);

    // If a member with email does exist, return an error
    if (existingMember) {
      return res.status(422).send({ error: 'Email is in use' });
    }

    let active = false;
    if (email === process.env.email) active = true;

    const salt = bcrypt.genSaltSync(10);

    // If a member with email does NOT exist, create and save member record
    const member = new Member({
      email,
      password,
      active,
      salt,
    });

    member.save((saveErr) => {
      if (saveErr) throw Error(saveErr);

      // Repond to request indicating the member was created
      res.json({ token: tokenForMember(member) });
    });
  });
};
