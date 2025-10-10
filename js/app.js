$("#get-sm").append($("#get-big").html());
var is_watch = false;
var versionLoad = 0;
var versionTotal = 0;
var updateLinkList = function () {
    $(".v-card").width($("#v-table").width() * 0.92);
    if (window.isSmall) {
        $("#link-list").width($("body").width() * 0.99);
        $("#tab").width($("body").width());
    } else {
        $("#link-list").prop("style", null);
        $("#tab").prop("style", null);
    }
}
viewListener.push(updateLinkList);
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
function update(data) {
    if (data["latest_" + getFilter()] == null) {
        data["latest_" + getFilter()] = "-";
        $(".incompatible-card").show();
        $(".incompatible-text").text(lang[219].replace(/%%/g, filterList[getFilter()]));
        $(".down-btn").attr("disabled", true);
    }
    $("#page").show();
    $(".pl-vt").text(data.versions);
    $(".pl-name").text(data.name);
    $(".pl-desc").text(data.description);
    $(".pl-watch").text(data.watch);
    $(".pl-down").text(data.down_cmd + data.down_web);
    $(".pl-update").text(formatDate(data.update));
    $(".pl-version").text(data["latest_" + getFilter()]);
    $(".pl-author").text(data.author_name);
    $(".pl-author").prop("href", "/user/" + data.author);
    $(".pl-cmd").val("axda install " + data.index);
    $(".pl-look").text(data.look + 1);
    if (data.platform.mot != undefined) $(".pl-kernel").append("<div class='mr-2 nowrap'>Nukkit-MOT</div>");
    if (data.platform.nkx != undefined) $(".pl-kernel").append("<div class='mr-2 nowrap'>CloudBurst Nukkit</div>");
    if (data.platform.pnx != undefined) $(".pl-kernel").append("<div class='mr-2 nowrap'>PowerNukkitX 1.0</div>");
    if (data.git != "" && data.git != undefined) {
        $(".pl-git-url").text(data.git);
        $(".pl-git-url").prop("href", data.git);
        $(".pl-git").show();
    }
    if (data.minebbs != "" && data.minebbs != undefined) {
        $(".pl-mb-url").text(data.minebbs);
        $(".pl-mb-url").prop("href", data.minebbs);
        $(".pl-mb").show();
    }
    width = $(".pl-table").width();
    for (var i in data.link) {
        var value = `<div class="nowrap">${data.link[i]}</div>`;
        if (data.link[i].startsWith("http://") || data.link[i].startsWith("https://")) {
            value = `<a href="${data.link[i]}" target="_blank" class="nowrap">${data.link[i]}</a>`;
        }
        var l = `
            <table><tobdy><tr>
                <th>
                    <div class="ver-center">
                        <mdui-icon class="mr-4 ml-2" style="font-size:32px;" name="link"></mdui-icon>
                        <strong style="width:100px;">${i}</strong>
                        ${value}
                    </div>
                </th>
            </tr></tbody></table>
        `;
        $(".pl-link").append(l);
    }
    if (data.is_watch != "offline") {
        $("#pl-watch").show();
        updateWatch(data.is_watch);
    }
    if (data.readme != undefined) {
        $("#tab").val("tab-readme");
        $(".pl-readme").show();
        var p = gitUrl(data.git);
        markdown(data.readme, $("#readme"), p);
        hljs.highlightAll();
    }
    if (data.depend != undefined) {
        $(".line-depend").show();
        for (var i in data.depend) {
            if (i > 0) $(".pl-depend").append(",");
            $(".pl-depend").append(data.depend[i]);
        }
    }
    let user = getUser();
    if (user != undefined && user.uid == data.author) {
        $(".edit").show();
    }
}
function updateWatch(status, edit = false) {
    is_watch = status;
    $("#pl-watch").attr("selected", status);
    $("#pl-watch").attr("variant", status?"filled":"tonal");
    $("#pl-watch").attr("loading", false);
    if (edit) {
        var w = Number.parseInt($(".pl-watch").text());
        $(".pl-watch").text(status? w + 1: w - 1);
    }
}
function versions(data) {
    for (var i in data) {
        var list = `<tr>
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
                                    <div>${data[i].description == "" ? lang[174] : data[i].description.replaceAll("\n", "<br>")}</div>
                                    <mdui-button class="ml-2 mt-1 l" lang="16" onclick="goto('/app/${index}/version/${data[i].version}')" variant="text">详细信息</mdui-button>
                                    <mdui-divider class="mt-2 mb-4"></mdui-divider>
                                    <div class="flex ver-center mt-4">
                                        <mdui-text-field class="pr-2" variant="filled" label="${lang[102]}" value="axda install ${index} ${data[i].version}" readonly>
                                            <mdui-button-icon class="mr-1" slot="end-icon" icon="content_copy" onclick="copyToClipboard('${index} ${data[i].version}')"></mdui-button-icon>
                                        </mdui-text-field>
                                        <mdui-button class="ml-3" style="width:120px;" onclick="downloadFile('${data[i].version}')">${lang[7]}</mdui-button>
                                    </div>
                                </div>
                        </mdui-collapse-item>
                    </mdui-collapse>
                </tr>`;
        $("#pl-versions").append(list);
    }
}
var index = window.location.pathname.split("/")[2];
if (index == "kernel") {
    goto("/app/kernel/");
}
var width;
var page = 0;
$.ajax({
    url: axda + "api/v2/plugin.hsp",
    data: {data: encode({index:index, look:true, filter: getFilter()})},
    dataType: "json",
    success: function(resp) {
        $(".loading").hide();
        if (checkCode(resp)) {
            versionTotal = resp.data.versions;
            update(resp.data);
            getVersionList();
        } else {
            $("#err-msg").text(lang[resp.msg]);
            $(".error").show();
        }
        $("#foot").show();
    },
    error: (resp) => {
        $(".loading").hide();
        $("#err-msg").text(lang[105]);
        $(".error").show();
    }
});


