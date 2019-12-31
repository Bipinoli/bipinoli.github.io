function editMode() {
    if (this['editMode']) {
        this['editMode'] = false;
        this.contentEditable = "false";
        this.innerHTML = this.innerText;
        this.classList.remove("edit-mode-signifier");
        return;
    }
    this['editMode'] = true;
    this.contentEditable = "true";
    this.innerText = this.innerHTML;
    this.classList.add("edit-mode-signifier");
}


function navSelected() {
    globalNamespace['selectedNavLink'].classList.remove("chosen-nav-link");
    this.classList.add("chosen-nav-link");
    globalNamespace['selectedNavLink'] = this;
}