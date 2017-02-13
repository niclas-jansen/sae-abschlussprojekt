<?php
session_start();

 if (isset($_POST) && !empty($_POST)) {
    require 'requestHandler.php';
 } else {
     require 'urlHandler.php';
 }

//$test->register('test12','lolaa','pass');

//$lol = $test->checkUnique('email', 'test@emfail.com');
//if ($lol === true) {
//    print 'is unique';
//} else {
//    print 'is not unique';
//}
//print_r($test->login('testUser', '1234'));
//print_r($test->login($username, $password));
//var_dump($test->sqlQuery($sqlQuery));

//var_dump($config->sql->host);

// check url
// -> do stuff with url


