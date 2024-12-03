import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';

function RecipeDisplay() {
    const { recipeList = [], setRecipeList } = useOutletContext();
    const [orderConfirmation, setOrderConfirmation] = useState("");

    function clearRecipes() {
        localStorage.removeItem('recipeList');
        setRecipeList([]);
        setOrderConfirmation('All recipes cleared!');
        console.log("Recipes cleared.");
    }

    return (
        <div className="row h-100 p-5 bg-light border rounded-2">
            <h2>Recipes</h2>
            <div className="recipe-container">
                {console.log('recipelist hejhej',recipeList)}
                {recipeList.length > 0 ? (
                    recipeList.map((drink) => {
                        console.log("Current drink:", drink); // Debug log
                        return (
                            <div
                                className="row text-primary mt-2 p-3 border-primary rounded-3"
                                key={drink.getUuid()}
                            >
                                <div className="drink-card">
                                    {drink.getName() ? (
                                        <>
                                            <h2>{drink.getName()}</h2>
                                            <p><strong>Instructions:</strong> {drink.getInstructions()}</p>
                                            <p><strong>Ingredients:</strong> {drink.getIngredientsList()}</p>
                                        </>
                                    ) : (
                                        <p>No drink name available</p> // Fallback message
                                    )}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <p>You have no saved recipes yet!</p>
                )}
            </div>

            <button onClick={clearRecipes} className="btn btn-danger mt-4">Clear All Recipes</button>
            {orderConfirmation && <p style={{ color: 'green' }}>{orderConfirmation}</p>}
        </div>
    );
}

export default RecipeDisplay;
