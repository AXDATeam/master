var axda = window.location.protocol + "//" + window.location.hostname + "/";
var navBig = document.querySelector("#nav-big");
var navSmall = document.querySelector("#nav-sm");
var isSmall;
var isBig;
var $ = mdui.$;
var viewListener = [];
var navStat = isSmall() ? "" : "open";
var openNow = false;
Base64.extendString();
//mdui.setColorScheme("#FF0000");
$.ajaxSetup({
    global: false,
    method: 'POST'
});
getTheme();
var filterList = {
    nkx: "Cloudburst Nukkit",
    mot: "Nukkit-MOT",
    pnx: "PowerNukkitX 1.0"
};
var f = getFilter();
if (f != "nkx" && f != "pnx" && f != "mot") {
    localStorage.setItem("filter", "mot");
}
function encode(data) {
    return JSON.stringify(data).toBase64();
}
function getData(type) {
    var data = {};
    if (type != null) data.type = type;
    return data;
}
$("#appbar").html(`
<mdui-top-app-bar scroll-behavior="elevate" id="appbar">
    <mdui-button-icon icon="menu" onclick="drawer()"></mdui-button-icon>
    <mdui-top-app-bar-title><text onclick="goto('/')">AXDA</text></mdui-top-app-bar-title>
    <mdui-dropdown placement="bottom">
        <mdui-button-icon slot="trigger" icon="light_mode"></mdui-button-icon>
        <mdui-menu>
            <mdui-menu-item class="theme-btn l" lang="212" id="theme-auto" icon="" onclick="setTheme('auto')">跟随系统</mdui-menu-item>
            <mdui-menu-item class="theme-btn l" lang="213" id="theme-light" icon="" onclick="setTheme('light')">明亮主题</mdui-menu-item>
            <mdui-menu-item class="theme-btn l" lang="214" id="theme-dark" icon="" onclick="setTheme('dark')">暗色主题</mdui-menu-item>
        </mdui-menu>
    </mdui-dropdown>
    <mdui-dropdown placement="bottom">
        <mdui-button-icon slot="trigger" icon="translate"></mdui-button-icon>
        <mdui-menu>
            <mdui-menu-item class="lang-btn" id="lang-chs" onclick="setLanguage('chs')">简体中文</mdui-menu-item>
            <mdui-menu-item class="lang-btn" id="lang-eng" onclick="setLanguage('eng')">English</mdui-menu-item>
        </mdui-menu>
    </mdui-dropdown>
    <mdui-button-icon id="login-btn" class="hide" icon="login" onclick="login()"></mdui-button-icon>
    <mdui-button-icon id="user-btn" class="hide" icon="person" onclick="$$('#user-dialog').open = true;"></mdui-button-icon>
    <div class="big" style="width:20px;"></div>
</mdui-top-app-bar>
`);
$(".appnav").html(`
<mdui-navigation-drawer ${navStat} close-on-overlay-click id="nav">
    <div class="big" style="height:60px;"></div>
        <div class="text-center p-4" onclick="goto('/')">
            <img class="mt-3" width="100px" src="/images/logo.png"/>
            <div><strong style="font-size:24px">AXDA</strong></div>
        </div>
        <div class="pl-4 pr-4">
            <mdui-list-subheader class="l" lang="3" style="font-size:14px;">过滤器</mdui-list-subheader>
            
            <mdui-dropdown placement="bottom" id="filter-drop">
                <mdui-button class="m-1" variant="filled" id="filter-btn" onclick="" icon="api" slot="trigger" full-width>-</mdui-button>
                <mdui-card variant="filled" id="filter-card" style="width:200px;">
                    <mdui-button variant="text" class="m-1" onclick="filter('mot')" full-width>Nukkit-MOT</mdui-button>
                    <mdui-button variant="text" class="m-1" onclick="filter('nkx')" full-width>Cloudburst Nukkit</mdui-button>
                    <mdui-button variant="text" class="m-1" onclick="filter('pnx')" full-width>PowerNukkitX</mdui-button>
                </mdui-card>
            </mdui-dropdown>
            <mdui-divider class="mt-4"></mdui-divider>
            <mdui-list>
                <mdui-list-subheader class="l ver-center" lang="217" style="font-size:14px;height:38px;">导航</mdui-list-subheader>
                <mdui-list-item icon="home" class="l" lang="216" href="/" rounded>首页</mdui-list-item>
                <mdui-list-item icon="login" class="l unlogin hide" lang="10" href="javascript:login()" rounded>登录</mdui-list-item>
            </mdui-list>
            <mdui-divider class="mt-4"></mdui-divider>
            <div class="plugin-menu hide">
                <mdui-list>
                    <mdui-list-subheader class="l ver-center" lang="9" style="font-size:14px;height:38px;">插件</mdui-list-subheader>
                    <mdui-list-item icon="post_add" class="l" lang="4" href="javascript:pubilsh();" rounded>发布插件</mdui-list-item>
                    <mdui-list-item icon="account_tree" class="l" lang="5" href="javascript:goto('/manage')" rounded>插件管理</mdui-list-item>
                    <mdui-list-item icon="person" class="l" lang="6" href="javascript:toUser();" rounded>个人中心</mdui-list-item>
                </mdui-list>
            <mdui-divider class="mt-4"></mdui-divider>
            </div>
            <mdui-list>
                <mdui-list-subheader class="l ver-center" lang="7" style="font-size:14px;height:38px;">下载</mdui-list-subheader>
                <mdui-list-item onclick="mdui.confirm({description:'此网页内容由第三方提供,是否跳转?',confirmText:'确认',cancelText:'取消',onConfirm:()=>{window.location.href='https://mc.minebbs.com/'}})" target="_blank" rounded>
                    <div class="ver-center"><text class="l mr-2" lang="8">基岩版客户端</text><mdui-icon name="link"></mdui-icon></div>
                    <mdui-icon slot="icon" src="/images/minecraft.svg">
                </mdui-avatar></mdui-list-item>
                <mdui-list-item href="/app/kernel/" icon="api" rounded>AXDA Kernel</mdui-list-item>
            </mdui-list>
        </div>
        </mdui-navigation-drawer>
`);
$("body").append(`
<mdui-dialog id="loading" class="text-center p-4">
    <mdui-icon slot="icon" class="mb-3 mr-2"><mdui-circular-progress></mdui-circular-progress></mdui-icon>
</mdui-dialog>
`);
$("body").append(`
<mdui-dialog close-on-esc close-on-overlay-click headline="AXDA 用户登录" id="login-dialog" class="lt" lt="198">
    <div class="p-2">
        <form>
        <mdui-text-field variant="outlined" label="E-mail" type="email" class="mt-2 login-input" id="login-mail">
            <mdui-button-icon slot="icon" icon="mail"></mdui-button-icon>
        </mdui-text-field>
        <mdui-text-field variant="outlined" label="密码" type="password" class="mt-4 login-input ll" ll="197" id="login-passwd" toggle-password>
            <mdui-button-icon slot="icon" icon="lock"></mdui-button-icon>
        </mdui-text-field>
        </form>
        <div class="mdui-prose ver-center">
            <mdui-checkbox checked class="mt-4 login-input l" lang="195" id="login-protocol" onclick="$('#login-button').prop('disabled', $('#login-protocol').prop('checked'))">阅读并同意</mdui-checkbox>
            <a href="/docs/license" style="font-size:14px;margin-top:1px;" class="l" lang="196">用户协议</a>
        </div>
        <mdui-button class="mt-4 l" full-width onclick="api_login()" id="login-button" lang="10">登录</mdui-button>
        <mdui-button class="mt-2" full-width onclick="minebbs_oauth()">
            <div class="l" lang="192">使用MineBBS账户登录</div>
            <mdui-icon slot="icon" src="/images/minebbs.svg"></mdui-icon>
        </mdui-button>
        <div>
            <mdui-button class="mt-2 sm-full l" lang="193" variant="outlined" onclick="register();">没有账号？立即注册</mdui-button>
            <mdui-button class="mt-2 text-right big l" lang="194" placement="right" variant="outlined" onclick="resetpwd()">忘记密码</mdui-button>
            <mdui-button full-width class="mt-2 small l" lang="194" placement="right" variant="outlined" onclick="resetpwd()">忘记密码</mdui-button>
        </div>
    </div>
</mdui-dialog>
`);

