<?php

$a = 0;
$b = 1;

while (true) {
    $x0 = ($a + $b) / 2;
    $fa = (pow($a, 3) - 3.125 * pow($a, 2) - 3.5 * $a + 2.458);
    $fx0 = (pow($x0, 3) - 3.125 * pow($x0, 2) - 3.5 * $x0 + 2.458);
    $fb = (pow($b, 3) - 3.125 * pow($b, 2) - 3.5 * $b + 2.458);
    echo round($a, 3) . "\t" . round($b, 3) . "\t" . round($x0, 3) . "\t" . round($fa, 3) . "\t" . round($fb, 3) . "\t" . round($fx0, 3) . "\t" . round(abs($a - $b), 3) . "\n";
    if (abs($a - $b) < 0.01) break;
    if ($fa / abs($fa) != $fx0 / abs($fx0)) $b = $x0;
    else $a = $x0;
}