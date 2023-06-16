/////////////--------------------Variables globales
///Géométriques
let width = 1500,
height = 1000,

///Graphiques
nuancier = ["#FFFFFF","#EEEEEE","#CCCCCC","#EEEEFF","#000000","#0000ff"],

///data
referentiel;
const type_loyer_ref = ["Loyer de référence minoré","Loyer de référence","Loyer de référence majoré"];


/////////////--------------------Fonctions
window.onload = initialize();
function initialize() {
	
	///Chargement des données
	// queue()										
		// .defer(d3.csv,"data/encadrement-des-loyers-a-lille-lomme-et-hellemmes-referentiel.csv")
		// .defer(d3.csv,"data/blop.csv")
		// .await(callback0); 
	
	// function callback0(error, dataReferentiel,blop){
		// alert("queue");
		// console.log(error);
		// console.log(dataReferentiel);
		// console.log(blop);

		drawMap();
		fonctionnalites();
		
	// }
	
	
}

function drawMap(){
	//////Carte
	var map = L.map('map').setView([50.638139, 3.079429], 13);
	
	L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
		maxZoom: 19,
		attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
	}).addTo(map);
	
	// function onMapClick(e) {
		// alert("You clicked the map at " + e.latlng);
	// }

	// map.on('click', onMapClick);
	
	//////Polygones
	///Styles
	function style(feature) {
		return {
			fillColor: getColor(feature.properties.zonage),
			weight: 2,
			opacity: 1,
			color: 'white',
			// dashArray: '3',
			fillOpacity: 0.4
		};
	}
	
	
	///Evènements 
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
	
	// var geojson;
	
	function majZonageForm(e) {
		// map.fitBounds(e.target.getBounds());
		var zone = e.target.feature.properties.zonage;
		d3.select("#zone_form").html(zone).style("color",getColor(zone)).style("font-weight","800");
		d3.select("#zone_form_plus").html("Cliqué sur la carte").style("color",getColor(zone));
		
	};
	
	
	
	function onEachFeature(feature, layer) {
		layer.on({
			mouseover: highlightFeature,
			mouseout: resetHighlight,
			click: majZonageForm
		});
	}

	var geojson = L.geoJson(geojsonZonage, {
		style: style,
		onEachFeature: onEachFeature
	}).addTo(map);
	
	
	
	///Géocoding
	var geocoder = L.Control.geocoder().addTo(map);
	
	geocoder.on('markgeocode', function(event) {
		var adresse = event.geocode.name;
		console.log(adresse);
		
		//Zoom et ajout du marqueur
		var center = event.geocode.center;
		L.marker(center).addTo(map);
		map.setView(center, map.getZoom());
		
		//Changement dans le formulaire	
		prems = false;		 //on évite la superposition de polygones
		geojson.eachLayer(function(memberLayer) {
			if (memberLayer.contains(center)&&prems==false) {
					prems = true;
					var zone2 = memberLayer.feature.properties.zonage;
					console.log(memberLayer.feature.properties);
					d3.select("#zone_form").html(zone2).style("color",getColor(zone2)).style("font-weight","800");
					d3.select("#zone_form_plus").html(adresse).style("color",getColor(zone2));
			}
		});
	});
	
	
	
	// function ProcessClick(center){
        // theMarker = L.marker(center).addTo(map);
        // geojson.eachLayer(function(layer) {
            // intersects=turf.intersect(theMarker.toGeoJSON(),layer.toGeoJSON());
            // if (intersects){
                // a=layer.feature.properties.buff
                // console.log(a);
                // }
            // })};
	

	

}

function fonctionnalites(){
	d3.select("#loyers_reference").on("click",function(){
		maj_form();
	})
	d3.select("#loyer_m2").on("click",function(){
		maj_loyer();
	})
	d3.selectAll("#titre_question").on("click",function(){
		maj_compare();
	})
}



