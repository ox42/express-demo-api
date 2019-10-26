describe('Create', () => {
    it('succeeds with valid data', async () => {
        let demoInstitution = require('../mock-data/test.json').find(u => (u.type === 'Institution'));
        let demoUser = {
            name: 'Mark Jackson',
            email: 'mark.jackson@' + demoInstitution.domain,
            role: 'administrator',
            password: 'some-random-password'
        };

        const response = await methods.post(`/users/create`, demoUser).expect(200);
        expect(response.body.data.user.name).toBe('Mark Jackson');
    });

    it('fails with invalid data', async () => {
        let demoUser = { someProperty: 'some-random-value' };
        await methods.post(`/users/create`, demoUser).expect(400);
    });

    it('fails with invalid domain', async () => {
        let demoUser = {
            name: 'Mark Jackson',
            email: 'mark.jackson@' + 'some-random-domain.ec',
            role: 'administrator',
            password: 'some-random-password'
        };

        let response = await methods.post(`/users/create`, demoUser).expect(400);
        expect(response.body.status).toBe('fail');
        expect(response.body.data.errors.join('')).toMatch(/No institution found with the domain specified/);
    });
});
