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
        }
    });
}

function show(data) {
    if (type === "events") {
        showEvent(data);
    }
}

function showEvent(data) {
    $("#list-data").empty();
    for (var i in data) {
        var card = `<mdui-card class="p-1 full-w ver-center mb-2" clickable>
            <div class="title ml-2">${data[i][0]}</div>
            <div class="subtitle theme ml-4">${data[i][1]}</div>
            <div class="ml-4 ${data[i][2] ? 'green' : 'red'}">${data[i][2] ? lang[256] : lang[257]}</div>
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

