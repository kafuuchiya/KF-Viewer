$(document).ready(function () {
    init();
});


function init() {
    id = getUrlRequest(0, 1);

    if (typeof (id) == 'undefined') {
        window.location = "/KF-Viewer/";
    } else {

        getItemInfo(id);

    }
}


function getUrlRequest(index_1, index_2) {

    // Invalid value
    if (index_1 < 0 || index_2 < 0) return;

    var url = location.search; // To get the string after the “?” from the URL

    if (url.indexOf("?") != -1) { // To check if exists value
        var urlStr = url.substr(1); // To get values from position 1 start because the position 0 is "?"

        var str, val_arr = [];

        if (urlStr.indexOf("&") != -1) { // check if more values
            // There are multiple values ​​on the URL string
            str = urlStr.split("&");

            for (var i = 0; i < str.length; i++) {
                // To get all values
                val_arr[i] = str[i].split("=");

            }

        } else {
            // There is only one value on the URL string
            str = urlStr;
            val_arr[0] = str.split("=");
        }

        // To prevent errors that exceed the length of the array
        if (index_1 < val_arr.length)
            // If it exceeds the length of index_2, it will return undefined
            return val_arr[index_1][index_2];

    }
}


function getItemInfo(id) {
    $.ajax({
        type: "GET",
        url: "get_item_info.php",
        async: true,
        data: {
            id: id,
        },
        success: function (results) {

            try {
                var res = JSON.parse(results);

                setItemInfo(res);
            } catch (e) {
                alert("ERROR GET: " + e);
                console.log(results);
            }

        }
    });
}


function setItemInfo(res) {

    // html 
    $('head title').html(res[0].name + " - Kafuu Viewer");

    // cover img
    $('.cover').attr("src", res[1][0]);

    // item name & other name
    $(".title h1:nth-child(1)").text(res[0].name);
    $(".title h1:nth-child(2)").text(res[0].other_name);

    // item posted time
    $('.iInfo tr:nth-child(1) td:nth-child(2)').text(res[0].time.substr(0, 16));

    // item author
    $('.iInfo tr:nth-child(2) td:nth-child(2)').text("unknown");

    // item language
    $('.iInfo tr:nth-child(3) td:nth-child(2)').text("unknown");

    // item file size
    $('.iInfo tr:nth-child(4) td:nth-child(2)').text(res[0].files_size + "  MB");

    // item length
    $('.iInfo tr:nth-child(5) td:nth-child(2)').text(res[1].length + " pages");

    // show itmes
    showItems(res[1]);

    // set pagination
    setPagination(res[1]);


}


function showItems(res) {
    var html = "";
    pg_offset = 36;
    var data_len = pg_offset; // default show number of data
    var page = getUrlRequest(1, 1);
    page = typeof (page)== "undefined" ? 1 : parseInt(page); // page check

    var pg_c = Math.ceil(res.length / pg_offset); // page count

    if (res.length < pg_offset) {
        // page 1 and less than 36 data
        data_len = res.length;
    } else if (page == pg_c) {
        // last page
        data_len = res.length - (page - 1) * pg_offset;
    }

    var text = "Showing " + ((page - 1) * pg_offset + 1) + " - " + ((page - 1) * pg_offset + data_len) + " of " + res.length + " images";
    $('.data-len-show').text(text);

    for (var i = (page - 1) * pg_offset; i < ((page - 1) * pg_offset + data_len); i++) {

        html = "<div class=\"col-xl-1 col-lg-2 col-md-3 col-sm-4 col-4 d-flex justify-content-center\">";
        html += "<a href=\"/KF-Viewer/i/z/?id=" + id + "&p=" + (i + 1) + "\">";
        html += "<img src=\"" + res[i] + "\"><div class=\"pageN\">" + (i + 1) + "</div></a></div>";
        $(".dshow").append(html);

    }
}

