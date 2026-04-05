import { NavLink } from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";

function NavBar() {
	return (
		<Navbar
			fixed="top"
			bg="dark"
			variant="dark"
			expand="lg"
			className="p-3 mb-4 shadow"
		>
			<Navbar.Brand as={NavLink} to="/" className="fs-4 fw-bold">
				FakeStore
			</Navbar.Brand>

			<Navbar.Toggle aria-controls="basic-navbar-nav" />

			<Navbar.Collapse id="basic-navbar-nav">
				<Nav className="ms-auto fs-5">
					<Nav.Link as={NavLink} to="/">
						Home
					</Nav.Link>

					<Nav.Link as={NavLink} to="/product-listing">
						Products
					</Nav.Link>

					<Nav.Link as={NavLink} to="/add-product">
						Add Product
					</Nav.Link>
				</Nav>
			</Navbar.Collapse>
		</Navbar>
	);
}

export default NavBar;
