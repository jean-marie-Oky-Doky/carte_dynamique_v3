const { pool } = require('./_db');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  try {
    const toGeocode = await pool.query(
      'SELECT id, adresse FROM liste_appel WHERE latitude IS NULL OR longitude IS NULL'
    );

    let updated = 0;

    for (const appel of toGeocode.rows) {
      const adresse = encodeURIComponent(appel.adresse);
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${adresse}`;

      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Projet-Appel/1.0',
        },
      });

      if (!response.ok) {
        continue;
      }

      const data = await response.json();

      if (Array.isArray(data) && data.length > 0) {
        const lat = Number(data[0].lat);
        const lon = Number(data[0].lon);

        await pool.query(
          'UPDATE liste_appel SET latitude = $1, longitude = $2 WHERE id = $3',
          [lat, lon, appel.id]
        );

        updated += 1;
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    return res.status(200).json({
      status: 'ok',
      processed: toGeocode.rows.length,
      updated,
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Geocoding process failed.',
      details: error.message,
    });
  }
};
