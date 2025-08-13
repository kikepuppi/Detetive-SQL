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
const helpButton = document.getElementById('help-button'); // Mantido para compatibilidade, mas não mais usado no HTML principal
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
    orderBy: ''
};

let currentResults = []; // Armazena os resultados para copiar

// Variáveis do tutorial
let tutorialStep = 0;
const tutorialSteps = [
    {
        title: "Passo 1: O Objetivo",
        content: "<p>Seu objetivo é usar o terminal para filtrar os dados da Expo Tech e encontrar o ladrão. Você tem 15 minutos para isso!</p>"
    },
    {
        title: "Passo 2: Construindo a Consulta",
        content: "<p>A área central é onde você constrói a sua consulta. Use os botões de comandos, tabelas e colunas para montar a sua busca. Por exemplo, clique em <strong>SELECT</strong>, depois em uma coluna da tabela e em <strong>FROM</strong>, seguido pelo nome da tabela.</p>"
    },
    {
        title: "Passo 3: Tabelas e Colunas",
        content: "<p>À esquerda, na área <strong>Tabelas</strong>, estão os nomes das nossas tabelas de dados. Clique em um nome de tabela para que suas colunas apareçam à direita. Clique nas colunas para incluí-las na sua consulta.</p>"
    },
    {
        title: "Passo 4: Botão de Ajuda",
        content: "<p>O botão <button class='btn btn-help'>Ajuda</button> é o seu melhor amigo! Use-o sempre que tiver dúvidas sobre os comandos ou se precisar de uma dica para o caso.</p>"
    },
    {
        title: "Passo 5: Executando e Anotando",
        content: "<p>Após montar sua consulta, clique em <strong>Executar</strong> para ver os resultados. Use a área de <strong>Resultados</strong> para analisar as informações e a área de <strong>Anotações</strong> para registrar o que você descobrir. Agora, você pode copiar os resultados da tabela diretamente para suas anotações.</p>"
    },
    {
        title: "Passo 6: A Resposta",
        content: "<p>Quando tiver certeza de quem é o ladrão, digite o nome completo dele no campo de resposta e clique em <strong>Enviar Resposta</strong>. Lembre-se, você tem apenas uma chance!</p>"
    }
];

const helpContent = {
    select: "<strong>SELECT</strong>: Escolhe quais colunas você quer ver. Ex: `SELECT nome`. Padrão `*` para selecionar todas as colunas.",
    from: "<strong>FROM</strong>: Indica de qual tabela você quer extrair os dados. Ex: `FROM pessoas`",
    where: "<strong>WHERE</strong>: Filtra os resultados com base em uma condição. Ex: `WHERE idade > 30`",
    and: "<strong>AND</strong>: Combina duas ou mais condições na cláusula WHERE. Ex: `WHERE idade > 30 AND ocupacao = 'Professor'`",
    orderBy: "<strong>ORDER BY</strong>: Ordena os resultados com base em uma coluna. Ex: `ORDER BY nome`",
    asc: "<strong>ASC</strong>: Ordena os resultados de forma ascendente (crescente). É o padrão.",
    desc: "<strong>DESC</strong>: Ordena os resultados de forma descendente (decrescente)."
};

const hints = [
    "Comece sua investigação buscando pelo id do local do crime. A tabela <strong>locais</strong> pode ser útil.",
    "O ladrão estava no local próximo às 14:30. Busque na tabela <strong>eventos</strong> por pessoas que estavam no local 101, perto deste horário.",
    "Analise os históricos na tabela <strong>históricos</strong>. Quem são os prováveis suspeitos? Quais os eventos associados a eles?"
];
let hintsRevealed = []; // Array para rastrear dicas reveladas

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
    
    // Constrói a parte SELECT
    if (currentQuery.select.length > 0) {
        queryText += `SELECT ${currentQuery.select.join(', ')}`;
    } else {
        queryText += `SELECT *`;
    }

    // Constrói a parte FROM
    if (currentQuery.from) {
        queryText += ` FROM ${currentQuery.from}`;
    }

    // Constrói a parte WHERE
    if (currentQuery.where.length > 0) {
        queryText += ` WHERE ${currentQuery.where.join(' AND ')}`;
    }

    // Constrói a parte ORDER BY
    if (currentQuery.orderBy) {
        queryText += ` ORDER BY ${currentQuery.orderBy}`;
    }

    queryOutput.textContent = queryText;
}

