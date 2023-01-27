// Select every form of the orders 
const updateOrderFormElements = document.querySelectorAll(
	".order-actions form"
);

async function updateOrder(event) {
    // Prevent the default behavior of submission
	event.preventDefault();

    // Now we target the specific form submmited
	const form = event.target;

    // Now we create a FormData in order to access the get method to easily select values of the form
	const formData = new FormData(form);
	const newStatus = formData.get("status");
	const orderId = formData.get("orderid");
	const csrfToken = formData.get("_csrf");

    // Send the ajax patch request 
	let response;
	try {
		response = await fetch(`/admin/orders/${orderId}`, {
			method: "PATCH",
			body: JSON.stringify({
				newStatus: newStatus,
				_csrf: csrfToken,
			}),
			headers: {
				"Content-Type": "application/json",
			},
		});
	} catch (error) {
		alert("Something went wrong - could not update order status.");
		return;
	}

    // If the response wasn't successfull we return an alert with error
	if (!response.ok) {
		alert("Something went wrong - could not update order status.");
		return;
	}

    // We convert the json response into a js object
	const responseData = await response.json();

    // Now we change the text content to the new status
	form.parentElement.parentElement.querySelector(".badge").textContent =
		responseData.newStatus.toUpperCase();
}

// Add every form of an order an event listener to submit
for (const updateOrderFormElement of updateOrderFormElements) {
	updateOrderFormElement.addEventListener("submit", updateOrder);
}
