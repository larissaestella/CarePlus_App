# Alterações — AvatarMAP

## Implementado

- Mascote gamificado com 6 evoluções visuais.
- Evolução automática baseada no XP e nível do usuário.
- Card AvatarMAP na tela inicial.
- Nova área AvatarMAP na tela de progresso.
- Nova tela de personalização com:
  - essências;
  - acessórios;
  - bloqueio de itens por nível;
  - persistência do acessório selecionado.
- Perfil atualizado com a evolução atual do mascote.
- Tela inicial de escolha do avatar redesenhada.
- Emojis removidos das telas e substituídos por ícones do Ionicons.
- Cards de missões, estatísticas e conquistas redesenhados.
- Paleta padrão atualizada para combinar com o novo visual.

## Validações executadas

```bash
npx tsc --noEmit
npm run lint
```

As duas validações foram concluídas sem erros.

## Como executar

```bash
cd newcare
npm install
npx expo start
```

Depois, use uma das opções exibidas pelo Expo para abrir no Android, iOS ou navegador.

## Ajuste de rolagem multiplataforma

- Criado o componente compartilhado `AppScrollView` para padronizar as telas roláveis.
- As áreas de rolagem agora usam `flex: 1` e `minHeight: 0`, impedindo que o conteúdo aumente a altura do layout no navegador.
- Indicadores de rolagem vertical foram habilitados nas telas roláveis.
- No Android, a barra usa `persistentScrollbar` para permanecer visível durante a interação.
- No iOS, foram habilitados ajuste automático de área segura e ajuste do teclado.
- As listas de Início, Missões e Pré-visualização agora possuem altura limitada, barra de rolagem e suporte a rolagem aninhada.
- O cadastro voltou a permitir rolagem em todas as etapas; a etapa de atividades não desativa mais o `ScrollView`.
- Login, onboarding e detalhe da missão agora também se adaptam a telas menores sem esconder botões.
- As rolagens horizontais de evolução e conquistas mostram o indicador quando o conteúdo ultrapassa a largura disponível.
- O contêiner raiz do app foi limitado com `minHeight: 0`, garantindo o comportamento correto no React Native Web.

As validações abaixo foram executadas novamente após o ajuste:

```bash
npx tsc --noEmit
npm run lint
```
