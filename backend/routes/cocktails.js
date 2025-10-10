const { getFirestore, FieldPath } = require('firebase-admin/firestore');
const express = require('express');

const db = getFirestore();
const router = express.Router();

const COLLECTION_NAME = "cocktails";

/**
 * @swagger
 * /cocktails/{cocktailId}:
 *   get:
 *     description: Get cocktail by id
 *     tags:
 *       - Cocktails
 *     parameters:
 *       - in: path
 *         name: cocktailId
 *         required: true
 *         description: The cocktail ID
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: Not found
 */
router.get("/:id", async (req, res) => {
    const result = await db.collection(COLLECTION_NAME).doc(req.params.id).get();

    if (result.exists) {
        return res.status(200).json(result.data());
    }
    else {
        return res.status(404).send("Cocktail with given id not found");
    }
});

/**
 * @swagger
 * /cocktails/{cocktailId}:
 *   post:
 *     description: Create a new cocktail with given id
 *     tags:
 *       - Cocktails
 *     parameters:
 *       - in: path
 *         name: cocktailId
 *         required: true
 *         description: The cocktail ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               category:
 *                 type: string
 *               recipe:
 *                 type: string
 *               ingredients:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     amount:
 *                       type: string
 *     responses:
 *       200:
 *         description: Success
 *       400:
 *         description: Invalid body
 *       401:
 *         description: Invalid ingredients
 */
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
        createdAt: new Date().toISOString(),
    });

    return res.status(200).send("Cocktail added successfully");
});

/**
 * @swagger
 * /cocktails/{cocktailId}:
 *   put:
 *     description: Update a cocktail with given id
 *     tags:
 *       - Cocktails
 *     parameters:
 *       - in: path
 *         name: cocktailId
 *         required: true
 *         description: The cocktail ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               category:
 *                 type: string
 *               recipe:
 *                 type: string
 *               ingredients:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     amount:
 *                       type: string
 *     responses:
 *       200:
 *         description: Success
 *       400:
 *         description: Invalid body
 *       401:
 *         description: Invalid ingredients
 */
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

/**
 * @swagger
 * /cocktails/{cocktailId}:
 *   delete:
 *     description: Delete cocktail by id
 *     tags:
 *       - Cocktails
 *     parameters:
 *       - in: path
 *         name: cocktailId
 *         required: true
 *         description: The cocktail ID
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: Not found
 */
router.delete("/:id", async (req, res) => {
    if (!(await db.collection(COLLECTION_NAME).doc(req.params.id).get()).exists) {
        return res.status(404).send("Cocktail with given id does not exist");
    }

    await db.collection(COLLECTION_NAME).doc(req.params.id).delete();

    return res.status(200).send("Cocktail deleted successfully");
});

/**
 * @swagger
 * /cocktails:
 *   get:
 *     description: Get cocktails
 *     tags:
 *       - Cocktails
 *     parameters:
 *       - in: query
 *         name: limit
 *         required: false
 *         description: Maximum number of results to return (default 10, max 50)
 *       - in: query
 *         name: offset
 *         required: false
 *         description: Number of results to skip (default 0)
 *       - in: query
 *         name: order
 *         required: false
 *         description: Order of results, either 'asc' or 'desc' (default 'asc')
 *       - in: query
 *         name: orderBy
 *         required: false
 *         description: Field to order results by, either 'name', 'category' or 'createdAt' (default 'name')
 *     responses:
 *       200:
 *         description: Success
 *       400:
 *         description: Invalid parameters
 */
router.get("/", async (req, res) => {
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
});

module.exports = router;