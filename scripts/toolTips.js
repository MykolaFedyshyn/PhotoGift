(function() {
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
        newEl.style.left = (rect.right + window.scrollX) + 15 + 'px';
        newEl.style.top = ((rect.top + window.scrollY) + rect.height / 2) + 'px';
        setTimeout(function(){
            newEl.style.left = (rect.right + window.scrollX) + 5 + 'px';
        }, 0);
    }

    function removeToolTip(e) {
        var toolTipEl = document.getElementsByClassName('toolTipEl')[0];
        document.body.removeChild(toolTipEl);
    }
})();
