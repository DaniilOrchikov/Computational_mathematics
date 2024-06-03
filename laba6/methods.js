function Euler_step(x0, y0, b, h) {
    let xi = x0
    let yi = y0
    let res = []
    res.push([xi, yi])
    for (let i = 0; i < Math.floor((b - x0) / h); i++) {
        yi = yi + h * f(xi, yi)
        xi += h
        res.push([xi, yi])
    }
    return res
}

function Euler(x0, y0, b, epsilon) {
    let v = 0
    let current_h = h
    let first_step = Euler_step(x0, y0, b, current_h)
    current_h /= 2
    let second_step = Euler_step(x0, y0, b, current_h)
    while (Math.abs(first_step[first_step.length - 1][1] - second_step[second_step.length - 1][1]) / (2 - 1) > epsilon && v < 10) {
        first_step = second_step
        current_h /= 2
        second_step = Euler_step(x0, y0, b, current_h)
        v ++
    }
    console.log("Эйлер: " + current_h)
    return second_step
}

function Runge_Kutta_step(x0, y0, b, h) {
    let xi = x0
    let yi = y0
    let res = []
    res.push([xi, yi])
    for (let i = 0; i < Math.floor((b - x0) / h + 0.1); i++) {
        let k1 = h * f(xi, yi)
        let k2 = h * f(xi + h / 2, yi + k1 / 2)
        let k3 = h * f(xi + h / 2, yi + k2 / 2)
        let k4 = h * f(xi + h, yi + k3)
        yi = yi + 1 / 6 * (k1 + 2 * k2 + 2 * k3 + k4)
        xi += h
        res.push([xi, yi])
    }
    return res
}

function Runge_Kutta(x0, y0, b, epsilon){
    let v = 0
    let current_h = h
    let first_step = Runge_Kutta_step(x0, y0, b, current_h)
    current_h /= 2
    let second_step = Runge_Kutta_step(x0, y0, b, current_h)
    while (Math.abs(first_step[first_step.length - 1][1] - second_step[second_step.length - 1][1]) / (2 ** 4 - 1) > epsilon && v < 10) {
        first_step = second_step
        current_h /= 2
        second_step = Runge_Kutta_step(x0, y0, b, current_h)
        v ++
    }
    console.log("Рунге-Кутт: " + current_h)
    return second_step
}


function Milne_step(x0, y0, b, epsilon, h) {
    let res = Runge_Kutta_step(x0, y0, x0 + h * 4, h).slice(0, 4)
    let xi = x0 + h * 4
    for (let i = 3; i < Math.floor((b - x0) / h); i++) {
        let yi_p = res[i - 3][1] + 4 * h / 3 * (2 * f(res[i - 2][0], res[i - 2][1]) - f(res[i - 1][0], res[i - 1][1]) + 2 * f(res[i][0], res[i][1]))
        let yi_c = res[i - 1][1] + h / 3 * (f(res[i - 1][0], res[i - 1][1]) + 4 * f(res[i][0], res[i][1]) + f(xi, yi_p))
        while (Math.abs(yi_p - yi_c) > epsilon) {
            yi_p = yi_c
            yi_c = res[i - 1][1] + h / 3 * (f(res[i - 1][0], res[i - 1][1]) + 4 * f(res[i][0], res[i][1]) + f(xi, yi_p))
        }
        res.push([xi, yi_c])
        xi += h
    }
    return res
}
function Milne(x0, y0, b, epsilon){
    let v = 0
    let current_h = h
    let first_step = Milne_step(x0, y0, b,epsilon, current_h)
    current_h /= 2
    let second_step = Milne_step(x0, y0, b,epsilon, current_h)
    while (Math.max.apply(null, first_step.map((x,i)=>{Math.abs(x - second_step[i])})) > epsilon && v < 10) {
        first_step = second_step
        current_h /= 2
        second_step = Milne_step(x0, y0, b,epsilon, current_h)
        v++
    }
    console.log("Милн: " + current_h)
    return second_step
}