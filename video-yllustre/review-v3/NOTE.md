# Yllustre V3 — revisão e entrega

Ideia: o evento passa uma vez; o mesmo material real da Yllustre ganha escala de bastidores, stories, conteúdo e memória. A fotografia compartilhada conecta os serviços. Foi aplicada a skill motionmaxxing, commit `8c8ec0f2a6f6c9a0da15cd24f7b1298ab298368c`, preservando o projeto Remotion e as versões anteriores.

O storyboard registra o que cada trecho compra. A V3 remove marcas de capítulo e rodapés, substitui a troca de frase inicial por máscara, amplia o quadro principal de stories, mantém planos com velocidades diferentes, usa fundos derivados das próprias fotos e termina com uma assinatura breve. A revisão inicial mostrou contraste insuficiente em “Videomaker”, um intervalo visual nas últimas passagens e permanência final de 1,90s; esses pontos foram corrigidos e o MP4 foi novamente exportado e medido.

## O que é real

Logo e fotografias vêm do material existente da Yllustre. Telefone e oferta de serviços foram mantidos da referência original. As imagens são fotografias animadas, não novos vídeos de eventos. Molduras, profundidade, luz, sombras e impressão são composição gráfica. Não foi reconstruída uma interface de Instagram nem uma publicação real. Os nomes formaturas e eventos de marcas apresentam serviços; a imagem de casamento não representa trabalhos dessas categorias. Não há estatísticas ou clientes inventados. A trilha original local da versão anterior foi mantida; não houve nova locução, música de terceiros ou API paga.

## Números obtidos no arquivo final

`technical-report.json`: 21.767.804 bytes; 1080 × 1920; H.264; 30 fps; 1.350 quadros; vídeo 45,000s; contêiner 45,013s; AAC estéreo 48 kHz. Decodificação integral aprovada, sem avisos ou falhas. Pixel format efetivo `yuvj420p` conforme FFprobe.

`look/gates.json` e `motionmaxxing-report.txt`, calculados pelo look.py original com `--expect 45 --expect-audio --strict`:

- G0 PASS: 45,01s compatíveis com 45s; áudio presente; imagem não vazia e com movimento.
- G2 PASS: nenhuma sequência de mais de 3 quadros planos; um intervalo curto em 38,93s foi ignorado pelo critério original do script.
- G3 PASS: permanência final medida de 1,10s, dentro de 0,6–1,4s; último trecho detectado de 6,01s, 13% do filme, abaixo de 25%.
- G5 PASS: lint original, 36 amostras; nenhuma regra de falha ou aviso. O adaptador Player expõe a mesma composição React para seek, sem substituir os elementos visuais. Textos incorporados às fotografias não são visíveis ao lint.
- G1: inspeção visual, sem pontuação automatizada; nomes principais dos serviços legíveis, fotografias ampliadas e telefone conferido em `closing.jpg`. Os nomes Storymaker/Videomaker/Filmmaker usam 78–100px; textos secundários têm tamanhos menores. Não há UI capturada a medir.
- G4: inspeção visual, sem pontuação automatizada; fotografia principal dominante. Em Videomaker, sua área é aproximadamente 6,7 vezes a do quadro auxiliar; no trecho de stories, aproximadamente 3,5 vezes cada quadro lateral.

Áudio pelo look.py: -14,9 LUFS integrados, LRA 3,5 LU, pico verdadeiro -2,7 dBFS, silêncio inicial 0,06s e final 0,08s; sem flags. Nenhum onset de salto ≥8dB detectado, portanto não se afirma sincronismo de hits com cortes. Esses números não substituem escuta humana.

Movimento médio: 1,5/255 de diferença de luminância entre quadros, abaixo da faixa de referência humana impressa pelo script (4,4–9,8). É um filme de fotografias com movimento moderado; esse resultado é uma observação, não um gate aprovado ou uma nota de qualidade. O trecho de contato permanece calmo para leitura do número. A próxima melhoria de maior impacto seria incorporar vídeos reais de cobertura, com ação dentro dos enquadramentos.

`black-frame-check.json`: nenhuma sequência de quadros quase pretos pelo detector configurado. As sete passagens foram extraídas do MP4 e inspecionadas, incluindo os cortes corrigidos de 33s e 39s. A revisão por imagem não demonstra fluidez em velocidade real. A tentativa de prévia no navegador integrado resultou em timeout para localhost; não se afirma reprodução completa assistida. O MP4 foi decodificado integralmente e entregue como arquivo local independente da prévia HTTP.

## Descrição das 16 imagens da folha final

1. A celebração ocupa o arco, com “Seu evento. Uma vez.” como leitura principal; é um enquadramento fotográfico com texto.
2. A mesma fotografia conserva o foco e recebe “A história continua.”; a continuidade vem da imagem.
3. A profissional aparece em tamanho grande, com “Você vive. A gente conta.”; este trecho permanece mais editorial.
4. A foto da profissional dá lugar aos preparativos no meio da passagem; o enquadramento compartilhado carrega a mudança.
5. O casal ocupa o quadro claro e sustenta “Cada detalhe conta.”; o retrato é o foco.
6. O casal reaparece no quadro vertical dominante com “No encontro.”; as laterais ficam secundárias.
7. O celular filmando a noiva ocupa o quadro principal com “Nos bastidores.”; a imagem mostra o contexto de registro.
8. A fotografia da celebração inicia o quadro Videomaker; o serviço aparece dentro da imagem.
9. A celebração domina e o pequeno quadro lateral mostra bastidores; há uma hierarquia clara entre as duas áreas.
10. A fotografia cresce durante a passagem para tela cheia; o enquadramento em movimento momentaneamente encobre parte da frase.
11. O retrato de oração em tela cheia sustenta “A emoção fica.”; o rosto é o foco emocional.
12. O mesmo retrato permanece com “Filmmaker.” legível; o trecho é deliberadamente mais calmo.
13. A fotografia aparece como impressão em perspectiva com o serviço “Formaturas.”; não é prova de um trabalho de formatura.
14. A impressão recebe “Eventos de marcas.” e mantém um único foco; o título apresenta escopo de serviço.
15. A pergunta “Qual história vamos contar?” acompanha o telefone em um campo escuro; a ação é iniciar a conversa.
16. “Peça seu orçamento.” e o mesmo número concluem a chamada; a assinatura posterior foi conferida separadamente em `closing.jpg`.

Não se atribui classificação de qualidade à peça. Melhorias ainda possíveis: material filmado real, variação maior de ação durante a prova dos serviços, locução produzida para a marca e escuta crítica do áudio. Os relatórios registram verificações efetivamente executadas, sem publicação ou upload automático.
