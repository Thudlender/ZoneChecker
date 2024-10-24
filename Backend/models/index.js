const sequelize = require("./db")
const Sequelize = require("sequelize");
const User = require("./user.model")
const Map = require("./Map.model");
const Role = require("./role.model");

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = User;
db.Role = Role;
db.Map = Map;

//Association
db.User.belongsToMany(db.Role, {
    through: "user_roles"
});

db.Role.belongsToMany(db.User, {
    through:"user_roles"
})

// User & Store Associations
db.User.hasMany(db.Map, { foreignKey: "adminId" });
db.Map.belongsTo(db.User, { foreignKey: "adminId" });


module.exports = db;