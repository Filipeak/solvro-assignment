const express = require('express');
const cocktailsController = require('../controllers/cocktailsController');
const router = express.Router();

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
 *         content:
 *           application/json:
 *             schema:
 *                type: object
 *                properties:
 *                  name:
 *                    type: string
 *                  category:
 *                    type: string
 *                  recipe:
 *                    type: string
 *                  ingredients:
 *                    type: array
 *                    items:
 *                      type: object
 *                      properties:
 *                        id:
 *                          type: string
 *                        amount:
 *                          type: string
 *                  createdAt:
 *                    type: string
 *       404:
 *         description: Not found
 */
router.get("/:id", cocktailsController.get);

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
router.post("/:id", cocktailsController.create);

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
router.put("/:id", cocktailsController.update);

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
router.delete("/:id", cocktailsController.delete);

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
 *         content:
 *           application/json:
 *             schema:
 *                type: array
 *                items:
 *                  type: object
 *                  properties:
 *                    name:
 *                      type: string
 *                    category:
 *                      type: string
 *                    recipe:
 *                      type: string
 *                    ingredients:
 *                      type: array
 *                      items:
 *                        type: object
 *                        properties:
 *                          id:
 *                            type: string
 *                          amount:
 *                            type: string
 *                    createdAt:
 *                      type: string
 *       400:
 *         description: Invalid parameters
 */
router.get("/", cocktailsController.getAll);

module.exports = router;