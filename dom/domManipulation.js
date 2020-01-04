function generateNavigationLink() {
    navLink = document.createElement("div");
    navLink.classList.add("nav-link");
    navLink.classList.add("profile-editable");
    navLink.addEventListener("dblclick", editMode);
    navLink.addEventListener("click", navSelected);
    navLink.appendChild(document.createTextNode("link"));
    document.getElementsByClassName("navigation-links")[0].appendChild(navLink);

    let fillContent = generatePlaceHolderContent();
    let detailsContainer = document.getElementsByClassName("details-container")[0];
    while (detailsContainer.firstChild) {
        detailsContainer.removeChild(detailsContainer.firstChild);
      }
    detailsContainer.appendChild(fillContent);
}

function replaceWithTextArea(element) {
    textarea = document.createElement("textarea");
    textarea.classList.add("edit-mode-signifier");
    textarea.addEventListener("dblclick", replaceWithOriginalElement);
    textarea.addEventListener("input", adaptTextArea);
    textarea.value = beautifyHtml(element.innerHTML);
    textarea["elementToResurrect"] = element;
    textarea["displayToResurrect"] = element.style.display;
    element.style.display = "none";
    element.parentElement.insertBefore(textarea, element);
    textarea.style.height = textarea.scrollHeight + "px";

    if (element.classList[0] == "content") {
        textarea["affectedElement"] = document.getElementsByClassName("content-reveal-btn")[0];
        disableDOMElement(textarea["affectedElement"]);
    }
}

function replaceWithOriginalElement() {
    let elem = this["elementToResurrect"];
    elem.style = this["styleToRessurect"];
    elem.innerHTML = beautifyHtml(this.value);
    elem.style.display = this["displayToResurrect"];
    this.parentElement.removeChild(this);

    if (this["affectedElement"]) {
        enableDOMElement(this["affectedElement"]);
        delete this["affectedElement"];
    }
    setupListeners();
}


function disableDOMElement(element) {
    element["disableCount"] = element["disableCount"] ? element["disableCount"]+1: 1;
    if (element["disableCount"] > 1) return;
    element["originalStyle"] = {
        fontColor: element.style.color,
        boxShadow: element.style.boxShadow,
        cursor: element.style.cursor
    };
    element.style.color = "rgba(0,0,0,0.3)";
    element.style.boxShadow = "0px 0px 10px rgba(0,0,0,0.2)";
    element.style.cursor = "default";
    element.removeEventListener("click", revealContents);
}

function enableDOMElement(element) {
    element["disableCount"] -= 1;
    if (element["disableCount"] > 0) return;
    element.style.color = element["originalStyle"]["fontColor"];
    element.style.boxShadow = element["originalStyle"]["boxShadow"];
    element.style.cursor = element["originalStyle"]["cursor"];
    element.addEventListener("click", revealContents);
    delete element["originalStyle"];
    element["disableCount"] = 0;
}


function constructPage() {
    return new Promise(function (resolve, reject) {
        fetchDoc("profile", "navlinks")
            .then(data => {
                let promises = [constructProfile(), constructContents(data.data[0])];
                Promise.all(promises)
                    .then(() => resolve())
                    .catch((error) => {
                        console.error(error);
                        reject();
                    });
            })
            .catch(err => {
                console.error(err);
                reject();
            });
    });
}

function constructProfile() {
    function selectHtml(data, id) {
        for (let i=0; i<data.length; i++) {
            if (data[i].id == id) 
                return data[i].html;
        }
    }
    return new Promise(function (resolve, reject) {
        fetch("profile")
        .then(data => {
            document.getElementsByClassName("name-section")[0].innerHTML = selectHtml(data, "namesection");
            document.getElementsByClassName("pic-section")[0].innerHTML = selectHtml(data, "picsection");
            document.getElementsByClassName("navigate-section")[0].innerHTML = selectHtml(data, "navigationsection");
            document.getElementsByClassName("about-section")[0].innerHTML = selectHtml(data, "aboutsection");
            resolve();
        })
        .catch(error => {
            console.error(error);
            reject();
        });
    });
}