function getVersionList(page = 0) {
    $("#version-more").prop("loading", true);
    $.ajax({
        url: axda + "api/v2/plugin_version.hsp",
        data: {data: encode({index:index, page:page, filter:getFilter()})},
        dataType: "json",
        success: function(resp) {
            if (checkCode(resp)) {
                window.page = resp.page;
                if (window.page == undefined) window.page = 0;
                versions(resp.data);
            } else {
                $("#version-more").hide();
                $("#version-end").show();
            }
            $("#version-more").prop("loading", false);
            versionLoad += resp.data.length;
            if (versionLoad >= versionTotal) {
                $("#version-more").hide();
                $("#version-end").show();
            }
        },
        error: (resp) => {
            $(".loading").hide();
            $("#container").hide();
            $("#err-msg").text(lang[105]);
            $(".error").show();
            $("#version-more").prop("loading", false);
        }
    });
}

function calculateValue(inputString) {
    let totalValue = 0;
    for (let i = 0; i < inputString.length; i++) {
        const char = inputString[i];
        if (/[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(char)) {
            totalValue += 9;
        }
        else if (/[\u4e00-\u9fa5]/.test(char)) {
            totalValue += 16;
        }
    }
    return totalValue;
}

function copyToClipboard(text = index) {
    navigator.clipboard.writeText("axda install " + text);
    mdui.snackbar({
        message: lang[175],
        action: lang[27],
        placement: "top",
        onActionClick: () => {}
    });
}

function watch() {
    $("#pl-watch").attr("loading", true);
    $.ajax({
        url: axda + "api/v2/watch.hsp",
        data: {data: encode({index: index, target: !is_watch})},
        dataType: "json",
        success: (resp) => {
            if (checkCode(resp)) {
                updateWatch(resp.data.status, true);
            } else {
                mdui.alert({headline: lang[msg]});
            }
        },
        error: (resp) => {
            $("#pl-watch").attr("loading", false);
            mdui.alert({headline: lang[105]});
        }
    });
}

function downloadFile(version) {
    loading.open();

    if (version == undefined) version = "latest";
    $.ajax({
        url: axda + "api/v2/get_app_url.hsp",
        data: {data: encode({index: index, version: version, filter: getFilter()})},
        dataType: "json",
        success: (resp) => {
            loading.close();
            if (checkCode(resp)) {
                if (resp.data.url != undefined) {
                    window.location.href = resp.data.url;
                } else {
                    mdui.alert({headline: lang[180]});
                } 
            } else {
                mdui.alert({headline: lang[resp.msg]});
            }
        },
        error: (resp) => {
            loading.close();
            mdui.alert({headline: lang[105]});
        }
    });
}