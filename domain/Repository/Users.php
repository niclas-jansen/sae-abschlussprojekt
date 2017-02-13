<?php
/**
 * Created by PhpStorm.
 * User: Niclas Jansen <niclas.jansen@gmail.com>
 * Date: 02/02/2017
 * Time: 04:27
 */

namespace penAndPixels\Repository;

class Users extends Database
{
//    private $username;
//    private $password;

    public function __construct($config)
    {
        parent::__construct($config);
    }

    private function hashPassword($password){
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
        return $hashedPassword;
    }
    private function verifyPassword($password, $hash)
    {
        if (password_verify($password, $hash)) {
            return true;
        } else {
            return false;
        }
    }
    public function checkUnique($type, $input){
        if (isset($type, $input) && ($type == 'username' || 'email')) {
            $sql = "SELECT id FROM users WHERE $type='$input'";
            $result = $this->sqlQuery($sql)->sqlToArray();
            if (isset($result[0])) {
                return false;
            } else {
                return true;
            }
        }
    }
    public function login($username, $password)
    {
        if (isset($username, $password)) {
            $sql = "SELECT id, username, password, userMongoDocId
                FROM users
                WHERE username = '$username'
                ";
            $result = $this->sqlQuery($sql)->sqlToArray();
            $pwd = $result[0]['password'];
            if ($this->verifyPassword($password, $result[0]['password'])){
                $_SESSION['id'] = $result[0]['id'];
                $_SESSION['username'] = $result[0]['username'];
                $_SESSION['userMongoDocId'] = $result[0]['userMongoDocId'];
                echo json_encode('loginSuccess');
            } else {
                // TODO: error handling
                // password was wrong
            }
        } else {
            //TODO: error handling
        }
    }
    public function register($username, $email, $password) {
        if (!isset($username, $email, $password)) {

        } else if (!$this->checkUnique('username', $username)) {
            $error = (object) [
                'errorType' => 'usernameTaken',
                'errorMsg' => 'Username is already taken.'
            ];
            print json_encode($error);
        } else if (!$this->checkUnique('email', $email)) {
            $error = (object) [
                'errorType' => 'emailTaken',
                'errorMsg' => 'Email is already associated with an account.'
            ];
            print json_encode($error);
        } else {
            $mongoQuery   = [
                'username' => $username,
                'games' => (object)[
                    'owned' => [], 'joined' => []
                ],
                'templates' => [],
            ];
            $mongoDb        = $this->config->mongo->db->characterSheets->dbName;
            $mongoDocument  = $this->config->mongo->db->characterSheets->collections->player;
            $mongoResult    = $this->mongoClient->$mongoDb->$mongoDocument->insertOne($mongoQuery);
            $mongoDocId     = (string)$mongoResult->getInsertedId();
            $hashedPassword = $this->hashPassword($password);
            $sql            = "INSERT INTO users (username, email, password, userMongoDocId)
                    VALUES ('$username', '$email', '$hashedPassword', '$mongoDocId')";
            if ($this->sqlQuery($sql) === TRUE) {
                echo "New record created successfully";
            } else {
//                echo "Error: " . $sql . "<br>" . $sqlConnect->error;
            }
        }
    }
    public function getGamesListFromUser()
    {
        if (isset($_SESSION['userMongoDocId']))
        {
            $mongoDocId = $_SESSION['userMongoDocId'];
            $id = new \MongoDB\BSON\ObjectID($mongoDocId);

            $mongoTarget = ['_id' => $id];
            $mongoProjection = ['projection' => ['games' => 1, '_id' => 0]];

            $mongoResult = $this->mongoUserCollection->findOne($mongoTarget, $mongoProjection);
            print json_encode($mongoResult['games']);
        }
    }
    public function getCharacterSheetFromUser($gameId) {
//        function objectToArray($obj) {
//            if(is_object($obj)) $obj = (array) $obj;
//            if(is_array($obj)) {
//                $new = array();
//                foreach($obj as $key => $val) {
//                    $new[$key] = objectToArray($val);
//                }
//            }
//            else $new = $obj;
//            return $new;
//        }
        // get game, search game->players for userid, return charactersheet data from that
        $mongoGameId = new \MongoDB\BSON\ObjectID($gameId);
        $mongoPlayerId = new \MongoDB\BSON\ObjectID($_SESSION['userMongoDocId']);

        $mongoTarget = ['_id' => $mongoGameId];
        $mongoProjection = [
            'projection' => [
                'players' => 1,
                '_id' => 0,
            ],
        ];
        $mongoGameResult = $this->mongoGamesCollection->findOne($mongoTarget, $mongoProjection)->players;
        $testVar = false;
        $playerCharacterSheet = [];
        foreach ($mongoGameResult as $player) {
            if ($player->playerId == $_SESSION['userMongoDocId']) {
                $testVar = true;
                $playerCharacterSheet = $player->characterSheet;
            }
        }

        print json_encode($playerCharacterSheet);


//        $mongoDocId = $_SESSION['userMongoDocId'];
//        $id = new \MongoDB\BSON\ObjectID($mongoDocId);
//        $mongoTarget =  ['_id' => $id];
//        $mongoProjection = ['projection' => ['games' => 1, '_id' => 0] ];
//        $mongoResult = $this->mongoUserCollection->findOne($mongoTarget, $mongoProjection);
//        foreach ($mongoResult->games as $game) {
//            if ($game->id == $gameId) {
//                $ttt = $this->objectToArray($game);
//                echo json_encode($ttt);
//            }
//        }
    }
    public function testGetGame(){
        $id = new \MongoDB\BSON\ObjectID('589692ef5572be69a71ad546');
        $mongoTarget = ['_id' => $id];
        $mongoProjection = ['projection' => ['versions' => 1, '_id' => 0] ];
        $mongoResult = $this->mongoTemplatesCollection->findOne($mongoTarget, $mongoProjection);
        $versions = (array)$mongoResult->versions;
        $length = count($mongoResult->versions);
        $lastVersion = $versions[$length - 1];
        return $lastVersion;
    }
    public function testSetGame()
    {
        $testGame = $this->testGetGame();
        $userMongoDocId = new \MongoDB\BSON\ObjectID($_SESSION['userMongoDocId']);
        $mongoTarget = ['_id' => $userMongoDocId];
        $mongoQuery = ['$push' =>
                           ['games' => [
                               'name' => 'test2017',
                               'id' => 'ads123nfalsdfkj',
                               'data' => $testGame,
                           ]]
        ];
        $mongoResult = $this->mongoUserCollection->updateOne($mongoTarget, $mongoQuery);
    }
    public function getUsers()
    {
        $sql = "SELECT username FROM users";
        $sqlResult = $this->sqlQuery($sql)->sqlToArray();
        echo json_encode($sqlResult);
    }

