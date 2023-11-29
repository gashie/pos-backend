const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const dbConfig = {
  user: 'admin',
  host: 'localhost',
  database: 'shopdb',
  password: 'admin',
  port: 5432, // Adjust the port if needed
};

// Auto-generate backup folder and file names based on current date and time
const backupDir = path.join(__dirname, 'backups', new Date().toISOString().replace(/[-:]/g, '_'));
const backupFileName = `backup_${new Date().toISOString().replace(/[-:]/g, '_')}.dump`;

// Create the backup directory if it doesn't exist
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
}

const backupCommand = `pg_dump -U ${dbConfig.user} -h ${dbConfig.host} -d ${dbConfig.database} -Fc -f ${path.join(backupDir, backupFileName)}`;

exec(backupCommand, (error, stdout, stderr) => {
  if (error) {
    console.error(`Backup failed: ${error.message}`);
  } else {
    console.log(`Backup successful:\n${stdout}`);
    // Add restore logic here if needed
  }
});
