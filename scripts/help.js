(function() {
    var objArr = [{
        content: 'Choose proper template',
        top: '-90px',
        // left: '50px',
        left: '1%',
        classN: 'fa fa-arrow-down'
    }, {
        content: 'Add your images',
        top: '-1px',
        //left: '-310px',
        left: '-150%',
        classN: 'fa fa-arrow-right'
    }, {
        content: 'Drag the images to the work field',
        top: '25px',
        // left: '170px',
        left: '20%',
        classN: 'fa fa-arrow-down'
    }, {
        content: 'Use the tools panel',
        top: '200px',
        // right: '-350px',
        right: '-430%',
        classN: 'fa fa-arrow-left'
    }, {
        content: 'Save the postcard',
        top: '10px',
        // right: '110px',
        right: '8%',
        classN: 'fa fa-arrow-right'
    }];
    var helpBtn = document.getElementsByClassName('help fa fa-question-circle')[0];
    var i = 0;
    var wrap = document.getElementById('wrapper');
    var containerArr = [];
    containerArr[0] = document.getElementById('carousel');
    containerArr[1] = document.querySelector('#content-panel .uploadButton');
    containerArr[2] = document.getElementById('work-field-container');
    containerArr[3] = document.getElementById('tools-panel')
    containerArr[4] = document.getElementById('file-buttons');

    helpBtn.onclick = function(e) {
        e.preventDefault();
        var coverDiv = document.createElement('div');
        coverDiv.className = 'hoverBlack';
        wrap.appendChild(coverDiv);
        coverDiv.style.zIndex = 40;
        // coverDiv.style.width = window.innerWidth + 'px';
        // coverDiv.style.height = window.innerHeight + 'px';
        coverDiv.style.width = screen.width + 'px';
        coverDiv.style.height = screen.height + 'px';
        createHelpBox(containerArr[i], objArr[i], wrap, coverDiv);
    };

    function createHelpBox(container, obj, wrap, coverDiv) {
        var tempElem = null;
        if(container.id == 'file-buttons') {
            tempElem = container.querySelector('.save');
            tempElem.style.zIndex = 45;
        } else {
            container.style.zIndex = 45;
        }
        var tempDiv = document.createElement('div');
        tempDiv.className = 'infoBox ' + obj.classN;
        tempDiv.innerHTML = obj.content;
        container.appendChild(tempDiv);
        if (obj.left) {
            tempDiv.style.left = obj.left;
        } else {
            tempDiv.style.right = obj.right;
        }
        tempDiv.style.top = obj.top;
        setTimeout(function() {
            tempDiv.style.opacity = 1;
            setTimeout(function() {
                tempDiv.style.opacity = 0;
                if(tempElem) {
                    tempElem.style.zIndex = 25;
                } else {
                    container.style.zIndex = 25;
                }
                if (i < 4) {
                    i++;
                    createHelpBox(containerArr[i], objArr[i], wrap, coverDiv);
                } else {
                    setTimeout(function(){
                        wrap.removeChild(coverDiv);
                        removeHelpBox(containerArr);
                        i = 0;
                    }, 1000);
                }
            }, 2000);
        }, 1000);
    }
    function removeHelpBox(arr) {
        arr.forEach(function(elem){
            var helpBox = elem.querySelector('.infoBox');
            elem.removeChild(helpBox);
        });
    }
})();
