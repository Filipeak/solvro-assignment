const express = require('express');
const ingredientsController = require('../controllers/ingredientsController');
const router = express.Router();

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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
 *                 isAlcoholic:
 *                   type: boolean
 *                 photoUrl:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *       404:
 *         description: Not found
 */
router.get("/:id", ingredientsController.get);

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
router.post("/:id", ingredientsController.create);

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
router.put("/:id", ingredientsController.update);

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
router.delete("/:id", ingredientsController.delete);

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
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                   description:
 *                     type: string
 *                   isAlcoholic:
 *                     type: boolean
 *                   photoUrl:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *       400:
 *         description: Invalid parameters
 */
router.get("/", ingredientsController.getAll);

module.exports = router;