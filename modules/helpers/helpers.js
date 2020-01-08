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

function removeGrammarlyHtml(text) {
    text = text.replace(/<grammarly-extension(.|\n)*<\/grammarly-extension>/g, "");
    return text;
}

function removeChosenNavLinkClassNameFromHTML(text) {
    text = text.replace(/class="nav-link chosen-nav-link"/g, 'class="nav-link"');
    return text;
}



function ancestorClassName(element) {
    masterContainer = document.getElementsByClassName("master-container")[0];
    let ancestor = element;
    while (ancestor.parentElement != masterContainer) 
        ancestor = ancestor.parentElement;
    return ancestor;
}