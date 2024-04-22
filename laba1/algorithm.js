function checkDiagonalDominance(matrix) {
    // Смотрим в каждой ли строке есть элемент модуль которого больше суммы модулей остальных элементов в строке
    // Также смотрим возможно ли будет переставить строки так что эти элементы встанут на диагональ
    let f = new Array(n).fill(0);
    for (let i = 0; i < n; i++) {
        let max_value = 0
        let ind = -1
        for (let j = 0; j < n; j++) {
            if (Math.abs(matrix[i][j]) >= max_value) {
                max_value = Math.abs(matrix[i][j])
                ind = j
            }
        }
        if (ind !== -1) f[ind] = true
        if (matrix[i].reduce((partialSum, a) => partialSum + Math.abs(a), 0) - Math.abs(max_value) > Math.abs(max_value)) {
            return false; // выполнение достаточного условия невозможно
        }
    }
    return f.reduce((flag, a) => flag && a) // имеет ли смысл пытаться переставлять строки?
}

function calc() {
    readMatrix()
    let variable_matrix = []
    let variable_right_parts = []
    for (let i = 0; i < n; i++) {
        variable_matrix.push([...matrix[i]])
    }
    variable_right_parts.push(...right_parts)
    // -----
    // Смотрим возможно ли диагональное преобладание и если возможно - добиваемся этого с помощью переставления строк
    // Иначе пытаемся убрать с диагонали все нули так как в противном случае на следующем шаге будет деление на ноль
    if (!checkDiagonalDominance(variable_matrix)) {
        document.getElementById("message").innerHTML = "Достигнуть диагонального преобладания невозможно<br>"
        // -----
        // Пробуем убрать нули с диагонали
        for (let i = 0; i < n; i++) {
            let ind = 0
            for (let j = 0; j < n; j++) {
                if (variable_matrix[i][j] !== 0 && variable_matrix[j][i] !== 0) {
                    ind = j
                    break
                }
            }
            variable_matrix[i] = [variable_matrix[ind], variable_matrix[ind] = variable_matrix[i]][0]
            variable_right_parts[i] = [variable_right_parts[ind], variable_right_parts[ind] = variable_right_parts[i]][0]
        }
        let f = true
        for (let i = 0; i < n; i++)
            if (!variable_matrix[i][i]) f = false
        if (!f) { // Не получилось убрать с диагонали все нули :(
            clear()
            document.getElementById("message").innerHTML += "Система несовместна"
            return
        }
        // -----
    } else {
        // Добиваемся диагонального преобладания переставляя строки
        for (let i = 0; i < n; i++) {
            let max_value = 0
            let ind = -1
            for (let j = 0; j < n; j++) { // Находим индекс максимального элемента в строке
                if (Math.abs(variable_matrix[i][j]) >= max_value) {
                    max_value = Math.abs(variable_matrix[i][j])
                    ind = j
                }
            }
            // переставляем строку так, чтобы максимальный элемент в ней встал на диагональ
            if (ind !== -1) {
                variable_matrix[i] = [variable_matrix[ind], variable_matrix[ind] = variable_matrix[i]][0]
                variable_right_parts[i] = [variable_right_parts[ind], variable_right_parts[ind] = variable_right_parts[i]][0]
            }
            if (ind !== i)
                i = Math.min(i, ind) - 1
        }
    }
    // -----
    // Рисуем матрицу с переставленными строками
    let m = ""
    for (let i = 0; i < n; i++) {
        m += "<div class='row'>"
        for (let j = 0; j < n; j++) {
            m += `<input type='number' class='cell' value='${variable_matrix[i][j]}' readonly>`
        }
        m += `<input type='number' class='cell right_part' value='${variable_right_parts[i]}' readonly></div>`
    }
    document.getElementById("new_matrix").innerHTML = m
    // -----
    // Выражаем неизвестные x1, x2, ..., xn (делим строку на элемент на диагонали)
    for (let i = 0; i < n; i++) {
        let mid = variable_matrix[i][i]
        for (let j = 0; j < n; j++) {
            variable_matrix[i][j] /= -mid
        }
        variable_matrix[i][i] = 0
        variable_right_parts[i] /= mid
    }
    // -----
    // Итерационно вычисляем значения
    let x_n = []
    document.getElementById("init_approx").querySelectorAll("*").forEach(input => {
        x_n.push(parseInt(input.value, 10)) // считываем начальные аппроксимации
    })
    let x_n1 = new Array(n)

    let v = 0
    while (true) {
        v += 1
        for (let i = 0; i < n; i++) {
            let a = 0
            for (let j = 0; j < n; j++) {
                a += variable_matrix[i][j] * x_n[j]
            }
            a += variable_right_parts[i]
            x_n1[i] = a
        }
        let max_deviation = 0
        for (let i = 0; i < n; i++) { // вычисляем максимальную погрешность
            if (Math.abs(x_n[i] - x_n1[i]) > max_deviation)
                max_deviation = Math.abs(x_n[i] - x_n1[i])
        }
        if (max_deviation < document.getElementById("accuracy").value) // если достигнута нужная точность - выходим из цикла
            break
        document.getElementById("answer").innerHTML = ""
        if (v >= document.getElementById("maximum_number_of_iterations").value) { // если достигнуто максимально количество итераций - выходим из цикла
            document.getElementById("answer").innerHTML = "Не удалось достигнуть требуемой точности за отведенное количество итераций<br>"
            break
        }
        x_n = [...x_n1]
        console.log(x_n)
        x_n1 = new Array(n)
    }
    // -----
    printAnswer(x_n, x_n1, v)
}