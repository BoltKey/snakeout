
<!doctype html>

<html lang='en'>
<head>
	<meta charset="utf-8">
	<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>
	<link rel='stylesheet' type='text/css' href='style.css'>
	<title>Snake-out</title>
	<meta name="description" content="A warm up project for upcoming Ludum Dare 41 jam">
	<meta name="author" content="BoltKey">
	<?php 
	foreach (glob("game/*.js") as $filename)
	{
		echo '<script type="text/javascript" src='.$filename.'></script>
	';
	} 
	?>
	</head>

<body>
	<div id='main'>
		<canvas id="game" width=540 height=440 style="background:#dddddd"></canvas>
	</div>
</body>
</html>