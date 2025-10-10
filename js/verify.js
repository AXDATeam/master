var array = window.location.pathname.split("/");
if (array.length == 5 && array[4] != '') {
    $.ajax({
        url: axda + "api/v2/verified_handle.hsp",
        data: {data: encode({key:array[4]})},
        dataType: "json",
        success: function(resp) {
            if (resp.code == 2000) {
                success(resp.data.mail);
            } else {
                invalid();
            }
        },
    });
} else {
    invalid();
}

function invalid() {
    $(".invalid").show();
    $(".loading").hide();
    $(".success").hide();
}

function success(mail) {
    $(".invalid").hide();
    $(".loading").hide();
    $(".success").show();
    $("#mail").text(mail);
}