import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";
import axios from "axios";

// Utility function to format prices.
const priceFormatter = new Intl.NumberFormat("en-US", {
	minimumFractionDigits: 2,
	maximumFractionDigits: 2,
});

function ProductListing() {
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [successMessage, setSuccessMessage] = useState(() => {
		const flashMessage = sessionStorage.getItem("flashSuccessMessage"); // Check for a flash success message in sessionStorage (set by ProductDetails after deletion).
		if (flashMessage) {
			sessionStorage.removeItem("flashSuccessMessage");
		}
		return flashMessage;
	});

	// =!
	useEffect(() => {
		const fetchProducts = async () => {
			try {
				const response = await axios.get(
					"https://fakestoreapi.com/products",
				);
				setProducts(response.data);
				setError(null);

				console.log(
					"successful API GET request for products:",
					response.data,
				);
			} catch (fetchError) {
				setProducts([]);
				setError(
					`${fetchError.message}: Failed to fetch products. Please try again later.`,
				);

				console.error("Error fetching products from API:", fetchError);
			}
			setLoading(false);
		};

		fetchProducts();
	}, []);

	// Loading and error messages:
	if (loading) {
		return (
			<Container className="d-flex justify-content-center align-items-center text-center my-5 vh-100">
				<Spinner animation="border" role="status">
					<span className="visually-hidden">Loading products...</span>
				</Spinner>
			</Container>
		);
	}

	return (
		<Container className="py-4">
			{error && (
				<Alert
					variant="danger"
					dismissible
					onClose={() => setError(null)}
					className="mb-5 mt-0 py-2 alert-align-close text-center fs-5 fw-semibold"
				>
					{error}
				</Alert>
			)}
			{successMessage && (
				<Alert
					variant="success"
					dismissible
					onClose={() => {
						sessionStorage.removeItem("flashSuccessMessage");
						setSuccessMessage(null);
					}}
					className="mb-5 mt-0 py-2 alert-align-close text-center fs-5 fw-semibold"
				>
					{successMessage}
				</Alert>
			)}
			<h1 className="mb-5 text-center text-primary fw-bold">Products</h1>

			{/* // <! */}
			<Row className="g-4 justify-content-center">
				{products.map((product) => (
					<Col
						key={product.id}
						xs={12}
						sm={6}
						md={4}
						lg={3}
						className="d-flex align-items-stretch"
					>
						<Card className="w-100 shadow-lg h-100 d-flex flex-column border rounded-2 dark-border">
							<Card.Body className="d-flex flex-column flex-grow-1">
								{/* Title */}
								<Card.Title
									className="mb-4 text-center fw-bold align-items-center d-flex justify-content-center"
									style={{
										minHeight: "5em",
									}}
								>
									{product.title}
								</Card.Title>

								{/* Image */}
								<Card.Img
									className="mb-4 img-fluid mt-auto align-self-center d-flex align-items-center justify-content-center"
									variant="top"
									src={product.image}
									alt={product.title}
									style={{
										maxHeight: "200px",
										maxWidth: "100%",
										objectFit: "contain",
									}}
								/>

								{/* Price */}
								<Card.Text className="text-center fs-5 text-primary fw-bold mb-1 mt-4">
									${priceFormatter.format(product.price)}
								</Card.Text>

								{/* View Details Button */}
								<div className="d-grid mt-2 mb-0">
									<Button
										as={Link}
										to={`/product-details/${product.id}`}
										variant="outline-primary"
										className="rounded-pill fw-semibold py-1 px-5"
									>
										View Details
									</Button>
								</div>
							</Card.Body>
						</Card>
					</Col>
				))}
			</Row>
		</Container>
	);
}

export default ProductListing;
