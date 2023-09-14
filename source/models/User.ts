  // src/models/User.ts
import { Model, DataTypes } from 'sequelize';
const sequelize = require("../database/sequelize")


class User extends Model {
  public EMP_ID!: string;
  public FirstName!: string;
  public LastName!: string;
  public Number!: string;
  public Employee_Email!: string;
  public Password!: string;
  public is_admin!: boolean;
  public is_activated!:boolean;
}
User.init(
  {
    EMP_ID: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    FirstName: {
      type: DataTypes.STRING
    },
    LastName: {
      type: DataTypes.STRING
    },
    Number: {
      type: DataTypes.STRING
    },
    Employee_Email: {
      type: DataTypes.STRING,
      unique:true
    },
    Password: {
      type: DataTypes.STRING
    },
    is_admin: {
      type: DataTypes.BOOLEAN,
      defaultValue:false
    },
    is_activated: {
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
