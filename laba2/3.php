<?php

$x0 = 3.55;

while (true) {
    $x1 = -0.051 * pow($x0, 3) + 0.16 * pow($x0, 2) + 1.179 * $x0 - 0.125;
    echo round($x0, 3) . " " . round($x1, 3) . " " . round((pow($x1,3) - 3.125 * pow($x1, 2) - 3.5 * $x1 + 2.458), 3) . " " . round(abs($x0 - $x1), 3) . PHP_EOL;
    if (abs($x0 - $x1) < 0.01) break;
    $x0 = $x1;
}