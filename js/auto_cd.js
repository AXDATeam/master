var updateWidth = function () {
    $(".list").each(function() {
        var w = $(this).parent().innerWidth();
        if (w > 800) {
            $(this).innerWidth(w);
        } else {
            $(this).innerWidth(800);
        }
    });
}
viewListener.push(updateWidth);