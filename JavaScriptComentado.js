// A palavra-chave 'let' declara uma variável que pode ser reatribuída.
// currentPage armazena o número da página que o usuário está vendo.
// Começamos em 0, que geralmente é a capa do livro.
let currentPage = 0; 

// 'const' declara uma variável cujo valor não pode ser alterado.
// totalPages é o número total de páginas do livro (de 0 a 7, ou seja, 8 páginas no total).
const totalPages = 7; 

// Pega o elemento de áudio do HTML com o ID 'backgroundMusic' e o armazena em uma variável.
// Isso nos permite controlar a música de fundo via JavaScript.
const backgroundMusic = document.getElementById('backgroundMusic');

// Uma variável booleana (verdadeiro/falso) para rastrear se a música está tocando.
// Começa como 'false' porque a música não toca automaticamente.
let musicPlaying = false;

// --- Elementos e variáveis para o Efeito de TV Antiga (Página 3) ---

// Pega a div HTML com o ID 'tvOverlay'.
// Este será o elemento que usaremos para desenhar o efeito visual de estática e distorção.
const tvOverlay = document.getElementById('tvOverlay');

// Esta variável armazenará o identificador da animação do efeito de TV.
// Isso é necessário para que possamos parar a animação mais tarde.
let tvAnimationFrameId;

// Uma variável booleana para rastrear se o efeito de TV está ativo.
let tvIsActive = false; 

// --- Elementos e variáveis para o Efeito de Lanterna (Página 4) ---

// Pega a div HTML que representa o feixe de luz da lanterna.
const flashlightBeam = document.getElementById('flashlightBeam');

// Pega o contêiner da imagem que será escurecida e iluminada pela lanterna.
const darknessImageContainer = document.querySelector('.image-with-flashlight-container');

// Uma variável booleana para rastrear se a lanterna está ligada.
let flashlightIsOn = false; 

// --- Função principal para mostrar páginas ---

// Esta função recebe um número de página e se encarrega de exibi-la corretamente.
function showPage(pageNumber) {
    // Esconde e reseta todas as páginas antes de mostrar a nova.
    // O 'for' loop itera por todas as páginas (de 0 a 'totalPages').
    for (let i = 0; i <= totalPages; i++) {
        const page = document.getElementById(`page${i}`); // Pega cada página pelo seu ID.
        if (page) { // Verifica se o elemento existe.
            page.style.display = 'none'; // Esconde a página.
            page.style.transform = 'rotateY(0deg)'; // Remove qualquer rotação de transições.
            page.style.opacity = '1'; // Garante que a página esteja totalmente visível se for exibida.
            page.style.zIndex = '1'; // Define a ordem de empilhamento (coloca-a atrás das páginas ativas).
        }
    }

    // Para qualquer efeito especial que esteja ativo para evitar bugs.
    stopTvEffect();
    turnOffFlashlight();

    // Mostra a página atual.
    const pageToShow = document.getElementById(`page${pageNumber}`);
    if (pageToShow) {
        pageToShow.style.display = 'flex'; // Torna a página visível.
        pageToShow.style.zIndex = '2'; // Coloca a página atual na frente de todas as outras.

        // Ativa efeitos específicos para páginas especiais.
        if (pageNumber === 3) {
            startTvEffect(); // Inicia o efeito de TV na página 3.
        }
        if (pageNumber === 4) {
            // Garante que o efeito de lanterna comece desligado na página 4.
            if (darknessImageContainer) {
                darknessImageContainer.classList.remove('lit');
            }
        }
    }
}

// --- Navegação para a próxima página ---

