let currentSlide = 1;
const totalSlides = 9;
let lovePercentage = 0;
let confettiStarted = false;
let heartAnimationInterval = null;

// Heart animation setup
function createHeartOverlay() {
    const overlay = document.getElementById('heart-overlay');
    for (let i = 0; i < 30; i++) {
        const heart = document.createElement('div');
        heart.classList.add('heart');
        heart.textContent = '❤️';
        heart.style.left = `${Math.random() * 100}%`;
        heart.style.top = `${Math.random() * 100}%`;
        heart.style.animationDelay = `${Math.random() * 3}s`;
        overlay.appendChild(heart);
    }
}

// Scratch effect
function setupScratch() {
    const overlay = document.getElementById('scratch-overlay');
    const scratchArea = document.querySelector('.scratch-area');
    let isScratching = false;
    let hasSetupCanvas = false;
    let canvas, ctx;
    
    // Crie o canvas apenas uma vez
    function setupCanvas() {
        if (hasSetupCanvas) return;
        
        canvas = document.createElement('canvas');
        ctx = canvas.getContext('2d');
        
        // Ajuste o tamanho do canvas para corresponder ao overlay
        canvas.width = overlay.offsetWidth;
        canvas.height = overlay.offsetHeight;
        
        // Preencha com uma cor cinza que será "raspada"
        ctx.fillStyle = '#e0e0e0';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Adicione um texto ou instrução
        ctx.font = '20px Arial';
        ctx.fillStyle = '#666';
        ctx.textAlign = 'center';
        ctx.fillText('Raspe para revelar', canvas.width / 2, canvas.height / 2);
        
        // Aplique a imagem do canvas como máscara
        overlay.style.background = '#e0e0e0';
        overlay.style.backgroundImage = `url(${canvas.toDataURL()})`;
        
        hasSetupCanvas = true;
    }
    
    // Função para lidar com eventos de mouse/touch
    function handlePointerStart(e) {
        e.preventDefault();
        isScratching = true;
        setupCanvas();
        
        // Capture o primeiro ponto de arrasto
        const point = getEventPoint(e);
        scratch(point.x, point.y);
    }
    
    function handlePointerMove(e) {
        if (!isScratching) return;
        e.preventDefault();
        
        const point = getEventPoint(e);
        scratch(point.x, point.y);
    }
    
    function handlePointerEnd() {
        isScratching = false;
    }
    
    // Função para obter as coordenadas do evento (mouse ou touch)
    function getEventPoint(e) {
        let clientX, clientY;
        
        // Verifique se é um evento de toque ou mouse
        if (e.touches && e.touches.length > 0) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }
        
        const rect = overlay.getBoundingClientRect();
        return {
            x: clientX - rect.left,
            y: clientY - rect.top
        };
    }
    
    // Função para "raspar" em um ponto específico
    function scratch(x, y) {
        // Use composição para tornar transparente onde riscado
        ctx.globalCompositeOperation = 'destination-out';
        
        // Crie um círculo para simular o efeito de raspagem
        ctx.beginPath();
        ctx.arc(x, y, 20, 0, Math.PI * 2);
        ctx.fill();
        
        // Atualize a imagem de fundo do overlay
        overlay.style.backgroundImage = `url(${canvas.toDataURL()})`;
        
        // Verifique a porcentagem raspada
        checkScratched();
    }
    
    // Verifique quanto da área foi raspada
    function checkScratched() {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixelData = imageData.data;
        let transparentPixels = 0;
        let totalPixels = pixelData.length / 4;
        
        // Conte os pixels transparentes (alpha = 0)
        for (let i = 3; i < pixelData.length; i += 4) {
            if (pixelData[i] === 0) {
                transparentPixels++;
            }
        }
        
        // Se mais de 50% da área foi raspada, revele completamente
        const percentScratched = (transparentPixels / totalPixels) * 100;
        if (percentScratched > 50) {
            // Revelação completa com uma animação suave
            overlay.style.transition = 'opacity 0.5s ease';
            overlay.style.opacity = '0';
            
            // Após a animação, remova o overlay completamente
            setTimeout(() => {
                overlay.style.display = 'none';
            }, 500);
        }
    }
    
    // Adicione ouvintes de eventos para mouse e touch
    overlay.addEventListener('mousedown', handlePointerStart);
    overlay.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseup', handlePointerEnd);
    
    // Suporte para dispositivos de toque
    overlay.addEventListener('touchstart', handlePointerStart, { passive: false });
    overlay.addEventListener('touchmove', handlePointerMove, { passive: false });
    overlay.addEventListener('touchend', handlePointerEnd);
    overlay.addEventListener('touchcancel', handlePointerEnd);
    
    // Configuração inicial
    setupCanvas();
}

