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
        addPostcardTemplate(postcardTempl, 'postcards');
        addPostcardTemplate(calendarTempl, 'calendars');
        carousel();
    });

    function addToCanvas(){
        var canvas = document.getElementById('work-field-canvas');
        var ctx = canvas.getContext('2d');
        var tmpl = document.getElementsByClassName('templates');
        for (var i = 0; i < tmpl.length; i++) {
            tmpl[i].addEventListener('click',draw,false);
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
        var spin = document.getElementById('spinner');
        var ul = document.getElementById(id);
            if (id == 'postcards') {
                ul.removeChild(spin);
            }
       
        for (i=0; i<data.length;i++){
            li = document.createElement('li');
            li.className = 'visibl fade-in';
            img = document.createElement('img');
            img.className = 'templates';
            img.src = data[i];
            img.style.height = '100%';
            li.appendChild(img);
            ul.appendChild(li);
        }
         addToCanvas();
    }

//---------------work with categories------------------------------------------------//
    function carousel() {
        var tmplPanel = document.querySelector('#template-wrapper');
        var collapsePanel = document.querySelector('#categories');
        var collapseBtn = document.querySelector('#collapse-btn');
        var allPostCards = document.querySelectorAll('#postcards > li');
        var allCalendars = document.querySelectorAll('#calendars > li');
        var prevNav = document.querySelector('#carousel .prev');
        var nextNav = document.querySelector('#carousel .next');
        var postcardCateg = document.querySelector('#categories .postcardItem');
        var calendarCateg = document.querySelector('#categories .calendarItem');
        var currIndex = 0;

        prevNav.addEventListener('click', function() {
            if (postcardCateg.className == 'postcardItem active') {
                ulMover(1, allPostCards);
            } else {
                ulMover(1, allCalendars);
            }
        });
        nextNav.addEventListener('click', function() {
            if (postcardCateg.className == 'postcardItem active') {
                ulMover(-1, allPostCards);
            } else {
                ulMover(-1, allCalendars);
            }
        });
        calendarCateg.addEventListener('click', function(event) {
            event.preventDefault();
            
            for (var i = 0; i < allPostCards.length; i++) {
                allPostCards[i].className = 'invisibl';
            }
            for (var i = 0; i < allCalendars.length; i++) {
                allCalendars[i].className = 'visibl fade-in';
            }
            calendarCateg.className = 'calendarItem active';
            postcardCateg.className = 'postcardItem no-active';
        });
        postcardCateg.addEventListener('click', function(event) {
            event.preventDefault();

            for (var i = 0; i < allPostCards.length; i++) {
                allPostCards[i].className = 'visibl fade-in';
            }
            for (var i = 0; i < allCalendars.length; i++) {
                allCalendars[i].className = 'invisibl';
            }
            calendarCateg.className = 'calendarItem no-active';
            postcardCateg.className = 'postcardItem active';
        });
        collapseBtn.addEventListener('click', function(event) {
            
            if (collapseBtn.className !== 'collapsed') {
                tmplPanel.style.display = 'none';
                collapsePanel.style.position = 'absolute';
                collapsePanel.style.bottom = '0';
                collapseBtn.className = 'collapsed';
                collapseBtn.innerHTML = '<i class="fa fa-chevron-up collapse"></i>';
            } else {
                tmplPanel.style.display = 'block';
                collapsePanel.style.position = 'static';
                collapseBtn.className = '';
                collapseBtn.innerHTML = '<i class="fa fa-chevron-down collapse"></i>';
            }
        });

    function ulMover(flag, containerLi) {
        if (flag == 1) {
            if (currIndex > 0) {
                currIndex--;
                containerLi[currIndex].className = 'visibl';
                containerLi[currIndex + 8].className = 'invisibl';
            }
        } else {
            if (currIndex + 8 < containerLi.length) {
                containerLi[currIndex].className = 'invisibl';
                containerLi[currIndex + 8].className = 'visibl';
                currIndex++;
            }
        }
    }
}

})();