$("body").append(`
<mdui-dialog close-on-esc close-on-overlay-click headline="AXDA 用户注册" id="register-dialog" class="lt" lt="199">
    <div class="p-2">
        <mdui-text-field variant="outlined" label="E-mail" type="email" class="mt-2 reg-input" id="reg-mail">
            <mdui-button-icon slot="icon" icon="mail"></mdui-button-icon>
        </mdui-text-field>
        <mdui-text-field variant="outlined" label="密码" type="password" class="mt-4 reg-input ll" ll="197" id="reg-pwd0" toggle-password>
            <mdui-button-icon slot="icon" icon="lock"></mdui-button-icon>
        </mdui-text-field>
        <mdui-text-field variant="outlined" label="确认密码" type="password" class="mt-4 reg-input ll" ll="200" id="reg-pwd1" toggle-password>
            <mdui-button-icon slot="icon" icon="lock"></mdui-button-icon>
        </mdui-text-field>
        <p class="mt-4 l" lang="203">注册即代表同意用户条款</p>
        <mdui-button class="mt-4 l" id="reg-btn" onclick="api_register()" full-width lang="11">注册</mdui-button>
        <mdui-button class="mt-2 reg-input l" lang="201" variant="outlined" onclick="login()" full-width>已有账号？返回登录</mdui-button>
    </div>
</mdui-dialog>
`);

