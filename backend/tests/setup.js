module.exports = async () => {
    if (process.env.NODE_ENV != "production") {
        require('dotenv').config();
    }

    require("../database/firestoreController");

    console.log("Test setup loaded!");
};