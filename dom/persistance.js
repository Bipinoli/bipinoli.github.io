function preserveContents() {
    let contents = document.getElementsByClassName("content");
    let page = globalNamespace.selectedNavLink.innerText;

    contents = document.getElementsByClassName("content");
    let data = [];
    for (let i=0; i<contents.length; i++) {
        data.push({html: contents[i].innerHTML});
    }

    store(page, data);
}


function preserveProfile() {
    preserveBio();
    preserveNavigation();  
}

function preserveNavigation() {
    let navigation = document.getElementsByClassName("navigate-section")[0];
    storeDoc("profile", "navigationSection", {html: navigation.innerHTML});

    let navLinks = document.getElementsByClassName("nav-link");
    let navs = [];
    for (let i=0; i<navLinks.length; i++) {
        navs.push(navLinks[i].innerText.toLowerCase());
    }
    storeDoc("profile", "navLinks", {navs: navs});
}

function preserveBio() {
    let nameSection = document.getElementsByClassName("name-section")[0];
    storeDoc("profile", "nameSection", {html: nameSection.innerHTML});

    let profilePic = document.getElementsByClassName("pic-section")[0];
    storeDoc("profile", "picSection", {html: profilePic.innerHTML});

    let aboutSection = document.getElementsByClassName("about-section")[0];
    storeDoc("profile", "aboutSection", {html: aboutSection.innerHTML});
}