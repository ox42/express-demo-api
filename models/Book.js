var Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {

    class Book extends Sequelize.Model {

        static associate(models) {
            models.Book.belongsToMany(models.Institution, {
                foreignKey: { name: 'BookId', allowNull: false },
                through: 'InstitutionBooks'
            });
        }
    }

    Book.init({
        isbn: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
            defaultValue: '',
            validate: { notEmpty: { msg: 'Please enter a valid ISBN number.'} }
        },

        title: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: '',
            validate: { notEmpty: { msg: 'Please enter a valid book title.'} }
        },

        author: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: '',
            validate: { notEmpty: { msg: 'Please enter a valid author for the book.'} }
        }

    }, {sequelize});

    return Book;
};
