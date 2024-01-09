module.exports = async function bulkInsert(pool, tableName, filePath) {
  const client = await pool.connect();
  try {
    const copyQuery = `
      COPY ${tableName} FROM '${filePath}' WITH CSV HEADER;
    `;

    await client.query(copyQuery);
    console.log(`Data loaded into ${tableName} from ${filePath}`);
  } catch (err) {
    console.error("Error:", err.message);
  } finally {
    client.release();
  }
};
