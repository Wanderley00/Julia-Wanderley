let currentSlide = 0;
const totalSlides = 16; // Aumentei o número de slides
let lovePercentage = 0;
let confettiStarted = false;
let heartAnimationInterval = null;
const relationshipStartDate = new Date('May 20, 2024 06:00:00'); // Data de início do relacionamento

// Função para calcular o tempo de relacionamento
function calculateRelationshipTime() {
    const now = new Date();
    const timeDiff = now - relationshipStartDate;
    
    // Calcular anos, meses, dias, horas e minutos
    const years = Math.floor(timeDiff / (1000 * 60 * 60 * 24 * 365.25));
    const months = Math.floor((timeDiff % (1000 * 60 * 60 * 24 * 365.25)) / (1000 * 60 * 60 * 24 * 30.44));
    const days = Math.floor((timeDiff % (1000 * 60 * 60 * 24 * 30.44)) / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    
    // Formatação do texto
    let timeText = '';
    
    if (years > 0) {
        timeText += `${years} ${years === 1 ? 'ano' : 'anos'}, `;
    }
    
    timeText += `${months} ${months === 1 ? 'mês' : 'meses'}, `;
    timeText += `${days} ${days === 1 ? 'dia' : 'dias'}, `;
    timeText += `${hours} ${hours === 1 ? 'hora' : 'horas'} e `;
    timeText += `${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}`;
    
    return {
        text: timeText,
        total: {
            years, months, days, hours, minutes,
            totalDays: Math.floor(timeDiff / (1000 * 60 * 60 * 24)),
            totalHours: Math.floor(timeDiff / (1000 * 60 * 60)),
            totalMinutes: Math.floor(timeDiff / (1000 * 60))
        }
    };
}

// Função para atualizar o contador de tempo
function updateRelationshipCounter() {
    const timeElement = document.getElementById('time-counter');
    if (!timeElement) return;
    
    const timeData = calculateRelationshipTime();
    timeElement.innerHTML = `
        <div class="time-heading">Estamos juntos há:</div>
        <div class="time-value">${timeData.text}</div>
        <div class="time-detail">Isso são ${timeData.total.totalDays} dias ou ${timeData.total.totalHours} horas de muito amor ❤️</div>
    `;
}

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
        const brushSize = 10;
        
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

    if (currentSlide === 8) {
        // Iniciar o contador de tempo no slide 8
        updateRelationshipCounter();
        // Atualizar a cada segundo
        setInterval(updateRelationshipCounter, 1000);
    }

    // Setup para novos slides com funcionalidades específicas
    if (currentSlide === 11) {
        setupMemoryGame();
    }

    if (currentSlide === 12) {
        setupQuoteReveal();
    }

    if (currentSlide === 13) {
        setTimeout(() => {
            startTypingEffect(document.querySelector('#slide13 .message'), 
            'São 12 meses de histórias, aprendizados, companheirismo, emoções, brincadeiras, vivências, experiências adiquiridas e amor... Mesmo entre alguns desentendimentos chegamos juntos até aqui e aguardamos anciosamente por mais... Saiba que você é a minha motivação para ser melhor, para acordar cada dia com mais ambição de vencer e crescer.   Quero te proporcionar o melhor que puder desse mundo e quero te ver sorrindo todos os dias, porque seu sorriso ilumina meu mundo ❤️');
        }, 500);
    }
}

// Função para o jogo da memória
function setupMemoryGame() {
    const gameContainer = document.getElementById('memory-game');
    if (!gameContainer) return;
    
    const cards = ['❤️', '💖', '💘', '💕', '💓', '💗', '❤️', '💖', '💘', '💕', '💓', '💗'];
    let shuffledCards = shuffleArray([...cards]);
    
    // Limpar container
    gameContainer.innerHTML = '';
    
    // Criar as cartas
    shuffledCards.forEach((symbol, index) => {
        const card = document.createElement('div');
        card.classList.add('memory-card');
        card.dataset.value = symbol;
        card.dataset.index = index;
        
        const cardInner = document.createElement('div');
        cardInner.classList.add('card-inner');
        
        const cardFront = document.createElement('div');
        cardFront.classList.add('card-front');
        cardFront.textContent = '?';
        
        const cardBack = document.createElement('div');
        cardBack.classList.add('card-back');
        cardBack.textContent = symbol;
        
        cardInner.appendChild(cardFront);
        cardInner.appendChild(cardBack);
        card.appendChild(cardInner);
        
        card.addEventListener('click', flipCard);
        gameContainer.appendChild(card);
    });
}

