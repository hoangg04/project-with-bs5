import music from "./music.js";
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const openMenu = $(".open-menu");
const closeMenu = $(".close-menu");
const itemsLink = $$(".item-link");
const navigation = $("nav");
const iconTexts = $$(".description-text");
const dots = $(".dots");
const mainContent = $(".main");
// localStorage.setItem("isOpenNavigation", false);
// let isOpenNavigation = false;
function activeLink() {
	itemsLink.forEach((item) => {
		item.addEventListener(
			"click",
			function (e) {
				itemsLink.forEach((item) => {
					item.classList.remove("active-link");
				});
				e.currentTarget.classList.add("active-link");
			},
			false
		);
	});
}
function handleNavigation() {
	if (navigation.classList.contains("inner-nav")) {
		iconTexts.forEach((item) => {
			item.style.visibility = "visible";
			item.style.opacity = "1";
		});
		dots.style.paddingLeft = "20px";
	} else {
		iconTexts.forEach((item) => {
			item.style.visibility = "hidden";
			item.style.opacity = "0";
		});
		dots.style.paddingLeft = "12px";
	}
}
function openNavigation() {
	openMenu.addEventListener("click", function (e) {
		navigation.classList.add("inner-nav");
		handleNavigation();
		this.style.visibility = "hidden";
		this.style.opacity = "0";
	});
}

function closeNavigation() {
	closeMenu.addEventListener("click", () => {
		navigation.classList.remove("inner-nav");
		handleNavigation();
		openMenu.style.visibility = "visible";
		openMenu.style.opacity = "1";
	});
}
// Lắng nghe sự kiện resize và window width set navigation
function handleResizeWindow() {
	if (window.innerWidth < 992) {
		navigation.style = `
            position:fixed;
            top:0;
            left:0;
            bottom:0;
            z-index:9999;
        `;
		mainContent.style = `
            margin-left: 60px;
        `;
	} else {
		navigation.style = ``;
		mainContent.style = ``;
	}
}
handleResizeWindow();
window.addEventListener("load", () => {
	activeLink();
	openNavigation();
	closeNavigation();
	window.addEventListener("resize", () => {
		handleResizeWindow();
	});
	if (window.location.href.indexOf("page/music.html") > -1) {
		music();
	}
});
