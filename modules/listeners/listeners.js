function editMode() {
    replaceWithTextArea(this);
}


function navSelected() {
    clearUneditedNavLink();

    console.log("navSelected");
    if (globalNamespace['selectedNavLink']) {
        globalNamespace['selectedNavLink'].classList.remove("chosen-nav-link");
    }
    this.classList.add("chosen-nav-link");
    globalNamespace['selectedNavLink'] = this;

    function clearUneditedNavLink() {
        if (globalNamespace.uneditedNav) {
            if (globalNamespace.uneditedNav == this) return;
            globalNamespace.uneditedNav.parentElement.removeChild(globalNamespace.uneditedNav);
            enableAddNewLinkBtn();
        }
    }
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
    if (this["clickTime"]) {
        if (Date.now() - this["clickTime"] < 150) {
            console.log("double click");
            delete this["clickTime"];
            editMode.bind(this)();
        }
    }
    else {
        this["latestEvent"] = Date.now();
        setTimeout(() => {
            if (this["latestEvent"]) {
                console.log("click and hold");
                if (localStorage.getItem("signedIn") == "true")
                    navLinkDeleteMode.bind(this)();
            }
        }, 1200);
    }
}

function navMouseUpHandler() {
    if (!this["latestEvent"]) return;
    if (Date.now() - this["latestEvent"] < 1200) {
        this["clickTime"] = Date.now();
        setTimeout(() => {
            if (this["clickTime"]) {
                console.log("click");
                navSelected.bind(this)();
            }
        }, 150);
        delete this["latestEvent"];
    }
}


function navLinkDeleteMode() {
    if (this["deleteMode"]) return;
    console.log(this.innerText + " in delete mode.");
    attachCrossBtn(this);
    addMaskingPane(this);
    this["maskingPane"].addEventListener("click", navLinkNormalMode);
    detachNavLinkEventListeners(this);
    this.style.boxShadow = "0px 0px 12px black";
    this.style.cursor = "default";
    this["deleteMode"] = true;
}


function navLinkNormalMode() {
    detachCrossBtn(this["maskedElement"]);
    attachNavLinkEventListeners(this["maskedElement"]);
    this["maskedElement"].style.boxShadow = "0px 0px 3px rgba(112, 112, 112, 1)";
    this["maskedElement"].style.cursor = "pointer";
    delete this["maskedElement"]["deleteMode"];
    removeMaskingPane(this["maskedElement"]);
}


function crossBtnClickHandler() {
    let toDelete = this.parentElement.firstElementChild;
    let attachedCrossBtn = toDelete["attachedCrossBtn"];
    let maskingPane = toDelete["maskingPane"];
    deleteCollectionData(toDelete.innerText)
    .then(() => {
        attachedCrossBtn.parentElement.removeChild(attachedCrossBtn);
        maskingPane.parentElement.removeChild(maskingPane);
        toDelete.parentElement.removeChild(toDelete);
        preserveNavigation();
    })
    .catch(err => console.error(err));
}


function addNavLink() {
    if (!isNewNavLinkAllowed()) {
        console.log("unedited nav link already exists!");
        return;
    }

    let navLink = generateNavigationLink();
    document.getElementsByClassName("navigation-links")[0].appendChild(navLink);
    
    let fillContent = generatePlaceHolderContent();
    let detailsContainer = document.getElementsByClassName("details-container")[0];
    while (detailsContainer.firstChild) {
        detailsContainer.removeChild(detailsContainer.firstChild);
    }
    detailsContainer.appendChild(fillContent);
    
    setupNavListeners();
    disableAddNewLinkBtn(navLink);
    
    // navSelected.bind(navLink)();

    function isNewNavLinkAllowed() {
        return globalNamespace.uneditedNav == null;
    }
}