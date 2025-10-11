var count = 0;
var appid = 0;
var index = '';
var git;
var remote_git;
$("#github").on({
    "input": function (e) {
        git = $(this).val();
    }
});
function removeLink(id) {
    $("#link-" + id).remove();
}
function addLink(key = '', value = '') {
    $("#custom-link").append(`
        <div class="mt-4 flex ver-center" id="link-${count}">
            <mdui-text-field value="${key}" class="big-2 sm-2 mr-1 axda-link input" variant="outlined" label="名称" i="${count}" id="link-name-${count}" onclick="$('#link-${count}-name').attr('readonly', false);" ></mdui-text-field>
            <mdui-text-field value="${value}" class="big-6 sm-6 mr-2 input" variant="outlined" label="值" i="-${count}" id="link-url-${count}" onclick="$('#link-${count}-url').attr('readonly', false);" ></mdui-text-field>
            <mdui-button-icon icon="close" variant="tonal" onclick="removeLink(${count})"></mdui-button-icon>
        </div>
    `);
    count++;
}
var getTarget = function() {
    if (getUser() == undefined) {
        goto("/#login");
        return;
    } else if (getUser().verified == 0) {
        goto("/manage/#verify");
        return;
    }
    var array = window.location.pathname.split("/");
    if (array[2] == "@create") {
        $("#create-title").show();
        $("#title").hide();
        $("#create-tips").show();
        $("#tips").hide();
        appid = 0;
        $(".main").show();
        $(".load").hide();
        $("#foot").show();
        updateView();

        var html = $("#base").html();
        $("#base").html("");
        $("#create-base").html(html);
    } else {
        appid = -1;
        $(".tab").show();
        $.ajax({
            url: axda + "api/v2/plugin.hsp",
            data: {data:encode({index:array[2]})},
            dataType: "json",
            success: function(resp) {
                if (checkCode(resp)) {
                    appid = resp.data.appid;
                    index = resp.data.index;
                    $("#title").text(resp.data.title);
                    $(".main").show();
                    $(".load").hide();
                    $("#foot").show();
                    $(".final").attr("disabled", true);
                    $("#p-title").val(resp.data.title);
                    $("#p-desc").val(resp.data.description);
                    $("#minebbs").val(resp.data.minebbs);
                    $("#github").val(resp.data.git);
                    $("#p-index").val(resp.data.index);
                    $("#p-name").val(resp.data.name);
                    $("#p-lib").attr("checked", resp.data.lib == 1);
                    if (resp.data.readme != undefined || resp.data.readme != "") {
                        try {
                            var p = gitUrl(resp.data.git);
                            markdown(resp.data.readme, $("#readme"), p);
                            hljs.highlightAll();
                        } catch(e) {}
                    }
                    for (var i in resp.data.link) {
                        addLink(i, resp.data.link[i]);
                    }
                    $("#btn-remove").show();

                    //添加资源团队UI
                    if (getUser().uid == resp.data.author) {
                        $(".team-tab").show();
                        try {
                            var team = JSON.parse(resp.data.team);
                            for (var i in team) {
                                addMemberCard(team[i]);
                            }
                        } catch (e) {}
                    }


                    updateView();
                } else {
                    goto("/manage");
                }
            },
        });
    }
}
getTarget();
function submit() {
    $(".input").each(function() {
        $$("#" + $(this).attr("id")).setCustomValidity("");
    });
    if ($("#p-title").val().trim() == "") { $$("#p-title").setCustomValidity(lang[61]); return; }
    if ($("#p-desc").val().trim() == "") { $$("#p-desc").setCustomValidity(lang[61]); return; }
    if (appid == 0) {
        if ($("#p-index").val().trim() == "") { $$("#p-index").setCustomValidity(lang[61]); return; }
        if ($("#p-name").val().trim() == "") { $$("#p-name").setCustomValidity(lang[61]); return; }
    }
    if ($("#minebbs").val().trim() != "" && !$("#minebbs").val().trim().includes("://www.minebbs.com/resources/")) {$$("#minebbs").setCustomValidity(lang[127]); return;}
    if ($("#github").val().trim() != "" && !$("#github").val().trim().includes("://github.com/")) {$$("#github").setCustomValidity(lang[128]); return;}

    var data = {};
    data.title = $("#p-title").val().trim();
    data.description = $("#p-desc").val().trim();
    data.link = {};
    data.minebbs = $("#minebbs").val().trim();
    data.github = $("#github").val().trim();
    var lb = true;
    $(".axda-link").each(function(){
        console.log(this)
        if ($(this).val().trim() == "") {
            $$("#" + $(this).attr("id")).setCustomValidity(lang[61]);
            lb = false;
        }
        var url = $("#link-url-" + $(this).attr("i"));
        if (url.val().trim() == "") {
            $$("#" + url.attr("id")).setCustomValidity(lang[61]);
            lb = false;
        }
        data.link[$(this).val().trim()] = url.val().trim();
    });
    if (!lb) return;
    if (appid == 0) {
        data.index = $("#p-index").val().trim();
        data.name = $("#p-name").val().trim();
        data.is_lib = $("#p-lib").attr("checked") == "";
    }
    console.log(data);
    loading.open();
    if (appid == 0) {
        $.ajax({
            url: axda + "api/v2/create_plugin.hsp",
            data: {data: encode(data)},
            dataType: "json",
            success: function(resp) {
                loading.close();
                if (checkCode(resp)) {
                    goto("/manage");
                } else {
                    if (resp.code == 4501) {
                        $$("#p-" + resp.item).setCustomValidity(lang[resp.msg]);
                    } else {
                        if (resp.msg == undefined) {
                            mdui.alert({headline:lang[105]});
                        } else {
                            mdui.alert({headline:lang[resp.msg]});
                        }
                    }
                }
            },
            error: function(e) {
                loading.close();
                mdui.alert({headline:lang[105]});
            }
        });
    } else if (appid < 0) {
        goto("/");
    } else {
        data.index = index;
        $.ajax({
            url: axda + "api/v2/edit_plugin.hsp",
            data: {data:encode(data)},
            dataType: "json",
            success: function(resp) {
                loading.close();
                if (checkCode(resp)) {
                    goto("/app/" + resp.to);
                } else if (resp.code == 4605) {
                    $$("#p-" + resp.item).setCustomValidity(lang[132]);
                } else if (resp.data == 4050) {
                    mdui.alert({headline:lang[resp.msg]});
                } else {
                    mdui.alert({headline:lang[105]});
                }
            },
            error: function(e) {
                mdui.alert({headline:lang[105]});
            }
        });
    }
}

