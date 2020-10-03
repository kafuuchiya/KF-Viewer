<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1">


    <title>Kafuu Viewer</title>

    <!-- jQuery -->
    <script text="text/javascript" src="..\res\js\jquery-3.5.1.js"></script>

    <!-- bootstrap -->
    <link rel="stylesheet" type="text/css" href="..\res\css\bootstrap.css">
    <script text="text/javascript" src="..\res\js\bootstrap.bundle.js"></script>

    <!-- front page CSS -->
    <link rel="stylesheet" type="text/css" href="../index.css">

    <!-- My JS, CSS -->
    <script text="text/javascript" src="backend.js"></script>
    <link rel="stylesheet" type="text/css" href="backend.css">

    <!-- web icon -->
    <link rel="icon" href="../res/img/KFV icon.png">


</head>

<body>
    <!-- navigation bar -->
    <nav class="navbar navbar-dark navbar-expand-lg navbar-light bg-dark">
        <a class="navbar-brand" href="/kf-viewer/">
            <img src="../res/img/KFV icon.png" width="30" height="30" class="d-inline-block align-top" alt="">
            KF-Viewer
        </a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup"
            aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
            <div class="navbar-nav mr-auto">
                <a class="nav-item nav-link " href="/kf-viewer/">Front Page</a>
                <a class="nav-item nav-link" href="javascript:void(0);">Videos(Undeveloped)</a>
                <a class="nav-item nav-link active" href="/kf-viewer/backend/">Backend<span
                        class="sr-only">(current)</span></a>
            </div>
            <form onsubmit="return false" id="searchForm" class="form-inline my-2 my-lg-0">
                <input id="f_search" name="f_search" class="form-control mr-sm-2" type="search"
                    placeholder="Search Keywords" aria-label="Search">
                <button class="btn btn-outline-info my-2 my-sm-0" type="submit" onclick="searchFunc()">Search</button>
            </form>
        </div>

    </nav>

    <div class="topBar_H"></div>

    <table class="topBar">
        <tr>
            <th>ID</th>
            <th>NAME</th>
            <th>OTHER NAME</th>
            <th>PATH</th>
            <th>PAGE</th>
            <th>TIME</th>
            <th colspan="2">OPERATION</th>
        </tr>
    </table>

    <table>
        <thead>
            <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>OTHER NAME</th>
                <th>PATH</th>
                <th>PAGE</th>
                <th>TIME</th>
                <th colspan="2">OPERATION</th>
            </tr>
        </thead>
        <tbody>

            <?php
            require('../res/php/db_con.php');

            $condition = "";

            if (!empty($_GET['search'])){

                if( strcmp($_GET['search'], ",") > 0 ) {
                    $arr = explode(",", $_GET['search']);
                    $condition = " WHERE ";
                    foreach ($arr as $key => $value) {
                        $condition = $condition . "(name LIKE '%".addslashes($value)."%' or other_name LIKE '%".addslashes($value)."%')";
                        if ($key != (count($arr) - 1)) {
                            $condition =  $condition . " and ";
                        }
                    }
                    
                }
            }
            
            $sql = 'SELECT * FROM items' .$condition. ' ORDER BY id DESC';
            $qobj = mysqli_query($conn, $sql);

            while ($row = mysqli_fetch_array($qobj)) {

                echo '<tr>';
                echo '<td>' . $row['id'] . '</td>';
                echo '<td>' . $row['name'] . '</td>';
                echo '<td>' . $row['other_name'] . '</td>';
                if (empty($row['file_location']) == 0) {
                    echo '<td>Yes<div style="display: none;">' . $row['file_location'] . '</div></td>';
                } else {
                    echo '<td style="background: darkslategrey; color: red;">No</td>';
                }
                echo '<td>' . $row['page'] . '</td>';
                echo '<td style="white-space: nowrap;">' . substr($row['time'], 0, 16) . '</td>';
                echo '<td><a href="#" data-value="' . $row['id'] . '" data-toggle="modal" data-target="#exampleModal" onclick="delFunc(this)">Delete</a></td>';
                echo '<td><a href="#" data-value="' . $row['id'] . '" data-toggle="modal" data-target="#exampleModal" onclick="editFunc(this)">Modify</a></td>';
                echo '</tr>';
            }
            mysqli_close($conn);
            ?>

        </tbody>
    </table>

    <!-- Modal -->
    <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
        aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">DELECT BOOK</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div id="del_div" style="display: none;">
                        do you want to delete the book by the id:
                        <h5 id="delItemId"></h5>
                    </div>


                    <div id="modify_div" style="display: none;">
                        <div class="input-group input-group-sm mb-3">
                            <div class="input-group-prepend">
                                <span class="input-group-text" id="inputGroup-sizing-sm">Id</span>
                            </div>
                            <input id="itemId" type="text" class="form-control" aria-label="Sizing example input"
                                aria-describedby="inputGroup-sizing-sm" required readonly>

                            <div class="input-group-prepend" style="margin-left: 8px;">
                                <span class="input-group-text" id="inputGroup-sizing-sm">Page</span>
                            </div>
                            <input id="itemPage" type="text" class="form-control" aria-label="Sizing example input"
                                aria-describedby="inputGroup-sizing-sm" required>
                        </div>
                        <div class="input-group input-group-sm mb-3">
                            <div class="input-group-prepend">
                                <span class="input-group-text" id="inputGroup-sizing-sm">Name</span>
                            </div>
                            <input id="itemName" type="text" class="form-control" aria-label="Sizing example input"
                                aria-describedby="inputGroup-sizing-sm" required>
                        </div>

                        <div class="input-group input-group-sm mb-3">
                            <div class="input-group-prepend">
                                <span class="input-group-text" id="inputGroup-sizing-sm">Other Name</span>
                            </div>
                            <input id="itemOtherName" type="text" class="form-control" aria-label="Sizing example input"
                                aria-describedby="inputGroup-sizing-sm" required>
                        </div>

                        <div class="input-group input-group-sm mb-3">
                            <div class="input-group-prepend">
                                <span class="input-group-text" id="inputGroup-sizing-sm">Path</span>
                            </div>
                            <input id="itemPath" type="text" class="form-control" aria-label="Sizing example input"
                                aria-describedby="inputGroup-sizing-sm" required>
                        </div>

                    </div>
                </div>
                <div class="modal-footer">
                    <button id="btn_sub" type="button" class="btn btn-primary">Yes</button>
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">No</button>
                </div>
            </div>
        </div>
    </div>
</body>

</html>