<?php
/**
 * Created by PhpStorm.
 * User: Niclas Jansen <niclas.jansen@gmail.com>
 * Date: 02/02/2017
 * Time: 04:28
 */

namespace penAndPixels\Repository;


class Database extends Base
{
    protected $config;

    private $sqlClient;
    private $sqlResult;

    public $mongoClient;

    public $mongoUserCollection;
    public $mongoTemplatesCollection;
    public $mongoGamesCollection;

    private $mongoResult;

    public function __construct($config)
    {
        $this->config = $config;
        $this->sqlConnection();
        $this->setMongoClient();
        $this->setMongoUserCollection();
        $this->setMongoTemplateCollection();
        $this->setMongoGamesCollection();
    }

    private function setMongoUserCollection()
    {
        $mongoDb        = $this->config->mongo->db->characterSheets->dbName;
        $mongoDocument  = $this->config->mongo->db->characterSheets->collections->player;

        $this->mongoUserCollection = $this->mongoClient->$mongoDb->$mongoDocument;
    }

    private function setMongoTemplateCollection()
    {
        $mongoDb        = $this->config->mongo->db->characterSheets->dbName;
        $mongoDocument  = $this->config->mongo->db->characterSheets->collections->templates;

        $this->mongoTemplatesCollection = $this->mongoClient->$mongoDb->$mongoDocument;
    }

    private function setMongoGamesCollection()
    {
        $mongoDb        = $this->config->mongo->db->characterSheets->dbName;
        $mongoDocument  = $this->config->mongo->db->characterSheets->collections->games;

        $this->mongoGamesCollection = $this->mongoClient->$mongoDb->$mongoDocument;
    }

    private function setSqlResult($result) {
        $this->sqlResult = $result;
    }
    private function getSqlResult() {
        return $this->sqlResult;
    }
    private function sqlConnection()
    {
        $this->sqlClient = @new \mysqli(
            $this->config->sql->host,
            $this->config->sql->user,
            $this->config->sql->password,
            $this->config->sql->db
        );
    }

    public function sqlQuery($sql) {
        $this->setSqlResult($this->sqlClient->query($sql));
        return $this;
    }

    public function sqlToArray() {
        $rows = [];
        while ($row = $this->getSqlResult()->fetch_assoc()){
            $rows[] = $row;
        }
        return $rows;
    }
    private function setMongoClient()
    {
            $this->mongoClient = @new \MongoDB\Client($this->config->mongo->host);
    }
//    public function mongoInsertOne($target, $data){
//        $result = $this->mongoClient->$target->insertOne($data);
//        return $result;
//    }
//
//    private function setMongoResutl(){
//
//    }
    public function clearGamesCollection()
    {
        $this->mongoGamesCollection->deleteMany([]);
    }
}