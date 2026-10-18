# Yllustre — V4

Comercial de cobertura de eventos: 45s, 1080 × 1920, 30fps, MP4 H.264/AAC. A composição `YllustreEventosV4` preserva V1, V2 e V3.

Novidades: câmera em perspectiva 1500px, movimento maior entre planos, arco que se acomoda em moldura, um reflexo viajante na abertura, fotos em leque, foco seletivo, textos que entram por palavras, trajetórias curvas e máscaras diagonais nas passagens. A foto em tela cheia se torna impressão e depois sai para o contato. Telefone ampliado. Dois efeitos de passagem e um impacto local acompanham os momentos principais; a trilha original foi remixada com espaço para leitura.

Direção baseada nas skills criador-de-videos e motionmaxxing. Apple, Stripe e Linear serviram como referências de clareza, continuidade e acabamento; o vídeo foi implementado e renderizado em Remotion.

## Retomar

```powershell
npm ci
npm run studio
npm run render:v4
npm run review:v4
npm run lint:v4
npm run preview:v4
```

Selecione `YllustreEventosV4` no Studio. O render é salvo em `../entregas/Yllustre-Video-V4.mp4`. A prévia usa http://127.0.0.1:4324. Feche o MP4 antes de exportar novamente para evitar bloqueio do Windows. As mídias otimizadas já estão incluídas: não é necessário executar prepare.py ou a migração create-v4.py.

`scripts/audio-v4.py` reproduz a mixagem a partir do WAV original; exige Python/NumPy. `scripts/audit-v4.mjs` executa o look.py original, com Python/Pillow e FFmpeg recente do pacote ffmpeg-static. Ajuste o caminho do Python/Chrome se retomar em outro computador. `scripts/lint-v4.mjs` verifica o DOM real da composição através do Remotion Player.

`review-v4/STORYBOARD.md` documenta direção e pontes. `review-v4/NOTE.md` informa o que foi conferido e os resultados medidos no MP4. Não se confunde uma renderização bem-sucedida com revisão visual.

Fotografias e logo já disponíveis foram preservados. Não há novos clips de reels, imagens ou pessoas geradas, clientes ou números inventados. O perfil público e a landing page foram conferidos em 13/10/2026; a abertura individual de reels solicitou login. Sem nova locução ou serviço pago. Sem publicação externa.

Arial/Georgia locais acompanham a composição para fidelidade; sua redistribuição depende das licenças Microsoft. As fotografias pertencem aos seus titulares. A skill motionmaxxing e seus avisos Apache-2.0 acompanham as referências do projeto.
