// constantes
const TAXA_ENTREGA = 12;        // valor da taxa de entrega fixa
const LIMITE_CUPOM = 100;       // o cupom só vale para compras ACIMA desse valor
const CODIGO_CUPOM = 'LIVRO10'; // cupom para dar o desconto
const DESCONTO_CUPOM = 0.10;    // 10%
const POR_VEZ = 4;              // quantos livros aparecem por vez no catálogo

const CORES = { 'Romance': '#b4234a', 'Fantasia': '#0f766e', 'Técnicos': '#1d6fa5', 'Infantil': '#b45309' };
const CLASSES = { 'Romance': 'cat-romance', 'Fantasia': 'cat-fantasia', 'Técnicos': 'cat-tecnicos', 'Infantil': 'cat-infantil' };

// dados dos cards
const LIVROS = [
    { id: 1, titulo: 'Dom Casmurro', autor: 'Machado de Assis', categoria: 'Romance', preco: 34.90, editora: 'Principis', ano: 1899, paginas: 256, sinopse: 'Bentinho relembra o amor por Capitu e a dúvida que marcou sua vida: ela o traiu ou não?' },
    { id: 2, titulo: 'O Hobbit', autor: 'J.R.R. Tolkien', categoria: 'Fantasia', preco: 49.90, editora: 'HarperCollins', ano: 1937, paginas: 336, destaque: true, sinopse: 'O pacato hobbit Bilbo Bolseiro parte com treze anões para recuperar um tesouro guardado por um dragão.' },
    { id: 3, titulo: 'Código Limpo', autor: 'Robert C. Martin', categoria: 'Técnicos', preco: 89.90, editora: 'Alta Books', ano: 2008, paginas: 425, sinopse: 'Técnicas e boas práticas para escrever código legível, simples e fácil de manter.' },
    { id: 4, titulo: 'O Pequeno Príncipe', autor: 'Antoine de Saint-Exupéry', categoria: 'Infantil', preco: 29.90, editora: 'Agir', ano: 1943, paginas: 96, sinopse: 'Um piloto perdido no deserto conhece um pequeno príncipe, que lhe conta sobre seus planetas e a amizade.' },
    { id: 5, titulo: 'Orgulho e Preconceito', autor: 'Jane Austen', categoria: 'Romance', preco: 42.90, editora: 'Penguin-Companhia', ano: 1813, paginas: 424, destaque: true, sinopse: 'Elizabeth Bennet e o orgulhoso Sr. Darcy precisam vencer as aparências e os preconceitos para se entender.' },
    { id: 6, titulo: 'Harry Potter e a Pedra Filosofal', autor: 'J.K. Rowling', categoria: 'Fantasia', preco: 44.90, editora: 'Rocco', ano: 1997, paginas: 264, sinopse: 'Ao completar onze anos, Harry descobre que é bruxo e ingressa na Escola de Magia de Hogwarts.' },
    { id: 7, titulo: 'Entendendo Algoritmos', autor: 'Aditya Bhargava', categoria: 'Técnicos', preco: 74.90, editora: 'Novatec', ano: 2016, paginas: 264, destaque: true, sinopse: 'Guia ilustrado e bem-humorado que explica algoritmos clássicos com exemplos do dia a dia.' },
    { id: 8, titulo: 'Reinações de Narizinho', autor: 'Monteiro Lobato', categoria: 'Infantil', preco: 39.90, editora: 'Globinho', ano: 1931, paginas: 208, sinopse: 'Narizinho vive aventuras no Sítio do Picapau Amarelo com Emília, o Visconde e Dona Benta.' },
    { id: 9, titulo: 'O Amor nos Tempos do Cólera', autor: 'Gabriel García Márquez', categoria: 'Romance', preco: 59.90, editora: 'Record', ano: 1985, paginas: 432, sinopse: 'Florentino Ariza espera mais de cinquenta anos para reencontrar o grande amor da juventude.' },
    { id: 10, titulo: 'O Nome do Vento', autor: 'Patrick Rothfuss', categoria: 'Fantasia', preco: 79.90, editora: 'Arqueiro', ano: 2007, paginas: 656, sinopse: 'Kvothe, lendário mago e músico, conta a própria história desde a infância numa trupe de artistas.' },
    { id: 11, titulo: 'O Programador Pragmático', autor: 'A. Hunt e D. Thomas', categoria: 'Técnicos', preco: 99.90, editora: 'Bookman', ano: 1999, paginas: 344, sinopse: 'Dicas práticas para quem quer evoluir na carreira e produzir software de qualidade.' },
    { id: 12, titulo: 'Alice no País das Maravilhas', autor: 'Lewis Carroll', categoria: 'Infantil', preco: 36.90, editora: 'Zahar', ano: 1865, paginas: 208, destaque: true, sinopse: 'Alice segue um coelho branco, cai numa toca e chega a um mundo de personagens absurdos.' }
];