$("body").append(`
<mdui-dialog close-on-esc close-on-overlay-click headline="AXDA 找回密码" id="resetpwd-dialog" class="lt" lt="202">
    <div class="p-2">
        <mdui-text-field variant="outlined" label="E-mail" type="email" class="mt-2" id="reset-pwd-input">
            <mdui-button-icon slot="icon" icon="mail"></mdui-button-icon>
        </mdui-text-field>
        <p class="mt-4 l" lang="204">我们将发送一封重置密码操作的邮件</p>
        <mdui-button class="mt-4 l" lang="95" id="reset-pwd-btn" onclick="api_resetPwd()" full-width>确认</mdui-button>
        <mdui-button class="mt-2 l" lang="205" variant="outlined" onclick="login()" full-width>返回登录</mdui-button>
    </div>
</mdui-dialog>
`);

$("body").append(`
<mdui-dialog close-on-esc close-on-overlay-click headline="个人信息" id="user-dialog" class="lt" lt="218">
    <div class="p-2">
        <div style="" class="text-center">
            <mdui-avatar class="user-icon" fit="contain" style="height:64px;width:64px;" src="/images/default_icon.png"></mdui-avatar>
        </div>
        <div class="text-center mt-2"><strong id="user-name">-</strong></div>
        <div class="text-center mt-2" id="user-sign">-</div>
        <mdui-list>
            <mdui-list-item icon="person">UID: <strong id="user-uid">0</strong></mdui-list-item>
            <mdui-list-item icon="mail" id="user-mail">*</mdui-list-item>
            <mdui-list-item icon="energy_savings_leaf">0</mdui-list-item>
        </mdui-list>
        <mdui-button class="mt-2 l" lang="6" onclick="toUser()" full-width>个人中心</mdui-button>
        <mdui-button class="mt-2 l" lang="206" variant="outlined" onclick="quit()" full-width>退出登录</mdui-button>
        <div class="hide">
            <mdui-text-field></mdui-text-field>
            <mdui-text-field></mdui-text-field>
        </div>
    </div>
</mdui-dialog>
`);
$("#foot").append(`
<div id="foot-offset" style="height:30px"></div>
<div class="text-center" id="foot">
    <mdui-divider class="mt-4"></mdui-divider>
    <div class="mt-2">
        <p class="l" lang="209">友情链接</p>
        <a class="ml-1 mr-1" href="https://www.minebbs.com/" target="_blank"><img src="/images/minebbs-logo.webp" style="height:20px;"><a>
        <a class="ml-1 mr-1" href="https://www.mcnav.net/" target="_blank"><img src="/images/mcnav-logo.png" style="height:20px;"><a>
        <a class="ml-1 mr-1" href="https://mcbedl.com/" target="_blank"><img src="/images/mcbedl-logo.png" style="height:20px;"><a>
    </div>
    <p>Copyright 2024-2025 AXDA & StarElement</p>
    <p class="mdui-prose"><a href="https://qm.qq.com/q/xZ0OaMhacU" target="_blank" class="l" lang="210">联系我们</a><text class="ml-2 mr-2">|</text><a href="/docs/license" class="l" lang="196">用户协议</a></p>
    <p class="mdui-prose"><text class="l" lang="207">许可证</text>: <a href="https://beian.miit.gov.cn/" target="_blank">辽ICP备20000535号-4</a></p>
</div>
`);
function getUser() {
    let user = localStorage.getItem("user");
    if (user == undefined) return undefined;
    return JSON.parse(user);
}
if (window.location.hash == "#login") login();
var loadList = [];
function updateUser(resp) {
    if (resp.uid == 0) {
        $("#login-btn").show();
        $("#user-btn").hide();
        $(".unlogin").show();
    } else {
        localStorage.setItem("user", JSON.stringify(resp.data));
        $("#user-uid").text(resp.data.uid);
        $("#user-mail").text(resp.data.mail);
        $("#user-sign").text(resp.data.sign);
        $("#user-name").text(resp.data.name);
        $("#login-btn").hide();
        $("#user-btn").show();
        $(".user-icon").attr("src", resp.data.icon);
        $(".unlogin").hide();
    }
    for (var i in loadList) {
        loadList[i]();
    }
    if (window.location.hash == "#verify") {
        mdui.alert({headline: lang[141]});
    }
}
$.ajax({
    url: axda + "api/v2/account.hsp",
    dataType: "json",
    success: function(resp) {
        updateUser(resp);
        if (resp.uid > 0) $(".plugin-menu").show();
    }
});
var lang = null;
var langCode = localStorage.getItem("language");
if (langCode == null || langCode == "") {
    setLanguage("chs");
} else {
    setLanguage(langCode);
}
function updateLanguage() {
    $(".l").each(function() {
        var code = $(this).prop("lang");
        if (code != null) {
            $(this).text(lang[code]);
        }
    });
    $(".ll").each(function() {
        var code = $(this).attr("ll");
        if (code != null) {
            $(this).prop("label", lang[code]);
        }
    });
    $(".lh").each(function() {
        var code = $(this).attr("lh");
        if (code != null) {
            $(this).prop("helper", lang[code]);
        }
    });
    $(".lt").each(function() {
            var code = $(this).attr("lt");
            if (code != null) {
                $(this).prop("headline", lang[code]);
            }
        });
}
function $$(data) {
    return document.querySelector(data);
}
function updateView() {
    var width = window.innerWidth;
    $("#filter-card").width($("#filter-btn").width());
    if (width == undefined) return;
    if (width < 700) {
        small();
        isBig = false;
        isSmall = true;
    } else {
        big();
        isSmall = false;
        isBig = true;
    }
    for (var i in viewListener) {
        viewListener[i]();
    }
    var h = $("#container").innerHeight() + 180;
    if (window.innerHeight > h) {
        $("#foot-offset").height(window.innerHeight - h);
    } else {
        $("#foot-offset").height(0);
    }
}
const observer = mdui.observeResize($("body"), mdui.throttle((entry, observer) => {
    /*if (!openNow)*/ updateView();
}),100);

