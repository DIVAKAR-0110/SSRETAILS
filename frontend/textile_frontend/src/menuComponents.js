// src/menuComponents.js
import Country from './Components/Country.jsx';
import State from "./Components/State.jsx";
import City from "./Components/City.jsx";
//import Supplier from "./Components/Supplier.jsx";
//import Customer from "./Components/Customer.jsx";
//import Item from "./Components/Item.jsx";
//import Brand from "./Components/Brand.jsx";
//import Pattern from "./Components/Pattern.jsx";
//import Color from "./Components/Color.jsx";
//import HSNCode from "./Components/HSNCode.jsx";
//import UOM from "./Components/UOM.jsx";
//import Product from "./Components/Product.jsx";

// keys must match the routeLabel generation in Navbar2:
// extractString(label).replace(/[\s&]+/g, "-").replace(/[^a-zA-Z0-9-]/g,"").toLowerCase()

export const menuComponentRegistry = {
  country: Country,
  state: State,
  city: City,
  //supplier: Supplier,
  //customer: Customer,
  //item: Item,
  //brand: Brand,
  //pattern: Pattern,
  //color: Color,
  //hsncode: HSNCode,
 // uom: UOM,
 // product: Product,
  // add more mappings as you create pages
};
