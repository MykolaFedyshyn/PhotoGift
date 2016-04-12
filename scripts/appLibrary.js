appObj.startDraw = function(container, flag) {
    if (flag) {
        appObj.canMove = true;
        container.className = '';
    } else {
        appObj.canMove = false;
        container.className = 'drawON';
    }
};
appObj.redraw = function(ctx) {
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
};
appObj.createElem = function(paramObj) {
    var canvEl = document.createElement('div');
    canvEl.style.width = paramObj.width + 'px';
    canvEl.style.height = paramObj.height + 'px';
    canvEl.id = paramObj.name + appObj.canvImagesCount;
    canvEl.style.position = 'absolute';
    canvEl.style.zIndex = appObj.totalZindex;
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
    var ancrEl = appObj.addToolElem(canvEl, 'canvAncor');
    ancrEl.onmousedown = function(e) {
        e.stopPropagation();
        var that = this;
        if (!!paramObj.image) {
            appObj.addResizeListeners(that, e, paramObj.image);
        } else {
            appObj.addResizeListeners(that, e);
        }
    };
    var delEl = appObj.addToolElem(canvEl, 'canvDel fa fa-times');
    delEl.onclick = function(e) {
        e.stopPropagation();
        if (appObj.canMove) {
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
    appObj.canvImagesCount++;
    if (appObj.totalZindex < appObj.zIndexLimit) {
        appObj.totalZindex++;
    }
    return canvEl;
}
appObj.drawPanelAnime = function(ctx, hgt, op, padd, marg, pos) {
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
};
appObj.drawMirroredImg = function(container, img, ctx, w, h) {
    ctx.clearRect(0, 0, w, h);
    if (container.mirrored) {
        ctx.save();
        ctx.scale(-1, 1);
        ctx.drawImage(img, w * -1, 0, w, h);
        ctx.restore();
    } else {
        ctx.drawImage(img, 0, 0, w, h);
    }
};
appObj.addResizeListeners = function(that, ev, img) {
    var startX, startY, startWidth, startHeight, ratio;
    var maxWidth = 70;
    var maxHeiht = 70;
    var container = that.parentNode;
    var containerCanv = container.getElementsByTagName('canvas')[0];

    if (appObj.canMove) {
        resizeInit(ev);
        container.style.cursor = 'se-resize';
    }

    function resizeInit(e) {
        appObj.canMove = false;
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
                appObj.drawMirroredImg(container, img, curCont, w, h);
            } else {
                appObj.redraw(curCont);
            }
        }
        container.style.cursor = 'se-resize';
        appObj.changeZindex(container, ['canvAncor', 'canvDel fa fa-times'], 5, 1);
    }

    function stopResize(e) {
        appObj.canMove = true;
        container.style.cursor = 'auto';
        document.removeEventListener('mousemove', doResize, false);
        document.removeEventListener('mouseup', stopResize, false);
    }
};
appObj.addMoveListeners = function(context) {
    var selected = null;
    var x_pos = 0,
        y_pos = 0;
    var x_elem = 0,
        y_elem = 0;

    var allElems = context.parentNode.children;

    for (var i = 0; i < allElems.length; i++) {
        allElems[i].className = '';
        allElems[i].style.cursor  = 'default';
        appObj.changeZindex(allElems[i], ['canvAncor', 'canvDel fa fa-times'], -5, 0);
    }
    if (context.canDraw && !appObj.canMove) {
        appObj.changeZindex(context, ['canvAncor', 'canvDel fa fa-times'], -5, 0);
    } else {
        appObj.changeZindex(context, ['canvAncor', 'canvDel fa fa-times'], 5, 1);
    }

    context.onmousedown = function(e) {
        if (this.className == 'active' && appObj.canMove) {
            drag_init(this);
            appObj.changeZindex(this, ['canvAncor', 'canvDel fa fa-times'], 5, 1);
        } else if (this.canDraw) {
            appObj.changeZindex(this, ['canvAncor', 'canvDel fa fa-times'], -5, 0);
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
    }
    context.className = 'active';
    var drawPanel = document.getElementById('drawTools');
    if (context.canDraw) {
        appObj.drawPanelAnime(drawPanel, '80px', 1, '21px 10px', '0 0 10px', 'relative');
    } else {
        appObj.drawPanelAnime(drawPanel, 0, 0, '0 10px', 0, 'absolute');
        appObj.startDraw(drawAllow, true);
    }
    context.style.cursor = (context.canDraw && !appObj.canMove) ? 'url(img/Pencil.cur), auto' : 'move';
};
appObj.addToolElem = function(container, clsName) {
    var tempDiv = document.createElement('div');
    tempDiv.className = clsName;
    container.appendChild(tempDiv);
    return tempDiv;
}
appObj.changeZindex = function(parent, cls, value, transp) {
    var ancrEl;
    for (var i = 0; i < cls.length; i++) {
        ancrEl = parent.getElementsByClassName(cls[i])[0];
        if (ancrEl) {
            ancrEl.style.zIndex = value;
            ancrEl.style.opacity = transp;
        }
    }
};
appObj.showWarning = function(applyFunc, that) {
    var wrap = document.getElementById('wrapper');
    if(wrap.getElementsByClassName('hoverBlack')[0]) {
        return;
    }
    var coverDiv = document.createElement('div');
    coverDiv.className = 'hoverBlack';
    wrap.appendChild(coverDiv);
    coverDiv.style.zIndex = 200;
    coverDiv.style.width = window.innerWidth + 'px';
    coverDiv.style.height = window.innerHeight + 'px';
    appObj.createWarningBlock(coverDiv, applyFunc, that);
};
appObj.createWarningBlock = function(container, applyFunction, that) {
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