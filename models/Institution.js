var Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {

    class Institution extends Sequelize.Model {

        static associate(models) {
            models.Institution.hasMany(models.User);
            models.Institution.belongsToMany(models.Book, {
                foreignKey: { name: 'InstitutionId', allowNull: false },
                through: 'InstitutionBooks'
            });
        }
    }

    Institution.init({
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: '',
            validate: {notEmpty: { msg: 'Specify a valid name for the institution.'} }
        },

        url: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: '',
            validate: {isUrl: { msg: 'Specify a valid institution URL.'} }
        },

        domain: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: '',
            unique: {
                msg: 'This domain is already taken.',
                fields: ['domain']
            },
            validate: {
                notEmpty: {msg: 'Specify an insitution domain.'},
                isDomain(string) {
                    if (!/^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/.test(string)) {
                        throw new Error('Specify a valid institution domain.');
                    }
                }
            }
        }

    }, {sequelize});

    return Institution;
};
