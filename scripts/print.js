(function(){
	var printBtn = document.querySelector('#file-buttons .print');
	var canvasContainer = document.getElementById('work-field');
	var mainCanvas = document.getElementById('work-field-canvas');
	var mainctx = mainCanvas.getContext('2d');
	var canvElParent, divElems, mainRect, canvElems;
	var rect, mainTop, mainLeft, rectTop, rectLeft;
	var elemArr = [];

		printBtn.onclick = function (e) {
        	e.preventDefault();

	        mainRect = mainCanvas.getBoundingClientRect();
	        mainTop = mainRect.top;
	        mainLeft = mainRect.left;

        	var newCanv = document.createElement('canvas');
        		newCanv.setAttribute('width', mainCanvas.width);
       			newCanv.setAttribute('height', mainCanvas.height);
        	var temCtx = newCanv.getContext('2d');
        		temCtx.drawImage(mainCanvas, 0, 0);

        	divElems = document.querySelectorAll('#work-field > div');
	        for (var j = 0; j < divElems.length; j++) {
	            elemArr.push(divElems[j]);
	        }
        	elemArr.sort(function (a, b) {
            	return a.style.zIndex > b.style.zIndex;
        	});
       		for (var k = 0; k < elemArr.length; k++) {
	            canvEl = elemArr[k].getElementsByTagName('canvas')[0];
	            canvEl.style.transform = 'rotate(' + (-elemArr[k].rotateDeg) + 'deg)';
	            rect = canvEl.getBoundingClientRect();
	            rectTop = rect.top;
	            rectLeft = rect.left;
	            drawRotElem(temCtx, canvEl, rectLeft - mainLeft, rectTop - mainTop, elemArr[k].rotateDeg);
	            canvEl.style.transform = 'rotate(0deg)';
        	}

	        var winTop = (screen.height / 2) - (mainCanvas.height / 2);
	        var winLeft = (screen.width / 2) - (mainCanvas.width / 2);
		    var windowContent = '<!DOCTYPE html>';
			    windowContent += '<html>'
			    windowContent += '<head><title>Print canvas</title></head>';
			    windowContent += '<body>'
			    windowContent += '<img src="' + newCanv.toDataURL("image/png", 1) + '">';
			    windowContent += '</body>';
			    windowContent += '</html>';
			var printWin = window.open('','','width=940,height=560');
			    printWin.document.open();
			    printWin.document.write(windowContent);
			    printWin.document.close();
			    printWin.focus();
			    printWin.print();
			    printWin.close();
    	}

    	printBtn.onmouseover = function () {
        	this.style.right = 0;
    	};

    	printBtn.onmouseout = function () {
       		var that = this;
        	setTimeout(function () {
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