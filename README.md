# OuvidoLab 🦻

Laboratório virtual educativo sobre o funcionamento do sistema auditivo.

## Arquivos

- `index.html` — estrutura da aplicação
- `style.css` — visual, responsividade e animações
- `script.js` — interações, SVG, teste auditivo e Web Audio API
- `assets/ouvido-anatomia.webp/.png` — ilustração anatômica usada no modelo interativo
- `assets/` — pasta reservada para imagens/sons adicionais

## Como executar

1. Abra a pasta no VS Code.
2. Abra `index.html` no navegador.
3. Para uma experiência melhor, use a extensão **Live Server** do VS Code e clique em "Go Live".

Não é necessário instalar Node.js ou outro servidor para a versão atual.

## Sobre o teste auditivo

O teste usa a Web Audio API para gerar tons. O controle de "nível experimental" é relativo ao navegador/aparelho e **não representa dB SPL calibrados**. Portanto, o resultado não é uma audiometria clínica nem deve ser usado para diagnosticar perda auditiva.

## Próximas melhorias sugeridas

- adicionar um SVG anatômico mais detalhado;
- criar modo escuro/claro;
- guardar histórico com localStorage;
- adicionar quiz com níveis;
- adicionar acessibilidade (teclado, ARIA, alto contraste);
- adicionar fontes e referências científicas;
- criar PWA instalável;
- adicionar uma página de referências e créditos.