function big() {
//    if (navBig.open) $('#nav-big').show();
    $('.small').hide();
    $('.big').show();
    $('.big-1').each(function () { $(this).innerWidth($(this).parent().width() * 0.125) });
    $('.big-2').each(function () { $(this).innerWidth($(this).parent().width() * 0.25) });
    $('.big-3').each(function () { $(this).innerWidth($(this).parent().width() * 0.33) });
    $('.big-4').each(function () { $(this).innerWidth($(this).parent().width() * 0.49) });
    $('.big-6').each(function () { $(this).innerWidth($(this).parent().width() * 0.75) });
    $('.big-8').each(function () { $(this).innerWidth($(this).parent().width()) });
    $('.sm-full').attr('full-width', false);
}

function small() {
//    if (navSmall.open) $('#nav-sm').show();
    $('.big').hide();
    $('.small').show();
    $('.sm-1').each(function () { $(this).innerWidth($(this).parent().width() * 0.125) });
    $('.sm-2').each(function () { $(this).innerWidth($(this).parent().width() * 0.25) });
    $('.sm-4').each(function () { $(this).innerWidth($(this).parent().width() * 0.5) });
    $('.sm-6').each(function () { $(this).innerWidth($(this).parent().width() * 0.75) });
    $('.sm-8').each(function () { $(this).innerWidth($(this).parent().width()) });
    $('.sm-full').attr('full-width', true);
}
function goto(url) {
    window.location.href = url;
}
function drawer() {
    $$('#nav').open = !$$('#nav').open;
}
var dialog = document.querySelector("#loading");
var loading = {
    open: function () {
        dialog.open = true;
    },
    close: function () {
        dialog.open = false;
    },
}
function login() {
    $$('#login-dialog').open = true;
    $$('#register-dialog').open = false;
    $$('#resetpwd-dialog').open = false;
}
function register() {
    $$('#login-dialog').open = false;
    $$('#register-dialog').open = true;
    $$('#resetpwd-dialog').open = false;
}
function resetpwd() {
    $$('#resetpwd-dialog').open = true;
    $$('#login-dialog').open = false;
    $$('#register-dialog').open = false;
}
function toUser() {
//    $$('#user-dialog').open = true;
//    $$('#login-dialog').open = false;
    goto("/user");
}
function getFilter() {
    var key = localStorage.getItem("filter");
    return key;
}
function getFilterName() {
    var key = getFilter();
    var name = filterList[key];
    if (name == null) return;
    return name;
}
function filter(type) {
    var name = filterList[type];
    if (name == null) return;
    localStorage.setItem("filter", type);
    $("#filter-btn").text(name);
    $$("#filter-drop").open = false;
    updateFilter();
    location.reload();
}
function updateFilter() {
    $("#filter-btn").text(getFilterName());
}

