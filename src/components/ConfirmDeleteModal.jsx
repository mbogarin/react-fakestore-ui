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
			contentClassName="rounded-4 shadow-lg border border-2 border-danger-subtle"
		>
			<Modal.Header closeButton>
				<Modal.Title className="fw-bold text-danger text-center w-100 mt-0">
					Confirm Deletion
				</Modal.Title>
			</Modal.Header>

			<Modal.Body className="text-center fs-5">
				<p>
					Are you sure you want to delete
					<br />
					<strong className="fw-bold">{productName}</strong>?
				</p>
				<p className="mt-4 fw-light fst-italic mb-0 py-0">
					This action cannot be undone.
				</p>
			</Modal.Body>

			<Modal.Footer className="d-flex justify-content-center gap-3">
				{/* Cancel button */}
				<Button
					variant="secondary"
					onClick={handleClose}
					disabled={loading}
					className="fw-semibold"
				>
					Cancel
				</Button>

				{/* Confirm Delete button */}
				<Button
					variant="danger"
					onClick={onConfirm}
					disabled={loading}
					className="fw-semibold"
				>
					{loading ? "Deleting..." : "Delete"}
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

export default ConfirmDeleteModal;
