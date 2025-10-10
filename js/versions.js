const index = window.location.pathname.split("/")[3];
var page = 0;
var versionLoad = 0;
var versionTotal = 0;
getVersionList();
function getVersionList(page = 0) {
    $.ajax({
        url: axda + "api/v2/plugin_version.hsp",
        data: {data: encode({index:index, page:page, type: "manage"})},
        dataType: "json",
        success: (resp) => {
            window.page = resp.page;
            if (resp.total != undefined) {
                versionTotal = resp.total;
                $("#total").text(resp.total);
            }
            $(".load").hide();
            if (checkCode(resp)) {
                if (getUser().uid == resp.author) {
                versions(resp.data);
                $(".pl-title").text(resp.name);
                }
            } else {
                $("#version-more").hide();
                $("#version-end").show();
            }
            versionLoad += resp.data.length;
            if (versionLoad >= versionTotal) {
                $("#version-more").hide();
                $("#version-end").show();
            }
        },
        error: (resp) => {
            $(".load").hide();
        }
    });
}

function versions(data) {
    for (var i in data) {
        var list = `<mdui-card class="full">
                        <mdui-collapse>
                            <mdui-collapse-item>
                                <mdui-list-item class="version-tab" slot="header" icon="device_hub" end-icon="arrow_right" id="v-${data[i].uuid}" onclick="openVersion('${data[i].uuid}')">
                                    <div class="flex ml-4">
                                        <strong class="ml-4" style="width:120px;">${data[i].version}</strong>
                                        <text class="big">${formatSize(data[i].size)}</text>
                                        <code class="mr-2 row-right">${formatDate(data[i].update)}${lang[173]}</code>
                                    </div>
                                </mdui-list-item>
                                <div class="p-3 v-card">
                                    <div class="mb-2">uuid:<text class="ml-2">${data[i].uuid}</text></div>
                                    <div class="mb-4">${lang[215]}:<text class="ml-2 theme">${data[i].filter}</text></div>
                                    <mdui-text-field class="pr-2" variant="outlined" label="${lang[163]}" value="${data[i].description}" rows="4" id="desc-${data[i].uuid}">
                                    </mdui-text-field>
                                    <div class="row">
                                    <div class="row-right flex ver-center mt-4">
                                        <mdui-button class="mr-3" style="width:120px;" id="btn-${data[i].uuid}" onclick="save('${data[i].uuid}');">${lang[60]}</mdui-button>
                                        <mdui-button class="mr-3 red" style="width:120px;" id="rm-${data[i].uuid}" variant="outlined" onclick="remove('${data[i].uuid}')">${lang[188]}</mdui-button>
                                    </div>
                                    </div>
                                </div>
                        </mdui-collapse-item>
                    </mdui-collapse>
                </mdui-card>`;
        $("#versions").append(list);
    }
}
var i = {
    "1": false,
};
function openVersion(id) {
    if (!i[id]) {
        $("#v-" + id).attr("active", true);
        $("#v-" + id).attr("end-icon", "arrow_drop_down");
        i[id] = true;
    } else {
        $("#v-" + id).attr("active", false);
        $("#v-" + id).attr("end-icon", "arrow_right");
        i[id] = false;
    }
}

function save(uuid) {
    $("#btn-" + uuid).attr("loading", true);
    $.ajax({
        url: axda + "api/v2/edit_version.hsp",
        data: {data:encode({index: index, uuid: uuid, description: $("#desc-" + uuid).val()})},
        dataType: "json",
        success: (resp) => {
            if (checkCode(resp)) {
                $("#btn-" + uuid).attr("loading", false);
                mdui.snackbar({
                    message: lang[189],
                    action: lang[27],
                    placement: "top",
                    onActionClick: () => {}
                });
            }
        },
        error: (resp) => {
            $("#btn-" + uuid).attr("loading", false);
            mdui.alert({headline: lang[105]});
        }
    });
}

function remove(uuid) {
    mdui.confirm({
        headline: lang[190],
        description: lang[138],
        confirmText: "<div class='red'>" + lang[139] + "</div>",
        cancelText: lang[140],
        onConfirm: () => {
            $("#rm-" + uuid).attr("loading", true);
            $.ajax({
                url: axda + "api/v2/remove_version.hsp",
                data: {data:encode({index: index, uuid: uuid})},
                dataType: "json",
                success: (resp) => {
                    if (checkCode(resp)) {
                        window.location.reload();
                    }
                },
                error: (resp) => {
                    $("#rm-" + uuid).attr("loading", false);
                    mdui.alert({headline: lang[105]});
                }
            });
        }
    });
}