const { getFirestore, FieldPath } = require('firebase-admin/firestore');
const express = require('express');

const db = getFirestore();
const router = express.Router();

const COLLECTION_NAME = "cocktails";

router.get("/:id", async (req, res) => {
    const result = await db.collection(COLLECTION_NAME).doc(req.params.id).get();

    if (result.exists) {
        return res.status(200).json(result.data());
    }
    else {
        return res.status(404).send("Cocktail with given id not found");
    }
});

router.post("/:id", async (req, res) => {
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
    });

    return res.status(200).send("Cocktail added successfully");
});

router.put("/:id", async (req, res) => {
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
});

router.delete("/:id", async (req, res) => {
    if (!(await db.collection(COLLECTION_NAME).doc(req.params.id).get()).exists) {
        return res.status(400).send("Cocktail with given id does not exist");
    }

    await db.collection(COLLECTION_NAME).doc(req.params.id).delete();

    return res.status(200).send("Cocktail deleted successfully");
});

module.exports = router;