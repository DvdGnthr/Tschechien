const searchHighlighter = (containerSelector, inputElement) => {
    const container = document.querySelector(containerSelector);
    const searchText = inputElement.value.trim();

    // Alle <mark> Tags im Container entfernen
    const removeHighlights = (element) => {
        const highlights = element.querySelectorAll('mark');
        highlights.forEach((highlight) => {
            const parent = highlight.parentNode;
            parent.replaceChild(document.createTextNode(highlight.textContent), highlight);
            parent.normalize();
        });
    };

    // Text durchsuchen und hervorheben
    const highlightText = (element, regex) => {
        element.childNodes.forEach((child) => {
            if (child.nodeType === 3) { // Textknoten
                const matches = child.nodeValue.match(regex);
                if (matches) {
                    const span = document.createElement('span');
                    let lastIndex = 0;
                    matches.forEach((match) => {
                        const pos = child.nodeValue.indexOf(match, lastIndex);
                        if (pos !== -1) {
                            span.appendChild(document.createTextNode(child.nodeValue.substring(lastIndex, pos)));
                            const mark = document.createElement('mark');
                            mark.className = 'highlight';
                            mark.appendChild(document.createTextNode(match));
                            span.appendChild(mark);
                            lastIndex = pos + match.length;
                        }
                    });
                    span.appendChild(document.createTextNode(child.nodeValue.substring(lastIndex)));
                    child.parentNode.replaceChild(span, child);
                }
            } else if (child.nodeType === 1 && child.childNodes && !/(script|style)/i.test(child.tagName)) {
                highlightText(child, regex);
            }
        });
    };

    // Hervorhebung entfernen
    removeHighlights(container);

    if (searchText) {
        const regex = new RegExp(searchText, 'gi');
        highlightText(container, regex);
    }
};
