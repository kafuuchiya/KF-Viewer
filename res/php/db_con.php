<?php

// Database connection setting

// 1:
// set the database info
$dbhost = 'localhost';
$username = 'root';
$password = '';
$dbname = 'kf-viewer';
$charset = 'utf8';

// 2:
// connect the database
$conn = mysqli_connect( $dbhost, $username, $password );
if ( !$conn ) {
    // exit( 'database connection error!' );
    // echo '<script>console.log("Database connection failed!");</script>';
} else {
    // echo '<script>console.log("Database connection successful!");</script>';
}

// 3:
// set the charset
mysqli_set_charset( $conn, $charset );

// 4:
// select the database
mysqli_select_db( $conn, $dbname );

?>