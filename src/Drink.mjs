import { v4 as uuidv4 } from 'uuid';

class Drink {
    constructor(newDrink) {
        // Use uuid from the input or generate a new one
        if (newDrink instanceof Drink) {
            this.uuid = newDrink.uuid;
            this.name = newDrink.getName();
            this.instructions = newDrink.getInstructions();
            this.ingredients = newDrink.ingredients; // Directly use the existing ingredients
        } else {
            // Ensure uuid is assigned correctly
            this.uuid = newDrink.uuid || uuidv4();
            this.name = newDrink.strDrink || newDrink.name; // Use 'name' if present
            this.instructions = newDrink.strInstructions || newDrink.instructions; // Use 'instructions' if present
        } this.ingredients = this.getIngredients(newDrink); // Extract ingredients

    }

    getIngredients(drink) {
        const ingredients = [];
        // Log the drink being processed
        console.log("Processing drink for ingredients:", drink);

        // Check if drink has ingredients already parsed
        if (drink.ingredients && drink.ingredients.length > 0) {
            console.log("Found ingredients from drink.ingredients:", drink.ingredients);
            // Loop through each ingredient in the drink.ingredients array
            for (const item of drink.ingredients) {
                if (item.ingredient) {
                    // Log each ingredient and measure found
                    console.log(`Found ingredient: ${item.ingredient}, Measure: ${item.measure}`);
                    ingredients.push({ ingredient: item.ingredient, measure: item.measure || '' });
                }
            }
        } else {
            // Fallback: use properties from API response
            for (let i = 1; i <= 15; i++) {
                const ingredient = drink[`strIngredient${i}`];
                const measure = drink[`strMeasure${i}`];
                // Log each ingredient and measure found
                if (ingredient) {
                    console.log(`Found ingredient: ${ingredient}, Measure: ${measure}`);
                    ingredients.push({ ingredient, measure: measure || '' });
                }
            }
        }

        console.log("Extracted ingredients:", ingredients); // Log the extracted ingredients
        return ingredients;
    } 


    getUuid() {
        return this.uuid;
    }

    static parse(json) {
        try {
            const parsedData = typeof json === 'string' ? JSON.parse(json) : json;
            console.log("Parsed data:", parsedData); // Log for debugging
            if (Array.isArray(parsedData)) {
                return parsedData.map(item => new Drink(item));
            } else {
                return [];
            }
        } catch (error) {
            console.error("Error parsing JSON:", error);
            return [];
        }
    }

    getInstructions() {
        return this.instructions;
    }

    getName() {
        return this.name;
    }

    getIngredientsList() {
        return this.ingredients.map(({ ingredient, measure }) => `${measure ? measure + ' ' : ''}${ingredient}`).join(', ');
    }
}

export default Drink;
