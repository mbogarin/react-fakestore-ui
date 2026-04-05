import Container from "react-bootstrap/Container";

function HomePage() {
	return (
		<Container
			className="text-center my-5 mx-auto welcome-container d-flex flex-column align-items-center"
			style={{ maxWidth: "800px" }}
		>
			<h1
				className="fw-bold mb-3 text-primary"
				style={{ fontSize: "3rem" }}
			>
				Welcome to the Fake Store!
			</h1>

			<h2 className="lead mb-4 fs-3">
				Your <strong className="fw-bold">one-stop</strong> shop for all
				things fake!
			</h2>

			<div className="mx-auto" style={{ maxWidth: "800px" }}>
				<p className="fs-5 mb-0">
					Browse our collection of products and find great deals on a
					variety of items.
				</p>
				<p className="fs-5 mb-3">
					From electronics to fashion, we have something for everyone.
				</p>

				<h4 className="fs-3">Happy shopping!</h4>
			</div>

			<div>
				<a href="/product-listing" className="btn btn-primary mt-4">
					View Products
				</a>
			</div>
		</Container>
	);
}

export default HomePage;
