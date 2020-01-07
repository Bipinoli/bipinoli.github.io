(async function init() {
    initDB();
    await constructPage();
    setupListeners();
    setupContentRevealListeners();
    adminButtonsSupply();
    setupNavLinkSelection();
    reorderComponents();
    initTapSettings();
    console.log("ok initalized properly. Ready to go!");
})();


function setupNavLinkSelection() {
    let navs = document.getElementsByClassName("navigation-links")[0].children;
    for (let i=0; i<navs.length; i++) {
        if (navs[i].classList.contains("chosen-nav-link")) {
            globalNamespace["selectedNavLink"] = navs[i];
            return;
        }
    }
    navs[0].classList.add("chosen-nav-link");
    globalNamespace["selectedNavLink"] = navs[0];
}


function setupListeners() {
    setupProfileListeners();
    setupNavListeners();
    setupContentListeners();
    setupWindowResizeListeners();
    setupAdminModeListeners();
    
    let addNavLinkBtn = document.getElementsByClassName("add-nav-link-btn")[0];
    addNavLinkBtn.removeEventListener("click", generateNavigationLink);
    if (localStorage.getItem("signedIn") == "true")
        addNavLinkBtn.addEventListener("click", generateNavigationLink);
    console.log("listeners setup complete");
}


function setupNavListeners() {
    navs = document.getElementsByClassName("nav-link")
    for (let i=0; i<navs.length; i++) {
        navs[i].removeEventListener("mousedown", navMouseDownHandler);
        navs[i].addEventListener("mousedown", navMouseDownHandler);
        navs[i].removeEventListener("mouseup", navMouseUpHandler);
        navs[i].addEventListener("mouseup", navMouseUpHandler);

    }
}

function setupProfileListeners() {
    profileEditables = document.getElementsByClassName("profile-editable");
    for (let i=0; i<profileEditables.length; i++) {
        profileEditables[i].removeEventListener("dblclick", editMode);
        profileEditables[i].removeEventListener("touchstart", tapHandler);
        if (localStorage.getItem("signedIn") == "true") {
            profileEditables[i].addEventListener("dblclick", editMode);
            profileEditables[i].addEventListener("touchstart", tapHandler);
        }
    }
}

function setupContentListeners() {
    let contentEditables = document.getElementsByClassName("content-editable");
    for (let i=0; i<contentEditables.length; i++) {
        contentEditables[i].removeEventListener("dblclick", editMode);
        contentEditables[i].removeEventListener("touchstart", tapHandler);
        if (localStorage.getItem("signedIn") == "true") {
            contentEditables[i].addEventListener("dblclick", editMode);
            contentEditables[i].addEventListener("touchstart", tapHandler);
        }
    }
    console.log('content listeners setup complete');
}

function setupContentRevealListeners() {
    let contentRevealBtn = document.getElementsByClassName("content-reveal-btn")[0];
    contentRevealBtn.removeEventListener("click", revealContents);
    if (localStorage.getItem("signedIn") == "true")
        contentRevealBtn.addEventListener("click", revealContents);
}


function setupWindowResizeListeners() {
    window.removeEventListener("resize", reorderComponents);
    window.addEventListener("resize", reorderComponents);
}


function setupAdminModeListeners() {
    let adminBtn = document.getElementsByClassName("admin-access-btn")[0];
    adminBtn.removeEventListener("click", adminAccessBtnBehaviour);
    adminBtn.addEventListener("click", adminAccessBtnBehaviour);
    if (localStorage.getItem("signedIn") == "true") {
        adminBtn.innerText = "Normal Access";
        return;
    } 
    adminBtn.innerText = "Admin Access";
}

function initTapSettings() {
    profileEditables = document.getElementsByClassName("profile-editable");
    contentEditables = document.getElementsByClassName("content-editable");
    for (let i=0; i<profileEditables.length; i++)
        profileEditables[i]["latestTappedTime"] = null;
    for (let i=0; i<contentEditables.length; i++)
        contentEditables[i]["latestTappedTime"] = null;
}

function detachNavLinkEventListeners(navLink) {
    console.log("detaching listeners of ", navLink.innerText);
    navLink.removeEventListener("mousedown", navMouseDownHandler);
    navLink.removeEventListener("mouseup", navMouseUpHandler);
}

function attachNavLinkEventListeners(navLink) {
    console.log("attaching listeners of ", navLink.innerText);
    navLink.addEventListener("mousedown", navMouseDownHandler);
    navLink.addEventListener("mouseup", navMouseUpHandler);
}