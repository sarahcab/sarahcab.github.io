<!DOCTYPE HTML>
<html>
	<head>
  		<meta charset="utf-8">
		<title>Interface - test</title>
		<link rel="stylesheet" href="css/style.css" />
		<link rel="stylesheet" href="ressources/scripts/leafletcss.css" crossorigin=""/>
		<script src="ressources/scripts/leaflet.js" crossorigin=""></script>
		<script src="ressources/scripts/jquery.js" ></script>
		<script src="ressources/scripts/d3.js"></script>
		<script src="ressources/scripts/queue.js"></script>
	</head>	
	<body>
		<div id="cont_map">
			<div id="mapid"></div>
		</div>
		<div id="cont_plus">
			<iframe id="if_formulaire" src="formulaire.php"></iframe>
			<iframe id="if_identif" src="index_chemineur.html"></iframe>
			<p style="display:none" id="identifiant_chemineur" chemineur=""></p>
		</div>
		<div id="boutonss">
			<div id="boutt_chemm">
				<input type="button" id="bout_chemineur" class="bout" value="Chemineurs"></input><!--<span>Chemineurs&nbsp;</span>-->
			</div>
			<div>
				<svg id="svg_interrupteur" viewBox="20 0 595.28 841.89" width="80%" >
					<g id="fix">
						<path fill="#FFFFFF" stroke="#020203" opacity="0.75" stroke-miterlimit="10" d="M529.079,612.786c-1.027,4.438-6.998,17.908-41.991,24.155 c-42.217,7.541-375.445,13.57-375.445,13.57s-34.672-14.755-36.188-43.728c-1.515-28.964-9.047-426.71-9.047-426.71 s-0.516-8.233,3.691-15.565l-0.018-0.014c0,0-29.303,24.626-30.809,42.719s6.993,381.281,9.047,399.569 c2.334,20.803,1.506,58.805,40.711,61.822s396.556,0,396.556,0s44.981-7.523,44.398-43.728 C529.93,621.937,529.613,617.83,529.079,612.786z"></path>
						<path fill="#FFFFFF" stroke="#020203" opacity="0.75" stroke-miterlimit="10" d="M529.306,210.227c-1.506-21.111-24.123-43.285-24.123-43.285 S107.12,150.174,86.009,153.816c-8.368,1.443-13.15,5.876-15.913,10.693c-4.207,7.333-3.691,15.565-3.691,15.565 s13.57,398.063,9.047,426.71c-4.523,28.647,36.188,43.728,36.188,43.728s333.228-6.03,375.445-13.57 c34.993-6.247,40.964-19.718,41.991-24.155c0.213-0.918,0.226-1.479,0.226-1.479S530.812,231.338,529.306,210.227z"></path>
						<g id="tx_osm" font-weight="700" >
							<text transform="matrix(1 0 0 1 240 218)" font-size="60" fill="#555555">Fond</text>
							<text transform="matrix(1 0 0 1 80 290)" font-size="60" fill="#555555">Open Street Map</text>
						</g>
						<text id="tx_va" transform="matrix(1 0 0 1 125 580)" font-weight="300" font-size="60" fill="#555555">Vue aérienne</text>
						<g>
							<circle fill="#FFFFFF" stroke="#020203" stroke-linejoin="round" stroke-miterlimit="10" cx="484.175" cy="205.835" r="15.832"></circle>
							<line fill="none" stroke="#020203" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" x1="484.175" y1="198.136" x2="484.175" y2="213.529"></line>
							<line fill="none" stroke="#020203" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" x1="476.476" y1="205.835" x2="491.87" y2="205.835"></line>
						</g>
						<g>
							<circle fill="#FFFFFF" stroke="#020203" stroke-linejoin="round" stroke-miterlimit="10" cx="114.185" cy="205.835" r="15.832"></circle>
							<line fill="none" stroke="#020203" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" x1="114.185" y1="198.136" x2="114.185" y2="213.529"></line>
							<line fill="none" stroke="#020203" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" x1="106.486" y1="205.835" x2="121.88" y2="205.835"></line>
						</g>
						<g>
							<circle fill="#FFFFFF" stroke="#020203" stroke-linejoin="round" stroke-miterlimit="10" cx="121.88" cy="606.53" r="15.832"></circle>
							<line fill="none" stroke="#020203" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" x1="121.88" y1="598.831" x2="121.88" y2="614.229"></line>
							<line fill="none" stroke="#020203" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" x1="114.185" y1="606.53" x2="129.578" y2="606.53"></line>
						</g>
						<g>
							<circle fill="#FFFFFF" stroke="#020203" stroke-linejoin="round" stroke-miterlimit="10" cx="491.87" cy="590.698" r="15.832"></circle>
							<line fill="none" stroke="#020203" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" x1="491.87" y1="582.999" x2="491.87" y2="598.397"></line>
							<line fill="none" stroke="#020203" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" x1="484.175" y1="590.698" x2="499.569" y2="590.698"></line>
						</g>
					</g>
					<g id="inter">
						<g id="pos_osm" class="interru" opacity="1">
							<path fill="#FFFFFF" stroke="#020203" stroke-linejoin="round" stroke-miterlimit="10" d="M285.482,464.465 c-11.398,43.516-27.434,55.013-37.735,57.577h96.35c26.294-25.574,29.143-60.864,29.143-60.864L285.482,464.465z"/>
							<path fill="#FFFFFF" stroke="#020203" stroke-linejoin="round" stroke-miterlimit="10" d="M373.237,461.178 c-9.86-3.287-41.084-103.532-37.797-141.329h-97.616c0,0,8.217,83.812,47.658,144.616L373.237,461.178z"/>
							<path fill="#FFFFFF" stroke="#020203" stroke-linejoin="round" stroke-miterlimit="10" d="M237.824,319.849l-0.01,9.387 l-0.177,192.747l10.107,0.059c10.301-2.564,26.34-14.061,37.735-57.577C246.041,403.66,237.824,319.849,237.824,319.849z"/>
						</g>
						<g id="pos_va"  class="interru" opacity="0" display="none">
							<path fill="#FFFFFF" stroke="#020203" stroke-linejoin="round" stroke-miterlimit="10" d="M285.482,377.425 c-11.398-43.516-27.434-55.013-37.735-57.577h96.35c26.294,25.574,29.143,60.864,29.143,60.864L285.482,377.425z"/>
							<path fill="#FFFFFF" stroke="#020203" stroke-linejoin="round" stroke-miterlimit="10" d="M373.237,380.712 c-9.86,3.287-41.084,103.532-37.797,141.329h-97.616c0,0,8.217-83.812,47.658-144.616L373.237,380.712z"/>
							<path fill="#FFFFFF" stroke="#020203" stroke-linejoin="round" stroke-miterlimit="10" d="M237.824,522.042l-0.01-9.387 l-0.177-192.747l10.107-0.059c10.301,2.564,26.34,14.061,37.735,57.577C246.041,438.23,237.824,522.042,237.824,522.042z"/>
						</g>
					</g>
				</svg>
				
			</div>
			<input class="bout" type="button" id="contrib" value="Ajouter une cheminée"/>
			
			
			<!--		
					///Connexion
						try {
							$db = new PDO('pgsql:host=localhost; dbname = postgis_24_sample;port = 5433',
							'postgres', 'postgres');
							echo "Connexion OK<br/>";
						}
						catch(PDOException $e){
							die ('Erreur : '.$e->getMessage());
						};


					////////////////////requête principale
						$sql = "select * from cheminee_test";
						$reponse = $db->prepare($sql);
					//Tests : 
						$reponse->execute()
						or die(print_r($reponse->errorInfo()));;
						while($data = $reponse->fetch()){
							echo '<br/>'.$data['nomsitusa'];	
						}	
						
						$reponse->closeCursor();	
					-->
		</div>
		<div id="localtemp">
			<p id="x_temp" style="margin:0%"></p>
			<p id="y_temp" style="margin:0%"></p>
		</div>
		<div id="erooor">
		</div>
		<div id="chargement" >
			<svg width="100%" viewBox="0 50 1366 664">
				<path id="fond" class="enc" opacity="0.85" fill="#FFFFFF" d="M0,0v664h1366V0H0z M683,573.2c-133.2,0-241.2-108-241.2-241.2 S549.8,90.8,683,90.8s241.2,108,241.2,241.2S816.2,573.2,683,573.2z"/>
				<path class="charg enc" stroke="#ffffff" id="rond4" opacity="0.85" fill="#FFFFFF" d="M891.4,244c-5-11.9-11-23.3-18-34l12.6-8.1c-42.9-66.8-117.8-111-203.1-111 c-0.3,0-0.6,0-0.9,0l-0.2,15c-30.2,0.1-59.4,6.1-86.9,17.8c-26.9,11.4-51.1,27.7-71.9,48.5c-20.8,20.8-37.1,45-48.5,71.9 c-11.8,27.9-17.8,57.5-17.8,88s6,60.2,17.8,88c11.4,26.9,27.7,51.1,48.5,71.9c20.8,20.8,45,37.1,71.9,48.5 c27.9,11.8,57.5,17.8,88,17.8s60.2-6,88-17.8c26.9-11.4,51.1-27.7,71.9-48.5c20.8-20.8,37.1-45,48.5-71.9 c11.8-27.9,17.8-57.5,17.8-88S903.2,271.8,891.4,244z M683,532.2c-110.6,0-200.2-89.6-200.2-200.2c0-110.1,88.8-199.4,198.7-200.2 c0.5,0,1,0,1.4,0c70.8,0,133,36.7,168.6,92.2c20,31.2,31.6,68.2,31.6,108C883.2,442.6,793.6,532.2,683,532.2z"/>
				<path class="charg enc" stroke="#ffffff" id="rond1" opacity="0.85" fill="#FFFFFF" d="M772,275.2l12.7-8.1c-21.4-33.5-58.9-55.7-101.6-55.7c-0.8,0-1.7,0-2.5,0 l-0.2,15c-57,1.4-102.9,48.2-102.9,105.6c0,58.2,47.4,105.6,105.6,105.6S788.6,390.2,788.6,332C788.6,311.1,782.5,291.6,772,275.2z "/>
				<path class="charg enc" stroke="#ffffff" id="rond3" opacity="0.85" fill="#FFFFFF" d="M839,232.1l12.6-8.1c-35.6-55.4-97.8-92.2-168.6-92.2c-0.5,0-1,0-1.4,0l-0.2,15 c-48.8,0.4-94.7,19.6-129.3,54.2c-35,35-54.2,81.5-54.2,130.9c0,49.5,19.3,96,54.2,130.9c35,35,81.5,54.2,130.9,54.2 c49.5,0,96-19.3,130.9-54.2c35-35,54.2-81.5,54.2-130.9C868.2,296,858,261.6,839,232.1z M683,492.4c-88.6,0-160.4-71.8-160.4-160.4 c0-87.9,70.7-159.3,158.4-160.4c0.7,0,1.3,0,2,0c56.7,0,106.6,29.5,135.1,73.9c16,25,25.3,54.6,25.3,86.5 C843.4,420.6,771.6,492.4,683,492.4z"/>
				<path class="charg enc" stroke="#ffffff" id="rond2" opacity="0.85" fill="#FFFFFF" d="M805.5,253.6l12.6-8.1c-28.5-44.5-78.4-73.9-135.1-73.9c-0.7,0-1.3,0-2,0 l-0.2,15c-38,0.6-73.7,15.6-100.6,42.6c-27.5,27.5-42.6,64-42.6,102.8s15.1,75.3,42.6,102.8c27.5,27.5,64,42.6,102.8,42.6 s75.3-15.1,102.8-42.6c27.5-27.5,42.6-64,42.6-102.8C828.4,303.8,820.4,276.8,805.5,253.6z M683,452.6 c-66.6,0-120.6-54-120.6-120.6c0-65.8,52.6-119.2,118.1-120.6c0.8,0,1.7,0,2.5,0c42.7,0,80.2,22.2,101.6,55.7 c12,18.7,19,41,19,64.9C803.6,398.6,749.6,452.6,683,452.6z"/>
				<circle id="centre" display="none" fill="#FFFFFF" cx="683" cy="332" r="241.2"/>
				
				<text id="encours" class="enc" x="610" y="345" font-size="20" font-weight="700">Envoi en cours...</text>
				<text id="chargeok" opacity="0" x="430" y="345" font-size="20" font-weight="700">La cheminée a bien été ajoutée à notre base de données</text>
			</svg>
		</div>
		
		<!--<script src="data/chemineurs.js"></script>-->
		<!--<script src="data/cheminees.js"></script>-->
		<!--<script src="data/sites.js"></script>-->
		<!--<script src="data/communes.js"></script>-->
		<!--<script src="data/nuts.js"></script>-->
		<script src="js/script.js"></script>
	</body>
</html>	