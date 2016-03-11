//------------------add new elem to picture list-----------------------
(function() {
    var inpFile = document.querySelector('#fileLoad');
    var pictContainer = document.querySelector('.picturesContainer');
    var tempEl;
    var index = 0;
    inpFile.addEventListener('change', function() {
        if (index == 3) {
            tempEl = document.createElement('div');
            tempEl.className = 'pictHolder';
            pictContainer.appendChild(tempEl);
            pictContainer.style.overflowY = 'scroll';
        } else {
            index++;
        }        
    });
})();