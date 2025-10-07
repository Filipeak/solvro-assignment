if (process.env.NODE_ENV != "production") {
    require('dotenv').config();
}

const express = require('express');
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));

app.use("/cocktails", require("./routes/cocktails"));
app.use("/ingredients", require("./routes/ingredients"));

app.listen(process.env.PORT, () => {
    console.log(`Listening on port ${process.env.PORT}`);
});