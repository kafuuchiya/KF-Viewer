$(document).ready(function () {
    init();
});


function init() {

    // To check the url if correct
    if (String(getUrlRequest(0, 0)).indexOf("page") == 0 ||
        typeof (getUrlRequest(0, 0)) == "undefined") {
        // When the first value of url is "page" or no value
        if (typeof (getUrlRequest(1, 0)) == "undefined") {
            // When the second value of url does not exist
            getItems();
        } else if (String(getUrlRequest(1, 0)).indexOf("search") == 0 &&
            typeof (getUrlRequest(2, 0)) == "undefined") {
            // When the second value is "search" and the third value does not exist
            searchItems();
        } else {
            window.location = window.location.pathname;
        }
    } else {
        window.location = window.location.pathname;
    }

    inputSelectFilesEvent();
}


function getUrlRequest(index_1, index_2) {
    // Example:
    // if url is "?page=10&search=AB"
    // index_1, [0] to get page data or [1] to search search data
    // index_2, [0] to get data key string "page" or [1] to get value "10"

    // Invalid value
    if (index_1 < 0 || index_2 < 0) return;

    var url = location.search; // To get the string after the "?" from the URL

    if (url.indexOf("?") != -1) { // To check if exists value
        var urlStr = url.substr(1); // To get values from position 1 start because the position 0 is "?"

        var str, val_arr = [];

        if (urlStr.indexOf("&") != -1) { // check if more values
            // There are multiple values on the URL string
            str = urlStr.split("&");

            for (var i = 0; i < str.length; i++) {
                // To get all values
                val_arr[i] = str[i].split("=");

                // Example:
                // if url is "?page=10&search=AB"
                // val_arr[0] = {"page","10"}, val_arr[0][0] = page
                // val_arr[1] = {"search","AB"}, val_arr[1][0] = search
                // So, val_arr[0][0] = key, val_arr[0][1] = value
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


function getItems() {
    var page = getUrlRequest(0, 1);
    $.ajax({
        type: "GET",
        url: "get_items.php",
        async: true,
        data: {
            page: page,
        },
        success: function (results) {
            if (typeof results == 'string') {
                try {
                    var res = JSON.parse(results);
                    showItems(res);

                } catch (e) {
                    alert("ERROR GET: " + e);
                    console.log(results);
                }
            }

        }
    });
}


function showItems(res) {

    setPagination(res[0]);
    if (parseInt(res[0].data_len) == 0) {
        $('.row').append("<h5 class=\"col-12\">no result</h5>");
    } else {
        var itemsInfo = res[1];
        var itemsHtml = "";
        $.each(itemsInfo, function (index, value) {
            itemsHtml = "<div class=\"col-xl-2 col-lg-3 col-md-4 col-sm-6 col-6 custom-card-style\">";
            itemsHtml += "<div class=\"card\">";
            itemsHtml += "<div class=\"img-div\">";
            itemsHtml += "<a href=\"/KF-Viewer/i?id=" + value.id + "\"><img src=\"" + value.cover + "\" class=\"card-img-top\" alt=\"error\"> </a>";
            itemsHtml += "</div>";
            itemsHtml += "<div class=\"card-body\">";
            itemsHtml += "<a href=\"/KF-Viewer/i?id=" + value.id + "\"><div class=\"card-title my-card-title\">" + value.name + "</div> </a>";
            itemsHtml += "<hr>";
            itemsHtml += "<div class=\"card-text d-flex justify-content-around\">";
            itemsHtml += "<div>" + value.time.substr(0, 16) + "</div><div>" + value.page + " pages</div>";
            itemsHtml += "</div> </div> </div> </div>";
            $(".row").append(itemsHtml);
        });
        $('.data-len-show').text("Showing " + res[0].data_len + " results");
    }

}


function setPagination(pageInfo) {
    var pt_html = "";
    var pg_c = pageInfo.page_count;
    var pg_n = pageInfo.now_page;
    var url_str = "";
    var url_pathname = window.location.pathname;

    if (String(getUrlRequest(1, 0)).indexOf("search") == 0) {
        url_str = "&search=" + $("#f_search").val();
    }

    // pre page button
    if (pg_n == 1) {
        pt_html += "<li class=\"page-item disabled\">";
        pt_html += "<a class=\"page-link disabled-a\" href=\"#\" aria-label=\"Previous\">";
        pt_html += "<span aria-hidden=\"true\">&laquo;</span>";
        pt_html += "</a></li>";
    } else {
        pt_html += "<li class=\"page-item\">";
        pt_html += "<a class=\"page-link\" href=\"" + url_pathname + "?page=" + (pg_n - 1) + url_str + "\" aria-label=\"Previous\">";
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
            pt_html += "<a class=\"page-link\" href=\"" + url_pathname + "?page=" + pg_c + url_str + "\">" + pg_c + "</a></li>";

        } else if (pg_n > (pg_c - 4)) {
            // case of the now page on the last four page
            // home page
            pt_html += "<li class=\"page-item\">";
            pt_html += "<a class=\"page-link\" href=\"" + url_pathname + "?page=1" + url_str + "\">1</a></li>";
            // selection prompt of page
            pt_html += "<li class=\"page-item\"><a class=\"page-link\" onclick=\"setSelectPage(" + pg_c + ")\">...</a></li>";
            // set middle page
            pt_html += setMiddlePage((pg_c - 4), pg_c, pg_n);
        } else {
            // case in the number of now page is more than 4 and less than the last four page
            // home page
            pt_html += "<li class=\"page-item\">";
            pt_html += "<a class=\"page-link\" href=\"" + url_pathname + "?page=1" + url_str + "\">1</a></li>";
            // selection prompt of page
            pt_html += "<li class=\"page-item\"><a class=\"page-link\" onclick=\"setSelectPage(" + pg_c + ")\">...</a></li>";
            // set middle page
            pt_html += setMiddlePage((pg_n - 2), (pg_n + 2), pg_n);
            // selection prompt of page
            pt_html += "<li class=\"page-item\"><a class=\"page-link\" onclick=\"setSelectPage(" + pg_c + ")\">...</a></li>";
            // last page
            pt_html += "<li class=\"page-item\">";
            pt_html += "<a class=\"page-link\" href=\"" + url_pathname + "?page=" + pg_c + url_str + "\">" + pg_c + "</a></li>";
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
        pt_html += "<a class=\"page-link\" href=\"" + url_pathname + "?page=" + (pg_n + 1) + url_str + "\" aria-label=\"Next\">";
        pt_html += "<span aria-hidden=\"true\">&raquo;</span>";
        pt_html += "</a></li>";
    }

    $(".pagination").html(pt_html);
}


function setMiddlePage(index, total, now) {
    var html = "";

    var url_str = "";
    var url_pathname = window.location.pathname;

    if (String(getUrlRequest(1, 0)).indexOf("search") == 0) {
        // url_pt_str = "?page=1&search=" + $("#f_search").val();
        url_str = "&search=" + $("#f_search").val();
    }

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
                html += "<a class=\"page-link\" href=\"" + url_pathname + "?page=" + i + url_str + "\">" + i + "</a></li>";

            }
        }
    }

    return html;

}


function setSelectPage(total_page) {
    var url_str = "";
    if (String(getUrlRequest(1, 0)).indexOf("search") == 0) {
        url_str = "&search=" + $("#f_search").val();
    }
    var page = prompt('Jump to page: (1-' + total_page + ')', 1);

    if (page != null && page <= total_page && page >= 1) {
        window.location = '?page=' + page + url_str;
    }
}


function addItem() {
    if (isNull($("#itemName").val())) {
        return;
    }
    if (isNull($("#itemOtherName").val())) {
        return;
    }
    if (isNull($("#itemFile").val())) {
        if (isNull($("#itemFileType").val())) {
            alert("Please select a upload type!");
            return;
        }
        return;
    }

    if (file_type.indexOf("ERROR") < 0) {
        var data = new FormData($("#uploadForm")[0]);

        $.ajax({
            type: "POST",
            url: "add_item.php",
            async: true,
            cache: false,
            processData: false,
            contentType: false,
            data: data,
            success: function (results) {
                if (typeof results == 'string') {
                    try {
                        console.log(results);

                        var res = JSON.parse(results);
                        alert(res[1]);
                        $("#exampleModalCenter").modal("hide");
                        location.reload();

                    } catch (e) {
                        alert("ERROR Add: " + e);
                        console.log(results);

                    }
                }

            }

        });
    }


}


// To listen the info of the inputting file 
function inputSelectFilesEvent() {
    $(document).on('change', '#itemFile', function () {
        var filesList = document.querySelector('#itemFile').files;
        var length = $(filesList).length;
        var name = "";

        if (length != 0) {
            // Temporary type
            var t_type = $(filesList)[0].type;
            // selected type of upload
            var iFileType = $('#itemFileType').val();

            // To check the file format
            if (length == 1 && iFileType.indexOf("ZIP") != -1) {
                if (t_type.indexOf("zip") != -1) {
                    // zip type
                    file_type = "ZIP";
                    var str_name = $(filesList)[0].name.split(".");
                    name = str_name[0];
                } else {
                    // non-zip type
                    file_type = "ERROR";
                    // length = 0;
                    $("#itemFile").val("");
                    alert("Please make sure this is a zip file");
                }
            } else {
                // To check the uploaded file if has a non-image type
                for (i = 0; i < length; i++) {
                    // desktop.ini is a hidden configuration file
                    // If you have made custom changes to the file, such as changing the icon. There will be this file
                    // It will be captured in chrome upload
                    if (filesList[i].type.indexOf("image") == -1 && filesList[i].name.indexOf("desktop.ini") == -1) {
                        
                        f_name = filesList[i].name;
                        file_type = "ERROR";
                        // length = 0;
                        $("#itemFile").val("");
                        alert("Please make sure there are only pictures in the folder => " + f_name);
                        break;
                    }
                }
                // Suppose all are img type 
                var str = filesList[0].webkitRelativePath.split("/");
                name = str[0];
                file_type = "IMG";

            }

        } else {
            $("#itemFile").val("");
            alert("Empty file!");
            return;
        }

        $("#itemFileName").val(name);
        $("#itemName").val(name);

    });

}


function isNull(val) {
    var str = val.replace(/(^\s*)|(\s*$)/g, '');
    if (str == '' || str == undefined || str == null) {
        // null
        return true;
    } else {
        return false;
    }
}


// To choose the format of the uploaded file
function selectTypeForFiles(obj) {
    // To set default value is null
    $("#itemFile").val("");
    // $("#itemName").val("");
    $("#itemFileName").val("");

    // To delete class of old option and add to new option
    $(".type-now").removeClass("type-now");
    $(obj).addClass("type-now");

    // To enable the file upload input
    $("#itemFile").removeAttr("disabled");

    // To show the selected option 
    $('.ddBtn').text($(obj).text());
    // To set the type value
    $('#itemFileType').val($(obj).text());

    // To set the type for different options
    if ($(obj).text() === "ZIP") {
        $("#itemFile").removeAttr("webkitdirectory");
        $("#itemFile").attr("accept", ".zip");
    } else if ($(obj).text() === "FILE") {
        $("#itemFile").removeAttr("accept");
        $("#itemFile").attr("webkitdirectory", "");
    }

}


function searchFunc() {
    var search_val = $("#f_search").val();
    console.log(search_val);

    if (search_val.length == 0) {
        window.location = window.location.pathname;
    } else {
        window.location = '?page=1&search=' + search_val;
    }
}

function searchItems() {

    $("#f_search").val(decodeURI(getUrlRequest(1, 1)));
    var search_data = $("#f_search").val();
    var page = getUrlRequest(0, 1);

    if (String(search_data).indexOf(",") != -1) {
        search_data = search_data.split(",");
    } else {
        search_data[0] = search_data;
    }

    $.ajax({
        type: "GET",
        url: "search_items.php",
        async: true,
        data: {
            key_word: search_data,
            page: page
        },
        success: function (results) {
            if (typeof results == 'string') {
                try {
                    var res = JSON.parse(results);
                    showItems(res);

                } catch (e) {
                    alert("ERROR Search: " + e);
                    console.log(results);
                }
            }

        }
    });

}