// Variáveis para o jogo da memória
let flippedCards = [];
let matchedPairs = 0;

// Função para embaralhar array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Função para virar a carta
function flipCard() {
    // Se a carta já está virada ou já temos duas cartas viradas, retorne
    if (this.classList.contains('flipped') || flippedCards.length >= 2) return;
    
    // Virar a carta
    this.classList.add('flipped');
    flippedCards.push(this);
    
    // Se temos duas cartas viradas
    if (flippedCards.length === 2) {
        // Verificar se são iguais
        if (flippedCards[0].dataset.value === flippedCards[1].dataset.value) {
            // Match!
            matchedPairs++;
            flippedCards[0].classList.add('matched');
            flippedCards[1].classList.add('matched');
            flippedCards = [];
            
            // Verificar se todas as cartas foram encontradas
            if (matchedPairs === 6) {
                setTimeout(() => {
                    document.getElementById('memory-success').classList.add('visible');
                }, 1000);
            }
        } else {
            // Não são iguais, virar de volta após um tempo
            setTimeout(() => {
                flippedCards[0].classList.remove('flipped');
                flippedCards[1].classList.remove('flipped');
                flippedCards = [];
            }, 1000);
        }
    }
}

function setupQuoteReveal() {
    const quoteContainer = document.getElementById('quote-container');
    if (!quoteContainer) return;
    
    const quotes = [
        "Sou apaixonado pelos seus cachos",
        "Adoro seus olhinhos",
        "Amo seu sorriso"
    ];
    
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    quoteContainer.dataset.fullQuote = randomQuote;
    
    // Criar placeholders para cada letra
    let placeholderText = '';
    for (let i = 0; i < randomQuote.length; i++) {
        if (randomQuote[i] === ' ') {
            placeholderText += ' ';
        } else {
            placeholderText += '_';
        }
    }
    
    quoteContainer.textContent = placeholderText;
    
    // Adicionar o botão de revelar
    const revealBtn = document.getElementById('reveal-quote-btn');
    if (revealBtn) {
        revealBtn.addEventListener('click', function() {
            revealRandomLetter();
        });
    }
}

// Função para revelar uma letra aleatória da frase
function revealRandomLetter() {
    const quoteContainer = document.getElementById('quote-container');
    const fullQuote = quoteContainer.dataset.fullQuote;
    let currentText = quoteContainer.textContent;
    
    // Se já revelou toda a frase
    if (!currentText.includes('_')) {
        // Animar o container
        quoteContainer.classList.add('complete');
        document.getElementById('quote-continue-btn').classList.remove('hidden');
        return;
    }
    
    // Encontrar letras ainda não reveladas
    let hiddenIndices = [];
    for (let i = 0; i < fullQuote.length; i++) {
        if (currentText[i] === '_') {
            hiddenIndices.push(i);
        }
    }
    
    // Escolher uma letra aleatória para revelar
    if (hiddenIndices.length > 0) {
        const randomIndex = hiddenIndices[Math.floor(Math.random() * hiddenIndices.length)];
        
        // Construir o novo texto com a letra revelada
        let newText = '';
        for (let i = 0; i < fullQuote.length; i++) {
            if (i === randomIndex) {
                newText += fullQuote[i];
            } else {
                newText += currentText[i];
            }
        }
        
        quoteContainer.textContent = newText;
        
        // Verificar se todas as letras foram reveladas
        if (!newText.includes('_')) {
            quoteContainer.classList.add('complete');
            document.getElementById('quote-continue-btn').classList.remove('hidden');
        }
    }
}

// Função para o efeito de digitação
function startTypingEffect(element, text) {
    element.textContent = '';
    let i = 0;
    
    function typeNextChar() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(typeNextChar, 50 + Math.random() * 50);
        }
    }
    
    typeNextChar();
}

// Correção para o jogo de pares perfeitos
let selectedLeft = null;
let selectedRight = null;

