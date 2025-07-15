let currentPage = 0; // Começa na capa (página 0)
const totalPages = 7; // Total de páginas: 0 a 7

const backgroundMusic = document.getElementById('backgroundMusic');
let musicPlaying = false;

// Elementos para o efeito de TV Antiga (Página 3)
const tvOverlay = document.getElementById('tvOverlay');
let tvAnimationFrameId;
let tvIsActive = false; // Estado do efeito TV

// Elementos para o efeito de Lanterna (Página 4)
const flashlightBeam = document.getElementById('flashlightBeam');
const darknessImageContainer = document.querySelector('.image-with-flashlight-container');
let flashlightIsOn = false; // Estado da lanterna

// Função principal para mostrar páginas
function showPage(pageNumber) {
    // Esconde e reseta todas as páginas
    for (let i = 0; i <= totalPages; i++) {
        const page = document.getElementById(`page${i}`);
        if (page) {
            page.style.display = 'none';
            page.style.transform = 'rotateY(0deg)';
            page.style.opacity = '1';
            page.style.zIndex = '1';
        }
    }

    // Para qualquer efeito especial ativo em páginas anteriores
    stopTvEffect();
    turnOffFlashlight();

    // Mostra a página atual
    const pageToShow = document.getElementById(`page${pageNumber}`);
    if (pageToShow) {
        pageToShow.style.display = 'flex';
        pageToShow.style.zIndex = '2';

        // Ativa efeitos específicos para certas páginas
        if (pageNumber === 3) {
            startTvEffect();
        }
        if (pageNumber === 4) {
            // Inicializa a imagem da lanterna como escura
            if (darknessImageContainer) {
                darknessImageContainer.classList.remove('lit');
            }
        }
    }
}

// Navegação para a próxima página
function nextPage() {
    if (currentPage < totalPages) {
        const currentPageElement = document.getElementById(`page${currentPage}`);
        if (currentPageElement) {
            currentPageElement.style.transform = 'rotateY(-180deg)';
            currentPageElement.style.opacity = '0';
            currentPageElement.style.pointerEvents = 'none';
            currentPageElement.style.zIndex = '0'; // Envia para trás
        }

        setTimeout(() => {
            if (currentPageElement) {
                currentPageElement.style.transform = 'rotateY(0deg)';
                currentPageElement.style.opacity = '1';
                currentPageElement.style.pointerEvents = 'auto';
            }

            currentPage++;
            showPage(currentPage);
        }, 800); // Tempo para a transição
    }
}

// Navegação para a página anterior
function prevPage() {
    if (currentPage > 0) {
        const currentPageElement = document.getElementById(`page${currentPage}`);
        if (currentPageElement) {
            currentPageElement.style.display = 'none'; // Esconde a página atual primeiro
        }

        currentPage--;
        const prevPageElement = document.getElementById(`page${currentPage}`);
        if (prevPageElement) {
            prevPageElement.style.transform = 'rotateY(180deg)'; // Começa girado para a volta
            prevPageElement.style.opacity = '0';
            prevPageElement.style.display = 'flex'; // Exibe a página antes de animar
            prevPageElement.style.zIndex = '2'; // Coloca no topo

            setTimeout(() => {
                prevPageElement.style.transform = 'rotateY(0deg)'; // Anima para a posição normal
                prevPageElement.style.opacity = '1'; // Anima para aparecer
            }, 10); // Pequeno atraso para a transição ser percebida
        }
    }
}

// Reiniciar o livro
function restartBook() {
    currentPage = 0;
    showPage(currentPage);
    stopMusic(); // Para a música ao reiniciar
}

// --- Efeitos Sonoros e Música de Fundo ---
document.addEventListener('DOMContentLoaded', () => {
    showPage(currentPage); // Mostra a capa ao carregar

    // Toca a música de fundo apenas na primeira interação
    document.getElementById('startButton').addEventListener('click', () => {
        if (!musicPlaying) {
            backgroundMusic.play().catch(e => console.error("Erro ao tocar música:", e));
            musicPlaying = true;
        }
    });
});

function stopMusic() {
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;
    musicPlaying = false;
}

// --- Efeito de TV Antiga (Página 3) ---
let frameCount = 0;
let distortionFactor = 0;
let scanlineAlpha = 0.1;
let flickerAmount = 0.05;
let glitchIntensity = 0;

