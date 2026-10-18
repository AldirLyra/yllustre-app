# Yllustre — V3 com motionmaxxing

45 segundos, vertical 1080 × 1920, 30 fps, H.264 e áudio AAC. Fotografias e logo reais da Yllustre; trilha original existente; sem locução.

Aplicação da skill https://github.com/Tejashmakwana/motionmaxxing: entradas por máscaras de 12 quadros, desaceleração de chegada, saídas aceleradas, enquadramentos maiores, menos rótulos, fundos derivados das fotografias, planos com parallax e assinatura mais curta. O projeto continua em Remotion e conserva as composições V1 e V2.

## Uso

Instale Node.js e Google Chrome. Na pasta deste arquivo:

```powershell
npm ci
npx remotion studio
node scripts/render.mjs video v3
node scripts/review.mjs v3
node scripts/lint-v3.mjs
node scripts/preview.mjs v3
```

Selecione `YllustreEventosV3` no Studio. O MP4 é exportado para `../entregas/Yllustre-Video-V3.mp4`. A prévia usa http://127.0.0.1:4320. Não abra o MP4 durante sua exportação: o Windows pode bloquear sua substituição.

`scripts/audit-v3.mjs` executa o look.py original do repositório e precisa de Python com Pillow e do FFmpeg recente instalado localmente pelo pacote ffmpeg-static; ajuste a localização do Python para outro computador. O lint original recebe o DOM da própria composição via `src/lint-v3.tsx`, usando Remotion Player e um adaptador de seek; não analisa um HTML substituto do vídeo.

`review-v3/STORYBOARD.md` registra direção, decisões e limites das imagens. `review-v3/NOTE.md` registra os resultados reais de revisão. As referências Apache-2.0 e seus avisos de licença acompanham o projeto; não foram instaladas globalmente.

As fontes Arial/Georgia locais foram mantidas para reprodução fiel; sua redistribuição depende das licenças da Microsoft. As fotografias permanecem pertencentes aos titulares originais. Não há upload ou publicação automática.
