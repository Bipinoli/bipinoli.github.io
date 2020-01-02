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