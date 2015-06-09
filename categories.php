<?php
/**
 * Created by PhpStorm.
 * User: damned
 * Date: 05.06.15
 * Time: 22:05
 */

require 'config.php';

try{
    $pdo = new PDO(sprintf('%s:dbname=%s;host=%s;charset=%s', DB_DRIVER, DB_NAME, DB_HOST, DB_CHARSET), DB_USER, DB_PASSWORD);
} catch (PDOException $e) {
    die('Database connection failed: '.$e->getMessage());
}

$st = $pdo->prepare('SELECT cat.category_id, cat.parent_id, ocd.name FROM oc_category AS cat LEFT JOIN oc_category_description AS ocd ON cat.category_id = ocd.category_id WHERE cat.parent_id = :parent_id');

/**
 * Make categories tree with given $categories children
 *
 * @param $categories
 *
 * @return array
 */
$makeTree = function($categories) use (&$makeTree, $st) {
    foreach ($categories as &$category) {
        $st->execute(array(':parent_id' =>  $category['category_id']));
        $children = $st->fetchAll();
        if (sizeof($children) > 0) {
            $category['children'] = $makeTree($children);
        }
    }

    return $categories;
};

$st->execute(array(':parent_id'  =>  0)); // Use array() instead ([]) brackets for old php versions compatibility
$rootCategories = $st->fetchAll();

$categoriesTree = $makeTree($rootCategories);

$json = json_encode($categoriesTree);

if ($json === false) {
    die(json_last_error_msg());
}

header('Content-Type: application/json');
echo $json;
