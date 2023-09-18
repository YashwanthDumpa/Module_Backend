import { Model, DataTypes } from 'sequelize';
const sequelize = require("../database/sequelize")

class Notification extends Model {
  public trainingTitle!: string;
  public description!: string;
  public limit!: string;
}

Notification.init(
  {
    trainingTitle: {
      type: DataTypes.STRING,
      primaryKey:true
    },
    description: {
      type: DataTypes.STRING
    },
    limit: {
      type: DataTypes.INTEGER,
    }
  },
  {
    tableName: 'Notification',
    sequelize,
  }
);

export { Notification };
