const express = require('express');
const db = require('./db');
const app = express();

app.use(express.json());

app.get('/api/students', async (req, res) => {
    // const result = await db.query('SELECT * FROM grades');
    // [[Row Data], [Field Data]];
    const [result] = await db.query('SELECT * FROM grades');
    res.send({
        students: result
    });
});

app.get('/api/students/:id', async (req, res) => {
    const {
        id
    } = req.params;

    // Write a JOIN query to get a grade record and related assignments
    // Send data back in response
    // If no data was found record property should be NULL

    res.send({
        message: `Get a grade record and assignments for grade ID: ${id}`,
        record: {}
    });
});

app.post('/api/students', async (req, res) => {
    const {
        name,
        course,
        grade
    } = req.body;

    const errors = [];

    if (!name) {
        errors.push('No student name received');
    }
    if (!course) {
        errors.push('No students course received');
    }
    if (!grade && grade !== 0) {
        errors.push('No students grade received');
    } else if (isNaN(grade)) {
        errors.push('Students course grade must be a number');
    } else if (grade < 0 || grade > 100) {
        errors.push('Students grade must be from 0 to 100');
    }
    if (errors.length) {
        res.status(422).send({
            errors: errors
        });
        return;
    }

    const [result] = await db.execute(`
        INSERT INTO grades 
        (name, course, grade) 
        VALUES (?, ?, ?)
    `, [name, course, grade]);

    res.send({
        message: `Successfully added grade record for ${name}`,
        student: {
            id: result.insertId,
            name: name,
            course: course,
            grade: grade
        }
    });
});

app.listen(3000, () => {
    console.log('Server listening @ localhost:3000');
});