import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import IngredientSelector from './IngredientSelector'; // Your form component
import RecipeDisplay from './RecipeDisplay';
import PageNotFound from './PageNotFound';
// import ViewSavedRecipes from './components/ViewSavedRecipes'; // Component to view saved recipes
// import PageNotFound from './components/PageNotFound'; // 404 component

// Define your router
const router = createBrowserRouter([
  {
    path: "/", // Root path ("/"), main page
    element: <App />, // Use 'element' to render App component
    children: [
      {
        path: "ingredient-selector", // Route for composing a cocktail
        element: <IngredientSelector />, // The form where users can choose ingredients
      }, {
        path: "recipe-display",
        Component: RecipeDisplay,
        children: [{
          path: "confirm/:drinkId",
          Component: RecipeDisplay,
        }


        ]
      }, {
        path:"*",
        Component: PageNotFound,



      },{

        index:true,
        element: <p>Welcome to the Drink Generator!</p>


      }
    ]
  },
]);

export default router;
