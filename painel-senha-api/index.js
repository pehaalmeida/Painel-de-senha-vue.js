const express = require('express')
const sqlite3 = require('sqlite3').verbose()
const cors = require('cors')

const app = express()
const PORT = 3000

app.use(cors())
app.use(express.json())

// Conexão com banco SQLite
const db = new sqlite3.Database('senhas.db')

// Cria a tabela de senhas, se não existir
db.run(`CREATE TABLE IF NOT EXISTS senhas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tipo TEXT,
  codigo TEXT,
  chamada INTEGER DEFAULT 0,
  guiche TEXT
)`)

// Rota para adicionar senha
app.post('/senha', (req, res) => {
  const { tipo, codigo } = req.body
  db.run("INSERT INTO senhas (tipo, codigo) VALUES (?, ?)", [tipo, codigo])
  res.sendStatus(201)
})

// Rota para chamar próxima senha
app.get('/senha/proxima', (req, res) => {
  const guiche = req.query.guiche || '1'

  db.get(`
    SELECT * FROM senhas
    WHERE chamada = 0
    ORDER BY CASE tipo WHEN 'preferencial' THEN 0 ELSE 1 END, id ASC
    LIMIT 1
  `, (err, row) => {
    if (row) {
      // salva chamada e guichê
      db.run("UPDATE senhas SET chamada = 1, guiche = ? WHERE id = ?", [guiche, row.id])
      res.json({ ...row, guiche })
    } else {
      res.status(204).send()
    }
  })
})

// Rota para ver última senha chamada
app.get('/senha/ultima', (req, res) => {
  db.get("SELECT * FROM senhas WHERE chamada = 1 ORDER BY id DESC LIMIT 1", (err, row) => {
    if (row) res.json(row)
    else res.status(204).send()
  })
})

// IMPORTANTE: iniciar o servidor!
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`)
})

// Rota para listar as últimas senhas chamadas (histórico)
app.get('/historico', (req, res) => {
  db.all(`
    SELECT * FROM senhas
    WHERE chamada = 1
    ORDER BY id DESC
    LIMIT 20
  `, (err, rows) => {
    if (err) return res.status(500).send(err.message)
    res.json(rows)
  })
})

// Rota para listar todas as senhas na fila
app.get('/fila', (req, res) => {
  db.all(`
    SELECT * FROM senhas
    WHERE chamada = 0
    ORDER BY id ASC
    LIMIT 20
  `, (err, rows) => {
    if (err) return res.status(500).send(err.message)
    res.json(rows)
  })
})

