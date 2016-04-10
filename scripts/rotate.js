(function() {
    var rotLeft = document.getElementById('rotate-left');
    var rotRight = document.getElementById('rotate-right');
    var mainContainer = document.getElementById('work-field');

    rotLeft.onclick = function() {
        var activeEl = mainContainer.getElementsByClassName('active')[0];
        if(activeEl && activeEl.canRotate) {
            rotateEl(activeEl, '-');
        }
    };
    rotRight.onclick = function() {
        var activeEl = mainContainer.getElementsByClassName('active')[0];
        if(activeEl  && activeEl.canRotate) {
            rotateEl(activeEl, '+');
        }
    };
    //--------------------------------------
    function rotateEl(elem, sign) {
        if(sign == '-') {
            elem.rotateDeg -= 10;
        } else {
            elem.rotateDeg += 10;
        }
        elem.style.transform = 'rotate(' + elem.rotateDeg + 'deg)';
    }

})();
