$(document).ready(function () {
    init();
});

function init(){

    showItems();
}

function showItems(){
    var title = "(T99) [test (Web Test)] This is a web test! Test-TEST(Test&Test&Test) [Test]";
    // var cover = "res/img/004.jpg";
    var time = "2020-09-28 18:17";
    var page = "200 pages";
    var html = "";


    for (i=0; i<50; i++){
        
        
        var cover = "res/img/00"+(i%4+1)+".jpg";
        // console.log(i+": "+(i%4+1) +" "+cover);
        
        html_t = " <div class=\"col-xl-2 col-lg-3 col-md-4 col-sm-6 custom-card-style\">";
        html_t += "<div class=\"card\">";
        html_t += "<div class=\"img-div\">";
        html_t += "<a href=\"#\"><img src=\""+cover+"\" class=\"card-img-top\" alt=\"error\"> </a>";
        html_t += "</div>";
        html_t += "<div class=\"card-body\">";
        html_t += "<a href=\"#\"><div class=\"card-title my-card-title\">"+title+"</div> </a>";
        html_t += "<hr>";
        html_t += "<div class=\"card-text d-flex justify-content-around\">";
        html_t += "<div>"+time+"</div><div>"+page+"</div>";
        html_t += "</div> </div> </div> </div>";
        html += html_t;
    }

    // console.log(html);
    $(".row").append(html);
}


