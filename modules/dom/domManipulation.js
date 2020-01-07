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

    addMaskingPane(textarea);

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

    removeMaskingPane(this);
    
    preserve(this);
    
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
        fetchDocData("profile", "navlinks")
            .then(data => {
                console.log("cosntruct : " + data);
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
        fetchData("profile")
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
        fetchData(navHeader)
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


function mountSignInForm() {
    document.getElementsByTagName("body")[0].appendChild(generateSignInForm());
}

function unmountSignInForm() {
    let body = document.getElementsByTagName("body")[0];
    body.removeChild(body.lastElementChild);
}


function attachCrossBtn(element) {
    if (element["attachedCrossBtn"]) return;
    let div = document.createElement("div");
    div.style.display = "flex";
    element.parentElement.insertBefore(div, element);
    element.parentElement.removeChild(element);
    div.appendChild(element);
    let crossBtn = generateCrossBtn();
    div.appendChild(crossBtn);
    element["attachedCrossBtn"] = crossBtn; 
}

function detachCrossBtn(element) {
    element.parentElement.removeChild(element.attachedCrossBtn);
    element["attachedCrossBtn"] = null;
    let grandParent = element.parentElement.parentElement;
    let toRemove = element.parentElement;
    grandParent.insertBefore(element, element.parentElement);
    grandParent.removeChild(toRemove);
}

function addMaskingPane(element) {
    let pane = generateMaskingPane();
    let body = document.getElementsByTagName("body")[0];
    body.appendChild(pane);
    pane["maskedElement"] = element;
    element["maskingPane"] = pane;
    element.style.zIndex = "2";
    pane.style.zIndex = "1";
}  

function removeMaskingPane(element) {
    element["maskingPane"].parentElement.removeChild(element["maskingPane"]);
    delete element["maskingPane"];
    element.style.zIndex = "0";
}