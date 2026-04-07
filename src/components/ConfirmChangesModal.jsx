import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";

const getRandomPlaceholderImage = () =>
	`https://picsum.photos/400/300?random=${Date.now()}-${Math.floor(Math.random() * 100000)}`;

const formatPrice = (value) => {
	const parsed = Number(value);
	if (Number.isNaN(parsed)) return "0.00";
	return parsed.toFixed(2);
};

const ConfirmChangesModal = ({
	show,
	formData,
	onConfirm,
	onCancel,
	isSubmitting = false,
	heading = "Confirm Changes",
	confirmLabel = "Confirm Changes",
	savingLabel = "Saving...",
}) => {
	const imageSource = formData?.image?.trim()
		? formData.image
		: getRandomPlaceholderImage();

	return (
		<Modal
			show={show}
			onHide={isSubmitting ? undefined : onCancel}
			centered
			backdrop={isSubmitting ? "static" : true}
			keyboard={!isSubmitting}
			contentClassName="rounded-4 shadow-lg border border-2 border-primary-subtle"
			size="lg"
		>
			<Modal.Header
				closeButton={!isSubmitting}
				className="bg-primary text-white rounded-top-4 border-bottom-0 py-3 px-2 mb-2"
				closeVariant="white"
			>
				<h3 className="text-center w-100 fw-semibold fs-3 mb-0 ps-4 pe-3">
					{heading}
				</h3>
			</Modal.Header>

			<Modal.Body className="text-center bg-light-subtle">
				<div>
					<Modal.Title className="w-100 text-center">
						<h3 className="fw-semibold fs-3 mt-4 mb-4">
							{formData?.title || "Untitled Product"}
						</h3>
					</Modal.Title>

					<div className=" text-center img-fluid mb-3 mt-1">
						<img
							src={imageSource}
							alt={formData?.title || "Product Image Preview"}
							style={{
								maxWidth: "600px",
								maxHeight: "300px",
								objectFit: "contain",
							}}
							className="shadow-md px-5"
						/>
					</div>

					<p className="m-4">
						<span className="badge bg-success fs-5 px-4 py-2 mb-2 fw-semibold">
							${formatPrice(formData?.price)}
						</span>
					</p>

					<p className="mt-5 fs-5 text-start mx-5 text-justify">
						<strong>Description:</strong> {formData?.description}
					</p>

					<p className="mt-3 fs-5 text-start mx-5 text-justify">
						<strong>Category:</strong>{" "}
						<span className="text-primary">
							{formData?.category}
						</span>
					</p>
				</div>
			</Modal.Body>

			<Modal.Footer className="bg-light-subtle rounded-bottom-4 border-top-0 d-flex justify-content-between px-3 mb-2 me-2">
				<div className="d-flex justify-content-end gap-3 w-100 me-2">
					<Button
						variant="primary"
						onClick={onConfirm}
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
								/>
								{savingLabel}
							</>
						) : (
							confirmLabel
						)}
					</Button>

					<Button
						variant="outline-danger"
						onClick={onCancel}
						disabled={isSubmitting}
						className="px-3 py-2 rounded-pill fw-semibold shadow-sm"
					>
						Cancel
					</Button>
				</div>
			</Modal.Footer>
		</Modal>
	);
};

export default ConfirmChangesModal;
