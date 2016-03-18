(function() {
    var postToBtn = document.getElementsByClassName('postTo fa fa-facebook-square')[0];

    postToBtn.onmouseover = function() {
        this.style.right = 0;
    };
    postToBtn.onmouseout = function() {
        var that = this;
        setTimeout(function() {
            that.style.right = '-58px';
        }, 2000);
    };
})();