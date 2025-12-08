$.ajax({
    url: axda + "api/v2/down_nukkit_mot.hsp",
    type: "GET",
    dataType: "json",
    success: (resp) => {
        $("#latest").text(resp.latest);
        var list = resp.list;

        // 按版本号从大到小排序
        list.sort((a, b) => {
            // 提取版本号中的数字部分（例如从 "Nukkit-MOT-b1024.jar" 中提取 1024）
            const numA = parseInt(a.match(/b(\d+)/)[1]);
            const numB = parseInt(b.match(/b(\d+)/)[1]);
            return numB - numA; // 从大到小排序
        });

        for (var i in list) {
            var card = `
                <mdui-card class="full-w p-4 mt-2 ver-center" variant="filled">
                    <mdui-icon class="mr-2">cloud_download</mdui-icon>
                    <a href="https://down.axda.net/history/${list[i]}">${list[i]}</a>
                </mdui-card>
            `;
            $("#history").append(card);
        }
    }
});