function api_login() {
    $$('#login-mail').setCustomValidity("");
    $$('#login-passwd').setCustomValidity("");
    var mail = $("#login-mail").val();
    var passwd = $("#login-passwd").val();
    var check = true;
    if (mail == "" || mail == null || mail == undefined) {
        $$('#login-mail').setCustomValidity("请填写完整");
        check = false;
    }
    if (passwd == "" || passwd == null || passwd == undefined) {
        $$('#login-passwd').setCustomValidity("请填写完整");
        check = false;
    }
    if (!$$('#login-mail').reportValidity()) check = false;
    if (check) {
        $(".login-input").prop("disabled", true);
        $("#login-button").prop("loading", true);
        var data = getData("login");
        data.mail = mail;
        data.pwd = SparkMD5.hash(passwd);
        $.ajax({
            url: axda + "api/v2/login.hsp",
            data: { data: encode(data) },
            dataType: "json",
            success: function(resp) {
                if (resp.data != undefined) localStorage.setItem("user", JSON.stringify(resp.data));
                $(".login-input").prop("disabled", false);
                $("#login-button").prop("loading", false);
                if (checkCode(resp)) {
                    $$("#login-dialog").open = false;
                    updateUser(resp);
                } else {
                    $$("#login-mail").setCustomValidity(lang[resp.msg]);
                }
            },
            error: function(e) {
                console.log(e)
            }
        });
    }
}
function api_register() {
    $$('#reg-mail').setCustomValidity("");
    $$('#reg-pwd0').setCustomValidity("");
    $$('#reg-pwd1').setCustomValidity("");
    var mail = $("#reg-mail").val();
    var pwd0 = $("#reg-pwd0").val();
    var pwd1 = $("#reg-pwd1").val();
    var check = true;
    if (mail == "" || mail == null || mail == undefined) {
        $$("#reg-mail").setCustomValidity("请填写完整");
        check = false;
    }
    if (!$$('#reg-mail').reportValidity()) check = false;
    if (pwd0.length < 8) {
        $$("#reg-pwd0").setCustomValidity("密码不得低于8位");
        check = false;
    }
    if (pwd0 != pwd1) {
        $$("#reg-pwd1").setCustomValidity("两次输入的密码不一致");
        check = false
    }
    if (check) {
        $("#reg-btn").prop("loading", true);
        $(".reg-input").prop("disabled", true);
        var data = getData("register");
        data.mail = mail;
        data.pwd = SparkMD5.hash(pwd0);
        $.ajax({
            url: axda + 'api/v2/register.hsp',
            data: {
                'data': encode(data)
            },
            dataType: 'json',
            success: function (resp) {
                if (checkCode(resp)) {
                    $$("#register-dialog").open = false;
                } else {
                    if (resp.msg != null || resp.msg != null) $$("#reg-mail").setCustomValidity(lang[resp.msg]);
                    $("#reg-btn").prop("loading", false);
                    $(".reg-input").prop("disabled", false);
                }
            },
            error: function (data) {
                console.log(data)
            }
        });
    }
}

