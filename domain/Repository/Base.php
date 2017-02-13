<?php
/**
 * Created by PhpStorm.
 * User: Niclas Jansen <niclas.jansen@gmail.com>
 * Date: 06/02/2017
 * Time: 02:22
 */

namespace penAndPixels\Repository;


class Base
{
    public function objectToArray($obj)
    {
        //maybe fix this
        function objectToArraySelf($objc){
        if (is_object($obj)) {
            $obj = (array)$obj;
        }
        if (is_array($obj)) {
            $new = [];
            foreach ($obj as $key => $val) {
                $new[$key] = objectToArraySelf($val);
            }
        } else {
            $new = $obj;
        }
        return $new;
        }
    }
    public function mongoResultToRows($data) {
        $result = [];
        foreach ($data as $row) {
            $result[] = $row;
        }
        return $result;
    }
}