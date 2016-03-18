(function() {
    var helpBtn = document.getElementsByClassName('help fa fa-question-circle')[0];
    var i = 0;
    var objArr = [{
        content: 'Choose proper template',
        top: '-40px',
        left: '400px',
        classN: 'fa fa-arrow-down'
    }, {
        content: 'Add your images',
        top: '0',
        left: '-185px',
        classN: 'fa fa-arrow-right'
    }, {
        content: 'Drag the images to the work field',
        top: '25px',
        left: '300px',
        classN: 'fa fa-arrow-down'
    }, {
        content: 'Use the tools panel to edit your postscard',
        top: '200px',
        right: '-360px',
        classN: 'fa fa-arrow-left'
    }, {
        content: 'Save the postcard',
        top: '8px',
        right: '90px',
        classN: 'fa fa-arrow-right'
    }];
    var containerArr = [];
    containerArr[0] = document.getElementById('carousel');
    containerArr[1] = document.querySelector('#content-panel .uploadButton');
    containerArr[2] = document.getElementById('work-field-container');
    containerArr[3] = document.getElementById('tools-panel')
    containerArr[4] = document.getElementById('file-buttons');

    helpBtn.onclick = function(e) {
        e.preventDefault();
        createHelpBox(containerArr[i], objArr[i]);
    };

    helpBtn.onmouseover = function() {
        this.style.right = 0;
    };
    helpBtn.onmouseout = function() {
        var that = this;
        setTimeout(function() {
            that.style.right = '-58px';
        }, 1000);
    };

    function createHelpBox(container, obj) {
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
                if (i < 4) {
                    i++;
                    createHelpBox(containerArr[i], objArr[i]);
                } else {
                    setTimeout(function(){
                        removeHelpBox(containerArr);
                        i = 0;
                    }, 3000);
                }
            }, 3000);
        }, 1000);
    }
    function removeHelpBox(arr) {
        arr.forEach(function(elem){
            var helpBox = elem.querySelector('.infoBox');
            elem.removeChild(helpBox);
        });
    }
})();
