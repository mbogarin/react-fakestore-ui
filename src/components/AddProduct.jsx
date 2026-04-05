import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";
import InputGroup from "react-bootstrap/InputGroup";
import Modal from "react-bootstrap/Modal";
import axios from "axios";
import { fallbackProducts } from "../fallback";

const placeholderImage = "https://picsum.photos/400/300?random=21";

const initialFormData = {
	title: "",
	price: "",
	description: "",
	category: "",
};

const getRandomPlaceholderImage = () => {
	return `https://picsum.photos/400/300?random=${Date.now()}-${Math.floor(Math.random() * 100000)}`; // Generate a random number between 1 and 100 to create a unique placeholder image URL + timestamp to ensure uniqueness on each call.
};

const getPreviewImageUrl = (image) => {
	if (typeof image === "string" && image.trim() !== "") {
		return image; // Use the existing image URL if it's a valid string.
	}
	return placeholderImage; // Fallback to the default placeholder image if no valid image is available for preview.
};

const getNextFallbackId = () => {
	if (fallbackProducts.length === 0) return 1; // Start with ID 1 if there are no existing fallback products.
	return Math.max(...fallbackProducts.map((item) => Number(item.id))) + 1; // Generate the next fallback ID based on existing fallback products.
};

const AddProduct = () => {
	const [formData, setFormData] = useState(initialFormData);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState(null);
	const [validated, setValidated] = useState(false);
	const [showModal, setShowModal] = useState(false);
	const [productPreview, setProductPreview] = useState(null);
	const navigate = useNavigate();

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prevData) => ({ ...prevData, [name]: value }));
	};

	const resetForm = () => {
		setFormData(initialFormData);
		setProductPreview(null);
		setValidated(false);
		setError(null);
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		const addForm = e.currentTarget;
		if (addForm.checkValidity() === false) {
			e.stopPropagation();
			setValidated(true);
			return;
		}

		const randomPlaceholderImage = getRandomPlaceholderImage(); // Generate a random placeholder image URL for the new product.

		const newProduct = {
			title: formData.title,
			price: formData.price,
			description: formData.description,
			category: formData.category,
			image: randomPlaceholderImage, // Use the generated random placeholder image URL for the new product.
		};

		setProductPreview(newProduct);
		setShowModal(true);
		setValidated(true);
	};

	const handleCloseModal = () => {
		setShowModal(false);
	};

	const handleConfirmAdd = async () => {
		if (isSubmitting) return; // Prevent multiple submissions
		setIsSubmitting(true);

		const selectedPlaceholderImage =
			typeof productPreview.image === "string" &&
			productPreview.image.trim() !== ""
				? productPreview.image
				: getRandomPlaceholderImage(); // Use the existing image URL if it's a string, otherwise fallback to the default placeholder image.

		const productDataToSubmit = {
			title: formData.title,
			price: Number(formData.price), // Ensure price is sent as a number to the API.
			description: formData.description,
			category: formData.category,
			image: selectedPlaceholderImage, // Use the selected placeholder image URL for the new product.
		}; //

		try {
			const response = await axios.post(
				"https://fakestoreapi.com/products",
				productDataToSubmit,
			);
			const createdProduct = response.data || productDataToSubmit; // Use the response data if available, otherwise fallback to the submitted data.
			setError(null);
			sessionStorage.setItem(
				"flashSuccessMessage",
				`${createdProduct.title || "Product"} was successfully added!`,
			);
			navigate("/product-listing");
		} catch {
			const fallbackCreatedProduct = {
				id: getNextFallbackId(),
				...productDataToSubmit,
			}; // Create a fallback product object with the submitted data and a new ID.

			fallbackProducts.unshift(fallbackCreatedProduct); // Add the new product to the beginning of the fallback data array to ensure it appears first in the product listing.
			setError(null);
			sessionStorage.setItem(
				"flashSuccessMessage",
				`${fallbackCreatedProduct.title || "Product"} was successfully added to fallback data!`,
			);
			navigate("/product-listing");
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleDelete = () => {
		resetForm();
		setShowModal(false);
	};

	const previewImageUrl = getPreviewImageUrl(productPreview?.image); // Get the preview image URL based on the current product preview state.

	const renderImage = () => {
		if (!productPreview) return null;
		return (
			<img
				src={previewImageUrl}
				alt="Product Preview"
				className="border rounded shadow-md p-0"
				style={{
					maxWidth: "100%",
					height: "100%",
					objectFit: "contain",
				}}
			/>
		);
	};

	// Returned JSX:
	return (
		<Container className="py-4">
			<div className="d-flex justify-content-center">
				<div className="w-100" style={{ maxWidth: "800px" }}>
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

					<h1 className="mb-4 text-center fw-bold text-primary">
						Add New Product
					</h1>

					<Form
						onSubmit={handleSubmit}
						noValidate
						validated={validated}
						className="border border-2 border-light-subtle p-4 rounded-4 shadow-lg bg-light"
					>
						<Row className="g-3">
							<Col md="8">
								<Form.Group
									controlId="formTitle"
									className="mb-4 px-2 me-auto"
								>
									<Form.Label className="fw-semibold">
										Product Title
									</Form.Label>
									<Form.Control
										type="text"
										placeholder="Enter product title"
										name="title"
										value={formData.title}
										onChange={handleChange}
										required
										className="shadow-sm"
									/>
									<Form.Control.Feedback type="invalid">
										Please provide a product title.
									</Form.Control.Feedback>
								</Form.Group>
							</Col>
							<Col md="4">
								<Form.Group
									controlId="formPrice"
									className="mb-5 px-2"
								>
									<Form.Label className="fw-semibold">
										Price
									</Form.Label>
									<InputGroup>
										<InputGroup.Text>$</InputGroup.Text>
										<Form.Control
											type="number"
											placeholder="Enter product price"
											name="price"
											value={formData.price}
											onChange={handleChange}
											required
											className="shadow-sm"
										/>
										<Form.Control.Feedback type="invalid">
											Please provide a product price.
										</Form.Control.Feedback>
									</InputGroup>
								</Form.Group>
							</Col>
						</Row>

						{/* Row #3: Description and Category */}
						<Row className="g-4">
							<Col md="12">
								<Form.Group
									controlId="formDescription"
									className="mb-3 px-2 me-auto"
								>
									<Form.Label className="fw-semibold">
										Description
									</Form.Label>
									<Form.Control
										as="textarea"
										rows={4}
										placeholder="Enter product description"
										name="description"
										value={formData.description}
										onChange={handleChange}
										required
										className="shadow-sm"
									/>
									<Form.Control.Feedback type="invalid">
										Please provide a product description.
									</Form.Control.Feedback>
								</Form.Group>
							</Col>
							<Col md="4">
								<Form.Group
									controlId="formCategory"
									className="mb-3 px-2 me-auto"
								>
									<Form.Label className="fw-semibold">
										Category
									</Form.Label>
									<Form.Select
										aria-label="Select product category"
										name="category"
										value={formData.category}
										onChange={handleChange}
										required
										className="shadow-sm"
									>
										<option hidden value="">
											Select category...
										</option>
										<option value="electronics">
											Electronics
										</option>
										<option value="jewelery">
											Jewelery
										</option>
										<option value="clothing">
											Clothing
										</option>
										<option value="home essentials ">
											Home Essentials
										</option>
										<option value="other">Other</option>
									</Form.Select>
									<Form.Control.Feedback type="invalid">
										Please select a product category.
									</Form.Control.Feedback>
								</Form.Group>
							</Col>
						</Row>

						<div className="d-flex justify-content-end gap-3 mt-4">
							<Button
								variant="primary"
								type="submit"
								className="px-3 py-2 fw-semibold rounded-pill shadow-sm"
								disabled={isSubmitting}
							>
								Add Product
							</Button>
						</div>
					</Form>
				</div>
			</div>

			<Modal
				show={showModal}
				onHide={isSubmitting ? undefined : handleCloseModal}
				centered
				backdrop={isSubmitting ? "static" : true}
				keyboard={!isSubmitting}
				contentClassName="rounded-4 shadow-lg border border-2 border-primary-subtle"
			>
				<Modal.Header
					closeButton={!isSubmitting}
					className="bg-primary text-white rounded-top-4 border-bottom-0"
					closeVariant="white"
				>
					<Modal.Title className="w-100 text-center">
						<h3 className="fw-semibold fs-3 px-2 mb-0">
							{productPreview?.title}
						</h3>
					</Modal.Title>
				</Modal.Header>
				<Modal.Body className="text-center bg-light-subtle">
					{productPreview && (
						<div>
							{renderImage()}
							<p className="mt-3 mb-3 fs-6">
								<span className="badge bg-success fs-6 px-3 py-2 mb-2">
									${productPreview?.price}
								</span>
							</p>
							<p className="mt-3 mb-3 fs-6">
								<strong>Description:</strong>{" "}
								{productPreview?.description}
							</p>
							<p>
								<strong>Category:</strong>{" "}
								<span className="text-primary">
									{productPreview?.category}
								</span>
							</p>
						</div>
					)}
				</Modal.Body>
				<Modal.Footer className="bg-light-subtle rounded-bottom-4 border-top-0 d-flex justify-content-between px-3">
					{/* Cancel Button */}
					<Button
						variant="outline-danger"
						onClick={handleDelete}
						disabled={isSubmitting}
						className="px-3 py-2 rounded-pill fw-semibold shadow-sm"
					>
						Cancel
					</Button>

					{/* Confirm Button */}
					<Button
						variant="primary"
						onClick={handleConfirmAdd}
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
									className="me-2"
								/>
								Saving...
							</>
						) : (
							"Confirm Changes"
						)}
					</Button>
				</Modal.Footer>
			</Modal>
		</Container>
	);
};

export default AddProduct;
