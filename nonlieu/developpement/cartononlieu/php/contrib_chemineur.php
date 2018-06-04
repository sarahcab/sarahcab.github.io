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
	$lsvar = "";
	$lsvals = "";
	
///Récupération des variables provenant du formaulaire
	$datavar = $_POST['lsvar'];
	$dataval = $_POST['dataok'];
	$chem_exist = $_POST['chem_exist'];
	
	echo $verouill;
	
	foreach ($datavar as $v){
		if($lsvar==""){
			$lsvar = $v;
		} else {
			$lsvar = $lsvar.",".$v;
		}
		
	};
	foreach ($dataval as $v){
		if($lsvals==""){
			$lsvals=$v;
		}else{
			$lsvals = $lsvals.",".$v;
		}
	};
	
	// $indX = array_search("X",$datavar);
	// $indY = array_search("Y",$datavar);
	
	// $X=$dataval[$indX];
	// $Y=$dataval[$indY];
	
	$inter = $db->prepare("select max(gid) from chemineur");
	$inter->execute();
	$res_inter = $inter->fetch();
	$nb = $res_inter[0]+1;
	
	$sql = "insert into chemineur (".$lsvar.",gid) values (".$lsvals.",".$nb.")";
	// echo $sql;
	$reponse = $db->prepare($sql);
	
//Tests : 
	$done = true;
	$reponse->execute()
	or die(
		print_r($reponse->errorInfo())
	);
	echo $nb;
	// echo "<p> blop";
	// system('C://Python27/pythonw.exe ..//python//add_one_cheminee.py '.$nb.' '.$site_exist, $blop);
	
	// echo $blop ;
	// echo "</p>";
	
	// echo "<p> blap";
	// system('C://Python27/pythonw.exe ..//python//create_table_site.py', $blap);
	// echo $blap ;
	// echo "</p>";
	
	
	// while ($v = $vava){
		// echo $v;
	// };
	
	
	$reponse->closeCursor();	
?>
