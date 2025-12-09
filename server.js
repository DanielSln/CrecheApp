const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');

const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Configuração CORS mais robusta
app.use(cors({ 
  origin: function (origin, callback) {
    // Permitir requisições sem origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    // Lista de origens permitidas
    const allowedOrigins = [
      'http://localhost:8100',
      'http://localhost:4200',
      'http://localhost:3000',
      'https://creche-app.vercel.app',
      'https://back-end-crecheapp-26phaqoxn-anthony3043s-projects.vercel.app',
      /\.vercel\.app$/,
      /localhost:\d+/
    ];
    
    const isAllowed = allowedOrigins.some(allowed => {
      if (typeof allowed === 'string') {
        return origin === allowed;
      }
      return allowed.test(origin);
    });
    
    callback(null, isAllowed);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  optionsSuccessStatus: 200
}));

// Middleware adicional para headers CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

const db = mysql.createPool({
  host: process.env.MYSQLHOST || 'localhost',
  user: process.env.MYSQLUSER || 'root',
  password: process.env.MYSQLPASSWORD || 'q1w2e3',
  database: process.env.MYSQLDATABASE || 'PokeCreche',
  port: process.env.MYSQLPORT || 3306,
  connectionLimit: 10
});

db.getConnection((err, connection) => {
  if (err) {
    console.error('Erro ao conectar ao MySQL:', err.message);
  } else {
    console.log('Conectado ao MySQL');
    connection.release();
  }
});



// Servir arquivos estáticos do Angular
app.use(express.static(path.join(__dirname, 'www')));

// Rota para servir o app Angular
app.get('/', (req, res) => {
  try {
    res.sendFile(path.join(__dirname, 'www', 'index.html'));
  } catch (error) {
    console.error('Erro ao servir index.html:', error);
    res.status(200).send('PokeCreche API está funcionando!');
  }
});

// Função para validar CPF
function validarCPF(cpf) {
  cpf = cpf.replace(/[^\d]/g, '');
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
  
  let soma = 0;
  for (let i = 0; i < 9; i++) soma += parseInt(cpf.charAt(i)) * (10 - i);
  let resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.charAt(9))) return false;
  
  soma = 0;
  for (let i = 0; i < 10; i++) soma += parseInt(cpf.charAt(i)) * (11 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.charAt(10))) return false;
  
  return true;
}

app.post('/register/aluno', (req, res) => {
  const { nome, cpf } = req.body || {};
  if (!nome || !cpf) {
    return res.status(400).json({ message: 'Campos nome e cpf são obrigatórios' });
  }

  // Validar CPF
  if (!validarCPF(cpf)) {
    return res.status(400).json({ message: 'CPF inválido' });
  }

  // Gerar matrícula automaticamente
  db.query('SELECT COUNT(*) as total FROM alunos', (err, countResult) => {
    if (err) {
      return res.status(500).json({ message: 'Erro ao gerar matrícula', error: err.message });
    }

    const matricula = String(countResult[0].total + 1).padStart(6, '0');

    const sql = 'INSERT INTO alunos (nome, cpf, matricula) VALUES (?, ?, ?)';
    db.query(sql, [nome, cpf, matricula], (err, result) => {
      if (err) {
        console.error('Erro ao inserir aluno:', err);
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(409).json({ message: 'Aluno já cadastrado', error: err.message });
        }
        return res.status(500).json({ message: 'Erro ao cadastrar aluno', error: err.message });
      }
      return res.status(201).json({ message: 'Aluno cadastrado', id: result.insertId, matricula });
    });
  });
});

app.post('/register/docente', async (req, res) => {
  const { nome, senha } = req.body || {};
  if (!nome || !senha) {
    return res.status(400).json({ message: 'Campos nome e senha são obrigatórios' });
  }

  try {
    // Gerar identificador automaticamente
    db.query('SELECT COUNT(*) as total FROM docentes', async (err, countResult) => {
      if (err) {
        return res.status(500).json({ message: 'Erro ao gerar identificador', error: err.message });
      }

      const identificador = 'DOC' + String(countResult[0].total + 1).padStart(4, '0');
      const hashed = await bcrypt.hash(senha, 10);
      
      const sql = 'INSERT INTO docentes (nome, identificador, senha) VALUES (?, ?, ?)';
      db.query(sql, [nome, identificador, hashed], (err, result) => {
        if (err) {
          console.error('Erro ao inserir docente:', err);
          if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'Identificador já existe', error: err.message });
          }
          return res.status(500).json({ message: 'Erro ao cadastrar docente', error: err.message });
        }
        return res.status(201).json({ message: 'Docente cadastrado', id: result.insertId, identificador });
      });
    });
  } catch (e) {
    console.error('Erro ao hashear senha:', e);
    return res.status(500).json({ message: 'Erro interno', error: e.message });
  }
});

