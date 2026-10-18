# Yllustre V4 — revisão da entrega

Ideia: um momento real atravessa as escalas de bastidor, story, conteúdo e memória. A V4 usa a fotografia da marca como superfície e sustenta uma mesma lógica de câmera, luz diagonal e profundidade. A direção incorpora clareza/revelação associada à Apple, continuidade de superfícies associada à Stripe e nitidez/hierarquia associada à Linear, implementadas em Remotion. São referências de linguagem; não se afirma usar ferramentas dessas empresas.

As skills criador-de-videos e motionmaxxing orientaram storyboard, composição, timing e conferência. Referência motionmaxxing: commit 8c8ec0f2a6f6c9a0da15cd24f7b1298ab298368c. O projeto mantém as composições anteriores e não instala a skill globalmente.

## O que mudou

Câmera em perspectiva 1500px; amplitude próxima de 70px versus 16px no fundo; placa traseira em movimento relativo; rotação mais presente; deslocamento interno e zoom das fotos com overscan; reflexo viajante somente na abertura; transições por trajetória curva e máscara diagonal; fotos em leque; foco seletivo nas mudanças; entradas de palavras a cada 3 quadros, com acomodação de 12 quadros. A fotografia em tela inteira é conduzida à impressão e o papel acompanha a imagem na saída final. O número de WhatsApp está maior. Na revisão do primeiro MP4, a saída do papel foi ajustada; a entrega foi renderizada e verificada novamente.

Som: trilha original anterior remixada, duas passagens locais de ruído filtrado e um impacto tonal discreto, com redução de trilha antes do trecho em tela inteira e na leitura do contato. Não foi gerada locução, música de terceiro ou voz de pessoa real.

## Conteúdo e procedência

Foram conferidos em 13/10/2026 a [landing page](https://yllustreagencia.com.br/) e o [perfil público](https://www.instagram.com/yllustre_agencia/). O perfil confirmou comunicação/tecnologia/cobertura e o mesmo WhatsApp. A abertura individual dos reels exigiu login; nenhum reel foi obtido ou incorporado. Logo e fotografias são os assets reais já disponíveis. Profundidade, molduras, papel e luz são composição gráfica; não há novas filmagens, pessoas geradas, interface fictícia ou métricas inventadas. Os tipos de evento são apresentados como oferta, fora da legenda da fotografia de casamento.

## Conferências executadas no MP4 definitivo

Arquivo: Yllustre-Video-V4.mp4, 24.417.067 bytes. Vídeo H.264, 1080×1920, 30fps, 1.350 quadros, 45,000s; contêiner 45,013s. Áudio AAC estéreo 48kHz. Decodificação integral aprovada, sem falhas ou avisos em technical-report.json. Formato de pixel informado pelo FFprobe: yuvj420p.

O look.py original foi executado com --expect 45 --expect-audio --strict; o lint original recebeu o DOM da própria composição pelo adaptador Remotion Player:

- G0 PASS: 45,01s correspondem à duração esperada; áudio presente e imagem com movimento.
- G2 PASS: nenhuma sequência de mais de 3 quadros planos.
- G3 PASS: permanência final 1,10s; último plano detectado 1,31s, 3% do filme, abaixo do limite de 25%.
- G5 PASS: 36 amostras, sem regras de falha ou aviso; palavras incorporadas às fotografias não são vistas pelo lint.
- G1: inspeção visual, sem cálculo de nota. Serviços e telefone legíveis nos quadros extraídos e no player em escala de celular; informação principal usa 78–128px e telefone 80px. O filme não demonstra uma UI capturada.
- G4: inspeção visual, sem cálculo de nota. Foto principal dominante; auxiliares menores e de contraste/foco reduzidos, sem competir com a imagem central. Em detalhes, a principal tem cerca de 3,3 vezes a área de cada auxiliar; em Videomaker, cerca de 6,4 vezes.

Áudio medido: -15,3 LUFS integrados, LRA 1,5 LU, pico verdadeiro -5,0 dBFS; silêncio inicial 0,06s e final 0,09s; sem flags. Zero onsets com salto ≥8dB; o script não demonstra sincronismo perceptual dos efeitos. As posições dos efeitos são escolhas da timeline e não uma validação por escuta humana.

Movimento médio de luminância 1,8/255, abaixo da faixa de referência impressa pela skill (4,4–9,8). É uma peça de fotografias animadas com leitura calma; esse número não é pontuação de qualidade. O maior ganho seguinte seria incorporar filmagem real e ação dentro dos quadros. O contato tem 2,90s de movimento pouco perceptível para permitir leitura do número. Nenhuma sequência quase preta no blackdetect configurado.

As sete passagens foram extraídas do MP4 definitivo e inspecionadas. A última impressão foi corrigida para transportar foto, legenda e papel em uma trajetória comum. A assinatura e o telefone foram conferidos em closing.jpg. O mosaico não substitui a reprodução; a revisão do player fica registrada separadamente em playback.json.

## Descrição das 16 imagens da folha final

1. A celebração e a marca Yllustre ocupam o arco, com “Seu evento. Uma vez.” em primeiro plano.
2. A fotografia já está em moldura retangular e recebe “A história continua.”, mantendo a mesma situação real.
3. A profissional aparece em perspectiva, com placa traseira e “Você vive. A gente conta.”.
4. Preparativos substituem a foto da profissional pela máscara diagonal na superfície compartilhada.
5. O casal domina a composição de detalhes, com imagens laterais menores em leque.
6. O casal ocupa o quadro de Storymaker, identificado como “No encontro.”.
7. O celular filmando a noiva ocupa a frente, com “Nos bastidores.” e o serviço legível.
8. A foto da celebração chega ao plano Videomaker enquanto a frase começa a entrar por palavras.
9. A foto principal em perspectiva e o quadro menor de bastidores sustentam “A energia vira conteúdo.”.
10. A fotografia avança na transição para tela inteira e começa a trocar para o retrato de oração.
11. O retrato de oração domina o quadro e recebe “A emoção fica.” e Filmmaker.
12. O mesmo retrato mantém a leitura após a acomodação da câmera.
13. A foto de celebração aparece impressa, com a legenda fixa “Memórias reais.” e Formaturas como oferta externa.
14. A mesma impressão permanece enquanto o texto externo passa para Eventos de marcas.
15. A pergunta sobre a próxima história aparece junto ao telefone confirmado.
16. O pedido de orçamento conclui a chamada antes da assinatura isolada, conferida em closing.jpg.

Limitações: material disponível é fotográfico; não se atribui classificação de qualidade nem se afirma que os gates garantam estética ou fluidez. A revisão por screenshots amostra a reprodução e não observa cada quadro. As fontes locais têm restrições de redistribuição descritas no README. Nenhum upload, publicação ou mensagem externa foi realizado.

Reprodução do arquivo definitivo: navegador local concluiu 45,013s a 1×, ended=true e sem erro de mídia. As sete pontes e a assinatura foram repetidas em janelas de dois segundos a 0,5×, com screenshots de amostragem. playback.json registra esse escopo e o SHA-256 do arquivo.
