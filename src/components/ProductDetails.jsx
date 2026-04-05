import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import ListGroup from "react-bootstrap/ListGroup";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";
import axios from "axios";
import { fallbackProducts } from "../fallback";

import ConfirmDeleteModal from "./ConfirmDeleteModal"; // Import the confirm delete modal component that will be used to confirm deletion of a product before actually deleting it.

function ProductDetails() {
	const { id } = useParams();
	const navigate = useNavigate();

	const [product, setProduct] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [deleting, setDeleting] = useState(false);
	const [deleteError, setDeleteError] = useState(null);

	const [showDeleteModal, setShowDeleteModal] = useState(false); // State to control the visibility of the confirm delete modal.

	useEffect(() => {
		const fetchProduct = async () => {
			try {
				const response = await axios.get(
					`https://fakestoreapi.com/products/${id}`,
				);
				const foundProduct = response.data; // Find the product with the matching ID.
				setProduct(foundProduct); // Set the product state with the found product.
				setError(null);
			} catch (fetchError) {
				console.error("Error fetching product:", fetchError); // Log the error for debugging.
				const fallbackProduct = fallbackProducts.find(
					(item) => item.id.toString() === id.toString(), // Find the product in the fallback data with the matching ID.
				);
				setProduct(fallbackProduct || null); // Set the product state with the found fallback product or null if not found.
				setError(
					`${fetchError.message}: Failed to fetch product. Displaying fallback data.`,
				);
			}
			setLoading(false);
		};
		if (id) fetchProduct(); // Only fetch if ID is present to avoid unnecessary API calls.
	}, [id]); // Re-run the effect if the ID changes.

	const handleDelete = async () => {
		setDeleting(true);
		setDeleteError(null);

		try {
			await axios.delete(`https://fakestoreapi.com/products/${id}`); // Attempt to delete the product from the API.
			setProduct(null); // Clear the product details after deletion.
			sessionStorage.setItem(
				"flashSuccessMessage",
				"Product was successfully deleted!",
			);
			navigate("/product-listing"); // Redirect to the product listing page after deletion.
		} catch (deleteErrorResponse) {
			// Handle errors during deletion.
			console.error("Error deleting product:", deleteErrorResponse); // Log the error for debugging.

			const fallbackIndex = fallbackProducts.findIndex(
				(item) => item.id.toString() === id.toString(),
			); // Find the index of the product in the fallback data with the matching ID.

			if (fallbackIndex !== -1) {
				fallbackProducts.splice(fallbackIndex, 1); // Remove the product from the fallback data if it exists.
				setProduct(null); // Clear the product details after deletion.
				sessionStorage.setItem(
					"flashSuccessMessage",
					"Product from fallback data was successfully deleted!",
				);
				navigate("/product-listing"); // Redirect to the product listing page after deletion.
			} else {
				setDeleteError(
					`${deleteErrorResponse.message}: Failed to delete product. Please try again.`,
				);
			}
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
			{deleteError && (
				<Alert
					variant="danger"
					dismissible
					className="mb-5 mt-0 py-2 alert-align-close text-center"
				>
					{deleteError}
				</Alert>
			)}

			{error && (
				<Alert
					variant="warning"
					dismissible
					className="mb-5 mt-0 py-2 alert-align-close text-center"
				>
					{error}
				</Alert>
			)}

			<div className="d-flex flex-column flex-md-row align-items-center justify-content-center gap-5 mb-5">
				{/* image */}
				<img
					src={product.image}
					alt={product.title}
					style={{
						width: "400px",
						height: "300px",
						objectFit: "contain",
					}}
					className="img-fluid border rounded bg-white shadow-sm"
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
						{/* 1. Add to cart 
              //  Note: add functionality later */}

						<Button
							variant="outline-success"
							className="rounded-pill px-4 fw-semibold"
							disabled={deleting}
						>
							Add to Cart
						</Button>
						{/* Wrapper: Edit/Delete buttons */}

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
	); // end of return JSX.
} // end of ProductDetails component.

export default ProductDetails;
