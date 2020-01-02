(function init() {
    setupListeners();
    selectFirstNavLink();
    reorderComponents();
    initTapSettings();
    document.getElementsByClassName("content-reveal-btn")[0].addEventListener("click", revealContents);
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
    
    document.getElementsByClassName("add-nav-link-btn")[0].addEventListener("click", generateNavigationLink);
}


function setupNavListeners() {
    navs = document.getElementsByClassName("nav-link")
    for (let i=0; i<navs.length; i++) {
        navs[i].addEventListener("click", navSelected);
    }
}

function setupProfileListeners() {
    profileEditables = document.getElementsByClassName("profile-editable");
    for (let i=0; i<profileEditables.length; i++) {
        profileEditables[i].addEventListener("dblclick", editMode);
        profileEditables[i].addEventListener("touchstart", tapHandler);
    }
}

function setupContentListeners() {
    contentEditables = document.getElementsByClassName("content-editable");
    for (let i=0; i<contentEditables.length; i++) {
        contentEditables[i].addEventListener("dblclick", editMode);
        contentEditables[i].addEventListener("touchstart", tapHandler);
    }
}

function setupWindowResizeListeners() {
    window.addEventListener("resize", reorderComponents);
}

function initTapSettings() {
    profileEditables = document.getElementsByClassName("profile-editable");
    contentEditables = document.getElementsByClassName("content-editable");
    for (let i=0; i<profileEditables.length; i++)
        profileEditables[i]["latestTappedTime"] = null;
    for (let i=0; i<contentEditables.length; i++)
        contentEditables[i]["latestTappedTime"] = null;
}