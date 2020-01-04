(async function init() {
    initDB();
    await constructPage();
    setupListeners();
    selectFirstNavLink();
    reorderComponents();
    initTapSettings();
    let contentRevealBtn = document.getElementsByClassName("content-reveal-btn")[0];
    contentRevealBtn.removeEventListener("click", revealContents);
    contentRevealBtn.addEventListener("click", revealContents);
    console.log("ok initalized properly. Ready to go!");
})();


function selectFirstNavLink() {
    nav = document.getElementsByClassName("navigation-links")[0].children[0];
    nav.classList.add("chosen-nav-link");
    globalNamespace['selectedNavLink'] = nav;
}


function setupListeners() {
    setupProfileListeners();
    setupNavListeners();
    setupContentListeners();
    setupWindowResizeListeners();
    setupAdminModeListeners();
    
    let addNavLinkBtn = document.getElementsByClassName("add-nav-link-btn")[0];
    addNavLinkBtn.removeEventListener("click", generateNavigationLink);
    addNavLinkBtn.addEventListener("click", generateNavigationLink);
    console.log("listeners setup complete");
}


function setupNavListeners() {
    navs = document.getElementsByClassName("nav-link")
    for (let i=0; i<navs.length; i++) {
        navs[i].removeEventListener("click", navSelected);
        navs[i].addEventListener("click", navSelected);
    }
}

function setupProfileListeners() {
    profileEditables = document.getElementsByClassName("profile-editable");
    for (let i=0; i<profileEditables.length; i++) {
        profileEditables[i].removeEventListener("dblclick", editMode);
        profileEditables[i].removeEventListener("touchstart", tapHandler);
        profileEditables[i].addEventListener("dblclick", editMode);
        profileEditables[i].addEventListener("touchstart", tapHandler);
    }
}

function setupContentListeners() {
    contentEditables = document.getElementsByClassName("content-editable");
    for (let i=0; i<contentEditables.length; i++) {
        contentEditables[i].removeEventListener("dblclick", editMode);
        contentEditables[i].removeEventListener("touchstart", tapHandler);
        contentEditables[i].addEventListener("dblclick", editMode);
        contentEditables[i].addEventListener("touchstart", tapHandler);
    }
}

function setupWindowResizeListeners() {
    window.removeEventListener("resize", reorderComponents);
    window.addEventListener("resize", reorderComponents);
}


function setupAdminModeListeners() {
    document.getElementsByClassName("admin-access-btn")[0].addEventListener("click", adminMode);
}


function initTapSettings() {
    profileEditables = document.getElementsByClassName("profile-editable");
    contentEditables = document.getElementsByClassName("content-editable");
    for (let i=0; i<profileEditables.length; i++)
        profileEditables[i]["latestTappedTime"] = null;
    for (let i=0; i<contentEditables.length; i++)
        contentEditables[i]["latestTappedTime"] = null;
}
