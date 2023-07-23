///_______________________________________________________________Variables
///Géométriques
let width = 1500,
height = 1000,
taille_div_map= "grande",

///Graphiques
nuancier = ["#FFFFFF","#EEEEEE","#CCCCCC","#EEEEFF","#000000","#0000ff"],
nuancier_resultat = ["#43D175","#D4E113","#FAAB02","#E10000"],

///Thématiques
referentiel;
const type_loyer_ref = ["Loyer de référence minoré","Loyer de référence","Loyer de référence majoré"];
let monLoyerReference = [0,0,0];
let calcul_loyer_ref = false;
let etape=0;
let zone_choisie=false;
let formNbPiece,formEpoqueConst,formTypeLoc,formZone,loyerm2,loyerMensuel,surface,zone;


///_______________________________________________________________Fonctions
/////////////--------------------1. Fonction initiale
window.onload = initialize();
function initialize() {
	///Fonctionnalités générales
	fonctionnalites();
	
	///Enchainement des fonctionnalités au fur et à mesure que le formulaire avance
	suivant(); 
	
}

/////////////--------------------2. Fonctions structurelles
///---------Fonctionnalités générales
function fonctionnalites(){
	
	///--Calcul du loyer au m²
	d3.selectAll(".calc_loyer").on("change",function(){
		if(this.value>0){
			d3.select(this).style("background",null)
		}else{
			d3.select(this).style("background","red")
		}
		if(etape==4){
			calculLoyerM2(); //Simple calcul du loyer au m²
		}else if (etape==5){
			calculEncadrement(); //Tous les calculs, loyer au m², loyer de référence, comparaison des deux et du dépassement éventuel
		}
			
	})
	
	///--Elements du formulaire
	///Couleur jusqu'à ce que les éléments soient renseignés
	d3.selectAll("fieldset")
		.style("color","blue")
		.on("click",function(){
			isChecked = false;
			d3.select(this).selectAll("input").each(function(){
				if(this.checked){
					isChecked = true;
				}
			})
		
			if(isChecked==true){
				d3.select(this)
					.transition()
					.duration(300)
					.style("color","#000000")
			}
			
	///Action lorsque on modifie un élément du formulaire
			if (etape==5){ //Toutes les infos ont été saisies
				calculEncadrement(); //Tous les calculs, loyer au m², loyer de référence, comparaison des deux et du dépassement éventuel
			}
					
		})
		
	///--Carte
	///Taille de la carte
	d3.select("#bouton_taille_carte").on("click",function(){
		tailleCarte(300);
	})
	
	///Mise à jour lorsuqe l'on clique sur la carte
	d3.select("#fd_zone").selectAll("label,input[type=radio]").on("click",function(){
		zone = document.querySelector('input[name=zone_carte]:checked').value;
		d3.select("#zone_form").html(zone).style("color",getColor(zone)).style("font-weight","800");
		d3.select("#zone_form_plus").html("").style("color",getColor(zone));
		zone_choisie = true
	})
}


///---------Enchainement des fonctionnalités au fur et à mesure que le formulaire avance (bouton "Suivant)
function suivant(){
	d3.select("#bouton_suivant").on("click",function(){
		console.log("___________________________")
		console.log("Etape initiale : "+etape)

		if(etape==0){ 
			//A cette étape, si on clique sur le bouton suivant, il faut avoir rempli le type de location
			if(document.querySelector('input[name=type_loc]:checked')){
				d3.selectAll("#fd_epoque_construction").style("display","block");
				etape=1;
				//Scroll en bas
				window.scrollTo({top: document.body.scrollHeight, behavior: "smooth"});
			}else{
				alert("Renseigner le type de location pour passer à la suite")
			}
			
			
		} else if(etape==1){ 
			//A cette étape, si on clique sur le bouton suivant, il faut avoir rempli le type de construction
			if(document.querySelector('input[name=epoque_const]:checked')){
				d3.selectAll("#fd_nb_piece").style("display","block");
				etape=2;
				//Scroll en bas
				window.scrollTo({top: document.body.scrollHeight, behavior: "smooth"});
			}else{
				alert("Renseigner l'époque de construction pour passer à la suite");
			}
		} else if(etape==2){ 
			//A cette étape, si on clique sur le bouton suivant, il faut avoir rempli le type de location
			if(document.querySelector('input[name=nb_piece]:checked')){
				d3.selectAll("#fd_zone").style("display","block");
				drawMap(); //Création de la carte : ne peut être fait lorsque le contenant est invisible ou désactivé
				tailleCarte(0); //Réduction de la carte
				etape=3;
				//Scroll en bas
				window.scrollTo({top: document.body.scrollHeight, behavior: "smooth"});
			}else{
				alert("Renseigner le nombre de pièces pour passer à la suite");
			}
		}else if(etape==3){
			//A cette étape, si on clique sur le bouton suivant, il faut avoir sélectionné la zone sur la carte, l'adresse ou le formulaire
			if(zone_choisie==true){
				d3.select("#mon_loyer").style("display","block");			
				etape=4;
				//Scroll en bas
				window.scrollTo({top: document.body.scrollHeight, behavior: "smooth"});
			}else{
				alert("Cliquer sur une zone dans la carte ou utiliser la loupe pour chercher une adresse");
			}
		}else if(etape==4){
			//A cette étape, le loyer et la superficie doivent être saisis
			
			let loyerMensuel = d3.select("#loyer_mensuel").node().value,
			surface = d3.select("#surface").node().value;
			if(surface>0&&loyerMensuel>0){ 
				etape = 5; //Dernière étape : tous les éléments ont été saisis
				d3.select("#bouton_suivant").style("display","none"); //..on désactive donc le bouton suivant, le formulaire se met à jour si on modifie une information
			
				calculEncadrement(); //Tous les calculs, loyer au m², loyer de référence, comparaison des deux et du dépassement éventuel
				d3.select("#loyers_reference").style("display","block"); //Affichage du loyer de référence
				//Scroll en haut
				window.scrollTo({top: 10, behavior: "smooth"});
			}else{
				alert("Renseigner le montant du loyer et le nombre de mètre carrés")
			}

			
		} 

		console.log("Etape : "+etape)
	})
}


