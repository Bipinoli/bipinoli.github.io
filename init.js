(function init() {
    console.log("initializing");
    document.getElementsByClassName("add-nav-link-btn")[0].addEventListener("click", generateNavigationLink);
    editables = document.getElementsByClassName("editable");
    for (let i=0; i<editables.length; i++) {
        editables[i].addEventListener("dblclick", editMode);
    }
})();