// Função para selecionar uma opção nos pares perfeitos
// Função para selecionar uma opção nos pares perfeitos
function selectPerfectMatch(id, correctPairId) {
    // Identifica em qual lado (esquerdo ou direito) o item clicado está
    const isLeftSide = id.startsWith('left');
    
    // Aplica a classe 'selected' ao item clicado
    const clickedItem = document.getElementById(id);
    
    // Se já foi selecionado, apenas desselecione
    if (clickedItem.classList.contains('selected')) {
        clickedItem.classList.remove('selected');
        if (isLeftSide) {
            selectedLeft = null;
        } else {
            selectedRight = null;
        }
        return;
    }
    
    // Limpa seleção anterior do mesmo lado
    if (isLeftSide) {
        if (selectedLeft) {
            document.getElementById(selectedLeft).classList.remove('selected');
        }
        selectedLeft = id;
    } else {
        if (selectedRight) {
            document.getElementById(selectedRight).classList.remove('selected');
        }
        selectedRight = id;
    }
    
    // Marca o item como selecionado
    clickedItem.classList.add('selected');
    
    // Verifica se temos um par selecionado (um de cada lado)
    if (selectedLeft && selectedRight) {
        // Verifica se é o par correto usando o matchPairs definido
        const isCorrectPair = matchPairs[selectedLeft] === selectedRight;
        
        if (isCorrectPair) {
            // Destaca o par correto e mantém selecionado
            document.getElementById(selectedLeft).classList.add('correct-match');
            document.getElementById(selectedRight).classList.add('correct-match');
            
            // Remove a classe 'selected' pois já está correto
            document.getElementById(selectedLeft).classList.remove('selected');
            document.getElementById(selectedRight).classList.remove('selected');
            
            // Incrementa o contador de pares corretos
            correctMatches++;
            
            // Limpa as seleções atuais
            selectedLeft = null;
            selectedRight = null;
            
            // Se todos os pares foram encontrados
            if (correctMatches === Object.keys(matchPairs).length) {
                document.getElementById('perfect-match-success').classList.add('visible');
            }
        } else {
            // Anima indicando que está incorreto
            document.getElementById(selectedLeft).classList.add('wrong-match');
            document.getElementById(selectedRight).classList.add('wrong-match');
            
            // Remove as classes após a animação
            setTimeout(() => {
                document.getElementById(selectedLeft).classList.remove('wrong-match');
                document.getElementById(selectedRight).classList.remove('wrong-match');
                document.getElementById(selectedLeft).classList.remove('selected');
                document.getElementById(selectedRight).classList.remove('selected');
                selectedLeft = null;
                selectedRight = null;
            }, 800);
        }
    }
}

function selectMonth(month) {
    // Verificar se selecionou o mês correto (Novembro)
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

// Função para o jogo de escolher a data especial
function selectDate(isCorrect) {
    if (isCorrect) {
        document.getElementById('correct-date').classList.add('date-selected');
        
        // Mostrar mensagem de sucesso
        document.getElementById('date-success-message').classList.add('visible');
        
        // Avançar após um tempo
        setTimeout(() => {
            document.getElementById(`slide${currentSlide}`).classList.remove('active');
            currentSlide++;
            document.getElementById(`slide${currentSlide}`).classList.add('active');
        }, 2000);
    } else {
        // Feedback visual para opção incorreta
        const selectedOption = event.target;
        selectedOption.classList.add('date-wrong');
        
        // Remover classe após animação
        setTimeout(() => {
            selectedOption.classList.remove('date-wrong');
        }, 800);
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

// Variáveis para o jogo de combinar pares
let matchPairs = {
    'left1': 'right3',
    'left2': 'right1',
    'left3': 'right2'
};
let correctMatches = 0;

// Initialize event handlers on page load
document.addEventListener('DOMContentLoaded', function() {
    // Inicialize o estado atual
    if (currentSlide === 5) {
        setupScratch();
    }
    
    if (currentSlide === 8) {
        updateRelationshipCounter();
        setInterval(updateRelationshipCounter, 1000);
    }
    
    if (currentSlide === 11) {
        setupMemoryGame();
    }
    
    if (currentSlide === 12) {
        setupQuoteReveal();
    }
});