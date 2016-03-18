(function() {
    var postToBtn = document.getElementsByClassName('postTo fa fa-facebook-square')[0];

    postToBtn.onclick = function(e) {
        e.preventDefault();
        var winTop = (screen.height / 2) - (436 / 2);
        var winLeft = (screen.width / 2) - (626 / 2);
        window.open(
            'http://www.facebook.com/sharer.php?s=100&p[title]=a test title&p[summary]=a test description &p[url]=https://www.google.com.ua/&p[images][0]=https://www.google.com.ua/logos/doodles/2016/st-patricks-day-2016-4834639321497600-hp.gif',
            'facebook-share-dialog',
            'top=' + winTop + ',left=' + winLeft + ',width=626, height=436'
        );
    };

    postToBtn.onmouseover = function() {
        this.style.right = 0;
    };
    postToBtn.onmouseout = function() {
        var that = this;
        setTimeout(function() {
            that.style.right = '-58px';
        }, 1000);
    };
})();
