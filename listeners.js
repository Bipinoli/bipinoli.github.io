function editMode() {
    if (this['editMode']) {
        this['editMode'] = false;
        this.contentEditable = "false";
        this.innerHTML = this.innerText;
        this.classList.remove("edit-mode-signifier");
        return;
    }
    this['editMode'] = true;
    this.contentEditable = "true";
    this.innerText = this.innerHTML;
    this.classList.add("edit-mode-signifier");
}


function navSelected() {
    globalNamespace['selectedNavLink'].classList.remove("chosen-nav-link");
    this.classList.add("chosen-nav-link");
    globalNamespace['selectedNavLink'] = this;
}


function revealContents() {
    // reveal the underlying html
    detailsContainer = document.getElementsByClassName("details-container")[0];
    if (detailsContainer['editMode']) {
        detailsContainer['editMode'] = false;
        detailsContainer.contentEditable = "false";
        html = removeHtmlTags(detailsContainer.innerHTML);
        html = formHtmlTagsFromEncode(html);
        detailsContainer.innerHTML = beautifyHtml(html);
        detailsContainer.classList.remove("edit-mode-signifier");
        setupContentListeners();
        return;
    }
    
    detailsContainer['editMode'] = true;
    detailsContainer.contentEditable = "true";
    console.log(beautifyHtml(detailsContainer.innerHTML));
    detailsContainer.innerText = detailsContainer.innerHTML;
    detailsContainer.classList.add("edit-mode-signifier");
}


function removeHtmlTags(text) {
    text = text.replace(/<br>\s*/g, "");
    text = text.replace(/<\w*>|<\/\w*>/g, "");
    return text;
}

function formHtmlTagsFromEncode(text) {
    text = text.replace(/&lt;/g, "<");
    text = text.replace(/&gt;/g, ">");
    return text;
}

function beautifyHtml(html) {
    return style_html(html, {
        'indent_size': 3,
        'indent_char': ' ',
        'max_char': 78,
        'brace_style': 'expand',
        'unformatted': ['a', 'sub', 'sup', 'b', 'i', 'u']
      });
}