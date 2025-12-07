$.ajax({
    url: axda + "api/v2/down_nukkit_mot.hsp",
    type: "GET",
    dataType: "json",
    success: (resp) => {
        $("#latest").text(resp.latest);
    }
});