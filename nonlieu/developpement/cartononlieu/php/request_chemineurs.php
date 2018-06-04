<?php
///Connexion
	try {
		$db = new PDO('pgsql:host=localhost; dbname = postgis_24_sample;port = 5433',
		'postgres', 'postgres');
		// echo "Connexion OK<br/>";
	}
	catch(PDOException $e){
		die ('Erreur : '.$e->getMessage());
	};
	
///Récupération des variables provenant du formaulaire
	$xmin = $_POST['xmin'];
	$xmax = $_POST['xmax'];
	$ymin = $_POST['ymin'];
	$ymax = $_POST['ymax'];
	$datavar = $_POST['lsvar'];
	
///Création des variables que l'on va incrémenter
	$lsvar = "";
	$where_clause = "";
	
	foreach ($datavar as $v){
		if($lsvar==""){
			$lsvar = $v;
		} else {
			$lsvar = $lsvar.",".$v;
		}
	};
	
////////////////////requête intermédiaire : onr echerche les cheminées contenues dans la zone pour après avoir es sites qui lui sont liés : si on prend les centroides des sites, certaines seront à l'extérieur
	$sql0 = "select cheminee2.id from cheminee2 where st_intersects(ST_GeomFromText('POLYGON((".floatval($ymin)." ".floatval($xmin).",".floatval($ymax)." ".floatval($xmin).",".floatval($ymax)." ".floatval($xmax).",".floatval($ymin)." ".floatval($xmax).",".floatval($ymin)." ".floatval($xmin)."))','4326'),geom)";
	$reponse0 = $db->prepare($sql0);
	
	$reponse0->execute()
	or die(print_r($reponse0->errorInfo()));
	
	while($data = $reponse0->fetch()){		
		$id_sit = $data['id'];
		if(strpos($where_clause, $id_sit) == false ){ 
			if($where_clause==""){
				$where_clause = "where cheminees like '%".$id_sit;
			} else {
				$where_clause = $where_clause."%' or cheminees like '%".$id_sit;
			}
		}
	}
	if($where_clause != ""){
		$where_clause=$where_clause."%'";
	}
	
//////////////////requête principale
	$sql = "select ".$lsvar.",st_astext(geom),x,y from chemineur ".$where_clause;
	$reponse = $db->prepare($sql); 

	$reponse->execute()
	or die(print_r($reponse->errorInfo()));
	$tab = array();				
	while($data = $reponse->fetch()){
			$properties = array();
			foreach ($datavar as $v){

				// echo $v;
				
				// $narray = array($v => $data[strtolower ($v)]);
				// $properties = $properties + $narray;
				$properties[strtolower($v)] =$data[strtolower($v)];				
			}
			// $coords = explode(" ",explode(")",explode("(",$data['st_astext'])[1])[0]);
			$tab[] = array('type' => 'Feature',
				'geometry' => array('type' => 'Point', 'coordinates' => [floatval($data['x']), floatval($data['y'])]),
			
				'properties' => $properties
			);	
	};		
	echo json_encode($tab);
	$reponse->closeCursor();	
?>
