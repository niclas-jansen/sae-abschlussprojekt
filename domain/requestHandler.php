<?php
$u_requestType;
$u_requestData;

if (isset($_POST["requestType"])){
    $requestType = $_POST["requestType"];
}
if (isset($_POST["requestData"])) {
    $requestData = json_decode($_POST["requestData"]);
}

if (!isset($requestType)) {
    throw new Exception('ajax request was missing requestType identifier');
} else {
    switch($requestType) {
        case 'login':
            if (!isset($requestData)) {
                throw new Exception('ajax request was missing requestData');
            } else {
                $u_username = (isset($requestData->username))
                    ? $requestData->username
                    : NULL;
                $u_password = (isset($requestData->password))
                    ? $requestData->password
                    : NULL;
                if (isset($u_username) && isset($u_password)) {
                    $login = new \penAndPixels\Repository\Users($config);
                    $login->login($u_username, $u_password);
                }
            }
            break;
        case 'register':
            if (!isset($requestData)) {
                throw new Exception('ajax request was missing requestData');
            } else {
                $u_username = (isset($requestData->username))
                    ? $requestData->username
                    : NULL;
                $u_email = (isset($requestData->email))
                    ? $requestData->email
                    : NULL;
                $u_password = (isset($requestData->password))
                    ? $requestData->password
                    : NULL;

                if (isset($u_username) && isset($u_email) && isset($u_password)) {
                    $register = new \penAndPixels\Repository\Users($config);
                    $register->register($u_username, $u_email, $u_password);
                }
            }
            break;
        case 'getGamesListFromUser':
            $users = new \penAndPixels\Repository\Users($config);
            $users->getGamesListFromUser();
            break;
        case 'getCharacterSheetFromUser' :
            if (!isset($requestData)) {

            } else {
                if (!isset($requestData->id)) {

                } else {
                    $id = $requestData->id;
                    $users = new \penAndPixels\Repository\Users($config);
                    $users->getCharacterSheetFromUser($id);
                }
            }
            break;
        case 'createGame':
            if (!isset($requestData, $_SESSION['userMongoDocId'])) {

            } else {
                if (!isset($requestData->gameName, $requestData->templateId)) {

                } else {
                    $cs = new \penAndPixels\Repository\CharacterSheets($config);

                    $cs->createGame($requestData->gameName, $_SESSION['userMongoDocId'], $requestData->templateId);
                }
            }
            break;
        case 'createTemplate':
            if (!isset($requestData)) {
                throw new Exception('ajax request was missing requestData');
            } else {
                $description = 'huehuehue';
                $s_templateData = $requestData;
                $templateData = json_decode($requestData);
                $characterSheets = new \penAndPixels\Repository\CharacterSheets($config);
                $characterSheets->createCharacterSheetTemplate($requestData, $description);
            }
            break;
        case 'searchTemplates':
            $characterSheets = new \penAndPixels\Repository\CharacterSheets($config);
            $characterSheets->getPublicTemplates($requestData);
            break;
        case 'getFriends':
            $users = new \penAndPixels\Repository\Users($config);
            $users->getFriends($_SESSION['id']);
            break;
        case 'getGamePlayers':
            $characterSheets = new \penAndPixels\Repository\CharacterSheets($config);
            $characterSheets->getPlayers($requestData->gameId);
            break;
        default:
            throw new Exception('bad ajax request type');
    }
}