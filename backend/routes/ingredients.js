const { getFirestore } = require('firebase-admin/firestore');
const express = require('express');

const db = getFirestore();
const router = express.Router();

const COLLECTION_NAME = "ingredients";

/**
 * @swagger
 * /ingredients/{ingredientId}:
 *   get:
 *     description: Get ingredient by id
 *     tags:
 *       - Ingredients
 *     parameters:
 *       - in: path
 *         name: ingredientId
 *         required: true
 *         description: The ingredient ID
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
        return res.status(404).send("Ingredient with given id not found");
    }
});

/**
 * @swagger
 * /ingredients/{ingredientId}:
 *   post:
 *     description: Create an ingredient with given id
 *     tags:
 *       - Ingredients
 *     parameters:
 *       - in: path
 *         name: ingredientId
 *         required: true
 *         description: The ingredient ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               isAlcoholic:
 *                 type: boolean
 *               photoUrl:
 *                 type: string
 *     responses:
 *       200:
 *         description: Success
 *       400:
 *         description: Invalid body
 */
router.post("/:id", async (req, res) => {
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
});

/**
 * @swagger
 * /ingredients/{ingredientId}:
 *   put:
 *     description: Update an ingredient with given id
 *     tags:
 *       - Ingredients
 *     parameters:
 *       - in: path
 *         name: ingredientId
 *         required: true
 *         description: The ingredient ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               isAlcoholic:
 *                 type: boolean
 *               photoUrl:
 *                 type: string
 *     responses:
 *       200:
 *         description: Success
 *       400:
 *         description: Invalid body
 */
router.put("/:id", async (req, res) => {
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
});

/**
 * @swagger
 * /ingredients/{ingredientId}:
 *   delete:
 *     description: Delete ingredient by id
 *     tags:
 *       - Ingredients
 *     parameters:
 *       - in: path
 *         name: ingredientId
 *         required: true
 *         description: The ingredient ID
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: Not found
 */
router.delete("/:id", async (req, res) => {
    if (!(await db.collection(COLLECTION_NAME).doc(req.params.id).get()).exists) {
        return res.status(400).send("Ingredient with given id does not exist");
    }

    await db.collection(COLLECTION_NAME).doc(req.params.id).delete();

    return res.status(200).send("Ingredient deleted successfully");
});

/**
 * @swagger
 * /ingredients:
 *   get:
 *     description: Get ingredients
 *     tags:
 *       - Ingredients
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
 *         description: Field to order results by, either 'name', 'isAlcoholic' or 'createdAt' (default 'name')
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

    if (!["name", "isAlcoholic", "createdAt"].includes(orderBy)) {
        return res.status(400).send("Invalid orderBy query parameter");
    }

    const result = await db.collection(COLLECTION_NAME).orderBy(orderBy, order).offset(parseInt(offset)).limit(parseInt(limit)).get();

    return res.status(200).json(result.docs.map(doc => { return { id: doc.id, ...doc.data() } }));
});

// REF: https://stackoverflow.com/a/8234912
function vaidateUrl(url) {
    return url.match(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/);
}

module.exports = router;