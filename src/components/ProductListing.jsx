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
import { fallbackProducts } from "../fallback";

function ProductListing() {
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [successMessage, setSuccessMessage] = useState(() =>
		sessionStorage.getItem("flashSuccessMessage"),
	);

	useEffect(() => {
		const fetchProducts = async () => {
			try {
				const response = await axios.get(
					"https://fakestoreapi.com/products",
				);
				setProducts(response.data);
				setError(null);
			} catch (fetchError) {
				console.error("Error fetching products:", fetchError);
				setProducts(fallbackProducts);
				setError(
					`${fetchError.message}: Failed to fetch products. Displaying fallback data.`,
				);
			}
			setLoading(false);
		};

		fetchProducts();
	}, []);

	useEffect(() => {
		if (successMessage) {
			sessionStorage.removeItem("flashSuccessMessage");
		}
	}, [successMessage]);

	const formatPrice = (price) => {
		const num = Number(price);
		if (Number.isNaN(num)) return price;
		return num.toLocaleString(undefined, {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		});
	};

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
					className="mb-5 mt-0 py-2 alert-align-close text-center"
				>
					{error}
				</Alert>
			)}

			{successMessage && (
				<Alert
					variant="success"
					dismissible
					onClose={() => setSuccessMessage(null)}
					className="mb-5 mt-0 py-2 alert-align-close text-center"
				>
					{successMessage}
				</Alert>
			)}

			<h1 className="mb-5 text-center text-primary fw-bold">Products</h1>

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
							<Card.Body className="d-flex flex-column justify-content-between flex-grow-1">
								<Card.Title
									className="mb-3 text-center fs-6 fw-bold align-items-center d-flex justify-content-center"
									style={{
										minHeight: "5em",
									}}
								>
									{product.title}
								</Card.Title>

								<div className="mb-3">
									<img
										src={product.image}
										alt={product.title}
										style={{
											maxHeight: "100%",
											maxWidth: "100%",
											objectFit: "contain",
										}}
										className="img-fluid border rounded bg-white shadow-sm mt-auto "
									/>
								</div>

								<Card.Text className="text-center fs-6 text-primary fw-bold mb-4 mt-auto">
									${formatPrice(product.price)}
								</Card.Text>

								<div className="d-grid mt-auto px-4">
									<Button
										as={Link}
										to={`/product-details/${product.id}`}
										variant="outline-primary"
										className="rounded-pill fw-semibold"
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
