/////////////--------------------Variables globales
///Géométriques
let width = 1500,
height = 1000,
taille_div_map= "petite",

///Graphiques
nuancier = ["#FFFFFF","#EEEEEE","#CCCCCC","#EEEEFF","#000000","#0000ff"],
nuancier_resultat = ["#43D175","#D4E113","#FAAB02","#E10000"],

///data
referentiel;
const type_loyer_ref = ["Loyer de référence minoré","Loyer de référence","Loyer de référence majoré"];
let monLoyerReference = [0,0,0];
let etape=0;
let zone_choisie=false;
let formNbPiece,formEpoqueConst,formTypeLoc,formZone,loyerm2,loyerMensuel,surface,zone;


/////////////--------------------Fonctions
window.onload = initialize();
function initialize() {
	
	///Chargement des données
		fonctionnalites();
		suivant();
}

function fonctionnalites(){
	d3.select("#bouton_loyer_ref").on("click",function(){
		maj_form();
	})
	
	d3.selectAll("#titre_question").on("click",function(){
		maj_compare();
	})
	
	d3.select("#bouton_taille_carte").on("click",function(){
		taille_carte();
	})
	
	d3.selectAll(".calc_loyer").on("change",function(){
		if(this.value>0){
			d3.select(this).style("background",null)
		}else{
			d3.select(this).style("background","red")
		}
		if(etape>3&&etape<5){
			maj_loyer_m2();
		}else if (etape==5){
			maj_compare();
		}
			
	})
	

	d3.selectAll("fieldset")
	.style("color","blue")
	.on("click",function(){
		isChecked = false;
		inputs = d3.select(this).selectAll("input").each(function(){
			if(this.checked){
				isChecked = true;
			}
		})
		
		
		
		if(isChecked==true){
			d3.select(this)
				.transition()
				.duration(500)
				.style("color","#000000")
		}
		
		// if(etape>3){
			
			// if(formNbPiece == document.querySelector('input[name=nb_piece]:checked').value&&
				// formEpoqueConst == document.querySelector('input[name=epoque_const]:checked').value&&
				// formTypeLoc == document.querySelector('input[name=type_loc]:checked').value&&
				// formZone == document.querySelector('#zone_form').innerHTML
			// ){
				
				
			// }else{
				// d3.select(this)
					// .transition()
					// .duration(500)
					// .style("opacity",1)
				if (etape==5){
					maj_compare();
				}
				
			// }
		// }
		
		
	})
	
	d3.select("#fd_zone").selectAll("input,label").on("click",function(){
		// if(this.id =="fd_zone"){
				zone = document.querySelector('input[name=zone_carte]:checked').value;
				d3.select("#zone_form").html(zone).style("color",getColor(zone)).style("font-weight","800");
				d3.select("#zone_form_plus").html("").style("color",getColor(zone));
				zone_choisie = true
			// }
	})
}


function suivant(){
	d3.select("#bouton_suivant").on("click",function(){
		console.log("___________________________")
		console.log("Etape initiale : "+etape)
		
		if(etape==0){
			if(document.querySelector('input[name=type_loc]:checked')){
				d3.selectAll("#fd_epoque_construction").style("display","block");
				etape=1
			}else{
				alert("Renseigner le type de location pour passer à la suite")
			}
			
		} else if(etape==1){
			if(document.querySelector('input[name=epoque_const]:checked')){
				d3.selectAll("#fd_nb_piece").style("display","block");
				etape=2;
			}else{
				alert("Renseigner l'époque de construction pour passer à la suite");
			}
		} else if(etape==2){
			if(document.querySelector('input[name=nb_piece]:checked')){
				d3.selectAll("#fd_zone").style("display","block");
				drawMap();
				etape=3;
			}else{
				alert("Renseigner le nombre de pièces pour passer à la suite");
			}
		}else if(etape==3){
			if(zone_choisie==true){
				d3.select("#mon_loyer").style("display","block");
		
			
				maj_form();
				
				etape=4;
			}else{
				alert("Cliquer sur une zone dans la carte ou utiliser la loupe pour chercher une adresse");
			}
		// }else if(etape==4){
			
			// etape=5;
		}else if(etape==4){
			d3.select("#loyers_reference").style("display","block");
			loyerMensuel = d3.select("#loyer_mensuel").node().value;
			surface = d3.select("#surface").node().value;

			if(surface>0&&loyerMensuel>0){
				maj_loyer_m2();
			
				etape = 5;
				d3.select("#bouton_suivant").style("display","none")
				// d3.select("#bouton_suivant").attr("value","Actualiser")
				maj_compare();
			}else{
				alert("Renseigner le montant du loyer et le nombre de mètre carrés")
			}
			
			
			
			// window.scrollTo(0);
			
		} 
		// else if (etape==6){
			// maj_compare();
			// d3.select("#bouton_suivant").attr("display","none");
		// }
		
		console.log("Etape : "+etape)
	})
}

