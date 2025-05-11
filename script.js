let currentSlide = 1;
const totalSlides = 9;
let lovePercentage = 0;
let confettiStarted = false;
let heartAnimationInterval = null;

// Heart animation setup
function createHeartOverlay() {
    const overlay = document.getElementById('heart-overlay');
    for (let i = 0; i < 15; i++) {
        const heart = document.createElement('div');
        heart.classList.add('heart');
        heart.textContent = '❤️';
        heart.style.left = `${Math.random() * 100}%`;
        heart.style.top = `${Math.random() * 100}%`;
        heart.style.animationDelay = `${Math.random() * 3}s`;
        overlay.appendChild(heart);
    }
}

// Scratch effect - Versão melhorada
// Função para configurar o efeito de raspagem
function setupScratch() {
    // Selecionando elementos
    const scratchArea = document.querySelector('.scratch-area');
    const hiddenImage = document.querySelector('.hidden-image');
    const overlay = document.getElementById('scratch-overlay');
    
    // Verificando se estamos no slide correto
    if (!overlay || !scratchArea || !hiddenImage) return;
    
    // Limpando o overlay antes de começar
    overlay.innerHTML = '';
    
    // Criando o canvas
    const canvas = document.createElement('canvas');
    canvas.id = 'scratch-canvas';
    canvas.width = scratchArea.offsetWidth;
    canvas.height = scratchArea.offsetHeight;
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.zIndex = '3';
    canvas.style.borderRadius = '15px';
    
    // Adicionar o canvas ao overlay
    overlay.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    
    // IMPORTANTE: Verificar se a imagem já está carregada
    // e definir a posição z-index para garantir que está atrás do canvas
    hiddenImage.style.zIndex = '1';
    hiddenImage.style.position = 'relative';
    
    // Criar um gradiente como cobertura
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#f5b0cb');
    gradient.addColorStop(1, '#a78bfa');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Adicionar texto ao canvas
    ctx.font = 'bold 20px Arial';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.fillText('❤️ Raspe para revelar ❤️', canvas.width / 2, canvas.height / 2);
    
    // Variáveis para controle do mouse/toque
    let isDrawing = false;
    
    // Funções para manipular eventos de mouse/toque
    function startDrawing(e) {
        isDrawing = true;
        draw(e);
    }
    
    function stopDrawing() {
        isDrawing = false;
    }
    
    function draw(e) {
        if (!isDrawing) return;
        
        // Obtendo coordenadas corretas
        const rect = canvas.getBoundingClientRect();
        let x, y;
        
        if (e.touches && e.touches.length > 0) {
            x = e.touches[0].clientX - rect.left;
            y = e.touches[0].clientY - rect.top;
        } else {
            x = e.clientX - rect.left;
            y = e.clientY - rect.top;
        }
        
        // Configuração do efeito de raspagem - this is key
        ctx.globalCompositeOperation = 'destination-out';
        
        // Tamanho do pincel de raspagem
        const brushSize = 8;
        
        // Criar um pincel com bordas suaves
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, brushSize);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, brushSize, 0, Math.PI * 2);
        ctx.fill();
        
        // Verificar progresso
        checkProgress();
    }
    
    // Função para verificar quanto da área foi raspada
    function checkProgress() {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixelData = imageData.data;
        let transparentPixels = 0;
        
        // Verificar pixels transparentes
        for (let i = 3; i < pixelData.length; i += 4) {
            if (pixelData[i] < 50) transparentPixels++;
        }
        
        const totalPixels = pixelData.length / 4;
        const percentScratched = (transparentPixels / totalPixels) * 100;
        
        // Se mais de 40% foi raspado, revelar completamente
        if (percentScratched > 40) {
            canvas.style.transition = 'opacity 0.8s ease';
            canvas.style.opacity = '0';
            
            // Remover canvas depois da transição
            setTimeout(() => {
                canvas.remove();
                
                // Efeito de revelação na imagem
                hiddenImage.style.transition = 'transform 0.5s ease, filter 0.5s ease';
                hiddenImage.style.transform = 'scale(1.05)';
                hiddenImage.style.filter = 'brightness(1.1)';
                
                // Normalizar depois da animação
                setTimeout(() => {
                    hiddenImage.style.transform = 'scale(1)';
                    hiddenImage.style.filter = 'brightness(1)';
                }, 500);
            }, 800);
        }
    }
    
    // Remover quaisquer event listeners anteriores para evitar duplicação
    canvas.removeEventListener('mousedown', startDrawing);
    canvas.removeEventListener('mousemove', draw);
    window.removeEventListener('mouseup', stopDrawing);
    canvas.removeEventListener('touchstart', startDrawing);
    canvas.removeEventListener('touchmove', draw);
    window.removeEventListener('touchend', stopDrawing);
    
    // Adicionar event listeners
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    window.addEventListener('mouseup', stopDrawing);
    
    // Suporte para dispositivos touch 
    canvas.addEventListener('touchstart', function(e) {
        e.preventDefault();
        startDrawing(e);
    }, { passive: false });
    
    canvas.addEventListener('touchmove', function(e) {
        e.preventDefault();
        draw(e);
    }, { passive: false });
    
    window.addEventListener('touchend', stopDrawing);
    
    // Ajustar canvas em caso de redimensionamento
    window.addEventListener('resize', function() {
        canvas.width = scratchArea.offsetWidth;
        canvas.height = scratchArea.offsetHeight;
        
        // Redesenhar a cobertura após o redimensionamento
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, '#f5b0cb');
        gradient.addColorStop(1, '#a78bfa');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Readicionar o texto
        ctx.font = 'bold 20px Arial';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.fillText('❤️ Raspe para revelar ❤️', canvas.width / 2, canvas.height / 2);
    });
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
    
    if (currentSlide === 5) {
        // Iniciar efeito de raspagem no slide 5
        setTimeout(setupScratch, 300); // Pequeno atraso para garantir que o slide esteja visível
    }
}

function selectMonth(month) {
    // Verificar se selecionou o mês correto (Dezembro)
    if (month === 'Novembro') {
        // Feedback visual para a resposta correta
        const buttons = document.querySelectorAll('.month-btn');
        buttons.forEach(btn => {
            if (btn.textContent === 'Novembro') {
                btn.classList.add('correct-month');
            } else {
                btn.classList.add('incorrect-month');
            }
        });
        
        // Pequeno atraso antes de avançar
        setTimeout(() => {
            document.getElementById(`slide${currentSlide}`).classList.remove('active');
            currentSlide++;
            document.getElementById(`slide${currentSlide}`).classList.add('active');
        }, 800);
    } else {
        // Feedback visual para a resposta incorreta
        const selectedBtn = [...document.querySelectorAll('.month-btn')].find(btn => btn.textContent === month);
        selectedBtn.classList.add('incorrect-choice');
        
        // Remover classe após animação
        setTimeout(() => {
            selectedBtn.classList.remove('incorrect-choice');
        }, 500);
    }
}

function increaseLove() {
    if (lovePercentage < 100) {
        lovePercentage += 10;
    } else {
        lovePercentage = 100;
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
    // Inicialize o estado atual
    if (currentSlide === 5) {
        setupScratch();
    }
});