/////////////--------------------3. Fonctions de dessin (initialisiation)
///---------Dessin de la carte
function drawMap(){
	///--Carte
	var map = L.map('map').setView([50.60, 3.05], 12);
	
	L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
		maxZoom: 19,
		opacity:0.8,
		attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
	}).addTo(map);
	
	
	///--Polygones
	///Styles
	function style(feature) {
		return {
			fillColor: getColor(feature.properties.zonage),
			weight: 2,
			opacity: 1,
			color: 'white',
			// dashArray: '3',
			fillOpacity: 0.6
		};
	}
	
	///Evènements 
	//..au survol
	function highlightFeature(e) {
		var layer = e.target;

		layer.setStyle({
			weight: 5,
			color: '#666',
			dashArray: '',
			fillOpacity: 0.7
		});

		layer.bringToFront();
		
	}
	
	function resetHighlight(e) {
		geojson.resetStyle(e.target);
	}
	
	//..au click
	function majZonageForm(e) {
		zone = e.target.feature.properties.zonage;
		d3.select("#zone_form").html(zone).style("color",getColor(zone)).style("font-weight","800");
		d3.select("#zone_form_plus").html("Cliqué sur la carte").style("color",getColor(zone));
		d3.select("#zone_"+zone).node().checked= true
		zone_choisie = true;
	};
	
	
	function onEachFeature(feature, layer) {
		layer.on({
			mouseover: highlightFeature,
			mouseout: resetHighlight,
			click: majZonageForm
		});
	}

	///Ajout à la carte
	var geojson = L.geoJson(geojsonZonage, {
		style: style,
		onEachFeature: onEachFeature
	}).addTo(map);
	
	
	///--Géocoding
	var geocoder = L.Control.geocoder().addTo(map);
	
	geocoder.on('markgeocode', function(event) {
		var adresse = event.geocode.name;
		console.log(adresse);
		
		///Zoom et ajout du marqueur
		var center = event.geocode.center;
		L.marker(center).addTo(map);
		map.setView(center, map.getZoom());
		
		///Changement dans le formulaire	
		prems = false;		 //on évite la superposition de polygones
		geojson.eachLayer(function(memberLayer) {
			if (memberLayer.contains(center)&&prems==false) {
					prems = true;
					zone = memberLayer.feature.properties.zonage;
					console.log(memberLayer.feature.properties);
					d3.select("#zone_form").html(zone).style("color",getColor(zone)).style("font-weight","800");
					d3.select("#zone_form_plus").html(adresse).style("color",getColor(zone));
					zone_choisie=true;
			}
		});
	});

	///--Dessin de la légende
	drawLegend();
	

}

///---------Dessin de la légende et du formualaire de la carte
function drawLegend(){
	///Formulaire de la carte
	for(i=1;i<5;i++){
		let fill = getColor(i);
		d3.select("#zone_"+i).style("accent-color",fill)
	}
	///Légende
	for(i=1;i<5;i++){
		let fill = getColor(i);
		d3.select("#legend").append("span")
			.html("Zone "+i)
			.style("color","#ffffff")
			.style("background",fill)
			.style("margin-left","2em")
			.style("opacity",0.6)
			.style("font-size","0.8em")
			.attr("zone",i)	
			
		// d3.select("#legend").append("span")
			// .html("Zone "+i)
			// .style("margin-left","0.4em")	
			// .style("font-size","0.8em")	
	}
}
	
