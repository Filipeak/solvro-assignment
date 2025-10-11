const { expect, test } = require('@jest/globals');
const ingredientsController = require("../controllers/ingredientsController");


test("getAll", async () => {
    let responseCode = 0;

    await ingredientsController.getAll({ query: {} }, {
        status: function (code) {
            responseCode = code;

            return { send: () => { }, json: () => { } }
        }
    });

    expect(responseCode).toBe(200);
});