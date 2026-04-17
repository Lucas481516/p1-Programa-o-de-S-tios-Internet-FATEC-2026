// Seleciona os elementos do HTML
const searchInput = document.getElementById('searchInput');
const searchBtn   = document.getElementById('searchBtn');
const grid        = document.getElementById('grid');
const status      = document.getElementById('status');

// Quando o botão for clicado, chama a função de busca
searchBtn.addEventListener('click', buscarPersonagens);

// Também busca ao pressionar Enter no campo de texto
searchInput.addEventListener('keydown', function(evento) {
  if (evento.key === 'Enter') {
    buscarPersonagens();
  }
});

// Função principal: busca os personagens na API
async function buscarPersonagens() {
  const nome = searchInput.value.trim();

  // Monta a URL com o nome digitado (ou sem filtro se vazio)
  const url = `https://rickandmortyapi.com/api/character/?name=${encodeURIComponent(nome)}`;

  // Limpa os cards anteriores e mostra mensagem de carregamento
  grid.innerHTML = '';
  status.textContent = 'Buscando...';

  try {
    // Faz a requisição para a API
    const resposta = await fetch(url);

    // Se a API retornar erro (ex: nenhum resultado), lança um erro
    if (!resposta.ok) {
      throw new Error('Nenhum personagem encontrado.');
    }

    // Converte a resposta para JSON
    const dados = await resposta.json();

    // Pega apenas os 3 primeiros resultados
    const personagens = dados.results.slice(0, 3);

    // Atualiza o texto de status
    status.textContent = `Exibindo 3 de ${dados.info.count} resultado(s) encontrado(s).`;

    // Cria um card para cada personagem
    personagens.forEach(function(personagem) {
      const card = document.createElement('div');
      card.classList.add('card');

      card.innerHTML = `
        <img src="${personagem.image}" alt="${personagem.name}" />
        <div class="card-body">
          <h3>${personagem.name}</h3>
          <p>Espécie: ${personagem.species}</p>
          <p>Status: ${personagem.status}</p>
          <p>Origem: ${personagem.origin.name}</p>
        </div>
        <a class="learn-more" href="https://rickandmortyapi.com/api/character/${personagem.id}" target="_blank">LEARN MORE</a>
      `;

      // Adiciona o card na página
      grid.appendChild(card);
    });

  } catch (erro) {
    // Exibe mensagem de erro caso algo dê errado
    status.textContent = '';
    grid.innerHTML = `<p style="color: red;">${erro.message}</p>`;
  }
}

// Carrega personagens automaticamente ao abrir a página
buscarPersonagens();
