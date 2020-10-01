$(document).ready(function () {
    init();
});

function init() {

    showItems();
    inputSelectFilesEvent();
}

function showItems() {
    var title = "(T99) [test (Web Test)] This is a web test! Test-TEST(Test&Test&Test) [Test]";
    // var cover = "res/img/004.jpg";
    var time = "2020-09-28 18:17";
    var page = "200 pages";
    // var html = "<h5 class=\"col-sm-12\">no data!</h5>";
    var html = "";


    for (i = 0; i < 50; i++) {


        var cover = "res/img/00" + (i % 4 + 1) + ".jpg";
        // console.log(i+": "+(i%4+1) +" "+cover);

        html_t = " <div class=\"col-xl-2 col-lg-3 col-md-4 col-sm-6 custom-card-style\">";
        html_t += "<div class=\"card\">";
        html_t += "<div class=\"img-div\">";
        html_t += "<a href=\"#\"><img src=\"" + cover + "\" class=\"card-img-top\" alt=\"error\"> </a>";
        html_t += "</div>";
        html_t += "<div class=\"card-body\">";
        html_t += "<a href=\"#\"><div class=\"card-title my-card-title\">" + title + "</div> </a>";
        html_t += "<hr>";
        html_t += "<div class=\"card-text d-flex justify-content-around\">";
        html_t += "<div>" + time + "</div><div>" + page + "</div>";
        html_t += "</div> </div> </div> </div>";
        html += html_t;
    }

    // console.log(html);
    $(".row").append(html);
}





function addItem() {
    if(isNull($("#itemName").val())){
        return;
    }
    if(isNull($("#itemOtherName").val())){
        return;
    }
    if(isNull($("#itemFile").val())){
        if(isNull($("#itemFileType").val())){
            alert("Please select a upload type!");
            return;
        }
        return;
    }


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
            console.log(results);
            $("#exampleModalCenter").modal("hide");
            var res = JSON.parse(results);
            alert(res[1]);
            location.reload();
        }

    });

}

// To listen the info of the inputting file 
function inputSelectFilesEvent() {
    $(document).on('change', '#itemFile', function () {
        var filesList = document.querySelector('#itemFile').files;
        var name;
        var length = $(filesList).length;
        // Temporary type
        var t_type = $(filesList)[0].type;

        // To check the file format
        if (length==1){
            if (t_type.indexOf("zip") >= 0) {
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
        }else if (length >1){
            // Suppose all are img type 
            var str = filesList[0].webkitRelativePath.split("/");
            name = str[0];
            file_type = "IMG";

            // To check the uploaded file if has a non-image type
            for (i = 0; i < length; i++) {
                if (filesList[i].type.indexOf("image") == -1) {
                    file_type = "ERROR";
                    // length = 0;
                    name = "";
                    $("#itemFile").val("");
                    alert("Please make sure there are only pictures in the folder");
                    break;
                }
            }
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