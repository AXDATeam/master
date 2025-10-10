function uploadFile() {
    const fileInput = document.getElementById('fileInput');
    const progressBar = document.getElementById('progressBar');
    const file = fileInput.files[0];
    if (!file) {
        mdui.alert({headline: lang[144]});
        return;
    }
    if (!file.name.endsWith(".jar")) {
        mdui.alert({headline: lang[143]});
        return;
    }
    $("#up-btn").prop("loading", true);
    $("#up-btn").text(lang[147]);
 
    const formData = new FormData();
    formData.append('file', file);
 
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/v2/upload_plugin.hsp', true); // 替换为你的文件上传URL
 
    // 更新进度条
    xhr.upload.onprogress = function (event) {
        if (event.lengthComputable) {
            const percentComplete = (event.loaded / event.total);
            console.log(percentComplete);
            $("#load").show();
            $("#input").hide();
            $("#load").val(percentComplete);
        }
    };
 
    xhr.onload = function () {
        if (xhr.status === 200) {
            goto(window.location.href);
        } else {
            mdui.alert({headline: lang[145]});
        }
    };
 
    xhr.onerror = function () {
        mdui.alert({headline: lang[145]});
    };
 
    xhr.send(formData);
    console.log(xhr);
}

$$("#fileInput").addEventListener('change', function(event) {
    var files = event.target.files;
    if (files.length > 0) {
        var file = files[0];
        $("#fileName").text(file.name);
    } else {
        $("#fileName").text(lang[142]);
    }
});

var index = window.location.pathname.split("/")[2];

if (index == null || index == undefined || index == "") {
    goto("/manage");
}
$.ajax({
    url: axda + "api/v2/set_upload.hsp",
    data: {data:encode({index:index})},
    dataType: "json",
    success: function(resp) {
        if (!checkCode(resp)) {
            goto("/manage");
        } else {
            $(".name").text(resp.data.name);
            if (resp.data.status == 0) {
                $(".up").show();
            } else if (resp.data.status == -1) {
                $(".check").show();
            } else if (resp.data.status == -2) {
                $(".push").show();
                $(".del").show();
                $("#name").text(resp.data.name);
                $("#version").text(resp.data.version);
                $("#size").text(formatSize(resp.data.size));
                if (resp.data.depend != undefined) {
                    $(".card-depend").show();
                    $("#depend").text("");
                    let b = true;
                    for (var i in resp.data.depend) {
                        if (i > 0) $("#depend").append(",")
                        $("#depend").append(resp.data.depend[i]);
                    }
                }
            } else {
                $(".err").show();
                $(".del").show();
                $("#err-msg").text(lang[resp.data.status]);
            }
        }
    }
});
getRelease();

function del() {
    $.ajax({
        url: axda + "api/v2/remove_upload.hsp",
        data: {data:encode({index:index})},
        dataType: "json",
        success: function(resp) {
            if (checkCode(resp)) {
                location.reload();
            }
        }
    });
}

function push() {
    var filter = [];
    if ($(".filter#nkx").prop("checked")) filter.push("nkx");
    if ($(".filter#mot").prop("checked")) filter.push("mot");
    if ($(".filter#pnx").prop("checked")) filter.push("pnx");
    if (filter.length == 0) {
        mdui.alert({headline: lang[129]});
        return;
    }
    $.ajax({
        url: axda + "api/v2/push_plugin.hsp",
        data: {data:encode({index:index, description:$("#description").val(), filter:filter})},
        dataType: "json",
        success: function(resp) {
            if (checkCode(resp)) {
                goto("/manage")
            } else {
                mdui.alert({headline: lang[resp.msg]});
            }
        },
        error: function(resp) {
            mdui.alert({headline:lang[105]});
        }
    });
}

function mkReleaseMotci() {
    var id = getRandomString(4);
    var card = getCardMot(id, "", [], "", true);
    $("#releases").append(card);
}

function saveRelease(id, type, mk = false) {
    let kernel = getKernel(id);
    if (kernel.length == 0) {
        mdui.alert({headline: lang[129]});
        return;
    }
    let url = $("#r-url-" + id).val();
    if (url == undefined || url.trim() == "") {
        mdui.alert({headline: lang[220]});
        return;
    }
    setLoading(id, true);
    let data = {
        index: index,
        type: type,
        url: url,
        kernel: kernel,
        make: mk
    };
    if (!mk) data.rid = id;
    $.ajax({
        url: axda + "api/v2/release/edit_release.hsp",
        data: {data: encode(data)},
        dataType: "json",
        success: (resp) => {
            if (checkCode(resp)) {
                if (mk) {
                    getRelease();
                } else {
                    setLoading(id, false);
                    $("#r-save-" + id).hide();
                    $("#r-edit-" + id).show();
                    $("#r-run-" + id).show();
                    $("#r-del-" + id).hide();
                    $("#r-url-" + id).attr("readOnly", true);
                }
            } else {
                mdui.alert({headline: lang[resp.msg]});
                setLoading(id, false);
            }
        },
    });
}

