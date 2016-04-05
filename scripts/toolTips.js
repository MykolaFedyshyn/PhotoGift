(function() {
    var filterButtons = document.querySelectorAll('#filterTools a');
    for (var i = 0; i < filterButtons.length; i++) {
        filterButtons[i].onmouseover = showToolTip;
        filterButtons[i].onmouseleave = removeToolTip;
    }
    var toolButtons = document.getElementsByClassName('toolBtn');
    for (var i = 0; i < toolButtons.length; i++) {
        toolButtons[i].onmouseover = showToolTip;
        toolButtons[i].onmouseleave = removeToolTip;
    }

    function showToolTip(e) {
        var rect = this.getBoundingClientRect();
        var value = this.getElementsByTagName('span')[0].innerHTML;
        var newEl = document.createElement('div');
        newEl.innerHTML = value;
        newEl.className = 'toolTipEl';
        document.body.appendChild(newEl);
        if (this.parentNode.id == 'filterTools') {
            newEl.style.left = (rect.left + window.scrollX) + rect.width / 2 + 'px';
            newEl.style.top = (rect.top + window.scrollY) + rect.height + 15 + 'px';
            setTimeout(function() {
                newEl.style.top = (rect.bottom + window.scrollX) + 5 + 'px';
            }, 0);
        } else {
            newEl.style.left = (rect.right + window.scrollX) + 15 + 'px';
            newEl.style.top = ((rect.top + window.scrollY) + rect.height / 2) + 'px';
            setTimeout(function() {
                newEl.style.left = (rect.right + window.scrollX) + 5 + 'px';
            }, 0);
        }
    }
    function removeToolTip(e) {
        var toolTipEl = document.getElementsByClassName('toolTipEl')[0];
        document.body.removeChild(toolTipEl);
    }
})();
