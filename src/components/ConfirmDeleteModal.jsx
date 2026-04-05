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
		<Modal show={show} onHide={handleClose} centered>
			<Modal.Header closeButton>
				<Modal.Title className="fw-bold text-danger">
					Confirm Deletion
				</Modal.Title>
			</Modal.Header>

			<Modal.Body className="text-center">
				<p>
					Are you sure you want to delete{" "}
					<strong>{productName}</strong>?
				</p>
				<p>This action cannot be undone.</p>
			</Modal.Body>

			<Modal.Footer>
				<Button
					variant="secondary"
					onClick={handleClose}
					disabled={loading}
				>
					Cancel
				</Button>
				<Button variant="danger" onClick={onConfirm} disabled={loading}>
					{loading ? "Deleting..." : "Delete"}
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

export default ConfirmDeleteModal;
