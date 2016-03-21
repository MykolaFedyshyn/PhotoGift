(function(){
// Create a connection to Firebase database
    var ref = new Firebase("https://intense-torch-8426.firebaseio.com");
    ref.on("value", function(data) { // Listen for realtime changes
    var postcardTempl = [];
    var calendarTempl = [];
    var templObj = data.val();
        for ( var key in templObj.postcards) {
            postcardTempl.push(templObj.postcards[key]);
        }
        for ( var key in templObj.calendars) {
            calendarTempl.push(templObj.calendars[key]);
        }
        addPostcardTemplate(calendarTempl, 'calendars');
        addPostcardTemplate(postcardTempl, 'postcards');
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
            var mainel = document.getElementById('work-field');
            var canvas = document.getElementById('work-field-canvas');
            while(true) {
                var sibling = canvas.nextElementSibling;
                if(sibling) {
                    sibling.parentNode.removeChild(sibling);
                } else {
                    break;
                }
            }
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            canvas.width = this.naturalWidth;
            canvas.height = this.naturalHeight;
            mainel.style.width = canvas.width + 20 + 'px';
            mainel.style.height = canvas.height + 20 + 'px';
            ctx.drawImage(this,0,0);
        }
    }

    function addPostcardTemplate(data, id){
        var li, img, i;
        var ul = document.getElementById(id);
            if (id == 'postcards') {
                var spin = document.getElementById('spinner');
                ul.removeChild(spin);
            }
       
        for (i=0; i<data.length;i++){
            li = document.createElement('li');
            li.className = 'visibl fade-in';
            img = document.createElement('img');
            img.className = 'templates fade-in';
            img.src = data[i];
            img.style.height = '100%';
            li.appendChild(img);
            ul.appendChild(li);
        }
         addToCanvas();
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
            var allPostCards = document.querySelectorAll('#postcards > li');
            var allCalendars = document.querySelectorAll('#calendars > li');
            for (var i = 0; i < allPostCards.length; i++) {
                allPostCards[i].className = 'invisibl fade-in';
            }
            for (var i = 0; i < allCalendars.length; i++) {
                allCalendars[i].className = 'visibl fade-in';
            }
        });
        document.querySelector('#categories .postcardItem').addEventListener('click', function(event) {
            event.preventDefault();
            var allPostCards = document.querySelectorAll('#postcards > li');
            var allCalendars = document.querySelectorAll('#calendars > li');
            for (var i = 0; i < allPostCards.length; i++) {
                allPostCards[i].className = 'visibl fade-in';
            }
            for (var i = 0; i < allCalendars.length; i++) {
                allCalendars[i].className = 'invisibl fade-in';
            }
        });

    function ulMover(flag) {
        if (flag == 1) {
            if (currIndex > 0) {
                currIndex--;
                containerLi[currIndex].className = 'visibl fade-in';
                containerLi[currIndex + 5].className = 'invisibl fade-in';
            }
        } else {
            if (currIndex + 5 < containerLi.length) {
                containerLi[currIndex].className = 'invisibl fade-in';
                containerLi[currIndex + 5].className = 'visibl fade-in';
                currIndex++;
            }
        }
    }
}

})();



