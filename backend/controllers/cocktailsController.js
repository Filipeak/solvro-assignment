const { FieldPath } = require('firebase-admin/firestore');
const db = require("../database/firestoreController").getDatabase();
const COLLECTION_NAME = "cocktails";

module.exports.get = async (req, res) => {
    const result = await db.collection(COLLECTION_NAME).doc(req.params.id).get();

    if (result.exists) {
        return res.status(200).json(result.data());
    }
    else {
        return res.status(404).send("Cocktail with given id not found");
    }
};

module.exports.create = async (req, res) => {
    if ((await db.collection(COLLECTION_NAME).doc(req.params.id).get()).exists) {
        return res.status(400).send("Cocktail with given id already exists");
    }

    const name = req.body.name?.toString();
    const category = req.body.category?.toString();
    const recipe = req.body.recipe?.toString();
    const ingredients = req.body.ingredients;

    if (name == null || name == "" || category == null || category == "" || recipe == null || recipe == "" || !Array.isArray(ingredients) || ingredients.length == 0) {
        return res.status(400).send("Invalid request body");
    }

    const validIngredients = ingredients.map(i => { return { id: i?.id?.toString(), amount: i?.amount?.toString() } }).filter(i => i.id != null && i.id != "" && i.amount != null && i.amount != "");

    if (validIngredients.length != ingredients.length) {
        return res.status(400).send("Invalid request body");
    }

    const verificationQuery = await db.collection("ingredients").where(FieldPath.documentId(), "in", validIngredients.map(i => i.id)).get();

    if (verificationQuery.docs.length != validIngredients.length) {
        return res.status(401).send("One or more ingredients do not exist");
    }

    await db.collection(COLLECTION_NAME).doc(req.params.id).set({
        name: name,
        category: category,
        recipe: recipe,
        ingredients: validIngredients,
        createdAt: new Date().toISOString(),
    });

    return res.status(200).send("Cocktail added successfully");
};

module.exports.update = async (req, res) => {
    if (!(await db.collection(COLLECTION_NAME).doc(req.params.id).get()).exists) {
        return res.status(400).send("Cocktail with given id does not exist");
    }

    const name = req.body.name?.toString();
    const category = req.body.category?.toString();
    const recipe = req.body.recipe?.toString();
    const ingredients = req.body.ingredients;

    if (name == null || name == "" || category == null || category == "" || recipe == null || recipe == "" || !Array.isArray(ingredients) || ingredients.length == 0) {
        return res.status(400).send("Invalid request body");
    }

    const validIngredients = ingredients.map(i => { return { id: i?.id?.toString(), amount: i?.amount?.toString() } }).filter(i => i.id != null && i.id != "" && i.amount != null && i.amount != "");

    if (validIngredients.length != ingredients.length) {
        return res.status(400).send("Invalid request body");
    }

    const verificationQuery = await db.collection("ingredients").where(FieldPath.documentId(), "in", validIngredients.map(i => i.id)).get();

    if (verificationQuery.docs.length != validIngredients.length) {
        return res.status(401).send("One or more ingredients do not exist");
    }

    await db.collection(COLLECTION_NAME).doc(req.params.id).update({
        name: name,
        category: category,
        recipe: recipe,
        ingredients: validIngredients,
    });

    return res.status(200).send("Cocktail changed successfully");
};

module.exports.delete = async (req, res) => {
    if (!(await db.collection(COLLECTION_NAME).doc(req.params.id).get()).exists) {
        return res.status(404).send("Cocktail with given id does not exist");
    }

    await db.collection(COLLECTION_NAME).doc(req.params.id).delete();

    return res.status(200).send("Cocktail deleted successfully");
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

    if (!["name", "category", "createdAt"].includes(orderBy)) {
        return res.status(400).send("Invalid orderBy query parameter");
    }

    const result = await db.collection(COLLECTION_NAME).orderBy(orderBy, order).offset(parseInt(offset)).limit(parseInt(limit)).get();

    return res.status(200).json(result.docs.map(doc => { return { id: doc.id, ...doc.data() } }));
};