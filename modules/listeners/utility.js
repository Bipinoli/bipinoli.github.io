function disableAddNewLinkBtn(navLink) {
    globalNamespace.uneditedNav = navLink;
    let addBtn = document.getElementsByClassName("add-nav-link-btn")[0];
    addBtn["previousBoxShadow"] = addBtn.style.boxShadow;
    addBtn["previousCursor"] = addBtn.style.cursor;
    addBtn.style.cursor = "default";
    addBtn.style.boxShadow = "";
    addBtn.style.opacity = "0.3";
}

function enableAddNewLinkBtn() {
    globalNamespace.uneditedNav = null;
    let addBtn = document.getElementsByClassName("add-nav-link-btn")[0];
    addBtn.style.cursor = addBtn["previousCursor"];
    addBtn.style.boxShadow = addBtn["previousBoxShadow"];
    addBtn.style.opacity = "1";
    delete addBtn["previousBoxShadow"];
    delete addBtn["previousCursor"];
}