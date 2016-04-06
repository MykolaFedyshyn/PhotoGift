var inpFile = document.querySelector('#fileLoad');
var pictContainer = document.querySelector('.picturesContainer');
var canvasContainer = document.getElementById('work-field');
var mainCanvas = document.getElementById('work-field-canvas');
var drawBtn = document.getElementById('addDrawBox');
var drawAllow = document.getElementById('drawAllow');
var mainctx = mainCanvas.getContext('2d');
var index = 1;
var canvImagesCount = 1;
var canMove = true;
var totalZindex = 1;
var zIndexLimit = 35;
var paint;
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

inpFile.addEventListener('change', function(e) {
    if (index > 3) {
        var tempEl = document.createElement('div');
        tempEl.className = 'pictHolder';
        var tempCanv = document.createElement('canvas');
        tempCanv.id = 'picture' + index;
        tempCanv.setAttribute('width', '160');
        tempCanv.setAttribute('height', '160');
        tempEl.appendChild(tempCanv);
        pictContainer.appendChild(tempEl);
        pictContainer.style.overflowY = 'scroll';
    }
    var canvas = document.getElementById('picture' + index);
    canvas.setAttribute('draggable', 'true');
    var ctx = canvas.getContext('2d');
    handleImage(e, ctx, canvas);
    index++;
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
    var cnvEl = createElem({
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
        addMoveListeners(that);
    };
};
mainCanvas.onclick = function() {
    var drawPanel = document.getElementById('drawTools');
    var allElems = this.parentNode.children;
    for (var i = 0; i < allElems.length; i++) {
        allElems[i].className = '';
        allElems[i].style.cursor = 'default';
        changeZindex(allElems[i], ['canvAncor', 'canvDel fa fa-times'], -5, 0);
    }
    drawPanelAnime(drawPanel, 0, 0, '0 10px', 0, 'absolute');
    startDraw(drawAllow, true);
};
//----------------------------------------------------------------------------------
// Handler for adding image to right area and start listeners for dragging
//----------------------------------------------------------------------------------
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
//----------------------------------------------------------------------------------
// Handler for element creating on editor area
//----------------------------------------------------------------------------------
function createElem(paramObj) {
    var canvEl = document.createElement('div');
    canvEl.style.width = paramObj.width + 'px';
    canvEl.style.height = paramObj.height + 'px';
    canvEl.id = paramObj.name + canvImagesCount;
    canvEl.style.position = 'absolute';
    canvEl.style.zIndex = totalZindex;
    if (!!paramObj.bg) {
        canvEl.style.background = paramObj.bg;
    }
    if (!!paramObj.image) {
        canvEl.imgSrc = paramObj.image.src;
        canvEl.filtered = false;
        canvEl.mirrored = false;
    }
    canvEl.canRotate = paramObj.canRotate;
    canvEl.canDraw = paramObj.canDraw;
    var ancrEl = addToolElem(canvEl, 'canvAncor');
    ancrEl.onmousedown = function(e) {
        e.stopPropagation();
        var that = this;
        if (!!paramObj.image) {
            addResizeListeners(that, e, paramObj.image);
        } else {
            addResizeListeners(that, e);
        }
    };
    var delEl = addToolElem(canvEl, 'canvDel fa fa-times');
    delEl.onclick = function(e) {
        e.stopPropagation();
        if (canMove) {
            var container = this.parentNode.parentNode;
            container.removeChild(this.parentNode);
        }
    };
    var tempCanv = document.createElement('canvas');
    tempCanv.setAttribute('width', paramObj.width);
    tempCanv.setAttribute('height', paramObj.height);
    var curCont = tempCanv.getContext('2d');
    if (!!paramObj.image) {
        curCont.drawImage(paramObj.image, 0, 0, paramObj.width, paramObj.height);
    }

    canvEl.appendChild(tempCanv);
    paramObj.source.appendChild(canvEl);
    canvEl.style.top = paramObj.posY + 'px';
    canvEl.style.left = paramObj.posX + 'px';
    canvEl.rotateDeg = 0;
    canvImagesCount++;
    if (totalZindex < zIndexLimit) {
        totalZindex++;
    }
    return canvEl;
}
//--------------------------------------------------
function addToolElem(container, clsName) {
    var tempDiv = document.createElement('div');
    tempDiv.className = clsName;
    container.appendChild(tempDiv);
    return tempDiv;
}

function changeZindex(parent, cls, value, transp) {
    var ancrEl;
    for (var i = 0; i < cls.length; i++) {
        ancrEl = parent.getElementsByClassName(cls[i])[0];
        if (ancrEl) {
            ancrEl.style.zIndex = value;
            ancrEl.style.opacity = transp;
        }
    }
}
//----------------------------------------------------------------------------------
// Handle for element moving
//----------------------------------------------------------------------------------
function addMoveListeners(context) {
    var selected = null;
    var x_pos = 0,
        y_pos = 0;
    var x_elem = 0,
        y_elem = 0;

    var allElems = context.parentNode.children;

    for (var i = 0; i < allElems.length; i++) {
        allElems[i].className = '';
        allElems[i].style.cursor  = 'default';
        changeZindex(allElems[i], ['canvAncor', 'canvDel fa fa-times'], -5, 0);
    }
    if (context.canDraw && !canMove) {
        changeZindex(context, ['canvAncor', 'canvDel fa fa-times'], -5, 0);
    } else {
        changeZindex(context, ['canvAncor', 'canvDel fa fa-times'], 5, 1);
    }

    context.onmousedown = function(e) {
        if (this.className == 'active' && canMove) {
            drag_init(this);
            changeZindex(this, ['canvAncor', 'canvDel fa fa-times'], 5, 1);
        } else if (this.canDraw) {
            changeZindex(this, ['canvAncor', 'canvDel fa fa-times'], -5, 0);
        }
        return false;
    };
    document.addEventListener('mousemove', move_elem);
    document.addEventListener('mouseup', destroy);

    function drag_init(elem) {
        selected = elem;
        x_elem = x_pos - selected.offsetLeft;
        y_elem = y_pos - selected.offsetTop;
    }

    function move_elem(e) {
        x_pos = document.all ? window.event.clientX : e.pageX;
        y_pos = document.all ? window.event.clientY : e.pageY;
        if (selected !== null) {
            selected.style.left = (x_pos - x_elem) + 'px';
            selected.style.top = (y_pos - y_elem) + 'px';
        }
    }

    function destroy() {
        selected = null;
        // document.removeEventListener('mousemove', move_elem);
        // document.removeEventListener('mouseup', destroy);
    }
    context.className = 'active';
    var drawPanel = document.getElementById('drawTools');
    if (context.canDraw) {
        drawPanelAnime(drawPanel, '80px', 1, '21px 10px', '0 0 10px', 'relative');
    } else {
        drawPanelAnime(drawPanel, 0, 0, '0 10px', 0, 'absolute');
        startDraw(drawAllow, true);
    }
    context.style.cursor = (context.canDraw && !canMove) ? 'url(img/Pencil.cur), auto' : 'move';
}

function drawPanelAnime(ctx, hgt, op, padd, marg, pos) {
    var parentChildren = ctx.parentNode.children;
    for (var i = 0; i < parentChildren.length; i++) {
        parentChildren[i].style.height = 0;
        parentChildren[i].style.opacity = 0;
        parentChildren[i].style.padding = '0 10px';
        parentChildren[i].style.margin = 0;
        parentChildren[i].style.zIndex = 0;
    }
    ctx.style.height = hgt;
    ctx.style.opacity = op;
    ctx.style.padding = padd;
    ctx.style.margin = marg;
    ctx.style.zIndex = 5;
}
//----------------------------------------------------------------------------------
// Handler for element resizing
//----------------------------------------------------------------------------------
function addResizeListeners(that, ev, img) {
    var startX, startY, startWidth, startHeight, ratio;
    var maxWidth = 70;
    var maxHeiht = 70;
    var container = that.parentNode;
    var containerCanv = container.getElementsByTagName('canvas')[0];

    if (canMove) {
        resizeInit(ev);
        container.style.cursor = 'se-resize';
    }

    function resizeInit(e) {
        canMove = false;
        startX = e.clientX;
        startY = e.clientY;
        startWidth = parseInt(document.defaultView.getComputedStyle(container).width, 10);
        startHeight = parseInt(document.defaultView.getComputedStyle(container).height, 10);
        ratio = startWidth / startHeight;

        document.addEventListener('mousemove', doResize, false);
        document.addEventListener('mouseup', stopResize, false);
    }

    function doResize(e) {
        var h = startHeight + e.clientY - startY;
        var w;
        if (!!img) {
            w = Math.floor(h * ratio);
        } else {
            w = startWidth + e.clientX - startX;
        }
        if (h > maxHeiht && w > maxWidth) {
            container.style.width = w + 'px';
            container.style.height = h + 'px';
            containerCanv.width = w;
            containerCanv.height = h;
            var curCont = containerCanv.getContext('2d');
            if (!!img) {
                drawMirroredImg(container, img, curCont, w, h);
            } else {
                redraw(curCont);
            }
        }
        container.style.cursor = 'se-resize';
        changeZindex(container, ['canvAncor', 'canvDel fa fa-times'], 5, 1);
    }

    function stopResize(e) {
        canMove = true;
        container.style.cursor = 'auto';
        document.removeEventListener('mousemove', doResize, false);
        document.removeEventListener('mouseup', stopResize, false);
    }
}

function drawMirroredImg(container, img, ctx, w, h) {
    ctx.clearRect(0, 0, w, h);
    if (container.mirrored) {
        ctx.save();
        ctx.scale(-1, 1);
        ctx.drawImage(img, w * -1, 0, w, h);
        ctx.restore();
    } else {
        ctx.drawImage(img, 0, 0, w, h);
    }
}
//----------------------------------------------------------------------------------
// Add an area for drawing and draw on it
//----------------------------------------------------------------------------------
drawAllow.onclick = function(e) {
    //e.preventDefault();
    var activeEl = canvasContainer.getElementsByClassName('active')[0];
    if (!canMove) {
        startDraw(this, true);
        activeEl.style.cursor = 'move';
    } else {
        startDraw(this, false);
        activeEl.style.cursor = 'url(img/Pencil.cur), auto';
    }
};
drawBtn.onclick = function(e) {
    e.preventDefault();
    var canvEl = createElem({
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
        addMoveListeners(that);
    };
    innerCanv.onmousedown = function(e) {
        if (!canMove && canvEl.className == 'active') {
            var rect = this.getBoundingClientRect();
            var mouseX = e.clientX - rect.left;
            var mouseY = e.clientY - rect.top;

            paint = true;
            addClick(this, mouseX, mouseY);
            redraw(this.getContext('2d'));
        }

    };
    innerCanv.onmousemove = function(e) {
        if (paint) {
            var rect = this.getBoundingClientRect();
            addClick(this, e.clientX - rect.left, e.clientY - rect.top, true);
            redraw(this.getContext('2d'));
        }
    };
    innerCanv.onmouseup = function(e) {
        paint = false;
    };
    innerCanv.onmouseleave = function(e) {
        paint = false;
    };
};

function addClick(that, x, y, dragging) {
    that.clickX.push(x);
    that.clickY.push(y);
    that.clickDrag.push(dragging);
    that.clickColor.push(curColor);
    that.clickSize.push(curSize);
}

function redraw(ctx) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.lineJoin = "round";

    for (var i = 0; i < ctx.canvas.clickX.length; i++) {
        ctx.beginPath();
        if (ctx.canvas.clickDrag[i] && i) {
            ctx.moveTo(ctx.canvas.clickX[i - 1], ctx.canvas.clickY[i - 1]);
        } else {
            ctx.moveTo(ctx.canvas.clickX[i] - 1, ctx.canvas.clickY[i]);
        }
        ctx.lineTo(ctx.canvas.clickX[i], ctx.canvas.clickY[i]);
        ctx.closePath();
        ctx.strokeStyle = ctx.canvas.clickColor[i];
        ctx.lineWidth = ctx.canvas.clickSize[i];
        ctx.stroke();
    }
}

function startDraw(container, flag) {
    if (flag) {
        canMove = true;
        container.className = '';
    } else {
        canMove = false;
        container.className = 'drawON';
    }
}

//------------------------------------------
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
