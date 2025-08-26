// script.js

// Carrega a base de dados do arquivo db.js
const data = db;

// Seletores de elementos da interface
const startScreen = document.getElementById('start-screen');
const tutorialScreen = document.getElementById('tutorial-screen');
const storyScreen = document.getElementById('story-screen');
const storyScreen2 = document.getElementById('story-screen2');
const sqlExplanationScreen = document.getElementById('sql-explanation-screen');
const sqlExplanationScreen2 = document.getElementById('sql-explanation-screen2');
const mainGameScreen = document.getElementById('main-game-screen');
const victoryScreen = document.getElementById('victory-screen');
const gameOverScreen = document.getElementById('game-over-screen');
const timesUpScreen = document.getElementById('times-up-screen');
const helpModal = document.getElementById('help-modal');
const whereModal = document.getElementById('where-modal');
const orderbyModal = document.getElementById('orderby-modal');
const columnInfoModal = document.getElementById('column-info-modal');

const startTutorialButton = document.getElementById('start-tutorial-button');
const timerElement = document.getElementById('timer');
const helpButton = document.getElementById('help-button');
const closeModalButton = document.querySelector('.close-button');
const whereCloseButton = document.querySelector('.where-close');
const orderbyCloseButton = document.querySelector('.orderby-close');
const fecharButton = document.getElementById('fechar-button');
const fecharButton2 = document.getElementById('fechar-button2');

const queryOutput = document.getElementById('query-output');
const executeQueryButton = document.getElementById('execute-query-button');
const clearQueryButton = document.getElementById('clear-query-button');
const copyResultsButton = document.getElementById('copy-results-button');
const submitAnswerButton = document.getElementById('submit-answer-button');
const answerInput = document.getElementById('answer-input');
const notesInput = document.getElementById('notes-input');

const tablesList = document.getElementById('tables-list');
const keywordsButtons = document.getElementById('keywords-buttons');
const columnsList = document.getElementById('columns-list');
const resultsOutput = document.getElementById('results-output');

const tutorialContent = document.getElementById('tutorial-content');
const prevTutorialButton = document.getElementById('prev-tutorial-button');
const nextTutorialButton = document.getElementById('next-tutorial-button');
const startStoryButton = document.getElementById('start-story-button');
const skipTutorialButton = document.getElementById('skip-tutorial-button');
const startExplanationButton = document.getElementById('start-explanation-button');
const startMainGameButton = document.getElementById('start-main-game-button');

const whereInput = document.getElementById('where-input');
const whereConfirmButton = document.getElementById('where-confirm');
const orderbyInput = document.getElementById('orderby-input');
const orderbyConfirmButton = document.getElementById('orderby-confirm');

const restartButtons = document.querySelectorAll('.btn[id^="restart-button"]');

// Novos seletores para os botões do header
const contextButton = document.getElementById('context-button');
const commandsButton = document.getElementById('commands-button');
const hintsButton = document.getElementById('hints-button');


// Variáveis do jogo
let timeLimit = 900; // 15 minutos em segundos
let timerInterval;
const correctAnswer = 'João Silva'; // O nome do ladrão

let currentQuery = {
    select: [],
    from: '',
    where: [],
    orderBy: {
        column: '',
        direction: 'ASC' // Padrão
    }
};

let currentResults = []; // Armazena os resultados para copiar

