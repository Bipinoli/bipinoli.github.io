function preserveContents(page = globalNamespace.selectedNavLink.innerText) {
    console.log("preserving contents");
    let contents = document.getElementsByClassName("content");
    html = document.getElementsByClassName("details-container")[0].innerHTML;
    storeData(page, {html: removeGrammarlyHtml(html)})
    .then(() => console.log("contents preserved successfully!"))
    .catch(err => console.error(err));
}


function preserveProfile() {
    preserveBio();
    preserveNavigation();  
}

function preserveNavigation() {
    console.log("preserving navigation");
    let navigation = document.getElementsByClassName("navigate-section")[0];
    
    let navLinks = document.getElementsByClassName("nav-link");
    let navs = [];
    for (let i=0; i<navLinks.length; i++) {
        navs.push(navLinks[i].innerText.toLowerCase());
    }

    Promise.all([
        storeDocData("profile", "navlinks", {html: navs}),
        storeDocData("profile", "navigationSection", {html: removeGrammarlyHtml(navigation.innerHTML)})
    ]).then(() => console.log("navigation preserved successfully!"))
    .catch(err => console.error(err));


}

function preserveBio() {
    console.log("preserving bio");
    let nameSection = document.getElementsByClassName("name-section")[0];
    let profilePic = document.getElementsByClassName("pic-section")[0];
    let aboutSection = document.getElementsByClassName("about-section")[0];
    
    Promise.all([
        storeDocData("profile", "nameSection", {html: removeGrammarlyHtml(nameSection.innerHTML)}),
        storeDocData("profile", "picSection", {html: removeGrammarlyHtml(profilePic.innerHTML)}),
        storeDocData("profile", "aboutSection", {html: removeGrammarlyHtml(aboutSection.innerHTML)})
    ]).then(() => "Bio preserved successfully!")
    .catch(err => console.error(err));
}


function preserve(element) {
    let masterContainer = document.getElementsByClassName("master-container")[0];
    let ancestor = element;
    while (ancestor.parentElement != masterContainer) 
        ancestor = ancestor.parentElement;
    if (ancestor.classList[0] == "profile-container") {
        console.log("preserving profile");
        preserveProfile();
    }
    else {
        console.log("preserving content");
        preserveContents();
    }
}