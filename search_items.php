<?php

if (empty($_GET['key_word'])) {
    $msg = [
        FALSE,
        "null values!"
    ];
    echo json_encode($msg);
    return;
}


$keyWord = $_GET['key_word'];

require('res/php/db_con.php');

$sql = "FROM `items` WHERE ";

if (is_array($keyWord)) {
    foreach ($keyWord as $key => $value) {
        $sql = $sql . "(name LIKE '%".addslashes($value)."%' or other_name LIKE '%".addslashes($value)."%')";
        if ($key != (count($keyWord) - 1)) {
            $sql =  $sql . " and ";
        }
    }
} else {
    $sql = $sql . "name LIKE '%".addslashes($keyWord)."%' or other_name LIKE '%".addslashes($keyWord)."%'";
}


// ===  ===  ===  ===  === pagination ===  ===  ===  ===  ===

// set the page number of now
$pg_num = empty($_GET['page']) ? 1 : intval($_GET['page']);

$sql_1 = "SELECT COUNT(*) AS count " . $sql;
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
// var_dump($pt_arr);

// ===  ===  ===  ===  === pagination end ===  ===  ===  ===  ===

$sql_2 = "SELECT * " . $sql . " ORDER BY id DESC LIMIT $pg_offset, $dp_num";

$qobj = mysqli_query($conn, $sql_2);
$data_arr = array();
while ($row = mysqli_fetch_array($qobj)) {
    $data_arr[] = [
        "id" => $row["id"],
        "name" => $row["name"],
        "other_name" => $row["other_name"],
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