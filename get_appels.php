<?php
$pdo = new PDO(
    "mysql:host=localhost;dbname=Appel;charset=utf8",
    "root",
    ""
);

$query = $pdo->query("SELECT * FROM Liste_appel");
$appels = $query->fetchAll(PDO::FETCH_ASSOC);

header('Content-Type: application/json');
echo json_encode($appels);
