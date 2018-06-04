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
	
////////////////////requête principale
	$sql = "select ".$lsvar.",x,y from cheminee2 where st_intersects(ST_GeomFromText('POLYGON((".floatval($ymin)." ".floatval($xmin).",".floatval($ymax)." ".floatval($xmin).",".floatval($ymax)." ".floatval($xmax).",".floatval($ymin)." ".floatval($xmax).",".floatval($ymin)." ".floatval($xmin)."))','4326'),geom)";
	$reponse = $db->prepare($sql);
	
	$reponse->execute()
	or die(print_r($reponse->errorInfo()));
	$tab = array();				
	while($data = $reponse->fetch()){
			// print_r($data);
			$properties = array();
			foreach ($datavar as $v){

				// echo $v;
				
				// $narray = array($v => $data[strtolower ($v)]);
				// $properties = $properties + $narray;
				
				$properties[strtolower($v)] =$data[strtolower($v)];
			}
			// print_r($properties);
			// echo $data['geom']; //st_astext(geom);
			$tab[] = array('type' => 'Feature',
			'geometry' => array('type' => 'Point', 'coordinates' => [floatval($data['x']), floatval($data['y'])]),
			// 'properties' => array('id'=> $data['id'], 'adresse'=> $data['adresse'], 'commune'=> $data['commune'], 'region'=> $data['region'], 'pays'=> $data['pays'], 'nbPhInd'=> $data['nbphind'], 'nbPhSit'=> $data['nbphsit'], 'nomChem'=> $data['nomchem'], 'nomSitHist'=> $data['nomsithist'], 'nomSitUsa'=> $data['nomsitusa'], 'nbrChem'=> $data['nbrchem'], 'batiIndus'=> $data['batiindus'], 'archiSite'=> $data['archisite'], 'etatSite'=> $data['etatsite'], 'etatChem'=> $data['etatchem'], 'ajoutCont'=> $data['ajoutcont'], 'visAppre'=> $data['visappre'], 'visComm'=> $data['viscomm'], 'hauteurPr'=> $data['hauteurpr'], 'hauteurEs'=> $data['hauteures'], 'archiChem'=> $data['archichem'], 'materChem'=> $data['materchem'], 'usHist'=> $data['ushist'], 'usActu'=> $data['usactu'], 'reconv'=> $data['reconv'], 'occup'=> $data['occup'], 'typeProSi'=> $data['typeprosi'], 'infoHist'=> $data['infohist'], 'ptcSite'=> $data['ptcsite'], 'ptcChem'=> $data['ptcchem'], 'amSiteA'=> $data['amsitea'], 'amSiteA_D'=> $data['amsitea_d'], 'amChemA'=> $data['amchema'], 'amChemA_D'=> $data['amchema_d'], 'amSiteV'=> $data['amsitev'], 'amSiteV_D'=> $data['amsitev_d'], 'amChemV'=> $data['amchemv'], 'amChemV_D'=> $data['amchemv_d'], 'valSite'=> $data['valsite'], 'valSiteD'=> $data['valsited'], 'valChem'=> $data['valchem'], 'valChemD'=> $data['valchemd'], 'gidSit'=> $data['gidsit'], 'x'=> $data['x'], 'y'=> $data['y'], 'formefut'=> $data['formefut'], 'typeProCh'=> $data['typeproch'])
			'properties' => $properties
			);		
	}			
	echo json_encode($tab);
	$reponse->closeCursor();	
?>