    public function sendFriendRequest($userInitId, $userReceiveId)
    {
        if ($userInitId < $userReceiveId) {
            $userOneId = $userInitId;
            $userTwoId = $userReceiveId;
        } else {
            $userOneId = $userReceiveId;
            $userTwoId = $userInitId;
        }

        $sql = "INSERT INTO `relationships` (`userOneId`, `userTwoId`, `status`, `actionUserId`)
        VALUES ($userOneId, $userTwoId, '0', $userInitId)";

        $sqlResult = $this->sqlQuery($sql);
    }
    public function getFriends($userId)
    {
        $sql = "
          SELECT username
          FROM relationships
          INNER JOIN users
          ON userOneId = id OR userTwoId = id
          WHERE (userOneId= $userId OR userTwoId = $userId)
          AND id != $userId";

        $sqlResult = $this->sqlQuery($sql)->sqlToArray();
        echo json_encode($sqlResult);
    }
    public function acceptFriendRequest($actionUserId, $targetUserId)
    {
        if ($actionUserId < $targetUserId) {
            $userOneId = $actionUserId;
            $userTwoId = $targetUserId;
        } else {
            $userOneId = $targetUserId;
            $userTwoId = $actionUserId;
        }
        $sql = "UPDATE relationships
                SET status= '1', actionUserId = $actionUserId
                WHERE userOneId= $userOneId AND userTwoId= $userTwoId";

        $sqlResult = $this->sqlQuery($sql);
    }
    public function getUserIdByUsername($username){
        $sql = "SELECT id FROM users WHERE username = '$username'";
        $sqlResult = $this->sqlQuery($sql)->sqlToArray();
        return $sqlResult[0]['id'];
    }

}