import { Pool } from "pg";
import fetch from "node-fetch";

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

export default async function handler(req, res) {
  try {
    const { rows } = await pool.query(`
      SELECT id, adresse 
      FROM Liste_appel 
      WHERE latitude IS NULL OR longitude IS NULL
    `);

    for (const appel of rows) {
      const adresse = encodeURIComponent(appel.adresse);

      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${adresse}`,
        {
          headers: {
            "User-Agent": "Projet-Appel/1.0",
          },
        }
      );

      const data = await response.json();

      if (data.length > 0) {
        const lat = data[0].lat;
        const lon = data[0].lon;

        await pool.query(
          `UPDATE Liste_appel 
           SET latitude = $1, longitude = $2 
           WHERE id = $3`,
          [lat, lon, appel.id]
        );
      }

      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    res.status(200).json({ message: "Géocodage terminé" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur géocodage" });
  }
}

