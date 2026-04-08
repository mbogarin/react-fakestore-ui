# FakeStore API React App

## Author

**Magali Bogarin**  
GitHub: https://github.com/mbogarin

## 📑 Table of Contents

- [Project Description](#project-description)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Screenshots](#screenshots)
- [Roadmap](#roadmap)
- [Collaborators](#collaborators)
- [Project Structure](#project-structure)
- [Notes](#notes)

## Project Description

This project is a React-based web application that integrates with the **FakeStore API** to display, create, update, and delete products. It demonstrates core React concepts such as component structure, routing, state management, API handling, and user interaction through modals and forms.

The app provides a simple and interactive interface for managing product data, simulating a basic e-commerce admin experience.

---

## Features

- Fetch and display products from an external API
- View individual product details
- Add new products using a form and modal
- Edit existing products
- Delete products with confirmation modal
- Client-side routing using React Router
- Loading and error handling for API requests
- Reusable components (Navbar, Product Cards, Modals)
- Responsive UI using Bootstrap

---

## Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/fakestore-react-app.git
```

2. Navigate into the project folder:

```bash
cd fakestore-react-app
```

3. Install dependencies:

```bash
npm install
```

4. Start the development server:

```bash
npm run dev
```

---

## Usage

- Browse all products on the homepage
- Click on a product to view more details
- Use the **Add Product** button to create a new item
- Edit or delete products using the available actions
- Experience loading states and error handling during API calls

---

## Screenshots

### Product List Page

![Product List Page](/src/assets/product-listiing-page.png)

### Product Details Page

![Product Details Page](/src/assets/product-details-page.png)

### Add/Edit Product Modal

![Add Product Page](/src/assets/add-product-form.png)
![Edit Product Page](/src/assets/edit-product-form.png)

### Delete Confirmation Modal

![Delete Confirmation Modal](/src/assets/confirmation-delete-modal.png)

---

## Roadmap

- [ ] Add user authentication
- [ ] Persist data with a real backend instead of FakeStore API
- [ ] Improve form validation
- [ ] Add search and filtering functionality
- [ ] Enhance UI/UX with animations and better styling

---

## Collaborators

- **Magali Bogarin** – Developer

### Credits

- Classmates and mentors at coding temple

---

## Project Structure

```bash
fakestore-react-app/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── ProductCard.jsx
│   │   ├── AddProductModal.jsx
│   │   ├── EditProductModal.jsx
│   │   └── DeleteConfirmModal.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   └── ProductDetails.jsx
│   ├── App.jsx
│   └── main.jsx
├── public/
└── package.json
```

---

## Notes

- This project uses the **FakeStore API**, so changes (add/edit/delete) may not persist permanently
- Axios is used for API requests
- React Router is used for navigation between pages
- Bootstrap is used for styling and layout
