# Produção, animação e áudio

## Escolha do caminho

Reaproveite fontes, assets e dependências do projeto existente. Não substitua um editor que o usuário escolheu sem motivo e sem avisar. Remotion funciona bem para tipografia, vetores, UI, timelining e reprodução determinística; um editor web pode montar mídia/renderizações prontas se isso atender ao pedido. O uso de princípios HyperFrames não exige que todo projeto dependa desse runtime.

Quando usar Remotion, leia a skill disponível e apenas as referências relevantes (markup, interatividade, Studio, áudio/render). Verifique a API da versão instalada; mantenha pacotes Remotion compatíveis. Não copie um package.json antigo nem troque o bundler para contornar uma divergência ainda não diagnosticada. Sem essas skills, consulte documentação oficial atual quando necessário.

## Estrutura editável

Mantenha uma composição master e cenas isoladas, com nomes claros. Centralize tokens e componentes compartilhados: marca, background, headline, moldura visual, chat, nota e transições. Centralize também tokens de movimento: duração curta, duração padrão, duração de transição, curvas de aceleração, amplitude de parallax, overscan de imagens, perspectiva, sombra e opacidade de texturas. Cada cena deve declarar seu ponto focal e seus planos de profundidade. Separe dados/textos do comportamento quando a estrutura justificar isso.

Quando houver parallax, aplique uma transformação de câmera por cena e movimentos relativos nos planos; evite empilhar transformações independentes sobre o mesmo elemento. Imagens que se deslocam precisam de margem de recorte suficiente e de `overflow: hidden` no contêiner.

Animação deve depender do frame e da timeline, não de relógio, timers, CSS contínuo ou aleatoriedade não controlada. Use interpolação/easing/springs adequados à versão instalada. Conte durações em frames e desconte as sobreposições de transições; confira a duração real após inserções.

Toda propriedade animada deve ter estado inicial e final explícitos, com extrapolação limitada. Limite o overshoot de springs quando o elemento precisa pousar em uma posição de leitura. O elemento que conduz uma transição deve usar uma progressão única para máscara, posição, escala, opacidade e efeitos associados; isso reduz borda piscando, máscara atrasada e quadro vazio. Planeje antecipação, ação e acomodação, deixando alguns frames para o título ou estado novo estabilizar.

Coreografe um foco por momento: título introduz → visual ganha atenção → interação acontece → informação resolve. Escolha movimentos conforme a função: máscara revela palavra; traçado comunica leitura; mudança de estado comunica interação; conexão liga objetos relacionados; câmera/enquadramento dirige o olhar. Evite animar todos os elementos ao mesmo tempo com o mesmo bounce.

Use motion mais elaborado nos momentos-chave e movimentos discretos nas áreas de leitura. Faça transições nascerem de formas, cores ou objetos que as cenas compartilham quando isso ajudar a continuidade. Não imponha wipe/glitch/zoom em todos os cortes.

Verifique a continuidade na emenda: direção, posição, escala e velocidade devem parecer coerentes entre saída e entrada. O objeto não precisa atravessar exatamente o mesmo ponto, mas o olhar precisa encontrar uma ligação clara. Quando não houver ligação útil, prefira um corte limpo com composição estável.

## Parallax e profundidade

Parallax comunica uma relação espacial entre camadas. Organize pelo menos três planos quando o layout comportar: fundo ou textura, elementos intermediários e foco (foto, mockup, moto, sacola ou controle ativo). Como ponto de partida, mova o plano distante com cerca de 0,15–0,30 da amplitude do foco, o intermediário com 0,35–0,60 e o foco com 1,0; ajuste pela composição, e não aplique a proporção quando ela deslocar texto ou controles. Uma rotação de 1–3° e um ganho de escala de 1–3% já criam volume em uma tela vertical.

Ancore cada camada a um ponto visível. Use sombra de contato, borda de luz ou uma máscara limpa para separar planos, mantendo contraste e margens seguras. O texto principal, a marca e os controles necessários para a ação devem assentar antes do intervalo de leitura e permanecer previsíveis. O parallax pode respirar nas bordas, no fundo e na mídia; não faça a informação parecer instável para simular profundidade.

No Remotion, derive tudo de `useCurrentFrame()` e de um progresso determinístico. Prefira interpolar valores numéricos e montar a string de CSS depois. `interpolate()` aceita alguns formatos de transformação, mas não deve receber uma string arbitrária com quatro componentes de `clip-path: inset(...)`; calcule os quatro valores e componha o `inset()` no estilo. Isso mantém o render compatível e evita que um efeito só falhe no Studio ou em um frame específico.

## Motion por estado

Uma demonstração tem quatro momentos legíveis: estado inicial, ação, resposta do produto e assentamento. Defina no storyboard o frame do gesto, a mudança de estado e o pequeno tempo de confirmação. A quantidade muda depois do toque; o botão muda depois da adição; o dia e o horário permanecem selecionados quando o resultado aparece. O movimento deve explicar a causalidade, não apenas chamar atenção.

Use uma curva de entrada para apresentar, uma curva de resposta mais curta para o gesto e uma saída ou estabilização para devolver espaço à leitura. Elementos relacionados podem compartilhar uma curva, mas não faça todos os objetos saltarem juntos. Se a cena contém uma interação, deixe a consequência visível por tempo suficiente para ser entendida em velocidade normal.

## Transições premium

