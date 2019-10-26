describe('Get books', () => {
    let demoUser = require('../mock-data/test.json').find(u => (u.type === 'User'));

    it('succeeds with correct credentials', async () => {
        const authResponse = await methods.post(`/users/signin`, demoUser).expect(200);
        let authorizationToken = authResponse.body.data.token;

        const booksResponse = await methods.get(`/books`, {
            Authorization: `Bearer ${authorizationToken}`
        }).expect(200);

        let actualBooks = require('../mock-data/test.json').filter(u => (u.type === 'Book'));
        expect(booksResponse.body.data.books).toHaveLength(actualBooks.length);
    });

    it('fails with invalid credentials', async () => {
        const booksResponse = await methods.get(`/books`, {
            Authorization: `Some Random String`
        }).expect(401);
    });
});

