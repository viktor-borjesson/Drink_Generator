import React, { useState, useId } from 'react';
import safeFetchJson from './safeFetchJson';
import Drink from './Drink.mjs';
import { inventory } from './inventory.mjs';
import { useOutletContext, useNavigate } from 'react-router-dom';
import './App.css';
import { useEffect } from 'react';

function IngredientSelector() {
    const [selectedAlcohol, setSelectedAlcohol] = useState(''); // Local state for alcohol type
    const [selectedNonAlcohol, setSelectedNonAlcohol] = useState(''); //Currently selected alcohol
    const [errorMessage, setErrorMessage] = useState(''); // Error message state
    const [drinksList, setDrinksList] = useState([]); // List of fetched drinks
    const [currentDrink, setCurrentDrink] = useState(null); // Currently selected drink
    const [touched, setTouched] = useState(false); // Form validation state
    const { addToRecipeList, recipeList, setRecipeList } = useOutletContext();
    const navigate = useNavigate();
 

    async function handleFormSubmit(event) {
        
        event.preventDefault();
        setTouched(true); 
        if (!selectedAlcohol || !selectedNonAlcohol) return; // Validates that both alcohol and non alcohol ingredients are selected.

        try {
            // Hämta drinkar baserat på den valda alkoholhaltiga ingrediensen
            const alcoholUrl = `https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${selectedAlcohol}`;
            const alcoholData = await safeFetchJson(alcoholUrl);
            console.log('Alcohol data', alcoholData);

            // Hämta drinkar baserat på den valda icke-alkoholhaltiga ingrediensen
            const nonAlcoholUrl = `https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${selectedNonAlcohol}`;
            const nonAlcoholData = await safeFetchJson(nonAlcoholUrl);
            console.log('NonAlcohol data', nonAlcoholData);

            // Om båda API-anropen lyckas och har resultat
            if (alcoholData && alcoholData.drinks && nonAlcoholData && nonAlcoholData.drinks) {
                
                //Filtrera vilka drinkar som har båda ingredienserna
                const commonDrinks = alcoholData.drinks.filter(drink =>
                    nonAlcoholData.drinks.some(nonAlcoholDrink => nonAlcoholDrink.idDrink === drink.idDrink)
                );
                console.log('commondrinks', commonDrinks);

                if (commonDrinks.length > 0) {
                    //Här hämtar vi alla detaljer från den valda slumpmässiga drinken
                    const drinkDetailsPromises = commonDrinks.map(async drink => {
                        const detailsUrl = `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${drink.idDrink}`;
                        const detailsData = await safeFetchJson(detailsUrl);
                        console.log('detailsdata', detailsData, 'length', detailsData.drinks.length,'drinks',detailsData.drinks);

                        
                        if (detailsData && detailsData.drinks && detailsData.drinks.length > 0) {
                            const updatedDrink = new Drink(detailsData.drinks[0]);
                            console.log('updated Drink', updatedDrink);
                            return updatedDrink;
                        }
                        return null; 
                    });

                    // Resolve all promises to get detailed drinks
                    const detailedDrinks = await Promise.all(drinkDetailsPromises);

                    // Filter out any null values (where drink details were not found)
                    const validDrinks = detailedDrinks.filter(drink => drink !== null);

                    if (validDrinks.length > 0) {
                        const randomIndex = Math.floor(Math.random() * validDrinks.length);
                        const randomDrink = validDrinks[randomIndex];

                        // Uppdatera commonDrinks för att ta bort den valda drinken
                        const updatedCommonDrinks = validDrinks.filter((_, index) => index !== randomIndex);
                        console.log('updatedcommondrinks', updatedCommonDrinks);
                        // Sätt den valda drinken som currentDrink
                        setCurrentDrink(randomDrink);
                        setDrinksList(updatedCommonDrinks);
            
                        setErrorMessage('');
                    } else {
                        setErrorMessage('Unfortunately, no drinks could be found.');
                    }
                } else {
                    setErrorMessage('Unfortunately, no drinks could be found with these 2 particular ingredients.');
                }
            } else {
                setErrorMessage('Unfortunately, no drinks could be found with these 2 particular ingredients.');
            }
        } catch (error) {
            setErrorMessage('Something went wrong when trying to fetch the recipes.');
        }
    }






    
    // Function to generate a new random drink from the list
function generateNewDrink() {
    if (drinksList.length > 0) {
        //Select a random drink from the drink list
        const randomIndex = Math.floor(Math.random() * drinksList.length);
        const randomDrink = drinksList[randomIndex];

        
        setCurrentDrink(randomDrink);

        // Make an update to drinkslist, and remove the drink which the user will see on the screen.
        const updatedDrinksList = drinksList.filter((_, index) => index !== randomIndex);
        setDrinksList(updatedDrinksList);
    } else {
        setErrorMessage('There is no more drinks with these 2 ingredients.');
    }
}


    // Function to save the current drink to the recipe list
    function saveCurrentDrink() {
        if (!currentDrink) {
            setErrorMessage('No drink selected.');
            return;
        }
    
        
        console.log("Current Drink before saving:", currentDrink);
    
        // Check if the user already saved the recipe for this particular drink
        console.log('recipelist',recipeList);
        const drinkExists = recipeList.some(drink => drink.getName() === currentDrink.getName());
    
        if (drinkExists) {
            
            setErrorMessage('This drink is already in your recipe list.');
        } else {
            
            addToRecipeList(currentDrink);
            setCurrentDrink(null); 
            setErrorMessage(''); 
            navigate(`/recipe-display/confirm/${currentDrink.getUuid()}`); //Navigate to the recipe display
        }
    }
    


    // Function to reset and allow the user to select a new alcohol type
    function makeNewChoices() {
        setSelectedAlcohol(''); 
        setCurrentDrink(null);
        setSelectedNonAlcohol('');
        setErrorMessage(''); 
        setTouched(false); 
    }

    
    function Select({ label, value, onChange, options }) {
        const id = useId();
        return (
            <>
                <label htmlFor={id} className="form-label">{label}</label>
                <select className="form-select" required id={id} value={value} onChange={onChange}>
                    <option value="" hidden>-- Select {label} --</option>
                    {options.map(option => (
                        <option key={option} value={option}>{option}</option>
                    ))}
                </select>
                <div className="invalid-feedback">Please select {label.toLowerCase()}.</div>
            </>
        );
    }

    return (
        <div>
            {!currentDrink && (
                <form onSubmit={handleFormSubmit} className={touched ? "was-validated" : ""} noValidate>
                    <h2>Choose Your Cocktail Ingredients</h2>

                    <fieldset className="col-md-12">
                        <Select
                            label="Alcohol Type"
                            value={selectedAlcohol}
                            onChange={e => setSelectedAlcohol(e.target.value)}
                            options={Object.keys(inventory).filter(key => inventory[key].alcohol === true)}
                        />
                    </fieldset>

                    <fieldset className="col-md-12">
                        <Select
                            label="Non-alcohol ingredient"
                            value={selectedNonAlcohol}
                            onChange={e => setSelectedNonAlcohol(e.target.value)}
                            options={Object.keys(inventory).filter(key => inventory[key].alcohol === false)}
                        />
                    </fieldset>

                    <button type="submit" className="btn btn-primary mt-4">Generate Cocktail</button>
                </form>
            )}

            {currentDrink && (
                <div className="drink-card">
                    <h2>{currentDrink.getName()}
                    </h2>
                    <p><strong>Instructions:</strong> {currentDrink.getInstructions()}</p>
                    <p><strong>Ingredients:</strong> {currentDrink.getIngredientsList()}</p>

                    <button onClick={generateNewDrink} className="btn btn-primary mt-4">Generate New Drink</button>
                    <button onClick={saveCurrentDrink} className="btn btn-secondary mt-4">Add to Recipe List</button>
                    <button onClick={makeNewChoices} className="btn btn-secondary mt-4">Select New Ingredients</button>
                </div>
            )}

            {/* Display any error messages */}
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        </div>
    );
}

export default IngredientSelector;
