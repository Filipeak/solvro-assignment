const { expect, test } = require('@jest/globals');
const cocktailsController = require("../controllers/cocktailsController");


test("getAll", async () => {
    let responseCode = 0;

    await cocktailsController.getAll({ query: {} }, {
        status: function (code) {
            responseCode = code;

            return { send: () => { }, json: () => { } }
        }
    });

    expect(responseCode).toBe(200);
});