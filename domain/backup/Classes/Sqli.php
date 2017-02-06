<?php
/**
 * Created by PhpStorm.
 * User: Niclas Jansen <niclas.jansen@gmail.com>
 * Date: 02/02/2017
 * Time: 03:16
 */

namespace penAndPixels\Classes;


class Sqli
{
    private $host;
    private $db;
    private $user;
    private $password;

    public function __construct() {
        $this->user = $config->sql->user;
    }

    public function echoUser() {
        return $this->user;
    }
}