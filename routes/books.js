const _ = require('lodash');
const models = require('../models');
const router = require('express').Router();
const passport = require('../auth/passport');
const asyncMiddleware = require('../middleware/asyncMiddleware');

router.get('/', passport.authenticate('jwt', {session: false}), asyncMiddleware(async function(req, res, next) {

  let institution = await models.Institution.findByPk(req.user.InstitutionId);
  let books = await institution.getBooks();

  res.send({
    status : "success",
    data: {
      books: books.map(book => _.pick(book, ['id', 'isbn', 'title', 'author']))
    }
  });
}));

module.exports = router;
