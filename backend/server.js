if (process.env.NODE_ENV != "production") {
    require('dotenv').config();
}

const admin = require("firebase-admin");
const serviceAccount = require("./keys/firebaseServiceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});


const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));

app.use("/cocktails", require("./routes/cocktails"));
app.use("/ingredients", require("./routes/ingredients"));

app.use((err, req, res, next) => {
    console.error(err.stack);

    res.status(500).send("Unexpected error occured!");
});

app.listen(process.env.PORT, () => {
    console.log(`Listening on port ${process.env.PORT}`);
});