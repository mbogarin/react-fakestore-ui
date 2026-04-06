import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";
import Modal from "react-bootstrap/Modal";
import InputGroup from "react-bootstrap/InputGroup";

import axios from "axios";
import { fallbackProducts } from "../fallback";

// Extract unique categories from the fallback products:
const uniqueCategories = Array.from(
	new Set(fallbackProducts.map((product) => product.category)),
); //

function EditProduct() {
	const { id } = useParams();
	const navigate = useNavigate();

	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [validated, setValidated] = useState(false);

	const [successMessage, setSuccessMessage] = useState(null); // State to hold the success message after saving the product.
	const [savingChanges, setSavingChanges] = useState(false); // State to track if the product is being saved.
	const [showModal, setShowModal] = useState(false); // State to control the visibility of the modal.
	const [isSubmitting, setIsSubmitting] = useState(false); // State to track if the form is being submitted.

	const [formData, setFormData] = useState({
		title: "",
		price: "",
		description: "",
		category: "",
		image: "",
	});

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

				// Fallback to local data if API call fails:
				const fallbackProduct = fallbackProducts.find(
					(item) => item.id.toString() === id.toString(),
				);
				if (!fallbackProduct) {
					console.error(
						`${fetchError.message}: Failed to fetch product and no fallback data available.`,
					);
					setError(
						`${fetchError.message}: Failed to fetch product and no fallback data available.`,
					);
				} else {
					setFormData({
						title: fallbackProduct.title || "",
						price: String(fallbackProduct.price ?? ""), // Convert price to string for form input compatibility.
						description: fallbackProduct.description || "",
						category: fallbackProduct.category || "",
						image: fallbackProduct.image || "",
					}); // Set form data from fallback data if API call fails.

					console.error(
						`${fetchError.message}: Failed to fetch product. Displaying fallback data.`,
					);
					setError(
						`${fetchError.message}: Failed to fetch product. Displaying fallback data.`,
					);
				}
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
		setShowModal(true); // Show the confirmation modal when the form is submitted and valid.
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
			await axios.put(
				`https://fakestoreapi.com/products/${id}`,
				productUpdateData,
			);
			console.log(
				"successful API PUT request for updating product in EditProduct component:",
				productUpdateData,
			);
			setSuccessMessage("Product was successfully updated!");
			navigate(`/product-details/${id}`);
		} catch (updateError) {
			console.error(
				"Error updating product. Falling back to local data:",
				updateError,
			);
			const fallbackIndex = fallbackProducts.findIndex(
				(item) => item.id.toString() === id.toString(),
			);

			const fallbackUpdatedProduct = {
				id: Number(id),
				...productUpdateData,
			}; // Create an updated product object for the fallback data with the same ID and the new details.

			if (fallbackIndex !== -1) {
				fallbackProducts[fallbackIndex] = {
					...fallbackProducts[fallbackIndex],
					...fallbackUpdatedProduct,
				}; // Update the existing product in fallback data with the new details.
			} else {
				fallbackProducts.unshift(fallbackUpdatedProduct); // Add as new item when product does not exist in fallback data.
			}

			setSuccessMessage(
				"Product was successfully updated in fallback data!",
			);
			navigate(`/product-details/${id}`);
		} finally {
			setSavingChanges(false);
			setIsSubmitting(false);
			setShowModal(false); // Hide the confirmation modal after the API call is completed, regardless of success or failure.
		}
	};

	const handleCloseModal = () => {
		if (!isSubmitting) setShowModal(false); // Only allow closing the modal if the form is not currently being submitted to prevent accidental closure during the save process.
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

			<h1 className="mb-4 text-center fw-bold text-primary">
				Edit Product
			</h1>

			<div className="d-flex justify-content-center">
				<div className="w-100" style={{ maxWidth: "800px" }}>
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
											No image available for this product.
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
											value={Number(
												formData.price,
											).toFixed(2)}
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
										{uniqueCategories.map((category) => (
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
								{savingChanges ? "Saving..." : "Save Changes"}
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

			{/* Modal - Edit Product */}
			<Modal
				show={showModal}
				onHide={handleCloseModal}
				centered
				backdrop={isSubmitting ? "static" : true}
				keyboard={!isSubmitting}
				contentClassName="rounded-4 shadow-lg border border-2 border-primary-subtle"
				size="lg"
			>
				{/* Modal Header: Title */}
				<Modal.Header
					closeButton={!isSubmitting}
					className="bg-primary text-white rounded-top-4 border-bottom-0 py-3 px-2 mb-2"
					closeVariant="white"
				>
					<Modal.Title className="w-100 text-center">
						<h3 className="fw-semibold fs-4 mb-0 ps-4 pe-3">
							{formData.title}
						</h3>
					</Modal.Title>
				</Modal.Header>

				{/* Modal Body */}
				<Modal.Body className="text-center bg-light-subtle">
					<div>
						{/* Modal Image */}
						{formData.image && (
							<div className="mb-3 text-center img-fluid">
								<img
									src={formData.image}
									alt={
										formData.title ||
										"Product Image Preview"
									}
									style={{
										maxWidth: "600px",
										height: "300px",
										objectFit: "contain",
									}}
									className="shadow-md py-3 px-5 border rounded"
								/>
							</div>
						)}

						{/* Modal Price */}
						<p className="mt-4 mb-3">
							<span className="badge bg-success fs-5 px-4 py-2 mb-2 fw-semibold">
								{" "}
								${Number(formData.price).toFixed(2)}{" "}
							</span>
						</p>

						{/* Modal Description */}
						<p className="mt-4 fs-5 text-start mx-4 text-justify">
							<strong>Description:</strong> {formData.description}
						</p>

						{/* Modal Category */}
						<p className="mt-4 fs-5 text-start mx-4 text-justify">
							<strong>Category:</strong>{" "}
							<span className="text-primary">
								{formData.category}
							</span>
						</p>
					</div>
				</Modal.Body>

				{/* Modal Footer */}
				<Modal.Footer className="bg-light-subtle rounded-bottom-4 border-top-0 d-flex justify-content-between px-3">
					{/* Modal Buttons */}
					<div className="d-flex justify-content-end gap-3 w-100 me-2">
						{/* Confirm button */}
						<Button
							variant="primary"
							onClick={handleConfirmChanges}
							disabled={isSubmitting}
							className="px-3 py-2 rounded-pill fw-bold shadow-sm"
						>
							{isSubmitting ? (
								<>
									<Spinner
										as="span"
										animation="border"
										size="sm"
										role="status"
										aria-hidden="true"
										className="me-2"
									/>{" "}
									Saving...
								</>
							) : (
								"Confirm Changes"
							)}
						</Button>

						{/* Cancel button */}
						<Button
							variant="outline-danger"
							onClick={handleCloseModal}
							disabled={isSubmitting}
							className="px-3 py-2 rounded-pill fw-semibold shadow-sm"
						>
							Cancel
						</Button>
					</div>
				</Modal.Footer>
			</Modal>
		</Container>
	); // end of return statement for edit product component.
} // end of edit product component.

export default EditProduct;
