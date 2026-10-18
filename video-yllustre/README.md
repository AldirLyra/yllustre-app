# Yllustre — vídeo de cobertura de eventos

Projeto Remotion editável, 45 segundos, 1080 × 1920, 30 fps.

Oito cenas com fotografias reais do site, tipografia da identidade Yllustre, enquadramentos animados, sequência de stories e trilha instrumental original gerada localmente. Sem locução. As imagens de casamentos ilustram esse portfólio; formaturas e eventos de marcas aparecem como categorias atendidas, sem imagens atribuídas indevidamente a esses serviços.

## Retomar

Executar os comandos nesta pasta, com Node.js instalado:

```powershell
npm.cmd ci
npm.cmd run studio
node scripts/render.mjs stills
node scripts/render.mjs video
node scripts/review.mjs
node scripts/preview.mjs
```

O render programático usa o Chrome instalado em `C:/Program Files/Google/Chrome/Application/chrome.exe`; ajuste `scripts/render.mjs` se necessário. A conferência usa o FFmpeg completo de `@ffmpeg-installer/ffmpeg` e o ffprobe distribuído com o Remotion para Windows x64. Os pacotes estão fixados no lockfile.

- Composição e textos: `src/YllustreFilm.tsx`.
- Timeline: array `scenes`, no mesmo arquivo.
- Cores: objeto `C`.
- Mídia otimizada: `public/media`.
- Trilha original: `public/audio/yllustre-original.wav`.
- Geração da trilha e preparo da mídia: `scripts/prepare.py` (Python, Pillow, NumPy).
- Quadros extraídos e relatório técnico: `review`.
- Exportação revisada: `../entregas/yllustre-eventos-v1-final.mp4`.
- Skill fornecida pelo usuário, preservada como referência: `skill/criador-de-videos`.

As fontes locais do Windows foram copiadas para renderização nesta máquina. Não redistribuir os arquivos de fonte sem verificar a licença; o MP4 não precisa deles para reprodução.

## Direção aplicada

Apple: revelações com hierarquia e pausas. Stripe: coordenação de camadas, linhas e formas. Linear: alinhamento, contraste e movimento discreto. Essas são referências criativas; não há associação comercial. Implementação efetiva em Remotion, com movimentos derivados exclusivamente do frame.

A versão audiovisual adapta o roteiro original para funcionar sem voz. Mantém os três serviços, a mensagem central e o WhatsApp. As transições implementadas alternam continuidade de composição, máscaras direcionais e dissoluções curtas; o mapa de cortes corresponde aos tempos 5, 10, 15, 21, 27, 33 e 39 segundos. Entre os frames 618 e 654, a mesma fotografia atravessa a passagem de story para vídeo, com uma única curva de posição, escala, rotação e raio. Os títulos das cenas seguintes começam a entrar durante a sobreposição para preservar a continuidade da mensagem.

## Limites da revisão

A checagem técnica valida duração, resolução, fps, quadros, codec, áudio e decodificação. Quadros do MP4 e suas transições são inspecionados separadamente. Medidas de áudio não substituem uma escuta humana em caixas ou fones. Ver `review/technical-report.json` e `review/revisao.md`.
