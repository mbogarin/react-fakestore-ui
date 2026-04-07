import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import ListGroup from "react-bootstrap/ListGroup";
import Button from "react-bootstrap/Button";
import Toast from "react-bootstrap/Toast"; // For add-to-cart confirmation
import ToastContainer from "react-bootstrap/ToastContainer";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";
import axios from "axios";

import ConfirmDeleteModal from "./ConfirmDeleteModal";

function ProductDetails() {
	const { id } = useParams();
	const navigate = useNavigate();

	const [product, setProduct] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [deleting, setDeleting] = useState(false);
	const [deleteError, setDeleteError] = useState(null);
	const [showAddToCartToast, setShowAddToCartToast] = useState(false); // State to control the visibility of the add-to-cart confirmation toast.

	const [showDeleteModal, setShowDeleteModal] = useState(false);

	useEffect(() => {
		const fetchProductDetails = async () => {
			try {
				const response = await axios.get(
					`https://fakestoreapi.com/products/${id}`,
				);
				const productId = response.data;
				setProduct(productId);
				setError(null);

				console.log(
					"successful API GET request for product details in ProductDetails component:",
					response.data,
				);
			} catch (fetchError) {
				setProduct(null);
				setError(
					`${fetchError.message}: Failed to fetch product from API.`,
				);

				console.error(
					`${fetchError.message}: Failed to fetch product from API.`,
				);
			}
			setLoading(false);
		};

		if (id) fetchProductDetails();
	}, [id]);

	const handleDelete = async () => {
		setDeleting(true);
		setDeleteError(null);

		try {
			await axios.delete(`https://fakestoreapi.com/products/${id}`);
			setProduct(null);

			sessionStorage.setItem(
				"flashSuccessMessage",
				"Product was successfully deleted!",
			);

			console.log(
				"successful API DELETE request in ProductDetails component",
			);

			navigate("/product-listing"); // Redirect to the product listing page after deletion.
		} catch (deleteErrorResponse) {
			setDeleteError(
				`${deleteErrorResponse.message}: Failed to delete product. Please try again.`,
			);
		} finally {
			setDeleting(false);
		}
	};

	if (loading) {
		return (
			<Container className="d-flex justify-content-center align-items-center text-center my-5 vh-100">
				<Spinner animation="border" role="status">
					<span className="visually-hidden">
						Loading product details...
					</span>
				</Spinner>
			</Container>
		);
	}

	if (!product) {
		return (
			<Container className="text-center my-5">
				<h2 className="mb-4">Product Not Found</h2>
				<p>The product you are looking for does not exist.</p>
				<Button
					variant="primary"
					onClick={() => navigate("/product-listing")}
				>
					Back to Product Listing
				</Button>
			</Container>
		);
	}

	// Return JSX for product details:
	return (
		<Container className="my-5">
			{/* Add to cart functionality */}
			<ToastContainer position="top-end" className="p-3">
				<Toast
					onClose={() => setShowAddToCartToast(false)}
					show={showAddToCartToast}
					delay={2500}
					autohide
					bg="success"
				>
					<Toast.Header closeButton={false} className="py-2">
						<strong className="me-auto text-success">
							Added to Cart!
						</strong>
						<small className="text-success">just now</small>
					</Toast.Header>
					<Toast.Body className="me-auto text-white py-2 px-3fw-semibold">
						{product.title}
					</Toast.Body>
				</Toast>
			</ToastContainer>

			{deleteError && (
				<Alert
					variant="danger"
					dismissible
					className="mb-5 mt-0 py-2 alert-align-close text-center fs-5 fw-semibold"
				>
					{deleteError}
				</Alert>
			)}

			{error && (
				<Alert
					variant="warning"
					dismissible
					className="mb-5 mt-0 py-2 alert-align-close text-center fs-5 fw-semibold"
				>
					{error}
				</Alert>
			)}

			<div className="d-flex flex-column flex-md-row align-items-center justify-content-center gap-5 mb-5 mx-5 py-4 px-5">
				{/* image */}
				<img
					src={product.image}
					alt={product.title}
					style={{
						minWidth: "400px",
						height: "350px",
						objectFit: "contain",
					}}
					className="img-fluid border rounded bg-white shadow-md py-3 px-5"
				/>

				{/* Wrapper: product details + buttons */}
				<div className="flex-grow-1">
					{/* Product details */}
					<h2 className="fw-bold mb-3 text-center text-md-start ms-3">
						{product.title}
					</h2>

					<ListGroup variant="flush" className="mb-4">
						{/* price */}
						<ListGroup.Item className="fs-4 text-primary fw-bold">
							${Number(product.price).toFixed(2)}
						</ListGroup.Item>

						{/* description */}
						<ListGroup.Item>
							<strong>Description:</strong> {product.description}
						</ListGroup.Item>
						{/* category */}
						<ListGroup.Item>
							<strong>Category:</strong> {product.category}
						</ListGroup.Item>
					</ListGroup>

					{/* Buttons */}
					<div className="d-flex flex-column flex-md-row align-items-stretch align-items-md-center gap-3 mt-4 ms-3 justify-md-content-center justify-content-center flex-wrap">
						{/* 1. Add to cart */}
						<Button
							variant="outline-success"
							className="rounded-pill px-4 fw-semibold"
							disabled={deleting}
							onClick={() => setShowAddToCartToast(true)}
						>
							Add to Cart
						</Button>

						<div className="d-flex gap-3 ms-md-auto me-3">
							{/* 2. Edit product */}
							<Button
								variant="outline-primary"
								className="px-4 fw-semibold rounded-pill"
								disabled={deleting}
								onClick={() => navigate(`/edit-product/${id}`)}
							>
								Edit Details
							</Button>

							{/* 3. Delete product */}
							<Button
								variant="outline-danger"
								className=" rounded-pill px-4 fw-semibold"
								disabled={deleting} // Disable the delete button while deletion is in progress to prevent conflicts.
								onClick={() => setShowDeleteModal(true)}
							>
								Delete
							</Button>
						</div>
					</div>
				</div>
			</div>

			{/* Confirm Delete Modal */}
			<ConfirmDeleteModal
				show={showDeleteModal}
				productName={product.title}
				onHide={() => setShowDeleteModal(false)}
				onConfirm={() => {
					setShowDeleteModal(false);
					handleDelete();
				}}
				loading={deleting}
			/>
		</Container>
	);
}

export default ProductDetails;