app.post('/login/aluno', (req, res) => {
  const { matricula, cpf } = req.body || {};

  if (!matricula || !cpf) {
    return res.status(400).json({ 
      success: false,
      message: 'Matrícula e CPF são obrigatórios' 
    });
  }

  const sql = 'SELECT * FROM alunos WHERE matricula = ? AND cpf = ?';
  db.query(sql, [matricula, cpf], (err, result) => {
    if (err) {
      return res.status(500).json({ 
        success: false,
        message: 'Erro no servidor' 
      });
    }

    if (result.length > 0) {
      const aluno = result[0];
      const token = 'token_' + aluno.id;

      res.json({ 
        success: true,
        message: 'Login realizado com sucesso',
        token,
        user: {
          id: aluno.id,
          nome: aluno.nome,
          matricula: aluno.matricula,
          cpf: aluno.cpf
        }
      });
    } else {
      res.status(401).json({ 
        success: false,
        message: 'Matrícula ou CPF inválidos' 
      });
    }
  });
});

app.post('/login/docente', async (req, res) => {
  const { identificador, senha } = req.body || {};
  
  console.log('Tentativa de login:', { identificador, senha: senha ? '***' : 'undefined' });

  if (!identificador || !senha) {
    return res.status(400).json({ 
      success: false,
      message: 'Identificador e senha são obrigatórios' 
    });
  }

  const sql = 'SELECT * FROM docentes WHERE identificador = ?';
  db.query(sql, [identificador], async (err, result) => {
    if (err) {
      console.error('Erro na consulta:', err);
      return res.status(500).json({ 
        success: false,
        message: 'Erro no servidor' 
      });
    }
    
    console.log('Docentes encontrados:', result.length);

    if (result.length > 0) {
      const docente = result[0];
      console.log('Docente encontrado:', docente.identificador);
      const senhaValida = await bcrypt.compare(senha, docente.senha);
      console.log('Senha válida:', senhaValida);

      if (senhaValida) {
        const token = 'token_' + docente.id;

        res.json({ 
          success: true,
          message: 'Login realizado com sucesso',
          token,
          user: {
            id: docente.id,
            nome: docente.nome,
            identificador: docente.identificador
          }
        });
      } else {
        res.status(401).json({ 
          success: false,
          message: 'Identificador ou senha inválidos' 
        });
      }
    } else {
      console.log('Nenhum docente encontrado com identificador:', identificador);
      res.status(401).json({ 
        success: false,
        message: 'Identificador ou senha inválidos' 
      });
    }
  });
});

// Alunos
app.get('/alunos', (req, res) => {
  db.query('SELECT id, nome, matricula, cpf, avatar FROM alunos', (err, result) => {
    if (err) return res.status(500).json({ message: 'Erro ao buscar alunos' });
    res.json(result);
  });
});

app.put('/alunos/:id/avatar', (req, res) => {
  const { avatar } = req.body;
  db.query('UPDATE alunos SET avatar = ? WHERE id = ?', [avatar, req.params.id], (err) => {
    if (err) {
      console.error('Erro ao atualizar avatar do aluno:', err);
      return res.status(500).json({ message: 'Erro ao atualizar avatar', error: err.message });
    }
    res.json({ message: 'Avatar atualizado' });
  });
});

// Docentes
app.get('/docentes', (req, res) => {
  db.query('SELECT id, nome, identificador, email, avatar FROM docentes', (err, result) => {
    if (err) return res.status(500).json({ message: 'Erro ao buscar docentes' });
    res.json(result);
  });
});

// Endpoint temporário para debug - listar todos os docentes
app.get('/debug/docentes', (req, res) => {
  db.query('SELECT id, nome, identificador FROM docentes', (err, result) => {
    if (err) return res.status(500).json({ message: 'Erro ao buscar docentes' });
    res.json(result);
  });
});

app.put('/docentes/:id/avatar', (req, res) => {
  const { avatar } = req.body;
  db.query('UPDATE docentes SET avatar = ? WHERE id = ?', [avatar, req.params.id], (err) => {
    if (err) {
      console.error('Erro ao atualizar avatar do docente:', err);
      return res.status(500).json({ message: 'Erro ao atualizar avatar', error: err.message });
    }
    res.json({ message: 'Avatar atualizado' });
  });
});

