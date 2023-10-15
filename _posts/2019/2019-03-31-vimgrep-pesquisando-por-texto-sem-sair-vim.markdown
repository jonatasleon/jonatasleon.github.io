---
layout: "post"
title: "vimgrep: Pesquisando por texto sem sair do vim"
date: "2019-03-31 19:39"
feature: '/images/vimgrep-feature.png'
category: vim tutorial
tags: vi vim vimgrep grep
---

Para quem está iniciando com vim ou o utiliza eventualmente, pode parecer comum
sair do editor quando precisa utilizar o `grep` para pesquisar por algum trecho
de texto entre os arquivos. Depois de descobrir como utilizar o comando
`vimgrep`, se torna muito prático fazer buscas no próprio editor de texto ao
invés de ter todo o trabalho de voltar para o terminal, fazer a busca e, só
então, abrir o arquivo com o resultado no vim.

## Comandos no vim

Se você já aprendeu como sair do vim sem ter que fechar a janela do terminal
(`:wqa`), sabe que para executar um comando no vim basta digitar `:` que então
o cursor é transferido para a parte inferior da sua janela, onde é possível
inserir os comandos que serão mostrados ao longo deste artigo.

A cada exemplo, o vim será aberto com `vim -u NONE`, para garantir que
o arquivo de de configuração (`vimrc`) não seja carregado e, assim, o vim seja
executado puro, sem qualquer plugin ou modificação.

## vimgrep

vimgrep é um comando nativo dentro do próprio vim. Isso traz praticidade para
quem utiliza o vim de maneira eventual, pois não há necessidade de realizar
configurações adicionais.

Antes de continuar, tenha em mente que todas as buscas serão realizadas
a partir do diretório em que vim foi executado. Para confirmar o diretório,
digite `:pwd`.

### O básico

Assim Você pode utilizar o vimgrep da seguinte maneira:

```
:vimgrep config **/*.js
```

A descrição de cada parte do comando:

* `vimgrep`: o comando propriamente dito;
* `config`: o termo que se está pesquisando;
* `**/*.js`: uma designação coringa (`wildcard`) que determina em quais arquivo será realizada a pequisa, assim, tais símbolos representam:
    * `**`: todos subdiretórios a partir do diretório atual (saiba mais digitando `:help starstart-wildcard`);
    * `*.js`: todos os arquivos com final igual a `.js`;


<script id="asciicast-237787" src="https://asciinema.org/a/237787.js" async></script>
<center>
    <small>vimgrep básico</small>
</center>

### Pesquisando por padrões

Também é possível utiliza padrões de expressões regulares (_regex_):

```
:vimgrep /config.*builder/ **/*.js
```

A diferença entre este comando e o anterior está na maneira com que o termo
pesquisado é utilizado. Temos em `/config.*builder/` o padrão desejado,
ignorando `/`, que é utilizado para determinar o início e o fim do padrão. Com
essa representação se procura um trecho que tenha as palavras `config`
e `builder`, as quais devem ocorrer na ordem que foram declaradas e estar na
mesma linha, podendo, ou não, haver qualquer texto entres cada palavra. Veja
mais aqui: http://vimregex.com.

<script id="asciicast-237827" src="https://asciinema.org/a/237827.js" async></script>
<center>
    <small>Pesquisando por padrões</small>
</center>

### Navegando entre os resultados

Geralmente, mais de um resultado é obtido em pesquisas deste tipo, assim,
navegar entre os demais trechos encontrados é fundamental.

* `:cn`: exibe o próximo resultado;
* `:cp`: exibe o resultado anterior;

<script id="asciicast-237950" src="https://asciinema.org/a/237950.js" async></script>
<center>
    <small>Navegando entre resultados</small>
</center>


### Uma melhor apresentação - _QuickFix_

Ainda há uma maneira de exibir os resultados de forma mais agradável, digite
`:copen` e se abrirá a janela de apresentação de erros, chamada de _QuickFix_,
neste caso, o que é mostrado nela são os resultados da pesquisa realizada.

<script id="asciicast-237951" src="https://asciinema.org/a/237951.js" async></script>
<center>
    <small>Listando resultados em <i>QuickFix</i></small>
</center>

Também é possível fazer tudo em um único comando:

```
:vimgrep exemplo ** | cw
```

Com isso, o resultado será exibido normalmente e a janela de _QuickFix_ já
estará aberta.

Para trocar de janela, pressione `CTRL + W` duas vezes (`<CTRL-W><CTRL-W>`).

## Criando um comando: `FindAll`

Agora que já sabemos como realizar pesquisas ao longo dos arquivos no diretório
atual, é interessante criar um comando que facilite buscas genéricas.

Para criar um comando digite:

```
:command! -nargs=1 FindAll :execute "vimgrep /<args>/gj **" | cw
```

Dessa forma:
* `command!`: designa a criação de um novo comando, a exclamação (`!`) define que substitua o comando caso ele já exista;
* `-nargs=1`: determina a quantidade de parâmetros que o comando irá receber, neste caso, apenas 1;
* `FindAll`: o nome do novo comando;
* `:execute`: executa comandos a partir de _strings_;
* `"vimgrep /<args>/gj **"`: neste caso, temos algumas coisas não utilizadas anteriormente:
    * `g`: determina que todos resultados sejam adicionados, por mais que se repitam na mesma linha;
    * `j`: faz com que apenas a janela _QuickFix_ seja atualizada, sem sair do arquivo atual e pular para o primeiro resultado;

Para evitar que seja necessário criar o comando toda vez que abrir o vim,
adicione o comando ao arquivo `~/.vimrc`.

## Ignorando diretórios

Em alguns casos, não desejamos que as pesquisas sejam realizadas em
determinados diretórios, para isso vamos redefinir a opção de configuração
`wildignore`:

```
set wildignore+=*/node_modules/*
```

Com isso, a busca não mais ocorrerá nos arquivos dentro do diretório
`node_modules`.

Para visualizar arquivos e diretórios que estão ignorados:

```
set wildignore?
```

Também é possível remover um diretório da lista de ignorados:

```
set wildignore-=*/node_modules/*
```

Para saber mais `:help wildignore`.

## Conclusão

Com tudo que foi mostrado, sabemos como:
* Procurar um termo, seja ele específico ou um padrão, em vários arquivos, filtrando pela extensão ou não;
* Navegar entre os resultados, podendo visualizá-los na janela _QuickFix_;
* Criar um comando genérico que facilite a pesquisa;
* Definir diretórios ou arquivos para serem ignorados pela busca, baseados em coringas (`wildcards`).

Agora, para para procurar por qualquer termo, você não precisa mais sair do vim, seja por
praticidade ou por não lembrar como. **:D**
