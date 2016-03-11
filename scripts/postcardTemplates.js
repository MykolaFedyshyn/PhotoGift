(function(){
// Create a connection to Firebase database
    var ref = new Firebase("https://intense-torch-8426.firebaseio.com");

    ref.on("value", function(data) { // Listen for realtime changes
    var templates = [];
        templObj = data.val();
        for ( var key in templObj) {
            templates.push(templObj[key]);
        }
        addPostcardTemplate(templates);
        carousel();
    });

    function addToCanvas(){
        var canvas = document.getElementById('work-field-canvas');
        var ctx = canvas.getContext('2d');
        var templSvg = document.getElementsByClassName('templates');
        for (var i = 0; i < templSvg.length; i++) {
            templSvg[i].addEventListener('click',draw,false);
        }
        function draw(){
            canvg(canvas, this.firstChild.firstChild.outerHTML);
        }
    }

    function addPostcardTemplate(data){
        var li, svg, template, id, i;
        var ul = document.getElementById('postcards');
        for (i=0; i<data.length;i++){
            li = document.createElement('li');
            li.className = 'visibl';
            svg = document.createElement('svg');
            svg.innerHTML = '<svg viewBox="0 0 400 510" width="200" height="100" id="id'+i+'">'+
                            '<use xlink:href="#'+i+'"/></svg>';
            svg.className = 'templates';
            li.appendChild(svg);
            ul.appendChild(li);
            template = document.getElementById('id' + i);
            template.innerHTML = data[i];
            addToCanvas();
        }
    }

//---------------work with categories------------------------------------------------//
    function carousel() {
        var elemContainer = document.querySelector('#postcards');
        var containerLi = elemContainer.querySelectorAll('li');
        var prevNav = document.querySelector('#carousel .prev');
        var nextNav = document.querySelector('#carousel .next');
        var containerPos = 0;
        var containerWidth = 100;
        var currIndex = 0;

        prevNav.addEventListener('click', function() {
            ulMover(1);
        });
        nextNav.addEventListener('click', function() {
            ulMover(-1);
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
}

})();



