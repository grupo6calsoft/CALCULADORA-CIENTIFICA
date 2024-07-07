class CalculadoraBasica {

    constructor() {
        this.basicOperationShape = new RegExp("(([1-9][0-9]*|[0.])(.[0-9]*[1-9])?[\-\+\*\/])(([1-9][0-9]*|[0.])(.[0-9]*[1-9])?)");
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
        let legacy = document.getElementById("displayBox").value;
        if (data == ".") {
            legacy += data;
        } else {
            legacy = legacy == "0" ? data : legacy + data;
        }
        document.getElementById("displayBox").value = legacy;
    }

    writeOperatorToDisplay(operator) {
        let legacy = document.getElementById("displayBox").value;
        if (this.basicOperationShape.test(legacy)) {
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
        try {
            // Safe evaluation of mathematical expressions
            result = this.safeEvaluate(operation);
        } catch (err) {
            alert("Syntax error");
            this.clearDisplay();
        }
        document.getElementById("displayBox").value = result;
        return result;
    }

    // Safe evaluation method
    safeEvaluate(expression) {
        let safeExpression = expression.replace(/[^0-9+\-*/().]/g, ''); // Remove unsafe characters
        try {
            return new Function('return ' + safeExpression)(); // Use Function constructor in a controlled way
        } catch (e) {
            return 'Syntax Error';
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
        if (document.getElementById("displayBox").value == "Syntax Error") {
            super.clearDisplay();
        }
        super.writeToDisplay(data);
        this.operationString += data;
        this.inputList.push(data);
    }

    writeOperatorToDisplay(operator) {
        if (document.getElementById("displayBox").value == "Syntax Error") {
            super.clearDisplay();
        }
        this.operationString += operator;
        super.writeToDisplay(operator);
        this.inputList.push(operator);
    }

    solveOperation() {
        let result = 0;
        try {
            result = this.safeEvaluate(this.operationString);
        } catch (err) {
            result = "Syntax Error";
        }
        document.getElementById("displayBox").value = result;
        this.operationString = "";
        this.operationString += result;
        this.justSolved = true;
        return result;
    }

    safeEvaluate(expression) {
        let safeExpression = expression.replace(/[^0-9+\-*/().]/g, ''); // Remove unsafe characters
        try {
            return new Function('return ' + safeExpression)(); // Use Function constructor in a controlled way
        } catch (e) {
            return 'Syntax Error';
        }
    }

    clearDisplay() {
        super.clearDisplay();
        this.operationString = "";
    }

    toggleSign() {
        var displayBox = document.getElementById("displayBox");
        var displayContents = displayBox.value;
        if (displayContents == "Syntax Error") {
            super.clearDisplay();
        }
        if (displayContents == "0") {
            displayBox.value = "-";
            this.operationString += "-";
        } else {
            displayBox.value = "-" + displayBox.value;
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
        var recreatedOperation = this.inputList.join('');
        document.getElementById("displayBox").value = recreatedOperation;
        for (var key in this.operationMap) {
            recreatedOperation = recreatedOperation.replace(key, this.operationMap[key]);
        }
        this.operationString = recreatedOperation;
    }

    writeMathFunction(data) {
        if (document.getElementById("displayBox").value == "Syntax Error") {
            super.clearDisplay();
        }
        super.writeToDisplay(data);
        this.operationString += this.operationMap[data];
        this.inputList.push(data);
    }

    calculateFactorial() {
        var number = parseInt(this.operationString.split(/[^0-9]/).filter(Boolean)[0]);
        var result = 0;
        try {
            result = this.calculateRecursiveFactorial(number);
        } catch(err) {
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
        var number = parseInt(this.operationString.split(/[^0-9]/).filter(Boolean)[0]);
        this.clearDisplay();
        document.getElementById("displayBox").value = Math.pow(10, number);
    }

    square() {
        var number = parseInt(this.operationString.split(/[^0-9]/).filter(Boolean)[0]);
        this.clearDisplay();
        document.getElementById("displayBox").value = Math.pow(number, 2);
    }

    cube() {
        var number = parseInt(this.operationString.split(/[^0-9]/).filter(Boolean)[0]);
        this.clearDisplay();
        document.getElementById("displayBox").value = Math.pow(number, 3);
    }

    inverseNumber() {
        var number = parseInt(this.operationString.split(/[^0-9]/).filter(Boolean)[0]);
        this.clearDisplay();
        document.getElementById("displayBox").value = Math.pow(number, -1);
    }
}

const calculadora = new CalculadoraCientifica();