function renderTables() {
    tablesList.innerHTML = '';
    for (const tableName in data) {
        const p = document.createElement('p');
        p.textContent = tableName.toUpperCase();
        p.classList.add('table-item');
        p.dataset.tableName = tableName;
        p.addEventListener('click', () => {
            currentQuery.from = tableName;
            renderQuery();
            renderColumns(tableName);
            updateModalButtons(tableName); // Nova chamada para atualizar os botões dos modais
        });
        tablesList.appendChild(p);
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
    currentQuery = { select: [], from: '', where: [], orderBy: '' };
    queryOutput.textContent = 'Sua consulta será exibida aqui...';
    columnsList.innerHTML = '';
    resultsOutput.innerHTML = '';
}

function executeQuery() {
    let results = [];
    const fromTable = currentQuery.from;
    const selectColumns = currentQuery.select;
    const whereClauses = currentQuery.where;
    const orderByClause = currentQuery.orderBy;

    if (!fromTable) {
        resultsOutput.innerHTML = '<p class="error-message">Selecione uma tabela com FROM primeiro.</p>';
        return;
    }
    
    results = data[fromTable];

    if (whereClauses.length > 0) {
        whereClauses.forEach(clause => {
            const parts = clause.split(' ').map(s => s.trim());
            const column = parts[0];
            const operator = parts[1];
            const valuePart = parts.slice(2).join(' ');

            if (operator.toUpperCase() === 'IN') {
                const values = valuePart.replace(/[\(\)']/g, '').split(',').map(v => v.trim());
                results = results.filter(row => values.includes(String(row[column.toLowerCase()])));
            } else {
                const value = valuePart;
                results = results.filter(row => {
                    const rowValue = row[column.toLowerCase()];
                    if (operator === '=') return String(rowValue) === value.replace(/['"]/g, '');
                    if (operator === '>') return rowValue > value;
                    if (operator === '<') return rowValue < value;
                    return true;
                });
            }
        });
    }

    if (orderByClause) {
        const [column, order] = orderByClause.split(' ').map(s => s.trim());
        results.sort((a, b) => {
            const aValue = a[column.toLowerCase()];
            const bValue = b[column.toLowerCase()];
            if (aValue < bValue) return order === 'ASC' ? -1 : 1;
            if (aValue > bValue) return order === 'ASC' ? 1 : -1;
            return 0;
        });
    }

    if (selectColumns.length > 0 && selectColumns[0] !== '*') {
        results = results.map(row => {
            const newRow = {};
            selectColumns.forEach(col => {
                newRow[col] = row[col];
            });
            return newRow;
        });
    }
    
    currentResults = results; // Armazena os resultados para copiar
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
    // Resetar o estado dos botões de dica
    document.querySelectorAll('.btn-hint').forEach(btn => btn.disabled = false);
    document.querySelectorAll('.hidden-hint').forEach(hint => hint.style.display = 'none');
}

// Funções do Tutorial
function renderTutorialStep(step) {
    tutorialContent.innerHTML = `<h3>${tutorialSteps[step].title}</h3>${tutorialSteps[step].content}`;
    prevTutorialButton.style.display = step === 0 ? 'none' : 'inline-block';
    nextTutorialButton.style.display = step === tutorialSteps.length - 1 ? 'none' : 'inline-block';
    startStoryButton.style.display = step === tutorialSteps.length - 1 ? 'inline-block' : 'none';
    skipTutorialButton.style.display = step === tutorialSteps.length - 1 ? 'none' : 'inline-block';
}

// Funções do Ajuda
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
    
    // Constrói o cabeçalho
    const columns = Object.keys(currentResults[0]);
    notesText += columns.join('\t') + '\n';

    // Constrói as linhas
    currentResults.forEach(row => {
        const values = columns.map(col => row[col]);
        notesText += values.join('\t') + '\n';
    });
    
    notesText += `---------------------------\n`;
    notesInput.value += notesText;
    notesInput.scrollTop = notesInput.scrollHeight;
}

// Funções do novo popup de informações da coluna
function showColumnInfo(tableName, columnName) {
    const modalContent = columnInfoModal.querySelector('.modal-content');
    modalContent.innerHTML = `
        <span class="close-button" id="info-close-btn">&times;</span>
        <h4>${columnName.toUpperCase()}</h4>
        <p>${columnDescriptions[tableName][columnName]}</p>
    `;
    columnInfoModal.style.display = 'flex';
    document.getElementById('info-close-btn').addEventListener('click', hideColumnInfo);
}

function hideColumnInfo() {
    columnInfoModal.style.display = 'none';
}

// Função para atualizar os botões de colunas nos modais
function updateModalButtons(tableName) {
    const whereColumnsContainer = document.getElementById('where-columns');
    const orderbyColumnsContainer = document.getElementById('orderby-columns');

    // Limpa os containers existentes, mas mantém o título "Colunas:"
    whereColumnsContainer.innerHTML = '<h4>Colunas:</h4>';
    orderbyColumnsContainer.innerHTML = '<h4>Colunas:</h4>';

    if (data[tableName] && data[tableName].length > 0) {
        const columns = Object.keys(data[tableName][0]);
        columns.forEach(col => {
            // Botões para o modal WHERE
            const whereBtn = document.createElement('button');
            whereBtn.classList.add('btn', 'btn-column');
            whereBtn.textContent = col;
            whereBtn.addEventListener('click', () => {
                // Remove o nome da coluna anterior, mas mantém o operador
                let currentValue = whereInput.value.trim();
                const operators = ['=', '>', '<', 'IN']; // Adicione outros operadores se necessário
                const lastOperatorIndex = Math.max(...operators.map(op => currentValue.lastIndexOf(op)));

                if (lastOperatorIndex > -1) {
                    whereInput.value = currentValue.substring(0, lastOperatorIndex + operators[0].length) + ' ' + col + ' ';
                } else {
                    whereInput.value = col + ' ';
                }
            });
            whereColumnsContainer.appendChild(whereBtn);

            // Botões para o modal ORDER BY
            const orderbyBtn = document.createElement('button');
            orderbyBtn.classList.add('btn', 'btn-column');
            orderbyBtn.textContent = col;
            orderbyBtn.addEventListener('click', () => {
                orderbyInput.value = col; // Simplesmente substitui o valor
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

// Event listeners para os novos botões do header
contextButton.addEventListener('click', () => {
    showScreen(storyScreen2);
});

commandsButton.addEventListener('click', () => {
    showScreen(sqlExplanationScreen2);
});

hintsButton.addEventListener('click', openHelpModal); // O botão de dicas abrirá o modal de ajuda

// helpButton.addEventListener('click', openHelpModal); // Este botão foi removido do HTML principal
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
            if (currentQuery.orderBy) {
                currentQuery.orderBy = currentQuery.orderBy.split(' ')[0] + ' ASC';
            }
        } else if (keyword === 'DESC') {
            if (currentQuery.orderBy) {
                currentQuery.orderBy = currentQuery.orderBy.split(' ')[0] + ' DESC';
            }
        }
        renderQuery();
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
        currentQuery.orderBy = `${input} ASC`;
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

// Event Listener para os botões de operadores do WHERE
document.getElementById('where-operators').addEventListener('click', (event) => {
    if (event.target.classList.contains('btn-operator')) {
        const operator = event.target.dataset.value;
        const currentValue = whereInput.value.trim();
        const parts = currentValue.split(/\s+/);
        
        // Verifica se já tem uma coluna na caixa de texto
        if (parts.length === 1 && parts[0] !== '') {
            whereInput.value = `${parts[0]} ${operator} `;
        } else {
            // Se não tiver coluna, ou se já tiver um operador, simplesmente adiciona o operador
            whereInput.value = currentValue + ` ${operator} `;
        }
    }
});