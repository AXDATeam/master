var index = window.location.pathname.split("/")[2];

loadList.push(() => {updateBuild("all")});

function updateBuild(dp) {
    if (dp == "all") {
        $(".dp-btn").text(lang[223]);
    } else if (dp == "success") {
        $(".dp-btn").text(lang[224]);
    } else if (dp == "failed") {
        $(".dp-btn").text(lang[225]);
    }
    $(".load-builds").show();
    $(".list").text("");
    $.ajax({
        url: axda + "api/v2/build/build_list.hsp",
        data: {data: encode({index: index, display:dp})},
        dataType: "json",
        success: (resp) => {
            $(".load-builds").hide();
            if (checkCode(resp)) {
                var d = resp.data;
                for (var i in d) {
                var card = `<mdui-card clickable variant="filled" class="full-w pl-4 pr-4 mt-2 row ver-center" onclick="goto('/build/${index}/${d[i].bid}');">
                            <strong class="theme ml-4"><text class="mr-2">#${d[i].bid}</text> (RID: <text>${d[i].rid}</text>)</strong>
                            <mdui-icon name="${d[i].status == 200? "check_circle": "error"}" class="ml-4 mr-4 ${d[i].status == 200? "green": "red"}">
                            </mdui-icon>
                            <strong>${d[i].status == 200? lang[43]:lang[44]}</strong>
                            <p class="row-right">${formatDate(d[i].time)}</p>
                            </mdui-card>
                            </div>`;
                $(".list").append(card);
                }
            }
        }
    });
}