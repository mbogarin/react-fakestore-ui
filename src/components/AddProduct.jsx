import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import InputGroup from "react-bootstrap/InputGroup";
import axios from "axios";

import ConfirmChangesModal from "./ConfirmChangeModal";

const initialFormData = {
	title: "",
	price: "",
	description: "",
	category: "",
};

const AddProduct = () => {
	const [formData, setFormData] = useState(initialFormData);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState(null);
	const [validated, setValidated] = useState(false);
	const [showConfirmModal, setShowConfirmModal] = useState(false);
	const [categories, setCategories] = useState([]);
	const navigate = useNavigate();

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

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prevData) => ({ ...prevData, [name]: value })); //
	}; //

	const resetForm = () => {
		setFormData(initialFormData);
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

		setShowConfirmModal(true);
		setValidated(true);
	};

	const handleConfirmAdd = async () => {
		if (isSubmitting) return; // Prevent multiple submissions
		setIsSubmitting(true);

		// API call:
		try {
			const response = await axios.post(
				"https://fakestoreapi.com/products",
				formData,
			);
			console.log(
				"successful API POST request for added product in AddProduct component:",
				response.data,
			);

			const createdProduct = response.data || formData; // Use the response data if available, otherwise fallback to the submitted data.
			setError(null);
			sessionStorage.setItem(
				"flashSuccessMessage", // Store a success message in session storage to be displayed on the product listing page after redirection.
				`${createdProduct.title || "Product"} was successfully added!`,
			);

			navigate("/product-listing");
		} catch (addError) {
			console.error("Error adding product:", addError);
			setError(`${addError.message}: Failed to add product to API.`);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleClose = () => {
		resetForm();
		setShowConfirmModal(false);
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
							className="mb-5 mt-0 py-2 alert-align-close text-center fs-5 fw-semibold"
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
										name="category"
										value={formData.category}
										onChange={handleChange}
										className="shadow-sm"
										aria-label="Select product category"
										required
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

			<ConfirmChangesModal
				show={showConfirmModal}
				formData={formData}
				onConfirm={handleConfirmAdd}
				onCancel={handleClose}
				isSubmitting={isSubmitting}
				heading="Confirm Add"
				confirmLabel="Confirm Changes"
				savingLabel="Saving..."
			/>
		</Container>
	);
};

export default AddProduct;