function drawMap(){
	//////Carte
	var map = L.map('map').setView([50.638139, 3.079429], 13);
	
	L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
		maxZoom: 19,
		attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
	}).addTo(map);
	
	
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
					zone = memberLayer.feature.properties.zonage;
					console.log(memberLayer.feature.properties);
					d3.select("#zone_form").html(zone).style("color",getColor(zone)).style("font-weight","800");
					d3.select("#zone_form_plus").html(adresse).style("color",getColor(zone));
					zone_choisie=true;
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
	
	draw_legend();
	

}

function draw_legend(){
	 for(i=1;i<5;i++){
		let fill = getColor(i);
		d3.select("#zone_"+i).style("accent-color",fill)
	 }
	for(i=1;i<5;i++){
		let fill = getColor(i);
		d3.select("#legend").append("span")
			.html("_____")
			.style("color",fill)
			.style("background",fill)
			.style("margin-left","2em")
			.style("opacity",0.4)
			.style("font-size","0.8em")
			.attr("zone",i)
			// .style("cursor","pointer")
			// .on("mouseover",function(){
				// d3.select(this).style("opacity",0.7)
			// })
			// .on("mouseout",function(){
				// d3.select(this).style("opacity",0.4)
			// })
			// .on("click",function(){
				// zone = this.attributes.zone.value;
				// d3.select("#zone_form").html(zone).style("color",getColor(zone)).style("font-weight","800");
				// d3.select("#zone_form_plus").html("Cliqué sur la légende").style("color",getColor(zone));
				// zone_choisie = true
			// })
			
			
			
		d3.select("#legend").append("span")
			.html("Zone "+i)
			.style("margin-left","0.4em")	
			.style("font-size","0.8em")
			
		
	}
	
}
	
	



function maj_form(){
	if(zone_choisie==true&&document.querySelector('input[name=nb_piece]:checked')&&document.querySelector('input[name=epoque_const]:checked')&& document.querySelector('input[name=type_loc]:checked')){
		formNbPiece = document.querySelector('input[name=nb_piece]:checked').value;
		formEpoqueConst = document.querySelector('input[name=epoque_const]:checked').value;
		formTypeLoc = document.querySelector('input[name=type_loc]:checked').value;
		formZone = document.querySelector('#zone_form').innerHTML;
		
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
					monLoyerReference[j] = valeurLoyer;
					
					d3.select("[cible='"+typeLoyer+"']").html(valeurLoyer+" €/m²");
					if(surface>0&&etape>=4){
						d3.select("[cible='"+typeLoyer+" - surface']").html((valeurLoyer*surface).toFixed(2)+" €");
					}
				}
			}
		}
	
	}else{
		alert("Pour calculer, saisir les valeurs dans le formulaire sous 'Les éléments définis dans l'encadrement des loyer'")
	}
	
	d3.select("#loyers_reference")
		.style("opacity",0)
		.transition()
		.duration(500)
		.style("opacity",1)

	// d3.select("#bouton_loyer_ref").attr("disabled","disabled").attr("class","bouton")
}


