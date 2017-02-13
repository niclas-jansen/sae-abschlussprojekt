<?php
switch ($_SERVER['REQUEST_URI']) {
    case "/index.php":
        require 'test.php';
        break;
    default:
        require 'test.php';
        break;
}