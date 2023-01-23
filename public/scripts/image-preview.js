// Save variables we are using
const imagePickerElement = document.querySelector(
	"#image-upload-control input"
);
const imagePreviewElement = document.querySelector("#image-upload-control img");

// Function to update image preview
function updateImagePreview() {
	// First we get an array of the files selected
	const files = imagePickerElement.files;

	// Check if no files were added to return and not display any image preview
	if (!files || files.length === 0) {
		imagePreviewElement.style.display = "none";
		return;
	}

	// We select the file (in this case we know we just have one)
	const pickedFile = files[0];

	// We create a URL to access the file uploaded and added to the src of the image
	imagePreviewElement.src = URL.createObjectURL(pickedFile);
	imagePreviewElement.style.display = "block";
}

// We add an event lister when there is a change in the image picker
imagePickerElement.addEventListener("change", updateImagePreview);
