(function() {
    var postToBtn = document.getElementsByClassName('postTo fa fa-facebook-square')[0];
    var canvasContainer = document.getElementById('work-field');
    var mainRect, canvElems, rect, mainTop, mainLeft, rectTop, rectLeft;
    var mainCanvas = document.getElementById('work-field-canvas');
    var mainctx = mainCanvas.getContext('2d');

    postToBtn.onclick = function(e) {
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
        window.open(
            'http://www.facebook.com/sharer.php?s=100&p[title]=a test title&p[summary]=a test description &p[url]=https://www.google.com.ua/&p[images][0]=https://www.google.com.ua/logos/doodles/2016/st-patricks-day-2016-4834639321497600-hp.gif',
            'facebook-share-dialog',
            'width=626,height=436'
        );

    };

    postToBtn.onmouseover = function() {
        this.style.right = 0;
    };
    postToBtn.onmouseout = function() {
        var that = this;
        setTimeout(function() {
            that.style.right = '-58px';
        }, 2000);
    };
})();
