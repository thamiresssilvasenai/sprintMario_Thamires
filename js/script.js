/**
 * TURMA JUMP
 * Mônica, Magali e Cascão
 /** */
document.addEventListener('DOMContentLoaded', function () {

    // ================================
    // ELEMENTOS DO JOGO
    // ================================

    const gameBoard = document.getElementById('game-board');
    const player = document.getElementById('player-char');
    const playerImage = player ? player.querySelector('img') : null;

    const gameObstacle = document.getElementById('game-obstacle');
    const coin = document.getElementById('coin');

    const scoreDisplay = document.getElementById('score-display');
    const worldDisplay = document.getElementById('world-display');
    const hudPlayerName = document.getElementById('hud-player-name');
    const jumpTip = document.getElementById('jump-tip');

    // ================================
    // MODAIS
    // ================================

    const startModal = document.getElementById('start-modal');
    const gameoverModal = document.getElementById('gameover-modal');

    // ================================
    // FORMULÁRIO
    // ================================

    const startForm = document.getElementById('start-form');
    const playerInput = document.getElementById('player-input');

    const btnStart = document.getElementById('btn-start');
    const btnViewRanking = document.getElementById('btn-view-ranking');

    const btnRestart = document.getElementById('btn-restart');
    const btnChangePlayer = document.getElementById('btn-change-player');

    // ================================
    // RANKING
    // ================================

    const rankingBody = document.getElementById('ranking-body');
    const finalScoreValue = document.getElementById('final-score-value');
    const saveStatusMsg = document.getElementById('save-status-msg');

    // ================================
    // PERSONAGENS
    // ================================

    const characters = {
        monica: 'assets/monica.png',
        mônica: 'assets/monica.png',
        magali: 'assets/Magali.png',
        cascao: 'assets/Cascão.png',
        cascão: 'assets/Cascão.png'
    };

    // ================================
    // MUNDOS
    // ================================

    const worlds = [
        {
            name: 'Mundo 1',
            background: "url('assets/fundo-turma.png') center center / cover no-repeat"
        },
        {
            name: 'Mundo 2',
            background: "url('assets/fundo-turma.png') center center / cover no-repeat"
        },
        {
            name: 'Mundo 3',
            background: "url('assets/fundo-turma.png') center center / cover no-repeat"
        }
    ];

    // ================================
    // VARIÁVEIS
    // ================================

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

    // ================================
    // PERSONAGEM SELECIONADO
    // ================================

    function getSelectedCharacter() {

        const selected = document.querySelector(
            'input[name="personagem"]:checked'
        );

        return selected
            ? selected.value
            : 'monica';
    }

    // ================================
    // IMAGEM DO PERSONAGEM
    // ================================

    function setPlayerImage() {

        if (!playerImage) {
            return;
        }

        const image =
            characters[currentCharacter] ||
            characters.monica;

        playerImage.src = image;

        playerImage.alt =
            formatCharacter(currentCharacter);
    }

    // ================================
    // NOME DO PERSONAGEM
    // ================================

    function formatCharacter(character) {

        const names = {
            monica: 'Mônica',
            'mônica': 'Mônica',
            magali: 'Magali',
            cascao: 'Cascão',
            cascão: 'Cascão'
        };

        return names[character] || 'Mônica';
    }

    // ================================
    // ATUALIZAR MUNDO
    // ================================

    function updateWorld() {

        if (!gameBoard) {
            return;
        }

        const currentWorld =
            worlds[world - 1] || worlds[0];

        gameBoard.style.background =
            currentWorld.background;

        if (worldDisplay) {
            worldDisplay.textContent =
                world;
        }
    }

    // ================================
    // VELOCIDADE
    // ================================

    function updateSpeed() {

        speed =
            1.6 +
            Math.floor(score / 100) * 0.15;
    }

    // ================================
    // CRIAR MOEDA
    // ================================

    function createCoin() {

        if (!gameBoard || !isPlaying) {
            return;
        }

        if (coinElement) {
            coinElement.remove();
            coinElement = null;
        }

        coinElement =
            document.createElement('img');

        coinElement.src =
            'assets/moeda.png';

        coinElement.alt =
            'Moeda';

        coinElement.className =
            'coin';

        coinElement.style.display =
            'block';

        coinElement.style.right =
            '-60px';

        coinElement.style.bottom =
            (100 + Math.random() * 100) + 'px';

        gameBoard.appendChild(
            coinElement
        );

        coinCollected = false;

        coinElement.animate(
            [
                {
                    right: '-60px'
                },
                {
                    right: '100%'
                }
            ],
            {
                duration: 3000,
                iterations: 1,
                easing: 'linear'
            }
        );

        setTimeout(function () {

            if (
                coinElement &&
                !coinCollected &&
                coinElement.parentNode
            ) {
                coinElement.remove();
                coinElement = null;
            }

        }, 3200);
    }

    // ================================
    // RESETAR ELEMENTOS
    // ================================

    function resetElements() {

        if (gameObstacle) {

            gameObstacle.style.animation =
                '';

            gameObstacle.style.right =
                '-100px';

            gameObstacle.style.bottom =
                '20px';
        }

        if (coinElement) {

            coinElement.remove();

            coinElement =
                null;
        }

        if (coin) {

            coin.style.display =
                'block';

            coin.style.right =
                '-60px';
        }

        coinCollected =
            false;
    }

    // ================================
    // INICIAR JOGO
    // ================================

    function startGame() {

        if (!gameBoard) {
            return;
        }

        score = 0;
        coins = 0;
        world = 1;
        speed = 1.6;

        isPlaying = true;

        currentCharacter =
            getSelectedCharacter();

        setPlayerImage();

        resetElements();

        updateWorld();

        updateSpeed();

        if (scoreDisplay) {
            scoreDisplay.textContent =
                score;
        }

        if (hudPlayerName) {
            hudPlayerName.textContent =
                currentPlayer || '---';
        }

        if (gameoverModal) {
            gameoverModal.classList.remove(
                'active'
            );
        }

        if (startModal) {
            startModal.classList.remove(
                'active'
            );
        }

        gameBoard.classList.add(
            'running'
        );

        if (jumpTip) {
            jumpTip.style.display =
                'none';
        }

        if (saveStatusMsg) {
            saveStatusMsg.textContent =
                '';
        }

        // ============================
        // PONTUAÇÃO
        // ============================

        clearInterval(scoreLoop);

        scoreLoop =
            setInterval(function () {

                if (!isPlaying) {
                    return;
                }

                score++;

                updateSpeed();

                if (scoreDisplay) {
                    scoreDisplay.textContent =
                        score;
                }

                if (score >= 200) {
                    world = 3;
                } else if (score >= 100) {
                    world = 2;
                } else {
                    world = 1;
                }

                updateWorld();

            }, 100);

        // ============================
        // MOEDAS
        // ============================

        clearTimeout(gameLoop);

        function coinLoop() {

            if (!isPlaying) {
                return;
            }

            createCoin();

            gameLoop =
                setTimeout(
                    coinLoop,
                    4500
                );
        }

        coinLoop();
    }

    // ================================
    // PULO
    // ================================

    function jump() {

        if (!isPlaying || !player) {
            return;
        }

        if (player.classList.contains('jump')) {
            return;
        }

        player.classList.add('jump');

        clearTimeout(jumpTimer);

        jumpTimer =
            setTimeout(function () {

                player.classList.remove('jump');

            }, 600);
    }

    // ================================
    // COLISÃO
    // ================================

    function rectanglesCollide(rect1, rect2) {

        return (
            rect1.left < rect2.right &&
            rect1.right > rect2.left &&
            rect1.top < rect2.bottom &&
            rect1.bottom > rect2.top
        );
    }

    function checkCollision() {

        if (
            !isPlaying ||
            !player ||
            !gameObstacle
        ) {
            return;
        }

        const playerRect =
            player.getBoundingClientRect();

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

        const obstacleRect =
            gameObstacle.getBoundingClientRect();

        const obstacleHitbox = {

            left:
                obstacleRect.left + 5,

            right:
                obstacleRect.right - 5,

            top:
                obstacleRect.top + 5,

            bottom:
                obstacleRect.bottom - 5
        };

        if (
            rectanglesCollide(
                playerHitbox,
                obstacleHitbox
            )
        ) {

            gameOver();

            return;
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

                if (scoreDisplay) {
                    scoreDisplay.textContent =
                        score;
                }

                coinElement.style.display =
                    'none';

                setTimeout(function () {

                    if (isPlaying) {
                        createCoin();
                    }

                }, 700);
            }
        }
    }

    // ================================
    // VERIFICAR COLISÃO
    // ================================

    setInterval(
        checkCollision,
        30
    );

    // ================================
    // GAME OVER
    // ================================

    function gameOver() {

        if (!isPlaying) {
            return;
        }

        isPlaying = false;

        clearInterval(scoreLoop);

        clearTimeout(gameLoop);

        clearTimeout(jumpTimer);

        if (gameBoard) {
            gameBoard.classList.remove(
                'running'
            );
        }

        if (gameObstacle) {
            gameObstacle.style.animation =
                'none';
        }

        if (coinElement) {
            coinElement.remove();
            coinElement = null;
        }

        if (finalScoreValue) {
            finalScoreValue.textContent =
                score;
        }

        salvarPontuacao();

        if (gameoverModal) {
            gameoverModal.classList.add(
                'active'
            );
        }

        carregarRanking();
    }

    // ================================
    // SALVAR RANKING
    // ================================

    function salvarPontuacao() {

        if (saveStatusMsg) {
            saveStatusMsg.textContent =
                'Salvando pontuação...';
        }

        fetch(
            'salvar_ranking.php',
            {
                method: 'POST',

                headers: {
                    'Content-Type':
                        'application/json'
                },

                body: JSON.stringify({

                    nome:
                        currentPlayer ||
                        'Jogador Anônimo',

                    personagem:
                        currentCharacter,

                    pontos:
                        score
                })
            }
        )

        .then(function (response) {

            if (!response.ok) {
                throw new Error(
                    'Erro ao salvar pontuação.'
                );
            }

            return response.json();
        })

        .then(function (data) {

            if (
                data.status ===
                'success'
            ) {

                if (saveStatusMsg) {
                    saveStatusMsg.textContent =
                        'Pontuação salva no ranking!';
                }

                if (data.ranking) {
                    mostrarRanking(
                        data.ranking
                    );
                }

            } else {

                if (saveStatusMsg) {
                    saveStatusMsg.textContent =
                        'Não foi possível salvar a pontuação.';
                }
            }
        })

        .catch(function (error) {

            console.error(
                'Erro ao salvar ranking:',
                error
            );

            if (saveStatusMsg) {
                saveStatusMsg.textContent =
                    'Erro ao salvar pontuação.';
            }
        });
    }

    // ================================
    // CARREGAR RANKING
    // ================================

    function carregarRanking() {

        if (!rankingBody) {
            return;
        }

        rankingBody.innerHTML = `
            <tr>
                <td colspan="4">
                    Carregando ranking...
                </td>
            </tr>
        `;

        fetch(
            'obter_ranking.php'
        )

        .then(function (response) {

            if (!response.ok) {
                throw new Error(
                    'Erro ao acessar o ranking.'
                );
            }

            return response.json();
        })

        .then(function (data) {

            if (
                data.status ===
                'success'
            ) {

                mostrarRanking(
                    data.ranking || []
                );

            } else {

                rankingBody.innerHTML = `
                    <tr>
                        <td colspan="4">
                            Não foi possível carregar o ranking.
                        </td>
                    </tr>
                `;
            }
        })

        .catch(function (error) {

            console.error(
                'Erro no ranking:',
                error
            );

            rankingBody.innerHTML = `
                <tr>
                    <td colspan="4">
                        Erro ao carregar ranking.
                    </td>
                </tr>
            `;
        });
    }

    // ================================
    // MOSTRAR RANKING
    // ================================

    function mostrarRanking(ranking) {

        if (!rankingBody) {
            return;
        }

        rankingBody.innerHTML = '';

        ranking.forEach(
            function (item, index) {

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

                const pos =
                    document.createElement('td');

                pos.textContent =
                    posicao;

                pos.className =
                    'ranking-pos';

                const nome =
                    document.createElement('td');

                const nomeSeguro =
                    escapeHTML(
                        item.nome ||
                        'Jogador Anônimo'
                    );

                nome.innerHTML =
                    `<strong>${nomeSeguro}</strong>`;

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

                linha.appendChild(pos);
                linha.appendChild(nome);
                linha.appendChild(personagem);
                linha.appendChild(pontos);

                rankingBody.appendChild(
                    linha
                );
            }
        );

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

    // ================================
    // SEGURANÇA DO NOME
    // ================================

    function escapeHTML(text) {

        const div =
            document.createElement('div');

        div.textContent =
            text;

        return div.innerHTML;
    }

    // ================================
    // INICIAR PELO FORMULÁRIO
    // ================================

    if (startForm) {

        startForm.addEventListener(
            'submit',
            function (event) {

                event.preventDefault();

                const nome =
                    playerInput
                        ? playerInput.value.trim()
                        : '';

                if (!nome) {

                    if (playerInput) {
                        playerInput.focus();
                    }

                    return;
                }

                currentPlayer =
                    nome;

                currentCharacter =
                    getSelectedCharacter();

                if (hudPlayerName) {
                    hudPlayerName.textContent =
                        currentPlayer;
                }

                setPlayerImage();

                startGame();
            }
        );
    }

    // ================================
    // VER RANKING
    // ================================

    if (btnViewRanking) {

        btnViewRanking.addEventListener(
            'click',
            function () {

                carregarRanking();

                if (startModal) {
                    startModal.classList.remove(
                        'active'
                    );
                }

                if (gameoverModal) {
                    gameoverModal.classList.add(
                        'active'
                    );
                }
            }
        );
    }

    // ================================
    // JOGAR NOVAMENTE
    // ================================

    if (btnRestart) {

        btnRestart.addEventListener(
            'click',
            function () {

                if (gameoverModal) {
                    gameoverModal.classList.remove(
                        'active'
                    );
                }

                startGame();
            }
        );
    }

    // ================================
    // TROCAR JOGADOR
    // ================================

    if (btnChangePlayer) {

        btnChangePlayer.addEventListener(
            'click',
            function () {

                isPlaying = false;

                clearInterval(scoreLoop);

                clearTimeout(gameLoop);

                if (gameBoard) {
                    gameBoard.classList.remove(
                        'running'
                    );
                }

                if (gameoverModal) {
                    gameoverModal.classList.remove(
                        'active'
                    );
                }

                if (startModal) {
                    startModal.classList.add(
                        'active'
                    );
                }

                if (playerInput) {
                    playerInput.value = '';
                    playerInput.focus();
                }
            }
        );
    }

    // ================================
    // SELEÇÃO DE PERSONAGEM
    // ================================

    const characterCards =
        document.querySelectorAll(
            '.char-card'
        );

    characterCards.forEach(
        function (card) {

            card.addEventListener(
                'click',
                function () {

                    characterCards.forEach(
                        function (item) {

                            item.classList.remove(
                                'active'
                            );
                        }
                    );

                    card.classList.add(
                        'active'
                    );
                }
            );
        }
    );

    // ================================
    // TECLADO
    // ================================

    document.addEventListener(
        'keydown',
        function (event) {

            if (
                event.code === 'Space'
            ) {

                event.preventDefault();

                jump();
            }
        }
    );

    // ================================
    // CLIQUE PARA PULAR
    // ================================

    if (gameBoard) {

        gameBoard.addEventListener(
            'click',
            function (event) {

                if (
                    event.target.closest(
                        'button'
                    )
                ) {
                    return;
                }

                jump();
            }
        );
    }

    // ================================
    // CONFIGURAÇÃO INICIAL
    // ================================

    currentCharacter =
        getSelectedCharacter();

    setPlayerImage();

    updateWorld();

});

