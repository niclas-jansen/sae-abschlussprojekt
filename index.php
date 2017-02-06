<?php
define('ROOT_PATH', __DIR__);
define('LAYOUT_PATH', __DIR__ . '/domain/Layout');
define('VIEW_PATH', __DIR__ . '/domain/View');
define('CONTROLLER_PATH', __DIR__ . '/domain/Controller');
define('ASSETS_PATH', __DIR__ . '/domain/assets');
$config = include(ROOT_PATH . '/config/config.php');

//$test = new \php\classes\Sqli();
//echo $test->echoUser();
require 'vendor/autoload.php';
require 'domain/entryPoint.php';