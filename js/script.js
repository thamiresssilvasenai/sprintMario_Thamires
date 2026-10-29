
/**
 * TURMA JUMP
 * Mônica, Magali e Cascão
 */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // ELEMENTOS DO JOGO
    // ==========================================

    const player = document.getElementById('player-char');
    const pipe = document.querySelector('.pipe');
    const gameObstacle = document.getElementById('game-obstacle');
    const gameBoard = document.getElementById('game-board');
    const clouds = document.querySelector('.clouds');

    const hudPlayerName = document.getElementById('hud-player-name');
    const scoreDisplay = document.getElementById('score-display');
    const worldDisplay = document.getElementById('world-display');
    const jumpTip = document.getElementById('jump-tip');

    const startModal = document.getElementById('start-modal');
    const startForm = document.getElementById('start-form');
    const playerInput = document.getElementById('player-input');

    const btnViewRanking = document.getElementById('btn-view-ranking');

    const gameoverModal = document.getElementById('gameover-modal');
    const finalScoreValue = document.getElementById('final-score-value');
    const saveStatusMsg = document.getElementById('save-status-msg');
    const rankingBody = document.getElementById('ranking-body');

    const btnRestart = document.getElementById('btn-restart');
    const btnChangePlayer = document.getElementById('btn-change-player');

    // ==========================================
    // PERSONAGENS
    // ==========================================

    const characters = {
        monica: 'assets/monica.png',
        mônica: 'assets/monica.png',
        magali: 'assets/Magali.png',
        cascao: 'assets/Cascão.png',
        cascão: 'assets/Cascão.png'
    };

    // ==========================================
    // MUNDOS
    // ==========================================

    const worlds = [
        {
            name: 'Mundo 1',
            background: 'linear-gradient(#87ceeb, #e0f6ff)'
        },
        {
            name: 'Mundo 2',
            background: 'linear-gradient(#f7b267, #ffe6b8)'
        },
        {
            name: 'Mundo 3',
            background: 'linear-gradient(#7b8cff, #d9dcff)'
        }
    ];

    // ==========================================
    // VARIÁVEIS
    // ==========================================

    let currentPlayer = '';
    let currentCharacter = 'monica';

    let score = 0;
    let coins = 0;
    let world = 1;

    let speed = 1.6;

    let isPlaying = false;

    let gameLoop = null;
    let scoreLoop = null;
    let jumpTimer = null;

    let coinElement = null;
    let coinCollected = false;

    // ==========================================
    // PERSONAGEM SELECIONADO
    // ==========================================

    function getSelectedCharacter() {

        const selected = document.querySelector(
            'input[name="personagem"]:checked'
        );

        if (!selected) {
            return 'monica';
        }

        const value = String(selected.value || '')
            .trim()
            .toLowerCase();

        return characters[value] ? value : 'monica';
    }

    // ==========================================
    // COLOCAR PERSONAGEM NA TELA
    // ==========================================

    function setPlayerImage() {

        if (!player) return;

        player.innerHTML = '';

        const img = document.createElement('img');

        img.src = characters[currentCharacter] || characters.monica;

        img.alt = currentCharacter;

        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'contain';

        player.appendChild(img);
    }

    // ==========================================
    // ATUALIZAR MUNDO
    // ==========================================

    function updateWorld() {

        const newWorld = Math.min(
            3,
            Math.floor(score / 100) + 1
        );

        if (newWorld === world) {
            return;
        }

        world = newWorld;
        if (worldDisplay) {
            worldDisplay.textContent = world;
        }

        gameBoard.style.background =
            worlds[world - 1].background;
    }

    // ==========================================
    // AUMENTAR VELOCIDADE
    // ==========================================

    function updateSpeed() {

        // Quanto maior a pontuação,
        // mais rápido o obstáculo fica.

        speed = Math.max(
            1.2,
            2.5 - Math.floor(score / 50) * 0.2
        );

        if (pipe) {
            pipe.style.animationDuration =
                speed + 's';
        }

        if (clouds) {
            clouds.style.animationDuration =
                Math.max(6, speed * 10) + 's';
        }
    }

    // ==========================================
    // CRIAR MOEDA
    // ==========================================

    function createCoin() {

        if (coinElement) {
            coinElement.remove();
        }

        coinCollected = false;

        coinElement = document.createElement('img');

        coinElement.src = 'assets/moeda.png';

        coinElement.className = 'game-coin';

        coinElement.style.position = 'absolute';
        coinElement.style.width = '45px';
        coinElement.style.height = '45px';
        coinElement.style.objectFit = 'contain';

        coinElement.style.right = '-60px';

        coinElement.style.bottom =
            (90 + Math.random() * 150) + 'px';

        coinElement.style.zIndex = '8';

        gameBoard.appendChild(coinElement);

        coinElement.animate(
            [
                { right: '-60px' },
                { right: '100%' }
            ],
            {
                duration: 3000,
                iterations: Infinity,
                easing: 'linear'
            }
        );
    }

    // ==========================================
    // RESETAR ELEMENTOS
    // ==========================================

    function resetElements() {

        if (pipe) {
            pipe.style.animation = '';
            pipe.style.right = '-80px';
        }

        if (player) {
            player.style.animation = '';
            player.style.bottom = '0px';
            player.classList.remove('jump');
        }

        if (gameObstacle) {
            gameObstacle.style.animation = '';
            gameObstacle.style.right = '-100px';
        }

        setPlayerImage();

        if (clouds) {
            clouds.style.animation = '';
        }

        if (coinElement) {
            coinElement.remove();
            coinElement = null;
        }

        coinCollected = false;

        if (jumpTip) {
            jumpTip.style.opacity = '1';
        }
    }

    // ==========================================
    // INICIAR JOGO
    // ==========================================

    function startGame() {

        clearInterval(gameLoop);
        clearInterval(scoreLoop);

        if (jumpTimer) {
            clearTimeout(jumpTimer);
        }

        score = 0;
        coins = 0;
        world = 1;
        speed = 1.6;

        currentCharacter = getSelectedCharacter();

        resetElements();

        gameBoard.style.background =
            worlds[0].background;

        createCoin();

        isPlaying = true;

        scoreDisplay.textContent = '0';

        hudPlayerName.textContent =
            currentPlayer || 'Jogador';

        gameBoard.classList.add('running');

        // ======================================
        // PONTUAÇÃO
        // ======================================

        scoreLoop = setInterval(() => {

            if (!isPlaying) return;

            score++;

            scoreDisplay.textContent = score;

            updateWorld();
            updateSpeed();

        }, 100);

        // ======================================
        // COLISÃO
        // ======================================

        gameLoop = setInterval(
            checkCollision,
            20
        );
    }

    // ==========================================
    // PULO
    // ==========================================

    function jump() {

        if (!isPlaying || !player) {
            return;
        }

        if (player.classList.contains('jump')) {
            return;
        }

        player.classList.add('jump');

        if (jumpTip) {
            jumpTip.style.opacity = '0';
        }

        jumpTimer = setTimeout(() => {

            player.classList.remove('jump');

        }, 500);
    }

    // ==========================================
    // DETECTAR COLISÃO
    // ==========================================

    function rectanglesCollide(a, b) {

        return !(
            a.right < b.left ||
            a.left > b.right ||
            a.bottom < b.top ||
            a.top > b.bottom
        );
    }

    function checkCollision() {

        if (!isPlaying || !player || !pipe || !gameObstacle) {
            return;
        }

        const playerRect =
            player.getBoundingClientRect();

        const pipeRect =
            pipe.getBoundingClientRect();

        const playerHitbox = {

            left:
                playerRect.left +
                playerRect.width * 0.25,

            right:
                playerRect.right -
                playerRect.width * 0.18,

            top:
                playerRect.top +
                playerRect.height * 0.15,

            bottom:
                playerRect.bottom
        };

        const pipeHitbox = {

            left:
                pipeRect.left +
                pipeRect.width * 0.12,

            right:
                pipeRect.right -
                pipeRect.width * 0.12,

            top:
                pipeRect.top,

            bottom:
                pipeRect.bottom
        };

        // ======================================
        // COLISÃO COM CANO
        // ======================================

        if (
            rectanglesCollide(
                playerHitbox,
                pipeHitbox
            )
        ) {

            gameOver();

            return;
        }

        // ======================================
        // COLISÃO COM MOEDA
        // ======================================

        if (gameObstacle) {

    const obstacleRect =
        gameObstacle.getBoundingClientRect();

    const obstacleHitbox = {
        left: obstacleRect.left + 5,
        right: obstacleRect.right - 5,
        top: obstacleRect.top + 5,
        bottom: obstacleRect.bottom - 5
    };

    if (
        rectanglesCollide(
            playerHitbox,
            obstacleHitbox
        )
    )   {
            gameOver();
            return;
        }
    }

        if (
            coinElement &&
            !coinCollected
        ) {

            const coinRect =
                coinElement.getBoundingClientRect();

            if (
                rectanglesCollide(
                    playerHitbox,
                    coinRect
                )
            ) {

                coinCollected = true;

                coins++;

                score += 20;

                scoreDisplay.textContent = score;

                coinElement.style.display = 'none';

                setTimeout(() => {

                    if (isPlaying) {

                        createCoin();
                    }

                }, 700);
            }
        }
    }

    // ==========================================
    // GAME OVER
    // ==========================================

    function gameOver() {

        if (!isPlaying) {
            return;
        }

        isPlaying = false;

        clearInterval(gameLoop);
        clearInterval(scoreLoop);

        if (jumpTimer) {
            clearTimeout(jumpTimer);
        }

        gameBoard.classList.remove('running');

        if (pipe) {
            pipe.style.animation = 'none';
        }

        if (player) {
            player.style.animation = 'none';
        }

        if (finalScoreValue) {
            finalScoreValue.textContent = score;
        }

        if (saveStatusMsg) {
            saveStatusMsg.textContent =
                'Salvando pontuação...';
        }

        if (gameoverModal) {
            gameoverModal.classList.add('active');
        }

        salvarPontuacao();
    }

    // ==========================================
    // SALVAR PONTUAÇÃO NO MYSQL
    // ==========================================

    function salvarPontuacao() {

        fetch('salvar_ranking.php', {

            method: 'POST',

            headers: {
                'Content-Type':
                    'application/json'
            },

            body: JSON.stringify({

                nome: currentPlayer,

                personagem: currentCharacter,

                pontos: score
            })
        })

        .then(response => response.json())

        .then(data => {

            if (data.status === 'success') {

                if (saveStatusMsg) {

                    saveStatusMsg.textContent =
                        'Pontuação salva!';
                }

                carregarRanking();

            } else {

                if (saveStatusMsg) {

                    saveStatusMsg.textContent =
                        'Não foi possível salvar a pontuação.';
                }
            }
        })

        .catch(error => {

            console.error(error);

            if (saveStatusMsg) {

                saveStatusMsg.textContent =
                    'Erro ao salvar pontuação.';
            }
        });
    }

    // ==========================================
    // CARREGAR RANKING
    // ==========================================

    function carregarRanking() {

        fetch('obter_ranking.php')

            .then(response => response.json())

            .then(data => {

                if (data.status === 'success') {

                    mostrarRanking(data.ranking);
                }
            })

            .catch(error => {

                console.error(error);
            });
    }

    // ==========================================
    // MOSTRAR RANKING
    // ==========================================

    function mostrarRanking(ranking) {

        if (!rankingBody) {
            return;
        }

        rankingBody.innerHTML = '';

        ranking.forEach((item, index) => {

            const linha =
                document.createElement('tr');

            const posicao =
                index === 0
                    ? '🥇 1º'
                    : index === 1
                        ? '🥈 2º'
                        : index === 2
                            ? '🥉 3º'
                            : `${index + 1}º`;

            const nome =
                document.createElement('td');

            nome.innerHTML =
                `<strong>${escapeHTML(item.nome)}</strong>`;

            const personagem =
                document.createElement('td');

            personagem.textContent =
                formatCharacter(
                    item.personagem
                );

            const pontos =
                document.createElement('td');

            pontos.textContent =
                `${Number(item.pontos) || 0} pts`;

            const pos =
                document.createElement('td');

            pos.textContent = posicao;

            linha.appendChild(pos);
            linha.appendChild(nome);
            linha.appendChild(personagem);
            linha.appendChild(pontos);

            rankingBody.appendChild(linha);
        });

        if (ranking.length === 0) {

            rankingBody.innerHTML = `
                <tr>
                    <td colspan="4">
                        Nenhuma pontuação gravada ainda.
                    </td>
                </tr>
            `;
        }
    }

    // ==========================================
    // SEGURANÇA DO NOME
    // ==========================================

    function escapeHTML(text) {

        const div =
            document.createElement('div');

        div.textContent =
            text || '';

        return div.innerHTML;
    }

    // ==========================================
    // NOME DO PERSONAGEM
    // ==========================================

    function formatCharacter(value) {

        const nome =
            String(value || 'monica')
                .toLowerCase();

        if (nome === 'magali') {
            return 'Magali';
        }

        if (
            nome === 'cascao' ||
            nome === 'cascão'
        ) {
            return 'Cascão';
        }

        return 'Mônica';
    }

    // ==========================================
    // BOTÃO INICIAR
    // ==========================================

    if (startForm) {

        startForm.addEventListener(
            'submit',
            function(event) {

                event.preventDefault();

                const nome =
                    playerInput.value.trim();

                if (!nome) {

                    playerInput.focus();

                    return;
                }

                currentPlayer = nome;

                localStorage.setItem(
                    'turma_jump_player',
                    nome
                );

                // Mostra o nome do jogador no jogo
                if (hudPlayerName) {
                    hudPlayerName.textContent = currentPlayer;
                }

                startModal.classList.remove('active');

                startGame();
            }
        );
    }

    // ==========================================
    // VER RANKING
    // ==========================================

    if (btnViewRanking) {

        btnViewRanking.addEventListener(
            'click',
            function() {

                carregarRanking();

                startModal.classList.remove(
                    'active'
                );

                gameoverModal.classList.add(
                    'active'
                );
            }
        );
    }

    // ==========================================
    // JOGAR NOVAMENTE
    // ==========================================

    if (btnRestart) {

        btnRestart.addEventListener(
            'click',
            function() {

                gameoverModal.classList.remove(
                    'active'
                );

                startGame();
            }
        );
    }

    // ==========================================
    // TROCAR JOGADOR
    // ==========================================

    if (btnChangePlayer) {

        btnChangePlayer.addEventListener(
            'click',
            function() {

                gameoverModal.classList.remove(
                    'active'
                );

                startModal.classList.add(
                    'active'
                );

                playerInput.value = '';

                playerInput.focus();
            }
        );
    }

    // ==========================================
    // TECLADO
    // ==========================================

    document.addEventListener(
        'keydown',
        function(event) {

            if (
                event.code === 'Space' ||
                event.code === 'ArrowUp'
            ) {

                if (isPlaying) {

                    event.preventDefault();

                    jump();
                }
            }
        }
    );

    // ==========================================
    // CLIQUE PARA PULAR
    // ==========================================

    if (gameBoard) {

        gameBoard.addEventListener(
            'click',
            function() {

                if (isPlaying) {
                    jump();
                }
            }
        );
    }

    // ==========================================
    // RECUPERAR NOME SALVO
    // ==========================================

    if (playerInput) {

        const nomeSalvo =
            localStorage.getItem(
                'turma_jump_player'
            );

        if (nomeSalvo) {

            playerInput.value =
                nomeSalvo;
        }
    }

    // ==========================================
    // CONFIGURAÇÃO INICIAL
    // ==========================================

    currentCharacter =
        getSelectedCharacter();

    setPlayerImage();

});
