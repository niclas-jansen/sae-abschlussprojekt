<?php
session_start();
//session_destroy();
//unset($_SESSION);
//require_once 'vendor/autoload.php';
//$test = new \penAndPixels\Repository\Database($config);
//$test = new \penAndPixels\Repository\Users($config);
//$description = 'hello world';
//$object = (object) array(
//    "metadata" => 'i am new yo',
//    "elements" => array(
//        'element1',
//        'element2'
//    )
//);
//$objectx = json_encode($object);
//$testTemplate = new \penAndPixels\Repository\charactersheets($config);
//$testTemplate->updateCharacterSheetTemplate($object);
//$gameId = '12329u121k3jl';
//$test = new \penAndPixels\Repository\Users($config);
//$test->testSetGame();

//$templateData =
//$test = new \penAndPixels\Repository\CharacterSheets($config);
//$test->createGame('lets hope for the best', '5897fb335572be68853e2f2a', '0.3.2a');
//$test->createCharacterSheetTemplate('is it now ok?', $object, 'axaxaxax', '0.3.2a');
//$test->joinGame('5897fb765572be69a832870a');
 if (isset($_POST) && !empty($_POST)) {
    require 'requestHandler.php';
 } else {
//     require 'ulrHandler.php';
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


