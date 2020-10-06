window.onload = function () {};

$(document).ready(function () {
    init();
});


function init() {
    setWindowWidthEvent();
    setBrowserScrollBarEvent();
    if (String(getUrlRequest(0, 0)).indexOf("search") == 0) {
        setSearchVal();
    }

}

function setWindowWidthEvent() {
    if ($(window).width() < 992) {
        tableSubDisplayNone();
        topBarResize();
    } else {
        tableSubDisplay();
        topBarResize();

    }

    $(window).resize(function () {

        if ($(window).width() < 992) {
            tableSubDisplayNone();
            topBarResize();

        } else {
            tableSubDisplay();
            topBarResize();

        }
    });
}

function tableSubDisplayNone() {
    $(".topBar th:nth-child(3)").css("display", "none");
    $(".topBar th:nth-child(4)").css("display", "none");
    $(".topBar th:nth-child(5)").css("display", "none");
    $(".topBar th:nth-child(6)").css("display", "none");


    $("thead th:nth-child(3)").css("display", "none");
    $("thead th:nth-child(4)").css("display", "none");
    $("thead th:nth-child(5)").css("display", "none");
    $("thead th:nth-child(6)").css("display", "none");

    $("tbody td:nth-child(3)").css("display", "none");
    $("tbody td:nth-child(4)").css("display", "none");
    $("tbody td:nth-child(5)").css("display", "none");
    $("tbody td:nth-child(6)").css("display", "none");
}

function tableSubDisplay() {
    $(".topBar th:nth-child(3)").css("display", "table-cell");
    $(".topBar th:nth-child(4)").css("display", "table-cell");
    $(".topBar th:nth-child(5)").css("display", "table-cell");
    $(".topBar th:nth-child(6)").css("display", "table-cell");

    $("thead th:nth-child(3)").css("display", "table-cell");
    $("thead th:nth-child(4)").css("display", "table-cell");
    $("thead th:nth-child(5)").css("display", "table-cell");
    $("thead th:nth-child(6)").css("display", "table-cell");

    $("tbody td:nth-child(3)").css("display", "table-cell");
    $("tbody td:nth-child(4)").css("display", "table-cell");
    $("tbody td:nth-child(5)").css("display", "table-cell");
    $("tbody td:nth-child(6)").css("display", "table-cell");
}


function setBrowserScrollBarEvent() {
    var css = {
        display: "table",
        height: 26,
        top: 0,
        position: "fixed",
    };

    topBarResize();

    if ($(document).scrollTop() > 0) {
        $(".topBar").css(css);
    }

    $(window).scroll(function () {

        if ($(document).scrollTop() > 0) {
            $(".topBar").css(css);
        } else {
            $(".topBar").css("display", "none");
        }

    });
}


function topBarResize(){
    // set style of <th> for top bar table 
    for (i = 1; i <= $("thead th").length; i++) {
        th_w = $("thead th:nth-child(" + i + ")").width();
        $(".topBar th:nth-child(" + i + ")").width(th_w);
    }
}


function delFunc(e) {
    $("#btn_sub").removeAttr("onclick");
    $("#btn_sub").attr("onclick", "delItem()");

    $("#modify_div").css("display", "none");
    $("#del_div").css("display", "block");

    var item_id = e.getAttribute("data-value");
    $("#delItemId").text(item_id);

}


function delItem() {
    var id = $("#delItemId").text();
    $.ajax({
        type: "GET",
        url: "del_item.php",
        data: {
            id: id
        },
        success: function (results) {
            // alert(results);
            // console.log(results);

            if (typeof results == 'string') {
                try {
                    if (results) {
                        console.log(results);
                        alert("item id: " + id + ", deleted!");
                        $("#exampleModal").modal("hide");
                        location.reload();
                    } else {
                        alert("delete book error 1");
                        console.log(results);
                    }
                } catch (e) {
                    alert("ERROR DEL: " + e);
                    console.log(results);
                }
            }



        },
        error: function () {
            alert("delete book error 2");
        }
    });
}


function editFunc(e) {
    $("#btn_sub").removeAttr("onclick");
    $("#btn_sub").attr("onclick", "modifyItem()");

    var item_id = e.getAttribute("data-value");
    $("#itemId").val(item_id);
    $("#itemName").val($($(e).parents()[1]).find("td").eq(1).text());
    $("#itemOtherName").val($($(e).parents()[1]).find("td").eq(2).text());
    $("#itemPath").val($($(e).parents()[1]).find("div").eq(0).text());
    $("#itemPage").val($($(e).parents()[1]).find("td").eq(4).text());
    $("#del_div").css("display", "none");
    $("#modify_div").css("display", "block");
}


function modifyItem() {
    var itemId = $("#itemId").val();
    var itemName = $("#itemName").val();
    var itemOtherName = $("#itemOtherName").val();
    var itemPath = $("#itemPath").val();
    var itemPage = $("#itemPage").val();

    $.ajax({
        type: "GET",
        url: "update_item.php",
        data: {
            id: itemId,
            name: itemName,
            other_name: itemOtherName,
            file_location: itemPath,
            page: itemPage
        },
        success: function (results) {
            if (results) {
                // console.log();
                alert(results);
                $("#exampleModal").modal("hide");
                location.reload();
            } else {
                console.log("delete book error 1");
            }

        },
        error: function () {
            console.log("update book error 2");
        }
    });
}


function searchFunc() {

    var search_val = $("#f_search").val();

    if (search_val.length == 0) {
        window.location = window.location.pathname;
    } else {
        window.location = '?search=' + search_val;
    }
}


function setSearchVal() {
    $("#f_search").val(decodeURI(getUrlRequest(0, 1)));
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