function docLoaded(fn) {
    if (document.readyState !== 'loading') {
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}

function indexPageLoaded() {
    //displayItems();
}

function displayItems() {
}
