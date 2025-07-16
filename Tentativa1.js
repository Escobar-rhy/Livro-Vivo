let currentPage = 0; // Começa na capa (página 0)
const totalPages = 5; // Total de páginas no HTML fornecido (0, 1, 2, 3)

function showPage(pageNumber) {
    // Esconde todas as páginas e reseta seus estilos de animação
    for (let i = 0; i <= totalPages; i++) { // Altera para começar do 0
        const page = document.getElementById(`page${i}`);
        if (page) {
            page.style.display = 'none';
            // Garante que a página esteja pronta para a próxima animação
            page.style.transform = 'rotateY(0deg)';
            page.style.opacity = '1';
            page.style.zIndex = '1'; // Garante que a página atual esteja acima
        }
    }

    // Mostra a página atual
    const pageToShow = document.getElementById(`page${pageNumber}`);
    if (pageToShow) {
        pageToShow.style.display = 'flex'; // flex para centralizar o conteúdo
        pageToShow.style.zIndex = '2'; // Coloca a página atual no topo
    }
}

function nextPage() {
    if (currentPage < totalPages) {
        const currentPageElement = document.getElementById(`page${currentPage}`);
        if (currentPageElement) {
            // Inicia a animação de virar a página
            currentPageElement.style.transform = 'rotateY(-180deg)'; // Gira 180 graus para simular a virada
            currentPageElement.style.opacity = '0'; // Faz a página atual desaparecer
            currentPageElement.style.pointerEvents = 'none'; // Desabilita cliques durante a transição
            currentPageElement.style.zIndex = '0'; // Garante que a página virada vá para trás
        }

        setTimeout(() => {
            // Remove os estilos de animação da página anterior após a transição
            if (currentPageElement) {
                currentPageElement.style.transform = 'rotateY(0deg)'; // Reseta a rotação para o próximo uso
                currentPageElement.style.opacity = '1'; // Reseta a opacidade
                currentPageElement.style.pointerEvents = 'auto'; // Reabilita cliques
            }

            currentPage++;
            showPage(currentPage);
        }, 500); // Espera a animação terminar (0.5s)
    }
}

function prevPage() { // Pagina anterior
    if (currentPage > 0) { // Altera para permitir voltar para a capa (página 0)
        const currentPageElement = document.getElementById(`page${currentPage}`);
        if (currentPageElement) {
            // Esconde a página atual primeiro antes de animar a anterior
            currentPageElement.style.display = 'none';
        }

        currentPage--;
        const prevPageElement = document.getElementById(`page${currentPage}`);
        if (prevPageElement) {
            prevPageElement.style.transform = 'rotateY(-180deg)'; // Começa girado para a animação de volta
            prevPageElement.style.opacity = '0';
            prevPageElement.style.display = 'flex'; // Exibe a página antes de animar
            prevPageElement.style.zIndex = '2'; // Coloca a página atual no topo

            setTimeout(() => {
                prevPageElement.style.transform = 'rotateY(0deg)'; // Anima para a posição normal
                prevPageElement.style.opacity = '1'; // Anima para aparecer
            }, 10); // Pequeno atraso para a transição ser percebida
        }
    }
}

// Mostra a capa (página 0) ao carregar
document.addEventListener('DOMContentLoaded', () => {
    showPage(currentPage);
});