const tutorialSteps = [
    {
        title: "Passo 1: O Objetivo",
        image: "assets/images/step1.png",
        content: "<p>Seu objetivo é usar o comandos SQL para filtrar os dados da Expo Tech e encontrar o ladrão. Você tem 15 minutos para isso! O seu tempo é mostrado no topo da tela. Além disso, use e abuse dos <strong>botões do cabeçalho</strong>, para voltar ao contexto e obter informações importantes para resolver o caso! </p> "
    },
    {
        title: "Passo 2: Construindo a Consulta",
        image: "assets/images/step2.png",
        content: "<p>A área central é onde você constrói a sua consulta. Use os botões de comandos, tabelas e colunas para montar a sua busca. A área da consulta é digitável, mas você também pode clicar nos elementos para adicioná-los à sua consulta. Por exemplo, clique no nome de uma tabela para adicioná-la à consulta e selecionar todas as suas colunas.</p>"
    },
    {
        title: "Passo 3: Tabelas e Colunas",
        image: "assets/images/step3.png",
        content: "<p>À esquerda, na área <strong>Tabelas</strong>, estão os nomes das nossas tabelas de dados. Clique em um nome de tabela para que suas colunas apareçam à direita. Clique nas colunas para incluí-las na sua consulta.</p>"
    },
    {
        title: "Passo 4: Executando e Anotando",
        image: "assets/images/step4.png",
        content: "<p>Após montar sua consulta, clique em <strong>Executar</strong> para ver os resultados. Use a área de <strong>Resultados</strong> para analisar as informações e a área de <strong>Anotações</strong> para registrar o que você descobrir. Você pode copiar os resultados da tabela diretamente para suas anotações, digitar, apagar e editar seus comentários.</p>"
    },
    {
        title: "Passo 5: A Resposta",
        image: "assets/images/step5.png",
        content: "<p>Quando tiver certeza de quem é o ladrão, digite o nome completo dele no campo de resposta e clique em <strong>Enviar Resposta</strong>. Lembre-se, você tem apenas uma chance!</p>"
    }
];

const hints = [
    "Comece sua investigação buscando pelo id do local do crime. A tabela <strong>locais</strong> pode ser útil.",
    "O ladrão estava no local próximo às 14:30. Busque na tabela <strong>eventos</strong> por pessoas que estavam no local 101, perto deste horário.",
    "Analise os históricos na tabela <strong>historicos</strong>. Quem são os prováveis suspeitos? Onde eles estavam na hora do crime?"
];
let hintsRevealed = []; // Array para rastrear dicas reveladas

const tableDescriptions = {
    pessoas: "Contém informações sobre todas as pessoas registradas no evento, como nome, ocupação e idade.",
    locais: "Lista todos os locais do evento, como estandes e laboratórios, incluindo sua capacidade e descrição.",
    crimes: "Registra os detalhes do crime que ocorreu, incluindo a descrição, o local e o horário exato.",
    eventos: "Um log de todas as atividades que ocorreram, registrando quem (pessoa_id) esteve onde (local_id) e quando (hora).",
    historicos: "Fornece o histórico profissional das pessoas, como a empresa em que trabalham e o cargo que ocupam."
};

// Descrições das colunas para o novo popup
const columnDescriptions = {
    pessoas: {
        id: "O ID único de cada pessoa.",
        nome: "O nome completo da pessoa.",
        ocupacao: "O cargo ou função da pessoa no evento.",
        idade: "A idade da pessoa.",
        localizacao_atual: "O ID do local onde a pessoa está no momento."
    },
    locais: {
        id: "O ID único de cada local.",
        nome: "O nome do local.",
        capacidade: "A capacidade máxima de pessoas no local.",
        descricao: "Uma descrição detalhada do local."
    },
    crimes: {
        id: "O ID único do crime.",
        descricao: "Detalhes do crime cometido.",
        local_id: "O ID do local onde o crime ocorreu.",
        hora_do_crime: "O horário exato do crime."
    },
    eventos: {
        id: "O ID único do evento.",
        pessoa_id: "O ID da pessoa envolvida no evento.",
        local_id: "O ID do local onde o evento ocorreu.",
        hora: "O horário do evento.",
        tipo: "O tipo de evento (ex: palestra, conversa, compra)."
    },
    historicos: {
        id: "O ID único do histórico.",
        pessoa_id: "O ID da pessoa a quem o histórico pertence.",
        empresa: "A empresa ou organização da pessoa.",
        cargo: "O cargo da pessoa."
    }
};

// Funções do jogo
function showScreen(screen) {
    document.querySelectorAll('.game-screen').forEach(s => s.classList.remove('active'));
    screen.classList.add('active');
}

function startTimer() {
    let timeLeft = timeLimit;
    timerInterval = setInterval(() => {
        timeLeft--;
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            showScreen(timesUpScreen);
        }
    }, 1000);
}

function renderQuery() {
    let queryText = '';
    
    if (currentQuery.select.length > 0) {
        queryText += `SELECT ${currentQuery.select.join(', ')}`;
    } else {
        queryText += `SELECT *`;
    }

    if (currentQuery.from) {
        queryText += ` FROM ${currentQuery.from}`;
    }

    if (currentQuery.where.length > 0) {
        queryText += ` WHERE ${currentQuery.where.join(' ')}`;
    }

    if (currentQuery.orderBy.column) {
        queryText += ` ORDER BY ${currentQuery.orderBy.column} ${currentQuery.orderBy.direction}`;
    }

    queryOutput.value = queryText;
}

