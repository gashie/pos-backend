const { exec } = require('child_process');
const path = require('path');
const { Pool } = require('pg');

// PostgreSQL connection configuration
const dbConfig = {
  user: 'admin',
  host: 'localhost',
  database: 'sap',
  password: 'admin',
  port: 5432, // Change this if your PostgreSQL instance is using a different port
};

// Backup file to restore
const backupDir = path.join(__dirname, 'backups');
const backupFileName = 'backup_2023.sql'; // Replace with the actual backup file name

// Create a PostgreSQL connection pool
const pool = new Pool(dbConfig);

// Restore the database
async function restoreDatabase() {
  const client = await pool.connect();

  try {
    // Use pg_restore to restore the database from the backup file
    const restoreCommand = `pg_restore -U ${dbConfig.user} -h ${dbConfig.host} -d ${dbConfig.database} -c -F c ${path.join(backupDir, backupFileName)}`;

    exec(restoreCommand, (error, stdout, stderr) => {
      if (error) {
        console.error(`Restore failed: ${stderr}`);
      } else {
        console.log('Restore successful.');
      }

      // Release the database connection
      client.release();
      
      // Close the Node.js process
      process.exit();
    });
  } catch (error) {
    console.error(`Error during restore: ${error.message}`);
    client.release();
    process.exit(1);
  }
}

// Run the restore
restoreDatabase();
