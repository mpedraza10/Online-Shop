// We get the ham btn and mobile menu to trigger the toggle effect
const hambugerBtn = document.getElementById("mobile-menu-btn");
const mobileMenu = document.getElementById("mobile-menu");

hambugerBtn.addEventListener("click", () => {
	// Set the display to flex so that the menu shows up
	mobileMenu.classList.toggle('open');
});
