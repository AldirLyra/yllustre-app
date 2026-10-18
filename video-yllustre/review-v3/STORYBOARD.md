# Yllustre V3 — direção com motionmaxxing

Problema: eventos acontecem uma vez; o público precisa reconhecer a cobertura da Yllustre.
Público: organizadores e pessoas planejando celebrações, em feed vertical, inclusive sem som.
Objetivo: solicitar orçamento pelo WhatsApp real da agência.
Emoção: do momento passageiro à confiança em guardar uma história.

Inventário: logo original amarelo; fotografia de casamento e bastidores; verbo contar; voz humana; amarelo #ffe100 sobre preto #090909; Arial e contraponto Georgia itálico. Não inventar clientes, resultados ou imagens de eventos corporativos.

Alternativas: tipografia pura perde as imagens reais; demonstração simulada de publicação exigiria interface sem captura; montagem das imagens reais muda de escala entre bastidores, stories e filme. Escolhida a montagem: o mesmo casamento liga os serviços à memória, usando material da marca. A ligação vem das fotografias, da frase “A história continua” e da identidade; a ideia ainda pertence parcialmente à categoria, limitação reconhecida.

Um mundo: fotografia como material, luz superior esquerda, sombras de contato, planos afastados com parallax contrário; fundos derivados da fotografia desfocada. Sem pessoas ou imagens geradas. Nitidez consistente nos movimentos; sem bounce ou glitch. Música original existente, sem locução nova ou uso de ElevenLabs.

| Tempo | Papel / o que compra | Imagem, movimento e passagem | Importância |
|---|---|---|---|
| 0–5s | Hook: o evento passa, a história continua | Celebração em arco; frase sobe por máscara em 12 quadros; foto compartilhada muda de enquadramento | 2 |
| 5–10s | Prova: existe uma pessoa dedicada ao registro | Foto real da profissional; planos de sombra e fundo em velocidades diferentes | 1 |
| 10–15s | Prova: o olhar inclui pequenos momentos | Preparativos, oração e encontro, cortes fotográficos com câmera em movimento | 1 |
| 15–21s | Prova: presença durante o acontecimento | Quadro vertical ampliado; cenas reais dentro dele, serviço legível; segue a mesma foto no próximo plano | 2 |
| 21–27s | Prova: o registro ganha conteúdo | Celebração dominante, bastidores secundários com menos da metade da área; a foto cresce até ocupar a tela | 3 |
| 27–33s | Prova emocional: o filme guarda sentimento | Retratos de oração e do encontro em tela inteira; respiração mais calma após a passagem expansiva | 2 |
| 33–39s | Abrangência: serviços para outros eventos | Fotografia impressa, perspectiva e sombra; nomes dos tipos de evento, sem simular portfólio de formatura/corporativo | 1 |
| 39–43.7s | CTA: facilitar a conversa | Pergunta, pedido de orçamento e telefone verdadeiro, em sequência | 2 |
| 43.7–45s | Assinatura: lembrar a agência | Logo original chega de 1.7x para 1x em 12 quadros; repouso final previsto de 27 quadros (0.9s) | 1 |

Skill: https://github.com/Tejashmakwana/motionmaxxing. Regras de direção, entradas de 12 quadros com desaceleração, máscaras, handoffs e encerramento curto adaptados para Remotion; sem substituir a renderização determinística pelo runtime GSAP. V1 e V2 preservadas. G0/G2/G3 calculados com look.py; G5 pelo lint original via adaptador Player que renderiza a composição real. G1/G4 exigem inspeção visual. Principal momento: fotografia da celebração deixa o quadro de conteúdo e ocupa a tela antes do retrato emocional.

Repositório consultado no commit 8c8ec0f2a6f6c9a0da15cd24f7b1298ab298368c.
