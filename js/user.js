 function savePwd() {
      $$('.pwd').setCustomValidity("");
      var e0 = $$('#input-pwd0');
      var e1 = $$('#input-pwd1');
      var e2 = $$('#input-pwd2');
      if (e0.value == "") { e0.setCustomValidity(lang[64]); return;}
      if (e1.value == "") { e1.setCustomValidity(lang[64]); return;}
      if (e1.value.length < 8) { e1.setCustomValidity(lang[65]); return;}
      if (e1.value != e2.value) { e2.setCustomValidity(lang[66]); return;}
      var data = {};
      data.type = "password";
      data.pwd_old = SparkMD5.hash(e0.value);
      data.pwd_new = SparkMD5.hash(e1.value);
      $$("#pwd-dialog").open = false;
      loading.open();
      clearPwd();
      $.ajax({
        url: axda + "api/v2/edit_user_info.hsp",
        data: {data:encode(data)},
        dataType: "json",
        success: function(resp)  {
            loading.close();
            if (checkCode(resp)) {
                $("#input-pwd0").show();
            } else {
                mdui.alert({headline:lang[resp.msg]});
            }
        }
      });
 }
var getTarget = function() {
    var array = window.location.pathname.split("/");
    var id = -1;
    let uid = getUser() == undefined ? 0 : getUser().uid;
    if (uid == 0 && array.length < 3) return -1;
    if (uid == 0 && array.length >= 3 && array[2] == "") return -1;
    if (uid == 0 && array.length >= 3 && array[2] != uid) return array[2];
    if (uid > 0 && array.length < 3) return 0;
    if (uid > 0 && array.length >= 3 && array[2] == "") return 0;
    if (uid > 0 && array.length >= 3 && array[2] == uid) return 0;
    if (uid > 0 && array.length >= 3 && array[2] != uid) return array[2];
    return -1;
}
var load = function() {
    var id = getTarget();
    if (id == -1) {
        goto("/#login");
        return;
    }
    var data = {};
    data.uid = id;
    $.ajax({
        url: axda + "api/v2/user.hsp",
        data: {
            "data": encode(data)
        },
        dataType: "json",
        success: function(resp) {
            if (checkCode(resp)) {
                view(resp.data, resp.code);
            } else if (resp.code == 2001) {
                $(".setting").hide();
                view(resp.data, resp.code);
            } else {
                $(".main").hide();
                $(".load").hide();
                $(".not").show();
            }
        },
        error: function(e) {
            load();
        }
    });
}
function view(data, code) {
    $(".main").show();
    $(".load").hide();
    $("#user-icon-m").attr("src", data.icon);
    $("#user-name-m").text(data.name);
    $("#user-sign-m").text(data.sign);
    $("#target-uid").text(data.uid);
    if (data.empty_pwd) {
        $("#input-pwd0").hide();
    }
    if (data.mail == null) {
        $(".card-mail").hide();
    } else {
        $("#user-mail-m").text(data.mail);
    }
    $("#user-register").text(data.register);
    $("#user-notify").prop("checked", data.notify == 1);
    $("#user-show").prop("checked", data["show-info"] == 1);
    if (data["show-info"] == 1 || code == 2000) {
        $(".card-private").show();
        if (data.minebbs != null) {
            $("#user-minebbs").text(data.minebbs);
            $("#user-minebbs").attr("href", data.minebbs_url);
            $("#user-minebbs").attr("target", "_blank");
        }
    } else {
        $(".card-private").hide();
    }
    if (code == 2000 && data.verified == 0) {
        $(".verified").show();
    }
}
loadList.push(load);
function minebbs() {
    loading.open();
    $.ajax({
        url: axda + "api/v2/account_minebbs.hsp",
        data: null,
        dataType: "json",
        success: function(resp) {
            loading.close();
            if (checkCode(resp)) {
                mdui.alert({headline:lang[resp.msg],description:resp.data.username});
                $("#user-minebbs").text(resp.data.username);
                $(".user-icon").attr("src", resp.data.icon);
                $("#user-minebbs").attr("href", resp.data.minebbs_url);
                $("#user-minebbs").attr("target", "_blank");
            } else {
                mdui.alert({headline:lang[resp.msg],description:lang[108]});
            }
        },
        error: function(e) {
            loading.close();
            mdui.alert({headline: lang[105]});
        }
    });
}
function saveName() {
    $$("#input-name").setCustomValidity("");
    var name = $("#input-name").val();
    if (name.length < 2) {
        $$("#input-name").setCustomValidity(lang[111]);
        return;
    }
    if (name.length > 20) {
        $$("#input-name").setCustomValidity(lang[112]);
        return;
    }
    $$("#name-dialog").open = false;
    loading.open();
    var data = {};
    data.type = "name";
    data.name = name;
    $.ajax({
        url: axda + "api/v2/edit_user_info.hsp",
        data: {"data": encode(data)},
        dataType: "json",
        success: function(resp) {
            loading.close();
            if (checkCode(resp)) {
                $("#user-name-m").text(resp.data.name);
            } else {
                mdui.alert({headline:lang[resp.msg]});
            }
        },
        error: function(e) {
            loading.close();
            mdui.alert({headline:lang[105]});
        }
    });
}
function saveSign() {
    $$("#input-sign").setCustomValidity("");
    var sign = $("#input-sign").val();
    if (sign.length > 100) {
        $$("#input-sign").setCustomValidity(lang[114]);
        return;
    }
    $$("#sign-dialog").open = false;
    loading.open();
    var data = {};
    data.type = "sign";
    data.sign = sign;
    $.ajax({
        url: axda + "api/v2/edit_user_info.hsp",
        data: {"data": encode(data)},
        dataType: "json",
        success: function(resp) {
            loading.close();
            if (checkCode(resp)) {
                $("#user-sign-m").text(resp.data.sign);
            } else {
                mdui.alert({headline:lang[resp.msg]});
            }
        },
        error: function(e) {
            loading.close();
            mdui.alert({headline:lang[105]});
        }
    });
}
$("#user-notify").on("change", function(e){
    var sw = $("#user-notify");
    sw.prop("disabled", true);
    var data = {};
    data.type = "notify";
    data.notify = sw.prop("checked");
    $.ajax({
        url: axda + "api/v2/edit_user_info.hsp",
        data: {data: encode(data)},
        dataType: "json",
        success: function(resp) {
            sw.prop("disabled", false);
            if (checkCode(resp)) {
                sw.prop("checked", resp.data.notify);
            }
        },
        error: function(e) {
            sw.prop("disabled", false);
            sw.prop("checked", !data.notify);
        }
    });
});
$("#user-show").on("change", function(e){
    var sw = $("#user-show");
    sw.prop("disabled", true);
    var data = {};
    data.type = "show";
    data.show = sw.prop("checked");
    $.ajax({
        url: axda + "api/v2/edit_user_info.hsp",
        data: {data: encode(data)},
        dataType: "json",
        success: function(resp) {
            sw.prop("disabled", false);
            if (checkCode(resp)) {
                sw.prop("checked", resp.data.notify);
            }
        },
        error: function(e) {
            sw.prop("disabled", false);
            sw.prop("checked", !data.notify);
        }
    });
});
function clearPwd() {
    $("#input-pwd0").val("");
    $("#input-pwd1").val("");
    $("#input-pwd2").val("");
}
updateView();