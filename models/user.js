'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.user.hasMany(models.caption, {onDelete: 'cascade' })
      models.user.hasMany(models.alttext, {onDelete: 'cascade' })
      models.user.hasMany(models.vote, {onDelete: 'cascade' })
    }
  }
  user.init({
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    username: {
      type: DataTypes.STRING,
      allowNull:false,
      unique:true
    }
  }, {
    sequelize,
    modelName: 'user',
  });
  return user;
};