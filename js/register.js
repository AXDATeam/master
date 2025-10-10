    function register() {
        $("#tips").addClass("mdui-hidden");
        var mail = $("#mail").val();
        var pwd1 = $("#pwd1").val();
        var pwd2 = $("#pwd2").val();
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!re.test(mail)) {
            $("#tips").text("邮箱格式不正确");
            $("#tips").removeClass("mdui-hidden");
            return;
        }
        if (pwd1.length < 8) {
            $("#tips").text("密码不能低于8位");
            $("#tips").removeClass("mdui-hidden");
            return;
        }
        if (pwd1 != pwd2) {
            $("#tips").text("两次输入的密码不一致");
            $("#tips").removeClass("mdui-hidden");
            return;
        }
        showLoading();
        $.ajax({
            url: 'api/reg.hsp',
            type: 'POST',
            data: {
                'mail': btoa(mail),
                'pwd': md5(pwd1.trim())
            },
            dataType: 'json',
            success: function(data, textStatus, jqXHR) {
                closeLoading();
                //console.log(data);
                if (data.status == 200) {
                    setTimeout(_goto, 200);
                } else {
                    $("#tips").text(data.msg);
                    $("#tips").removeClass("mdui-hidden");
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                closeLoading();
                $("#tips").text("提交请求失败，请稍后再试。");
                $("#tips").removeClass("mdui-hidden");
            }
        });
    }

    function _goto() {
        window.location.replace('/');
    }