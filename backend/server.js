const express = require('express');
const app = express();
const mysql = require('mysql');
const cors = require('cors');
require('dotenv').config();

const port = process.env.PORT || 4000;

app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'employees',
    port: 3306, // default MySQL port, change if different
});

// Connect to the MySQL database
db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the MySQL database');
});

// Get all employees
app.get('/', (req, res) => {
    db.query('SELECT * FROM employee_table', (err, result) => {
        if (err) return res.status(400).json({ message: err });
        res.status(200).json(result);
    });
});

// Add a new employee
app.post('/add', (req, res) => {
    const { name, position, email, phone } = req.body;
    db.query(
        'INSERT INTO employee_table (name, position, email, phone) VALUES (?, ?, ?, ?)',
        [name, position, email, phone],
        (err, result) => {
            if (err) return res.status(400).json({ message: err });
            res.status(200).json({ message: 'Employee Added' });
        }
    );
});

// Update an employee
app.put('/update/:id', (req, res) => {
    const { name, position, email, phone } = req.body;
    const { id } = req.params;
    db.query(
        'UPDATE employee_table SET name=?, position=?, email=?, phone=? WHERE id=?',
        [name, position, email, phone, id],
        (err, result) => {
            if (err) return res.status(400).json({ message: err });
            res.status(200).json({ message: 'Employee Updated' });
        }
    );
});

// Delete an employee
app.delete('/delete/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM employee_table WHERE id=?', [id], (err, result) => {
        if (err) return res.status(400).json({ message: err });
        res.status(200).json({ message: 'Employee Deleted' });
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
