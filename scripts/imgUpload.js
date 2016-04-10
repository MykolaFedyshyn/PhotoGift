(function() {
    var inpFile = document.querySelector('#fileLoad');
    var pictContainer = document.querySelector('.picturesContainer');
    var canvasContainer = document.getElementById('work-field');
    var mainCanvas = document.getElementById('work-field-canvas');
    var mainctx = mainCanvas.getContext('2d');

    inpFile.addEventListener('change', function(e) {
        if (appObj.neElemIndex > 3) {
            var tempEl = document.createElement('div');
            tempEl.className = 'pictHolder';
            var tempCanv = document.createElement('canvas');
            tempCanv.id = 'picture' + appObj.neElemIndex;
            tempCanv.setAttribute('width', '160');
            tempCanv.setAttribute('height', '160');
            tempEl.appendChild(tempCanv);
            pictContainer.appendChild(tempEl);
            pictContainer.style.overflowY = 'scroll';
        }
        var canvas = document.getElementById('picture' + appObj.newElemIndex);
        canvas.setAttribute('draggable', 'true');
        var ctx = canvas.getContext('2d');
        handleImage(e, ctx, canvas);
        appObj.newElemIndex++;
    }, false);

    canvasContainer.ondragover = function(ev) {
        ev.preventDefault();
    };
    canvasContainer.ondrop = function(ev) {
        ev.preventDefault();
        var data = ev.dataTransfer.getData("text/plain");
        var img = new Image();
        img.src = data;
        var rect = this.getBoundingClientRect();
        var ratio = (mainCanvas.width / 4) / img.width;
        var newWidth = Math.floor(img.width * ratio);
        var newHeight = Math.floor(img.height * ratio);
        var xPos = (ev.clientX - rect.left) - (newWidth / 2);
        var yPos = (ev.clientY - rect.top) - (newHeight / 2);
        var cnvEl = appObj.createElem({
            source: this,
            name: 'cnvImage',
            image: img,
            width: newWidth,
            height: newHeight,
            posX: xPos,
            posY: yPos,
            canRotate: true,
            canDraw: false
        });
        cnvEl.onclick = function() {
            var that = this;
            appObj.addMoveListeners(that);
        };
    };
    mainCanvas.onclick = function() {
        var drawPanel = document.getElementById('drawTools');
        var allElems = this.parentNode.children;
        for (var i = 0; i < allElems.length; i++) {
            allElems[i].className = '';
            allElems[i].style.cursor = 'default';
            appObj.changeZindex(allElems[i], ['canvAncor', 'canvDel fa fa-times'], -5, 0);
        }
        appObj.drawPanelAnime(drawPanel, 0, 0, '0 10px', 0, 'absolute');
        appObj.startDraw(drawAllow, true);
    };

    function handleImage(e, ctx, canvas) {
        var reader = new FileReader();
        reader.onload = function(event) {
            var img = new Image();
            img.onload = function() {
                var hRatio = canvas.width / img.width;
                var vRatio = canvas.height / img.height;
                var ratio = Math.max(hRatio, vRatio);
                var centerShift_x = (canvas.width - img.width * ratio) / 2;
                var centerShift_y = (canvas.height - img.height * ratio) / 2;
                ctx.drawImage(img, 0, 0, img.width, img.height,
                    centerShift_x, centerShift_y, img.width * ratio, img.height * ratio);
            };
            img.src = event.target.result;
            canvas.ondragstart = function(ev) {
                ev.dataTransfer.setData("text/plain", img.src);
                ev.dataTransfer.effectAllowed = "copy";
                ev.target.parentElement.style.border = "3px solid red";
                ev.dataTransfer.setDragImage(this, 80, 80);
            };
            canvas.ondragend = function(ev) {
                ev.target.parentElement.style.border = "3px solid #58777c";
            };
        };
        reader.readAsDataURL(e.target.files[0]);
    }
})();
