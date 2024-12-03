import React, { useState } from 'react';
import Navbar from './Navbar';
import 'bootstrap/dist/css/bootstrap.css';
import Drink from './Drink.mjs';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { useEffect } from 'react';

const App = () => {
    const [recipeList, setRecipeList] = useState(() => {
        const prevList = window.localStorage.getItem('recipeList');
        console.log("previous list from getItem", prevList);
        if (prevList) {

            return Drink.parse(prevList);
        }
        return [];



    });



    function addToRecipeList(newDrink) {
        const drinkToAdd = newDrink instanceof Drink ? newDrink : new Drink(newDrink);
        const updatedList = [...recipeList, drinkToAdd];
        console.log("Updated Recipe List:", updatedList);
        setRecipeList(updatedList);

        // Update local storage immediately after changing state
        localStorage.setItem('recipeList', JSON.stringify(updatedList));
        return updatedList;
    }

    return (
        <div className="container py-4">
            <Header />
            <Navbar />
            <Outlet context={{ addToRecipeList, recipeList, setRecipeList }} />
            <Footer />
        </div>
    );
};

export default App;
