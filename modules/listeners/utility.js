function navLinkHasntBeenEdited(navLink) {
    globalNamespace.uneditedNav = navLink;
    let addBtn = document.getElementsByClassName("add-nav-link-btn")[0];
    addBtn["previousBoxShadow"] = addBtn.style.boxShadow;
    addBtn["previousCursor"] = addBtn.style.cursor;
    addBtn.style.cursor = "default";
    addBtn.style.boxShadow = "";
    addBtn.style.opacity = "0.3";
}

function navLinkGotEdited() {
    globalNamespace.uneditedNav = null;
    let addBtn = document.getElementsByClassName("add-nav-link-btn")[0];
    if (addBtn["previousCursor"] && addBtn["previousBoxShadow"]) {
        addBtn.style.cursor = addBtn["previousCursor"];
        addBtn.style.boxShadow = addBtn["previousBoxShadow"];
    }
    addBtn.style.opacity = "1";
    delete addBtn["previousBoxShadow"];
    delete addBtn["previousCursor"];
}


function isNewNavLinkAllowed() {
    return globalNamespace.uneditedNav == null;
}


function clearUneditedNavLink(element) {
    if (globalNamespace.uneditedNav) {
        if (globalNamespace.uneditedNav == element) return;
        if (globalNamespace.uneditedNav &&
            ancestorClassName(element) != "profile-container" && 
            globalNamespace.uneditedNav == globalNamespace.selectedNavLink) {
                return;
            }
        globalNamespace.uneditedNav.parentElement.removeChild(globalNamespace.uneditedNav);
        enableAddNewLinkBtn();
    }
}