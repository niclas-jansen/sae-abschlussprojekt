<?php
/**
 * Created by PhpStorm.
 * User: Niclas Jansen <niclas.jansen@gmail.com>
 * Date: 03/02/2017
 * Time: 14:31
 */

namespace penAndPixels\Repository;


class CharacterSheets extends Database
{
    public function __construct($config)
    {
        parent::__construct($config);
    }
    public function createCharacterSheetTemplate($templateName, $templateData, $templateDescription, $templateVersionName) {
        // insert new character sheet into csTemplate
        $timestamp = new \MongoDB\BSON\UTCDatetime();
        $author = $_SESSION['userMongoDocId'];
//        $csObject = json_decode($templateData);

        $mongoQuery = [
            'name'           => $templateName,
            'author'         => $author,
            'creationDate'   => $timestamp,
            'lastEdit'       => $timestamp,
            'description'    => $templateDescription,
            'versions'       => [
                [
                    'versionName'       => $templateVersionName,
                    'data'              => $templateData,
                ]
            ],
        ];

        $mongoResult = $this->mongoTemplatesCollection->insertOne($mongoQuery);
        $mongoTemplateDocId = (string)$mongoResult->getInsertedId();

        // save the id of the created document into the corresponding user document
        $mongoDocId = $_SESSION['userMongoDocId'];
        $id = new \MongoDB\BSON\ObjectID($mongoDocId);
        $mongoTarget = ['_id' => $id];
        $mongoQuery = ['$push' => ['templates' => $mongoTemplateDocId] ];

        $mongoResult = $this->mongoUserCollection->updateOne($mongoTarget, $mongoQuery);
    }
    public function updateCharacterSheetTemplate($csData) {
        $csTemplateDocId = new \MongoDB\BSON\ObjectID($_SESSION['csTemplateEditDocId']);
        $timestamp = new \MongoDB\BSON\UTCDatetime();
        $csObject = $csData;
        $mongoTarget = ['_id' => $csTemplateDocId];
        $mongoQuery = ['$set' => ['lastEdit' => $timestamp], '$push' => ['versions' => $csObject] ];

        $mongoResult = $this->mongoTemplatesCollection->updateOne($mongoTarget, $mongoQuery);
    }

    /**
     * @param      $gameName
     * @param      $owner
     * @param      $templateId
     * @param bool $templateVersionName
     */

