// Funciones de la calculadora
function addToDisplay(value) {
    const display = document.getElementById('display');
    const currentValue = display.value;
    // Verificar si el último carácter es un operador
    const lastCharIsOperator = isOperator(currentValue.charAt(currentValue.length - 1));
    // Verificar si el valor que se está agregando es un operador
    const newValueIsOperator = isOperator(value);
    // Mostrar solo un signo si el último carácter también es un operador
    if (lastCharIsOperator && newValueIsOperator) {
        // Reemplazar el último operador con el nuevo
        display.value = currentValue.slice(0, -1) + value;
    } else {
        // Agregar el valor normalmente
        display.value += value;
    }
}
// Función para borrar un dígito a la vez
function deleteLastDigit() {
    const display = document.getElementById('display');
    display.value = display.value.slice(0, -1);
}
// Función auxiliar para verificar si un carácter es un operador
function isOperator(char) {
    return ['+', '-', '*', '/'].includes(char);
}
function calculate() {
    try {
        const expression = document.getElementById('display').value;
        const result = eval(expression);
        document.getElementById('display').value = result;
        animateDisplay();
        // Guardar historial y datos en Local Storage
        saveToLocalStorage(expression, result);
    } catch (error) {
        document.getElementById('display').value = 'Error';
    }
}
function clearDisplay() {
    document.getElementById('display').value = '';
}
// Función para animar el display (debes implementarla)
function animateDisplay() {
    // Implementa la lógica de animación si es necesario
}
// Función para guardar en el Local Storage (debes implementarla)
function saveToLocalStorage(expression, result) {
    // Implementa la lógica de guardado en el Local Storage si es necesario
}
        // Funciones del historial
        let history = [];
        let currentIndex = -1;
        function goBack() {
            if (currentIndex > 0) {
                currentIndex--;
                loadFromHistory();
            }
        }
        function goForward() {
            if (currentIndex < history.length - 1) {
                currentIndex++;
                loadFromHistory();
            }
        }
        function saveToLocalStorage(expression, result) {
            // Guardar historial en Local Storage
            history.push({ expression, result });
            currentIndex = history.length - 1;
            updateLocalStorage();
        }
        function loadFromHistory() {
            if (currentIndex >= 0 && currentIndex < history.length) {
                document.getElementById('display').value = history[currentIndex].expression;
            }
        }
        function displayHistory() {
            const historyList = document.getElementById('historyList');
            historyList.innerHTML = ''; // Limpiar la lista
            history.forEach((entry, index) => {
                const listItem = document.createElement('li');
                listItem.textContent = `Cuenta ${index + 1}: ${entry.expression} = ${entry.result}`;
                historyList.appendChild(listItem);
            });
        }
        function updateLocalStorage() {
            // Actualizar Local Storage
            localStorage.setItem('calculationHistory', JSON.stringify(history));
            localStorage.setItem('currentIndex', currentIndex);
            // Mostrar historial
            displayHistory();
        }
        // Animación de la pantalla de la calculadora
        function animateDisplay() {
            const display = document.getElementById('display');
            display.classList.remove('calculate-animation');
            void display.offsetWidth; // Triggers reflow
            display.classList.add('calculate-animation');
        }
        // Cargar historial desde Local Storage al cargar la página
        window.onload = function() {
            const storedHistory = JSON.parse(localStorage.getItem('calculationHistory')) || [];
            const storedIndex = parseInt(localStorage.getItem('currentIndex')) || -1;
            if (storedHistory.length > 0) {
                history = storedHistory;
                currentIndex = storedIndex;
                loadFromHistory();
                displayHistory();
            }
        };
        
        // Borra el historial desde Local Storage al cargar la página
    function clearHistory() {
        history = [];
        currentIndex = -1;
        updateLocalStorage();
    }
    // Puedes llamar a esta función desde un botón en tu interfaz
    // Por ejemplo, añadiendo un botón con onclick="clearHistoryButton()"
    function clearHistoryButton() {
        const confirmation = confirm("¿Estás seguro de que quieres borrar el historial?");
        if (confirmation) {
            clearHistory();
        }
    }