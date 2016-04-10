(function() {
    var canvasContainer = document.getElementById('work-field');
    var drawBtn = document.getElementById('addDrawBox');
    var drawAllow = document.getElementById('drawAllow');
    var colorList = {
        purpleCol: "#cb3594",
        greenCol: "#659b41",
        yellowCol: "#ffcf33",
        brownCol: "#986928",
        blueCol: "#69c",
        whiteCol: "#fff",
        blackCol: "#000"
    };
    var curColor = colorList.purpleCol;
    var sizeList = {
        smallSize: 3,
        normSize: 8,
        largeSize: 14,
        hugeSize: 19
    };
    var curSize = sizeList.smallSize;

    drawAllow.onclick = function(e) {
        //e.preventDefault();
        var activeEl = canvasContainer.getElementsByClassName('active')[0];
        if (!appObj.canMove) {
            appObj.startDraw(this, true);
            activeEl.style.cursor = 'move';
        } else {
            appObj.startDraw(this, false);
            activeEl.style.cursor = 'url(img/Pencil.cur), auto';
        }
    };

    drawBtn.onclick = function(e) {
        e.preventDefault();
        var canvEl = appObj.createElem({
            source: canvasContainer,
            name: 'cnvPaint',
            image: '',
            width: 200,
            height: 200,
            posX: 0,
            posY: 0,
            bg: 'rgba(219, 221, 219, 0.3)',
            canRotate: false,
            canDraw: true
        });
        var innerCanv = canvEl.getElementsByTagName('canvas')[0];
        innerCanv.clickX = [];
        innerCanv.clickY = [];
        innerCanv.clickDrag = [];
        innerCanv.clickColor = [];
        innerCanv.clickSize = [];
        context = innerCanv.getContext('2d');
        canvEl.onclick = function() {
            var that = this;
            appObj.addMoveListeners(that);
        };
        innerCanv.onmousedown = function(e) {
            if (!appObj.canMove && canvEl.className == 'active') {
                var rect = this.getBoundingClientRect();
                var mouseX = e.clientX - rect.left;
                var mouseY = e.clientY - rect.top;

                appObj.paint = true;
                addClick(this, mouseX, mouseY);
                appObj.redraw(this.getContext('2d'));
            }

        };
        innerCanv.onmousemove = function(e) {
            if (appObj.paint) {
                var rect = this.getBoundingClientRect();
                addClick(this, e.clientX - rect.left, e.clientY - rect.top, true);
                appObj.redraw(this.getContext('2d'));
            }
        };
        innerCanv.onmouseup = function(e) {
            appObj.paint = false;
        };
        innerCanv.onmouseleave = function(e) {
            appObj.paint = false;
        };
    };

    function addClick(that, x, y, dragging) {
        that.clickX.push(x);
        that.clickY.push(y);
        that.clickDrag.push(dragging);
        that.clickColor.push(curColor);
        that.clickSize.push(curSize);
    }
    var colorSelectEl = document.getElementById('colorChooser');
    colorSelectEl.onclick = function(e) {
        drawingFeatures(this, colorList, 'currCol', 'color', e);
    };
    var sizeSelectEl = document.getElementById('sizeChooser');
    sizeSelectEl.onclick = function(e) {
        drawingFeatures(this, sizeList, 'currSize', 'size', e);
    };

    function drawingFeatures(ctx, propList, clsN, param, ev) {
        var targId = ev.target.id;
        if (targId) {
            for (var i = 0; i < ctx.children.length; i++) {
                ctx.children[i].className = ' ';
            }
            if (param == 'color') {
                curColor = propList[targId];
            } else {
                curSize = propList[targId];
            }
            ev.target.className = clsN;
        }
    }
})();
