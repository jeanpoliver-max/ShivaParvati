# Instruções do Usuário para o Agente

Sempre que gerar ou modificar o código deste projeto, você DEVE seguir rigorosamente as seguintes regras de arquitetura e deploy:

## 1. ARQUITETURA DE IMAGENS (OBRIGATÓRIO):
- Nunca salve ou referencie imagens locais dentro da pasta `src/` ou `src/assets/`.
- Todas as imagens estáticas do projeto (ex: fotos de produtos, logos, fundos) devem ser referenciadas como se estivessem na raiz do servidor público.
- O formato correto do caminho de QUALQUER imagem no código deve ser sempre iniciando com uma barra seguidamente do nome do arquivo. Exemplo: `src="/nome_da_imagem.png"`.

## 2. ARQUIVO DE CONFIGURAÇÃO DO VITE:
- O arquivo `vite.config.ts` deve sempre conter a propriedade `base: "/"` definida dentro do retorno do `defineConfig`, garantindo compatibilidade com o deploy em domínio próprio no GitHub Pages via GitHub Actions.

## 3. LINKS DE CATEGORIAS E SERVIÇOS (FIREBASE/PROVEDORES):
- Caso precise injetar ou tratar URLs de imagens externas (como Imgur), certifique-se de usar o link direto da imagem pura (adicionando o subdomínio `i.` e a extensão do arquivo, ex: `https://i.imgur.com/ID_DA_IMAGEM.png`) e nunca o link da página do álbum/site do Imgur.

## 4. COMPATIBILIDADE COM DEPLOY:
- Escreva o código sabendo que o ambiente final de produção utiliza Node 20, Vite e GitHub Actions para compilação automatizada. Evite o uso de caminhos relativos complexos que quebrem durante o processo de `npm run build`.

## 5. INTEGRAÇÃO COM INDEX.HTML:
- O arquivo `index.html` na raiz do projeto DEVE sempre apontar para o script principal usando o caminho relativo com ponto: `src="./src/main.tsx"`. Nunca remova esse ponto, pois ele é vital para o compilador do Vite no GitHub Actions localizar o ponto de entrada do React.

## 6. PROIBIÇÃO ABSOLUTA DE APAGAR DIRETÓRIOS DO GITHUB:
- A pasta `.github` e todos os ficheiros dentro de `.github/workflows/` (como `deploy.yml` e `sync-to-producao.yml`) são VITAIS para o funcionamento do site no servidor.
- O AI Studio está PROIBIDO de deletar, remover, omitir ou limpar estes ficheiros e pastas durante os processos de transição, escrita, leitura ou sincronização (Sync/Push). Mantenha-os sempre intactos na estrutura do projeto e nunca modifique ou exclua arquivos relacionados ao GitHub Actions.
