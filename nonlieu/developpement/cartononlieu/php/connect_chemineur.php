<?php
///Connexion
	try {
		$db = new PDO('pgsql:host=localhost; dbname = postgis_24_sample;port = 5433',
		'postgres', 'postgres');
	}
	catch(PDOException $e){
		die ('Erreur : '.$e->getMessage());
	};
	
///Variables
	$identi = "'".$_POST['identi']."'";
	$mdp = $_POST['mdp'];

	$inter = $db->prepare("select count(*) from chemineur where identi like ".$identi);
	$inter->execute()
	or die(print_r($inter->errorInfo()));

	while($i = $inter->fetch()){
		$test = $i[0]; //c'est un array avec le count donc faut mettre 0
	}
	if($test==0){
		echo "L'identifiant n'existe pas";
		
	}else{
		echo "Identifiant ok";
		$inter = $db->prepare("select mdp from chemineur where identi like ".$identi);
		$inter->execute()
		or die(print_r($inter->errorInfo()));
		$mdp_ok = $inter->fetch()[0]; //c'est un array avec le count donc faut mettre 0
		echo $mdp;
		echo $mdp_ok;
		if($mdp==$mdp_ok){
			echo "valide";
		} else {
			echo "Mot de passe incorrect";
		}
	};
	//echo "Mot de passe incorrect"
	//echo "Identifiant déjà pris"
	//echo "Ok"
	
	$inter->closeCursor();	
?>