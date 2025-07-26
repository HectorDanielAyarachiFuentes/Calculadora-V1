// --- CLASE CALCULADORA: (Sin cambios, ya era robusta) ---
class Calculator {
    constructor(previousOperandTextElement, currentOperandTextElement) {
        this.previousOperandTextElement = previousOperandTextElement;
        this.currentOperandTextElement = currentOperandTextElement;
        this.memory = 0;
        this.clear();
    }
    clear() { this.currentOperand = ''; this.previousOperand = ''; this.operation = undefined; this.isResultDisplayed = false; }
    delete() { if (this.isResultDisplayed) return; this.currentOperand = this.currentOperand.toString().slice(0, -1); }
    appendNumber(number) { if (this.isResultDisplayed) { this.currentOperand = ''; this.isResultDisplayed = false; } if (number === '.' && this.currentOperand.includes('.')) return; this.currentOperand = this.currentOperand.toString() + number.toString(); }
    chooseOperation(operation) { if (this.currentOperand === '') return; if (this.previousOperand !== '') { this.compute(); } this.operation = operation; this.previousOperand = this.currentOperand; this.currentOperand = ''; this.isResultDisplayed = false; }
    applyFunction(func) { if (this.currentOperand === '') return; const current = parseFloat(this.currentOperand); if (isNaN(current)) return; let result; switch (func) { case '√': result = Math.sqrt(current); break; case '^': result = Math.pow(current, 2); break; case 'sin': result = Math.sin(current * Math.PI / 180); break; case 'cos': result = Math.cos(current * Math.PI / 180); break; } this.currentOperand = parseFloat(result.toPrecision(12)); this.isResultDisplayed = true; }
    compute() { let computation; const prev = parseFloat(this.previousOperand); const current = parseFloat(this.currentOperand); if (isNaN(prev) || isNaN(current)) return; switch (this.operation) { case '+': computation = prev + current; break; case '-': computation = prev - current; break; case '×': computation = prev * current; break; case '÷': if (current === 0) { this.currentOperand = "Error"; this.operation = undefined; this.previousOperand = ''; return; } computation = prev / current; break; default: return; } const expression = `${this.formatDisplayNumber(prev)} ${this.operation} ${this.formatDisplayNumber(current)}`; this.currentOperand = parseFloat(computation.toPrecision(12)); saveHistory(expression, this.currentOperand); this.operation = undefined; this.previousOperand = ''; this.isResultDisplayed = true; }
    memoryClear() { this.memory = 0; }
    memoryRecall() { this.currentOperand = this.memory; }
    memoryAdd() { if (this.currentOperand === '') return; this.memory += parseFloat(this.currentOperand); }
    memorySubtract() { if (this.currentOperand === '') return; this.memory -= parseFloat(this.currentOperand); }
    formatDisplayNumber(number) { if (number === "Error") return "Error"; const stringNumber = number.toString(); const integerDigits = parseFloat(stringNumber.split('.')[0]); const decimalDigits = stringNumber.split('.')[1]; let integerDisplay; if (isNaN(integerDigits)) { integerDisplay = ''; } else { integerDisplay = integerDigits.toLocaleString('es', { maximumFractionDigits: 0 }); } if (decimalDigits != null) { return `${integerDisplay}.${decimalDigits}`; } else { return integerDisplay; } }
    updateDisplay() { this.currentOperandTextElement.innerText = this.formatDisplayNumber(this.currentOperand) || '0'; if (this.operation != null) { this.previousOperandTextElement.innerText = `${this.formatDisplayNumber(this.previousOperand)} ${this.operation}`; } else { this.previousOperandTextElement.innerText = ''; } }
}

// --- INICIALIZACIÓN Y MANEJO DE EVENTOS (Sin cambios) ---
document.addEventListener('DOMContentLoaded', () => {
    const previousOperandTextElement = document.querySelector('[data-previous-operand]');
    const currentOperandTextElement = document.querySelector('[data-current-operand]');
    const keys = document.querySelectorAll('.key');
    const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement);
    keys.forEach(button => {
        button.addEventListener('click', () => {
            if ('vibrate' in navigator) navigator.vibrate(10);
            if(button.dataset.number) calculator.appendNumber(button.dataset.number);
            if(button.dataset.operator) calculator.chooseOperation(button.dataset.operator);
            if(button.dataset.function) calculator.applyFunction(button.dataset.function);
            switch (button.dataset.action) {
                case 'equals': calculator.compute(); break;
                case 'clear': calculator.clear(); break;
                case 'delete': calculator.delete(); break;
                case 'memory-clear': calculator.memoryClear(); break;
                case 'memory-recall': calculator.memoryRecall(); break;
                case 'memory-add': calculator.memoryAdd(); break;
                case 'memory-subtract': calculator.memorySubtract(); break;
            }
            calculator.updateDisplay();
        });
    });
    const modeToggle = document.getElementById('modeToggle');
    const calculatorGrid = document.querySelector('.calculator-grid');
    const modeLabel = document.getElementById('modeLabel');
    modeToggle.addEventListener('change', () => {
        calculatorGrid.classList.toggle('scientific-mode', modeToggle.checked);
        modeLabel.textContent = modeToggle.checked ? 'Modo Científico' : 'Modo Básico';
    });
    initTheme();
    initHistory();
    initPlayer();
});


// --- FUNCIONES AUXILIARES (Historial, Tema, Música) ---
let history = [];
function saveHistory(expression, result) {
    if (history.length > 20) history.shift();
    history.push({ expression, result });
    renderHistory();
    localStorage.setItem('calc_history', JSON.stringify(history));
}

// ✨ FUNCIÓN DE RENDERIZADO MEJORADA ✨
function renderHistory() {
    const historyList = document.getElementById('historyList');
    historyList.innerHTML = ''; // Limpiar siempre

    if (history.length === 0) {
        // Mostrar estado vacío
        const emptyLi = document.createElement('li');
        emptyLi.textContent = 'Tu historial de cálculos aparecerá aquí.';
        emptyLi.classList.add('history-empty-state');
        historyList.appendChild(emptyLi);
    } else {
        // Mostrar historial
        [...history].reverse().forEach(entry => {
            const li = document.createElement('li');
            li.textContent = `${entry.expression} = ${entry.result}`;
            historyList.appendChild(li);
        });
    }
}

function initHistory() {
    const storedHistory = JSON.parse(localStorage.getItem('calc_history'));
    if (storedHistory) {
        history = storedHistory;
    }
    renderHistory(); // Renderizar siempre, maneja el estado vacío
    document.getElementById('historyClear').addEventListener('click', () => {
        history = [];
        renderHistory();
        localStorage.removeItem('calc_history');
    });
}

function initTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const setTema = (isDark) => { document.body.classList.toggle('dark-mode', isDark); themeToggle.checked = isDark; localStorage.setItem('calc_theme', isDark ? 'dark' : 'light'); };
    themeToggle.addEventListener('change', () => setTema(themeToggle.checked));
    const preferredTheme = localStorage.getItem('calc_theme');
    if (preferredTheme) { setTema(preferredTheme === 'dark'); } else { setTema(window.matchMedia('(prefers-color-scheme: dark)').matches); }
}

function initPlayer() {
    const audioPlayer = document.getElementById('audioPlayer');
    const trackSelect = document.getElementById('trackSelect');
    if (trackSelect.options.length > 0) audioPlayer.src = trackSelect.value;
    trackSelect.addEventListener('change', () => { audioPlayer.src = trackSelect.value; audioPlayer.play(); });
}