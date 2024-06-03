function Lagrange(x) {
    let Ln = 0
    let q = []
    for (let i = 0; i < XY.length; i++) {
        let li = XY[i][1]
        q.push(XY[i][1])
        for (let j = 0; j < XY.length; j++)
            if (i !== j) {
                li *= (x - XY[j][0]) / (XY[i][0] - XY[j][0])
                q[q.length - 1] += `(x - ${XY[j][0]}) / (${XY[i][0]} - ${XY[j][0]})`
            }
        Ln += li
    }
    calculator.setExpression({id: 'graph4', latex: q.join("+")})
    return Ln
}

function separated_differences(x) {
    let f = []
    f.push([])
    for (let i = 0; i < XY.length; i++)
        f[0].push(XY[i][1])
    for (let i = 1; i < XY.length; i++) {
        let last = f[f.length - 1]
        let current = []
        for (let k = 0; k < last.length - 1; k++)
            current.push((last[k + 1] - last[k]) / (XY[i + k][0] - XY[k][0]))
        f.push(current)
    }
    let N = f[0][0]
    let q = [getting_rid_of_scientific_notation_no_arr(f[0][0])]
    for (let k = 1; k < f.length; k++) {
        let n = f[k][0]
        q.push(`(${getting_rid_of_scientific_notation_no_arr(f[k][0])})`)
        for (let j = 0; j < k; j++) {
            n *= (x - XY[j][0])
            q[q.length - 1] += `(x-(${XY[j][0]}))`
        }
        N += n
    }
    calculator.setExpression({id: 'graph3', latex: q.join("+")})
    return N
}

function finite_differences(x) {
    let f = []
    f.push([])
    for (let i = 0; i < XY.length; i++)
        f[0].push(XY[i][1])
    for (let i = 1; i < XY.length; i++) {
        let last = f[f.length - 1]
        let current = []
        for (let k = 0; k < last.length - 1; k++)
            current.push((last[k + 1] - last[k]))
        f.push(current)
    }
    {
        let table_h = document.querySelector(`#finite_differences thead`)
        let table_b = document.querySelector(`#finite_differences tbody`)
        let t_h = "<tr><th></th><th>xi</th><th>yi</th>"
        for (let j = 1; j < XY.length; j++)
            t_h += `<th>△${j}yi</th>`
        t_h += "</tr>"
        let t_b = "<tr>"
        for (let i = 0; i < XY.length; i++) {
            t_b += `<td>${i}</td><td>${XY[i][0]}</td>`
            for (let j = 0; j < f[i].length; j++) {
                t_b += `<th>${Math.round(f[j][i] * 10000) / 10000}</th>`
            }
            t_b += "</tr>"
        }
        table_h.innerHTML = t_h
        table_b.innerHTML = t_b
    }

    let mn = Infinity
    let mx = -Infinity
    XY.forEach(xy => {
        mn = Math.min(mn, xy[0])
        mx = Math.max(mx, xy[0])
    })
    let h = XY[1][0] - XY[0][0]
    let Nn = 0
    let Q = []
    if ((mn + mx) / 2 > x) {
        let i = Math.floor((x - mn) / h)
        let t = (x - XY[i][0]) / h
        let t_str = `(x-${getting_rid_of_scientific_notation_no_arr(XY[i][0])})/${h}`
        for (let j = 0; j < f.length - i; j++) {
            let s = f[j][i] / factorial(j)
            let q1 = `${getting_rid_of_scientific_notation_no_arr(f[j][i])}/${getting_rid_of_scientific_notation_no_arr(factorial(j))}`
            for (let q = 0; q < j; q++) {
                s *= (t - q)
                q1 += `*(${t_str} - ${q})`
            }
            Nn += s
            Q.push(q1)
        }
        calculator.setExpression({id: 'graph5', latex: Q.join("+")})
        return [Nn, 1]
    } else {
        let i = Math.floor((x - mn) / h) + 1
        let t = (x - XY[i][0]) / h
        let t_str = `(x-${getting_rid_of_scientific_notation_no_arr(XY[i][0])})/${h}`
        for (let j = 0; j <= i; j++) {
            let s = f[j][i - j] / factorial(j)
            let q1 = `${getting_rid_of_scientific_notation_no_arr(f[j][i-j])}/${getting_rid_of_scientific_notation_no_arr(factorial(j))}`
            for (let q = 0; q < j; q++) {
                s *= (t + q)
                q1 += `*(${t_str} + ${q})`
            }
            Nn += s
            Q.push(q1)
        }
        calculator.setExpression({id: 'graph5', latex: Q.join("+")})
        return [Nn, 2]
    }
}

function getting_rid_of_scientific_notation_no_arr(x) {
    let w = x.toString()
    let parts = w.split('e')
    if (parts.length > 1)
        return `${parts[0]}*10^{${parts[1]}}`
    return `${parts[0]}`
}

function factorial(n) {
    if (n <= 0)
        return 1
    return n * factorial(n - 1)
}