function renderTables() {
    tablesList.innerHTML = '';
    for (const tableName in data) {
        const div = document.createElement('div');
        div.classList.add('table-item-container');

        const span = document.createElement('span');
        span.textContent = tableName.toUpperCase();
        span.classList.add('table-name');
        span.dataset.tableName = tableName;
        span.addEventListener('click', () => {
            currentQuery.from = tableName;
            renderQuery();
            renderColumns(tableName);
            updateModalButtons(tableName);
        });

        const infoButton = document.createElement('button');
        infoButton.classList.add('table-info-btn');
        const img = document.createElement('img');
        img.src = 'assets/images/lupa.png';
        infoButton.appendChild(img);
        infoButton.addEventListener('click', (event) => {
            showTableInfo(tableName);
            event.stopPropagation();
        });

        div.appendChild(span);
        div.appendChild(infoButton);
        tablesList.appendChild(div);
    }
}

function renderColumns(tableName) {
    columnsList.innerHTML = '';
    if (data[tableName] && data[tableName].length > 0) {
        const columns = Object.keys(data[tableName][0]);
        columns.forEach(col => {
            const div = document.createElement('div');
            div.classList.add('column-item');
            
            const span = document.createElement('span');
            span.classList.add('column-name');
            span.textContent = col;
            span.dataset.columnName = col;
            span.addEventListener('click', (event) => {
                if (!currentQuery.select.includes(event.target.dataset.columnName)) {
                    currentQuery.select.push(event.target.dataset.columnName);
                }
                renderQuery();
            });

            const infoButton = document.createElement('button');
            infoButton.classList.add('column-info-btn');
            const img = document.createElement('img');
            img.src = 'assets/images/lupa.png';
            infoButton.appendChild(img);
            infoButton.addEventListener('click', (event) => {
                showColumnInfo(tableName, col);
                event.stopPropagation();
            });

            div.appendChild(span);
            div.appendChild(infoButton);
            columnsList.appendChild(div);
        });
    }
}

function clearQuery() {
    currentQuery = { select: [], from: '', where: [], orderBy: { column: '', direction: 'ASC' } };
    queryOutput.value = 'Sua consulta será exibida aqui...';
    columnsList.innerHTML = '';
    resultsOutput.innerHTML = '';
}

function syncQueryObjectFromText() {
    const queryText = queryOutput.value.trim();

    // Resetar partes da query para garantir que não haja lixo de execuções anteriores
    currentQuery.select = [];
    currentQuery.from = '';
    currentQuery.where = [];
    currentQuery.orderBy = { column: '', direction: 'ASC' };

    // 1. Sincronizar FROM
    const fromMatch = queryText.match(/FROM\s+(\w+)/i);
    if (fromMatch) {
        currentQuery.from = fromMatch[1];
    }

    // 2. Sincronizar SELECT
    const selectMatch = queryText.match(/SELECT\s+(.*?)\s+FROM/i);
    if (selectMatch) {
        const selectPart = selectMatch[1].trim();
        if (selectPart === '*') {
            currentQuery.select = []; // Usamos array vazio para representar SELECT *
        } else {
            currentQuery.select = selectPart.split(',').map(c => c.trim());
        }
    }

    // 3. Sincronizar WHERE
    const whereMatch = queryText.match(/WHERE\s+(.*?)(?:\s+ORDER BY|$)/i);
    if (whereMatch) {
        // Armazenamos a cláusula inteira. A lógica de execução vai dividi-la.
        currentQuery.where.push(whereMatch[1].trim());
    }

    // 4. Sincronizar ORDER BY
    const orderByMatch = queryText.match(/ORDER BY\s+([a-zA-Z0-9_]+)\s*(ASC|DESC)?/i);
    if (orderByMatch) {
        currentQuery.orderBy.column = orderByMatch[1];
        currentQuery.orderBy.direction = orderByMatch[2] ? orderByMatch[2].toUpperCase() : 'ASC';
    }
}

