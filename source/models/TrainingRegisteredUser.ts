import { Model, DataTypes } from 'sequelize';
const sequelize = require("../database/sequelize")

class TrainingRegisteredUser extends Model {

  public email!: string;
  public firstName!: string;
  public lastName!: string;
  public trainingTitle!: string;
  public mobileNumber!: string;
  public registeredDateTime!: string;
  public isDisabled!: boolean;

}

TrainingRegisteredUser.init(
  {
    email: {
      type: DataTypes.STRING
    },
    firstName: {
      type: DataTypes.STRING
    },
    lastName: {
      type: DataTypes.STRING
    },
    trainingTitle: {
      type: DataTypes.STRING
    },
    mobileNumber: {
      type: DataTypes.STRING
    },
    registeredDateTime: {
      type: DataTypes.DATE,
    },
    isDisabled: {
      type: DataTypes.BOOLEAN,
      defaultValue:false
    }
    
  },
  {
    tableName: 'TrainingRegisteredUser',
    sequelize,
  }
);

export { TrainingRegisteredUser };