function api_resetPwd() {
    $$('#reset-pwd-input').setCustomValidity("");
    var mail = $("#reset-pwd-input").val();
    if (mail == "" || mail == null || mail == undefined) {
        $$("#reset-pwd-input").setCustomValidity("请填写完整");
        check = false;
    }
    if ($$("#reset-pwd-input").reportValidity()) {
        $("#reset-pwd-btn").prop("loading", true);
    }
    $.ajax({
        url: axda + "api/v2/reset_password.hsp",
        data: {data: encode({mail: mail, type: 'send'})},
        dataType: "json",
        success: function(resp) {
            if (checkCode(resp)) {
            }
            $("#reset-pwd-btn").prop("loading", false);
            $$('#resetpwd-dialog').open = false;
            mdui.alert({headline:lang[resp.msg]});
        },
    });
}
function setLanguage(lang) {
    $(".lang-btn").prop("icon", null);
    $("#lang-" + lang).prop("icon", "check");
    localStorage.setItem("language", lang);
    $.ajax({
        method: "GET",
        url: "/js/lang-" + lang + ".json",
        success: function (data) {
            window.lang = JSON.parse(data);
            updateLanguage();
        },
        error: function (data) {
        }
    });
}
function isSmall() {
    return $("body").width() < 992;
}
function checkCode(data) {console.log(data);
    if (data.uid != null && data.uid > 0) $(".plugin-menu").show();
    if (data.code == 2000) return true;
    if (data.code == 3001) { window.location = data.data.url; return false; }
    if (data.code == 3002) { location.reload(); }
    if (data.code == 4003) { window.location = "/#login"; return false; }
    return false;
}
function quit() {
    $.ajax({
        url: axda + "api/v2/quit.hsp",
        dataType: "json",
        success: function(resp) {
            checkCode(resp);
            localStorage.removeItem("user");
        }
    });
}
function verified() {
    $.ajax({
        url: axda + "api/v2/verified_send.hsp",
        dataType: "json",
        success: function(resp) {
            if (checkCode(resp)) {
                mdui.alert({description:lang[120]});
            } else if (resp.code == 4303) {
                mdui.alert({headline:lang[resp.msg]});
            }
        }
    });
}
function formatDate(date) {
    const now = new Date().getTime();
    const t = now - date;

    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;
    const month = day * 30;
    const year = month * 12;

    const seconds = Math.floor(t / second);
    const minutes = Math.floor(t / minute);
    const hours = Math.floor(t / hour);
    const days = Math.floor(t / day);
    const months = Math.floor(t / month);
    const years = Math.floor(t / year);
    const remainingMonths = months % 12;
    if (years > 0) {
        return years + lang[211] + remainingMonths + lang[157] + lang[162];
    } else if (months > 0) {
        return months + lang[157] + (days % 30) + lang[158] + lang[162];
    } else if (days > 0) {
        return days + lang[158] + lang[162];
    } else if (hours > 0) {
        return hours + lang[159] + lang[162];
    } else if (minutes > 0) {
        return minutes + lang[160] + lang[162];
    } else {
        return seconds + lang[161] + lang[162];
    }
}
function pubilsh() {
    $.ajax({
        url: axda + "api/v2/account.hsp",
        data: {data:encode({update:true})},
        dataType: "json",
        success: (resp) => {
            if (checkCode(resp)) {
                updateUser(resp);
                if (getUser() == undefined || getUser().verified == 0) {
                    mdui.alert({headline:lang[141]});
                } else {
                    goto("/edit_plugin/@create");
                }
            }
        }
    });
}
function minebbs_oauth() {
    goto('https://www.minebbs.com/oauth2/authorize?response_type=code&client_id=9822632883787571&redirect_uri='+axda+'api/v2/minebbs/callback.hsp&scope=user:read&state=axda:main')
}
function formatSize(bytes, decimalPoint) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimalPoint || 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
function markdown(md, element, p) {
    if (md == undefined || md == "") return;

    if (!md.startsWith("<!--mb-->")) {
        var user = p == undefined ? '' : p.user;
        var project = p == undefined ? '' : p.project;;
        var converter = new showdown.Converter({ tables: true });
        var html = converter.makeHtml(md);
        element.css("height", "auto");
        element.html(html);
        element.find("a").each(function() {
            var href = $(this).attr("href");
            var link = href;
            if (link == undefined) return;
            if (!href.startsWith("https://") && !href.startsWith("http://")) {
                var url = href;
                if (href.startsWith("/")) {
                    url = href.replace("/", "");
                }
                link = `https://github.com/${user}/${project}/blob/master/` + url;
            }
            $(this).replaceWith(`<text class="mdui-prose"><a href="${link}" target="_blank">${$(this).html()}</a></text>`);
        });
        element.find("code").each(function() {
            $(this).addClass("hljs");
        });
        element.find("li").each(function() {
            $(this).addClass("m-1");
        });
        element.find("img").each(function() {
            $(this).addClass("md-img");
            let src = $(this).attr("src");
            if (user != '') {
                if (!src.startsWith("https://") || !src.startsWith("http://")) {
                    $(this).attr("src", "https://github.com/" + user + "/" + project + "/raw/master/" + src);
                }
            }
        });
        element.find("table").each(function() {
            $(this).addClass("mdui-prose");
        });
    } else {
        element.html(md);
        element.css("height", "auto");
        element.find("img").each(function() {
            $(this).addClass("md-img");
        });
    }
    $(".md-img").on("load", function() {
        if ($(this).width() > $("#readme").width()) {
            $(this).innerWidth($("#readme").width());
        }
    });
}
function gitUrl(url) {
    if (url == null) return;
    if (url.startsWith("https://github.com/")) {
        var s = url.split("/");
        return {
            user: s[3],
            project: s[4]
        };
    }
    return null;
}
function getTheme() {
    let theme = localStorage.getItem("theme");
    if (theme == undefined) {
        localStorage.setItem("theme", "auto");
        theme = "auto";
    }
    $("#theme-" + theme).attr("icon", "check");
    mdui.setTheme(theme);
    return theme;
}
function setTheme(value) {
    if (value != "auto" && value != "light" && value != "dark") value = "auto";
    mdui.setTheme(value);
    localStorage.setItem("theme", value);
    $(".theme-btn").attr("icon", null);
    $("#theme-" + value).attr("icon", "check");
}
function getRandomString(length) {
  let result = '';
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
getTheme();
updateFilter();
$('#nav').on('open', () => openNow = true);
$('#nav').on('opened', () => {openNow = false; updateView();});
$('#nav').on('close', () => openNow = true);
$('#nav').on('closed', () => openNow = false);