function executeQuery() {
    
    syncQueryObjectFromText();
    if (!currentQuery.from) {
        resultsOutput.innerHTML = '<p class="error-message">Consulta inválida. Cláusula FROM não encontrada.</p>';
        return;
    }

    const fromTable = currentQuery.from;
    if (!data[fromTable]) {
        resultsOutput.innerHTML = `<p class="error-message">Tabela "${fromTable}" não encontrada.</p>`;
        return;
    }

    let results = [...data[fromTable]];

    // Filtra com base no WHERE
    if (currentQuery.where.length > 0) {
        const whereClause = currentQuery.where[0]; // Pegamos a cláusula inteira
        const conditions = whereClause.split(/\s+AND\s+/i);

        results = results.filter(row => {
            return conditions.every(condition => {
                const parts = condition.match(/(.*?)\s*(=|>|<)\s*(.*)/);
                if (!parts) return true;

                const column = parts[1].trim();
                const operator = parts[2].trim();
                const value = parts[3].trim().replace(/['"]/g, '');

                if (row[column] === undefined) return false;
                const rowValue = row[column];

                switch (operator) {
                    case '=': return String(rowValue) === value;
                    case '>': return Number(rowValue) > Number(value);
                    case '<': return Number(rowValue) < Number(value);
                    default: return true;
                }
            });
        });
    }

    // Ordena com base no ORDER BY
    if (currentQuery.orderBy.column) {
        const { column, direction } = currentQuery.orderBy;
        
        if (results.length > 0 && results[0].hasOwnProperty(column)) {
            results.sort((a, b) => {
                const aValue = a[column];
                const bValue = b[column];

                if (typeof aValue === 'number' && typeof bValue === 'number') {
                    return direction === 'ASC' ? aValue - bValue : bValue - aValue;
                } else {
                    if (aValue < bValue) return direction === 'ASC' ? -1 : 1;
                    if (aValue > bValue) return direction === 'ASC' ? 1 : -1;
                    return 0;
                }
            });
        }
    }

    // Seleciona as colunas
    if (currentQuery.select.length > 0) {
        const selectColumns = currentQuery.select;
        results = results.map(row => {
            const newRow = {};
            selectColumns.forEach(col => {
                if (row.hasOwnProperty(col)) {
                    newRow[col] = row[col];
                }
            });
            return newRow;
        });
    }
    
    currentResults = results;
    displayResults(results);
}

function displayResults(results) {
    resultsOutput.innerHTML = '';
    if (results.length === 0) {
        resultsOutput.innerHTML = '<p>Nenhum resultado encontrado.</p>';
        return;
    }
    
    const tableElement = document.createElement('table');
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');
    
    const columns = Object.keys(results[0]);
    
    const headerRow = document.createElement('tr');
    columns.forEach(col => {
        const th = document.createElement('th');
        th.textContent = col;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    
    results.forEach(row => {
        const tr = document.createElement('tr');
        columns.forEach(col => {
            const td = document.createElement('td');
            td.textContent = row[col];
            tr.appendChild(td);
        });
        tbody.appendChild(tr);
    });
    
    tableElement.appendChild(thead);
    tableElement.appendChild(tbody);
    resultsOutput.appendChild(tableElement);
}

function handleSubmitAnswer() {
    const finalAnswer = answerInput.value.trim();
    clearInterval(timerInterval);

    if (finalAnswer.toUpperCase() === correctAnswer.toUpperCase()) {
        showScreen(victoryScreen);
    } else {
        showScreen(gameOverScreen);
    }
}

function resetGame() {
    clearInterval(timerInterval);
    answerInput.value = '';
    notesInput.value = '';
    clearQuery();
    showScreen(startScreen);
    timerElement.textContent = '15:00';
    hintsRevealed = [];
    document.querySelectorAll('.btn-hint').forEach(btn => btn.disabled = false);
    document.querySelectorAll('.hidden-hint').forEach(hint => hint.style.display = 'none');
}

function renderTutorialStep(step) {
    tutorialContent.innerHTML = `<h3>${tutorialSteps[step].title}</h3><img src="${tutorialSteps[step].image}" alt="${tutorialSteps[step].title}" class="img_tutorial">${tutorialSteps[step].content}`;
    prevTutorialButton.style.display = step === 0 ? 'none' : 'inline-block';
    nextTutorialButton.style.display = step === tutorialSteps.length - 1 ? 'none' : 'inline-block';
    startStoryButton.style.display = step === tutorialSteps.length - 1 ? 'inline-block' : 'none';
    skipTutorialButton.style.display = step === tutorialSteps.length - 1 ? 'none' : 'inline-block';
}

function openHelpModal() {
    const commandHelpDiv = document.getElementById('command-help');
    helpModal.style.display = 'block';
}

function closeHelpModal() {
    helpModal.style.display = 'none';
}

function revealHint(hintIndex) {
    if (!hintsRevealed.includes(hintIndex)) {
        const hintTextElement = document.getElementById(`hint-${hintIndex}-text`);
        hintTextElement.innerHTML = hints[hintIndex - 1];
        hintTextElement.style.display = 'block';
        hintsRevealed.push(hintIndex);
        document.getElementById(`reveal-hint-${hintIndex}`).disabled = true;
    }
}

function copyResultsToNotes() {
    if (currentResults.length === 0) return;

    let notesText = `\n\n--- Resultados da Consulta ---\n`;
    
    const columns = Object.keys(currentResults[0]);
    notesText += columns.join('\t') + '\n';

    currentResults.forEach(row => {
        const values = columns.map(col => row[col]);
        notesText += values.join('\t') + '\n';
    });
    
    notesText += `---------------------------\n`;
    notesInput.value += notesText;
    notesInput.scrollTop = notesInput.scrollHeight;
}

function showTableInfo(tableName) {
    const modalContent = columnInfoModal.querySelector('.modal-content');
    modalContent.innerHTML = `
        <span class="close-button" id="info-close-btn">&times;</span>
        <h4>TABELA: ${tableName.toUpperCase()}</h4>
        <p>${tableDescriptions[tableName]}</p>
    `;
    columnInfoModal.style.display = 'flex';
    document.getElementById('info-close-btn').addEventListener('click', hideColumnInfo);
}

function showColumnInfo(tableName, columnName) {
    const modalContent = columnInfoModal.querySelector('.modal-content');
    modalContent.innerHTML = `
        <span class="close-button" id="info-close-btn">&times;</span>
        <h4>COLUNA: ${columnName}</h4>
        <p>${columnDescriptions[tableName][columnName]}</p>
    `;
    columnInfoModal.style.display = 'flex';
    document.getElementById('info-close-btn').addEventListener('click', hideColumnInfo);
}

function hideColumnInfo() {
    columnInfoModal.style.display = 'none';
}

function updateModalButtons(tableName) {
    const whereColumnsContainer = document.getElementById('where-columns');
    const orderbyColumnsContainer = document.getElementById('orderby-columns');

    whereColumnsContainer.innerHTML = '<h4>Colunas:</h4>';
    orderbyColumnsContainer.innerHTML = '<h4>Colunas:</h4>';

    if (data[tableName] && data[tableName].length > 0) {
        const columns = Object.keys(data[tableName][0]);
        columns.forEach(col => {
            const whereBtn = document.createElement('button');
            whereBtn.classList.add('btn', 'btn-column');
            whereBtn.textContent = col;
            whereBtn.addEventListener('click', () => {
                let currentValue = whereInput.value.trim();
                const operators = ['=', '>', '<', 'IN'];
                const lastOperatorIndex = Math.max(...operators.map(op => currentValue.lastIndexOf(op)));

                if (lastOperatorIndex > -1) {
                    whereInput.value = currentValue.substring(0, lastOperatorIndex + operators[0].length) + ' ' + col + ' ';
                } else {
                    whereInput.value = col + ' ';
                }
            });
            whereColumnsContainer.appendChild(whereBtn);

            const orderbyBtn = document.createElement('button');
            orderbyBtn.classList.add('btn', 'btn-column');
            orderbyBtn.textContent = col;
            orderbyBtn.addEventListener('click', () => {
                orderbyInput.value = col;
            });
            orderbyColumnsContainer.appendChild(orderbyBtn);
        });
    }
}

// Event Listeners
startTutorialButton.addEventListener('click', () => {
    showScreen(tutorialScreen);
    tutorialStep = 0;
    renderTutorialStep(tutorialStep);
});
prevTutorialButton.addEventListener('click', () => {
    if (tutorialStep > 0) {
        tutorialStep--;
        renderTutorialStep(tutorialStep);
    }
});
nextTutorialButton.addEventListener('click', () => {
    if (tutorialStep < tutorialSteps.length - 1) {
        tutorialStep++;
        renderTutorialStep(tutorialStep);
    }
});
skipTutorialButton.addEventListener('click', () => {
    showScreen(storyScreen);
});
startStoryButton.addEventListener('click', () => {
    showScreen(storyScreen);
});
startExplanationButton.addEventListener('click', () => {
    showScreen(sqlExplanationScreen);
});
fecharButton.addEventListener('click', () => {
    showScreen(mainGameScreen);
    window.scrollTo(0, 0);
});
fecharButton2.addEventListener('click', () => {
    showScreen(mainGameScreen);
    window.scrollTo(0, 0);
});
startMainGameButton.addEventListener('click', () => {
    showScreen(mainGameScreen);
    renderTables();
    startTimer();
    renderQuery();
    window.scrollTo(0, 0);
});

contextButton.addEventListener('click', () => {
    showScreen(storyScreen2);
});
commandsButton.addEventListener('click', () => {
    showScreen(sqlExplanationScreen2);
});
hintsButton.addEventListener('click', openHelpModal);
closeModalButton.addEventListener('click', closeHelpModal);
window.addEventListener('click', (event) => {
    if (event.target == helpModal || event.target == whereModal || event.target == orderbyModal) {
        event.target.style.display = 'none';
    }
});
whereCloseButton.addEventListener('click', () => whereModal.style.display = 'none');
orderbyCloseButton.addEventListener('click', () => orderbyModal.style.display = 'none');
document.addEventListener('click', (event) => {
    if (event.target === columnInfoModal) {
        hideColumnInfo();
    }
});

document.getElementById('reveal-hint-1').addEventListener('click', () => revealHint(1));
document.getElementById('reveal-hint-2').addEventListener('click', () => revealHint(2));
document.getElementById('reveal-hint-3').addEventListener('click', () => revealHint(3));

keywordsButtons.addEventListener('click', (event) => {
    if (event.target.classList.contains('keyword-btn')) {
        const keyword = event.target.dataset.keyword;
        if (keyword === 'WHERE') {
            whereModal.style.display = 'block';
        } else if (keyword === 'ORDER BY') {
            orderbyModal.style.display = 'block';
        } else if (keyword === 'ASC') {
            if (currentQuery.orderBy.column) {
                currentQuery.orderBy.direction = 'ASC';
                renderQuery();
            }
        } else if (keyword === 'DESC') {
            if (currentQuery.orderBy.column) {
                currentQuery.orderBy.direction = 'DESC';
                renderQuery();
            }
        } else if (keyword === 'AND') {
            currentQuery.where.push('AND');
            renderQuery();
        } else if (keyword === 'FROM') {
            currentQuery.from = 'nome_da_tabela';
            renderQuery();
        }
    }
});

whereConfirmButton.addEventListener('click', () => {
    const input = whereInput.value.trim();
    if (input) {
        currentQuery.where.push(input);
        whereInput.value = '';
        whereModal.style.display = 'none';
        renderQuery();
    }
});

orderbyConfirmButton.addEventListener('click', () => {
    const input = orderbyInput.value.trim();
    if (input) {
        currentQuery.orderBy.column = input;
        currentQuery.orderBy.direction = 'ASC'; // Sempre começa com ASC
        orderbyInput.value = '';
        orderbyModal.style.display = 'none';
        renderQuery();
    }
});

executeQueryButton.addEventListener('click', executeQuery);
clearQueryButton.addEventListener('click', clearQuery);
copyResultsButton.addEventListener('click', copyResultsToNotes);
submitAnswerButton.addEventListener('click', handleSubmitAnswer);
restartButtons.forEach(button => {
    button.addEventListener('click', resetGame);
});

document.getElementById('where-operators').addEventListener('click', (event) => {
    if (event.target.classList.contains('btn-operator')) {
        const operator = event.target.dataset.value;
        const currentValue = whereInput.value.trim();
        const parts = currentValue.split(/\s+/);
        
        if (parts.length === 1 && parts[0] !== '') {
            whereInput.value = `${parts[0]} ${operator} `;
        } else {
            whereInput.value = currentValue + ` ${operator} `;
        }
    }
});