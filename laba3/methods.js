function calc(fun, a, b, accuracy, method) {
    function f() {
        let I = 0
        let h = (b - a) / k
        switch (method) {
            case "left":
                for (let i = a; i <= b - h; i += h)
                    I += fun(i)
                break
            case "right":
                for (let i = a + h; i <= b; i += h)
                    I += fun(i)
                break
            case "middle":
                for (let i = a + h / 2; i < b; i += h)
                    I += fun(i)
                break
            case "trapezoid":
                for (let i = 1; i < Math.abs(b - a) / h; i += 1)
                    I += fun(a + i * h)
                I += (fun(a) + fun(b)) / 2
                break
            case "Simpson":
                for (let i = 1; i <= Math.abs(b - a) / h - 1; i += 1)
                    I += fun(a + i * h) * (i % 2 ? 4 : 2)
                I += fun(a) + fun(b)
                I /= 3
                break
        }
        return I * h
    }
    let k = 4
    let Ik, Ik1
    Ik = f()
    Ik1 = Ik
    do {
        Ik = Ik1
        k *= 2
        Ik1 = f()
    } while (Math.abs(Ik - Ik1) >= accuracy)
    return {res: Ik1, intervals: k}
}