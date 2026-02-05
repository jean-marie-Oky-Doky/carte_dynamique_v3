<?php

/**************************************************
 * CONNEXION À LA BASE DE DONNÉES
 **************************************************/
$pdo = new PDO(
    "mysql:host=localhost;dbname=Appel;charset=utf8",
    "root",
    ""
);

/**************************************************
 * RÉCUPÉRATION DES ADRESSES NON GÉOCODÉES
 * (on évite de recalculer celles déjà traitées)
 **************************************************/
$sql = "SELECT id, adresse 
        FROM Liste_appel 
        WHERE latitude IS NULL 
           OR longitude IS NULL";

$query = $pdo->query($sql);
$appels = $query->fetchAll(PDO::FETCH_ASSOC);

/**************************************************
 * BOUCLE SUR CHAQUE ADRESSE
 **************************************************/
foreach ($appels as $appel) {

    // Encodage de l’adresse pour l’URL
    $adresse = urlencode($appel['adresse']);

    // Appel à l’API Nominatim (OpenStreetMap)
    $url = "https://nominatim.openstreetmap.org/search?format=json&q=$adresse";

    // User-Agent obligatoire pour Nominatim
    $opts = [
        "http" => [
            "header" => "User-Agent: Projet-Appel/1.0\r\n"
        ]
    ];

    // Création du contexte HTTP
    $context = stream_context_create($opts);

    // Appel HTTP vers l’API
    $json = file_get_contents($url, false, $context);

    // Conversion JSON → tableau PHP
    $data = json_decode($json, true);

    /**************************************************
     * SI UNE COORDONNÉE EST TROUVÉE
     **************************************************/
    if (!empty($data)) {

        // Latitude / longitude du premier résultat
        $lat = $data[0]['lat'];
        $lon = $data[0]['lon'];

        // Mise à jour en base
        $update = $pdo->prepare(
            "UPDATE Liste_appel 
             SET latitude = ?, longitude = ? 
             WHERE id = ?"
        );

        $update->execute([$lat, $lon, $appel['id']]);
    }

    /**************************************************
     * PAUSE OBLIGATOIRE
     * (respect des règles de Nominatim)
     **************************************************/
    sleep(1);
}
