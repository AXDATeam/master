var key = window.location.pathname.split("/")[4];
$.ajax({
    url: axda + "api/v2/reset_password.hsp",
    data: {data: encode({key: key, type: 'get'})},
    dataType: "json",
    success: function(resp) {
        $(".loading").hide();
        if (checkCode(resp)) {
            $(".input").show();
        } else if (resp.code == 5044) {
            $(".error").show();
        } else {
            $(".error").show();
        }
    }
});

function submit() {
    var pwd = $("#pwd").val();
    if (pwd.length < 8) {
        $$("#pwd").setCustomValidity(lang[65]);
    } else {
        $.ajax({
            url: axda + "api/v2/reset_password.hsp",
            data: {data: encode({key: key, password: SparkMD5.hash(pwd), type: "verify"})},
            dataType: "json",
            success: function(resp) {
                if (checkCode(resp)) {
                    $(".input").hide();
                    $(".done").show();
                } else {
                    $(".input").hide();
                    $(".error").show();
                }
            }
        });
    }
}