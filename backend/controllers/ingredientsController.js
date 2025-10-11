const db = require("../database/firestoreController").getDatabase();
const COLLECTION_NAME = "ingredients";

module.exports.get = async (req, res) => {
    const result = await db.collection(COLLECTION_NAME).doc(req.params.id).get();

    if (result.exists) {
        return res.status(200).json(result.data());
    }
    else {
        return res.status(404).send("Ingredient with given id not found");
    }
};

module.exports.create = async (req, res) => {
    if ((await db.collection(COLLECTION_NAME).doc(req.params.id).get()).exists) {
        return res.status(400).send("Ingredient with given id already exists");
    }

    const name = req.body.name?.toString();
    const description = req.body.description?.toString();
    const isAlcoholic = req.body.isAlcoholic;
    const photoUrl = req.body.photoUrl?.toString();

    if (name == null || name == "" || description == null || description == "" || (isAlcoholic != true && isAlcoholic != false) || photoUrl == null || photoUrl == "" || !vaidateUrl(photoUrl)) {
        return res.status(400).send("Invalid request body");
    }

    await db.collection(COLLECTION_NAME).doc(req.params.id).set({
        name: name,
        description: description,
        isAlcoholic: isAlcoholic,
        photoUrl: photoUrl,
        createdAt: new Date().toISOString(),
    });

    return res.status(200).send("Ingredient added successfully");
};

module.exports.update = async (req, res) => {
    if (!(await db.collection(COLLECTION_NAME).doc(req.params.id).get()).exists) {
        return res.status(400).send("Ingredient with given id does not exist");
    }

    const name = req.body.name?.toString();
    const description = req.body.description?.toString();
    const isAlcoholic = req.body.isAlcoholic;
    const photoUrl = req.body.photoUrl?.toString();

    if (name == null || name == "" || description == null || description == "" || (isAlcoholic != true && isAlcoholic != false) || photoUrl == null || photoUrl == "" || !vaidateUrl(photoUrl)) {
        return res.status(400).send("Invalid request body");
    }

    await db.collection(COLLECTION_NAME).doc(req.params.id).update({
        name: name,
        description: description,
        isAlcoholic: isAlcoholic,
        photoUrl: photoUrl,
    });

    return res.status(200).send("Ingredient changed successfully");
};

module.exports.delete = async (req, res) => {
    if (!(await db.collection(COLLECTION_NAME).doc(req.params.id).get()).exists) {
        return res.status(400).send("Ingredient with given id does not exist");
    }

    await db.collection(COLLECTION_NAME).doc(req.params.id).delete();

    return res.status(200).send("Ingredient deleted successfully");
};

module.exports.getAll = async (req, res) => {
    const limit = req.query.limit || 10;
    const offset = req.query.offset || 0;
    const order = req.query.order || "asc";
    const orderBy = req.query.orderBy || "name";

    if (isNaN(limit) || limit < 1 || limit > 50) {
        return res.status(400).send("Invalid limit query parameter");
    }

    if (isNaN(offset) || offset < 0) {
        return res.status(400).send("Invalid offset query parameter");
    }

    if (!["asc", "desc"].includes(order)) {
        return res.status(400).send("Invalid order query parameter");
    }

    if (!["name", "isAlcoholic", "createdAt"].includes(orderBy)) {
        return res.status(400).send("Invalid orderBy query parameter");
    }

    const result = await db.collection(COLLECTION_NAME).orderBy(orderBy, order).offset(parseInt(offset)).limit(parseInt(limit)).get();

    return res.status(200).json(result.docs.map(doc => { return { id: doc.id, ...doc.data() } }));
};

// REF: https://stackoverflow.com/a/8234912
function vaidateUrl(url) {
    return url.match(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/);
}