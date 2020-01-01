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


function revealContents() {
    // reveal the underlying html
    detailsContainer = document.getElementsByClassName("details-container")[0]

    if (detailsContainer['editMode']) {
        detailsContainer['editMode'] = false;
        detailsContainer.contentEditable = "false";
        detailsContainer.innerHTML = detailsContainer.innerText;
        detailsContainer.classList.remove("edit-mode-signifier");
        setupListeners();
        return;
    }
    
    detailsContainer['editMode'] = true;
    detailsContainer.contentEditable = "true";
    detailsContainer.innerText = detailsContainer.innerHTML;
    detailsContainer.classList.add("edit-mode-signifier");
}