/////////////--------------------4. Fonctions de calcul
///---------Calcul du loyer de référence
///Appelé dans la fonction calculEncadrement qui calcule si le loyer saisi dépasse le loyer de référence
function calculLoyerReference(){
	///--Teste si tous les éléments sont saisis
	if(zone_choisie==true&&document.querySelector('input[name=nb_piece]:checked')&&document.querySelector('input[name=epoque_const]:checked')&& document.querySelector('input[name=type_loc]:checked')){
		///--Récuparation des valeurs saisies
		let formNbPiece = document.querySelector('input[name=nb_piece]:checked').value,
		formEpoqueConst = document.querySelector('input[name=epoque_const]:checked').value,
		formTypeLoc = document.querySelector('input[name=type_loc]:checked').value,
		formZone = document.querySelector('#zone_form').innerHTML;
		
		console.log("____Calcul encadrement des loyers:");
		console.log(formNbPiece);
		console.log(formEpoqueConst);
		console.log(formTypeLoc);
		console.log(formZone);
		console.log("____");
		
		///--Noms des colonnes dans le fichiers csv (voir dans l'index <script type = "text/javascript" src="data/encadrement-des-loyers-a-lille-lomme-et-hellemmes-referentiel.js"></script>
		let colonnes = encadrement_valeurs[0];

		///--Boucle dans le fichier
		let nb_match = 0;
		for (let i = 1; i < encadrement_valeurs.length; i++) {
			let lineCSV = encadrement_valeurs[i];
			
			///Le nombre de pièce, l'époque de construction et la zone sont définies en ligne, le type de location par colonnes
			let csvNbPiece = lineCSV[colonnes.indexOf("Nb pièces")];
			let csvEpoqueConst = lineCSV[colonnes.indexOf("Epoque construction")];
			let csvZone = lineCSV[colonnes.indexOf("Zone")];
			
			///Test si les valeurs correspondent
			
			if(csvNbPiece==formNbPiece&&csvEpoqueConst==formEpoqueConst&&csvZone==formZone){
				///On récupère les trois types de valeur correspondant à la constation type_loyer_ref (définie au début du script)
				for(j=0;j<type_loyer_ref.length;j++){
					let typeLoyer = type_loyer_ref[j];
					let valeurLoyer = lineCSV[colonnes.indexOf(formTypeLoc+" - "+typeLoyer)];
					monLoyerReference[j] = valeurLoyer;
					
					///Mise à jour du loyer
					d3.select("[cible='"+typeLoyer+"']").html(valeurLoyer+" €/m²");
					d3.select("[cible='"+typeLoyer+" - surface']").html((valeurLoyer*surface).toFixed(2)+" €");
					
				}
				nb_match++;
			}
		}
		///--Vérifie si le calcul a été réalisé
		calcul_loyer_ref = false;
		if(nb_match!=1){
			alert("Erreur dans le calcul du loyer de référence : cas non trouvé");
		}else if(nb_match>1){
			alert("Erreur dans le calcul du loyer de référence : doublons");
		} else{
			calcul_loyer_ref = true;
		}
		
	///--Message indiquant que tous les champs ne sont pas saisis
	}else{
		alert("Pour calculer, saisir les valeurs dans le formulaire sous 'Les éléments définis dans l'encadrement des loyer'")
	}
	
	///--Clignotement pour indiquer que le loyer de référence a été recalculé
	d3.select("#loyers_reference")
		.style("opacity",0)
		.transition()
		.duration(300)
		.style("opacity",1)

}

///---------Calcul du loyer au m² (depuis le loyer mensuel et la superficie)
function calculLoyerM2(){
	
	///Récupération des valeurs
	loyerMensuel = d3.select("#loyer_mensuel").node().value;
	surface = d3.select("#surface").node().value;

	///Si les valeurs sont saisis : calcul effectué
	if(surface>0&&loyerMensuel>0){
			
		loyerm2 = loyerMensuel/surface;
		d3.select("#valeur_loyer_m2").html((loyerm2).toFixed(2)).style("color","#000000");
		d3.select("#loyer_m2").style("display","block");
		
	///Champs manquants :  coloration en rouge
	}else{
		loyerm2 = null;
		d3.select("#valeur_loyer_m2").html("Manque surface et loyer").style("color","red");		
	}
	
};

