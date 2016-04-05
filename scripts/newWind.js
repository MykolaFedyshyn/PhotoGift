(function() {
    var newWbtn = document.getElementById('newWindow');
    var newWpanel = document.getElementById('newWindTools');
    var wInput = document.getElementById('wSize');
    var hInput = document.getElementById('hSize');

    newWbtn.onclick = function() {
        wInput.value = '856';
        hInput.value = '552';
        drawPanelAnime(newWpanel, '80px', 1, '10px', '0 0 10px', 'relative');
        mainctx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
        while (true) {
            var sibling = mainCanvas.nextElementSibling;
            if (sibling) {
                sibling.parentNode.removeChild(sibling);
            } else {
                break;
            }
        }
        changeContSize(canvasContainer, mainCanvas, 856, 552);
    };
    newWpanel.oninput = function(e) {
        e.stopPropagation();
        var newW = +wInput.value;
        var newH = +hInput.value;
        changeContSize(canvasContainer, mainCanvas, newW, newH);
    };
    function changeContSize(container, canv, w, h) {
        container.style.width = w + 20 + 'px';
        container.style.height = h + 20 + 'px';
        canv.width = w;
        canv.height = h;
    }
})();
