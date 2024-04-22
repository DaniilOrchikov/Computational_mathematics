function chordMethod(a, b, accuracy) {
    function runA() {
        let v = 1
        document.getElementById("res").innerHTML = "<tr><th>№ Шага</th><th>a</th><th>b</th><th>x</th><th>f(a)</th><th>f(b)</th><th>f(x)</th><th>|x_k - x_{k+1}|</th></tr>"
        let x0 = a
        while (true) {
            let fx0 = f["function"](x0)
            let fb = f["function"](b)
            x = x0 - (b - x0) / (fb - fx0) * fx0
            let fx = f["function"](x)
            document.getElementById("res").innerHTML += `<tr><td>${v}</td><td>${x0}</td><td>${b}</td><td>${x}</td><td>${fx0}</td><td>${fb}</td><td>${fx}</td><td>${Math.abs(x0 - x)}</td></tr>`
            if (Math.abs(x0 - x) < accuracy && Math.abs(fx) < accuracy) return
            v++
            x0 = x
            if (v > 100) {
                document.getElementById("res").innerHTML = ""
                document.getElementById("info").innerHTML = "<br>На данном интервале метод хорд не может получить решение"
                return
            }
        }
    }

    function runB() {
        let v = 1
        document.getElementById("res").innerHTML = "<tr><th>№ Шага</th><th>a</th><th>b</th><th>x</th><th>f(a)</th><th>f(b)</th><th>f(x)</th><th>|x_k - x_{k+1}|</th></tr>"
        let x0 = b
        while (true) {
            let fx0 = f["function"](x0)
            let fa = f["function"](a)
            x = x0 - (a - x0) / (fa - fx0) * fx0
            let fx = f["function"](x)
            document.getElementById("res").innerHTML += `<tr><td>${v}</td><td>${a}</td><td>${x0}</td><td>${x}</td><td>${fa}</td><td>${fx0}</td><td>${fx}</td><td>${Math.abs(x0 - x)}</td></tr>`
            if (Math.abs(x0 - x) < accuracy && Math.abs(fx) < accuracy) return
            v++
            x0 = x
            if (v > 100) {
                document.getElementById("res").innerHTML = ""
                document.getElementById("info").innerHTML = "<br>На данном интервале метод хорд не может получить решение"
                return
            }
        }
    }

    if (root(a, b, f["derivative"]) || root(a, b, f["derivative2"])) {
        alert("На заданном интервале применение метода может дать некорректный результат")
    }
    let x
    if (f["derivative"]((a + b) / 2) * f["derivative2"]((a + b) / 2) > 0) {
        runA()
    }
    if (f["derivative"]((a + b) / 2) * f["derivative2"]((a + b) / 2) <= 0 || a > x || b < x) {
        runB()
    }
    if (a > x || b < x) {
        runA()
    }
    console.log(123)
}

function newtonMethod(a, b, accuracy) {
    document.getElementById("res").innerHTML = "<tr><th>№ Шага</th><th>x_k</th><th>f(x_k)</th><th>f'(x_k)</th><th>x_{k+1}</th><th>|x_k - x_{k+1}|</th></tr>"

    function run() {
        let v = 1
        while (true) {
            let fx0 = f["function"](x0)
            let dfx0 = f["derivative"](x0)
            x = x0 - fx0 / dfx0
            document.getElementById("res").innerHTML += `<tr><td>${v}</td><td>${x0}</td><td>${fx0}</td><td>${dfx0}</td><td>${x}</td><td>${Math.abs(x0 - x)}</td></tr>`
            if (Math.abs(x0 - x) < accuracy) return
            v++
            x0 = x
            if (v > 100) {
                document.getElementById("res").innerHTML = ""
                document.getElementById("info").innerHTML = "<br>На данном интервале метод Ньютона не может получить решение"
                return
            }
        }
    }

    if (root(a, b, f["derivative2"])) {
        alert("На заданном интервале применение метода Ньютона может дать некорректный результат")
    }
    let x0, x
    if (f["function"](a) * f["derivative2"](a)) {
        x0 = a
    } else x0 = b
    run()
    if (a > x || b < x) {
        document.getElementById("res").innerHTML = "<tr><th>№ Шага</th><th>x_k</th><th>f(x_k)</th><th>f'(x_k)</th><th>x_{k+1}</th><th>|x_k - x_{k+1}|</th></tr>"
        if (f["function"](a) * f["derivative2"](a)) {
            x0 = b
        } else x0 = a
        run()
    }
}

