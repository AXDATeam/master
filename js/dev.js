const type = window.location.pathname.split("/")[2];

loadList.push(load);

var data;

function load() {
    $.ajax({
        url: axda + "api/v2/dev/" + type + ".csv",
        dataType: "text",
        success: function(resp) {
            data = csv2json(resp);
            show(data);
        },
        error: function(resp) {
            $("#container").text('');
        }
    });
}

function show(data) {
    if (type === "events") {
        $(".dev-title").text(lang[258]);
        showEvent(data);
    } else if (type === "versions") {
        $(".dev-title").text(lang[259]);
        showVersion(data);
    } else if (type === "effects") {
        $(".dev-title").text(lang[260]);
        $(".dev-tips").html(lang[261]);
        showEffect(data);
    } else if (type === "sounds") {
        $(".dev-title").text(lang[262]);
        $(".dev-tips").html(lang[263]);
        showSound(data);
    } else if (type === "enchantments") {
        $(".dev-title").text(lang[264]);
        showEnchantment(data);
    }
}

function showEvent(data) {
    $("#list-data").empty();
    for (var i in data) {
        var card = `<mdui-card class="p-1 full-w ver-center mb-2 row" clickable>
            <div class="title ml-2">${data[i][0]}</div>
            <div class="subtitle theme ml-4">${data[i][1]}</div>
            <div class="ml-4 ${data[i][2] ? 'green' : 'red'} row-right pr-4">${data[i][2] ? lang[256] : lang[257]}</div>
        </mdui-card>`;
        $("#list-data").append(card);
    }
}

function showVersion(data) {
    $("#list-data").empty();
    for (var i in data) {
        var card = `<mdui-card class="p-1 full-w ver-center mb-2 row" clickable>
            <div class="ml-2">${data[i][0]}</div>
            <div class="subtitle theme ml-4 row-right pr-4">${data[i][1]}</div>
        </mdui-card>`;
        $("#list-data").append(card);
    }
}

function showEffect(data) {
    $("#list-data").empty();
    for (var i in data) {
        var card = `<mdui-card class="p-1 full-w ver-center mb-2 row" clickable>
            <div class="ml-2">${data[i][0]}</div>
            <div class="subtitle theme ml-4">${data[i][1]}</div>
            <div class="subtitle row-right pr-4">${data[i][2]}</div>
        </mdui-card>`;
        $("#list-data").append(card);
    }
}

function showSound(data) {
    $("#list-data").empty();
    for (var i in data) {
        var card = `<mdui-card class="p-1 full-w ver-center mb-2 row" clickable>
            <div class="ml-2 theme">${data[i][0]}</div>
            <div class="subtitle ml-4 row-right pr-4">${data[i][1]}</div>
        </mdui-card>`;
        $("#list-data").append(card);
    }
}

function showEnchantment(data) {
    $("#list-data").empty();
    for (var i in data) {
        var card = `<mdui-card class="p-1 full-w ver-center mb-2 row" clickable>
            <div class="ml-2">${data[i][0]}</div>
            <div class="subtitle theme ml-4">${data[i][1]}</div>
        </mdui-card>`;
        $("#list-data").append(card);
    }
}

function search(key) {
    key = key.trim().toLowerCase();
    if (key === '') {
        show(data);
        return;
    }
    var filter = [];
    for (var i in data) {
        for (var j in data[i]) {
            try {
                if (data[i][j].toLowerCase().includes(key)) {
                    filter.push(data[i]);
                }
            } catch (e) {
            }
        }
    }
    show(filter);
}

function csv2json(csvText) {
    const lines = csvText.split('\n');
    const result = [];

    for (let i = 0; i < lines.length; i++) {
        if (!lines[i]) continue;

        const currentLine = lines[i].split(',');
        const row = [];

        for (let j = 0; j < currentLine.length; j++) {
            // 处理可能存在的引号包裹的值
            let value = currentLine[j];
            if (value && value.startsWith('"') && value.endsWith('"')) {
                value = value.substring(1, value.length - 1);
            }
            value = value.trim();

            // 尝试转换为适当的类型
            if (!isNaN(value) && value.trim() !== '') {
                row.push(Number(value));
            } else if (value.toLowerCase() === 'true' || value.toLowerCase() === 'false') {
                row.push(value.toLowerCase() === 'true');
            } else {
                row.push(value);
            }
        }

        result.push(row);
    }

    return result;
}