///---------Tous les calculs, loyer au m², loyer de référence, comparaison des deux et du dépassement éventuel
function calculEncadrement(){
	
	///Calcul du loyer référence
	calculLoyerReference();
	
	///Calcul du loyers au m²
	calculLoyerM2();
	
	///Valeurs mises à jour dans la fonction calculLoyerReference()
	let loyerRefMinore = monLoyerReference[0]; 
	let loyerRef = monLoyerReference[1];
	let loyerRefMajore = monLoyerReference[2];
	
	///Console : vérification du calcul
	console.log("____Calcul dépassement");
	console.log(loyerm2); ///Valeur mise à jour dans calculLoyerM2()
	console.log(loyerRefMinore);
	console.log(loyerRef);
	console.log(loyerRefMajore);
	
	
	///Test si calcul_loyer_refa fonctionné
	
	if(calcul_loyer_ref==true){
		///Test si le loyer au m2 a été calculé
		if(loyerm2){
			
			///Transparence pour le clignotement et activation du bloc
			d3.selectAll("#div_resultat,#plus_infos")
				.style("display","block")
			d3.select("#div_resultat")
				.style("opacity",0)
				.transition()
				.duration(300)
				.style("opacity",1)
			
			///Apparition de la colonne de droite
			d3.select("#colonne_droite")
				// .style("width","0%")
				.transition()
				.duration(300)
				.style("width","50%")
			
			d3.select("#colonne_gauche")
				// .style("width","100%")
				.transition()
				.duration(300)
				.style("width","50%")
				
				
			if(parseFloat(loyerm2)<parseFloat(loyerRefMinore)){
				d3.select("#reponse").html("Non").style("color",nuancier_resultat[0]);
				d3.select("#reponse_detail").html("Ton loyer est en dessous du loyer de référence minoré").style("color",nuancier_resultat[0]);
				d3.select("#loyer_trop").html("");
			}else if(parseFloat(loyerm2)<parseFloat(loyerRef)){
				d3.select("#reponse").html("Non").style("color",nuancier_resultat[1]);
				d3.select("#reponse_detail").html("Ton loyer est en dessous du loyer de référence").style("color",nuancier_resultat[1]);
				d3.select("#loyer_trop").html("");
			}else if(parseFloat(loyerm2)<parseFloat(loyerRefMajore)){
				d3.select("#reponse").html("Non").style("color",nuancier_resultat[2]);
				d3.select("#reponse_detail").html("Ton loyer au dessus du loyer de référence mais en dessous du loyer de référence majoré").style("color",nuancier_resultat[2]);
				d3.select("#loyer_trop").html("");
			}else if(parseFloat(loyerm2)>parseFloat(loyerRefMajore)){
				console.log("Dépassement : ");
				console.log(loyerm2)
				console.log(loyerm2-loyerRefMajore)
				console.log(surface)
				let loyerTrop = (loyerm2-loyerRefMajore)*surface;
				d3.select("#reponse").html("Oui !").style("color",nuancier_resultat[3]);
				d3.select("#reponse_detail").html("Ton loyer est au dessus du loyer de référence majoré!").style("color",nuancier_resultat[3]);
				d3.select("#loyer_trop").style("color",nuancier_resultat[3]).html("Ton loyer dépasse le loyer majoré de <span style='font-weight:800'>"+loyerTrop.toFixed(2)+" €</span>, des recours existent pour faire baisser ton loyer. Tu peux consulter le lien ci-dessous pour en savoir plus.").style("color",nuancier_resultat[3]);
			}

			console.log("___");
		}else{
			alert("Le loyer au m² n'a pas pu être calculé : renseigner les valeurs de loyer et de superficie")
		}
	}else{
		alert("Le calcul de référence n'a pas pu être calculé")
	}
};


/////////////--------------------5. Boite à outils
///---------Définition de la couleur en fonction de la zone
function getColor(d) {
	if(d=='1'){
		return '#D2DC9F'
	} else if(d=='2'){
		return '#FFE37A'
	} else if(d=='3'){
		return '#FF963D'
	}else if(d=='4'){
		return '#D0501F'
	}else{
		return '#ffffff'
	}
}

///---------Modification de la taille de la carte
function tailleCarte(duration){
	if(taille_div_map=="grande"){
		d3.select("#map").transition().duration(duration).style("height","180px");
		taille_div_map="petite";
		d3.select("#bouton_taille_carte").attr("value","Agrandir la carte");
	}else{
		d3.select("#map").transition().duration(duration).style("height","500px");
		taille_div_map="grande";
		d3.select("#bouton_taille_carte").attr("value","Réduire la carte");
	}
	
}