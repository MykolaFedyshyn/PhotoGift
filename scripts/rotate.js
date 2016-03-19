(function() {
    var rotLeft = document.getElementById('rotate-left');
    var rotRight = document.getElementById('rotate-right');
    var mainContainer = document.getElementById('work-field');
    //var objArr = [];

    rotLeft.onclick = function() {
        var activeEl = mainContainer.getElementsByClassName('active')[0];
        if(activeEl) {
            rotateEl(activeEl, '-');
        }
    };
    rotRight.onclick = function() {
        var activeEl = mainContainer.getElementsByClassName('active')[0];
        if(activeEl) {
        rotateEl(activeEl, '+');
        }
    };
    //--------------------------------------
    function rotateEl(elem, sign) {
        //var ind = addToArr(elem, objArr);
        if(sign == '-') {
            elem.rotateDeg -= 10;
        } else {
            elem.rotateDeg += 10;
        }
        elem.style.transform = 'rotate(' + elem.rotateDeg + 'deg)';
    }
    // function addToArr(elem, objArr) {
    //     var index;
    //     var flag = false;
    //     if (objArr !== 0) {
    //         objArr.forEach(function(element, ind) {
    //             if (elem.id == element.id) {
    //                 flag = true;
    //                 index = ind;
    //             }
    //         });
    //     }
    //     if (flag) {
    //         return index;
    //     } else {
    //         var tempObj = {};
    //         tempObj.id = elem.id;
    //         tempObj.deg = 0;
    //         objArr.push(tempObj);
    //         return objArr.length - 1;
    //     }
    // }
})();