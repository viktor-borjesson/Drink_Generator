import { NavLink } from "react-router-dom";  // Import NavLink
import 'bootstrap/dist/css/bootstrap.css';

export default function Navbar() {
  return (
    <ul className="nav nav-underline">
      <li className="nav-item">
        <NavLink className="nav-link" to="/ingredient-selector">
          Select Ingredients
        </NavLink>
      </li>
      <li className="nav-item">
        <NavLink className="nav-link" to="/recipe-display">
          Your Recipes
        </NavLink>
      </li>
     
    </ul>
  );
}
