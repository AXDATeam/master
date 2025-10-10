$(".load").show();
var init = function() {
    if (getUser().uid == 0) {
        goto("/#login");
        return;
    }
    $.ajax({
        url: axda + "api/v2/plugin_list.hsp",
        dataType: "json",
        success: function(resp) {
            $(".load").hide();
            if (checkCode(resp)) {
                if (resp.data.length > 0) {
                    for (var i in resp.data) {
                        add(resp.data[i]);
                    }
                } else {
                    $("#nothing").show();
                }
            }
            $(".main").show();
        },
        error: function(e) {
            mdui.alert({headline:lang[133]});
            $(".main").show();
        }
    });
}
init();

function info(index) {
    $(".dialog-loading").show();
    $(".dialog-main").hide();
    $("#tips").text("");
    $$("#info-dialog").open = true;
    try {
        $.ajax({
            url: axda + "api/v2/plugin.hsp",
            data: {data:encode({index:index, look:false})},
            dataType: "json",
            success: function(resp) {
                if (checkCode(resp)) {
                    $("#d-title").text(resp.data.title);
                    $("#d-index").text(resp.data.index);
                    $(".watch").text(resp.data.watch);
                    $(".look").text(resp.data.look);
                    $(".down-web").text(resp.data.down_web);
                    $(".down-cmd").text(resp.data.down_cmd);
                    $("#btn-main").attr("href", `/app/${resp.data.index}`);
                    $("#btn-edit").attr("href", `/edit_plugin/${resp.data.index}`);
                    $("#btn-upload").attr("href", `/upload/${resp.data.index}`);
                    $("#btn-cd").attr("href", `/auto_cd/${resp.data.index}`);
                    $("#btn-version").attr("href", "/manage/version/" + resp.data.index);
                    $(".dialog-loading").hide();
                    $(".dialog-main").show();
                    if (resp.data.latest_nkx == undefined &&
                        resp.data.latest_mot == undefined &&
                        resp.data.latest_pnx == undefined
                    ) {
                        $("#tips").text(lang[135]);
                    }
                }
            },
            error: function(e) {
                $$("#info-dialog").open = false;
                mdui.alert({headline:lang[133]})
            }
        });
    } catch(e) {
        $$("#info-dialog").open = false;
        mdui.alert({headline:lang[133]})
    }
}

function add(data) {
    var card = `<mdui-card class="big-8 sm-8 mdui-prose row ver-center p-2 mb-2" variant="filled" onclick="info('${data.index}')" clickable>
                    <strong class="ml-2 mr-2" style="font-size:24px;">${data.title}</strong>
                    <mdui-card variant="filled" class="pl-1 pr-1 mr-2">${data.index}</mdui-card>
                    <div class="flex row-right ver-center ml-4 mr-4">
                        <mdui-icon name="update"></mdui-icon>
                        <div class="ml-1 mr-3">${data.update == undefined?lang[134]:formatDate(data.update)}                                                   </div>
                        <mdui-icon name="download"></mdui-icon>
                        <div class="ml-1 mr-3">${data.down_web + data.down_cmd}</div>
                        <mdui-icon name="favorite"></mdui-icon>
                        <div class="ml-1">${data.following}</div>
                    </div>
                </mdui-card>`;
    $(".main").append(card);
}

viewListener.push(() => {
    if (isSmall) {
        $(".dialog-main").innerWidth($(window).width() - 100);
    } else {
        $(".dialog-main").innerWidth($(window).width() * 0.25);
    }
});