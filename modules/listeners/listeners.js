function editMode() {
    replaceWithTextArea(this);
}


function navSelected() {
    console.log("navSelected");
    if (globalNamespace['selectedNavLink']) {
        globalNamespace['selectedNavLink'].classList.remove("chosen-nav-link");
        if (localStorage.getItem("signedIn") == "true")
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


function adminAccessBtnBehaviour() {
    console.log("admin mode");
    if (localStorage.getItem("signedIn") == "true") {
        signOut().then(() => {
            document.getElementsByClassName("admin-access-btn")[0].innerText = "Admin Access";
            adminButtonsSupply();
            setupListeners();
        });
    } else {
        mountSignInForm();
    }
}


function signInHandler() {
    let form = document.getElementsByClassName("sign-in-form")[0].children[0];
    let email = form.elements["email"].value;
    let password = form.elements["psw"].value;
    signIn(email, password).then(() => {
        document.getElementsByClassName("admin-access-btn")[0].innerText = "Normal Access";
        unmountSignInForm();
        adminButtonsSupply();
        setupListeners();
    });
}

function signInCancel() {
    unmountSignInForm();
}

function adminButtonsSupply() {
    if (localStorage.getItem("signedIn") == "true") {
        document.getElementsByClassName("content-reveal-btn")[0].style.display = "block";
        document.getElementsByClassName("add-nav-link-btn")[0].style.display = "block";
        return;
    }
    document.getElementsByClassName("content-reveal-btn")[0].style.display = "none";
    document.getElementsByClassName("add-nav-link-btn")[0].style.display = "none";
}


function navMouseDownHandler() {
    this["latestEvent"] = Date.now();
    setTimeout(() => {
        if (this["latestEvent"]) {
            console.log("click and hold");
            navLinkDeleteMode.bind(this)();
        }
    }, 1200);
}

function navMouseUpHandler() {
    if (Date.now() - this["latestEvent"] < 1200) {
        console.log("click");
        delete this["latestEvent"];
        navSelected.bind(this)();
    }
}


function navLinkDeleteMode() {
    console.log(this.innerText + " in delete mode.");
    attachCrossBtn(this);
    darkWindowPaneBackground(this);
}