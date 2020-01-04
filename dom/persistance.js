function preserveContents(page = globalNamespace.selectedNavLink.innerText) {
    let contents = document.getElementsByClassName("content");
    html = document.getElementsByClassName("details-container")[0].innerHTML;
    storeData(page, {html: html});
}


function preserveProfile() {
    preserveBio();
    preserveNavigation();  
}

function preserveNavigation() {
    let navigation = document.getElementsByClassName("navigate-section")[0];
    storeDocData("profile", "navigationSection", {html: navigation.innerHTML});

    let navLinks = document.getElementsByClassName("nav-link");
    let navs = [];
    for (let i=0; i<navLinks.length; i++) {
        navs.push(navLinks[i].innerText.toLowerCase());
    }
    storeDocData("profile", "navLinks", {navs: navs});
}

function preserveBio() {
    let nameSection = document.getElementsByClassName("name-section")[0];
    storeDocData("profile", "nameSection", {html: nameSection.innerHTML});

    let profilePic = document.getElementsByClassName("pic-section")[0];
    storeDocData("profile", "picSection", {html: profilePic.innerHTML});

    let aboutSection = document.getElementsByClassName("about-section")[0];
    storeDocData("profile", "aboutSection", {html: aboutSection.innerHTML});
}