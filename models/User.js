const bcrypt = require('bcryptjs');
var Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {

    let InstitutionModel = undefined;

    class User extends Sequelize.Model {

        static associate(models) {
            InstitutionModel = models.Institution;
            models.User.belongsTo(models.Institution);
        }

        verifyPassword(password) {
            return (password && bcrypt.compareSync(password, this.password));
        }
    }

    User.init({
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: '',
            validate: {notEmpty: {msg: 'Please enter a valid name.'}}
        },

        email: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: '',
            unique: {
                msg: 'This email is already taken.',
                fields: ['email']
            },
            validate: {isEmail: {msg: 'Please enter a valid email address.'}}
        },

        role: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: '',
            validate: {
                isIn: {
                    args: [['student', 'academic', 'administrator']],
                    msg: 'Role must be one of student, academic or administrator.'
                }
            }
        },

        password: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: '',
            validate: {notEmpty: {msg: 'Please enter a password.'}}
        }

    }, {sequelize});


    User.beforeCreate((user, options) => {

        return bcrypt.hash(user.password, 10)
            .then(hash => {
                user.password = hash;
            });
    });


    User.afterValidate((user, options) => {

        let domain = user.email.replace(/.*@/, "");
        if (!domain) {
            throw new Error('Cannot extract domain from email address.');
        }

        return InstitutionModel.findOne({where: {domain: domain}})
            .then(institution => {
                if (!institution) {
                    throw new Error('No institution found with the domain specified.');
                }

                user.InstitutionId = institution.id;
            });
    });

    return User;
};
