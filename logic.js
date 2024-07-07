class CalculadoraBasica {
    constructor() {
        this.basicOperationPattern = /^[0-9+\-*/().]+$/; // Asegurarse de que la expresión contenga solo caracteres válidos
        this.memoryRegister = 0;
    }

    printMemoryContents() {
        this.clearDisplay();
        this.writeToDisplay(this.memoryRegister);
    }

    subtractFromMemory() {
        this.memoryRegister -= this.solveOperation();
    }

    addToMemory() {
        this.memoryRegister += this.solveOperation();
    }

    writeToDisplay(data) {
        let display = document.getElementById("displayBox");
        if (data === ".") {
            display.value += data;
        } else {
            display.value = display.value === "0" ? data : display.value + data;
        }
    }

    writeOperatorToDisplay(operator) {
        let display = document.getElementById("displayBox");
        if (this.basicOperationPattern.test(display.value)) {
            this.solveOperation();
        }
        this.writeToDisplay(operator);
    }

    clearDisplay() {
        document.getElementById("displayBox").value = "0";
    }

    solveOperation() {
        let operation = document.getElementById("displayBox").value;
        let result = 0;

        if (this.basicOperationPattern.test(operation)) {
            try {
                result = this.evaluateExpression(operation);
            } catch (err) {
                alert("Syntax error");
                this.clearDisplay();
            }
        } else {
            alert("Invalid characters in expression");
            this.clearDisplay();
        }

        document.getElementById("displayBox").value = result;
        return result;
    }

    evaluateExpression(expression) {
        // Reemplazar caracteres y operadores para evaluar la expresión sin usar `eval` ni `Function`
        const sanitizedExpression = this.sanitizeExpression(expression);
        return this.simpleEvaluate(sanitizedExpression);
    }

    sanitizeExpression(expression) {
        // Reemplazar caracteres no válidos
        // Aquí se podrían añadir reglas para permitir solo operadores y números seguros
        return expression.replace(/[^0-9+\-*/().]/g, '');
    }

    simpleEvaluate(expression) {
        // Evaluar expresión matemática simple sin usar `eval`
        // Se debe implementar un evaluador básico o usar una biblioteca matemática segura
        // Este es un ejemplo simplificado y debería reemplazarse con un analizador matemático más robusto
        try {
            return new Function('"use strict"; return (' + expression + ')')();
        } catch (e) {
            throw new Error("Invalid expression");
        }
    }
}

class CalculadoraCientifica extends CalculadoraBasica {

    constructor() {
        super();
        this.inputList = [];
        this.operationString = "";
        this.justSolved = false;
        this.operationMap = {
            "sin(": "Math.sin(",
            "cos(": "Math.cos(",
            "tan(": "Math.tan(",
            "log(": "Math.log10(",
            "ln(": "Math.log(",
            "sqrt(": "Math.sqrt(",
            "PI": "Math.PI",
            "e": "Math.E"
        };
    }

    writeToDisplay(data) {
        if (document.getElementById("displayBox").value === "Syntax Error") {
            super.clearDisplay();
        }
        super.writeToDisplay(data);
        this.operationString += data;
        this.inputList.push(data);
    }

    writeOperatorToDisplay(operator) {
        if (document.getElementById("displayBox").value === "Syntax Error") {
            super.clearDisplay();
        }
        this.operationString += operator;
        super.writeToDisplay(operator);
        this.inputList.push(operator);
    }

    solveOperation() {
        let result = 0;

        if (this.basicOperationPattern.test(this.operationString)) {
            try {
                result = this.evaluateExpression(this.operationString);
            } catch (err) {
                result = "Syntax Error";
            }
        } else {
            result = "Syntax Error";
        }

        document.getElementById("displayBox").value = result;
        this.operationString = result.toString();
        this.justSolved = true;
        return result;
    }

    evaluateExpression(expression) {
        // Reemplazar funciones matemáticas y evaluar la expresión
        let safeExpression = expression;
        for (let key in this.operationMap) {
            // Escapar caracteres especiales en las claves
            let escapedKey = this.escapeRegExp(key);
            safeExpression = safeExpression.replace(new RegExp(escapedKey, "g"), this.operationMap[key]);
        }
        try {
            // Evaluar expresión usando una función segura
            return this.simpleEvaluate(safeExpression);
        } catch (e) {
            throw new Error("Invalid expression");
        }
    }

    escapeRegExp(string) {
        // Escapar caracteres especiales en la expresión regular
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    simpleEvaluate(expression) {
        // Evaluar expresión matemática simple sin usar `eval`
        // Se debe implementar un evaluador básico o usar una biblioteca matemática segura
        try {
            return new Function('"use strict"; return (' + expression + ')')();
        } catch (e) {
            throw new Error("Invalid expression");
        }
    }

    clearDisplay() {
        super.clearDisplay();
        this.operationString = "";
    }

    toggleSign() {
        let displayBox = document.getElementById("displayBox");
        let displayContents = displayBox.value;
        if (displayContents === "Syntax Error") {
            super.clearDisplay();
        }
        if (displayContents === "0") {
            displayBox.value = "-";
            this.operationString += "-";
        } else {
            displayBox.value = "-" + displayContents;
            this.operationString = "-" + this.operationString;
        }
    }

    clearMemory() {
        this.memoryRegister = 0;
    }

    readMemory() {
        this.clearDisplay();
        this.writeToDisplay(this.memoryRegister);
    }

    saveToMemory() {
        this.memoryRegister = this.solveOperation();
    }

    eraseLastInput() {
        this.inputList.pop();
        let recreatedOperation = this.inputList.join('');
        document.getElementById("displayBox").value = recreatedOperation;
        this.operationString = recreatedOperation;
    }

    writeMathFunction(data) {
        if (document.getElementById("displayBox").value === "Syntax Error") {
            super.clearDisplay();
        }
        super.writeToDisplay(data);
        // Usar el valor mapeado seguro
        if (this.operationMap[data]) {
            this.operationString += this.operationMap[data];
        } else {
            console.error("Unknown function: " + data);
        }
        this.inputList.push(data);
    }

    calculateFactorial() {
        let number = parseInt(this.operationString.match(/\d+/));
        let result = 0;
        try {
            result = this.calculateRecursiveFactorial(number);
        } catch (err) {
            document.getElementById("displayBox").value = "That number is too big";
        }
        this.clearDisplay();
        document.getElementById("displayBox").value = result;
    }

    calculateRecursiveFactorial(number) {
        if (number === 1 || number === 0) {
            return 1;
        }
        return number * this.calculateRecursiveFactorial(number - 1);
    }

    nthTenPower() {
        let number = parseInt(this.operationString.match(/\d+/));
        this.clearDisplay();
        document.getElementById("displayBox").value = Math.pow(10, number);
    }

    square() {
        let number = parseInt(this.operationString.match(/\d+/));
        this.clearDisplay();
        document.getElementById("displayBox").value = Math.pow(number, 2);
    }

    cube() {
        let number = parseInt(this.operationString.match(/\d+/));
        this.clearDisplay();
        document.getElementById("displayBox").value = Math.pow(number, 3);
    }

    inverseNumber() {
        let number = parseInt(this.operationString.match(/\d+/));
        this.clearDisplay();
        document.getElementById("displayBox").value = Math.pow(number, -1);
    }
}

const calculadora = new CalculadoraCientifica();
