<?php

if (empty($_GET['id'])){
    return false;
    exit();
}


$id = $_GET['id'];


require('../res/php/db_con.php');


$sql_1 = "SELECT * FROM items WHERE id = $id";
$qobj_1 = mysqli_query( $conn, $sql_1 );
$res = mysqli_fetch_assoc($qobj_1);

// remove special symbols from values
$name = str_replace("\r\n", "", $res['name']);
$other_name = str_replace("\r\n", "", $res['other_name']);
$file_path = str_replace("\r\n", "", $res['file_location']);


if ((int)$res['id'] == $id ){
    if (!file_exists("log/")){
        mkdir("log/");
    }

    $file = "log/delete log.txt";

    if (is_file($file)) {
        $delRecordFile = fopen($file, "r+") or die("Unable to open file!");
        
    }else{
        // For learning purposes, use "w"
        $delRecordFile = fopen($file, "w") or die("Unable to open file!");
    }

    $old_contents = file_get_contents($file);

    $contents = "Time: ".strval(date('Y-m-d H:i:s', strtotime("+9 hours")))."\n";
    $contents = $contents . "Id: $id\n";
    $contents = $contents . "Name: $name\n";
    $contents = $contents . "Other Name: $other_name\n";
    $contents = $contents . "File Path: $file_path\n\n" . $old_contents;
}


$sql = "DELETE FROM items WHERE id = $id ";

$qobj = mysqli_query( $conn, $sql );


if (mysqli_affected_rows($conn)>0){
    fwrite($delRecordFile, $contents);
    fclose($delRecordFile);
    $msg = true;
}else{
    fclose($delRecordFile);
    $msg = false;
    return $msg;
}

$recycle_folder = "../res/recycle bin";

if (!file_exists($recycle_folder)){
    mkdir($recycle_folder);
}

rename("../".$file_path, $recycle_folder.'/'.pathinfo($file_path)['basename']);


echo $msg;
mysqli_close( $conn );

