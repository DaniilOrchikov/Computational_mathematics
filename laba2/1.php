<?php

$x0 = -2.4;

while (true) {
    $f = (pow($x0,3) - 3.125 * pow($x0, 2) - 3.5 * $x0 + 2.458);
    $pf = (3 * pow($x0, 2) - 3.125 * 2 * $x0 - 3.5);
    $xi = $x0 - $f / $pf;
    echo round($x0, 3) . " " . round($f, 3) . " " . round($pf, 3) . " " . round($xi, 3) . " " . round(abs($x0 - $xi), 3) . PHP_EOL;
    if (abs($x0 - $xi) < 0.01) {
        break;
    }
    $x0 = $xi;
}