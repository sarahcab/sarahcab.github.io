//////////////////////////Variables/////////////


window.onload = initialize();

//////////////////////////fonctions/////////////
function initialize(){
	
	// /******************Ajout de la carte *****/
	// var map = L.map('map').setView([46.2, 2], 5);

	// /******************Ajout du fond de carte*****/
	// var osm_tile = L.tileLayer('//{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
		// attribution: 'donn&eacute;es &copy; <a href="//osm.org/copyright">OpenStreetMap</a>/ODbL - rendu <a href="//openstreetmap.fr">OSM France</a>',
		// minZoom: 1,
		// maxZoom: 20
	// });
	// var Stamen_TonerLite = L.tileLayer('http://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.{ext}', {
		// attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
		// subdomains: 'abcd',
		// minZoom: 0,
		// maxZoom: 40,
		// ext: 'png'
	// });

	
	// osm_tile.addTo(map);
	
	var map = L.map('map').setView([51.505, -0.09], 13);

L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

L.marker([51.5, -0.09]).addTo(map)
    .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
    .openPopup();
}
