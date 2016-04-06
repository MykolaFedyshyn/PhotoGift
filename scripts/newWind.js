(function() {
    var newWbtn = document.getElementById('newWindow');
    var newWpanel = document.getElementById('newWindTools');
    var wInput = document.getElementById('wSize');
    var hInput = document.getElementById('hSize');

    newWbtn.onclick = function() {
        if (canvasContainer.children.length > 2) {
            showWarning(createNewArea);
        } else {
            createNewArea();
        }
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

    function createNewArea() {
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
    }
})();

function showWarning(applyFunc, that) {
    var wrap = document.getElementById('wrapper');
    var coverDiv = document.createElement('div');
    coverDiv.className = 'hoverBlack';
    wrap.appendChild(coverDiv);
    coverDiv.style.zIndex = 200;
    coverDiv.style.width = screen.width + 'px';
    coverDiv.style.height = screen.height + 'px';
    createWarningBlock(coverDiv, applyFunc, that);
}

function createWarningBlock(container, applyFunction, that) {
    var newEl = document.createElement('div');
    newEl.className = 'warningBlock';
    var textMessage = document.createElement('p');
    textMessage.innerHTML = 'This action will remove everything you have done before.\
        Do you really want to do that?';
    newEl.appendChild(textMessage);
    var confirmElem = document.createElement('a');
    confirmElem.className = 'warnConfirm';
    confirmElem.href = '#';
    confirmElem.innerHTML = 'Let\’s rock!'
    confirmElem.onclick = function() {
        if(that) {
            applyFunction(that);
        } else {
            applyFunction();
        }
        container.parentNode.removeChild(container);
    };
    newEl.appendChild(confirmElem);
    var cancelElem = document.createElement('a');
    cancelElem.className = 'warnCancel';
    cancelElem.href = '#';
    cancelElem.innerHTML = 'Cancel';
    cancelElem.onclick = function() {
        container.parentNode.removeChild(container);
    };
    newEl.appendChild(cancelElem);
    container.appendChild(newEl);
    newEl.style.left = (screen.width / 2) - 250 + 'px';
}
