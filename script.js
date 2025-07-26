document.addEventListener('DOMContentLoaded', () => {

    const displayElement = document.getElementById('display');
    const keysContainer = document.querySelector('.calculator__keys');

    // --- MANEJO CENTRAL DE EVENTOS DE BOTONES (VERSIÓN CORREGIDA) ---
    keysContainer.addEventListener('click', (event) => {
        if (!event.target.matches('button')) return;

        const button = event.target;
        const { action, value } = button.dataset;
        const currentDisplay = displayElement.textContent;
        const lastChar = currentDisplay.slice(-1);
        
        // Si hay un error, cualquier botón (excepto historial) limpia el display
        if (displayElement.classList.contains('error')) {
            clearDisplay();
        }

        // Si es un número (value existe)
        if (value) {
            if (currentDisplay === '0') {
                displayElement.textContent = value;
            } else {
                displayElement.textContent += value;
            }
        }

        // Si es una acción (operador, clear, etc.)
        if (action) {
            switch (action) {
                case 'add':
                case 'subtract':
                case 'multiply':
                case 'divide':
                    // ✨✨¡AQUÍ ESTÁ LA CORRECCIÓN PRINCIPAL!✨✨
                    // Impide añadir operadores consecutivos.
                    const operators = ['+', '-', '×', '÷'];
                    if (operators.includes(lastChar)) {
                        // Si el último caracter es un operador, lo reemplaza
                        displayElement.textContent = currentDisplay.slice(0, -1) + getOperatorSymbol(action);
                    } else {
                        // Si no, lo añade
                        displayElement.textContent += getOperatorSymbol(action);
                    }
                    break;
                
                case 'decimal':
                    // Lógica mejorada para el punto decimal
                    const segments = currentDisplay.split(/[\+\-×÷]/);
                    if (!segments[segments.length - 1].includes('.')) {
                        displayElement.textContent += '.';
                    }
                    break;

                case 'calculate':
                    calculate();
                    break;
                case 'clear':
                    clearDisplay();
                    break;
                case 'delete':
                    deleteLastDigit();
                    break;
            }
        }
    });

    // Función auxiliar para obtener el símbolo del operador
    function getOperatorSymbol(action) {
        const map = { add: '+', subtract: '-', multiply: '×', divide: '÷' };
        return map[action];
    }
    
    // Función para limpiar display
    function clearDisplay() {
        displayElement.textContent = '0';
        displayElement.classList.remove('error');
    }

    // Función para borrar el último caracter
    function deleteLastDigit() {
        if (displayElement.textContent.length > 1 && displayElement.textContent !== 'Error') {
            displayElement.textContent = displayElement.textContent.slice(0, -1);
        } else {
            displayElement.textContent = '0';
        }
         displayElement.classList.remove('error');
    }

    // Función para calcular el resultado de forma segura
    function calculate() {
        try {
            let expression = displayElement.textContent
                .replace(/×/g, '*')
                .replace(/÷/g, '/');
            
            // Ignorar el último operador si la expresión termina con uno
            if (['+', '-', '*', '/'].includes(expression.slice(-1))) {
                expression = expression.slice(0, -1);
            }

            const result = new Function('return ' + expression)();
            
            if (!isFinite(result)) {
                throw new Error("División por cero");
            }
            
            const finalResult = parseFloat(result.toFixed(7));
            saveHistory(displayElement.textContent, finalResult); // Guardar expresión original
            displayElement.textContent = finalResult;

        } catch (error) {
            displayElement.textContent = 'Error';
            displayElement.classList.add('error');
        }
    }
    
    // ===============================================
    // CÓDIGO DEL HISTORIAL, TEMA Y MÚSICA (Sin cambios)
    // ===============================================

    const historyList = document.getElementById('historyList');
    const historyBackButton = document.getElementById('historyBack');
    const historyForwardButton = document.getElementById('historyForward');
    const historyClearButton = document.getElementById('historyClear');
    let history = [];
    let historyIndex = -1;

    function saveHistory(expression, result) {
        if (history.length > 20) history.shift();
        history.push({ expression, result });
        historyIndex = history.length - 1;
        updateHistoryStorage();
        renderHistory();
    }
    function renderHistory() {
        historyList.innerHTML = '';
        history.forEach((entry, index) => {
            const li = document.createElement('li');
            li.textContent = `${entry.expression} = ${entry.result}`;
            li.dataset.index = index;
            if(index === historyIndex) li.classList.add('active');
            historyList.appendChild(li);
        });
    }
    function updateHistoryStorage() { localStorage.setItem('calc_history', JSON.stringify(history)); }
    function loadHistoryFromStorage() {
        const stored = JSON.parse(localStorage.getItem('calc_history'));
        if (stored) { history = stored; historyIndex = history.length - 1; renderHistory(); }
    }
    historyBackButton.addEventListener('click', () => { if (historyIndex > 0) { historyIndex--; renderHistory(); } });
    historyForwardButton.addEventListener('click', () => { if (historyIndex < history.length - 1) { historyIndex++; renderHistory(); } });
    historyClearButton.addEventListener('click', () => { if(confirm('¿Borrar historial?')) { history = []; historyIndex = -1; updateHistoryStorage(); renderHistory(); } });
    historyList.addEventListener('click', (e) => {
        if(e.target.matches('li')) { const i = parseInt(e.target.dataset.index); historyIndex = i; displayElement.textContent = history[i].result.toString(); renderHistory();}
    });


    const themeToggle = document.getElementById('themeToggle');
    themeToggle.addEventListener('change', () => {
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('calc_theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
    });
    function loadTheme() {
        if (localStorage.getItem('calc_theme') === 'dark') { document.body.classList.add('dark-mode'); themeToggle.checked = true; }
    }


    const audioPlayer = document.getElementById('audioPlayer');
    const trackSelect = document.getElementById('trackSelect');
    trackSelect.addEventListener('change', () => { audioPlayer.src = trackSelect.value; audioPlayer.play(); });
    function initPlayer() { if (trackSelect.options.length > 0) audioPlayer.src = trackSelect.options[0].value; }


    // --- INICIALIZACIÓN ---
    loadHistoryFromStorage();
    loadTheme();
    initPlayer();
});