// Turmas
app.get('/turmas', (req, res) => {
  db.query('SELECT * FROM turmas', (err, result) => {
    if (err) return res.status(500).json({ message: 'Erro ao buscar turmas' });
    res.json(result);
  });
});

app.post('/turmas', (req, res) => {
  const { nome, ano } = req.body;
  db.query('INSERT INTO turmas (nome, ano) VALUES (?, ?)', [nome, ano], (err, result) => {
    if (err) return res.status(500).json({ message: 'Erro ao criar turma' });
    res.json({ id: result.insertId, nome, ano });
  });
});

app.put('/turmas/:id', (req, res) => {
  const { nome, ano } = req.body;
  db.query('UPDATE turmas SET nome = ?, ano = ? WHERE id = ?', [nome, ano, req.params.id], (err) => {
    if (err) return res.status(500).json({ message: 'Erro ao atualizar turma' });
    res.json({ message: 'Turma atualizada' });
  });
});

app.delete('/turmas/:id', (req, res) => {
  db.query('DELETE FROM turmas WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ message: 'Erro ao excluir turma' });
    res.json({ message: 'Turma excluída' });
  });
});

// Alunos por Turma
app.get('/turmas/:id/alunos', (req, res) => {
  const sql = `SELECT a.* FROM alunos a 
    INNER JOIN turma_alunos ta ON a.id = ta.aluno_id 
    WHERE ta.turma_id = ?`;
  db.query(sql, [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ message: 'Erro ao buscar alunos da turma' });
    res.json(result);
  });
});

app.post('/turmas/:id/alunos', (req, res) => {
  const { aluno_id } = req.body;
  
  // Simplesmente adiciona o aluno, ignorando se já existe
  db.query('INSERT IGNORE INTO turma_alunos (turma_id, aluno_id) VALUES (?, ?)', [req.params.id, aluno_id], (err) => {
    if (err) return res.status(500).json({ message: 'Erro ao adicionar aluno' });
    res.json({ message: 'Aluno adicionado' });
  });
});

app.delete('/turmas/:turmaId/alunos/:alunoId', (req, res) => {
  db.query('DELETE FROM turma_alunos WHERE turma_id = ? AND aluno_id = ?', [req.params.turmaId, req.params.alunoId], (err) => {
    if (err) return res.status(500).json({ message: 'Erro ao remover aluno' });
    res.json({ message: 'Aluno removido' });
  });
});

// Endpoint para atualizar turma do aluno
app.put('/alunos/:id/turma', (req, res) => {
  const { turma_id } = req.body;
  if (turma_id === null) {
    // Remove aluno de qualquer turma
    db.query('DELETE FROM turma_alunos WHERE aluno_id = ?', [req.params.id], (err) => {
      if (err) return res.status(500).json({ message: 'Erro ao remover aluno da turma' });
      res.json({ message: 'Aluno removido de todas as turmas' });
    });
  } else {
    // Atualiza turma do aluno
    db.query('INSERT INTO turma_alunos (turma_id, aluno_id) VALUES (?, ?) ON DUPLICATE KEY UPDATE turma_id = ?', [turma_id, req.params.id, turma_id], (err) => {
      if (err) return res.status(500).json({ message: 'Erro ao atualizar turma do aluno' });
      res.json({ message: 'Turma do aluno atualizada' });
    });
  }
});

// Comunicados
app.get('/comunicados', (req, res) => {
  const { user_id, user_type, docente_id } = req.query;
  
  if (docente_id) {
    // Buscar comunicados de um docente específico
    const sql = 'SELECT *, data_evento as data FROM comunicados WHERE docente_id = ? ORDER BY created_at DESC';
    db.query(sql, [docente_id], (err, result) => {
      if (err) return res.status(500).json({ message: 'Erro ao buscar comunicados' });
      res.json(result);
    });
  } else if (user_id && user_type) {
    // Buscar comunicados filtrados por destinatário
    const sql = `
      SELECT DISTINCT c.*, c.data_evento as data FROM comunicados c
      INNER JOIN comunicado_destinatarios cd ON c.id = cd.comunicado_id
      WHERE cd.tipo = 'geral' 
         OR (cd.tipo = ? AND cd.destinatario_id = ?)
      ORDER BY c.created_at DESC
    `;
    db.query(sql, [user_type, user_id], (err, result) => {
      if (err) return res.status(500).json({ message: 'Erro ao buscar comunicados' });
      res.json(result);
    });
  } else {
    // Buscar todos os comunicados
    db.query('SELECT *, data_evento as data FROM comunicados ORDER BY created_at DESC', (err, result) => {
      if (err) return res.status(500).json({ message: 'Erro ao buscar comunicados' });
      res.json(result);
    });
  }
});

