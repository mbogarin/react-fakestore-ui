import Container from "react-bootstrap/Container";

function HomePage() {
	return (
		<Container
			className="text-center my-5 mx-auto"
			style={{ maxWidth: "800px" }}
		>
			<h1 className="fw-bold mb-3 text-primary">
				Welcome to the Fake Store!
			</h1>

			<h5 className="lead mb-3">
				Your <strong className="fw-bold">one-stop</strong> shop for all
				things fake!
			</h5>

			<div className="mx-auto" style={{ maxWidth: "600px" }}>
				<p>
					Browse our collection of products and find great deals on a
					variety of items. From electronics to fashion, we have
					something for everyone.
				</p>
				<h6>Happy shopping!</h6>
			</div>

			<div>
				<a href="/product-listing" className="btn btn-primary mt-5">
					View Products
				</a>
			</div>
		</Container>
	);
}

export default HomePage;