function getKernel(id) {
    var list = [];
    if ($("#r-nkx-" + id).prop("checked")) list.push("nkx");
    if ($("#r-mot-" + id).prop("checked")) list.push("mot");
    if ($("#r-pnx-" + id).prop("checked")) list.push("pnx");
    return list;
}

function setLoading(id, b) {
    $("#r-url-" + id).attr("disabled", b);
    $("#r-save-" + id).attr("loading", b);
    $(".r-k-" + id).attr("disabled", true);
}

function getRelease() {
    $(".load-release").show();
    $.ajax({
        url: axda + "api/v2/release/list_release.hsp",
        data: {data: encode({index: index})},
        dataType: "json",
        success: (resp) => {
            $(".load-release").hide();
            $(".mk-release").show();
            if (checkCode(resp)) {
                updateRelease(resp.data);
            }
        }
    });
}

function updateRelease(data) {
    $("#releases").html("");
    for (var i in data) {
        var card = getCardMot(data[i].rid, data[i].url, data[i].kernel, data[i].token);
        $("#releases").append(card);
    }
}

function editRelease(id) {
    $("#r-edit-" + id).hide();
    $("#r-run-" + id).hide();
    $("#r-save-" + id).show();
    $("#r-del-" + id).show();
    $("#r-url-" + id).attr("readOnly", false);
    $(".r-k-" + id).attr("disabled", false);
}

function getCardMot(id, url = "", kernel = [], token, mk = false) {
    var card = `<mdui-card class="full-w p-2 mt-2" variant="filled">
                        <p><strong>MOT-CI${lang[238]}</strong> <text class="theme">#${mk?lang[237]:id}</text></p>
                        <mdui-text-field id="r-url-${id}" variant="outlined" label="MOT-CI${lang[236]}"
                            readOnly ${mk?`onclick="$('#r-url-${id}').attr('readOnly', false);"`:""} value="${url}"></mdui-text-field>
                        ${mk?"":"<mdui-text-field class='mt-3' readOnly variant='filled' label='WebHook API' value='" + getWebhookMot(token) + 
                            "'><mdui-button-icon class='mr-1' slot='end-icon' icon='content_copy' onclick='copy(getWebhookMot(\""+token+"\"))'></mdui-button-icon></mdui-text-field>"}
                        <div class="l mb-2 mt-2" lang="215"></div>
                        <mdui-checkbox class="filter r-k-${id}" id="r-mot-${id}" ${kernel.includes("mot")?"checked":""} ${mk?"":"disabled"}>Nukkit-MOT</mdui-checkbox>
                        <mdui-checkbox class="filter r-k-${id}" id="r-nkx-${id}" ${kernel.includes("nkx")?"checked":""} ${mk?"":"disabled"}>Cloudburst Nukkit</mdui-checkbox>
                        <mdui-checkbox class="filter r-k-${id}" id="r-pnx-${id}" ${kernel.includes("pnx")?"checked":""} ${mk?"":"disabled"}>PowerNukkitX 1.0</mdui-checkbox>
                        <mdui-divider class="mb-2"></mdui-divider>
                        <div class="ver-center">
                            <div class="row-right">
                                <mdui-button class="mr-2 ${mk?"hide":""}" id="r-edit-${id}" variant="outlined" onclick="editRelease(${id})">${lang[240]}</mdui-button>
                                <mdui-button class="mr-2 ${mk?"":"hide"}" id="r-save-${id}" onclick="saveRelease('${id}', 'motci', ${mk})">${lang[60]}</mdui-button>
                                <mdui-button class="mr-2 hide red" variant="outlined" id="r-del-${id}" icon="delete" onclick="deleteRelease(${id})">${lang[139]}</mdui-button>
                                <mdui-button class="mr-2 ${mk?"hide":""}" id="r-run-${id}" onclick="run(${id})" icon="play_circle">${lang[239]}</mdui-button>
                            </div>
                        </div>
                    </mdui-card>`;
    return card;
}

function deleteRelease(id) {
    mdui.confirm({
        headline: lang[221],
        description: lang[138],
        confirmText: "<div class='red'>" + lang[139] + "</div>",
        cancelText: lang[140],
        onConfirm: () => {
            $.ajax({
                url: axda + "api/v2/release/delete_release.hsp",
                data: {data: encode({index: index, rid: id})},
                dataType: "json",
                success: function(resp) {
                    if (checkCode(resp)) {
                        getRelease();
                    } else {
                        mdui.alert({headline:lang[105]});
                    }
                }
            });
        }
    });
}

function copy(text) {
    navigator.clipboard.writeText(text);
    mdui.snackbar({
        message: lang[175],
        action: lang[27],
        placement: "top",
        onActionClick: () => {}
    });
}

function run(id) {
    $.ajax({
        url: axda + "api/v2/release/build_release.hsp",
        data: {data: encode({index: index,rid: id})},
        dataType: "json",
        success: (resp) => {
            if (checkCode(resp)) {
                mdui.alert({headline: lang[222]});
            }
        },
    });
}

function getWebhookMot(token) {
    return "https://api.axda.net/webhook/motci.hsp?token=" + token;
}