# Revisão — versão 2

Arquivo: `entregas/Yllustre-Video-V2.mp4`.

## Conferência técnica

- 45 segundos de vídeo, 1.350 frames, 30 fps, 1080 × 1920.
- H.264 com áudio AAC estéreo a 48 kHz. Contêiner de 45,013 s devido ao preenchimento de áudio.
- Decodificação integral aprovada, sem erros. Script `verificar-video.mjs` da skill aprovado, sem avisos.
- Pico amostral de -2,7 dBFS; média de -17,2 dBFS. Trilha preservada da versão 1, sem alteração de voz ou música.
- Passagem adicional de `blackdetect`: nenhum segmento quase preto detectado a partir de 0,03 s com limiar de 99% do quadro. Esse teste foi acrescentado após identificar e corrigir uma emenda vazia na primeira renderização da V2.

Ver `technical-report.json` e `black-frame-check.json`. A saída foi novamente renderizada e conferida depois da correção; os relatórios e as imagens correspondem ao arquivo de entrega.

## Conferência visual e temporal

Inspecionados oito quadros de cena extraídos do MP4: F100, F225, F380, F540, F730, F900, F1110 e F1300. Inspecionados também os sete cortes, com amostras de F-18 até F+18 em passos de seis frames; a primeira passagem recebeu uma janela ampliada de F-24 até F+24.

Conferidos recortes, textos, sombras, perspectivas e estados das pontes. Nas passagens detalhe → story e story → vídeo, a fotografia permanece em uma única superfície interpolada. Na entrada do filme, a imagem ocupa o plano de fundo ao final da expansão, enquanto o texto entra em seguida, evitando um quadro vazio. No fechamento, a superfície amarela termina exatamente no retângulo do botão, antes da troca para o componente estável.

Reprodução do MP4 em navegador local a 1×, com inspeção visual por amostras e repetição de passagens a 0,5×. Os mosaicos servem para verificar estados, sem comprovar isoladamente a fluidez. A avaliação auditiva humana da trilha não integra esta revisão.

## Preservação e escopo

A versão 1 e sua fonte foram preservadas. Permanecem a duração, a identidade visual, os serviços e os contatos. A V2 altera profundidade, parallax, enquadramentos e transições. Não há novas promessas comerciais, mídia gerada de pessoas ou locução.
