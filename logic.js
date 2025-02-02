import * as math from 'mathjs';

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
        return this.evaluateMath(expression);
    }

evaluateMath(expression) {
  let result;
  try {
    result = math.evaluate(expression);
  } catch (e) {
    throw new Error("Invalid expression");
  }
  return result;
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
    let escapedKey = this.escapeRegExp(key);
    // Definir la expresión regular directamente dentro del replace
    safeExpression = safeExpression.replace(/\d+/g, this.operationMap[key]);
  }

  try {
    return this.simpleEvaluate(safeExpression);
  } catch (e) {
    throw new Error("Invalid expression");
  }
}
            
safeExpression = safeExpression.replace(regex, this.operationMap[key]);
const operation = this.operationMap[key];
if (operation) {
  safeExpression = safeExpression.replace(regex, operation);
} else {
  console.error("Unknown function: " + key);
}
        try {
            return this.simpleEvaluate(safeExpression);
        } catch (e) {
            throw new Error("Invalid expression");
        }
    }
function escapeRegExp(string) {
  if (typeof string !== 'string') {
    throw new TypeError('Expected a string');
}
   simpleEvaluate(expression) {
        // Evaluar expresión matemática simple sin usar `eval`
        return this.evaluateMath(expression);
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

  // Validar la entrada de datos (ejemplo usando una lista permitida)
  const allowedFunctions = ["sin", "cos", "tan", "log", "exp", "+" ,"-", "*", "/"];
  if (!allowedFunctions.includes(data)) {
    console.error("Función no permitida: " + data);
    return;
  }

  // Usar mathjs para la operación matemática
  try {
    const result = math.evaluate(this.operationString + data);
    this.operationString += data;
    this.inputList.push(data);
    document.getElementById("displayBox").value = result;
  } catch (err) {
    console.error("Error en la operación matemática: " + err);
  }
}

calculateFactorial() {
    let number = parseInt(this.operationString.match(/\d+/), 10);
    let result = 0;
    let operation;

    // Validación de los valores en this.operationMap
    if (typeof this.operationMap[number] === 'function') {
  operation = this.operationMap[number];
} else {
  console.error("Función desconocida: " + number);
  return;
}

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
        let number = parseInt(this.operationString.match(/\d+/), 10);
        this.clearDisplay();
        document.getElementById("displayBox").value = Math.pow(10, number);
    }

    square() {
        let number = parseInt(this.operationString.match(/\d+/), 10);
        this.clearDisplay();
        document.getElementById("displayBox").value = Math.pow(number, 2);
    }

    cube() {
        let number = parseInt(this.operationString.match(/\d+/), 10);
        this.clearDisplay();
        document.getElementById("displayBox").value = Math.pow(number, 3);
    }

    inverseNumber() {
        let number = parseInt(this.operationString.match(/\d+/), 10);
        this.clearDisplay();
        document.getElementById("displayBox").value = Math.pow(number, -1);
    }
}
