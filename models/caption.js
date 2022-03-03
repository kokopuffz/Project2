'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class caption extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.caption.belongsTo(models.user)
      models.caption.belongsTo(models.catpic)
      models.caption.hasMany(models.vote)
    }
  }
  caption.init(
    {
      text: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      },
    },
    {
      sequelize,
      modelName: "caption",
    }
  );
  return caption;
};