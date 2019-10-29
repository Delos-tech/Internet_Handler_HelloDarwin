const Sequelize = require('sequelize');
// const sequelize = require('../sequelizeSingleton');

module.exports = (sequelize) => {
    return sequelize.define('mapping', {
        sender_id: {
            type: Sequelize.STRING,
            primaryKey: true
        },
        translator_id: {
            type: Sequelize.STRING,
            allowNull: false
        }
    })
}
