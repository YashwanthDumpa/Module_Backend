  // src/models/User.ts
import { Model, DataTypes } from 'sequelize';
const sequelize = require("../database/sequelize")


class User extends Model {
  public empId!: string;
  public firstName!: string;
  public lastName!: string;
  public number!: string;
  public employeeEmail!: string;
  public password!: string;
  public isAdmin!: boolean;
  public isActivated!:boolean;
}
User.init(
  {
    empId: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    firstName: {
      type: DataTypes.STRING
    },
    lastName: {
      type: DataTypes.STRING
    },
    number: {
      type: DataTypes.STRING
    },
    employeeEmail: {
      type: DataTypes.STRING,
      unique:true
    },
    password: {
      type: DataTypes.STRING
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      defaultValue:false
    },
    isActivated: {
      type: DataTypes.BOOLEAN,
      defaultValue:false
    }
  },
  {
    tableName: 'Users',
    sequelize,
  }
);

export { User };
