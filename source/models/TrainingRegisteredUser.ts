import { Model, DataTypes } from 'sequelize';
const sequelize = require("../database/sequelize")

class TrainingRegisteredUser extends Model {

  public Email!: string;
  public Firstname!: string;
  public Lastname!: string;
  public trainingTitle!: string;
  public MobileNumber!: string;
  public RegisteredDateTime!: string;

}

TrainingRegisteredUser.init(
  {
    Email: {
      type: DataTypes.STRING
    },
    Firstname: {
      type: DataTypes.STRING
    },
    Lastname: {
      type: DataTypes.STRING
    },
    trainingTitle: {
      type: DataTypes.STRING
    },
    MobileNumber: {
      type: DataTypes.STRING
    },
    RegisteredDateTime: {
      type: DataTypes.DATE,
    },
    is_disabled: {
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