// Novo endpoint para comunicados com controle de visibilidade
app.get('/comunicados/visiveis', (req, res) => {
  const { user_id, user_type } = req.query;
  
  if (!user_id || !user_type) {
    return res.status(400).json({ message: 'user_id e user_type são obrigatórios' });
  }
  
  const sql = `
    SELECT DISTINCT c.*, c.data_evento as data FROM comunicados c
    LEFT JOIN comunicado_destinatarios cd ON c.id = cd.comunicado_id
    LEFT JOIN comunicado_visibilidade cv ON c.id = cv.comunicado_id AND cv.user_type = ? AND cv.user_id = ?
    WHERE 
      (c.visibilidade = 'publico' AND cd.tipo = 'geral') OR
      (c.visibilidade = 'privado' AND cv.pode_visualizar = true) OR
      (cd.tipo = ? AND cd.destinatario_id = ?)
    ORDER BY c.created_at DESC
  `;
  
  db.query(sql, [user_type, user_id, user_type, user_id], (err, result) => {
    if (err) return res.status(500).json({ message: 'Erro ao buscar comunicados visíveis' });
    res.json(result);
  });
});

app.post('/comunicados', (req, res) => {
  const { docente_id, title, subject, message, destinatarios, cc, bcc, icon, tipo, data } = req.body;
  
  if (!docente_id || !title || !message) {
    return res.status(400).json({ message: 'Campos obrigatórios: docente_id, title, message' });
  }
  
  const sql = 'INSERT INTO comunicados (docente_id, title, subject, message, destinatarios, cc, bcc, icon, tipo, data_evento) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
  db.query(sql, [docente_id, title, subject || title, message, destinatarios || '', cc || '', bcc || '', icon || '📝', tipo || 'default', data || null], (err, result) => {
    if (err) {
      console.error('Erro ao criar comunicado:', err);
      return res.status(500).json({ message: 'Erro ao criar comunicado', error: err.message });
    }
    
    res.json({ id: result.insertId, message: 'Comunicado criado com sucesso' });
  });
});

app.put('/comunicados/:id', (req, res) => {
  const { title, subject, message, destinatarios, cc, bcc, icon, data } = req.body;
  const sql = 'UPDATE comunicados SET title = ?, subject = ?, message = ?, destinatarios = ?, cc = ?, bcc = ?, icon = ?, data_evento = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
  db.query(sql, [title, subject, message, destinatarios, cc, bcc, icon, data || null, req.params.id], (err) => {
    if (err) {
      console.error('Erro ao atualizar comunicado:', err);
      return res.status(500).json({ message: 'Erro ao atualizar comunicado', error: err.message });
    }
    res.json({ message: 'Comunicado atualizado com sucesso' });
  });
});

app.delete('/comunicados/:id', (req, res) => {
  db.query('DELETE FROM comunicados WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ message: 'Erro ao excluir comunicado' });
    res.json({ message: 'Comunicado excluído' });
  });
});

// Rascunhos
app.get('/rascunhos/:docente_id', (req, res) => {
  db.query('SELECT * FROM rascunhos WHERE docente_id = ? ORDER BY saved_at DESC', [req.params.docente_id], (err, result) => {
    if (err) return res.status(500).json({ message: 'Erro ao buscar rascunhos' });
    res.json(result);
  });
});

app.post('/rascunhos', (req, res) => {
  const { docente_id, title, subject, message, destinatarios, cc, bcc, icon } = req.body;
  const sql = 'INSERT INTO rascunhos (docente_id, title, subject, message, destinatarios, cc, bcc, icon) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
  db.query(sql, [docente_id, title, subject, message, destinatarios, cc, bcc, icon], (err, result) => {
    if (err) return res.status(500).json({ message: 'Erro ao salvar rascunho' });
    res.json({ id: result.insertId });
  });
});

app.delete('/rascunhos/:id', (req, res) => {
  db.query('DELETE FROM rascunhos WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ message: 'Erro ao excluir rascunho' });
    res.json({ message: 'Rascunho excluído' });
  });
});

