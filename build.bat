@echo off
echo Iniciando build do CrecheApp...

echo.
echo 1. Instalando dependencias...
call npm install

echo.
echo 2. Fazendo build do Angular...
call ng build --configuration production

echo.
echo 3. Build concluido!
echo Os arquivos estao na pasta www/
echo.
echo Para fazer deploy no Vercel:
echo vercel --prod
pause