Escolha a transição a partir do vínculo entre as cenas. Um objeto compartilhado pode atravessar o corte (sacola, foto, marcador ou traço); uma linha pode virar rota; uma forma pode abrir um painel; uma máscara pode revelar a nova composição; uma mudança de câmera pode mover o olhar para outro plano. Wipes, glitches e zooms são opções pontuais, não um estilo aplicado a cada corte.

Descreva quatro pontos antes de implementar: âncora de saída, âncora de chegada, frame do corte e intervalo de sobreposição. Em um vídeo a 30 fps, 8–18 frames costuma bastar para uma ponte curta; a cena de origem deve continuar reconhecível no início, o elemento-ponte conduz o olhar no meio e a cena seguinte deve estar resolvida 3–8 frames antes do fim da ponte. Ajuste a duração quando a ação ou o tempo de leitura pedir.

Use um único progresso global para a ponte. Não reinicie a mesma foto, sacola ou rota no frame do corte com uma segunda animação local: a duplicação causa congelamento, ghosting ou uma mudança brusca de velocidade. Se a cena de origem e a cena de destino precisam coexistir, congele cada uma apenas no frame de referência e mova uma camada-ponte contínua entre as duas. Para uma curva, especifique pontos intermediários e mantenha a velocidade suave; para uma máscara, revele e cubra com a mesma forma e o mesmo eixo.

Depois de cada transição, reserve um pequeno assentamento para recuperar a leitura. Não cubra a ação que precisa ser vista (por exemplo, chegada da moto ou seleção do horário) com uma faixa opaca. O elemento-ponte deve reforçar a relação entre as cenas sem inventar uma funcionalidade ou sugerir que uma ilustração é GPS, disponibilidade em tempo real ou confirmação de reserva.

Associe o efeito sonoro ao ponto de maior mudança visual, que pode ser diferente do primeiro frame da transição. Um whoosh curto pode acompanhar o deslocamento; um impacto discreto pode marcar a acomodação. Não empilhe efeitos sobre cortes sucessivos sem espaço para que cada um seja percebido.

## Mídia limpa

Organize assets por projeto/versão e preserve originais. Use enquadramento, recorte ou geração/edição de imagem para remover a poluição visual de referências, não para esconder evidência necessária. Confirme dimensões, duração, trim e material disponível de clips antes do render. Não reproduza áudio original de uma pessoa se ele não faz parte da mensagem autorizada.

Combine fotos/clips com camadas editáveis para textos e UI. Para gerar bitmap, siga a skill/ferramenta de imagem disponível. Para gerar vídeo ou voz externa, respeite orçamento, consentimento, destino e ferramentas realmente disponíveis. A skill não exige serviços pagos nem promete capacidade ausente.

## Áudio dirigido

Selecione ou produza uma trilha compatível com a marca e com direito de uso. Sincronize impactos com mudanças significativas; efeitos sutis podem pontuar envio, resposta e revelação. Não coloque um whoosh em cada palavra.

Se houver narração, faça texto visual e fala se complementarem; não empilhe legenda, headline e parágrafo iguais. Reserve headroom, controle a trilha sob a voz e confira a mixagem em velocidade normal. Evite clipping e início/final cortados. Uma faixa presente nos metadados não comprova que seja audível ou bem mixada.

## Prévia fiel

Renderize quadros estáveis e também momentos de entrada, revelação e transição. Veja o vídeo em tamanho de celular. Uma cena bonita pausada pode estar rápida demais durante a reprodução.

Se o Studio exibir texto diferente da fonte, compare com um still recém-renderizado fora do editor. Confira cache/build e os vínculos de componentes interativos antes de alterar a copy novamente. Em projetos com seleção por localização de fonte, JSX formatado em linhas próprias e componentes com identidade independente ajudam a evitar vínculos ambíguos. Não use reset geral de propriedades como primeira tentativa: ele pode sobrescrever outras edições. Reconstrua/recarregue apenas o editor desse projeto quando necessário, preserve o estado relevante e verifique a prévia após estabilizar.

### Diagnóstico de transição travada

Para cada corte, renderize e observe uma janela de pelo menos 12 frames antes e 12 depois. Na primeira transição, use uma janela maior. Verifique quadro preto, transparente ou vazio; salto de posição, escala, rotação ou opacidade; duas máscaras ou câmeras atuando ao mesmo tempo; entrada antes da cobertura da cena antiga; mudança de easing no meio; texto ilegível durante o deslocamento; e efeito sonoro adiantado ou atrasado.

Reproduza o trecho em velocidade normal e em meia velocidade. Se o Studio apresentar quedas, compare com um render completo na taxa de quadros final. Classifique como falha da animação apenas o problema que também aparece no render; se ele existir só na prévia sob carga, registre a limitação e preserve a fonte determinística.

## Exportação

Renderize a composição aprovada, não uma cena isolada ou versão anterior. Para compartilhamento amplo, MP4 H.264/AAC/yuv420p é um ponto de partida; resolução, fps, codec e áudio devem seguir o canal e o pedido. PNG como intermediário pode ajudar a conservar grafismos finos; escolha qualidade/concurrency compatíveis com a máquina.

Use um nome e uma pasta de saída explícitos. Não sobrescreva uma entrega aprovada sem autorização; arquivos temporários ou obsoletos desta tarefa podem ser substituídos. Quando um pedido novo invalidar o render em andamento, não entregue a saída antiga como se contivesse a alteração. O arquivo final precisa passar pela revisão pós-exportação.
