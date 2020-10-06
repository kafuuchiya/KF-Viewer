<?php

$name = $_POST['itemName'];
$other_name = $_POST['itemOtherName'];
$files_type = $_POST['itemFileType'];
$files = $_FILES['itemFile'];
$file_name = $_POST['itemFileName'];   // for new file name

// To connect database
require('res/php/db_con.php');

// To check if the file already exists
$sql_check = "SELECT count(*) AS count FROM items WHERE name = '" . addslashes($name);
$sql_check .= "' or other_name = '" . addslashes($name) . "'or name = '" . addslashes($other_name) . "' or other_name = '" . $other_name . "'";
$qobj_check = mysqli_query($conn, $sql_check);
$res_check = mysqli_fetch_assoc($qobj_check);

// To set default path
$d_path = "res/items/";
$file_path = $d_path . $file_name;

// To check the file if exists
if (file_exists($file_path) or $res_check['count'] > 0) {
    $msg = [
        FALSE,
        "add repeatedly!"
    ];
    mysqli_close($conn);
    echo json_encode($msg);
    return;
}


if (strcmp($files_type, "ZIP") == 0) {
    $zip = new ZipArchive();
    if ($zip->open($files["tmp_name"][0]) === true) {
        $zip->extractTo($file_path);
    } else {
        $msg = [
            FALSE,
            "unzip error:\n1. File name or path is too long"
        ];
        echo json_encode($msg);
        return;
    }
    $zip->close();

    checkFileInfo($file_path);
    $page = count($filespath);
} else {

    if (!file_exists($file_path)) {
        mkdir($file_path);
    }
    $count = count($files['tmp_name']);
    $allowSuffix = ['png', 'jpeg', 'jpg', 'gif', 'bmp'];

    for ($i = 0; $i < $count; $i++) {
        $file_name = $files['name'][$i];
        $info = pathinfo($files['name'][$i]);
        $suffix = $info['extension'];

        if (in_array($suffix, $allowSuffix)) {
            $result = move_uploaded_file($files["tmp_name"][$i], $file_path . '/' . $files["name"][$i]);
        }
    }
    $page = $count;
}

$sql = "INSERT INTO items ( name, other_name, file_location, page ) VALUES ";
$sql = $sql . "('" . addslashes($name) . "', '" . addslashes($other_name) . "', '" . addslashes($file_path) . "', '" . $page . "')";
$qobj = mysqli_query($conn, $sql);

if (mysqli_insert_id($conn)) {
    $msg = [
        TRUE,
        "success!"
    ];
} else {
    $msg = [
        FALSE,
        "failed!"
    ];
}


mysqli_close($conn);

echo json_encode($msg);


function checkFileInfo($dir)
{

    // Subfile array
    global $filespath;
    $filespath = array();
    // To get file information and move the file to the root directory (if the file is located in subfile)
    getAllFilesInfo($dir, $filespath);

    // To delete empty files
    delEmptyFiles($dir);

    // To check the zip file if empty
    if (count($filespath) == 0) { // "." and "..", so = 2
        $msg = [
            FALSE,
            "Error, empty files!"
        ];
        delAllFiles($dir);
        rmdir($dir);
        echo json_encode($msg);
        exit();
    }

    // To check whether the file suffix is ​​a picture type
    $allowSuffix = ['png', 'jpeg', 'jpg', 'gif', 'bmp'];
    for ($i = 0; $i < count($filespath); $i++) {
        $info = pathinfo($filespath[$i]);
        $suffix = $info['extension'];
        if (!in_array($suffix, $allowSuffix)) {

            $msg = [
                FALSE,
                "Error, non-image file! " . $info['basename']
            ];
            delAllFiles($dir);
            rmdir($dir);

            echo json_encode($msg);
            exit();
        }
    }
}

function getAllFilesInfo($dir, &$filespath)
{

    // To check if it is a directory
    if (is_dir($dir)) {

        // To get a directory instance
        $dp = dir($dir);
        // To find the subfiles
        while ($file = $dp->read()) {
            if ($file != "." && $file != "..") {
                // To use recursive function processing subfile
                getAllFilesInfo($dir . "/" . $file, $filespath);
            }
        }
        $dp->close();
    }

    // To check if it is a file
    if (is_file($dir)) {
        global $file_path;

        if (strcmp("desktop.ini", pathinfo($dir)['basename'])==0){
            unlink($dir);
            return;
        }
        
        // add file to arr
        $filespath[] = $dir;

        // To check if it is in $file_path, if not, move it
        if (strcmp($file_path, pathinfo($dir)['dirname']) != 0) {

            copy($dir, $file_path . "/" . pathinfo($dir)['basename']);
            unlink($dir);
        }
    }
}

// To delete all files
function delAllFiles($dir)
{

    if (is_dir($dir)) {

        $files_arr = scandir($dir);
        foreach ($files_arr as $file_t) {
            if ($file_t != "." && $file_t != "..") {

                if (is_dir($dir . '/' . $file_t)) {
                    delAllFiles($dir . '/' . $file_t);
                    rmdir($dir . '/' . $file_t);
                } else {
                    unlink($dir . '/' . $file_t);
                }
            }
        }
    }

    if (is_file($dir)) {
        unlink($dir);
    }
}

// To delete the empty files
function delEmptyFiles($dir)
{
    if (is_dir($dir) && ($handle = opendir($dir)) !== false) {
        while (($file = readdir($handle)) !== false) {
            if ($file != '.' && $file != '..') {
                $curfile = $dir . '/' . $file;          // Current directory
                if (is_dir($curfile)) {                // directory
                    delEmptyFiles($curfile);          // if is directory then call traverse function
                    if (count(scandir($curfile)) == 2) { // empty directory has '.' and '..', so eq to 2
                        rmdir($curfile);             // delete directory
                    }
                }
            }
        }
        closedir($handle);
    }
}
