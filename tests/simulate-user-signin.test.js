describe('Sign In', () => {
    let demoUser = require('../mock-data/test.json').find(u => (u.type === 'User'));

    it('succeeds with correct credentials', async () => {
        const response = await methods.post(`/users/signin`, demoUser).expect(200);
        expect(response.body.data.token).toBeDefined();
    });

    it('fails with invalid credentials', async () => {
        const user = { email:'invalid-email@mycompany.com', password: '123456'};
        await methods.post(`/users/signin`, user).expect(401);
    });

    it('fails with missing credentials', async () => {
        const user = {};
        await methods.post(`/users/signin`, user).expect(401);
    });
});
