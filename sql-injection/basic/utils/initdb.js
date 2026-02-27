import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new pg.Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'postgres',
    password: process.env.DB_PASSWORD || '123456',
    port: process.env.DB_PORT || 5432,
});

const CreateUserTable = async (client) => {
    try {
        await client.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL
            );
        `);
        await client.query(`
            INSERT INTO users (username, password) VALUES 
            ('admin', 'FLAG{sql_injection_is_fun}'),
            ('user1', 'password1'),
            ('user2', 'password2')
            ON CONFLICT (username) DO NOTHING;
        `);
        console.log("User table created successfully.");
    } catch (err) {
        console.error("Error creating user table:", err);
    }
};

const CreateLogsTable = async (client) => {

    try {
        await client.query(`
            CREATE TABLE IF NOT EXISTS logs (
                id SERIAL PRIMARY KEY,
                user_agent TEXT NOT NULL,
                ip_address TEXT NOT NULL,
                x_forwarded_for TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE
            );
        `);
        console.log("Logs table created successfully.");
    } catch (err) {
        console.error("Error creating logs table:", err);
    } 
};

const CreateProductsTable = async (client) => {

    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS products (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL UNIQUE,
            description TEXT,
            category VARCHAR(255) NOT NULL,
            price DECIMAL(10, 2) NOT NULL,
            sold_units INTEGER 
        );
    `);

        await client.query(`
            INSERT INTO products (name, description, category, price,sold_units) VALUES 
            ('Product A', 'Description for Product A', 'Electronics', 19.99,100),
            ('Product B', 'Description for Product B', 'Books', 29.99,200),
            ('Product C', 'Description for Product C', 'Clothing', 39.99,234),
            ('Product D', 'Description for Product D', 'Furniture', 49.99,345),
            ('Product E', 'Description for Product E', 'Electronics', 59.99,678),
            ('Product F', 'Description for Product F', 'Books', 69.99,456),
            ('Product G', 'Description for Product G', 'Clothing', 79.99,567),
            ('Product H', 'Description for Product H', 'Furniture', 89.99,789)
            ON CONFLICT (name) DO NOTHING;
        `);
        console.log("Products table created successfully.");
    } catch (err) {
        console.error("Error creating products table:", err);
    } 
};

const createFlagTable = async (client) => {
    try {
        await client.query(`
            CREATE TABLE IF NOT EXISTS flags (
                id SERIAL PRIMARY KEY,
                flag VARCHAR(255) NOT NULL UNIQUE
            );
        `);
        } catch (err) {
        console.error("Error creating flag table:", err);
    }
};

const createProgressTable = async (client) => {
    try {
        await client.query(`
            CREATE TABLE IF NOT EXISTS progress (
                id SERIAL PRIMARY KEY,
                lab_id VARCHAR(255) NOT NULL UNIQUE,
                status VARCHAR(50) NOT NULL
            );
        `);
        await client.query(`
            INSERT INTO progress (lab_id, status) VALUES 
            ('lab1', 'unlocked'),
            ('lab2', 'locked'),
            ('lab3', 'locked'),
            ('lab4', 'locked'),
            ('lab5', 'locked'),
            ('lab6', 'locked'),
            ('lab7', 'locked'),
            ('lab8', 'locked'),
            ('lab9', 'locked'),
            ('lab10', 'locked'),
            ('lab11', 'locked')
            ON CONFLICT (lab_id) DO NOTHING;
        `);
        console.log("Progress table created successfully.");
    } catch (err) {
        console.error("Error creating progress table:", err);
    } 
};

const createSessionsTable = async (client) => {
    try {
        await client.query(`
            CREATE TABLE IF NOT EXISTS sessions (
                id SERIAL PRIMARY KEY,
                cookie TEXT NOT NULL UNIQUE
            );
        `);
        console.log("Sessions table created successfully.");
    } catch (err) {
        console.error("Error creating sessions table:", err);
    }
};


const initDB = async () => {
    const client = await pool.connect();
    try {
        await CreateUserTable(client);
        await CreateLogsTable(client);
        await CreateProductsTable(client);
        await createFlagTable(client);
        await createProgressTable(client);
        await createSessionsTable(client);
        console.log("Database initialized successfully.");
    } catch (err) {
        console.error("Error initializing database:", err);
    } finally {
        client.release();
    }
};

initDB();
