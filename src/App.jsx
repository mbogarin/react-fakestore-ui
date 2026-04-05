import { Routes, Route } from "react-router-dom";

import HomePage from "./components/HomePage";
import ProductListing from "./components/ProductListing";
import ProductDetails from "./components/ProductDetails";
import EditProduct from "./components/EditProduct";
import AddProduct from "./components/AddProduct";
import NavBar from "./components/NavBar";

import "./App.css";

function App() {
	return (
		<>
			<NavBar />

			<Routes>
				<Route path="/" element={<HomePage />} />

				<Route path="/product-listing" element={<ProductListing />} />

				<Route
					path="/product-details/:id"
					element={<ProductDetails />}
				/>

				<Route path="/edit-product/:id" element={<EditProduct />} />

				<Route path="/add-product" element={<AddProduct />} />
			</Routes>
		</>
	);
}

export default App;
