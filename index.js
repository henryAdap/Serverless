const express = require('express')
const serverless = require('serverless-http')
const bodyParser = require('body-parser')
const pool = require('./configs/dbConfig')

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/henry/', (req, res) => {
  const query = 'SELECT * FROM employee'
  pool.query(query, (err, results, fields) => {
    if (err) {
      const response = { data: null, message: err.message, }
      res.send(response)
    }

    const employee = [...results]
    const response = {
      data: employee,
      message: 'All employee adap successfully retrieved.',
    }
    res.send(response)
  })
})

app.get('/henry/:id', (req, res) => {
  const id = req.params.id
  const query = `SELECT * FROM employee WHERE id=${id}`
  pool.query(query, (err, results, fields) => {
    if (err) {
      const response = { data: null, message: err.message, }
      res.send(response)
    }

    const employee = results[0]
    const response = {
      data: employee,
      message: `Employees ${employee.name} successfully retrieved.`,
    }
    res.status(200).send(response)
  })
})

app.post('/henry/', (req, res) => {
  const { name, height, weight, avatar } = req.body

  // const query = `INSERT INTO employee (name,) VALUES ('${name}', '${height}', '${weight}', '${avatar}')`
  const query = `INSERT INTO employee (name) VALUES ('${name}')`
  pool.query(query, (err, results, fields) => {
    if (err) {
      const response = { data: null, message: err.message, }
      res.send(response)
    }

    const { insertId } = results
    const employee = { id: insertId, name }
    const response = {
      data: employee,
      message: `${name} successfully added to adap.`,
    }
    res.status(201).send(response)
  })
})

app.put('/henry/:id', (req, res) => {
  const { id } = req.params
  const query = `SELECT * FROM employee WHERE id=${id} LIMIT 1`
  pool.query(query, (err, results, fields) => {
    if (err) {
      const response = { data: null, message: err.message, }
      res.send(response)
    }

    const { id, name, height, weight, avatar } = { ...results[0], ...req.body }
    // const query = `UPDATE employee SET name='${name}', height='${height}', weight='${weight}', avatar='${avatar}' WHERE id='${id}'`
    const query = `UPDATE employee SET name='${name}' WHERE id='${id}'`
    pool.query(query, (err, results, fields) => {
      if (err) {
        const response = { data: null, message: err.message, }
        res.send(response)
      }

      const employee = {
        id,
        name
      }
      const response = {
        data: employee,
        message: `${name} info is successfully updated.`,
      }
      res.send(response)
    })
  })
})

app.delete('/henry/:id', (req, res) => {
  const { id } = req.params
  const query = `DELETE FROM employee WHERE id=${id}`
  pool.query(query, (err, results, fields) => {
    if (err) {
      const response = { data: null, message: err.message }
      res.send(response)
    }

    const response = {
      data: null,
      message: `Employee with id: ${id} successfully deleted.`,
    }
    res.send(response)
  })
})

// Handle in-valid route
app.all('*', function(req, res) {
  const response = { data: null, message: 'Route not found!!' }
  res.status(400).send(response)
})

// wrap express app instance with serverless http function
module.exports.handler = serverless(app)