function setPagination(pageInfo) {

    var pt_html = "";
    var pg_c = Math.ceil(pageInfo.length / pg_offset);
    var pg_n = getUrlRequest(1, 1);
    pg_n = typeof(pg_n) == "undefined" ? 1 : parseInt(pg_n); // now page check
    var url_pathname = window.location.pathname;

    // pre page button
    if (pg_n == 1) {
        pt_html += "<li class=\"page-item disabled\">";
        pt_html += "<a class=\"page-link disabled-a\" href=\"#\" aria-label=\"Previous\">";
        pt_html += "<span aria-hidden=\"true\">&laquo;</span>";
        pt_html += "</a></li>";
    } else {
        pt_html += "<li class=\"page-item\">";
        pt_html += "<a class=\"page-link\" href=\"" + url_pathname + "?id=" + id + "&page=" + (pg_n - 1) + "\" aria-label=\"Previous\">";
        pt_html += "<span aria-hidden=\"true\">&laquo;</span>";
        pt_html += "</a></li>";
    }

    // Middle page number button
    if (pg_c <= 8) {
        // case in page count <=8
        pt_html += setMiddlePage(1, pg_c, pg_n);

    } else {
        // case in page count >8
        if (pg_n <= 4) {
            // case in now page <4
            // set middle page
            pt_html += setMiddlePage(1, 7, pg_n);
            // selection prompt of page
            pt_html += "<li class=\"page-item\"><a class=\"page-link\" onclick=\"setSelectPage(" + pg_c + ")\">...</a></li>";
            // last page
            pt_html += "<li class=\"page-item\">";
            pt_html += "<a class=\"page-link\" href=\"" + url_pathname + "?id=" + id + "&page=" + pg_c + "\">" + pg_c + "</a></li>";

        } else if (pg_n > (pg_c - 4)) {
            // case of the now page on the last four page
            // home page
            pt_html += "<li class=\"page-item\">";
            pt_html += "<a class=\"page-link\" href=\"" + url_pathname + "?id=" + id + "&page=1" + "\">1</a></li>";
            // selection prompt of page
            pt_html += "<li class=\"page-item\"><a class=\"page-link\" onclick=\"setSelectPage(" + pg_c + ")\">...</a></li>";
            // set middle page
            pt_html += setMiddlePage((pg_c - 4), pg_c, pg_n);
        } else {
            // case in the number of now page is more than 4 and less than the last four page
            // home page
            pt_html += "<li class=\"page-item\">";
            pt_html += "<a class=\"page-link\" href=\"" + url_pathname + "?id=" + id + "&page=1" + "\">1</a></li>";
            // selection prompt of page
            pt_html += "<li class=\"page-item\"><a class=\"page-link\" onclick=\"setSelectPage(" + pg_c + ")\">...</a></li>";
            // set middle page
            pt_html += setMiddlePage((pg_n - 2), (pg_n + 2), pg_n);
            // selection prompt of page
            pt_html += "<li class=\"page-item\"><a class=\"page-link\" onclick=\"setSelectPage(" + pg_c + ")\">...</a></li>";
            // last page
            pt_html += "<li class=\"page-item\">";
            pt_html += "<a class=\"page-link\" href=\"" + url_pathname + "?id=" + id + "&page=" + pg_c + "\">" + pg_c + "</a></li>";
        }
    }

    // next page button
    if (pg_n == pg_c || pg_c == 0) {
        pt_html += "<li class=\"page-item disabled\">";
        pt_html += "<a class=\"page-link disabled-a\" href=\"#\" aria-label=\"Next\">";
        pt_html += "<span aria-hidden=\"true\">&raquo;</span>";
        pt_html += "</a></li>";
    } else {
        pt_html += "<li class=\"page-item\">";
        pt_html += "<a class=\"page-link\" href=\"" + url_pathname + "?id=" + id + "&page=" + (pg_n + 1) + "\" aria-label=\"Next\">";
        pt_html += "<span aria-hidden=\"true\">&raquo;</span>";
        pt_html += "</a></li>";
    }

    $(".pagination").html(pt_html);
}


function setMiddlePage(index, total, now) {
    var html = "";

    var url_pathname = window.location.pathname;


    if (total == 0) {
        html += "<li class=\"page-item disabled\">";
        html += "<a class=\"page-link\" href=\"#\">1</a></li>";
    } else {
        for (var i = index; i <= total; i++) {
            if (i == now) {
                html += "<li class=\"page-item disabled\">";
                html += "<a class=\"page-link\" href=\"#\">" + i + "</a></li>";
            } else {

                html += "<li class=\"page-item\">";
                html += "<a class=\"page-link\" href=\"" + url_pathname + "?id=" + id + "&page=" + i + "\">" + i + "</a></li>";

            }
        }
    }

    return html;

}


function setSelectPage(total_page) {

    var page = prompt('Jump to page: (1-' + total_page + ')', 1);

    if (page != null && page <= total_page && page >= 1) {
        window.location = "?id=" + id + "&page=" + page ;
    }
}