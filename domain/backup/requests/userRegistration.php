<?php
$username = (isset($requestData->username))
    ? $requestData->username
    : NULL;
$email = (isset($requestData->email))
    ? $requestData->email
    : NULL;
$password = (isset($requestData->password))
    ? $requestData->password
    : NULL;

if (isset($username) && isset($email) && isset($password)) {
    register($username, $email, $password);
}
function register($username, $email, $password){
    // TODO: check if username or email is already taken
    $mongoClient = new MongoDB\Client('mongodb://localhost:27017');
    $collection = $mongoClient->charactersheets->csPlayer;
    $mongoInsertData = array('username' => $username);
    $mongoResult = $collection->insertOne($mongoInsertData);
    $mongoDocId = (string)$mongoResult->getInsertedId();

    require ROOT_PATH . '/dbConnections/mySql.php';
    $sqlConnect = mysqli_connect($sqlHost, $sqlUser, $sqlPwd, $sqlDb);
    $sqlTable = 'users';
    $sql = "INSERT INTO $sqlTable (username, email, password, mongoDocId) VALUES ('$username', '$email', '$password', '$mongoDocId')";

    if ($sqlConnect->query($sql) === TRUE) {
        echo "New record created successfully";
    } else {
        echo "Error: " . $sql . "<br>" . $sqlConnect->error;
    }
};