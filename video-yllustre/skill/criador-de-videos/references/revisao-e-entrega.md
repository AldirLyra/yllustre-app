# Revisão de todo o vídeo e entrega

## Quatro passagens

1. **Editorial:** marca clara, mensagem coerente com o público, fatos confirmados, melhorias distinguidas de recursos novos, ortografia e CTA corretos. Procurar duplicações de frase e repetição semântica entre label/título/badge/legenda, inclusive em cenas vizinhas.
2. **Visual:** eixos alinhados, margens consistentes, quebras naturais, escala de leitura no celular, contraste, proporção/crop de mídia, balões com padding e altura suficientes. Não conferir apenas abertura e fechamento: todas as cenas e estados de UI importam.
3. **Temporal e movimento:** tempo de leitura após a animação, progressão da demonstração, variação de ritmo, continuidade de velocidade, parallax sem tremor, transições sem colisões ou quadros vazios, overlays legíveis, sincronismo dos efeitos e frame final utilizável. Veja todas as transições em velocidade normal; mosaico de stills não prova fluidez.
4. **Sonora/técnica:** trilha/voz/efeitos previstos, cortes e fades, ausência de distorção, dimensões/fps/duração/streams corretos e decodificação integral sem erro.

### Fluidez de parallax e transições

Faça uma passagem específica pelos frames imediatamente antes, no corte e imediatamente depois de cada transição. Reproduza cada ponte em velocidade normal e confira também uma prévia sem áudio: o movimento deve atravessar o corte sem parar, duplicar a mídia, reiniciar a curva ou trocar de direção sem motivo. Compare a posição e a escala do elemento-ponte no primeiro frame da saída com o último frame da chegada.

Para parallax, confira a hierarquia em movimento: fundo com deslocamento menor, plano intermediário conduzindo o olhar e foco com maior presença. Texto, marca e controles precisam continuar legíveis; bordas e sombras não podem denunciar um recorte quebrado. Em uma demonstração, verifique que a animação de entrada termina antes da ação e que a resposta fica visível antes da saída.

Inclua no conjunto de revisão pelo menos um frame de início, um do meio e um de assentamento para cada ponte, além de um frame de cada estado importante. Se uma passagem parecer engasgada, investigue primeiro progresso reiniciado, duas cópias do mesmo elemento, easing incompatível, `clip-path` montado com string inválida ou mídia pesada; simplifique a ponte antes de acelerar o vídeo. Still isolado não comprova fluidez, então reavalie uma prévia animada depois do ajuste.

Para cada transição, registre o frame do corte, o tipo e o elemento que faz a ligação. Extraia uma janela ao redor do corte (por exemplo, `corte - 12` até `corte + 12`) e assista a reprodução contínua. A primeira transição deve ser revisada separadamente porque define o ritmo do vídeo e costuma revelar estados iniciais incorretos. A aceitação exige nenhum flash não intencional, quadro vazio, mudança brusca de eixo, borda exposta pelo parallax, máscara que termina antes do conteúdo ou texto que perde leitura. Se houver áudio, confirme que o efeito acompanha a mudança principal e não mascara a demonstração.

Se o usuário pediu revisão, implemente os ajustes em escopo e verifique as consequências nas outras cenas. Se pediu apenas avaliação, não modifique a produção sem autorização. A revisão não deve acrescentar automaticamente novos claims ou mudar uma oferta aprovada.

## Conferir o MP4 real

Depois do render, execute a conferência portátil (o script não modifica o vídeo):

```bash
node scripts/verificar-video.mjs /caminho/absoluto/video.mp4 --duration 50 --width 1080 --height 1920 --fps 30 --frames 1500 --audio required
```

Os valores são um exemplo, não defaults de duração/layout. Use o caminho do script dentro desta skill quando não estiver em sua pasta. Dependências: Node, ffprobe e FFmpeg no PATH. `--audio optional` aceita um vídeo sem áudio quando isso foi solicitado. A saída é JSON e código de erro quando há falhas. `warnings` não são automaticamente defeitos: avalie o conteúdo, por exemplo áudio apenas em uma parte da timeline.

O script verifica metadados, expectativas fornecidas, decodificação integral, presença de áudio e pico/média básicos. Não mede loudness perceptual/true peak, não faz transcrição ou OCR e não garante sincronismo nem legibilidade. Não diga que ouviu a trilha se só analisou medidas. Faça escuta quando a interface/ferramenta permitir; reporte a limitação quando ela for relevante.

`verificar-video.mjs` também não mede fluidez do movimento. Continuidade de parallax, easing e sincronismo perceptual exige reprodução do render e inspeção dos frames ao redor das transições.

Extraia ao menos um quadro com conteúdo completo de cada cena do próprio MP4, além de frames de transições e demonstrações importantes. Escolha tempos conforme os pontos de revelação, não intervalos arbitrários que só capturam cenas vazias. Para uma lista de frames conhecida, o filtro precisa manter a expressão de `select` entre aspas internas; as vírgulas não podem virar separadores de filtros:

```bash
ffmpeg -v error -n -i /caminho/absoluto/video.mp4 -vf "select='eq(n,95)+eq(n,250)+eq(n,520)',scale=360:-1,tile=3x1:padding=8:margin=8" -frames:v 1 -q:v 2 /caminho/absoluto/conferencia.jpg
```

Esse comando é ilustrativo; altere seleção/grid para a timeline real e não sobrescreva arquivos alheios. Inspecione também cenas densas em resolução maior. Compare as headlines finais com a última decisão do usuário. Um render iniciado antes de uma alteração não contém essa alteração, mesmo que o projeto tenha sido salvo depois.

## Critério de conclusão

Um pedido de MP4 só está concluído quando o arquivo existe, abre/decodifica e corresponde à versão solicitada. Preserve projeto editável, mídias e as instruções mínimas para retomar. Entregue um caminho absoluto clicável e use preview nativo/inline quando disponível. Informe duração, formato e limitações reais, sem despejar logs ou etapas internas.

Não importe em editor externo, publique em redes, faça upload ou inicie uma campanha porque o vídeo foi exportado. Essas ações precisam estar no pedido. Não prometa alcance, vendas ou viralização; entregue as escolhas criativas que favorecem clareza, retenção e impacto.
