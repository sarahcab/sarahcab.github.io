<!DOCTYPE HTML>
<html>
	<head>
  		<meta charset="utf-8">
		<title>Test formulaire cheminées</title>
		<link rel="stylesheet" href="css/style.css" />
		
		<script src="ressources/scripts/d3.js"></script>
		<script src="ressources/scripts/jquery.js"></script>
		
		<script src="ressources/scripts/queue.js"></script>
	</head>	
	<body>
		<form id="formulaire_contribuer">
			<!-- <fieldset id='localisation' class="additionnel">
				<legend>Localisation</legend>
				<div id="ex_carte" style="width:100%;height:40%">
					<p> Emplacement de la carte (cheminée à localiser manuellement) </p>
				</div>
			</fieldset> -->
			<p style="text-align:right"><input id="quit_form" type="button" class="bout" value="Fermer"/></p>
			<p style="text-align:right"><input id="identif" type="button" class="bout" value="S'identifier"/></p>
			
			<fieldset id='general' class="">
				<legend value="Général">Informations générales</legend>
				<div class="didi" style="display:flex" >
					<h3>Le site industriel sur lequel se trouve votre cheminée est-il déjà présent sur la carte ?</h3>
					<input type="radio" id="site_existant"/>Oui
					<input type="radio" id="new_site"/>Non
					
				</div>
				<div class="didi">
					<label>Coordonnées GPS : </label>
					<p>
					<input type="number" step="any" id="x" />
					<input type="number" step="any" id="y" />
					</p>
					<input class="bout" type="button" id="makeCoord" mode="Localiser sur la carte"/>
				</div>
				
				<div class="didi eff_local">
					<label>Adresse : </label>
					<input type="text" id="adresse"/>
				</div>
				<!--<div class="didi">
					<label>Identifiant numérique du site (provisoire) : </label>
					<input type="numer" id="num_site"/>
				</div>-->
				<div class="didi eff_local">
					<label>Nom historique du site : </label>
					<input type="text" id="nom_site_historique"/>
				</div>
				<div class="didi eff_local">
					<label>Nom d'usage du site : </label>
					<input type="text" id="nom_site_usage"/>
				</div>
				<div class="didi eff_local">
					<label>Elément particulier de la cheminée (si plusieurs sur le site) : </label>
					<input type="text" id="nom_cheminee"/>
				</div>
				<p style="display:none" id="iddsite" value="new"/>
				
			</fieldset>
			<fieldset id='description' class="additionnel">
				<legend value="Description">Description</legend>
				<div class="didi">
					<label>Existence d’un bâti industriel : </label>
					<select id="bati_industriel">
						<option></option>
						<option>Oui</option>
						<option>Non</option>
					</select>	
				</div>
				<div class="didi">
					<label>Particularités architecturales et décoratives du bâti :</label>
					<textarea id="particularite_architecturale_site"></textarea>	
				</div>
				<div class="didi">
					<label>Etat du site : </label>
					<select id="etat_site">
						<option></option>
						<option>Bon</option>
						<option>Moyen</option>
						<option>Mauvais</option>
					</select>	
				</div>
				<div class="didi">
					<label>Etat de la cheminée : </label>
					<select id="etat_cheminee">
						<option></option>
						<option>Bon</option>
						<option>Moyen</option>
						<option>Mauvais</option>
					</select>	
				</div>
				<div id="ajout_contemporain" class="didi cochage">
					<p style="margin-bottom:4px">Ajouts contemporains de la cheminée : </p>
					<input type="checkbox" id="antenne" value="Antennes Relais"/>Antennes relais<br>	
					<input type="checkbox" id="eclairage" value="Eclairage"/>Eclairage <br>	
					<input type="checkbox" id="lettrage" value="Lettrage Publicitaire "/>Lettrage Publicitaire <br>							
					<input type="button" class="plus_autre" value="+"/>
					Autre : <input type="text" class="autre_cochage" id="autre"/>
				</div>
				<div class="didi">
					<label>Visibilité de la cheminée dans le paysage depuis l'espace public :</label>
					<select id="visibilite_appreciation">
						<option></option>
						<option>Forte</option>
						<option>Bonne</option>
						<option>Moyenne</option>
						<option>Mauvaise</option>
					</select>
					<label>Commentaire :</label>
					<textarea id="visibilite_commentaire"></textarea>	
				</div>
				<div class="didi">
					<label>Hauteur de la cheminée (connaissance précise) : </label>
					<input type="number" id="hauteur_distance"/>
					<label>OU estimation : </label>
					<select id="hauteur_estimation">
						<option></option>
						<option>0 à 20 mètre</option>
						<option>20 à 40 mètre</option>
						<option>Plus de 40 mètre</option>
					</select>
				</div>
				<div id="particularite_architecturale_cheminee" class="didi cochage">
					<p style="margin-bottom:4px">Particularités architecturales et décoratives de la cheminée :</p>
					<input type="checkbox" id="cerclages" value="Cerclages"/>Cerclages<br>	
					<input type="checkbox" id="couronne" value="Couronne/bulbe"/>Couronne/bulbe<br>	
					<input type="checkbox" id="briques" value="Briques émaillées"/>Briques émaillées<br>	
					<input type="checkbox" id="date" value="Date de construction apparente"/>Date de construction apparente<br>							
					<input type="button" class="plus_autre" value="+"/>
					Autre : <input type="text" class="autre_cochage" id="autre"/>
				</div>
				<div class="didi">
					<label>Principal matériau constitutif de la cheminée :</p>
					<select id="materiau_cheminee">
						<option></option>
						
						<option >Béton</option>	
						<option>Brique</option>	
						<option>Métal</option>	
						<option>Pierre</option>
					</select>					
				</div>
				<div class="didi">
					<label>Forme du fût :</p>
					<select id="formefut">
						<option></option>
						<option >Rond</option>	
						<option>Carré</option>	
					</select>					
				</div>
			</fieldset>
			<fieldset id='usage' class="additionnel">
				<legend value="Usage">Usage</legend>
				<div id="usage_historique" class="cochage didi">
					<p style="margin-bottom:4px">Usage historique du site :</p>
					<input type="checkbox" id="testusage0" value="testusage0"/>testusage0<br>	
					<input type="checkbox" id="testusage1" value="testusage1"/>testusage1<br>	
					<input type="checkbox" id="testusage2" value="testusage2"/>testusage2<br>	
					
					<input type="button" class="plus_autre" value="+"/>
					Autre : <input type="text" class="autre_cochage" id="autre"/>
				</div>
				<div id="usage_actuel" class="cochage didi">
					<p style="margin-bottom:4px">Usage actuel du site :</p>						
					<input type="button" class="plus_autre" value="+"/>
					Autre : <input type="text" class="autre_cochage" id="autre"/>
				</div>
				
				<div class="didi">
					<label>Reconversion du site : </label>
					<select id="reconversion">
						<option></option>
						<option>Reconverti</option>
						<option>En reconversion</option>
						<option>Non reconverti</option>
					</select>
				</div>
				<div class="didi">
					<label>Le site est-il actuellement occupé ?</label>
					<select id="occupation">
						<option></option>
						<option>Entièrement</option>
						<option>Majoritairement</option>
						<option>Partiellement</option>
						<option>Pas du tout</option>
					</select>
				</div>
				<div class="didi">
					<label>Type de propriétaire du site :</label>
					<select id="type_proprietaire_site">
						<option></option>
						<option>Public</option>
						<option>Privé</option>
						<option>Autre</option>
					</select>
				</div>
				<div class="didi">
					<label>Type de propriétaire de la cheminée :</label>
					<select id="type_proprietaire_chem">
						<option></option>
						<option>Public</option>
						<option>Privé</option>
						<option>Autre</option>
					</select>
				</div>
				
			</fieldset>
			<fieldset id='histoire' class="additionnel">
				<legend value="Histoire">Histoire</legend>
				
				<div class="didi">
					<label>Informations historiques :</label>
					<textarea id="informations_historiques"></textarea>	
				</div>
			</fieldset>
			<fieldset id='protection' class="additionnel">
				<legend value="Protection patrimoniale">Protection patrimoniale</legend>
				<div id="protection_site" class="cochage didi">
					<p style="margin-bottom:4px">Protection du site :</p>						
					<input type="button" class="plus_autre" value="+"/>
					Autre : <input type="text" class="autre_cochage" id="autre"/>
					
				</div>
				<div id="protection_cheminee" class="cochage didi">
					<p style="margin-bottom:4px">Protection de la cheminée :</p>						
					<input type="button" class="plus_autre" value="+"/>
					Autre : <input type="text" class="autre_cochage" id="autre"/>
				</div>
			</fieldset>
			<fieldset  id='transformation' class="additionnel">
				<legend value="Transformation">Transformations et valorisation à venir</legend>
				<h3>Projets d’aménagement en cours </h3>
				<div class="didi">
					<label>Sur le site : </label>
					<textarea id="projet_amenagement_site_actuel"></textarea>	
				</div>
				<div class="didi">
					<label>Sur la cheminée : </label>
					<textarea id="projet_amenagement_cheminee_actuel"></textarea>	
				</div>
				<h3>Projets d’aménagement à venir</h3>
				<div class="didi">
					<label>Sur le site : </label>
					<textarea id="projet_amenagement_site_avenir"></textarea>	
				</div>
				<div class="didi">
					<label>Sur la cheminée : </label>
					<textarea id="projet_amenagement_cheminee_avenir"></textarea>	
				</div>
				<h3>Projets de valorisation et d'animation</h3>
				<div class="didi">
					<label>Sur le site :</label>
					<textarea id="projet_valorisation_site"></textarea>	
				</div>
				<div class="didi">
					<label>Sur la cheminée :</label>
					<textarea id="projet_valorisation_cheminee"></textarea>	
				</div>
			</fieldset>
			<!-- <div style="text-align:center">
				<input type="button" id="validation" value="Valider"/>
			</div> -->
			<div class="eff_local didi" style="text-align:center">
				<p style="text-align:center" id="indic_verouill">Cheminée non vérouillée</p>
				<p style="text-align:center" id="explis_nonverouill">Les données relatives au site sont susceptibles d'êtres modifiées si un utilisateur ajoute une autre cheminée au site industriel auquel elle appartient. Votre cheminée pourra être supprimée par un utilisateur, sauf si vous la vérouillez : pour cela, il faudra vous identifier.</p>
				<p><input class="bout" type="button" id="envoie_form" value="Envoyer"/></p>
			</div>
		</form>
		<p id="resuls" ></p>
		<!-- <p id="indic_valid" style="display:none">Copier le texte dans l'encadré ci-dessous puis ajouter dans excel</p>-->
		<div id="resultatss" style="display:none;border:dashed 0.5px black"></div>
		<div id="erooor">
		</div>
		<div id="ok">
		</div>
		<script src="js/script_form.js"></script>
	</body>
</html>	