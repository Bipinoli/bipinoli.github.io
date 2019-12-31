(function init() {
    document.getElementsByClassName("add-nav-link-btn")[0].addEventListener("click", generateNavigationLink);
    editables = document.getElementsByClassName("editable");
    for (let i=0; i<editables.length; i++) {
        editables[i].addEventListener("dblclick", editMode);
        editables[i].addEventListener("click", navSelected);
    }
    
    selectFirstNavLink();
    console.log("ok initalized properly. Ready to go!");
})();


function selectFirstNavLink() {
    nav = document.getElementsByClassName("navigation-links")[0].children[0];
    nav.classList.add("chosen-nav-link");
    globalNamespace['selectedNavLink'] = nav;
}