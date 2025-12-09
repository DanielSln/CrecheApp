# Como Resolver o Erro de CORS - PASSO A PASSO

## O Problema
Você tem 2 backends no Vercel, mas o backend de LOGIN não está com CORS configurado corretamente.

## Solução Rápida (3 passos)

### 1. Fazer commit das alterações
```bash
cd c:\Users\12dan\Desktop\p.i\CrecheApp
git add .
git commit -m "fix: Corrigir CORS no backend"
git push
```

### 2. No Vercel (painel web)
1. Acesse: https://vercel.com/dashboard
2. Encontre o projeto: **back-end-crecheapp-26phaqoxn**
3. Clique em "Redeploy" ou espere o deploy automático

### 3. Testar
Após o deploy, teste o login novamente no app.

---

## Alternativa: Usar apenas 1 backend

Se preferir, pode usar apenas o backend de cadastro para TUDO:

**Já está configurado!** O arquivo `environment.ts` já aponta para:
`https://backend-crecheapp-59gt4rjzl-anthony3043s-projects.vercel.app`

Basta fazer deploy desse backend com o `server.js` atualizado.

---

## O que foi corrigido?

✅ CORS configurado para aceitar `https://crecheapp.vercel.app`
✅ Headers CORS atualizados
✅ Rotas do Vercel corrigidas
✅ URL do frontend atualizada para usar backend correto

---

## Ainda com erro?

Se ainda der erro, me envie:
1. Print do erro no console
2. Qual URL está tentando acessar (Network tab)