function constructContents(navHeader) {
    return new Promise(function (resolve, reject) {
        fetch(navHeader)
        .then(data => {
            console.log(data);
            let html = "";
            for (let i=0; i<data.length; i++) {
                html += data[i].html;
            }
            document.getElementsByClassName("details-container")[0].innerHTML = html;
            console.log("contents constructed");
            resolve();
        })
        .catch(err => {
            console.error(err);
            reject();
        });
    });
}


function generatePlaceHolderContent() {
    let div = document.createElement("div");
    div.classList.add("content");
    div.classList.add("content-editable");
    let h2 = document.createElement("h2");
    h2.innerText = "Title";
    let p1 = document.createElement("p");
    p1.innerText = "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illum dolorem nemo aliquid excepturi magni laborum quia sit ducimus voluptates cum nihil, sed, ea deleniti non provident aliquam possimus earum expedita et? Velit cupiditate quam fugiat? Dicta explicabo excepturi possimus similique sequi ad nostrum amet culpa voluptatibus sed rerum architecto inventore, blanditiis quod sint? Iusto modi quos rem amet neque magni sequi quo, ad quidem libero sunt magnam repudiandae temporibus! Animi, corporis aut dicta quis excepturi consequatur sunt est aperiam deleniti voluptatem eveniet, asperiores vitae ratione, doloribus quo. Quae asperiores quod inventore, sint dignissimos ipsam voluptatibus nostrum explicabo numquam dicta tempore.";
    let p2 = document.createElement("p");
    p2.innerText = "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nesciunt debitis dolore magnam! Consequatur sit, vel eveniet sunt voluptatum eum suscipit quis quasi illo, necessitatibus mollitia sint placeat perferendis quibusdam doloremque.";
    div.appendChild(h2);
    div.appendChild(p1);
    div.appendChild(p2);
    return div;
}



function generateSignInForm() {
    let div = document.createElement("div");
    div.classList.add("sign-in-form");
    let form = document.createElement("form");
    // form.action = "#";
    div.appendChild(form);
    let emailLabel = document.createElement("label");
    emailLabel.for = "email";
    let b1 = document.createElement("b");
    b1.innerText = "Email";
    emailLabel.appendChild(b1);
    form.appendChild(emailLabel);
    let emailInput = document.createElement("input");
    emailInput.type = "email";
    emailInput.placeholder = "Enter Email";
    emailInput.name = "email";
    emailInput.required = true;
    form.appendChild(emailInput);
    let passLabel = document.createElement("label");
    passLabel.for = "psw";
    let b2 = document.createElement("b");
    b2.innerText = "Password";
    passLabel.appendChild(b2);
    form.appendChild(passLabel);
    let passInput = document.createElement("input");
    passInput.type = "password";
    passInput.placeholder = "Enter Password";
    passInput.name = "psw";
    passInput.required = true;
    form.appendChild(passInput);
    let btn1 = document.createElement("button");
    btn1.type = "submit";
    btn1.classList.add("btn");
    btn1.classList.add("verify-btn");
    btn1.innerText = "Verify";
    form.appendChild(btn1);
    let btn2 = document.createElement("button");
    btn2.type = "button";
    btn2.classList.add("btn");
    btn2.classList.add("cancel-btn");
    btn2.innerText = "Close";
    form.appendChild(btn2);

    form.addEventListener("submit", signInHandler);
    // form.addEventListener("submit", () => console.log("submit"));
    form.addEventListener("cancel", signInCancel);

    return div;


//     <div class="sign-in-form">
//       <form>
//     <label for="email"><b>Email</b></label>
//     <input type="text" placeholder="Enter Email" name="email" required>

//     <label for="psw"><b>Password</b></label>
//     <input type="password" placeholder="Enter Password" name="psw" required>

//     <button type="submit" class="btn verify-btn">Verify</button>
//     <button type="button" class="btn cancel-btn">Close</button>
//   </form>
//   </div>
}


function mountSignInForm() {
    document.getElementsByTagName("body")[0].appendChild(generateSignInForm());
}

function unmountSignInForm() {
    let body = document.getElementsByTagName("body")[0];
    body.removeChild(body.lastElementChild);
}