// Registros de Alunos
app.get('/registros/:aluno_id', (req, res) => {
  db.query('SELECT * FROM registros_alunos WHERE aluno_id = ? ORDER BY data DESC', [req.params.aluno_id], (err, result) => {
    if (err) return res.status(500).json({ message: 'Erro ao buscar registros' });
    res.json(result);
  });
});

app.post('/registros', (req, res) => {
  const { aluno_id, turma_id, data, alimentacao, comportamento, presenca, observacoes } = req.body;
  const sql = 'INSERT INTO registros_alunos (aluno_id, turma_id, data, alimentacao, comportamento, presenca, observacoes) VALUES (?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE alimentacao = ?, comportamento = ?, presenca = ?, observacoes = ?';
  db.query(sql, [aluno_id, turma_id, data, alimentacao, comportamento, presenca, observacoes, alimentacao, comportamento, presenca, observacoes], (err, result) => {
    if (err) return res.status(500).json({ message: 'Erro ao salvar registro' });
    res.json({ id: result.insertId });
  });
});

// Eventos do Calendário
app.get('/eventos', (req, res) => {
  db.query('SELECT date, title, color FROM calendario_events', (err, result) => {
    if (err) return res.status(500).json({ message: 'Erro ao buscar eventos' });
    res.json(result);
  });
});

app.post('/eventos', (req, res) => {
  const { date, title, color } = req.body;
  if (!date) {
    return res.status(400).json({ message: 'Campo obrigatório: date' });
  }
  const eventTitle = title || '';
  const eventColor = color || 'blue';
  const sql = 'INSERT INTO calendario_events (teacher_id, date, title, color) VALUES (NULL, ?, ?, ?) ON DUPLICATE KEY UPDATE title = ?, color = ?';
  db.query(sql, [date, eventTitle, eventColor, eventTitle, eventColor], (err, result) => {
    if (err) {
      console.error('Erro ao salvar evento:', err);
      return res.status(500).json({ message: 'Erro ao salvar evento', error: err.message });
    }
    res.json({ message: 'Evento salvo', id: result.insertId });
  });
});

app.delete('/eventos/:date', (req, res) => {
  db.query('DELETE FROM calendario_events WHERE date = ? AND teacher_id IS NULL', [req.params.date], (err) => {
    if (err) return res.status(500).json({ message: 'Erro ao remover evento' });
    res.json({ message: 'Evento removido' });
  });
});

// Termos Aceitos
app.post('/termos', (req, res) => {
  const { user_type, user_id, ip_address } = req.body;
  const sql = 'INSERT INTO termos_aceitos (user_type, user_id, aceito, ip_address) VALUES (?, ?, TRUE, ?) ON DUPLICATE KEY UPDATE aceito = TRUE, data_aceite = CURRENT_TIMESTAMP';
  db.query(sql, [user_type, user_id, ip_address], (err) => {
    if (err) return res.status(500).json({ message: 'Erro ao salvar aceite de termos' });
    res.json({ message: 'Termos aceitos' });
  });
});

app.get('/termos/:user_type/:user_id', (req, res) => {
  db.query('SELECT aceito FROM termos_aceitos WHERE user_type = ? AND user_id = ?', [req.params.user_type, req.params.user_id], (err, result) => {
    if (err) return res.status(500).json({ message: 'Erro ao verificar termos' });
    res.json({ aceito: result.length > 0 && result[0].aceito });
  });
});

// Fallback para rotas do Angular (SPA)
app.use((req, res, next) => {
  // Não interceptar rotas da API
  if (req.path.startsWith('/api') || req.path.startsWith('/login') || req.path.startsWith('/register') || 
      req.path.startsWith('/alunos') || req.path.startsWith('/docentes') || req.path.startsWith('/turmas') || 
      req.path.startsWith('/comunicados') || req.path.startsWith('/rascunhos') || req.path.startsWith('/registros') || 
      req.path.startsWith('/eventos') || req.path.startsWith('/termos') || req.path.startsWith('/setup')) {
    return next();
  }
  res.sendFile(path.join(__dirname, 'www', 'index.html'));
});

// Endpoint temporário para modificar colunas avatar para LONGTEXT
app.get('/setup-avatar-columns', (req, res) => {
  db.query('ALTER TABLE alunos MODIFY COLUMN avatar LONGTEXT', (err1) => {
    db.query('ALTER TABLE docentes MODIFY COLUMN avatar LONGTEXT', (err2) => {
      const msg1 = err1 ? err1.message : 'OK';
      const msg2 = err2 ? err2.message : 'OK';
      res.json({ success: true, alunos: msg1, docentes: msg2 });
    });
  });
});