function simpleIterationMethod(a, b, accuracy) {
    document.getElementById("res").innerHTML = "<tr><th>№ Шага</th><th>x_i</th><th>x_{i+1}</th><th>phi(x_{i + 1})</th><th>f(x_{k+1})</th><th>|x_k - x_{k+1}|</th></tr>"

    function run() {
        let v = 1
        let x0 = a
        while (true) {
            x = x0 + lambda * (f["function"](x0))
            document.getElementById("res").innerHTML += `<tr><td>${v}</td><td>${x0}</td><td>${x}</td><td>${x0 + lambda * (f["function"](x))}</td><td>${f["function"](x)}</td><td>${Math.abs(x0 - x)}</td></tr>`
            if (Math.abs(x0 - x) < accuracy) return
            v++
            x0 = x
            if (v > 100) {
                document.getElementById("info").innerHTML += "<br>Не удалось добиться нужной точности за вменяемое количество итераций. "
                return
            }
        }
    }

    if (root(a, b, f["derivative"])) {
        alert("На заданном интервале применение метода простых итераций может дать некорректный результат")
    }
    let mx = Number.MIN_VALUE
    let mxi = 0;
    for (let i = a; i <= b; i += Math.abs(a - b) / 100)
        if (mx < Math.abs(f["derivative"](i))) {
            mx = Math.abs(f["derivative"](i))
            mxi = i;
        }
    if (mx < Math.abs(f["derivative"](b))){
        mx = Math.abs(f["derivative"](b))
        mxi = b;
    }
    let lambda = 1 / mx
    lambda *= f["derivative"](mxi) > 0 || f["derivative"](a) > 0 || f["derivative"](b) > 0 ? -1 : 1
    document.getElementById("info").innerHTML = "Достаточное условие" + (Math.abs(lambda * f["derivative"](mxi) + 1) < 1 && Math.abs(lambda * f["derivative"](a) + 1) < 1 && Math.abs(lambda * f["derivative"](b) + 1) < 1 ? " " : " не ") + "выполняется " + "fi'(a)=" + (lambda * f["derivative"](a) + 1) + "; fi'(a)=" + (lambda * f["derivative"](b) + 1) + "; lambda=" + lambda + "; mx=" + mxi
    console.log(lambda * f["derivative"](mx) + 1)
    let x
    run()
    if (a > x || b < x) {
        document.getElementById("res").innerHTML = "<tr><th>№ Шага</th><th>x_i</th><th>x_{i+1}</th><th>phi(x_{i + 1})</th><th>f(x_{k+1})</th><th>|x_k - x_{k+1}|</th></tr>"
        lambda *= -1
        console.log(lambda * f["derivative"](mx) + 1)
        document.getElementById("info").innerHTML = "Достаточное условие" + (Math.abs(lambda * f["derivative"](mxi) + 1) < 1 && Math.abs(lambda * f["derivative"](a) + 1) < 1 && Math.abs(lambda * f["derivative"](b) + 1) < 1 ? " " : " не ") + "выполняется " + "fi'(a)=" + (lambda * f["derivative"](a) + 1) + "; fi'(a)=" + (lambda * f["derivative"](b) + 1) + "; lambda=" + lambda + "; mx=" + mxi
        run()
    }
}

function root(a, b, func) {
    const step = Math.abs(b - a) / 100;
    let previousSign = Math.sign(func(a));
    let currentSign;

    for (let x = a; x <= b; x += step) {
        currentSign = Math.sign(func(x));
        if (currentSign !== previousSign || currentSign === 0) {
            return x;
        }
        previousSign = currentSign;
    }

    return 0;
}

function hasMoreThat1Root(a, b) {
    a = root(a, b, f["function"])
    return root(a, b, f["function"])
}

function systemNewtonMethod(x0, y0, accuracy) {
    document.getElementById("info").innerHTML = ""
    document.getElementById("check").innerHTML = ""
    document.getElementById("res").innerHTML = "<tr><th>№ Шага</th><th>x_i</th><th>yi</th><th>|x_k - x_{k+1}|</th><th>|y_k - y_{k+1}|</th></tr>"

    let v = 1
    let x, y
    while (true) {
        let a11 = f["derivative1X"](x0, y0)
        let a12 = f["derivative1Y"](x0, y0)
        let a21 = f["derivative2X"](x0, y0)
        let a22 = f["derivative2Y"](x0, y0)
        let b1 = -f["function1"](x0, y0)
        let b2 = -f["function2"](x0, y0)
        let d = a11 * a22 - a12 * a21
        if (Math.abs(d) < Number.EPSILON) {
            document.getElementById("res").innerHTML = ""
            document.getElementById("info").innerHTML = "Определитель матрицы равен нулю"
            return
        }
        if (d === 0) break
        let d1 = b1 * a22 - b2 * a12
        let d2 = a11 * b2 - a21 * b1
        let dx = d1 / d
        let dy = d2 / d
        console.log(dx, dy)
        x = x0 + dx
        y = y0 + dy
        document.getElementById("res").innerHTML += `<tr><td>${v}</td><td>${x}</td><td>${y}</td><td>${Math.abs(dx)}</td><td>${Math.abs(dy)}</td></tr>`
        if (Math.abs(dx) <= accuracy && Math.abs(dy) <= accuracy) {
            break
        }
        x0 = x
        y0 = y
        v++
        if (v > 300) {
            document.getElementById("info").innerHTML += "<br>Не удалось добиться нужной точности за вменяемое количество итераций."
            return
        }
    }
    document.getElementById("check").innerHTML = `f1(${x}, ${y}) = ${f["function1"](x, y)} ≈ ${Math.round(f["function1"](x, y))}`
    document.getElementById("check").innerHTML += `<br>f2(${x}, ${y}) = ${f["function2"](x, y)} ≈ ${Math.round(f["function2"](x, y))}`
}