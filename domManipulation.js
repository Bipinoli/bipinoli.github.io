function generateNavigationLink() {
    navLink = document.createElement("div");
    navLink.classList.add("nav-link");
    navLink.classList.add("editable");
    navLink.addEventListener("dblclick", editMode);
    navLink.appendChild(document.createTextNode("link"));
    document.getElementsByClassName("navigation-links")[0].appendChild(navLink);
}