// Endpoint para criar tabela turma_alunos
app.get('/setup-turma-alunos', (req, res) => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS turma_alunos (
      id INT AUTO_INCREMENT PRIMARY KEY,
      turma_id INT NOT NULL,
      aluno_id INT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (turma_id) REFERENCES turmas(id) ON DELETE CASCADE,
      FOREIGN KEY (aluno_id) REFERENCES alunos(id) ON DELETE CASCADE,
      UNIQUE KEY unique_aluno_turma (aluno_id)
    )
  `;
  
  db.query(createTableQuery, (err) => {
    if (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
    res.json({ success: true, message: 'Tabela turma_alunos criada/verificada com sucesso' });
  });
});

// Endpoint para limpar alunos órfãos (vinculados a turmas que não existem)
app.get('/limpar-alunos-orfaos', (req, res) => {
  const query = `
    DELETE ta FROM turma_alunos ta
    LEFT JOIN turmas t ON ta.turma_id = t.id
    WHERE t.id IS NULL
  `;
  
  db.query(query, (err, result) => {
    if (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
    res.json({ 
      success: true, 
      message: `${result.affectedRows} alunos órfãos removidos com sucesso` 
    });
  });
});

// Endpoint alternativo para limpar TODOS os vínculos de turma_alunos
app.get('/reset-turma-alunos', (req, res) => {
  db.query('DELETE FROM turma_alunos', (err, result) => {
    if (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
    res.json({ 
      success: true, 
      message: `Todos os vínculos removidos: ${result.affectedRows} registros` 
    });
  });
});

// Endpoint para configurar tabelas de visibilidade
app.get('/setup-visibilidade', (req, res) => {
  const queries = [
    'ALTER TABLE comunicados ADD COLUMN IF NOT EXISTS tipo_destinatario ENUM(\'geral\', \'individual\', \'grupo\') DEFAULT \'geral\'',
    'ALTER TABLE comunicados ADD COLUMN IF NOT EXISTS visibilidade ENUM(\'publico\', \'privado\') DEFAULT \'publico\'',
    'ALTER TABLE comunicados ADD COLUMN IF NOT EXISTS data_evento DATE NULL',
    `CREATE TABLE IF NOT EXISTS comunicado_visibilidade (
      id INT AUTO_INCREMENT PRIMARY KEY,
      comunicado_id INT NOT NULL,
      user_type ENUM('aluno', 'docente') NOT NULL,
      user_id INT NOT NULL,
      pode_visualizar BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (comunicado_id) REFERENCES comunicados(id) ON DELETE CASCADE,
      UNIQUE KEY unique_comunicado_user (comunicado_id, user_type, user_id)
    )`,
    'CREATE INDEX IF NOT EXISTS idx_visibilidade_comunicado ON comunicado_visibilidade(comunicado_id)',
    'CREATE INDEX IF NOT EXISTS idx_visibilidade_user ON comunicado_visibilidade(user_type, user_id)'
  ];
  
  let results = [];
  let completed = 0;
  
  queries.forEach((query, index) => {
    db.query(query, (err) => {
      results[index] = err ? err.message : 'OK';
      completed++;
      if (completed === queries.length) {
        res.json({ success: true, results });
      }
    });
  });
});

// Função para limpar comunicados antigos (3 semanas)
function limparComunicadosAntigos() {
  const sql = 'DELETE FROM comunicados WHERE created_at < DATE_SUB(NOW(), INTERVAL 21 DAY)';
  db.query(sql, (err, result) => {
    if (err) {
      console.error('Erro ao limpar comunicados antigos:', err);
    } else {
      console.log(`${result.affectedRows} comunicados antigos removidos`);
    }
  });
}

// Executar limpeza a cada 24 horas
setInterval(limparComunicadosAntigos, 24 * 60 * 60 * 1000);

// Endpoint manual para limpeza
app.get('/limpar-comunicados-antigos', (req, res) => {
  const sql = 'DELETE FROM comunicados WHERE created_at < DATE_SUB(NOW(), INTERVAL 21 DAY)';
  db.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
    res.json({ 
      success: true, 
      message: `${result.affectedRows} comunicados antigos removidos` 
    });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  // Executar limpeza na inicialização
  limparComunicadosAntigos();
});