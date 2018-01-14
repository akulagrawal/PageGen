<?php
$f = fopen($_POST['name'] + ".html", "w");
fwrite($f,$_POST['html'])
fclose($f);
?>
