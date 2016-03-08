//---------------work with categories---------------------
(function() {
    var elemContainer = document.querySelector('#carousel ul');
    var containerLi = elemContainer.querySelectorAll('li');
    var prevNav = document.querySelector('#carousel .prev');
    var nextNav = document.querySelector('#carousel .next');
    var containerPos = 0;
    var containerWidth = 100;
    var currIndex = 0;

    prevNav.addEventListener('click', function() {
        ulMover(-1);
    });
    nextNav.addEventListener('click', function() {
        ulMover(1);
    });
    document.querySelector('#categories .calendarItem').addEventListener('click', function(event) {
        event.preventDefault();
        elemContainer.style.left = '100%';
    });
    document.querySelector('#categories .postcardItem').addEventListener('click', function(event) {
        event.preventDefault();
        elemContainer.style.left = '0';
    });

    function ulMover(flag) {
        if (flag == 1) {
            if (currIndex > 0) {
                currIndex--;
                containerLi[currIndex].className = 'visibl';
                containerLi[currIndex + 5].className = 'invisibl';
            }
        } else {
            if (currIndex + 5 < containerLi.length) {
                containerLi[currIndex].className = 'invisibl';
                containerLi[currIndex + 5].className = 'visibl';
                currIndex++;
            }
        }
    }
})();
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
