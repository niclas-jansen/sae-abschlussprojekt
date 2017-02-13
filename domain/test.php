<?php
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
//$test->createGame('default version test', '5897fb335572be68853e2f2a');
//$test->createCharacterSheetTemplate('is it now ok?', $object, 'axaxaxax', '0.3.2a');
//$test->joinGame('5897fb765572be69a832870a');
//$test->getPublicTemplates();
//$cs = new \penAndPixels\Repository\CharacterSheets($config);
//$cs->createCharacterSheetTemplate('darioTemplate', json_decode($object), 'testTemplate', '1');

//$cs->createGame('bestGame', '5898fa505572be7ff13c44f3', "1");
//$cs->joinGame('589bf7325572be09743c8b56');
//
//$users = new \penAndPixels\Repository\Users($config);
//$users->getCharacterSheetFromUser('5897fb765572be69a832870a');
//$users->getUsers();


//$cs = new \penAndPixels\Repository\CharacterSheets($config);
//$cs->getPublicTemplates('', 4);
//print (new MongoDB\BSON\UTCDatetime())->toDateTime()->format('U.u');


//$user = new \penAndPixels\Repository\Users($config);
//$user->getGamesListFromUser();
//$user->sendFriendRequest(13, 14);
//$user2 = $user->getUserIdByUsername('class2');
//$user->acceptFriendRequest(14, 13);
//$user->getFriends(13);
//$cs = new \penAndPixels\Repository\CharacterSheets($config);
//$cs->joinGame('589bfea35572be092f29611d');
//$cs = new \penAndPixels\Repository\CharacterSheets($config);
//$cs->getPlayers('589bf7325572be09743c8b56');
//$db = new \penAndPixels\Repository\Database($config);
//$db->clearGamesCollection();
$cs = new \penAndPixels\Repository\CharacterSheets($config);
$cs->joinGame($_SESSION['userMongoDocId'], '589dd9a95572be092f296121', 'player');
//$users = new \penAndPixels\Repository\Users($config);
//$users->getCharacterSheetFromUser('589dd9a95572be092f296121');
