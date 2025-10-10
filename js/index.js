var update = function () {
    var w = $('#main').innerWidth();
    if (w >= 1200) $('.card').innerWidth(w/4);
    if (w < 1200 && w >= 900) $('.card').innerWidth(w/3);
    if (w < 900 && w >= 600) $('.card').innerWidth(w/2);
    if (w < 600) $('.card').innerWidth(w);
};
var seed = Math.random()*10;
viewListener.push(update);
var paging = new Paging($("#paging"));
search();
var word = '';
function search(word, page = 1, load = false, order = undefined) {
    if (load) {
        loading.open();
    } else {
        $(".loading").show();
    }
    if (!load) $("#main").text("");
    window.word = word;
    let p = {};
    p.word = word;
    p.filter = getFilter();
    p.order = order == undefined ? getOrder(): order;
    p.seed = seed;
    p.page = page;
    $.ajax({
        url: axda + "api/v2/search.hsp",
        data: {data: encode(p)},
        dataType: "json",
        success: (resp) => {
            if (checkCode(resp)) {
                if (load) $("#main").text("");
                if (load) updateView();
                $(".loading").hide();
                loading.close();
                $("#main").show();
                var p = resp.data.plugins;
                for (var i in p) {
                    plugin(p[i]);
                }
                paging.set(resp.paging.page, resp.paging.count);
            }
        },
    });
    $("#search").val(word);
}

function plugin(p) {
    var card = `<div class="card p-1" style="height:160px;">
                    <mdui-card class="full p-2 mdui-parse" onclick="goto('app/${p.index}/')" clickable variant="filled">
                        <div class="ver-center p-0">
                            <div class="title" style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">${p.title}</div>
                            <!--<mdui-chip class="row-right" elevated>${p.latest}</mdui-chip>-->
                        </div>
                        <div class="mb-1" style="height:56px;overflow:hidden;position:relative;">
                            <div class="plugin-info">${p.description}</div>
                        </div>
                        <div class="ver-center">
                            <mdui-card variant="filled" class="ver-center p-1">
                                <mdui-icon class="theme" name="download"></mdui-icon>
                                <div class="ml-1 theme">${p.down_web + p.down_cmd}</div>
                            </mdui-card>
                            <mdui-card variant="filled" class="ver-center p-1 ml-2">
                                <mdui-icon class="theme" name="favorite"></mdui-icon>
                                <div class="ml-1 theme">${p.following}</div>
                            </mdui-card>
                            <mdui-card variant="filled" class="ver-center p-1 ml-2">
                                <mdui-icon class="theme" name="update"></mdui-icon>
                                <div class="ml-1 theme">${formatDate(p.update)}</div>
                            </mdui-card>
                        </div>
                    </mdui-card>
                </div>`;
    $("#main").append(card);
}

function getOrder() {
    var o = $("#s-order").val();
    return o == ''? "random": o;
}

function handleEnter(event) {console.log(event)
    if (event.key == "Enter") search($('#search').val());
}