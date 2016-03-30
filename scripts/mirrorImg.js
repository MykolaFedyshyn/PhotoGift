(function() {
    var mirrorImg = document.getElementById('mirrorImg');
    var canvasContainer = document.getElementById('work-field');

    mirrorImg.onclick = function() {
        var activeEl = canvasContainer.getElementsByClassName('active')[0];
        if (activeEl && !activeEl.canDraw && !activeEl.filtered) {
            var currCanv = activeEl.getElementsByTagName('canvas')[0];
            var currCtx = currCanv.getContext('2d');
            currCtx.clearRect(0, 0, currCanv.width, currCanv.height);
            var img = new Image();
            img.src = activeEl.imgSrc;
            if (activeEl.mirrored) {
                currCtx.drawImage(img, 0, 0, currCanv.width, currCanv.height);
                activeEl.mirrored = false;
            } else {
                currCtx.save();
                currCtx.scale(-1, 1);
                currCtx.drawImage(img, currCanv.width * -1, 0, currCanv.width, currCanv.height);
                currCtx.restore();
                activeEl.mirrored = true;
            }
        }
    }
})();
