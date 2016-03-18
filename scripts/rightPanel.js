//------------------add new elem to picture list-----------------------

var inpFile = document.querySelector('#fileLoad');
var pictContainer = document.querySelector('.picturesContainer');
var canvasContainer = document.getElementById('work-field');
var mainCanvas = document.getElementById('work-field-canvas');
var mainctx = mainCanvas.getContext('2d');
var index = 1;
var canvImagesCount = 1;
var canMove = true;
var imageArr = [];

inpFile.addEventListener('change', function(e) {
    if (index > 3) {
        var tempEl = document.createElement('div');
        tempEl.className = 'pictHolder';
        var tempCanv = document.createElement('canvas');
        tempCanv.id = 'picture' + index;
        tempCanv.setAttribute('width', '160');
        tempCanv.setAttribute('height', '160');
        //tempCanv.setAttribute('draggable', 'true');
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
    var xPos = (ev.clientX - rect.left) - (img.width / 10);
    var yPos = (ev.clientY - rect.top) - (img.height / 10);

    var mainCont = document.getElementById('work-field');
    var cnvEl = createElem(mainCont, 'cnvImage', Math.floor(img.width / 5), Math.floor(img.height / 5), img, xPos, yPos);
    cnvEl.onclick = function() {
        var that = this;
        addMoveListeners(img, that);
    };
};
mainCanvas.onclick = function() {
    var allElems = this.parentNode.children;
    for (var i = 0; i < allElems.length; i++) {
        allElems[i].className = '';
        changeZindex(allElems[i], 'canvAncor', -5);
        changeZindex(allElems[i], 'canvDel fa fa-times', -5);
    }
};
//--------------------------------------------------
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
        }
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
    }
    reader.readAsDataURL(e.target.files[0]);
}
//--------------------------------------------------
function createElem(source, name, width, height, image, x, y) {
    var canvEl = document.createElement('div');
    canvEl.style.width = width + 'px';
    canvEl.style.height = height + 'px';
    canvEl.id = 'mainCanvElement' + canvImagesCount;
    canvEl.style.position = 'absolute';
    canvEl.style.zIndex = 1;

    var ancrEl = addToolElem(canvEl, 'canvAncor');
    ancrEl.onmousedown = function(e) {
        //e.stopPropagation();
        var that = this;
        addResizeListeners(image, that, e);
    };
    var delEl = addToolElem(canvEl, 'canvDel fa fa-times');
    delEl.onclick = function(e) {
        e.stopPropagation();
        var container = this.parentNode.parentNode;
        container.removeChild(this.parentNode);
    }

    var tempCanv = document.createElement('canvas');
    tempCanv.id = name + canvImagesCount;
    tempCanv.setAttribute('width', width);
    tempCanv.setAttribute('height', height);
    var curCont = tempCanv.getContext('2d');
    curCont.drawImage(image, 0, 0, width, height);

    canvEl.appendChild(tempCanv);
    source.appendChild(canvEl);
    canvEl.style.top = y + 'px';
    canvEl.style.left = x + 'px';
    canvImagesCount++;
    return canvEl;
}
//--------------------------------------------------
function addToolElem(container, clsName) {
    var tempDiv = document.createElement('div');
    tempDiv.className = clsName;
    container.appendChild(tempDiv);
    return tempDiv;
}

function changeZindex(parent, cls, value) {
    var ancrEl = parent.getElementsByClassName(cls)[0];
    if (ancrEl) {
        ancrEl.style.zIndex = value;
    }
}
//--------------------------------------------------
function addMoveListeners(img, context) {
    var selected = null;
    var x_pos = 0,
        y_pos = 0;
    var x_elem = 0,
        y_elem = 0;

    var allElems = context.parentNode.children;

    for (var i = 0; i < allElems.length; i++) {
        allElems[i].className = '';
        changeZindex(allElems[i], 'canvAncor', -5);
        changeZindex(allElems[i], 'canvDel fa fa-times', -5);
    }
    changeZindex(context, 'canvAncor', 5);
    changeZindex(context, 'canvDel fa fa-times', 5);

    // var ancorEl = context.getElementsByClassName('canvAncor')[0];
    // var delEl = context.getElementsByClassName('canvDel fa fa-times')[0];

    // ancorEl.onmousedown = function(e) {
    //     e.stopPropagation();
    //     var that = this;
    //     addResizeListeners(img, that, e);
    // };
    // delEl.onclick = function(e) {
    //     e.stopPropagation();
    //     var container = this.parentNode.parentNode;
    //     container.removeChild(this.parentNode);
    // }

    context.onmousedown = function() {
        if (context.className == 'active' && canMove == true) {
            drag_init(context);
        }
        return false;
    };
    document.onmousemove = move_elem;
    document.onmouseup = destroy;

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
}

function addResizeListeners(img, that, ev) {
    var startX, startY, startWidth, startHeight, ratio;
    var maxWidth = 70;
    var maxHeiht = 70;
    var container = that.parentNode;
    var containerCanv = container.getElementsByTagName('canvas')[0];
    resizeInit(ev);


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
        //var w = startWidth + e.clientX - startX;
        var h = startHeight + e.clientY - startY;
        var w = Math.floor(h * ratio);
        if (h > maxHeiht && w > maxWidth) {
            container.style.width = w + 'px';
            container.style.height = h + 'px';
            containerCanv.width = w;
            containerCanv.height = h;
            var curCont = containerCanv.getContext('2d');
            curCont.drawImage(img, 0, 0, w, h);
        }
    }

    function stopResize(e) {
        canMove = true;
        document.removeEventListener('mousemove', doResize, false);
        document.removeEventListener('mouseup', stopResize, false);
    }

}
