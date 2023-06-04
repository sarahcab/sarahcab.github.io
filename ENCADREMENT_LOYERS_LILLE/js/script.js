/////////////--------------------Variables globales
///Géométriques
var width = 1500,
height = 1000,

///Graphiques
nuancier = ["#FFFFFF","#EEEEEE","#CCCCCC","#EEEEFF","#000000","#0000ff"],

///data
referentiel;


/////////////--------------------Fonctions
window.onload = initialize();
function initialize() {
	
	///Chargement des données
	queue()										
		.defer(d3.csv,"data/encadrement-des-loyers-a-lille-lomme-et-hellemmes-referentiel.csv")
		.defer(d3.csv,"../data/blop.csv")
		.await(callback0); 
	
	function callback0(error, dataReferentiel,blop){
		console.log(error);
		console.log(dataReferentiel);
		console.log(blop);

		drawMap();
		formulaire;
		
	}
	
	

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
	
	function zoomToFeature(e) {
		// map.fitBounds(e.target.getBounds());
		var zone = e.target.feature.properties.zonage;
		d3.select("#zone_form").html(zone);
	};
	
	function onEachFeature(feature, layer) {
		layer.on({
			mouseover: highlightFeature,
			mouseout: resetHighlight,
			click: zoomToFeature
		});
	}

	var geojson = L.geoJson(geojsonZonage, {
		style: style,
		onEachFeature: onEachFeature
	}).addTo(map);
	
	

	// L.geoJSON(geojsonZonage).addTo(map);
	
	
	///Géocoding
	L.Control.geocoder().addTo(map);
	
	
	
	

}

function formulaire(){
	d3.select("#form").on("click",function(){
		maj_form();
	})
}


function maj_form(){
	if(document.querySelector('input[name=nb_piece]:checked')&&document.querySelector('input[name=epoque_const]:checked')&& document.querySelector('input[name=type_loc]:checked')){
		
		var nb_piece = document.querySelector('input[name=nb_piece]:checked').value;
		var epoque_const = document.querySelector('input[name=epoque_const]:checked').value;
		var type_loc = document.querySelector('input[name=type_loc]:checked').value;
		
	}

}


// function getColor(d) {

    // return d = '1' ? 'blue' :
           // d = '2'  ? 'green' :
           // d = '3'  ? 'cyan' :
           // d = '4'  ? 'orange' :
		   // '#FFFFFF';
           // d > 50   ? '#FD8D3C' :
           // d > 20   ? '#FEB24C' :
           // d > 10   ? '#FED976' :
                      // '#FFEDA0';
// }


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