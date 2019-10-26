require('dotenv').config();
const models = require('./models');

Promise.resolve()
    .then(async() => {

        //create database tables
        await models.sequelize.sync();

       //insert mock-data if not production
       let booksCount = await models.Book.count();
       if (booksCount === 0 && process.env.NODE_ENV !== 'production') {

           let data = require('./mock-data/development.json');
           for (let item of data) {
               await models[item.type].create(item);
           }

           //merge all books with all institutions
           let books = await models.Book.findAll();
           let institutions = await models.Institution.findAll();
           for (let institution of institutions) {
               await institution.setBooks(books);
           }
       }
    });
