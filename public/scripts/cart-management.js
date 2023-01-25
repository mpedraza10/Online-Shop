// Select the add to cart btn
const addToCartBtnElement = document.querySelector("#product-details button");
const numItemsBadgeElement = document.querySelectorAll(".nav-item .badge");

// Function to add item to cart
async function addToCart() {
	// Get the product id of the dataset
	const productId = addToCartBtnElement.dataset.productid;
    const addCsrfToken = addToCartBtnElement.dataset.csrf;

	// Make the ajax post request sending the product id
    let response;
	try {
        response = await fetch("/cart/items", {
            method: "POST",
            body: JSON.stringify({
                productId: productId,
                _csrf: addCsrfToken,
            }),
            headers: {
                "Content-Type": "application/json",
            },
        });
    } catch (error) {
        alert("Something went wrong! fetch ")
    }

    // If we didn't have a valid response we return
    if (!response.ok) {
        alert("Something went wrong! not valid response");
        return;
    }

    // Once the response came back then we check the response body data to update nums of items
    const responseData = await response.json(); // Parses json and return regular js object

    // Know we save the new total items to update front end
    const newTotalQuantity = responseData.newTotalItems;
    for (const badge of numItemsBadgeElement) {
        badge.textContent = newTotalQuantity;
    }
}

// Set click event lister
addToCartBtnElement.addEventListener("click", addToCart);
