# Sistema de Visibilidade de Comunicados - Implementado

## Como funciona:

### 1. Comunicados Gerais (Públicos)
- Quando o docente seleciona "Geral (Todos)", o comunicado fica visível para todos os usuários
- `visibilidade = 'publico'` e `tipo_destinatario = 'geral'`

### 2. Comunicados Individuais (Privados)
- Quando o docente seleciona destinatários específicos (alunos ou docentes), o comunicado fica privado
- `visibilidade = 'privado'` e `tipo_destinatario = 'individual'`
- Apenas o docente que enviou e os destinatários selecionados podem ver

### 3. Controle de Visibilidade
- Tabela `comunicado_visibilidade` controla quem pode ver cada comunicado privado
- Automaticamente adiciona o docente remetente e os destinatários selecionados

## Endpoints atualizados:

### POST /comunicados
- Agora aceita `visibilidade` e `tipo_visibilidade`
- Cria registros de visibilidade para comunicados privados

### GET /comunicados/visiveis
- Novo endpoint que filtra comunicados baseado na visibilidade
- Usado pelo frontend para carregar apenas comunicados que o usuário pode ver

## Para configurar o banco:
1. Execute o script `comunicados_visibilidade_update.sql`
2. Ou acesse: `GET /setup-visibilidade` no backend

## Testando:
1. Docente envia comunicado para "Geral" → Todos veem
2. Docente envia comunicado para aluno específico → Só o docente e o aluno veem
3. Outros usuários não conseguem ver comunicados privados que não são para eles