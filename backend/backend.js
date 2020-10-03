window.onload = function(){
    this.init();
};


function init() {

    setBrowserScrollBarEvent();
}


function setBrowserScrollBarEvent(){

    $(window).scroll(function() {
        // console.log($(document).scrollTop())
        if ($(document).scrollTop() > 0) {

            if ($(".topBar").css("display") == "none") {

                // set style of <th> for top bar table 
                for (i = 1; i <= $("thead th").length; i++) {
                    th_w = $("thead th:nth-child(" + i + ")").width();
                    $(".topBar th:nth-child(" + i + ")").width(th_w);
                }

            }
            css = {
                display: "table",
                height: 26,
                top: 0,
                position: "fixed",
            };
            $(".topBar").css(css);


        } else {
            $(".topBar").css("display", "none");
        }

    });
}


function searchFunc(){

}


function delFunc(e) {
    $("#btn_sub").removeAttr("onclick");
    $("#btn_sub").attr("onclick", "delItem()");

    $("#modify_div").css("display","none");
    $("#del_div").css("display","block");

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
        success: function(results) {
            // alert(results);
            console.log(results);

            if (typeof results == 'string') {
                try{
                    if (results) {
                        console.log(results);
                        alert("item id: " + id + ", deleted!");
                        $("#exampleModal").modal("hide");
                        location.reload();
                    } else {
                        alert("delete book error 1");
                        console.log(results);
                    }
                }catch (e) {
                    alert("ERROR DEL: " + e);
                    console.log(results);
                }
            }



        },
        error: function() {
            alert("delete book error 2");
        }
    });
}


function editFunc(e){
    $("#btn_sub").removeAttr("onclick");
    $("#btn_sub").attr("onclick", "modifyItem()");

    var item_id = e.getAttribute("data-value");
    $("#itemId").val(item_id);
    $("#itemName").val($($(e).parents()[1]).find("td").eq(1).text());
    $("#itemOtherName").val($($(e).parents()[1]).find("td").eq(2).text());
    $("#itemPath").val($($(e).parents()[1]).find("div").eq(0).text());
    $("#itemPage").val($($(e).parents()[1]).find("td").eq(4).text());
    $("#del_div").css("display","none");
    $("#modify_div").css("display","block");
}


function modifyItem(){
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
        success: function(results) {
            if (results) {
                // console.log();
                alert(results);
                $("#exampleModal").modal("hide");
                location.reload();
            } else {
                console.log("delete book error 1");
            }

        },
        error: function() {
            console.log("update book error 2");
        }
    });
}