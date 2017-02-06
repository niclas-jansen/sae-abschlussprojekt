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
    public function createGame($gameName, $templateId, $templateVersionName)
    {
        $mongoTimestamp = new \MongoDB\BSON\UTCDatetime();
        $mongoTemplateId = new \MongoDB\BSON\ObjectID($templateId);

        $mongoTemplateQuery =  ['_id' => $mongoTemplateId];

//        $templateVersion = 3;
//        $templateTarget =

        $mongoTemplateData = $this->mongoTemplatesCollection->findOne($mongoTemplateQuery);

        $templateName = $mongoTemplateData->name;
        $templateVersions = $mongoTemplateData->versions;

        foreach ($mongoTemplateData->versions as $versionKey) {
            if ($versionKey->versionName == $templateVersionName) {
                $versionTest = true;
                $testssdss = 1;
                $gameTemplateData = $versionKey->data;
            }
        };

        $mongoQuery = [
            'name'          => $gameName,
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
    }
    public function getCharacterSheetTemplate($templateId)
    {
        $mongoTemplateDocId = new \MongoDB\BSON\ObjectID($templateId);
        $mongoQuery = ['_id' => $mongoTemplateDocId];
        $mongoResult = $this->mongoTemplatesCollection->findOne($mongoQuery);
        return $mongoResult;
    }
    public function joinGame($gameId)
    {
        /*
         * Get GameInfo
         * Get TemplateData based on game->template->id
         * create new characterSheet and add to data for new player from TemplateData based on GameInfo-> template->id && template->version
         * insert new player into game->players
         * add game->id to users games array
         * */

        $mongoGameDocId = new \MongoDB\BSON\ObjectID($gameId);
        $mongoTarget = ['_id' => $mongoGameDocId];

        $mongoGameData = $this->mongoGamesCollection->findOne($mongoTarget);
        $gameName = $mongoGameData->name;

        $joinedDate = new \MongoDB\BSON\UTCDatetime();
        $playerId = $_SESSION['userMongoDocId'];


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



        $mongoInsertData = [
            'playerId' => $playerId,
            'joinedDate' => $joinedDate,
            'status' => 'active',
            'characterSheet' => $mongoGameData->template->templateData,

        ];

        $mongoQuery = ['$push' => ['players' => $mongoInsertData]];
        $mongoResult = $this->mongoGamesCollection->updateOne($mongoTarget, $mongoQuery);

        $mongoUserDocId = new \MongoDB\BSON\ObjectID($_SESSION['userMongoDocId']);
        $mongoTarget = ['_id' => $mongoUserDocId];
        $mongoQuery = [
            '$push' => [
                'games' => [
                    'name' => $gameName,
                 'id' => $gameId,
                ],
            ],
        ];
        $mongoResult = $this->mongoUserCollection->updateOne($mongoTarget, $mongoQuery);
    }
    public function getGameById($id) {
        $mongoGameDocId = new \MongoDB\BSON\ObjectID($id);
        $mongoTarget = ['_id' => $mongoGameDocId];
        $mongoResult = $this->mongoGamesCollection->findOne($mongoGameDocId);
        return $mongoResult;

    }
}