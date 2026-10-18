# Revisão da versão 1

Arquivo de entrega: `entregas/yllustre-eventos-v1-final.mp4`.

## Resultado técnico

- 45 segundos de vídeo, 1.350 frames, 30 fps.
- 1080 × 1920, proporção 9:16.
- Vídeo H.264, 4:2:0 em faixa completa (`yuvj420p`, conforme ffprobe).
- Áudio AAC estéreo, 48 kHz; duração do contêiner de 45,013 s pelo preenchimento de AAC.
- Decodificação integral aprovada, sem erros.
- Pico amostral de -2,7 dBFS; média de -17,2 dBFS pelo `volumedetect`.
- Script original `verificar-video.mjs` da skill executado com todas as expectativas: aprovado, sem avisos.

O relatório exato está em `technical-report.json`. Medidas de áudio não equivalem a true peak, LUFS ou escuta crítica; a mixagem não recebeu uma avaliação auditiva humana nesta entrega.

## Conferência visual

Inspecionados os quadros extraídos do MP4 nos frames 100, 225, 380, 540, 730, 900, 1110 e 1300, cobrindo todas as oito cenas. Inspecionados também seis quadros ao redor de cada um dos sete cortes (corte -12, -8, -4, 0, +4 e +8). Os arquivos `mp4-storyboard.jpg` e `transition-*.jpg` documentam essa passagem. Esses mosaicos verificam composição e estados, sem comprovar isoladamente a fluidez.

Os recortes mantêm o foco dos registros, os títulos têm hierarquia e margem, o contato está legível e os fundos mantêm a identidade preto/amarelo/branco quente. A transição entre Storymaker e Videomaker usa uma camada fotográfica contínua, em vez de reiniciar a imagem no corte. Títulos entram durante a sobreposição e os fundos das cenas dark são opacos, evitando que o conteúdo anterior permaneça exposto ao fim da passagem.

Reprodução do arquivo final também conferida no player HTML local em velocidade 1×. Não se utilizou o desempenho do Studio como evidência de fluidez do MP4.

## Conferência editorial

Serviços e contato conferidos contra a landing page da Yllustre. WhatsApp: (63) 99241-1073. Instagram: @yllustre_agencia. Não foram adicionados preços, prazos, depoimentos, métricas ou promessas de alcance.

Os registros reais disponíveis são fotográficos. A versão utiliza motion com essas fotos, sequência de stories e trilha original, sem locução. Não atribui fotografias de casamento a coberturas corporativas ou formaturas.

O roteiro foi adaptado para mensagens de tela e não foi transformado em narração sintética. A trilha foi composta localmente a partir de síntese, sem gravações de pessoas ou música de terceiros.
