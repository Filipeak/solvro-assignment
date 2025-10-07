const express = require('express');

const router = express.Router();
const db = [];

router.get("/:id", (req, res) => {
    const id = req.params.id;
    const result = db.filter(item => item.id == id);

    if (result != null && result.length > 0) {
        return res.status(200).json(result[0]);
    }
    else {
        console.log("Cocktail with given id not found");

        return res.status(404).send("Cocktail with given id not found");
    }
});

router.post("/:id", (req, res) => {
    const id = req.params.id;

    if (db.filter(item => item.id == id).length > 0) {
        console.log("Cocktail with given id already exists");

        return res.status(401).send("Cocktail with given id already exists");
    }

    const name = req.body.name;

    if (name == null || name == "") {
        console.log("Cocktail name cannot be empty");

        return res.status(400).send("Cocktail name cannot be empty");
    }

    const category = req.body.category;

    if (category == null || category == "") {
        console.log("Cocktail category cannot be empty");

        return res.status(400).send("Cocktail category cannot be empty");
    }

    const recipe = req.body.recipe;

    if (recipe == null || recipe == "") {
        console.log("Cocktail recipe cannot be empty");

        return res.status(400).send("Cocktail recipe cannot be empty");
    }

    const ingredients = req.body.ingredients;

    if (!Array.isArray(ingredients) || ingredients.length == 0) {
        console.log("Cocktail ingredients must be a non-empty array");

        return res.status(400).send("Cocktail ingredients must be a non-empty array");
    }

    const validIngredients = [];

    for (const ingredient of ingredients) {
        if (ingredient == null || ingredient.name == null || ingredient.name == "" || ingredient.amount == null || ingredient.amount == "") {
            console.log("Each ingredient must have a non-empty name and amount");

            return res.status(400).send("Each ingredient must have a non-empty name and amount");
        }
        else {
            validIngredients.push({ name: ingredient.name, amount: ingredient.amount });
        }
    }

    const newCocktail = {
        id: id,
        name: name,
        category: category,
        recipe: recipe,
        ingredients: validIngredients,
    };

    db.push(newCocktail);

    console.log("Cocktail added:", JSON.stringify(newCocktail));

    return res.sendStatus(200);
});

router.put("/:id", (req, res) => {
    const id = req.params.id;

    return res.sendStatus(200);
});

router.delete("/:id", (req, res) => {
    const id = req.params.id;
    const index = db.findIndex(item => item.id == id);

    if (index < 0) {
        console.log("Cocktail with given id not found");
        
        return res.status(404).send("Cocktail with given id not found");
    }
    else {
        db.splice(index, 1);

        return res.sendStatus(200);
    }
});

module.exports = router;