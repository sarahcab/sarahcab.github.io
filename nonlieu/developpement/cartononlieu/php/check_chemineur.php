<?php
///Connexion
	try {
		$db = new PDO('pgsql:host=localhost; dbname = postgis_24_sample;port = 5433',
		'postgres', 'postgres');
	}
	catch(PDOException $e){
		die ('Erreur : '.$e->getMessage());
	};
///Création des variables que l'on va incrémenter
	// $lsvar = "";
	// $lsvals = "";
	
///Récupération des variables provenant du formaulaire
	$identifiant = $_POST['identifiant'];
	
	// $indX = array_search("X",$datavar);
	// $indY = array_search("Y",$datavar);
	
	// $X=$dataval[$indX];
	// $Y=$dataval[$indY];
	
	$inter = $db->prepare("select count(*) from chemineur where identi like ".$identifiant);
	$inter->execute()
	or die(print_r($inter->errorInfo()));

	while($i = $inter->fetch()){
		$test = $i[0]; //c'est un array avec le count donc faut mettre 0
		echo $i[0];
	}
	$inter->closeCursor();	
?>