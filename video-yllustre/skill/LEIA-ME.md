# Criador de vídeos — instalação no Codex

Este pacote contém a skill completa: SKILL.md, metadados em agents/, quatro referências e o script de verificação de vídeo. Os sete arquivos originais foram preservados.

## Como instalar

1. Extraia este ZIP.
2. Copie a pasta inteira `criador-de-videos` para a pasta de skills do seu usuário: `~/.agents/skills/`. Crie esse diretório se necessário. O arquivo principal deve ficar em `~/.agents/skills/criador-de-videos/SKILL.md`.
3. Se já existir uma skill com esse nome, guarde uma cópia antes de substituir.
4. Abra o Codex. Se a skill não aparecer, reinicie o Codex.
5. Em um chat, use `$criador-de-videos` junto com o pedido.

Também é possível instalar apenas para um projeto, copiando a pasta para `.agents/skills/` na raiz desse projeto.

Se preferir pedir a instalação ao Codex, informe o caminho do ZIP salvo no computador e escreva:

> Instale a skill deste ZIP em ~/.agents/skills/criador-de-videos, preservando todos os arquivos de references, scripts e agents. Se houver uma versão existente, faça backup antes de substituí-la.

Guia oficial de instalação e descoberta de skills: https://learn.chatgpt.com/docs/build-skills

## Exemplo de uso

> $criador-de-videos Crie um vídeo vertical de 30 segundos para minha marca. O público é [público], o objetivo é [objetivo] e estes são os recursos confirmados: [recursos]. Prepare o roteiro, o storyboard e a prévia.

## Ferramentas

A instalação da skill não exige npm install. Para usar o script `scripts/verificar-video.mjs`, é preciso ter Node.js moderno, FFmpeg e ffprobe disponíveis no PATH. O script usa módulos nativos do Node.

Exemplo, a partir da pasta da skill:

```sh
node scripts/verificar-video.mjs "/caminho/do/video.mp4"
```

Ferramentas de edição/render, geração de imagens e áudio dependem do projeto e das capacidades disponíveis no computador. A skill fornece o processo de criação; essas ferramentas não estão incluídas no ZIP.
