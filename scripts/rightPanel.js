//------------------add new elem to picture list-----------------------
(function() {
    var inpFile = document.querySelector('#fileLoad');
    var pictContainer = document.querySelector('.picturesContainer');
    var mainCanvas = document.getElementById('work-field-canvas');
    var mainctx = mainCanvas.getContext('2d');
    var imgArr = [];
    var index = 1;
    inpFile.addEventListener('change', function(e) {
        if (index > 3) {
            var tempEl = document.createElement('div');
            tempEl.className = 'pictHolder';
            var tempCanv = document.createElement('canvas');
            tempCanv.id = 'picture' + index;
            tempCanv.setAttribute('width', '160');
            tempCanv.setAttribute('height', '160');
            tempCanv.setAttribute('draggable', 'true');
            tempEl.appendChild(tempCanv);
            pictContainer.appendChild(tempEl);
            pictContainer.style.overflowY = 'scroll';
        }
        var canvas = document.getElementById('picture' + index);
        var ctx = canvas.getContext('2d');
        handleImage(e, ctx, canvas);
        index++;
    }, false);

    mainCanvas.ondragover = function(ev) {
        ev.preventDefault();
    };
    mainCanvas.ondrop = function(ev) {
        ev.preventDefault();
        var data = event.dataTransfer.getData("text/plain");
        var img = new Image();
        img.src = data;
        var rect = this.getBoundingClientRect();
        var xPos = (ev.clientX - rect.left) - (img.width/10);
        var yPos = (ev.clientY - rect.top) - (img.height/10);
        //console.log(ev.clientX - rect.left, ev.clientY - rect.top);
        mainctx.drawImage(img, xPos, yPos, img.width/5, img.height/5);
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
                      centerShift_x, centerShift_y, img.width*ratio, img.height*ratio);
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
            imgArr.push(img.src);
        }
        reader.readAsDataURL(e.target.files[0]);
    }
})();