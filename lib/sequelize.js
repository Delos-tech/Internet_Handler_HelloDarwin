const Sequelize = require('sequelize');
const MappingModel = require('./mapping');

const sequelize = new Sequelize('hellodarwin', 'root', 'root', {
    host: 'localhost',
    dialect: 'sqlite',
    pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

const Mapping = MappingModel(sequelize, Sequelize);

sequelize.sync({ force: true })
    .then(() => {
    console.log(`Database & tables created!`)
});

module.exports = {
    Mapping
};
