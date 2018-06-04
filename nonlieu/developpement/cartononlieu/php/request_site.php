﻿<?php
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
	$sql0 = "select id from cheminee2 where st_intersects(ST_GeomFromText('POLYGON((".floatval($ymin)." ".floatval($xmin).",".floatval($ymax)." ".floatval($xmin).",".floatval($ymax)." ".floatval($xmax).",".floatval($ymin)." ".floatval($xmax).",".floatval($ymin)." ".floatval($xmin)."))','4326'),geom)";
	$reponse0 = $db->prepare($sql0);
	
	$reponse0->execute()
	or die(print_r($reponse0->errorInfo()));
	
	while($data = $reponse0->fetch()){
		$ls=explode("_",$data['id']);		
		$id_sit = $ls[0]."_".$ls[1]."_".$ls[2];
		if(strpos($where_clause, $id_sit) == false ){ 
			if($where_clause==""){
				$where_clause = "where id like '".$id_sit;
			} else {
				$where_clause = $where_clause."' or id like '".$id_sit;
			}
		}
	}
	if($where_clause != ""){
		$where_clause=$where_clause."'";
	}
	
	// echo('start          ');
	// echo($where_clause);
	// echo('        stop');
	
//////////////////requête principale
	$sql = "select ".$lsvar.",id from sites,st_astext(geom) ".$where_clause;
	$reponse = $db->prepare($sql); 

	$reponse->execute()
	or die(print_r($reponse->errorInfo()));
	$tab = array();				
	while($data = $reponse->fetch()){
			$properties = array();
			$properties['id'] =$data['id'];
			foreach ($datavar as $v){

				// echo $v;
				
				// $narray = array($v => $data[strtolower ($v)]);
				// $properties = $properties + $narray;
				$properties[strtolower($v)] =$data[strtolower($v)];				
			}
			// $coords = explode(" ",explode(")",explode("(",$data['st_astext'])[1])[0]);
			$tab[] = array('type' => 'Feature',
			// 'geometry' => array('type' => 'Point', 'coordinates' => [floatval($coords[0]), floatval($coords[1])]),
			// 'properties' => array('id'=> $data['id'], 'nbphind'=> $data['nbphind'], 'nbphsit'=> $data['nbphsit'], 'nomsithist'=> $data['nomsithist'], 'nomsitusa'=> $data['nomsitusa'], 'nbrchem'=> $data['nbrchem'], 'batiindus'=> $data['batiindus'], 'archisite'=> $data['archisite'], 'etatsite'=> $data['etatsite'], 'ajoutcont'=> $data['ajoutcont'], 'ushist'=> $data['ushist'], 'usactu'=> $data['usactu'], 'reconv'=> $data['reconv'], 'occup'=> $data['occup'], 'typeprosi'=> $data['typeprosi'], 'infohist'=> $data['infohist'], 'ptcsite'=> $data['ptcsite'], 'amsitea'=> $data['amsitea'], 'amsitea_d'=> $data['amsitea_d'], 'amsitev'=> $data['amsitev'], 'amsitev_d'=> $data['amsitev_d'], 'valsite'=> $data['valsite'], 'valsited'=> $data['valsited'], 'rayon_m'=> $data['rayon_m'])
			'properties' => $properties
			);	
	};		
	echo json_encode($tab);
	$reponse->closeCursor();	
?>