function nextSlide() {
    if (currentSlide >= totalSlides) return;
    
    // Se estamos saindo do slide 3, pare a animação de corações
    if (currentSlide === 3) {
        stopHeartAnimation();
    }
    
    document.getElementById(`slide${currentSlide}`).classList.remove('active');
    currentSlide++;
    document.getElementById(`slide${currentSlide}`).classList.add('active');
    
    if (currentSlide === 3) {
        createHeartOverlay();
    }
    
    if (currentSlide === 4) {
        setupScratch();
    }
}

function selectMonth(month) {
    // Save the selected month if needed
    // Here you can add code to check if it's the correct month
    
    document.getElementById(`slide${currentSlide}`).classList.remove('active');
    currentSlide++;
    document.getElementById(`slide${currentSlide}`).classList.add('active');
}

function increaseLove() {
    if (lovePercentage < 90) {
        lovePercentage += 10;
    } else {
        lovePercentage = 90;
        document.getElementById(`slide${currentSlide}`).classList.remove('active');
        currentSlide++;
        document.getElementById(`slide${currentSlide}`).classList.add('active');
        stopHeartAnimation();
        createHeartOverlay();
    }
    document.querySelector(".meter-value").textContent = `${lovePercentage}%`;
    
    // Inicie a animação de corações apenas uma vez
    if (!confettiStarted) {
        startHeartAnimation();
        confettiStarted = true;
    } else {
        // Adicione mais corações se a animação já estiver iniciada
        addMoreHearts();
    }
}

function decreaseLove() {
    if (lovePercentage > 0) {
        lovePercentage -= 10;
    }
    document.querySelector(".meter-value").textContent = `${lovePercentage}%`;
}

// Função para iniciar a animação de corações 
function startHeartAnimation() {
    const container = document.getElementById('heart-animation');
    container.innerHTML = '';
    
    // Adicione os primeiros corações
    addMoreHearts();
    
    // Configure um intervalo para adicionar mais corações enquanto o usuário continua clicando
    heartAnimationInterval = setInterval(() => {
        // Este intervalo apenas mantém a animação ativa
        // Os novos corações são adicionados apenas ao clicar no botão
    }, 300);
}

// Função para adicionar mais corações à animação existente
function addMoreHearts() {
    const container = document.getElementById('heart-animation');
    
    // Adicione apenas alguns corações de cada vez (não 100 como antes)
    for (let i = 0; i < 10; i++) {
        const heart = document.createElement('div');
        heart.innerHTML = '❤️';
        heart.style.position = 'absolute';
        heart.style.left = `${Math.random() * 100}%`;
        heart.style.top = '-50px';
        heart.style.fontSize = `${Math.random() * 20 + 10}px`;
        heart.style.animation = `fall ${Math.random() * 5 + 3}s linear ${Math.random() * 2}s`;
        heart.style.opacity = Math.random() * 0.5 + 0.5;
        heart.style.transform = `rotate(${Math.random() * 360}deg)`;
        
        // Remova o coração depois que a animação terminar
        heart.addEventListener('animationend', () => {
            heart.remove();
        });
        
        container.appendChild(heart);
    }
}

// Função para parar a animação de corações
function stopHeartAnimation() {
    if (heartAnimationInterval) {
        clearInterval(heartAnimationInterval);
        heartAnimationInterval = null;
    }
    confettiStarted = false;
}

// Initialize event handlers on page load
document.addEventListener('DOMContentLoaded', function() {
    // Add any initialization code here if needed
});