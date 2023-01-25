// Get the form to update items
const cartItemUpdateFormElements = document.querySelectorAll(
	".cart-item-management"
);

// Function to handle updating item
async function updateCartItem(event) {
	// Prevent that the forms send default request
	event.preventDefault();

	// Get the specific form submitted
	const form = event.target;

	// Get product id and csrf token from the datase of the form
	const productId = form.dataset.productid;
	const csrfToken = form.dataset.csrf;

	// Get the quantity of the input inside the form
	const quantity = form.firstElementChild.value;

	// Make the ajax request
	let response;
	try {
		response = await fetch("/cart/items", {
			method: "PATCH",
			body: JSON.stringify({
				productId: productId,
				quantity: quantity,
				_csrf: csrfToken,
			}),
			headers: {
				"Content-Type": "application/json",
			},
		});
	} catch (error) {
		alert("Something went wrong!");
		return;
	}

	// Check if we had an error in the response and alert
	if (!response.ok) {
		alert("Something went wrong!");
		return;
	}

	// If wverything went ok with the response then we convert the response back into a js object
	const responseData = await response.json();

	// Now we need to update the DOM

	// Check if an item's quantity is 0
	if (responseData.updatedCartItem.updatedItemPrice === 0) {
		// Select the list item that had this item and remove it
		form.parentElement.parentElement.remove();
	} else {
		// Get and save response data and updated
		const cartItemTotalPriceElement =
			form.parentElement.querySelector(".cart-item-price");
		cartItemTotalPriceElement.textContent =
			responseData.updatedCartItem.updatedItemPrice.toFixed(2);
	}

	const cartTotalPriceElement = document.getElementById("cart-total-price");
	cartTotalPriceElement.textContent =
		responseData.updatedCartItem.newTotalPrice.toFixed(2);

	// Select all to update badges in desktop and mobile menus
	const cartBadge = document.querySelectorAll(".nav-item .badge");
	for (const badge of cartBadge) {
		badge.textContent = responseData.updatedCartItem.newTotalQuantity;
	}
}

// We add an event lister to all items in the cart
for (const formElement of cartItemUpdateFormElements) {
	formElement.addEventListener("submit", updateCartItem);
}
