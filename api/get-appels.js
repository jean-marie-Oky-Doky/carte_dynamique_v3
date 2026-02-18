const { pool } = require('./_db');

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const result = await pool.query(
      'SELECT id, adresse, gravite, score, latitude, longitude FROM liste_appel ORDER BY id'
    );

    return res.status(200).json(result.rows);
  } catch (error) {
    return res.status(500).json({
      error: 'Database query failed.',
      details: error.message,
    });
  }
};
