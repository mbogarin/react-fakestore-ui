import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";
import InputGroup from "react-bootstrap/InputGroup";
import ListGroup from "react-bootstrap/ListGroup";

import axios from "axios";
import ConfirmChangesModal from "./ConfirmChangesModal";

const priceFormatter = new Intl.NumberFormat("en-US", {
	minimumFractionDigits: 2,
	maximumFractionDigits: 2,
});

function EditProduct() {
	const { id } = useParams();
	const navigate = useNavigate();

	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [validated, setValidated] = useState(false);

	const [successMessage, setSuccessMessage] = useState(null);
	const [savingChanges, setSavingChanges] = useState(false);
	const [showConfirmationModal, setShowConfirmationModal] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [categories, setCategories] = useState([]);
	const [updatedProduct, setUpdatedProduct] = useState(null);

	const [formData, setFormData] = useState({
		title: "",
		price: "",
		description: "",
		category: "",
		image: "",
	});

	useEffect(() => {
		const fetchCategories = async () => {
			try {
				const response = await axios.get(
					"https://fakestoreapi.com/products/categories",
				);
				const categoryData = Array.isArray(response.data)
					? [...response.data.filter(Boolean)]
					: [];
				setCategories(categoryData);
			} catch (fetchError) {
				console.error("Error fetching categories:", fetchError);
				setCategories([]);
			}
		};

		fetchCategories();
	}, []);

	useEffect(() => {
		const fetchProduct = async () => {
			if (!id) return;
			setLoading(true);
			try {
				const response = await axios.get(
					`https://fakestoreapi.com/products/${id}`,
				);

				console.log(
					"successful API GET request in EditProduct component:",
					response.data,
				);

				const product = response.data;
				//
				if (!product) {
					setError("Product not found.");
					setLoading(false);
					return;
				}

				setFormData({
					title: product.title || "",
					price: String(product.price ?? ""), // Convert price to string for form input compatibility.
					description: product.description || "",
					category: product.category || "",
					image: product.image || "",
				}); // Set form data from API response.

				setError("");
			} catch (fetchError) {
				console.error("Error fetching product:", fetchError);
				setError(`${fetchError.message}: Failed to fetch product.`);
			} finally {
				setLoading(false);
			}
		};

		fetchProduct();
	}, [id]);

	const handleChange = (event) => {
		const { name, value } = event.target;
		setFormData((prevData) => ({ ...prevData, [name]: value }));
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		const form = event.currentTarget;
		if (form.checkValidity() === false) {
			event.stopPropagation();
			setValidated(true);
			return;
		}
		setValidated(true);
		setShowConfirmationModal(true); // Show the confirmation modal when the form is submitted and valid.
	};

	const handleConfirmChanges = async () => {
		setIsSubmitting(true);
		setSavingChanges(true);
		setError("");
		setSuccessMessage("");

		// Prepare the updated product data to be sent to the API. Ensure that the price is converted back to a number format for the API request, as it was stored as a string in the form state for input compatibility.
		const productUpdateData = {
			title: formData.title,
			price: Number(formData.price), // Keep as number so downstream rendering can safely format it.
			description: formData.description,
			category: formData.category,
			image: formData.image,
		}; // Prepare the updated product data object.

		try {
			const response = await axios.put(
				`https://fakestoreapi.com/products/${id}`,
				productUpdateData,
			);
			// next
			const savedProduct = {
				id,
				...productUpdateData,
				...(response.data || {}),
			};
			console.log(
				"successful API PUT request for updating product in EditProduct component:",
				savedProduct,
			);
			setUpdatedProduct(savedProduct);
			setSuccessMessage("Product was successfully updated!");
			setShowConfirmationModal(false);
		} catch (updateError) {
			console.error("Error updating product:", updateError);
			setError(`${updateError.message}: Failed to update product.`);
		} finally {
			setSavingChanges(false);
			setIsSubmitting(false);
		}
	};

	const handleCloseModal = () => {
		if (!isSubmitting) setShowConfirmationModal(false); // Only allow closing the modal if the form is not currently being submitted to prevent accidental closure during the save process.
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

	// Return JSX for edit product form with validation, error handling, and success messages.
	return (
		<Container className="py-4">
			{error && (
				<Alert
					variant="danger"
					dismissible
					className="mb-5 mt-0 py-2 alert-align-close text-center fs-5 fw-semibold"
				>
					{error}
				</Alert>
			)}

			{successMessage && (
				<Alert
					variant="success"
					dismissible
					// onClose={() => setSuccessMessage(null)}
					className="mb-5 mt-0 py-2 alert-align-close text-center fs-5 fw-semibold"
				>
					{successMessage}
				</Alert>
			)}
			{/* 
			<h1 className="mb-4 text-center fw-bold text-primary">
				Edit Product
			</h1> */}

			{/* EDIT PRODUCT FORM */}
			{!updatedProduct && (
				<div className="d-flex justify-content-center">
					<div className="w-100" style={{ maxWidth: "800px" }}>
						<h1 className="mb-4 text-center fw-bold text-primary">
							Edit Product
						</h1>
						<Form
							onSubmit={handleSubmit}
							noValidate
							validated={validated}
							className="border border-2 border-light-subtle p-4 rounded-4 shadow-lg bg-light"
						>
							{/* Row #1: image  */}
							<Row className="g-3">
								<Col md="12">
									{/* Form Image */}
									<Form.Group controlId="editFormImage">
										{/* <Form.Label className="fw-semibold text-center">
										Current Product Image
									</Form.Label> */}

										{formData.image ? (
											<div className="mb-5 mt-3 bg-light-subtle text-center">
												<img
													src={formData.image}
													alt={
														formData.title ||
														"Current Product"
													}
													style={{
														maxWidth: "400px",
														height: "300px",
														objectFit: "contain",
													}}
													className="border rounded bg-white shadow-sm py-3 px-5"
												/>
											</div>
										) : (
											<p>
												No image available for this
												product.
											</p>
										)}
									</Form.Group>
								</Col>
							</Row>

							{/* Row #2: Title and Price */}
							<Row className="g-3">
								<Col md="8">
									{/* Title */}
									<Form.Group
										controlId="editFormTitle"
										className="mb-4 px-2 me-auto"
									>
										<Form.Label className="fw-semibold">
											Product Title
										</Form.Label>

										<Form.Control
											type="text"
											name="title"
											placeholder="Enter product title"
											value={formData.title}
											onChange={handleChange}
											className="shadow-sm"
										/>

										<Form.Control.Feedback type="invalid">
											Please provide a valid title.
										</Form.Control.Feedback>
									</Form.Group>
								</Col>

								{/* Form Price */}
								<Col md="4">
									<Form.Group
										controlId="editFormPrice"
										className="mb-4 px-2"
									>
										<Form.Label className="fw-semibold">
											Price
										</Form.Label>

										<InputGroup>
											<InputGroup.Text>$</InputGroup.Text>

											<Form.Control
												type="number"
												name="price"
												placeholder="Enter product price"
												value={formData.price}
												onChange={handleChange}
												className="shadow-sm"
												min="0"
												step="0.01"
											/>

											<Form.Control.Feedback type="invalid">
												Please provide a valid price.
											</Form.Control.Feedback>
										</InputGroup>
									</Form.Group>
								</Col>
							</Row>

							{/* Row #3: Description and Category */}
							<Row className="g-4">
								<Col md="12">
									{/* Form Description */}
									<Form.Group
										controlId="editFormDescription"
										className="mb-0 px-2 me-auto"
									>
										<Form.Label className="fw-semibold">
											Description
										</Form.Label>
										<Form.Control
											as="textarea"
											name="description"
											placeholder="Enter product description"
											value={formData.description}
											onChange={handleChange}
											className="shadow-sm"
											rows={4}
										/>

										<Form.Control.Feedback type="invalid">
											Please provide a valid description.
										</Form.Control.Feedback>
									</Form.Group>
								</Col>
								{/* Form Category */}
								<Col md="4">
									<Form.Group
										controlId="editFormCategory"
										className="mb-3 px-2 me-auto"
									>
										<Form.Label className="fw-semibold">
											Category
										</Form.Label>

										<Form.Select
											name="category"
											value={formData.category}
											onChange={handleChange}
											className="shadow-sm"
										>
											<option value="">
												Select category...
											</option>
											{categories.map((category) => (
												<option
													key={category}
													value={category}
												>
													{category
														.charAt(0)
														.toUpperCase() +
														category.slice(1)}
												</option>
											))}
										</Form.Select>
									</Form.Group>
								</Col>
							</Row>

							{/* Buttons */}
							<div className="d-flex justify-content-end gap-3 mt-4">
								{/* Save Changes button */}
								<Button
									variant="primary"
									type="submit"
									className="px-3 py-2 fw-semibold rounded-pill shadow-sm"
									disabled={savingChanges}
								>
									{savingChanges
										? "Saving..."
										: "Save Changes"}
								</Button>

								{/* Back to Product Details button */}
								<Button
									variant="outline-secondary"
									type="button"
									className="px-3 py-2 fw-semibold rounded-pill shadow-sm"
									onClick={() =>
										navigate(`/product-details/${id}`)
									}
									disabled={savingChanges}
								>
									Back to Product Details
								</Button>
							</div>
						</Form>
					</div>
				</div>
			)}

			{/* UPDATED PRODUCT VIEW */}
			{updatedProduct && (
				<div className="d-flex flex-column flex-md-row align-items-center justify-content-center gap-5 mb-5 mx-5 py-4 px-5 border border-2 rounded-4 shadow-lg bg-light-subtle">
					{/* Image */}
					<img
						className="img-fluid border rounded bg-white shadow-md py-3 px-5"
						src={updatedProduct.image}
						alt={updatedProduct.title || "Updated Product"}
						style={{
							maxWidth: "400px",
							height: "350px",
							objectFit: "contain",
						}}
					/>

					{/* Product details */}
					<div className="flex-grow-1">
						<h2 className="fw-bold mb-3 text-center text-md-start ms-3">
							{updatedProduct.title}
						</h2>

						<ListGroup variant="flush" className="mb-4">
							{/* price */}
							<ListGroup.Item className="fs-4 text-primary fw-bold">
								${priceFormatter.format(updatedProduct.price)}
							</ListGroup.Item>

							{/* description */}
							<ListGroup.Item className="py-2">
								<strong>Description:</strong>{" "}
								{updatedProduct.description}
							</ListGroup.Item>

							{/* category */}
							<ListGroup.Item className="py-2">
								<strong>Category:</strong>{" "}
								{updatedProduct.category}
							</ListGroup.Item>
						</ListGroup>

						{/* Back to Product Listing button */}
						<div className="text-end me-3">
							<Button
								variant="outline-primary"
								type="button"
								onClick={() => navigate(`/product-listing`)}
								className="px-3 py-2 fw-semibold rounded-pill shadow-sm  "
							>
								Back to Products
							</Button>
						</div>
					</div>
				</div>
			)}

			<ConfirmChangesModal
				show={showConfirmationModal}
				formData={formData}
				onConfirm={handleConfirmChanges}
				onCancel={handleCloseModal}
				isSubmitting={isSubmitting}
				heading="Edit Product"
				confirmLabel="Confirm Changes"
				savingLabel="Saving..."
			/>
		</Container>
	); // end of return statement for edit product component.
} // end of edit product component.

export default EditProduct;
