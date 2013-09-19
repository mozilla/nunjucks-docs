$(function() {

    var toc = $('.toc');
    if(toc.length) {
        toc.affix({
            offset: {
                top: toc[0].getBoundingClientRect().top
            }
        });
    }

});
