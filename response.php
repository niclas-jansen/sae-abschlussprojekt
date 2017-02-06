<?php
function login($username, $password) {
    require 'dbConnections/mySql.php';
    $mysqli = mysqli_connect($sqlHost, $sqlUser, $sqlPwd, $sqlDb);
    $sqlQuery = "
            SELECT id, username, password
            FROM users
            WHERE username = '$username'
            AND password = '$password'
            ";
    $sqlResult = $mysqli->query($sqlQuery);
    $row = $sqlResult->fetch_assoc();
    $_SESSION['id'] = $row["id"];
    $_SESSION['username'] = $row["username"];
    $_SESSION['password'] = $row["password"];

    $testDebut = true;
}

function register($username, $email, $password){
    $mongoClient = new MongoDB\Client('mongodb://localhost:27017');
    $collection = $mongoClient->charactersheets->csPlayer;
    $mongoInsertData = array('username' => $username);
    $mongoResult = $collection->insertOne($mongoInsertData);
    $mongoDocId = (string)$mongoResult->getInsertedId();

    require 'dbConnections/mySql.php';
    $sqlConnect = mysqli_connect($sqlHost, $sqlUser, $sqlPwd, $sqlDb);
    $sqlTable = 'users';
    $sql = "INSERT INTO $sqlTable (username, email, password, mongoDocId) VALUES ('$username', '$email', '$password', '$mongoDocId')";

    if ($sqlConnect->query($sql) === TRUE) {
        echo "New record created successfully";
    } else {
        echo "Error: " . $sql . "<br>" . $sqlConnect->error;
    }
    $debuttest = true;
    $debuttest2 = true;
};

//require 'vendor/autoload.php';
//if (isset($_POST) && !empty($_POST)) {
//    if (isset($_POST["type"])){
//        $requestType = $_POST["type"];
//    }
//    if (isset($_POST["data"])){
//        $data = json_decode($_POST["data"]);
//    }
////    echo 'data received';
//} else {
//    header('Location: /app/index.html');
//    die();
//}
//
//if (isset($requestType)) {
//    require 'dbConnections/mySql.php';
//    if ($requestType == 'login') {
//        require 'dbConnections/mySql.php';
////        $sqlDb = 'saeap';
//        $username = $data->username;
//        $pwd = $data->password;
//        $mysqli = mysqli_connect($sqlHost, $sqlUser, $sqlPwd, $sqlDb);
//        $res = mysqli_query($mysqli, "
//            SELECT id
//            FROM users
//            WHERE username = '$username'
//            AND password = '$pwd'
//            "
//        );
//        $row = mysqli_fetch_assoc($res);
////        echo json_encode($row);
//
//        $mongoClient = new MongoDB\Client('mongodb://localhost:27017');
//        $collection = $mongoClient->charactersheets->csPlayer;
//        $insertData = array('name' => 'hello', 'test' => 'test');
//        $insertResult = $collection->insertOne($insertData);
//        $id = (string)$insertResult->getInsertedId();
//        echo $id;
//    }
//}