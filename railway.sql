-- Copiar estrutura e dados
CREATE TABLE railway.alunos LIKE PokeCreche.alunos;
INSERT INTO railway.alunos SELECT * FROM PokeCreche.alunos;

CREATE TABLE railway.docentes LIKE PokeCreche.docentes;
INSERT INTO railway.docentes SELECT * FROM PokeCreche.docentes;

CREATE TABLE railway.turmas LIKE PokeCreche.turmas;
INSERT INTO railway.turmas SELECT * FROM PokeCreche.turmas;

CREATE TABLE railway.turma_alunos LIKE PokeCreche.turma_alunos;
INSERT INTO railway.turma_alunos SELECT * FROM PokeCreche.turma_alunos;

CREATE TABLE railway.calendario_events LIKE PokeCreche.calendario_events;
INSERT INTO railway.calendario_events SELECT * FROM PokeCreche.calendario_events;

CREATE TABLE railway.comunicados LIKE PokeCreche.comunicados;
INSERT INTO railway.comunicados SELECT * FROM PokeCreche.comunicados;

CREATE TABLE railway.comunicado_destinatarios LIKE PokeCreche.comunicado_destinatarios;
INSERT INTO railway.comunicado_destinatarios SELECT * FROM PokeCreche.comunicado_destinatarios;

CREATE TABLE railway.rascunhos LIKE PokeCreche.rascunhos;
INSERT INTO railway.rascunhos SELECT * FROM PokeCreche.rascunhos;

CREATE TABLE railway.registros_alunos LIKE PokeCreche.registros_alunos;
INSERT INTO railway.registros_alunos SELECT * FROM PokeCreche.registros_alunos;

CREATE TABLE railway.termos_aceitos LIKE PokeCreche.termos_aceitos;
INSERT INTO railway.termos_aceitos SELECT * FROM PokeCreche.termos_aceitos;

CREATE TABLE railway.sessoes LIKE PokeCreche.sessoes;
INSERT INTO railway.sessoes SELECT * FROM PokeCreche.sessoes;

USE railway;
SELECT * FROM alunos;
select * from docentes;
select * from calendario_events;

ALTER TABLE railway.comunicados ADD COLUMN data DATE;
