<?php
////////////////////Connexion
	try {
		$db = new PDO('pgsql:host=localhost; dbname = postgis_24_sample;port = 5433',
		'postgres', 'postgres');
	}
	catch(PDOException $e){
		die ('Erreur : '.$e->getMessage());
	};

////////////////////Récupération des variables provenant du formaulaire
	$datavar = $_POST['lsvar'];
	$dataval = $_POST['dataok'];
	$X = $_POST['X'];
	$Y = $_POST['Y'];
	$site_exist = $_POST['site_exist'];
	$identifiant = $_POST['identifiant'];
	$identi_sql=$_POST['identi_sql'];
	$verrouillage=$_POST['verrouillage'];
	echo "verrouillage";
	echo $verrouillage;
	echo "--";

////////////////////Création des variables que l'on va incrémenter
	$lsvar = "";
	$lsvals = "";
	
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
	$dateaj="'".date('l')." ".date('j')." ".date('F')." ".date('Y')."'";
	
////////////////////requête intermédiarei
	$inter = $db->prepare("select max(gid) from cheminee2");
	$inter->execute();
	$res_inter = $inter->fetch();
	$nb = $res_inter[0]+1;
	
////////////////////requête principale
	$sql = "insert into cheminee2 (".$lsvar.",dateaj,gid,auteur,verr,x,y,geom) values (".$lsvals.",".$dateaj.",".$nb.",".$identi_sql.",".$verrouillage.",".$X.",".$Y.",st_geomfromtext('POINT(".$X." ".$Y.")',4326))";
	echo $sql;
	$reponse = $db->prepare($sql);
	$reponse->execute()
	or die(
		print_r($reponse->errorInfo())
	);
	
////////////////////PYTHON : 
	echo "<p> blop";
	system('C://Python27/pythonw.exe ..//python//add_one_cheminee.py '.$nb.' '.$site_exist.' '.$identifiant, $blop);
	
	echo $blop ;
	echo "</p>";
	
	echo "<p> blap";
	system('C://Python27/pythonw.exe ..//python//create_table_site.py', $blap);
	echo $blap ;
	echo "</p>";
	
	$reponse->closeCursor();	
?>
