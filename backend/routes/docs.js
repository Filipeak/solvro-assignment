const express = require('express');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');

const router = express.Router();

const swaggerDocs = swaggerJsDoc({
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Cocktails API",
            version: '1.0.0',
        },
    },
    apis: ["./routes/cocktails.js", "./routes/ingredients.js"],
});

router.use("/", swaggerUI.serve, swaggerUI.setup(swaggerDocs, {
    customSiteTitle: "Cocktails API Docs",
}));

module.exports = router;