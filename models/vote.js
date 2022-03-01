"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class vote extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.vote.belongsTo(models.user);
      models.vote.belongsTo(models.caption);
    }
  }
  vote.init(
    {
      userId: DataTypes.INTEGER,
      captionId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "vote",
    }
  );
  return vote;
};
