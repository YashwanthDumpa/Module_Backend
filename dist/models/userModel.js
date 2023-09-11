"use strict";
module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("User", {
        EMP_ID: {
            type: Sequelize.STRING
        },
        FirstName: {
            type: Sequelize.STRING
        },
        LastName: {
            type: Sequelize.STRING
        },
        Number: {
            type: Sequelize.STRING
        },
        Employee_Email: {
            type: Sequelize.STRING
        },
        Password: {
            type: Sequelize.STRING
        },
        is_admin: {
            type: Sequelize.BOOLEAN,
            default: false
        }
    });
    return User;
};
