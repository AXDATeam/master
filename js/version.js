var index = window.location.pathname.split("/")[2];
var version = window.location.pathname.split("/")[4];

loadList.push(() => {load()});

function load() {
    $.ajax({
        url: axda + "api/v2/version.hsp",
        data: {data: encode({index: index, version: version})},
        dataType: "json",
        success: (resp) => {
            $(".load").hide();
            if (checkCode(resp)) {
                $(".info").show();
                let data = resp.data;
                $(".v-name").text(data.name);
                $(".v-version").text(version);
                $(".v-time").text(formatDate(data.update));
                $(".v-size").text(formatSize(data.size));
                $(".v-md5").val(data.md5);
                $(".v-sha1").val(data.sha1);
                $(".v-sha256").val(data.sha256);
                $(".v-sha512").val(data.sha512);
                $(".v-desc").val(data.info == ''?lang[174]:data.info);
                $(".v-cmd").val("axda install " + index + " " + version);
                if (data.filter.includes("[nkx]")) $(".v-filter").append("<div class='mr-2 nowrap'>CloudBurst Nukkit</div>");
                if (data.filter.includes("[mot]")) $(".v-filter").append("<div class='mr-2 nowrap'>Nukkit-MOT</div>");
                if (data.filter.includes("[pnx]")) $(".v-filter").append("<div class='mr-2 nowrap'>PowerNukkitX 1.0</div>");
            } else {
                $(".error").show();
                $(".info").hide();
                $("#err-msg").text(lang[resp.msg]);
            }
        },
        error: (resp) => {
            $(".load").hide();
            $(".error").show();
            $(".info").hide();
        }
    });
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text);
    mdui.snackbar({
        message: lang[175],
        action: lang[27],
        placement: "top",
        onActionClick: () => {}
    });
}

function downloadFile() {
    loading.open();
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
                
            }
        },
        error: (resp) => {
            loading.close();
            mdui.alert({headline: lang[105]});
        }
    });
}