function maj_loyer_m2(){
	loyerMensuel = d3.select("#loyer_mensuel").node().value;
	surface = d3.select("#surface").node().value;

	if(surface>0&&loyerMensuel>0){
			
		loyerm2 = loyerMensuel/surface;
		d3.select("#valeur_loyer_m2").html((loyerm2).toFixed(2)).style("color","#000000");
		d3.select("#loyer_m2").style("display","block");
		
		
	}else{
		loyerm2 = null;
		d3.select("#valeur_loyer_m2").html("Manque surface et loyer").style("color","red");
		
		
	}
	
};


function maj_compare(){
	
	maj_form();
	maj_loyer_m2();
	
	
	let loyerRefMinore = monLoyerReference[0];
	let loyerRef = monLoyerReference[1];
	let loyerRefMajore = monLoyerReference[2];
	// let loyerRefMinore = d3.select("[cible='"+type_loyer_ref[0]+"']").node().innerHTML;
	// let loyerRef = d3.select("[cible='"+type_loyer_ref[1]+"']").node().innerHTML;
	// let loyerRefMajore = d3.select("[cible='"+type_loyer_ref[2]+"']").node().innerHTML;
	
	console.log("___________________");
	console.log(loyerm2);
	console.log(loyerRefMinore);
	console.log(loyerRef);
	console.log(loyerRefMajore);
	console.log("___________________");
	
	d3.select("#div_resultat")
		.style("display","block")
		.style("opacity",0)
		
	if(parseFloat(loyerm2)<parseFloat(loyerRefMinore)){
		console.log("poutou");
		d3.select("#reponse").html("Non").style("color",nuancier_resultat[0]);
		d3.select("#reponse_detail").html("Ton loyer est en dessous du loyer de référence minoré").style("color",nuancier_resultat[0]);
		d3.select("#loyer_trop").html("");
	}else if(parseFloat(loyerm2)<parseFloat(loyerRef)){
		console.log("melenchon");
		d3.select("#reponse").html("Non").style("color",nuancier_resultat[1]);
		d3.select("#reponse_detail").html("Ton loyer est en dessous du loyer de référence").style("color",nuancier_resultat[1]);
		d3.select("#loyer_trop").html("");
	}else if(parseFloat(loyerm2)<parseFloat(loyerRefMajore)){
		console.log("jadot");
		d3.select("#reponse").html("Non").style("color",nuancier_resultat[2]);
		d3.select("#reponse_detail").html("Ton loyer au dessus du loyer de référence mais en dessous du loyer de référence majoré").style("color",nuancier_resultat[2]);
		d3.select("#loyer_trop").html("");
	}else if(parseFloat(loyerm2)>parseFloat(loyerRefMajore)){
		console.log("darmanin");
		console.log(loyerm2)
		console.log(loyerm2-loyerRefMajore)
		console.log(surface)
		let loyerTrop = (loyerm2-loyerRefMajore)*surface;
		d3.select("#reponse").html("Oui !").style("color",nuancier_resultat[3]);
		d3.select("#reponse_detail").html("Ton loyer est au dessus du loyer de référence majoré!").style("color",nuancier_resultat[3]);
		d3.select("#loyer_trop").style("color",nuancier_resultat[3]).html("Ton loyer dépasse le loyer majoré de <span style='font-weight:800'>"+loyerTrop.toFixed(2)+" €</span>, des recours existent pour faire baisser ton loyer. Tu peux consulter le lien ci-dessous pour en savoir plus.").style("color",nuancier_resultat[3]);
	}
	
	d3.select("#div_resultat")
		.transition()
		.duration(500)
		.style("opacity",1)
	
};

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

function taille_carte(){
	if(taille_div_map=="grande"){
		d3.select("#map").transition().duration(500).style("height","180px");
		taille_div_map="petite";
		d3.select("#bouton_taille_carte").attr("value","Agrandir la carte");
	}else{
		d3.select("#map").transition().duration(500).style("height","500px");
		taille_div_map="grande";
		d3.select("#bouton_taille_carte").attr("value","Réduire la carte");
	}
	
}