// Esta função é chamada para avançar para a próxima página.
function nextPage() {
    // Verifica se não estamos na última página.
    if (currentPage < totalPages) {
        const currentPageElement = document.getElementById(`page${currentPage}`);
        if (currentPageElement) {
            // Inicia a animação de virar a página.
            currentPageElement.style.transform = 'rotateY(-180deg)';
            currentPageElement.style.opacity = '0'; // Faz a página desaparecer.
            currentPageElement.style.pointerEvents = 'none'; // Desabilita cliques.
            currentPageElement.style.zIndex = '0'; // Coloca a página em transição atrás das outras.
        }

        // 'setTimeout' atrasa a execução do código por 800 milissegundos.
        // Isso permite que a animação de saída termine antes de mostrar a próxima página.
        setTimeout(() => {
            if (currentPageElement) {
                // Reseta a página que saiu para a próxima transição.
                currentPageElement.style.transform = 'rotateY(0deg)';
                currentPageElement.style.opacity = '1';
                currentPageElement.style.pointerEvents = 'auto';
            }

            currentPage++; // Aumenta o número da página.
            showPage(currentPage); // Exibe a nova página.
        }, 800);
    }
}

// --- Navegação para a página anterior ---

// Função para voltar para a página anterior.
function prevPage() {
    // Verifica se não estamos na capa.
    if (currentPage > 0) {
        const currentPageElement = document.getElementById(`page${currentPage}`);
        if (currentPageElement) {
            currentPageElement.style.display = 'none'; // Esconde a página atual primeiro.
        }

        currentPage--; // Diminui o número da página.
        const prevPageElement = document.getElementById(`page${currentPage}`);
        if (prevPageElement) {
            // Prepara a página anterior para a animação de "virar para a frente".
            prevPageElement.style.transform = 'rotateY(180deg)';
            prevPageElement.style.opacity = '0';
            prevPageElement.style.display = 'flex'; // Torna a página visível.
            prevPageElement.style.zIndex = '2'; // Coloca a página no topo.

            // Pequeno atraso para a animação ser percebida.
            setTimeout(() => {
                prevPageElement.style.transform = 'rotateY(0deg)'; // Anima para a posição normal.
                prevPageElement.style.opacity = '1'; // Anima para aparecer.
            }, 10); 
        }
    }
}

// --- Reiniciar o livro ---

function restartBook() {
    currentPage = 0; // Volta para a página 0.
    showPage(currentPage); // Exibe a capa.
    stopMusic(); // Para a música.
}

// --- Efeitos Sonoros e Música de Fundo ---

// 'DOMContentLoaded' é um evento que é disparado quando o HTML é completamente carregado.
document.addEventListener('DOMContentLoaded', () => {
    showPage(currentPage); // Exibe a capa assim que a página carrega.

    // Adiciona um evento de 'click' ao botão com o ID 'startButton'.
    document.getElementById('startButton').addEventListener('click', () => {
        if (!musicPlaying) { // Se a música não estiver tocando...
            // Toca a música e usa '.catch' para tratar possíveis erros de autoplay do navegador.
            backgroundMusic.play().catch(e => console.error("Erro ao tocar música:", e));
            musicPlaying = true; // Atualiza o estado da música.
        }
    });
});

function stopMusic() {
    backgroundMusic.pause(); // Pausa a música.
    backgroundMusic.currentTime = 0; // Volta a música para o início.
    musicPlaying = false; // Atualiza o estado da música.
}

// --- Efeito de TV Antiga (Página 3) ---

// Variáveis para controlar os detalhes da animação da TV.
let frameCount = 0;
let distortionFactor = 0;
let scanlineAlpha = 0.1;
let flickerAmount = 0.05;
let glitchIntensity = 0;

