const path = require('path');
const request = require('supertest');

require('dotenv').config({
    path: path.resolve(process.cwd(), '.env.test')
});

const app = require('../../server');
const models = require('../../models');

global.methods = {
    post: (url, body) => {
        const httpRequest = request.agent(app).post(url);
        httpRequest.send(body);
        httpRequest.set('Accept', 'application/json');

        return httpRequest;
    },

    get: (url, headers) => {
        const httpRequest = request.agent(app).get(url);
        httpRequest.set('Accept', 'application/json');

        Object.keys(headers).forEach(header => {
            httpRequest.set(header, headers[header]);
        });

        return httpRequest;
    }
};


global.beforeAll((done) => {
    app.on("appStarted", async function() {

        //clear all tables from test-db
        await models.sequelize.sync();
        await models.User.destroy({ where: {} });
        await models.Book.destroy({ where: {} });
        await models.Institution.destroy({ where: {} });

        //insert test data
        let testData = require('../../mock-data/test.json');
        for (let item of testData) {
            await models[item.type].create(item);
        }

        let books = await models.Book.findAll();
        let institutions = await models.Institution.findAll();
        for (let institution of institutions) {
            await institution.setBooks(books);
        }

        done();
    });
});


global.afterAll((done) => {
    app.close(done);
});
