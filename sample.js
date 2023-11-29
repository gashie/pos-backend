const pgp = require('pg-promise')();
const dotenv = require("dotenv");
dotenv.config({ path: "./config/config.env" });
// Set your database connection details
const dbConfig = {
  database: process.env.DATABASE_NAME,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  port: process.env.DATABASE_PORT,
  host: process.env.DB_HOST,
};

const db = pgp(dbConfig);

async function generateSampleData(tableName, numberOfRows) {
  try {
    const columns = await db.any(
      'SELECT column_name, data_type FROM information_schema.columns WHERE table_name = $1',
      [tableName]
    );

    const sampleData = Array.from({ length: numberOfRows }, () => {
      const row = {};
      columns.forEach((column) => {
        const columnName = column.column_name;
        const dataType = column.data_type;

        // Add logic here to generate sample data based on data type
        // For simplicity, we're using placeholder values
        switch (dataType) {
          case 'uuid':
            row[columnName] = 'generated_uuid_here';
            break;
          case 'character varying':
            row[columnName] = 'Sample ' + columnName;
            break;
          case 'text':
            row[columnName] = 'Sample ' + columnName;
            break;
          case 'boolean':
            row[columnName] = Math.random() < 0.5; // Random boolean
            break;
          case 'time without time zone':
            row[columnName] = '12:34:56'; // Placeholder time
            break;
          case 'timestamp without time zone':
            row[columnName] = new Date().toISOString(); // Current timestamp
            break;
            case 'integer':
              return Math.floor(Math.random() * 100) + 1;
            case 'numeric':
              return parseFloat((Math.random() * 100).toFixed(2));
            case 'date':
              return '2023-01-01';
          // Add more cases for other data types as needed
          default:
            row[columnName] = null; // Default to null for unsupported types
        }
      });
      return row;
    });

    return { [tableName]: sampleData };
  } catch (error) {
    console.error('Error:', error.message);
    return null;
  }
}

async function main() {
  const tableName = 'group_band_allowance'; // Specify your table name here
  const numberOfRows = 1; // Specify the number of rows you want to generate

  const sampleData = await generateSampleData(tableName, numberOfRows);
  console.log(JSON.stringify(sampleData, null, 2));

  pgp.end(); // Close the database connection
}

main();
