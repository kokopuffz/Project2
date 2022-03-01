'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class catpic extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.catpic.hasMany(models.caption)
      models.catpic.hasMany(models.alttext)
    }
  }
  catpic.init({
    imgurl: DataTypes.STRING,
    picid: DataTypes.STRING,
    alttext: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'catpic',
  });
  return catpic;
};