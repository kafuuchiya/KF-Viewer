<?php

if (empty($_GET['id']) 
or empty($_GET['name']) 
or empty($_GET['other_name']) 
or empty($_GET['file_location']) 
or empty($_GET['page'])) {
    echo "Please do not leave blank.";
    return;
}


require('../res/php/db_con.php');

$id = $_GET['id'];
$name = $_GET['name'];
$other_name = $_GET['other_name'];
$file_location = $_GET['file_location'];
$page = $_GET['page'];

$sql = "UPDATE items SET name=\"".addslashes($name)."\", other_name='".addslashes($other_name);
$sql = $sql . "', file_location='".addslashes($file_location)."', page=$page WHERE id = $id";

$qobj = mysqli_query($conn, $sql);

if (mysqli_affected_rows($conn)==1){
    // The update is successful and the data has been updated, will be 1.
    $msg = "Record modification completed.";

}else if (mysqli_affected_rows($conn)==0){
    // The update was successful, but no data was updated, will be 0.
    $msg = "No change in data.";

}else{
    // update error
    $msg = "Record modification failed.";
}

echo $msg;
mysqli_close($conn);