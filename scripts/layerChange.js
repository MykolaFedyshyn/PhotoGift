(function () {
    var mainContainer = document.getElementById('work-field');
    var layerUp = document.getElementById('layer-up');
    var layerDown = document.getElementById('layer-down');

    layerUp.onclick = function () {
        var maxZindex = 0;
        var activeEl = mainContainer.getElementsByClassName('active')[0];
        var allDivs = document.querySelectorAll('#work-field > div');
        if (activeEl) {
            for (var i = 0; i < allDivs.length; i++) {
                if (allDivs[i].style.zIndex > maxZindex) {
                    maxZindex = allDivs[i].style.zIndex;
                }
            }
            if (maxZindex > activeEl.style.zIndex) {
                activeEl.style.zIndex = +maxZindex + 1;
            }
        }
    };
    layerDown.onclick = function () {
        var activeEl = mainContainer.getElementsByClassName('active')[0];
        var allDivs = document.querySelectorAll('#work-field > div');
        if (activeEl && activeEl.style.zIndex > 1) {
            for (var i = 0; i < allDivs.length; i++) {
                allDivs[i].style.zIndex = +(allDivs[i].style.zIndex) + 1;
            }
            activeEl.style.zIndex = 1;
        }
    };
})();
