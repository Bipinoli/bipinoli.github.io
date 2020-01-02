function editMode() {
    this.style.display = "none";
    replaceWithTextArea(this);
}


function navSelected() {
    console.log("navSelected");
    globalNamespace['selectedNavLink'].classList.remove("chosen-nav-link");
    this.classList.add("chosen-nav-link");
    globalNamespace['selectedNavLink'] = this;
}


function revealContents() {
    // reveal the underlying html
    detailsContainer = document.getElementsByClassName("details-container")[0];
    if (detailsContainer['editMode']) {
        detailsContainer['editMode'] = false;
        detailsContainer.contentEditable = "false";
        html = removeHtmlTags(detailsContainer.innerHTML);
        html = formHtmlTagsFromEncode(html);
        detailsContainer.innerHTML = beautifyHtml(html);
        detailsContainer.classList.remove("edit-mode-signifier");
        setupContentListeners();
        return;
    }
    
    detailsContainer['editMode'] = true;
    detailsContainer.contentEditable = "true";
    console.log(beautifyHtml(detailsContainer.innerHTML));
    detailsContainer.innerText = detailsContainer.innerHTML;
    detailsContainer.classList.add("edit-mode-signifier");
}


function reorderComponents() {
    console.log("lets reorder profile");
    nav = document.getElementsByClassName("navigate-section")[0];
    profile = document.getElementsByClassName("profile-container")[0];
    if (window.innerWidth > 800) {
        // navigation section should be at last
        if (nav === profile.lastElementChild) return;
        profile.removeChild(nav);
        profile.appendChild(nav);
        return;
    }
    // navigation section should be at top
    if (nav === profile.firstElementChild) return;
    profile.removeChild(nav);
    profile.insertBefore(nav, profile.firstElementChild);
}


function tapHandler() {
    let now = new Date().getTime();
    if (now - this["latestTappedTime"] < 400) {
        console.log("double tap");
        editMode.bind(this)();
    }
    else {
        setTimeout(() => {
            now = new Date().getTime();
            if (now - this["latestTappedTime"] >= 400)
                console.log("single tap");
        }, 400);
    }
    this["latestTappedTime"] = new Date().getTime();
}


function adaptTextArea() {
    this.style.height = "" + this.scrollHeight + "px";
}