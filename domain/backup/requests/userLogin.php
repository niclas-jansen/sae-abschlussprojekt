<?php

$username = (isset($requestData->username))
    ? $requestData->username
    : NULL;
$password = (isset($requestData->password))
    ? $requestData->password
    : NULL;
if (isset($username) && isset($password)) {

}
userLogin($username, $password);
function userLogin($username, $password) {
    require ROOT_PATH . '/dbConnections/mySql.php';
    $mysqli = mysqli_connect($sqlHost, $sqlUser, $sqlPwd, $sqlDb);
    $sqlQuery = "
            SELECT id, username, password
            FROM users
            WHERE username = '$username'
            AND password = '$password'
            ";
    $sqlResult = $mysqli->query($sqlQuery);
    if (!$mysqli->error) {
        // TODO: correct error handling
    }
    $row = $sqlResult->fetch_assoc();
    $_SESSION['id'] = $row["id"];
    $_SESSION['username'] = $row["username"];
    $_SESSION['password'] = $row["password"];
    $response = [
        'location' => 'userPage.html'
    ];
    echo json_encode($response);
}