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
	
	foreach ($datavar as $v){
		if($lsvar==""){
			$lsvar = $v;
		} else {
			$lsvar = $lsvar.",".$v;
		}
	};

//////////////////requête principale
	$sql = "select ".$lsvar.",x,y,st_astext(geom) from communes where st_intersects(ST_GeomFromText('POLYGON((".floatval($ymin)." ".floatval($xmin).",".floatval($ymax)." ".floatval($xmin).",".floatval($ymax)." ".floatval($xmax).",".floatval($ymin)." ".floatval($xmax).",".floatval($ymin)." ".floatval($xmin)."))','4326'),geom)";
	$reponse = $db->prepare($sql); 

	$reponse->execute()
	or die(print_r($reponse->errorInfo()));
	$tab = array();				
	while($data = $reponse->fetch()){
			$geom = $data['st_astext'];
			$type= explode("(",$geom)[0];
			$coords_sql = explode(")",(explode("(",$geom)[3]))[0];
			$coords_json = [];
			foreach(explode(",",$coords_sql) as $point_sql) {
				$point_json = [floatval(explode(" ",$point_sql)[0]),floatval(explode(" ",$point_sql)[1])];
				array_push($coords_json, $point_json);
			}
			$coords_json2 = [[$coords_json]];
			
			$properties = array();
			foreach ($datavar as $v){
				$properties[strtolower($v)] =$data[strtolower($v)];				
			}
			$properties['x']=$data['x'];
			$properties['y']=$data['y'];
			$tab[] = array('type' => 'Feature',
				'geometry' => array('type' => 'MultiPolygon', 'coordinates' => $coords_json2),
				'properties' => $properties
			);	
	};		
	echo json_encode($tab);
	$reponse->closeCursor();	
?>