function drawTvEffect() {
    if (!tvOverlay) return; // Garante que o elemento existe

    // Esses valores mudam a cada frame para dar a sensação de oscilação
    distortionFactor = Math.sin(frameCount * 0.15) * 3 + Math.random() * 7; // Variação horizontal mais intensa
    flickerAmount = 0.08 + Math.random() * 0.15; // Flicker mais intenso
    glitchIntensity = Math.random() < 0.05 ? Math.random() * 30 : 0; // Glitches esporádicos mais notáveis

    let gradientAngle = frameCount * 5 % 360; // Gira o gradiente
    tvOverlay.style.background = `linear-gradient(${gradientAngle}deg, 
                                  rgba(0,0,0, ${scanlineAlpha + Math.random() * 0.1}) 0%, 
                                  transparent 50%, 
                                  rgba(0,0,0, ${scanlineAlpha + Math.random() * 0.1}) 100%),
                                  repeating-linear-gradient(0deg, 
                                  rgba(0,0,0,${Math.random() * 0.05}) 0%, 
                                  transparent 1%, 
                                  rgba(0,0,0,${Math.random() * 0.05}) 2%)`;
    
    // Adiciona um efeito de "onda" e estática
    let transformX = Math.sin(frameCount * 0.2) * distortionFactor;
    let transformY = Math.cos(frameCount * 0.1) * (distortionFactor / 2);
    tvOverlay.style.transform = `translate(${transformX}px, ${transformY}px)`;
    tvOverlay.style.opacity = 0.8 + (Math.random() * 0.2 - 0.1); // Oscila a opacidade

    // Adiciona "glitches" visuais com box-shadow (mais fácil que manipulação de pixel para este exemplo)
    if (glitchIntensity > 0) {
        let shadow1 = `${Math.random() * 10}px ${Math.random() * 10}px 0 rgba(255,0,0,${Math.random() * 0.3})`;
        let shadow2 = `${Math.random() * -10}px ${Math.random() * -10}px 0 rgba(0,0,255,${Math.random() * 0.3})`;
        tvOverlay.style.boxShadow = `${shadow1}, ${shadow2}`;
    } else {
        tvOverlay.style.boxShadow = 'none';
    }

    frameCount++;
    tvAnimationFrameId = requestAnimationFrame(drawTvEffect);
}

function startTvEffect() {
    if (!tvIsActive && tvOverlay) {
        tvIsActive = true;
        tvOverlay.style.display = 'block'; // Garante que o overlay esteja visível
        drawTvEffect();
    }
}

function stopTvEffect() {
    if (tvAnimationFrameId) {
        cancelAnimationFrame(tvAnimationFrameId);
        tvAnimationFrameId = null;
    }
    if (tvOverlay) {
        tvOverlay.style.display = 'none'; // Esconde o overlay quando o efeito para
        tvOverlay.style.background = 'transparent'; // Reseta o background
        tvOverlay.style.transform = 'none'; // Reseta a transformação
        tvOverlay.style.opacity = '0'; // Garante que esteja invisível
        tvOverlay.style.boxShadow = 'none'; // Remove sombras
    }
    tvIsActive = false;
}

// Interação de mouseover para ativar o efeito TV na página 3
const page3 = document.getElementById('page3');
if (page3) {
    page3.addEventListener('mouseenter', () => {
        if (currentPage === 3) { // Só ativa se estiver na página 3
            startTvEffect();
        }
    });
    // Não paramos no mouseleave para manter o efeito durante a leitura da página
}


// --- Efeito de Lanterna (Página 4) ---
function toggleFlashlightEffect() {
    flashlightIsOn = !flashlightIsOn; // Inverte o estado

    if (flashlightIsOn) {
        flashlightBeam.classList.add('on');
        darknessImageContainer.classList.add('lit');
    } else {
        flashlightBeam.classList.remove('on');
        darknessImageContainer.classList.remove('lit');
    }
}

function turnOffFlashlight() {
    if (flashlightBeam) {
        flashlightBeam.classList.remove('on');
    }
    if (darknessImageContainer) {
        darknessImageContainer.classList.remove('lit');
    }
    flashlightIsOn = false;
}