(function() {
    var canvasContainer = document.getElementById('work-field');
    var filterBtn = document.getElementById('addFilter');
    var filterPanel = document.getElementById('filterTools');

    filterBtn.onclick = function(e) {
        appObj.drawPanelAnime(filterPanel, '80px', 1, '10px', '0 0 10px', 'relative');
    };
    filterPanel.onclick = function(e) {
        e.preventDefault();
        var currCanv, currCtx, imgData, resultData;
        var activeEl = canvasContainer.querySelector('.active');
        var buttId = e.target.id;
        if (activeEl && buttId != 'filterTools') {
            currCanv = activeEl.getElementsByTagName('canvas')[0];
            currCtx = currCanv.getContext('2d');
            if (!activeEl.canDraw && buttId != 'filtCancel') {
                imgData = currCtx.getImageData(0, 0, currCanv.width, currCanv.height);
                switch (buttId) {
                    case 'graysButt':
                        resultData = grayscaleFilter(imgData);
                        break;
                    case 'sepiaButt':
                        resultData = sepiaFilter(imgData);
                        break;
                    case 'brightButt':
                        resultData = brightFilter(imgData);
                        break;
                     case 'darkButt':
                        resultData = darkFilter(imgData);
                        break;
                    case 'thresSbutt':
                        resultData = thresFilter(imgData);
                        break;
                    case 'negSbutt':
                        resultData = negFilter(imgData);
                        break;
                    case 'blurButt':
                        resultData = blurFilter(imgData, currCanv.width, currCanv.width);
                        break;
                }
                removeResizing(activeEl);
                currCtx.putImageData(resultData, 0, 0);
                activeEl.filtered = true;
            }
            if (activeEl.filtered && buttId == 'filtCancel') {
                activeEl.filtered = false;
                restoreImg(activeEl, currCtx, currCanv);
            }
        }
    };

    function restoreImg(container, ctx, canv) {
        var img = new Image();
        img.src = container.imgSrc;
        appObj.drawMirroredImg(container, img, ctx, canv.width, canv.height);

        var ancrEl = appObj.addToolElem(container, 'canvAncor');
        ancrEl.onmousedown = function(e) {
            e.stopPropagation();
            var that = this;
            appObj.addResizeListeners(that, e, img);
        };
    }

    function removeResizing(container) {
        var elemToDel = container.getElementsByClassName('canvAncor')[0];
        if (elemToDel) {
            container.removeChild(elemToDel);
        }
    }

    function grayscaleFilter(pixels) {
        var d = pixels.data;
        for (var i = 0; i < d.length; i += 4) {
            var r = d[i];
            var g = d[i + 1];
            var b = d[i + 2];
            var v = 0.2126 * r + 0.7152 * g + 0.0722 * b;
            d[i] = d[i + 1] = d[i + 2] = v
        }
        return pixels;
    }

    function sepiaFilter(pixels) {
        var d = pixels.data;
        for (var i = 0; i < d.length; i += 4) {
            var r = d[i];
            var g = d[i + 1];
            var b = d[i + 2];
            d[i] = (r * 0.393) + (g * 0.769) + (b * 0.189);
            d[i + 1] = (r * 0.349) + (g * 0.686) + (b * 0.168);
            d[i + 2] = (r * 0.272) + (g * 0.534) + (b * 0.131);
        }
        return pixels;
    }

    function negFilter(pixels) {
        var d = pixels.data;
        for (var i = 0; i < d.length; i += 4) {
            d[i] = 255 - d[i];
            d[i + 1] = 255 - d[i + 1];
            d[i + 2] = 255 - d[i + 2];
        }
        return pixels;
    };

    function brightFilter(pixels) {
        var d = pixels.data;
        var adjustment = 10;
        for (var i = 0; i < d.length; i += 4) {
            d[i] += adjustment;
            d[i + 1] += adjustment;
            d[i + 2] += adjustment;
        }
        return pixels;
    }
    function darkFilter(pixels) {
        var d = pixels.data;
        var adjustment = 0.9;
        for (var i = 0; i < d.length; i += 4) {
            d[i] *= adjustment;
            d[i + 1] *= adjustment;
            d[i + 2] *= adjustment;
        }
        return pixels;
    }

    function thresFilter(pixels) {
        var d = pixels.data;
        for (var i = 0; i < d.length; i += 4) {
            var r = d[i];
            var g = d[i + 1];
            var b = d[i + 2];
            var v = (0.2126 * r + 0.7152 * g + 0.0722 * b >= 110) ? 255 : 0;
            d[i] = d[i + 1] = d[i + 2] = v
        }
        return pixels;
    }
    function blurFilter(pixels, iW, iH) {
        var data = pixels.data;
        var iMW, iSumOpacity, iCnt,iSumRed, iSumGreen, iSumBlue, aCloseData;
        var p1 = p2 = p3 = 0.99;
        var er = eg = eb = 0;
        var iBlurRate = 1;
        for (var br = 0; br < iBlurRate; br += 1) {
            for (var i = 0, n = data.length; i < n; i += 4) {
                iMW = 4 * iW;
                iSumOpacity = iSumRed = iSumGreen = iSumBlue = 0;
                iCnt = 0;
                aCloseData = [
                    i - iMW - 4, i - iMW, i - iMW + 4,
                    i - 4, i + 4,
                    i + iMW - 4, i + iMW, i + iMW + 4
                ];
                for (var e = 0; e < aCloseData.length; e += 1) {
                    if (aCloseData[e] >= 0 && aCloseData[e] <= data.length - 3) {
                        iSumOpacity += data[aCloseData[e]];
                        iSumRed += data[aCloseData[e] + 1];
                        iSumGreen += data[aCloseData[e] + 2];
                        iSumBlue += data[aCloseData[e] + 3];
                        iCnt += 1;
                    }
                }
                data[i] = (iSumOpacity / iCnt) * p1 + er;
                data[i + 1] = (iSumRed / iCnt) * p2 + eg;
                data[i + 2] = (iSumGreen / iCnt) * p3 + eb;
                data[i + 3] = (iSumBlue / iCnt);
            }
        }
        return pixels;
    }
})();
