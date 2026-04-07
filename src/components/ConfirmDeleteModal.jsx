import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

const ConfirmDeleteModal = ({
	show,
	productName,
	onConfirm,
	onCancel,
	onHide,
	loading = false,
}) => {
	const handleClose = onCancel || onHide; // Use onCancel if provided, otherwise fallback to onHide.

	return (
		<Modal
			show={show}
			onHide={handleClose}
			centered
			backdrop={loading ? "static" : true}
			keyboard={!loading}
			contentClassName="rounded-4 shadow-lg border border-2 "
			// size="lg"
		>
			<Modal.Header
				closeButton
				closeVariant="white"
				className="bg-danger text-white rounded-top-4 border-bottom-0"
			>
				<Modal.Title className="fw-bold text-center w-100 fs-5 ms-4">
					Confirm Deletion
				</Modal.Title>
			</Modal.Header>

			<Modal.Body className="text-center d-flex flex-column align-items-center justify-content-center">
				<p className="fs-5 mt-1">
					Are you sure you want to delete this product?
				</p>
				<p className="fw-bold px-5 mt-2">{productName}</p>
				<p className=" text-danger mt-2 fs-6">
					(<strong>Note:</strong> this action cannot be undone).
				</p>
			</Modal.Body>

			<Modal.Footer className="d-flex justify-content-center gap-2">
				<Button
					variant="outline-secondary"
					onClick={handleClose}
					disabled={loading}
					className="fw-semibold px-4 alert-align-close"
				>
					Cancel
				</Button>

				{/* Confirm Delete button */}
				<Button
					variant="outline-danger"
					onClick={onConfirm}
					disabled={loading}
					className="fw-semibold px-4"
				>
					{loading ? "Deleting..." : "Delete"}
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

export default ConfirmDeleteModal;
