(function() {
    var assetBtn = document.getElementById('addAsset');
    var assetsPanel = document.getElementById('graphicEl');

    assetBtn.onclick = function(e) {
        drawPanelAnime(assetsPanel, '80px', 1, '0px', '0 0 10px', 'relative');
    };

})();