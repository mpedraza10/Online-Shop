// Get the variables
const deleteProductBtnElements = document.querySelectorAll(
	".product-item button"
);

// Function to delete the product
async function deleteProduct(event) {
	// Get the exact button that was clicked using the event target
	const buttonElement = event.target;

	// Get the dataset product id and csrf token
	const productId = buttonElement.dataset.productid;
	const csrfToken = buttonElement.dataset.csrf;

	// Use fetch function for doing an ajax request (We need to add the csrf token as parameters)
	const response = await fetch("/admin/products/" + productId + "?_csrf=" + csrfToken, {
		method: "DELETE",
	});

    // If there was an error we return
    if (!response.ok) {
        alert("Something went wrong!");
        return;
    }

    // Call the dom method remove on the list item product
    buttonElement.parentElement.parentElement.parentElement.parentElement.remove();
}

// Add event listeners
for (const deleteProductBtnElement of deleteProductBtnElements) {
	deleteProductBtnElement.addEventListener("click", deleteProduct);
}