    public function createGame($gameName, $owner, $templateId, $templateVersionName = false)
    {
        $mongoTimestamp = new \MongoDB\BSON\UTCDatetime();
        $mongoTemplateId = new \MongoDB\BSON\ObjectID($templateId);

        $mongoTemplateQuery =  ['_id' => $mongoTemplateId];

//        $templateVersion = 3;
//        $templateTarget =

        $mongoTemplateData = $this->mongoTemplatesCollection->findOne($mongoTemplateQuery);

        $templateName = $mongoTemplateData->name;
        $templateVersions = $mongoTemplateData->versions;

        if ($templateVersionName != false) {
            foreach ($mongoTemplateData->versions as $versionKey) {
                if ($versionKey->versionName == $templateVersionName) {
                    $gameTemplateData = $versionKey->data;
                }
            };
        } else {
            $gameTemplateData = $templateVersions[(count($templateVersions) - 1)]->data;
            $templateVersionName =  $templateVersions[(count($templateVersions) - 1)]->versionName;
        }
        //TODO: add owner as field
        $mongoQuery = [
            'name'          => $gameName,
            'owner'         => $owner,
            'creationDate'  => $mongoTimestamp,
            'status'        => 'active',
            'template'      => [
                'id' => $templateId,
                'name' => $templateName,
                'version' => $templateVersionName,
                'templateData' => $gameTemplateData,
            ],
            'players'       => [],
            'gameMasters'   => [],
            'chat'          => []
        ];
        $mongoResult = $this->mongoGamesCollection->insertOne($mongoQuery);
        $mongoGameDocId = (string)$mongoResult->getInsertedId();

        $mongoTargetId = new \MongoDB\BSON\ObjectID($owner);
        $mongoTarget = ['_id' => $mongoTargetId];
        $mongoQuery = [
            '$push' => [
                'games.owned' => [
                    'name' => $gameName,
                    'id' => $mongoGameDocId
                ],
            ]
        ];

        $mongoUserResult = $this->mongoUserCollection->updateOne($mongoTarget, $mongoQuery);
//        echo ;
    }
    public function getCharacterSheetTemplate($templateId)
    {
        $mongoTemplateDocId = new \MongoDB\BSON\ObjectID($templateId);
        $mongoQuery = ['_id' => $mongoTemplateDocId];
        $mongoResult = $this->mongoTemplatesCollection->findOne($mongoQuery);
        return $mongoResult;
    }
    public function joinGame($userId, $gameId, $type)
    {
        /*
         * Get GameInfo
         * Get TemplateData based on game->template->id
         * create new characterSheet and add to data for new player from TemplateData based on GameInfo-> template->id && template->version
         * insert new player into game->players
         * add game->id to users games array
         * */
        if ($type != 'player') {
            throw new \Exception('type was wrong');
        }
        $mongoGameDocId = new \MongoDB\BSON\ObjectID($gameId);
        $mongoTarget = ['_id' => $mongoGameDocId];

        $mongoGameData = $this->mongoGamesCollection->findOne($mongoTarget);
        $gameName = $mongoGameData->name;

        $joinedDate = new \MongoDB\BSON\UTCDatetime();
        $playerId = $userId;


//        $mongoProjection = ['$projection' => ['template' => 1 , '_id' => 0] ];
        // get the Template id and version for the game
//        $mongoGameTemplateInfo = $this->mongoGamesCollection->findOne($mongoTarget, $mongoProjection)->template;

//        $gameTemplateId = new \MongoDB\BSON\ObjectID($mongoGameTemplateInfo->id);
//        $gameTemplateVersion = $mongoGameTemplateInfo->version;

//        $mongoTarget = ['_id' => $gameTemplateId];
//        $mongoTemplate = $this->mongoTemplatesCollection->findOne($mongoTarget);

//        foreach ($mongoTemplate->versions as $versionKey) {
//            if ($versionKey->versionName == $gameTemplateVersion) {
//                $newCharacterSheetData = $this->objectToArray($versionKey->data);
//            }
//        };
//        $newCharacterSheetData = $mongoTemplate->versions;

//        $mongoProjection = ['$projection' => ['version' => [] ] ];
//        $templateData =


        if ($type == 'player') {
            $mongoInsertData = [
                'playerId' => $playerId,
                'joinedDate' => $joinedDate,
                'status' => 'active',
                'characterSheet' => $mongoGameData->template->templateData,
            ];
            $mongoQuery = ['$push' => ['players' => $mongoInsertData]];
        } else if ($type == 'gameMaster') {
            $mongoInsertData = [
                'playerId' => $playerId,
                'joinedDate' => $joinedDate,
                'status' => 'active',
            ];
            $mongoQuery = ['$push' => ['gameMasters' => $mongoInsertData]];
        }


        $mongoResult = $this->mongoGamesCollection->updateOne($mongoTarget, $mongoQuery);

        $mongoUserDocId = new \MongoDB\BSON\ObjectID($_SESSION['userMongoDocId']);
        $mongoTarget = ['_id' => $mongoUserDocId];
        $mongoQuery = [
            '$push' => [
                'games.joined' => [
                        'name' => $gameName,
                        'id' => $gameId,
                        'type' => $type,
                    ],
                ],
        ];
//        $test = $this->mongoUserCollection->updateOne($mongoTarget);
        $mongoResult = $this->mongoUserCollection->updateOne($mongoTarget, $mongoQuery);
    }
    public function getGameById($id) {
        $mongoGameDocId = new \MongoDB\BSON\ObjectID($id);
        $mongoTarget = ['_id' => $mongoGameDocId];
        $mongoResult = $this->mongoGamesCollection->findOne($mongoGameDocId);
        return $mongoResult;

    }

