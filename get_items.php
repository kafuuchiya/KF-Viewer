<?php

// To connect database
require('res/php/db_con.php');

// ===  ===  ===  ===  === pagination ===  ===  ===  ===  ===

// set the page number of now
$pg_num = empty($_GET['page']) ? 1 : intval($_GET['page']);


// the number of data or data length
$sql_1 = 'SELECT COUNT(*) AS count from items';
$qobj_1 = mysqli_query($conn, $sql_1);
$res_1 = mysqli_fetch_assoc($qobj_1);
$data_length = $res_1['count'];


// the number of displayed per page
$dp_num = 30;


// the number of total page
$pg_count = ceil($data_length / $dp_num);


// check the pre page and next page
if (($pg_num - 1) < 1) {
    $pg_num = 1;
}
if (($pg_num + 1) > $pg_count && $pg_count != 0) {
    $pg_num = $pg_count;
}


// the number of page offset
$pg_offset = ($pg_num - 1) * $dp_num;


$pt_arr = [
    'now_page' => $pg_num,
    'data_len' => $data_length,
    'page_count' => $pg_count,
];

// ===  ===  ===  ===  === pagination end ===  ===  ===  ===  ===

$sql = "SELECT * FROM items ORDER BY id DESC LIMIT $pg_offset, $dp_num";

$qobj = mysqli_query($conn, $sql);
$data_arr = array();
while ($row = mysqli_fetch_array($qobj)) {

    $data_arr[] = [
        "id" => $row["id"],
        "name" => $row["name"],
        "other_name" => $row["other_name"],
        // "file_loc" => $row["file_location"],
        "cover" => getCover($row["file_location"]),
        "page" => $row["page"],
        "time" => $row["time"]
    ];
}

function getCover($dir)
{
    $files = scandir($dir);
    return $dir . '/' . $files[2]; // because [0] = "." [1] = ".."
}


$tmp_arr = [$pt_arr, $data_arr];

echo json_encode($tmp_arr, JSON_UNESCAPED_UNICODE);

mysqli_close($conn);
