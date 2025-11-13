-- Adicionar coluna avatar nas tabelas alunos e docentes
-- Execute este script no Railway MySQL

USE railway;

-- Adicionar coluna avatar na tabela alunos (se não existir)
ALTER TABLE alunos ADD COLUMN IF NOT EXISTS avatar TEXT;

-- Adicionar coluna avatar na tabela docentes (se não existir)
ALTER TABLE docentes ADD COLUMN IF NOT EXISTS avatar TEXT;
