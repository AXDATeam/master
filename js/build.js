var index = window.location.pathname.split("/")[2];
var bid = window.location.pathname.split("/")[3];

loadList.push(() => {load()});

function load() {
    $.ajax({
        url: axda + "api/v2/build/build_info.hsp",
        data: {data: encode({index: index, bid:bid})},
        dataType: "json",
        success: (resp) => {
            if (checkCode(resp)) {
                var d = resp.data;
                $(".load-build").hide();
                $(".info").show();
                $("#t-bid").text(d.bid);
                $("#t-name").text(d.name);
                $("#t-name").attr("href", "https://axda.net/app/" + d.index);
                $("#t-status").text(d.status == 200? lang[43]: lang[44]);
                $("#t-status").addClass(d.status == 200? "green": "red");
                $("#t-trigger").text(d.trigger);
                $("#t-rid").text(d.rid);
                $("#t-time").text(formatDate(d.time));
                $("#t-type").text(d.type);
                if (d.print == "-3") {
                    $(".t-print").val(lang[d.status]);
                } else {
                    $(".t-print").val(d.print);
                }
            }
        }
    });
}