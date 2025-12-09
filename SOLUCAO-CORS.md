# Solução para Erros de CORS e Conexão

## Problemas Identificados

1. **Erro de CORS**: Bloqueio de requisições XMLHttpRequest
2. **URL inconsistente**: Frontend e proxy apontando para URLs diferentes do backend
3. **Configuração Vercel**: Falta de headers CORS adequados

## Correções Aplicadas

### 1. Atualização do environment.ts
- URL do backend corrigida para: `https://back-end-crecheapp-26phaqoxn-anthony3043s-projects.vercel.app`

### 2. Atualização do vercel.json (Frontend)
- Adicionados headers CORS globais
- Configuração de rotas otimizada

### 3. Criação do vercel-backend.json
- Arquivo específico para deploy do backend
- Headers CORS configurados corretamente

## Próximos Passos

### Para o Backend (Vercel)

1. Acesse o projeto do backend no Vercel
2. Vá em Settings > General > Build & Development Settings
3. Configure:
   - **Build Command**: (deixe vazio)
   - **Output Directory**: (deixe vazio)
   - **Install Command**: `npm install`

4. Vá em Settings > Environment Variables e adicione:
   ```
   MYSQLHOST=seu_host
   MYSQLUSER=seu_usuario
   MYSQLPASSWORD=sua_senha
   MYSQLDATABASE=PokeCreche
   MYSQLPORT=3306
   ```

5. Faça o redeploy do backend usando o arquivo `vercel-backend.json`:
   ```bash
   cd C:\Users\12dan\Desktop\p.i\CrecheApp
   vercel --prod --yes -A vercel-backend.json
   ```

### Para o Frontend (Vercel)

1. Faça o build do projeto:
   ```bash
   npm run build
   ```

2. Faça o deploy:
   ```bash
   vercel --prod --yes
   ```

### Teste Local

Para testar localmente antes do deploy:

```bash
# Terminal 1 - Backend
node server.js

# Terminal 2 - Frontend
ionic serve
```

## Verificação

Após o deploy, teste:

1. Acesse: `https://seu-backend.vercel.app/api/health`
   - Deve retornar: `{"status":"healthy","message":"API funcionando corretamente"}`

2. Teste o login no frontend
   - Verifique o console do navegador (F12)
   - Não deve haver mais erros de CORS

## Alternativa: Usar Domínio Personalizado

Se os erros persistirem, considere:

1. Configurar um domínio personalizado no Vercel
2. Usar o mesmo domínio para frontend e backend (subdomínios)
   - Frontend: `app.seudominio.com`
   - Backend: `api.seudominio.com`

Isso elimina completamente problemas de CORS.