function remove() {
    if (appid == 0) return;
    mdui.confirm({
        headline: lang[137],
        description: lang[138],
        confirmText: "<div class='red'>" + lang[139] + "</div>",
        cancelText: lang[140],
        onConfirm: () => {
            $.ajax({
                url: axda + "api/v2/remove_plugin.hsp",
                data: {data: encode({index: index})},
                dataType: "json",
                success: function(resp) {
                    if (checkCode(resp)) {
                        goto("/manage");
                    } else {
                        mdui.alert({headline:lang[105]});
                    }
                }
            });
        }
    });
}

function getReadme(site) {
    if (site == "github") {
        $$("#readme-dialog").open = true;
    } else if (site == "minebbs") {
        $.ajax({
            url: axda + "api/v2/readme/minebbs_readme.hsp",
            data: {data:encode({index:index})},
            dataType: "json",
            success: (resp => {
                if (checkCode(resp)) {
                    $("#readme").html(resp.text);
                } else {
                    mdui.alert({headline: lang[resp.msg]});
                }
            }),
        });
    }
}

function saveReadmeG(path) {
    $$("#readme-dialog").open = false;
    $.ajax({
        url: axda + "api/v2/readme/github_readme.hsp",
        data: {data:encode({path:path, index:index})},
        dataType: "json",
        success: (resp => {
            if (checkCode(resp)) {
                var p = gitUrl(resp.git);
                markdown(resp.text, $("#readme"), p.user, p.project);
            } else {
                mdui.alert({headline: lang[resp.msg]});
            }
        }),
    });
}

function searchUser() {
    var uid = $("#team-uid").val();
    $$("#team-uid").setCustomValidity('');
    $(".user-search").hide();
    $("#user-icon-m").attr("src", "/images/default_icon.png");
    if (uid == "" || uid == undefined) {
        $$("#team-uid").setCustomValidity(" ");
        return;
    }
    $.ajax({
        url: axda + "api/v2/user.hsp",
        data: {data:encode({uid:uid})},
        dataType: "json",
        success: (resp) => {
            if (resp.code == 2000 || resp.code == 2001) {
                $(".user-search").show();
                $("#user-uid-m").text(resp.data.uid);
                $("#user-name-m").text(resp.data.name);
                $("#user-sign-m").text(resp.data.sign);
                $("#user-icon-m").attr("src", resp.data.icon);
            } else {
                $$("#team-uid").setCustomValidity(lang[117]);
            }
        }
    });
}

function addTeam() {
    var uid = $("#user-uid-m").text();
    $.ajax({
        url: axda + "api/v2/team/addMember.hsp",
        data: {data:encode({index:index, uid:uid})},
        dataType: "json",
        success: (resp) => {
            if (checkCode(resp)) {
                if (resp.code == 2000) {
                    $$("#team-dialog").open = false;
                    mdui.alert({headline: lang[252]});
                    addMemberCard(uid);
                }
            } else {
                mdui.alert({headline: lang[resp.msg]});
            }
        }
    });
}

function addMemberCard(uid) {
    $.ajax({
        url: axda + "api/v2/user.hsp",
        data: {data:encode({uid:uid})},
        dataType: "json",
        success: (resp) => {
            if (resp.code != 2001) return;
            var card = `<mdui-card class="mt-2 p-2 ver-center full-w member-id-${resp.data.uid}">
                            <mdui-avatar class="ml-4" fit="contain" style="height:40px;width:40px;" src="${resp.data.icon ? resp.data.icon : '/images/default_icon.png'}"></mdui-avatar>
                            <div class="title ml-4">${resp.data.name}</div>
                            <mdui-button-icon class="mr-4 row-right" variant="tonal" icon="delete" onclick="removeMember(${resp.data.uid})"></mdui-button-icon>
                        </mdui-card>`;
            $(".team-list").append(card);
        }
    });
}


function removeMember(uid) {
    $.ajax({
        url: axda + "api/v2/team/removeMember.hsp",
        data: {data:encode({index:index, uid:uid})},
        dataType: "json",
        success: (resp) => {
            if (checkCode(resp)) {
                if (resp.code == 2000) {
                    mdui.alert({headline: lang[253]});
                    $(".member-id-" + uid).remove();
                }
            } else {
                mdui.alert({headline: lang[105]});
            }
        }
    });
}