// funções de auxilio
const moeda = valor => valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

// minúsculas e sem acentos
function normalizar(texto) {
    return texto.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

// gera a capa do livro como imagem SVG
function capa(l) {
    const linhas = l.titulo.match(/.{1,14}(\s+|$)/g).map(t => t.trim());
    const titulo = linhas.map((t, i) => `<text x="100" y="${105 + i * 26}" font-size="22" font-weight="700">${t}</text>`).join('');
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 300" font-family="Georgia,serif" fill="#fff" text-anchor="middle">
      <rect width="200" height="300" fill="${CORES[l.categoria]}"/>
      <rect x="12" y="12" width="176" height="276" fill="none" stroke="#fff" stroke-opacity=".5"/>
      ${titulo}<text x="100" y="270" font-size="12">${l.autor}</text></svg>`;
    return 'data:image/svg+xml,' + encodeURIComponent(svg);
}

function mostrarMensagem(caixa, texto, ok) {
    caixa.textContent = texto;
    caixa.className = ok ? 'msg-ok' : 'msg-erro';
    caixa.hidden = false;
}
function mostrarErro(caixa, mensagem) {
    caixa.textContent = mensagem;
    caixa.hidden = false;
}
function esconderErro(caixa) {
    caixa.hidden = true;
    caixa.textContent = '';
}

// localStorage
function lerDados(chave, padrao) {
    try {
        const texto = localStorage.getItem(chave);
        return texto === null ? padrao : JSON.parse(texto);
    } catch {
        return padrao;
    }
}
function salvarDados(chave, valor) {
    try { localStorage.setItem(chave, JSON.stringify(valor)); } catch { /* sem armazenamento */}
}

// classes
class ItemCarrinho {
    constructor(livro, quantidade = 1) {
        this.livro = livro;
        this.quantidade = quantidade;
    }
    get subtotal() { return this.livro.preco * this.quantidade; }
}

class Carrinho {
    constructor() {
        // no localStorage guardamos só id e quantidade; o resto vem do array LIVROS
        this.itens = lerDados('carrinho', [])
            .filter(s => LIVROS.some(l => l.id === s.id))
            .map(s => new ItemCarrinho(LIVROS.find(l => l.id === s.id), s.quantidade));
        this.cupomAtivo = lerDados('cupom', false);
    }
    salvar() {
        salvarDados('carrinho', this.itens.map(i => ({ id: i.livro.id, quantidade: i.quantidade })));
        salvarDados('cupom', this.cupomAtivo);
    }
    adicionar(livro) {
        let item = this.itens.find(i => i.livro.id === livro.id);
        if (item) item.quantidade++;
        else {
            item = new ItemCarrinho(livro);
            this.itens.push(item);
        }
        this.salvar();
        return item;
    }
    alterar(id, delta) {
        const item = this.itens.find(i => i.livro.id === id);
        if (item) item.quantidade = Math.max(1, item.quantidade + delta);
        this.salvar();
    }
    remover(id) {
        this.itens = this.itens.filter(i => i.livro.id !== id);
        this.salvar();
    }
    limpar() {
        this.itens = [];
        this.cupomAtivo = false;
        this.salvar();
    }

    get quantidadeTotal() { return this.itens.reduce((soma, i) => soma + i.quantidade, 0); }
    get subtotal() { return this.itens.reduce((soma, i) => soma + i.subtotal, 0); }
    get desconto() { return this.cupomAtivo && this.subtotal > LIMITE_CUPOM ? this.subtotal * DESCONTO_CUPOM : 0; }
    get taxa() { return this.itens.length > 0 ? TAXA_ENTREGA : 0; }
    get total() { return this.subtotal - this.desconto + this.taxa; }
}

class Pedido {
    constructor(cliente, carrinho) {
        this.cliente = cliente;
        this.itens = carrinho.itens.map(i => ({
            nome: i.livro.titulo, preco: i.livro.preco, quantidade: i.quantidade, subtotal: i.subtotal
        }));
        this.subtotal = carrinho.subtotal;
        this.desconto = carrinho.desconto;
        this.taxaEntrega = carrinho.taxa;
        this.total = carrinho.total;
    }
}

const carrinho = new Carrinho();

// model usados nas duas paginas
function atualizarContador() {
    document.getElementById('contadorCarrinho').textContent = carrinho.quantidadeTotal;
}
atualizarContador();

document.getElementById('botaoTema').addEventListener('click', function () {
    const escuro = document.body.classList.toggle('dark-mode');
    salvarDados('tema', escuro ? 'escuro' : 'claro');
});
const temaSalvo = lerDados('tema', null);
if (temaSalvo === 'escuro' || (temaSalvo === null && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.body.classList.add('dark-mode');
}

// Menu celular
const botaoMenu = document.getElementById('botaoMenu');
const menu = document.getElementById('menuPrincipal');
function alternarMenu(abrir) {
    menu.classList.toggle('aberto', abrir);
    botaoMenu.setAttribute('aria-expanded', menu.classList.contains('aberto'));
}
botaoMenu.addEventListener('click', () => alternarMenu());
menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => alternarMenu(false)));

// index
const listaLivros = document.getElementById('lista-livros');
const vitrine = document.getElementById('vitrine');
const campoBusca = document.getElementById('busca-nome');
const botoesFiltro = document.querySelectorAll('.filtro');
const semResultado = document.getElementById('sem-resultado');
const botaoMais = document.getElementById('botaoMais');
const modalLivro = document.getElementById('modalLivro');
const toast = document.getElementById('toast');

let categoriaAtual = 'todas';
let encontrados = [];   // livros que passaram na busca e no filtro
let visiveis = 0;       // livros visiveis

function criarCard(l) {
    const card = document.createElement('article');
    card.className = `bloco-produto ${CLASSES[l.categoria]}`;
    card.dataset.id = l.id;
    card.tabIndex = 0;
    card.setAttribute('aria-label', `Ver detalhes de ${l.titulo}`);
    card.innerHTML = `
      <img class="capa" src="${capa(l)}" alt="Capa do livro ${l.titulo}, de ${l.autor}">
      <div class="corpo">
        <span class="tag">${l.categoria}</span>
        <h3>${l.titulo}</h3>
        <p class="autor">${l.autor}</p>
        <p class="preco">${moeda(l.preco)}</p>
        <button type="button" class="botao-principal btn-add">Adicionar ao carrinho</button>
      </div>`;
    return card;
}

// atualização d catalogo a partir da busca
function atualizarLista() {
    const termo = normalizar(campoBusca.value.trim());
    encontrados = LIVROS.filter(l =>
        (categoriaAtual === 'todas' || l.categoria === categoriaAtual) &&
        normalizar(l.titulo + ' ' + l.autor).includes(termo));
    listaLivros.innerHTML = '';
    visiveis = 0;
    semResultado.hidden = encontrados.length > 0;
    mostrarMais();
}

// botão para mostrar mais livros
function mostrarMais() {
    encontrados.slice(visiveis, visiveis + POR_VEZ).forEach(l => listaLivros.appendChild(criarCard(l)));
    visiveis += POR_VEZ;
    botaoMais.hidden = visiveis >= encontrados.length;
}

function adicionarAoCarrinho(livro) {
    const item = carrinho.adicionar(livro);
    atualizarContador();
    mostrarToast(`${livro.titulo} adicionado ao carrinho (${item.quantidade}x)`);
}

let temporizadorToast;
function mostrarToast(texto) {
    toast.textContent = texto;
    toast.hidden = false;
    clearTimeout(temporizadorToast);
    temporizadorToast = setTimeout(() => { toast.hidden = true; }, 2000);
}

// detalhes dos livros nos cards
function abrirDetalhe(l) {
    document.getElementById('detalheLivro').innerHTML = `
      <img class="capa-grande" src="${capa(l)}" alt="Capa ampliada do livro ${l.titulo}, de ${l.autor}">
      <span class="tag ${CLASSES[l.categoria]}">${l.categoria}</span>
      <h2 id="tituloLivro">${l.titulo}</h2>
      <ul class="ficha">
        <li><strong>Autor:</strong> ${l.autor}</li>
        <li><strong>Editora:</strong> ${l.editora}</li>
        <li><strong>Ano:</strong> ${l.ano}</li>
        <li><strong>Páginas:</strong> ${l.paginas}</li>
        <li><strong>Preço:</strong> ${moeda(l.preco)}</li>
      </ul>
      <p class="sinopse"><strong>Sinopse:</strong> ${l.sinopse}</p>
      <div class="acoes-modal">
        <button type="button" class="botao-principal" id="addDetalhe">Adicionar ao carrinho</button>
        <button type="button" class="botao-link" id="voltarCatalogo">Voltar ao catálogo</button>
      </div>`;
    document.getElementById('addDetalhe').addEventListener('click', () => {
        modalLivro.close();
        adicionarAoCarrinho(l);
    });
    document.getElementById('voltarCatalogo').addEventListener('click', () => modalLivro.close());
    modalLivro.showModal();
}

const livroDoCard = card => LIVROS.find(l => l.id === Number(card.dataset.id));

if (listaLivros) {
    // vitrine
    LIVROS.filter(l => l.destaque).forEach(l => vitrine.appendChild(criarCard(l)));

    // card e adicionar ao carrinho clicando nele
    [listaLivros, vitrine].forEach(area => {
        area.addEventListener('click', e => {
            const card = e.target.closest('.bloco-produto');
            if (!card) return;
            if (e.target.closest('.btn-add')) adicionarAoCarrinho(livroDoCard(card));
            else abrirDetalhe(livroDoCard(card));
        });
        area.addEventListener('keydown', e => {
            if (e.key === 'Enter' && e.target.classList.contains('bloco-produto')) abrirDetalhe(livroDoCard(e.target));
        });
    });

    document.getElementById('botaoDestaque').addEventListener('click', () => abrirDetalhe(LIVROS.find(l => l.id === 2)));
    document.getElementById('fecharLivro').addEventListener('click', () => modalLivro.close());
    botaoMais.addEventListener('click', mostrarMais);
    campoBusca.addEventListener('input', () => {
        atualizarLista();
    });

    botoesFiltro.forEach(botao => {
        botao.addEventListener('click', () => {
            botoesFiltro.forEach(b => b.classList.remove('ativo'));
            botao.classList.add('ativo');
            categoriaAtual = botao.dataset.filtro;
            atualizarLista();
        });
    });
    atualizarLista();

    // formulario de contato
    const formContato = document.getElementById('formContato');
    const msgContato = document.getElementById('msgContato');
    formContato.addEventListener('submit', e => {
        e.preventDefault();
        const campos = formContato.elements;
        const nome = campos.nome.value.trim();
        let erro = null;
        if (nome.length < 3) erro = 'Informe seu nome (mínimo 3 letras).';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(campos.email.value.trim())) erro = 'Informe um e-mail válido, como nome@email.com.';
        else if (campos.mensagem.value.trim().length < 10) erro = 'A mensagem precisa ter pelo menos 10 caracteres.';

        if (erro) {
            mostrarMensagem(msgContato, erro, false);
            return;
        }
        mostrarMensagem(msgContato, `Obrigado, ${nome}! Recebemos sua mensagem e responderemos em breve.`, true);
        formContato.reset();
    });
}

// carrinho
const listaCarrinho = document.getElementById('listaCarrinho');
const areaCarrinho = document.getElementById('areaCarrinho');
const vazioCarrinho = document.getElementById('vazioCarrinho');
const formCupom = document.getElementById('formCupom');
const inputCupom = document.getElementById('codigoCupom');
const msgCupom = document.getElementById('msgCupom');
const formPedido = document.getElementById('formPedido');
const erroPedido = document.getElementById('erroPedido');
const inputNomeCliente = document.getElementById('nomeCliente');
const modalPedido = document.getElementById('modalPedido');

function criarCarrinho() {
    listaCarrinho.innerHTML = '';
    areaCarrinho.hidden = carrinho.itens.length === 0;
    vazioCarrinho.hidden = carrinho.itens.length > 0;

    carrinho.itens.forEach(item => {
        const l = item.livro;
        const linha = document.createElement('tr');
        linha.innerHTML = `
          <td><img class="miniatura" src="${capa(l)}" alt="Capa do livro ${l.titulo}"></td>
          <td>${l.titulo}<br><span class="preco-unit">${moeda(l.preco)} cada</span></td>
          <td>
            <button type="button" class="btn-qtd" onclick="alterarQuantidade(${l.id}, -1)" aria-label="Diminuir quantidade de ${l.titulo}" ${item.quantidade === 1 ? 'disabled' : ''}>−</button>
            <span class="qtd-badge">${item.quantidade}</span>
            <button type="button" class="btn-qtd" onclick="alterarQuantidade(${l.id}, 1)" aria-label="Aumentar quantidade de ${l.titulo}">+</button>
          </td>
          <td>${moeda(item.subtotal)}</td>
          <td><button type="button" class="btn-remover" onclick="removerItem(${l.id})" aria-label="Remover ${l.titulo}">Remover</button></td>`;
        listaCarrinho.appendChild(linha);
    });

    atualizarTotais();
}

function atualizarTotais() {
    if (carrinho.cupomAtivo && carrinho.subtotal <= LIMITE_CUPOM) {
        carrinho.cupomAtivo = false;
        carrinho.salvar();
        mostrarMensagem(msgCupom, `Cupom removido: só vale para compras acima de ${moeda(LIMITE_CUPOM)}.`, false);
    } else if (carrinho.cupomAtivo) {
        mostrarMensagem(msgCupom, `Cupom ${CODIGO_CUPOM} aplicado: 10% de desconto.`, true);
    } else {
        msgCupom.hidden = true;
    }

    document.getElementById('subtotal').textContent = moeda(carrinho.subtotal);
    document.getElementById('desconto').textContent = '- ' + moeda(carrinho.desconto);
    document.getElementById('linhaDesconto').hidden = carrinho.desconto === 0;
    document.getElementById('taxaEntrega').textContent = moeda(carrinho.taxa);
    document.getElementById('valorTotal').textContent = moeda(carrinho.total);
    atualizarContador();
}

function alterarQuantidade(id, delta) {
    carrinho.alterar(id, delta);
    criarCarrinho();
}

function removerItem(id) {
    carrinho.remover(id);
    criarCarrinho();
}

function mostrarResumo(p) {
    const itens = p.itens.map(i => `<li>${i.quantidade}x ${i.nome} — ${moeda(i.subtotal)}</li>`).join('');
    const desconto = p.desconto > 0 ? `<br>Desconto (cupom): - ${moeda(p.desconto)}` : '';

    document.getElementById('resumoPedido').innerHTML = `
      <p>Cliente: <strong id="clienteResumo"></strong></p>
      <ul>${itens}</ul>
      <p>Subtotal: ${moeda(p.subtotal)}${desconto}<br>Taxa de entrega: ${moeda(p.taxaEntrega)}</p>
      <p class="total-resumo">Valor Total: ${moeda(p.total)}</p>`;
    document.getElementById('clienteResumo').textContent = p.cliente.nome;
    modalPedido.showModal();
}

if (formPedido) {
    formCupom.addEventListener('submit', function (evento) {
        evento.preventDefault();
        const codigo = inputCupom.value.trim().toUpperCase();

        if (codigo !== CODIGO_CUPOM) {
            mostrarMensagem(msgCupom, 'Cupom inválido.', false);
        } else if (carrinho.subtotal <= LIMITE_CUPOM) {
            mostrarMensagem(msgCupom, `O cupom só vale para compras acima de ${moeda(LIMITE_CUPOM)}.`, false);
        } else {
            carrinho.cupomAtivo = true;
            carrinho.salvar();
            inputCupom.value = '';
            criarCarrinho();
        }
    });

    formPedido.addEventListener('submit', function (evento) {
        evento.preventDefault();
        esconderErro(erroPedido);

        const cliente = { nome: inputNomeCliente.value.trim() };
        let erro = null;
        if (carrinho.itens.length === 0) erro = 'O carrinho está vazio';
        else if (cliente.nome.length < 3) erro = 'Informe o nome do cliente (mínimo 3 letras)';

        if (erro) {
            mostrarErro(erroPedido, erro);
            return;
        }

        const pedido = new Pedido(cliente, carrinho);
        mostrarResumo(pedido);

        carrinho.limpar();
        formPedido.reset();
        criarCarrinho();
    });

    document.getElementById('botaoFechar').addEventListener('click', () => modalPedido.close());

    criarCarrinho();
}