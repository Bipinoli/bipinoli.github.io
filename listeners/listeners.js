function editMode() {
    replaceWithTextArea(this);
}


function navSelected() {
    console.log("navSelected");
    if (globalNamespace['selectedNavLink']) {
        globalNamespace['selectedNavLink'].classList.remove("chosen-nav-link");
        preserveContents(globalNamespace['selectedNavLink'].innerText);
    }
    this.classList.add("chosen-nav-link");
    globalNamespace['selectedNavLink'] = this;
    constructContents(this.innerText);
}


function revealContents() {
    console.log("reveal contents");
    // reveal the underlying html
    detailsContainer = document.getElementsByClassName("details-container")[0];
    if (detailsContainer.style.display == "none") {
        let textArea = detailsContainer.parentElement.firstElementChild;
        replaceWithOriginalElement.bind(textArea)();
        return;
    }
    replaceWithTextArea(detailsContainer);
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


function adminMode() {
    console.log("admin mode");
}
