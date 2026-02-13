const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
  user: process.env.POSTGRES_USER || 'postgres',
  host: process.env.POSTGRES_HOST || 'localhost',
  database: process.env.POSTGRES_DB || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'postgres',
  port: 5432,
});

async function createDb() {
  try {
    
    const userTableExists = await pool.query(`SELECT to_regclass('public.users') AS exists;`);
    if (userTableExists.rows[0].exists) {
      console.log('[INFO] Users table already exists. Skipping initialization.');
    } else {
      await pool.query(`
        CREATE TABLE users (
          id SERIAL PRIMARY KEY,
          username VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL
        );
      `);
      console.log('[INFO] Users table created successfully.');

      await pool.query(
        'INSERT INTO users (username, password) VALUES ($1, $2) ON CONFLICT (username) DO NOTHING',
        ['testuser', 'testpassword']
      );
      console.log('[INFO] Inserted test user into users table.');
    }

    // Check if progress table exists
    const progressTableExists = await pool.query(`SELECT to_regclass('public.progress') AS exists;`);
    if (progressTableExists.rows[0].exists) {
      console.log('[INFO] Progress table already exists. Skipping initialization.');
    } else {
      await pool.query(`
        CREATE TABLE progress (
          id SERIAL PRIMARY KEY,
          user_id INTEGER REFERENCES users(id),
          lab_name VARCHAR(255) NOT NULL,
          status VARCHAR(50) NOT NULL
        );
      `);
      console.log('[INFO] Progress table created successfully.');

      await pool.query(`
        INSERT INTO progress (user_id, lab_name, status) VALUES
          (1, 'lab1', 'uncomplete'), (1, 'lab2', 'locked'), (1, 'lab3', 'locked'), (1, 'lab4', 'locked'),
          (1, 'lab5', 'locked'), (1, 'lab6', 'locked'), (1, 'lab7', 'locked'), (1, 'lab8', 'locked'),
          (1, 'lab9', 'locked'), (1, 'lab10', 'locked'), (1, 'lab11', 'locked'), (1, 'lab12', 'locked'),
          (1, 'lab13', 'locked'), (1, 'lab14', 'locked'), (1, 'lab15', 'locked'), (1, 'lab16', 'locked'),
          (1, 'lab17', 'locked'), (1, 'lab18', 'locked'), (1, 'lab19', 'locked'), (1, 'lab20', 'locked'),
          (1, 'lab21', 'locked'), (1, 'lab22', 'locked'), (1, 'lab23', 'locked'), (1, 'lab24', 'locked'),
          (1, 'lab25', 'locked'), (1, 'lab26', 'locked'), (1, 'lab27', 'locked'), (1, 'lab28', 'locked'),
          (1, 'lab29', 'locked'), (1, 'lab30', 'locked'), (1, 'lab31', 'locked'), (1, 'lab32', 'locked')
        ON CONFLICT DO NOTHING;
      `);
      console.log('[INFO] Inserted initial progress data into progress table.');
    }
    await pool.query(`
      DO $$ 
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'category') THEN
          CREATE TYPE category AS ENUM ('electronics', 'clothing', 'books', 'home', 'toys');
        END IF;
      END$$;
    `);

    await pool.query('CREATE TABLE IF NOT EXISTS Products (id SERIAL PRIMARY KEY, name VARCHAR(255) NOT NULL, price DECIMAL(10, 2) NOT NULL, description TEXT, image_url TEXT, category category);');
    console.log('[INFO] Products table created successfully.');
    await pool.query(`
      INSERT INTO Products (name, price, description, image_url, category)
      VALUES
        ('Bajaj Fan', 10.99, 'Bajaj Fan', '/fan.png', 'electronics'),
        ('Mens Shirt', 19.99, 'Mens Shirt', '/shirt.png', 'clothing'),
        ('Fairy Tale Book', 5.99, 'Fairy Tale Book', '/book.png', 'books'),
        ('Bed', 29.99, 'Description for product 4', '/bed.png', 'home'),
        ('Product 5', 15.99, 'Description for product 5', 'https://via.placeholder.com/150', 'toys'),
        ('Product 6', 12.99, 'Description for product 6', 'https://via.placeholder.com/150', 'electronics'),
        ('Product 7', 25.99, 'Description for product 7', 'https://via.placeholder.com/150', 'clothing'),
        ('Product 8', 8.99, 'Description for product 8', 'https://via.placeholder.com/150', 'books'),
        ('Product 9', 35.99, 'Description for product 9', 'https://via.placeholder.com/150', 'home'),
        ('Product 10', 20.99, 'Description for product 10', 'https://via.placeholder.com/150', 'toys'),
        ('Product 11', 9.99, 'Description for product 11', 'https://via.placeholder.com/150', 'electronics'),
        ('Product 12', 18.99, 'Description for product 12', 'https://via.placeholder.com/150', 'clothing'),
        ('Product 13', 6.99, 'Description for product 13', 'https://via.placeholder.com/150', 'books'),
        ('Product 14', 27.99, 'Description for product 14', 'https://via.placeholder.com/150', 'home'),
        ('Product 15', 17.99, 'Description for product 15', 'https://via.placeholder.com/150', 'toys'),
        ('Product 16', 14.99, 'Description for product 16', 'https://via.placeholder.com/150', 'electronics'),
        ('Product 17', 22.99, 'Description for product 17', 'https://via.placeholder.com/150', 'clothing'),
        ('Product 18', 7.99, 'Description for product 18', 'https://via.placeholder.com/150', 'books'),
        ('Product 19', 30.99, 'Description for product 19', 'https://via.placeholder.com/150', 'home'),
        ('Product 20', 16.99, 'Description for product 20', 'https://via.placeholder.com/150', 'toys'),
      ON CONFLICT DO NOTHING;
    `);     


    console.log('[INFO] Database initialization completed.');
  } catch (err) {
    console.error('[ERROR] Database initialization failed:', err);
  } finally {
  }
}

// Run the initializer
createDb();
