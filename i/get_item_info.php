<?php

// check id
if (empty($_GET['id'])) {
    return;
} else {
    $id = intval($_GET['id']);
}

require('../res/php/db_con.php');

$sql = "SELECT file_location FROM items WHERE id = $id";

$qobj = mysqli_query($conn, $sql);
$res = mysqli_fetch_assoc($qobj);

// directory
$dir = '../' . $res["file_location"];

// Get all files name in the target directory (excluding files in subdirectories)
$handler = opendir($dir);

$files = [];
$files_size = 0;
while (($filename = readdir($handler)) !== false) { // check if the file is empty, "!==" is must.
    if ($filename != "." && $filename != "..") { // Exclude "." And ".." files
        if (strstr($filename, 'jpg') || strstr($filename, 'jpeg') || strstr($filename, 'png')) {
            $files[] = $dir . '/' . $filename;
            $files_size += filesize($dir . "/" . $filename);

        }
    }
}

closedir($handler);

$sql_ = "SELECT * FROM items WHERE id=$id";
$qobj_ = mysqli_query($conn, $sql_);
$res_ = mysqli_fetch_assoc($qobj_);
$data_arr = [
    'name' => $res_['name'],
    'other_name' => $res_['other_name'],
    'time' => $res_['time'],
    'files_size' => round($files_size/1024/1024, 2),
];


$data = [$data_arr, $files];

echo json_encode($data, JSON_UNESCAPED_UNICODE);

mysqli_close($conn);