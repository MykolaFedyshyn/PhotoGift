(function() {
    // Create a connection to Firebase database
    var ref = new Firebase("https://intense-torch-8426.firebaseio.com");
    ref.on("value", function(data) { // Listen for realtime changes
        var templObj = data.val();
        carousel(templObj.simple, templObj.hb, templObj.vacation, templObj.greeting, templObj.assets);
    });

    function addToCanvas() {
        // var canvas = document.getElementById('work-field-canvas');
        // var ctx = canvas.getContext('2d');
        var tmpl = document.getElementsByClassName('templates');
        for (var i = 0; i < tmpl.length; i++) {
            tmpl[i].addEventListener('click', function() {
                var that = this;
                if (canvasContainer.children.length > 2) {
                    showWarning(draw, that);
                } else {
                    draw(that);
                }
            }, false);

        }

        function draw(that) {
            var canvas = document.getElementById('work-field-canvas');
            var ctx = canvas.getContext('2d');
            var mainel = document.getElementById('work-field');
            var img = new Image();
            img.src = that.src;
            while (true) {
                var sibling = canvas.nextElementSibling;
                if (sibling) {
                    sibling.parentNode.removeChild(sibling);
                } else {
                    break;
                }
            }
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            canvas.width = that.naturalWidth;
            canvas.height = that.naturalHeight;
            mainel.style.width = canvas.width + 20 + 'px';
            mainel.style.height = canvas.height + 20 + 'px';
            var canvEl = createElem({
                source: canvasContainer,
                name: 'tmpl',
                image: img,
                width: that.naturalWidth,
                height: that.naturalHeight,
                posX: 0,
                posY: 0,
                canRotate: false,
                canDraw: false
            });
            canvEl.onclick = function() {
                var that = this;
                addMoveListeners(that);
            };
        }
    }

    function addPostcardTemplate(data, id, elClass) {
        var list, assetsList, ul, li, img, i;
        ul = document.createElement('ul');
        list = document.getElementById('postList');
        assetsList = document.getElementById('assetsList');

        ul.id = id;
        ul.className = "postcard-list";

        if (id == 'assets') {
            assetsList.appendChild(ul);
        } else {
            list.appendChild(ul);
            document.getElementById('spinner').style.display = 'none';
        }

        for (i = 1; i < data.length; i++) {
            li = document.createElement('li');
            li.className = 'visibl fade-in';
            img = document.createElement('img');
            img.className = elClass;
            img.src = data[i];
            img.style.height = '100%';
            li.appendChild(img);
            ul.appendChild(li);
        }
        addToCanvas();
    }



    //---------------work with categories------------------------------------------------//
    function carousel(simple, hb, vacation, greeting, assets) {
        var tmplPanel = document.querySelector('#template-wrapper');
        var templateList = document.querySelector('#postList');
        var categoryPanel = document.querySelector('#categories');
        var categories = document.querySelectorAll('#category-wrapper > a');
        var collapseBtn = document.querySelector('#collapse-btn');
        var allPostCards = document.querySelectorAll('#postcards > li');
        var allCalendars = document.querySelectorAll('#calendars > li');
        var prevNav = document.querySelector('#carousel .prev');
        var nextNav = document.querySelector('#carousel .next');
        var prevNavAsset = document.querySelector('#graphicEl .prev');
        var nextNavAsset = document.querySelector('#graphicEl .next');
        var postcardCateg = document.querySelector('#postcardList');
        var calendarCateg = document.querySelector('#calendarList');
        var categoryHandler = document.querySelector('#category-wrapper')
        var assetBtn = document.getElementById('addAsset');
        var assetsPanel = document.getElementById('graphicEl');
        var currIndex = 0;

        assetBtn.addEventListener('click', function(e) {
            drawPanelAnime(assetsPanel, '80px', 1, '0px', '0 0 10px', 'relative');
            addPostcardTemplate(assets, 'assets', 'assetsEl');
            currIndex = 0;
        });
        prevNavAsset.addEventListener('click', function() {
            ulMover(1, document.querySelectorAll('#assets > li'));
        });
        nextNavAsset.addEventListener('click', function() {
            ulMover(-1, document.querySelectorAll('#assets > li'));
        });

        addPostcardTemplate(simple, 'simple', 'templates');


        categoryHandler.addEventListener('click', function(e) {
            var e = e || window.event;
            var target = e.target;

            for (var i = 0; i < categories.length; i++) {
                categories[i].className = 'item no-active';
            }
            target.className = 'item active';
            switch (target.id) {
                case 'simpleList':
                    currIndex = 0;
                    templateList.removeChild(templateList.childNodes[3]);
                    addPostcardTemplate(simple, 'simple', 'templates');
                    break;
                case 'hbList':
                    currIndex = 0;
                    templateList.removeChild(templateList.childNodes[3]);
                    addPostcardTemplate(hb, 'happybirthday', 'templates');
                    break;
                case 'vacationList':
                    currIndex = 0;
                    templateList.removeChild(templateList.childNodes[3]);
                    addPostcardTemplate(vacation, 'vacation', 'templates');
                    break;
                case 'greetingList':
                    currIndex = 0;
                    templateList.removeChild(templateList.childNodes[3]);
                    addPostcardTemplate(greeting, 'greeting', 'templates');
                    break;
            }
        }, false);

        collapseBtn.addEventListener('click', function(event) {
            if (collapseBtn.className !== 'collapsed') {
                tmplPanel.style.display = 'none';
                categoryPanel.style.position = 'absolute';
                categoryPanel.style.bottom = '0';
                collapseBtn.className = 'collapsed';
                collapseBtn.innerHTML = '<i class="fa fa-chevron-up collapse"></i>';
            } else {
                tmplPanel.style.display = 'block';
                categoryPanel.style.position = 'static';
                collapseBtn.className = '';
                collapseBtn.innerHTML = '<i class="fa fa-chevron-down collapse"></i>';
            }
        });

        prevNav.addEventListener('click', function() {
            ulMover(1, templateList.childNodes[3].querySelectorAll('li'));
        });
        nextNav.addEventListener('click', function() {
            ulMover(-1, templateList.childNodes[3].querySelectorAll('li'));
        });

        function ulMover(flag, containerLi) {
            if (flag == 1) {
                if (currIndex > 0) {
                    currIndex--;
                    containerLi[currIndex].className = 'visibl';
                    containerLi[currIndex + 8].className = 'invisibl';
                    console.log(currIndex + '-');
                }
            } else {
                if (currIndex + 8 < containerLi.length) {
                    containerLi[currIndex].className = 'invisibl';
                    containerLi[currIndex + 8].className = 'visibl';
                    currIndex++;
                    // console.log(currIndex + "+");
                }
            }
        }
    }

})();