// Esta função é o coração do efeito de TV. Ela é chamada em cada quadro de animação.
function drawTvEffect() {
    if (!tvOverlay) return; // Se o elemento não existir, a função para.

    // Os valores mudam a cada frame para dar a sensação de oscilação e falha.
    distortionFactor = Math.sin(frameCount * 0.15) * 3 + Math.random() * 7;
    flickerAmount = 0.08 + Math.random() * 0.15;
    glitchIntensity = Math.random() < 0.05 ? Math.random() * 30 : 0;

    let gradientAngle = frameCount * 5 % 360; // Gira o gradiente para dar um efeito de movimento.
    // Altera o plano de fundo do overlay para simular estática e linhas de varredura.
    tvOverlay.style.background = `linear-gradient(${gradientAngle}deg, 
                                  rgba(0,0,0, ${scanlineAlpha + Math.random() * 0.1}) 0%, 
                                  transparent 50%, 
                                  rgba(0,0,0, ${scanlineAlpha + Math.random() * 0.1}) 100%),
                                  repeating-linear-gradient(0deg, 
                                  rgba(0,0,0,${Math.random() * 0.05}) 0%, 
                                  transparent 1%, 
                                  rgba(0,0,0,${Math.random() * 0.05}) 2%)`;
    
    // Aplica transformações para criar a "onda" e distorção.
    let transformX = Math.sin(frameCount * 0.2) * distortionFactor;
    let transformY = Math.cos(frameCount * 0.1) * (distortionFactor / 2);
    tvOverlay.style.transform = `translate(${transformX}px, ${transformY}px)`;
    tvOverlay.style.opacity = 0.8 + (Math.random() * 0.2 - 0.1); // Faz a opacidade "piscar".

    // Adiciona "glitches" visuais usando a sombra da caixa.
    if (glitchIntensity > 0) {
        let shadow1 = `${Math.random() * 10}px ${Math.random() * 10}px 0 rgba(255,0,0,${Math.random() * 0.3})`;
        let shadow2 = `${Math.random() * -10}px ${Math.random() * -10}px 0 rgba(0,0,255,${Math.random() * 0.3})`;
        tvOverlay.style.boxShadow = `${shadow1}, ${shadow2}`;
    } else {
        tvOverlay.style.boxShadow = 'none';
    }

    frameCount++; // Incrementa o contador para a próxima animação.
    // 'requestAnimationFrame' pede ao navegador para chamar 'drawTvEffect' novamente.
    tvAnimationFrameId = requestAnimationFrame(drawTvEffect);
}

function startTvEffect() {
    if (!tvIsActive && tvOverlay) {
        tvIsActive = true;
        tvOverlay.style.display = 'block'; // Torna o overlay visível.
        drawTvEffect(); // Inicia o loop da animação.
    }
}

function stopTvEffect() {
    if (tvAnimationFrameId) {
        // 'cancelAnimationFrame' para o loop da animação.
        cancelAnimationFrame(tvAnimationFrameId);
        tvAnimationFrameId = null;
    }
    if (tvOverlay) {
        // Reseta todas as propriedades CSS do overlay.
        tvOverlay.style.display = 'none';
        tvOverlay.style.background = 'transparent';
        tvOverlay.style.transform = 'none';
        tvOverlay.style.opacity = '0';
        tvOverlay.style.boxShadow = 'none';
    }
    tvIsActive = false;
}

// Interação de mouseover para ativar o efeito TV na página 3.
const page3 = document.getElementById('page3');
if (page3) {
    page3.addEventListener('mouseenter', () => {
        if (currentPage === 3) { // O efeito só é ativado se o mouse estiver sobre a página 3.
            startTvEffect();
        }
    });
}

// --- Efeito de Lanterna (Página 4) ---

// Esta função liga ou desliga o efeito da lanterna.
function toggleFlashlightEffect() {
    flashlightIsOn = !flashlightIsOn; // Inverte o estado da variável.

    if (flashlightIsOn) {
        // Se a lanterna for ligada, adiciona a classe 'on' ao feixe e 'lit' ao contêiner.
        flashlightBeam.classList.add('on');
        darknessImageContainer.classList.add('lit');
    } else {
        // Se for desligada, remove as classes.
        flashlightBeam.classList.remove('on');
        darknessImageContainer.classList.remove('lit');
    }
}

// Esta função garante que a lanterna esteja sempre desligada.
function turnOffFlashlight() {
    if (flashlightBeam) {
        flashlightBeam.classList.remove('on');
    }
    if (darknessImageContainer) {
        darknessImageContainer.classList.remove('lit');
    }
    flashlightIsOn = false;
}
