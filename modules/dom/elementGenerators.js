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
    return navLink;
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

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        console.log('sign in request');
        signInHandler();
    });
    btn2.addEventListener("click", signInCancel);

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


function generateCrossBtn() {
    let div = document.createElement("div");
    div.classList.add("cross-btn");
    div.addEventListener("click", crossBtnClickHandler);
    return div;
}


function generateMaskingPane() {
    let div = document.createElement("div");
    div.classList.add("masking-overley-window-pane");
    return div;
}