function maj_form(){
	if(document.querySelector('input[name=nb_piece]:checked')&&document.querySelector('input[name=epoque_const]:checked')&& document.querySelector('input[name=type_loc]:checked')){
		var formNbPiece = document.querySelector('input[name=nb_piece]:checked').value;
		var formEpoqueConst = document.querySelector('input[name=epoque_const]:checked').value;
		var formTypeLoc = document.querySelector('input[name=type_loc]:checked').value;
		var formZone = document.querySelector('#zone_form').innerHTML;
		
		// console.log("_________________________");
		// console.log(formNbPiece);
		// console.log(formEpoqueConst);
		// console.log(formTypeLoc);
		// console.log(formZone);
		


		//// Contenu du fichier CSV (colonnes) :
		// Zone
		// Nb pièces
		// Epoque construction
		// Locations non meublées - Loyer de référence
		// Locations non meublées - Loyer de référence majoré
		// Locations non meublées - Loyer de référence minoré
		// Locations meublées - Loyer de référence
		// Locations meublées - Loyer de référence majoré
		// Locations meublées - Loyer de référence minoré
		colonnes = encadrement_valeurs[0];

		for (let i = 1; i < encadrement_valeurs.length; i++) {
			let lineCSV = encadrement_valeurs[i];
			
			let csvNbPiece = lineCSV[colonnes.indexOf("Nb pièces")];
			let csvEpoqueConst = lineCSV[colonnes.indexOf("Epoque construction")];
			let csvZone = lineCSV[colonnes.indexOf("Zone")];
			
			// console.log(csvNbPiece);
			// console.log(csvEpoqueConst);
			// console.log(csvZone);
			
			if(csvNbPiece==formNbPiece&&csvEpoqueConst==formEpoqueConst&&csvZone==formZone){
				for(j=0;j<type_loyer_ref.length;j++){
					let typeLoyer = type_loyer_ref[j];
					let valeurLoyer = lineCSV[colonnes.indexOf(formTypeLoc+" - "+typeLoyer)];
					d3.select("[cible='"+typeLoyer+"']").html(valeurLoyer);
				}
			}
		}
	
	}else{
		alert("Pour calculer, saisir les valeurs dans le formulaire sous 'Les éléments définis dans l'encadrement des loyer'")
	}

}


function maj_loyer(){
	let loyerMensuel = d3.select("#loyer_mensuel").node().value;
	let surface = d3.select("#surface").node().value;

	if(surface>0&&loyerMensuel>0){
		let prixMCarre = loyerMensuel/surface;
		d3.select("#valeur_loyer_m2").node().value = prixMCarre;
	}else{
		alert("Renseigner le montant du loyer et le nombre de mètre carrés")
	}
};


function maj_compare(){
	maj_form();
	maj_loyer();
	let monLoyer = d3.select("#valeur_loyer_m2").node().value;
	let loyerRefMinore = d3.select("[cible='"+type_loyer_ref[0]+"']").node().innerHTML;
	let loyerRef = d3.select("[cible='"+type_loyer_ref[1]+"']").node().innerHTML;
	let loyerRefMajore = d3.select("[cible='"+type_loyer_ref[2]+"']").node().innerHTML;
	
	console.log("___________________");
	console.log(monLoyer);
	console.log(loyerRefMinore);
	console.log(loyerRef);
	console.log(loyerRefMajore);
	console.log("___________________");
	if(parseFloat(monLoyer)<parseFloat(loyerRefMinore)){
		console.log("poutou");
		d3.select("#reponse").html("Non :)");
		d3.select("#reponse_detail").html("Ton loyer est en dessous du loyer de référence minoré");
		d3.selectAll(".imgPolitique").attr("src","img/poutou.jfif");
	}else if(parseFloat(monLoyer)<parseFloat(loyerRef)){
		console.log("melenchon");
		d3.select("#reponse").html("Non");
		d3.select("#reponse_detail").html("Ton loyer est en dessous du loyer de référence");
		d3.selectAll(".imgPolitique").attr("src","img/melenchon.jfif");
	}else if(parseFloat(monLoyer)<parseFloat(loyerRefMajore)){
		console.log("jadot");
		d3.select("#reponse").html("Ca passe encore");
		d3.select("#reponse_detail").html("Ton loyer est en dessous du loyer de référence majoré");
		d3.selectAll(".imgPolitique").attr("src","img/jadot.jfif");
	}else if(parseFloat(monLoyer)>parseFloat(loyerRefMajore)){
		console.log("darmanin");
		d3.select("#reponse").html("Oui !");
		d3.select("#reponse_detail").html("Ton loyer est au dessus du loyer de référence majoré");
		d3.selectAll(".imgPolitique").attr("src","img/darmanin.jfif");
	}
	
};

function getColor(d) {
	if(d=='1'){
		return 'blue'
	} else if(d=='2'){
		return 'green'
	} else if(d=='3'){
		return 'cyan'
	}else if(d=='4'){
		return 'orange'
	}else{
		return '#ffffff'
	}
}