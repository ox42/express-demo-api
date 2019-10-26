const _ = require('lodash');
const models = require('../models');
const jwt = require('jsonwebtoken');
const router = require('express').Router();
const passport = require('../auth/passport');
const asyncMiddleware = require('../middleware/asyncMiddleware');


router.post('/signin', asyncMiddleware(async function(req, res, next) {

  passport.authenticate('local', {session: false}, (err, user, info) => {

    if (err || !user) {
      return res.status(401).json({
        status: 'fail',
        data: {
          message: 'Invalid username or password.'
        }
      });
    }

    req.login(user, {session: false}, () => {

      const token = jwt.sign(_.pick(user, ['id']), process.env.secret_key);
      return res.json({
        status: 'success',
        data: {
          token
        }
      });
    });
  })(req, res);

}));


router.post('/create', asyncMiddleware(async function(req, res, next) {

  try {
    let user = await models.User.create(
        _.pick(req.body, ['name', 'role', 'email', 'password'])
    );

    return res.send({
      status: 'success',
      data: {
        user: _.pick(user.get(), ['id', 'name', 'role', 'email', 'InstitutionId'])
      }
    });

  } catch (err) {

    return res.status(400).send({
      status: 'fail',
      data: {
        errors: (_.isString(err.message) ? err.message.split('\n') : [ 'Invalid data.' ])
      }
    });
  }
}));

module.exports = router;
