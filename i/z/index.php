<?php

if (empty($_GET["id"]) || empty($_GET["p"])) {
    header('content-type:text/html;charset=uft-8');
    header('location:/KF-Viewer/');
} else {
    $id = $_GET["id"];
    $page = intval($_GET["p"]);
}

require('../../res/php/db_con.php');

$sql = "SELECT name, file_location FROM items WHERE id=$id";
$qobj = mysqli_query($conn, $sql);
$res = mysqli_fetch_assoc($qobj);

$name = $res['name'];
$dir = '../../' . $res["file_location"];

$files_arr = scandir($dir);

// To remove "." and ".."
while ($files_arr[0]=="." || $files_arr[0]==".."){
    array_shift($files_arr);
};

// file info
$f_name = $files_arr[$page-1];
$f_path = $dir . '/' . $f_name;
$f_size = round(filesize($f_path) / 1024, 1);

// img info
$img_info = getimagesize($f_path);
$img_with = $img_info[0];
$img_height = $img_info[1];

// solve the issues of picture is too big
if ($img_with >= 1300) {
    $s_w = 1280;
    $s_h = $s_w / $img_with * $img_height;
} else {
    $s_w = $img_with;
    $s_h = $img_height;
}

// page offset
$page_offset = 36;

mysqli_close($conn);


?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <!-- <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1"> -->

    <title>Kafuu Viewer</title>

    <!-- jQuery -->
    <script text="text/javascript" src="..\..\res\js\jquery-3.5.1.js"></script>

    <!-- bootstrap -->
    <link rel="stylesheet" type="text/css" href="..\..\res\css\bootstrap.css">
    <script text="text/javascript" src="..\..\res\js\bootstrap.bundle.js"></script>

    <!-- front page CSS -->
    <!-- <link rel="stylesheet" type="text/css" href="../../index.css"> -->

    <!-- My JS, CSS -->
    <!-- <script text="text/javascript" src="z.js"></script> -->
    <link rel="stylesheet" type="text/css" href="z.css">

    <!-- web icon -->
    <link rel="icon" href="../../res/img/KFV icon.png">

</head>

<body >
    <div class="m-bg " style="width:<?= $s_w+20 ?>px">
        <!-- item title -->
        <h1><?= $name ?></h1>

        <!-- Top Pagination -->
        <div class="pStyle">
            <a href="../z/?id=<?= $id ?>&p=1">
                <img src="../../res/img/angle-double-left-solid.svg" alt=""></a>
            <a href="../z/?id=<?= $id ?>&p=<?= ($page - 1) < 1 ? 1 : ($page - 1) ?>">
                <img src="../../res/img/angle-left-solid.svg" alt=""></a>
            <div><span><?= $page ?></span>/<span><?= count($files_arr) ?></span></div>
            <a href="../z/?id=<?= $id ?>&p=<?= ($page + 1) > count($files_arr) ? count($files_arr) : ($page + 1) ?>">
                <img src="../../res/img/angle-right-solid.svg" alt=""></a>
            <a href="../z/?id=<?= $id ?>&p=<?= count($files_arr) ?>">
                <img src="../../res/img/angle-double-right-solid.svg" alt=""></a>
        </div>

        <!-- img info top -->
        <div><?= $f_name ?> :: <?= $img_with ?> x <?= $img_height ?> :: <?= $f_size ?> KB</div>

        <!-- img show -->
        <div>
            <a href="../z/?id=<?= $id ?>&p=<?= ($page + 1) > count($files_arr) ? count($files_arr) : ($page + 1) ?>">
                <img src="<?= $f_path ?>" style="height: <?= $s_h ?>px; width: <?= $s_w ?>px; 
                max-width: <?= $s_w ?>px; max-height: <?= $s_h ?>px;" alt="">
            </a>
        </div>

        <!-- img info bottom -->
        <div><?= $f_name ?> :: <?= $img_with ?> x <?= $img_height ?> :: <?= $f_size ?> KB</div>

        <!-- Bottom Pagination -->
        <div class="pStyle">
            <a href="../z/?id=<?= $id ?>&p=1">
                <img src="../../res/img/angle-double-left-solid.svg" alt=""></a>
            <a href="../z/?id=<?= $id ?>&p=<?= ($page - 1) < 1 ? 1 : ($page - 1) ?>">
                <img src="../../res/img/angle-left-solid.svg" alt=""></a>
            <div><span><?= $page ?></span>/<span><?= count($files_arr) ?></span></div>
            <a href="../z/?id=<?= $id ?>&p=<?= ($page + 1) > count($files_arr) ? count($files_arr) : ($page + 1) ?>">
                <img src="../../res/img/angle-right-solid.svg" alt=""></a>
            <a href="../z/?id=<?= $id ?>&p=<?= count($files_arr) ?>">
                <img src="../../res/img/angle-double-right-solid.svg" alt=""></a>
        </div>

        <!-- back to item page -->
        <div class="biStyle">
            <a
                href="../?id=<?= $id ?><?= floor($page / $page_offset) == 0 ? "" : "&p=" . (ceil($page / $page_offset) ) ?>">
                <img src="../../res/img/angle-down-solid.svg" alt="">
            </a>
        </div>


    </div>

    <!-- back to home page -->
    <p class="bhStyle" style="width:<?= $s_w+20 ?>px">[<a href="/KF-Viewer/">Front Page</a>]</p>
</body>

</html>