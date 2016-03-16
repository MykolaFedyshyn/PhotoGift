(function() {
    var canvasContainer = document.getElementById('work-field');
    var saveBtn = document.querySelector('#file-buttons .save');
    var mainRect, canvElems, rect, mainTop, mainLeft, rectTop, rectLeft;
    var mainCanvas = document.getElementById('work-field-canvas');
    var mainctx = mainCanvas.getContext('2d');

    saveBtn.onclick = function(e) {
        e.preventDefault();
        mainRect = mainCanvas.getBoundingClientRect();
        mainTop = mainRect.top;
        mainLeft = mainRect.left;

        var newCanv = document.createElement('canvas');
        newCanv.setAttribute('width', mainCanvas.width);
        newCanv.setAttribute('height', mainCanvas.height);
        var temCtx = newCanv.getContext('2d');

        canvElems = canvasContainer.querySelectorAll('canvas');
        for (var i = 0; i < canvElems.length; i++) {
            rect = canvElems[i].getBoundingClientRect();
            rectTop = rect.top;
            rectLeft = rect.left;
            temCtx.drawImage(canvElems[i], rectLeft - mainLeft, rectTop - mainTop);
        }
        //var w = window.open('about:blank','image from canvas', "width=" + mainCanvas.width + ", height=" + mainCanvas.height);
        //w.document.write("<img src='" + newCanv.toDataURL("image/png", 1) + "' alt='from canvas'/>");
        var w = window.open(newCanv.toDataURL("image/png", 1), '', "width=" + mainCanvas.width + ", height=" + mainCanvas.height);
    };
    saveBtn.onmouseover = function() {
        this.style.right = 0;
    };
    saveBtn.onmouseout = function() {
        var that = this;
        setTimeout(function() {
            that.style.right = '-58px';
        }, 2000);
    };
})();
