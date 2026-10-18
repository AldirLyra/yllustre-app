# Yllustre — versão 2

Composição Remotion `YllustreEventosV2`. Arquivo de vídeo: `../entregas/Yllustre-Video-V2.mp4`. Versão 1 preservada como composição `YllustreEventos`, arquivo anterior e snapshot `src-v1`.

## Melhorias

- Câmera determinística com amplitudes relativas entre fundo, moldura e foco.
- Overscan nas fotografias para evitar exposição das bordas durante o parallax.
- Perspectiva suave, sombras de contato, bordas de luz e placas posteriores.
- Cinco pontes usando uma única superfície fotográfica. Posição, proporção, perspectiva, raio e enquadramento compartilham uma curva global. Nas passagens com a mesma foto, ela atravessa o corte sem duplicação.
- Linha do filme abre o plano amarelo. No fechamento, esse plano se contrai para a cápsula de orçamento.
- Texto e contato permanecem estáveis durante a leitura.

Mantém 45 segundos, 1080 × 1920, 30 fps, as informações comerciais e a trilha original. Sem locução. Movimento composto a partir das fotografias reais disponíveis, sem recorte sintético de pessoas.

## Executar

```powershell
npm.cmd ci
npm.cmd run studio
node scripts/render.mjs stills v2
node scripts/render.mjs video v2
node scripts/review.mjs v2
node scripts/preview.mjs v2
```

No Studio, selecionar `YllustreEventosV2`. Prévia interativa em `http://127.0.0.1:4319`, com reprodução completa e repetição das transições a 1× e 0,5×. O vídeo final é um arquivo local independente desse servidor.

Fonte: `src/YllustreFilmV2.tsx`. Tokens de movimento: `M`. Estados das molduras: `poses`. Pontes: `bridges`. Timeline: `scenesV2`. Cada cena preserva identidade própria, enquanto as pontes derivam origem e destino da mesma timeline.

Assets selecionados em `public-v2`. Nenhuma pasta de dependências, build, executável ou download incompleto integra o pacote de fontes. As fontes de Windows incluídas são para uso local; verificar licença antes de redistribuí-las.

Direção e mapa de cortes: `review-v2/direcao.md`. Resultados da conferência pós-render: `review-v2/technical-report.json`, `review-v2/revisao.md` e imagens do MP4.