    public function getPublicTemplates($searchValue = false, $resultLimit = false)
    {
        //TODO: Enhancement write function to search by username
//        $mongoQuery = ['status' => 'public'];
        if ($searchValue != false) {
//            $mongoRegex = new \MongoDB\BSON\Regex("/^$searchValue/", 'i');
//            $where = array('name' => array('$regex' => new MongoRegex("/^$searchValue/i")));
//            $mongoTarget = ['name' => ['$regex' => $mongoRegex]];
            $mongoTarget = [
                '$or' => [
                    ['name' => new \MongoDB\BSON\Regex("$searchValue", "i")],
                    ['description' => new \MongoDB\BSON\Regex("$searchValue", "i")],
                ],
            ];
        } else {
            $mongoTarget = [];
        }
        $mongoBaseProjection = [
            'projection' => [
                'name' => 1,
                'author' => 1,
                'creationDate' => 1,
                'lastEdit' => 1,
                'description' => 1,
            ]
        ];
        if ($resultLimit == false) {
            $mongoProjection = $mongoBaseProjection;
        } else {
            $mongoProjection = [
                'limit' => $resultLimit,
                $mongoBaseProjection,
            ];
        }
        $mongoResult = $this->mongoTemplatesCollection->find($mongoTarget, $mongoProjection);
        $templatesCollection = [];
        foreach ($mongoResult as $template) {
            $templatesCollection[] = $template;
        }
        for ($i = 0; $i< count($templatesCollection); $i++) {
            if (property_exists($templatesCollection[$i], 'lastEdit')) {
//                print $templatesCollection[$i]->lastEdit->toDateTime();
//                var_dump($templatesCollection[$i]->lastEdit);
//                print new \MongoDB\BSON\UTCDatetime($templatesCollection[$i]->lastEdit);
            }
            if (property_exists($templatesCollection[$i], 'author')) {
                $authorId = new \MongoDB\BSON\ObjectID($templatesCollection[$i]->author);
                $mongoAuthorTarget = ['_id' => $authorId];
                $mongoAuthorNameProjection = ['$projection' => ['username' => 1, '_id' => 0]];
                $mongoAuthorNameResult = $this->mongoUserCollection->find($mongoAuthorTarget, $mongoAuthorNameProjection);
                foreach($mongoAuthorNameResult as $authorKey) {
                    $templatesCollection[$i]->author = $authorKey->username;
                }
            }
        }


        if (empty($templatesCollection)) {
            $output = ['results' => false];
        } else {
            $output = (object)["templates" => $templatesCollection];
            if ($resultLimit != false) {
                $mongoCountResult = $this->mongoTemplatesCollection->count($mongoTarget);
                if ($mongoCountResult > $resultLimit){
                    $output = (object)['results' => true, "templates" => $templatesCollection, 'moreResults' => true];
                } else {
                    $output = (object)['results' => true, "templates" => $templatesCollection, 'moreResults' => false];
                }
            } else {
                $output = (object)['results' => true, "templates" => $templatesCollection, 'moreResults' => false];
            }
        }
        echo json_encode($output);

    }

    public function getUsernameByMongoId($id){
        $mongoId = new \MongoDB\BSON\ObjectID($id);
        $mongoTarget = ['_id' => $mongoId];
        $projection = ['projection' => ['_id' => 0,'username'=> 1]];
        $mongoResult = $this->mongoUserCollection->findOne($mongoTarget, $projection);
        return ($mongoResult);
    }
    public function getPlayers($gameId)
    {
        $mongoGameId = new \MongoDB\BSON\ObjectID($gameId);
        $mongoQuery = ['_id' => $mongoGameId];
        $mongoProjection = ['projection' =>[ '_id' => 0, 'players.playerId' => 1] ];
        $cursor = $this->mongoGamesCollection->find($mongoQuery, $mongoProjection);
        $playersTemp = [];
        foreach ($cursor as $player) {
            $playersTemp[] = $player;
        }
        $players = $playersTemp[0]->players;
        $playersFound = [];
        foreach ($players as $player) {
            $playersFound[] = $this->getUsernameByMongoId($player->playerId);
        }
        echo json_encode($playersFound);
    }
}