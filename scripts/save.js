(function() {
    var canvasContainer = document.getElementById('work-field');
    var saveBtn = document.querySelector('#file-buttons .save');
    var mainRect, canvElems, rect, mainTop, mainLeft, rectTop, rectLeft;
    var mainCanvas = document.getElementById('work-field-canvas');
    var mainctx = mainCanvas.getContext('2d');

    saveBtn.onclick = function(e) {
        e.preventDefault();
        var canvElParent;
        mainRect = mainCanvas.getBoundingClientRect();
        mainTop = mainRect.top;
        mainLeft = mainRect.left;

        var newCanv = document.createElement('canvas');
        newCanv.setAttribute('width', mainCanvas.width);
        newCanv.setAttribute('height', mainCanvas.height);
        var temCtx = newCanv.getContext('2d');

        temCtx.drawImage(mainCanvas, 0, 0);

        canvElems = canvasContainer.querySelectorAll('canvas');
        for (var i = 1; i < canvElems.length; i++) {
            canvElParent = canvElems[i].parentNode;

            canvElems[i].style.transform = 'rotate(' + (-canvElParent.rotateDeg) + 'deg)';

            rect = canvElems[i].getBoundingClientRect();
            rectTop = rect.top;
            rectLeft = rect.left;
            drawRotElem(temCtx, canvElems[i], rectLeft-mainLeft, rectTop-mainTop, canvElParent.rotateDeg);

            canvElems[i].style.transform = 'rotate(0deg)';

            //-------------------------------------------------------------------------

            //temCtx.drawImage(canvElems[i], rectLeft - mainLeft, rectTop - mainTop);
        }
        //var w = window.open('about:blank','image from canvas', "width=" + mainCanvas.width + ", height=" + mainCanvas.height);
        //w.document.write("<img src='" + newCanv.toDataURL("image/png", 1) + "' alt='from canvas'/>");
        //
        var winTop = (screen.height / 2) - (mainCanvas.height / 2);
        var winLeft = (screen.width / 2) - (mainCanvas.width / 2);
        window.open(newCanv.toDataURL("image/png", 1), '', 'top=' + winTop + ',left=' + winLeft + ",width=" + mainCanvas.width + ", height=" + mainCanvas.height);
    };
    saveBtn.onmouseover = function() {
        this.style.right = 0;
    };
    saveBtn.onmouseout = function() {
        var that = this;
        setTimeout(function() {
            that.style.right = '-58px';
        }, 1000);
    };

    function drawRotElem(context, elem, x, y, angle) {
        var widthEl = elem.width / 2;
        var heightEl = elem.height / 2;
        context.save();
        context.translate(x, y);
        context.translate(widthEl, heightEl);
        context.rotate(angle * Math.PI / 180);
        context.drawImage(elem, -widthEl, -heightEl);
        context.restore();
    }
})();