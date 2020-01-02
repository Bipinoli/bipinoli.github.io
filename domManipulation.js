function generateNavigationLink() {
    navLink = document.createElement("div");
    navLink.classList.add("nav-link");
    navLink.classList.add("profile-editable");
    navLink.addEventListener("dblclick", editMode);
    navLink.addEventListener("click", navSelected);
    navLink.appendChild(document.createTextNode("link"));
    document.getElementsByClassName("navigation-links")[0].appendChild(navLink);
}


function replaceWithTextArea(element) {
    textarea = document.createElement("textarea");
    textarea.classList.add("edit-mode-signifier");
    textarea.addEventListener("dblclick", replaceWithOriginalElement);
    textarea.addEventListener("input", adaptTextArea);
    textarea.value = beautifyHtml(element.innerHTML);
    textarea["elementToResurrect"] = element;
    element.parentElement.insertBefore(textarea, element);
    textarea.style.height = textarea.scrollHeight + "px";
}

function replaceWithOriginalElement() {
    let elem = this["elementToResurrect"];
    elem.innerHTML = beautifyHtml(this.value);
    elem.style.display = "block";
    this.parentElement.removeChild(this);
}