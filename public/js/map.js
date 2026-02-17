/**************************************************
 * INITIALISATION DE LA CARTE
 **************************************************/
const map = L.map('map').setView([49.0257, 1.1480], 9);

/**************************************************
 * PANES
 **************************************************/
map.createPane('eurePane');
map.getPane('eurePane').style.zIndex = 400;

/**************************************************
 * FONDS DE CARTE
 **************************************************/
const osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
const cartoLight = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png');
const cartoDark = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png');
const stadiamaps = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png');
const stadiamapsDark = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png');

let fondActuel = stadiamapsDark;
fondActuel.addTo(map);

const fonds = { osm, cartoLight, cartoDark, stadiamaps, stadiamapsDark };

/**************************************************
 * VARIABLES GLOBALES
 **************************************************/
let appelsData = [];
let heatLayerGravite;
let heatLayerScore;
let filtreScoreActuel = "aucun";
let filtreGraviteActuel = "all";


/**************************************************
 * ICÔNES SCORE
 **************************************************/
function getIconByScore(score) {
    let iconUrl;
    if (score <= 2) iconUrl = 'img/rouge.png';
    else if (score === 3) iconUrl = 'img/orange.png';
    else iconUrl = 'img/vert.png';

    return L.icon({
        iconUrl,
        iconSize: [15, 15],
        iconAnchor: [7, 7],
        popupAnchor: [0, -10]
    });
}

/**************************************************
 * AFFICHAGE DES APPELS (MARKERS)
 **************************************************/
const appelsMarkersLayer = L.layerGroup().addTo(map);

function afficherAppels(filtreScore) {
    appelsMarkersLayer.clearLayers();
    if (filtreScore === "none") return;

    appelsData.forEach(appel => {
        if (!appel.latitude || !appel.longitude) return;

        const score = parseInt(appel.score);
        let couleur = "vert";
        if (score <= 2) couleur = "rouge";
        else if (score === 3) couleur = "orange";

        if (filtreScore !== "all" && filtreScore !== couleur) return;

        L.marker(
            [appel.latitude, appel.longitude],
            { icon: getIconByScore(score) }
        )
        .bindPopup(`
            <strong>Adresse :</strong> ${appel.adresse}<br>
            <strong>Gravité :</strong> ${appel.gravite}<br>
            <strong>Score :</strong> ${appel.score}
        `)
        .addTo(appelsMarkersLayer);
    });
}

/**************************************************
 * HEATMAP DYNAMIQUE PAR GRAVITÉ
 **************************************************/
function updateHeatmapGravite(gravite) {

    filtreGraviteActuel = gravite;

    if (heatLayerGravite) {
        map.removeLayer(heatLayerGravite);
    }

    if (filtreScoreActuel !== "aucun") return; 
    // IMPORTANT : si un score est actif, on ne montre PAS la gravité

    const filtered = appelsData.filter(a => {
        if (!a.latitude || !a.longitude) return false;
        if (gravite === "all") return true;
        if (!a.gravite) return false;
        return a.gravite.trim().toLowerCase() === gravite.toLowerCase();
    });

    const heatPoints = filtered.map(a => [
        parseFloat(a.latitude),
        parseFloat(a.longitude),
        1
    ]);

    heatLayerGravite = L.heatLayer(heatPoints, {
        radius: 25,
        blur: 18,
        maxZoom: 12,
        minOpacity: 0.4,
        gradient: {
            0.2: 'green',
            0.4: 'yellow',
            0.6: 'orange',
            0.8: 'brown'
        }
    }).addTo(map);
}


function updateHeatmapScore(score) {

    filtreScoreActuel = score;

    // Supprime heatmap score si existante
    if (heatLayerScore) {
        map.removeLayer(heatLayerScore);
    }

    // Si "aucun" → on remet la heatmap gravité
    if (score === "aucun") {
        updateHeatmapGravite(filtreGraviteActuel);
        return;
    }

    // Supprimer la heatmap gravité
    if (heatLayerGravite) {
        map.removeLayer(heatLayerGravite);
    }

    const filtered = appelsData.filter(a => {
        if (!a.latitude || !a.longitude) return false;
        return parseInt(a.score) === parseInt(score);
    });

    const heatPoints = filtered.map(a => [
        parseFloat(a.latitude),
        parseFloat(a.longitude),
        1
    ]);

    heatLayerScore = L.heatLayer(heatPoints, {
        radius: 25,
        blur: 18,
        maxZoom: 12,
        minOpacity: 0.4,
        gradient: {
            0.2: '#00ff00',
            0.4: '#ffff00',
            0.6: '#ff9900',
            0.8: '#ff0000'
        }
    }).addTo(map);
}


/**************************************************
 * CHARGEMENT DES DONNÉES
 **************************************************/
fetch('/api.appels')
.then(res => res.json())
.then(appels => {
    appelsData = appels;
    updateHeatmapGravite("all");   // Heatmap par défaut → tous
    afficherAppels("none"); // Pas de markers au départ
})
.catch(err => console.error("Erreur chargement appels :", err));

/**************************************************
 * CONTOUR DÉPARTEMENT EURE
 **************************************************/
fetch('data/eure.geojson')
.then(res => res.json())
.then(eureData => {
    const eureLayer = L.geoJSON(eureData, {
        pane: 'eurePane',
        style: {
            color: "#00ffff",
            weight: 3,
            fillColor: "#1e90ff",
            fillOpacity: 0.1
        }
    }).addTo(map);

    map.fitBounds(eureLayer.getBounds());
})
.catch(error => console.error("Erreur GeoJSON :", error));

/**************************************************
 * INTERACTIONS MENU
 **************************************************/
document.addEventListener("DOMContentLoaded", function() {

    const selectFond = document.getElementById("mapSelector");
    const selectGravite = document.getElementById("filtreGravite");
    const selectScore = document.getElementById("filtreScore");


    if (selectFond) {
        selectFond.addEventListener("change", function() {
            map.removeLayer(fondActuel);
            fondActuel = fonds[this.value];
            map.addLayer(fondActuel);
        });
    }

    if (selectGravite) {
        selectGravite.addEventListener("change", function() {
            updateHeatmapGravite(this.value);
        });
    }

    if (selectScore) {
        selectScore.addEventListener("change", function() {
            updateHeatmapScore(this.value);
        });
    }


});
