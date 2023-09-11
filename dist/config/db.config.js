"use strict";
module.exports = {
    HOST: "localhost",
    USER: "postgres",
    PASSWORD: "Narendra@1301",
    DB: "l&d",
    dialect: "postgres",
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
};
