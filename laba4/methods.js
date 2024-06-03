function polynomial(m) {
    m += 1
    let A = create2DArray(m, m)
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < m; j++) {
            let s = 0
            XY.forEach(x => s += x[0] ** (i + j))
            A[i][j] = s
        }
    }
    A[0][0] = n
    let B = Array(m)
    for (let i = 0; i < m; i++) {
        let s = 0
        XY.forEach(x => s += x[0] ** i * x[1])
        B[i] = s
    }
    let coeffs = solveLinearSystem(A, B);
    let w = getting_rid_of_scientific_notation(coeffs)

    let latex_fun = []
    for (let i = 0; i < m; i++) {
        latex_fun.push(w[i] + "*x^" + i)
    }
    latex_fun = latex_fun.join("+")
    calculator.setExpression({id: 'graph' + m, latex: `f_{${m - 1}}=` + latex_fun})
    let S = 0
    latex_fun = latex_fun.replaceAll("^", "**").replaceAll("{", "(").replaceAll("}", ")")
    XY.forEach(x => S += (eval(latex_fun.replaceAll("x", `(${x[0]})`)) - x[1]) ** 2)
    document.getElementById("res").innerHTML += `S_${m - 1} = ${Math.round(S * 10000) / 10000}<br>`
    draw_table(m - 1, latex_fun)
    return [coeffs, S]
}

function exponential() {
    let sx = 0, sxx = 0, sy = 0, sxy = 0
    XY.forEach(x => {
        sx += x[0]
        sxx += x[0] ** 2
        sy += Math.log(x[1])
        sxy += x[0] * Math.log(x[1])
    })
    let A = [
        [n, sx],
        [sx, sxx]
    ]
    let B = [sy, sxy]
    let coeffs = solveLinearSystem(A, B)
    coeffs[0] = Math.exp(coeffs[0])
    let w = getting_rid_of_scientific_notation(coeffs)
    calculator.setExpression({id: 'graph6', latex: `f_e=${w[0]}*e^{${w[1]}x}`})
    let latex_fun = `${w[0]}*Math.E ** (${w[1]}*x)`.replaceAll("{", "(").replaceAll("}", ")")
    let S = 0
    XY.forEach(x => S += (eval(latex_fun.replaceAll("x", `(${x[0]})`)) - x[1]) ** 2)
    if (isNaN(S))
        document.getElementById("res").innerHTML += `S_e - невозможно аппроксимировать с помощью экспоненциальной функции<br>`
    else
        document.getElementById("res").innerHTML += `S_e = ${Math.round(S * 10000) / 10000}<br>`
    draw_table("e", latex_fun)
    return [coeffs, S]
}

function logarithmic() {
    let sx = 0, sxx = 0, sy = 0, sxy = 0
    XY.forEach(x => {
        sx += Math.log(x[0])
        sxx += Math.log(x[0]) ** 2
        sy += x[1]
        sxy += Math.log(x[0]) * x[1]
    })
    let A = [
        [n, sx],
        [sx, sxx]
    ]
    let B = [sy, sxy]
    let coeffs = solveLinearSystem(A, B)
    let w = getting_rid_of_scientific_notation(coeffs)
    calculator.setExpression({id: 'graph7', latex: `f_{log}=${w[1]}*\\ln{x}+${w[0]}`})
    let latex_fun = `${w[1]}*Math.log(x) + ${w[0]}`.replaceAll("{", "(").replaceAll("}", ")")
    let S = 0
    XY.forEach(x => S += (eval(latex_fun.replaceAll("x", `(${x[0]})`)) - x[1]) ** 2)
    if (isNaN(S))
        document.getElementById("res").innerHTML += `S_log - невозможно аппроксимировать с помощью логарифмической функции<br>`
    else
        document.getElementById("res").innerHTML += `S_log = ${Math.round(S * 10000) / 10000}<br>`
    draw_table("log", latex_fun)
    return [coeffs, S]
}

function power() {
    let sx = 0, sxx = 0, sy = 0, sxy = 0
    XY.forEach(x => {
        sx += Math.log(x[0])
        sxx += Math.log(x[0]) ** 2
        sy += Math.log(x[1])
        sxy += Math.log(x[0]) * Math.log(x[1])
    })
    let A = [
        [n, sx],
        [sx, sxx]
    ]
    let B = [sy, sxy]
    let coeffs = solveLinearSystem(A, B)
    coeffs[0] = Math.exp(coeffs[0])
    let w = getting_rid_of_scientific_notation(coeffs)
    calculator.setExpression({id: 'graph8', latex: `f_{power}=${w[0]}*x^{${w[1]}}`})
    let latex_fun = `${w[0]}*x**(${w[1]})`.replaceAll("{", "(").replaceAll("}", ")")
    let S = 0
    XY.forEach(x => S += (eval(latex_fun.replaceAll("x", `(${x[0]})`)) - x[1]) ** 2)
    if (isNaN(S))
        document.getElementById("res").innerHTML += `S_power - невозможно аппроксимировать с помощью степенной функции<br>`
    else
        document.getElementById("res").innerHTML += `S_power = ${Math.round(S * 10000) / 10000}<br>`
    draw_table("power", latex_fun)
    return [coeffs, S]
}


// Решение системы линейных уравнений Ax = B методом Гаусса
function solveLinearSystem(A, B) {
    let n = A.length;

    for (let i = 0; i < n; i++) {
        // Поиск главного элемента
        let maxEl = Math.abs(A[i][i]);
        let maxRow = i
        for (let k = i + 1; k < n; k++)
            if (Math.abs(A[k][i]) > maxEl) {
                maxEl = Math.abs(A[k][i])
                maxRow = k
            }

        // Меняем местами строки
        for (let k = i; k < n; k++) {
            let tmp = A[maxRow][k]
            A[maxRow][k] = A[i][k]
            A[i][k] = tmp
        }
        let tmp = B[maxRow]
        B[maxRow] = B[i]
        B[i] = tmp

        // Приводим к нижнетреугольной форме
        for (let k = i + 1; k < n; k++) {
            let c = -A[k][i] / A[i][i];
            for (let j = i; j < n; j++) {
                if (i === j)
                    A[k][j] = 0
                else
                    A[k][j] += c * A[i][j]
            }
            B[k] += c * B[i]
        }
    }

    // Обратная подстановка
    let x = new Array(n).fill(0);
    for (let i = n - 1; i >= 0; i--) {
        x[i] = B[i] / A[i][i]
        for (let k = i - 1; k >= 0; k--) {
            B[k] -= A[k][i] * x[i]
        }
    }

    return x;
}


function create2DArray(n, m) {
    let array = new Array(n);

    for (let i = 0; i < n; i++)
        array[i] = new Array(m).fill(0);

    return array;
}
