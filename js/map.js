// Initialisation de la carte (position temporaire)
    const map = L.map('map').setView([49.02571260, 1.14802240], 9);

// Fond de carte OpenStreetMap
    // Carte de Base
    // L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    //     attribution: '© OpenStreetMap'
    // }).addTo(map);
    // Carte claire
    // L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    // attribution: '© OpenStreetMap © CARTO'
    // }).addTo(map);
    // Carte Sombre
    // L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    // attribution: '© OpenStreetMap © CARTO'
    // }).addTo(map);
// Fond de carte au choix par liste déroulante.

const osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
const cartoLight = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png');
const cartoDark = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png');
const stadiamaps = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png');
const stadiamapsDark = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png');



osm.addTo(map);

L.control.layers({
    "OpenStreetMap": osm,
    "Carto Light": cartoLight,
    "Carto Dark": cartoDark,
    "Stadiamaps": stadiamaps,
    "StadiaDarkmaps": stadiamapsDark
}).addTo(map);

// Grise la France
fetch('data/eure.geojson')
.then(res => res.json())
.then(eureData => {

    // Coordonnées approximatives couvrant toute la France
    const franceBounds = [
        [51.5, -5.5], // Nord-Ouest
        [51.5, 9.8],  // Nord-Est
        [41.0, 9.8],  // Sud-Est
        [41.0, -5.5]  // Sud-Ouest
    ];

    // Coordonnées de l’Eure (le "trou")
    const eureCoords = eureData.features[0].geometry.coordinates;

    const mask = {
        "type": "Feature",
        "geometry": {
            "type": "Polygon",
            "coordinates": [
                franceBounds.map(c => [c[1], c[0]]), // polygone externe
                ...eureCoords                          // trou = Eure
            ]
        }
    };

    L.geoJSON(mask, {
        style: {
            fillColor: "#000",
            fillOpacity: 0.25,
            color: "#000",
            weight: 0
        }
    }).addTo(map);

});






// Création du contour du département (via fichier eure.geojson)
    fetch('data/eure.geojson')
        .then(response => response.json())
        .then(data => {

            L.geoJSON(data, {
                style: {
                    color: '#1e90ff',     // contour
                    weight: 2,
                    fillColor: '#1e90ff', // remplissage
                    fillOpacity: 0.15     // transparence
                }
            }).addTo(map);

        });



L.rectangle(
    [[51.5, -5.5], [41, 9.8]],
    {
        color: "#000",
        weight: 0,
        fillColor: "#000",
        fillOpacity: 0.08
    }
).addTo(map);


// Custumisation icône du Marker
function getIconByScore(score) {

    let iconUrl;

    if (score <= 2) {
        iconUrl = 'img/rouge.png';//'img/marker-red.png';
    } 
    else if (score === 3) {
        iconUrl = 'img/orange.png';//'img/marker-orange.png';
    } 
    else {
        iconUrl = 'img/vert.png';//'img/marker-green.png';
    }

    return L.icon({
        iconUrl: iconUrl,
        iconSize: [15, 15],
        iconAnchor: [20, 20],
        popupAnchor: [0, -35]
    });
}


// Géolocalisation de l'utilisateur
/**************************************/
// Creation carte de chaleur
/**************************************/


/**************************************************
* HEATMAP DES APPELS
**************************************************/
fetch('get_appels.php')
.then(response => response.json())
.then(appels => {

    const heatPoints = [];

    appels.forEach(appel => {

        if (appel.latitude && appel.longitude) {

            heatPoints.push([
                parseFloat(appel.latitude),
                parseFloat(appel.longitude),
                1
                // parseInt(appel.score) || 1 // intensité
            ]);
        }
    });

    const heat = L.heatLayer(heatPoints, {
        radius: 25,        // taille des zones
        blur: 18,          // flou
        maxZoom: 12,
        minOpacity: 0.4,
        gradient: {
            0.2: 'green',
            0.4: 'yellow',
            0.6: 'orange',
            0.8: 'red'
        }
    });

    heat.addTo(map);
});



/**************************************************
 * RÉCUPÉRATION DES APPELS DEPUIS L’API PHP
 **************************************************/
// fetch('get_appels.php')
// .then(response => response.json())
// .then(appels => {

//     appels.forEach(appel => {

//         // Sécurité : on vérifie les coordonnées
//         if (appel.latitude && appel.longitude) {

//             // Choix de l’icône selon le score
//             const icon = getIconByScore(parseInt(appel.score));

//             // Création du marqueur
//             // L.marker(
//             //     [appel.latitude, appel.longitude],
//             //     { icon: icon }
//             // )
//             // .addTo(map)
//             // .bindPopup(`
//             //     <strong>Adresse :</strong> ${appel.adresse}<br>
//             //     <strong>Gravité :</strong> ${appel.gravite}<br>
//             //     <strong>Score :</strong> ${appel.score}
//             // `);
//         }
//     });
// });

    function ouvrirAlerte() {
    alert("Homme de 52 ans présentant une douleur thoracique intense à 12 rue des Lilas, Evreux. La douleur est apparue soudainement alors que le patient était a...");
    }
