var chapitres=["Général","Description","Usage","Histoire","protection","Transformation","Photographies","Evènements"],
partie = "",
sizeI = 500, //vb de la fenêtre info
sizeC = 300, //taille de l'espace des chapitres
mar_yC = 40, //marge en y de l'espace des chaptires
esp_yC =27, //Espace entre les chapitres
ecp=9,
modele_variable,
datasite,
ect=ecp*2,
map,
chem,
xmin,
xmax,									
ymin,
commune,
nuts,
chemineur,
bloo,
varnuts,
pointNewChem,
affichage,
mapindic=false,
phrase_selectsite = "Localiser sur la carte - sélectionner un site",
phrase_localchem = "Localiser sur la carte",
phrase_suite = "Passer à la suite",
identifiant_chemineur,
ls_var_chem=[],
ls_var_site=[],
ls_var_auteur=[],
ls_var_communes=[],
ls_var_nuts=[],
zoomNuts=8,
zoomComm=13,
MODEMAP="observation",
X,
Y,
verrouillage=false,
// formu,

clock,									
ymax;
// TL,
// Esri_WorldImagery;


var ls_it=[];
var ls_it2=[];

var TL = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
	attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
})
	
var Esri_WorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
});

var geojsonMarkerOptions = {
	radius: 8,
	fillColor: "#ff7800",
	color: "#000",
	weight: 1,
	cursor:"pointer",
	opacity: 1,
	fillOpacity: 0.8
};

var myIcon = L.icon({
	iconUrl: 'img/cheminee.png',
	iconSize: [48,55],
	iconAnchor: [18,53],
	popupAnchor:  [0, -53]
});
var myIcon2 = L.icon({
	iconUrl: 'img/chemineur.png',
	iconSize: [23,23],
	iconAnchor: [11.5,11.5],
	popupAnchor:  [0, -11.5]
});

var myIconNew = L.icon({
	iconUrl: 'img/newchem.png',
	iconSize: [48,55],
	iconAnchor: [18,53],
	popupAnchor:  [0, -53]
});

//////////////////////////Variables/////////////


window.onload = initialize();

//////////////////////////fonctions/////////////
function initialize(){
	queue()	//chargement des donénes					 
		.defer(d3.csv, "data/modele_chem.csv") //modèle de données pour es cheminées
		// .defer(d3.json, "data/sites.geojson") //couche site utilisée sans la géométrie
		.await(callback0);
		
	function callback0(error,datata){
		modele_variable = datata;
		make_ls_var();
		resize();
		window.onresize=function(){
			resize();
		}
		makemap();
		drawInit();
	}
}

function drawInit(){
	choixChapitres();
	build_afficheInfo();
	boutons();	
}
function choixChapitres(){
	d3.select("#cont_plus")
		.append("div")
		.attr("id","tout_infos")
		.append("div")
		.attr("id","head")
		.style("display","flex")
		.append("div")
		.attr("id","legende_car")
		// .attr("viewBox","0 0 100 200")
		.style("width","30%")

	d3.select("#head")
		.append("h2")
		.style("width","67%")
		.attr("id","titre_fiche");
	
	d3.select("#cont_plus")
		.append("div")
		.attr("id","tout_infos2")
		.style("display","none")
		.append("h2")
		.attr("id","titre_fiche2");
		
	d3.select("#tout_infos")
		.append("svg")
		.style("width","100%")
		.attr("viewBox","100 0 "+sizeI+" 140")
		.attr("id","fen_choix")
		.append("g")
		.attr("id","fonds")

		.append("rect")
		.attr("id","fond_choix")
		.attr("x",(sizeI-sizeC)/2+20)
		.attr("y",mar_yC*0.5)
		.attr("fill","#ffffff")
		.attr("width",sizeC)
		.attr("height","110")
		.attr("opacity",0.7)
		
	var xg = sizeI/2-ecp,
	xd = sizeI/2+ecp*1,
	yh = mar_yC-20,
	yb = mar_yC-20+esp_yC*chapitres.length/2;
	
	d3.select("#fonds").append("rect").attr("fill","#ffffff").attr("opacity",0.7).attr("height",30)
		.attr("x",sizeI-50)
		.attr("y",yh*1+11)
		.attr("width",115)

	d3.select("#fonds").append("rect").attr("fill","#ffffff").attr("opacity",0.7).attr("height",30)
		.attr("x",sizeI-50)
		.attr("y",yb-49)
		.attr("width",117)

	d3.select("#fen_choix")
		.append("g")
		.attr("id","chaps")
		.append("line").attr("x1",xg).attr("x2",xg).attr("y1",yh).attr("y2",yb).attr("stroke","#000000").attr("stroke-width",0.3)
	d3.select("#chaps")
		.append("line").attr("x1",xd).attr("x2",xd).attr("y1",yh).attr("y2",yb).attr("stroke","#000000").attr("stroke-width",0.3)
		
	d3.select("#chaps")
		.append("text")
		.text("INFORMATIONS")
		.attr("x",xg-sizeC/2+24)
		.attr("y",yb)
		.attr("transform","rotate(-90 "+(xg-sizeC/2+24)+" "+(yb)+")")
		.attr("font-size",16)
		.attr("font-weight",500)

	// d3.select("#chaps").append("text").attr("font-size",16).attr("font-weight",500).style("cursor","pointer").attr("class","hl_bout")
		// .text("CONTRIBUER")
		// .attr("x",sizeI-40)
		// .attr("y",yh*1+30)
		
	// d3.select("#chaps").append("text").attr("font-size",16).attr("font-weight",500).style("cursor","pointer").attr("class","hl_bout")
		// .text("RECHERCHER")
		// .attr("x",sizeI-40)
		// .attr("y",yb-30)
		
	d3.select("#chaps")
		.selectAll(".chap")
		.data(chapitres)
		.enter()
		.append("g")
		.attr("class","chap")
		.style("cursor","pointer")
		.on("mouseover",function(){
			d3.select(this)
				.select("circle")
				.transition()
				.duration(200)
				.attr("r",7)
				.attr("fill","#ffffff")
				.attr("stroke-width",3)
			
			d3.select(this)
				.select("text")
				.attr("font-weight",200)
				.transition()
				.duration(200)
				.attr("font-size",25)
				.attr("x",function(d,i){
					var x = this.attributes.x2.value;
					return x;
				})	
		})
		.on("mouseout",function(){
			d3.select(this)
				.select("circle")
				.transition()
				.duration(200)
				.attr("r",5)
				.attr("fill","#2c318e")
				.attr("stroke-width",0)
			
			d3.select(this)
				.select("text")
				.attr("font-weight",500)
				.transition()
				.duration(200)
				.attr("font-size",16)
				.attr("x",function(d,i){
					var x = this.attributes.x1.value;
					return x;
				})		
		})
		.on("click",function(){
			partie=(this.id).split("_")[1];
			majChap();
			
		})
		.attr("id",function(d){
			return "g_"+d;
		})
		.append("text")
		.attr("y",function(d,i){
			return mar_yC+(i%4)*esp_yC;
		})
		.attr("font-size",16)
		.attr("font-weight",500)
		.attr("id",function(d,i){
			return "chap"+i;
		})
		.text(function(d){
			return d
		})
		.attr("x",0)
		.attr("x1",function(d,i){
			var cic = (this.innerHTML).length*10;
			return sizeI/2-ect+Math.trunc(i/4)*ect*2-cic*(1-Math.trunc(i/4));
		})	
		.attr("x2",function(d,i){
			d3.select(this).attr("font-weight",200)
				.attr("font-size",25)
				
			// var bbox = d3.select(this).node().getBBox();
			// return sizeI/2-ect+Math.trunc(i/4)*ect*2-bbox.width*(1-Math.trunc(i/4));
			
			var cic = (this.innerHTML).length*10;
			return sizeI/2-ect+Math.trunc(i/4)*ect*2-cic*(1-Math.trunc(i/4));
		})	
		.attr("x",function(d,i){
			var x = this.attributes.x1.value;
			return x;
		})			
		.attr("font-size",16)
		.attr("font-weight",500)
		
	d3.selectAll(".chap")
		.append("circle")
		.attr("cx",function(d,i){
			return sizeI/2-ecp+Math.trunc(i/4)*ecp*2;
		})
		.attr("cy",function(d,i){
			return mar_yC+(i%4)*esp_yC-6;
		})
		.attr("r",5)
		.attr("fill","#2c318e")
		.attr("stroke","#797ee0")
		.attr("stroke-width",0)
		
	///Légende
	d3.select("#legende_car").selectAll("div")
		.data([["img/cheminee2.png","Cheminée sélectionnée"],["img/cheminee3.png","Autres cheminées du site"]])
		.enter()
		.append("div")
		.style("display","flex")
		.style("width","100%")
		.each(function(d){
			d3.select(this)
				.append("img")
				.attr("src",d[0])
				.style("width","40%")
				.style("height","20%")
			d3.select(this)
				.append("p")
				.html(d[1])
				.style("width","50%")
				.style("font-size","10px")
		})
	
	
	d3.select("#tout_infos").style("display","none")
}

function build_afficheInfo(){
	for(c=0;c<chapitres.length;c++){
		d3.select("#tout_infos").append("div").attr("id","d_"+chapitres[c]).attr("class","div_info").style("display","none")
		d3.select("#d_Général").style("display","block")
	}
	d3.select("#tout_infos2").append("div").attr("id","d_Chemineurs")//.attr("class","div_info")//.style("display","none")
	
	d3.select("#d_Photographies")
		.append("div")
		.attr("id","div_photo")
		.style("display","flex")
		.append("svg")
		.attr("id","svg_photos")
		.attr("width","40%")
		.attr("viewBox","-5 0 80 200")
		.append("text")
		.attr("id","indic_typephoto")
		.attr("x",75)
		.attr("y",59)
		.attr("font-size",12)
		.attr("transform","rotate(-90 75 59)")
	
	d3.select("#div_photo")
		.append("div")
		.attr("id","cont_main_photo")
		.style("margin-left","1%")
		.style("width","55%")
		.append("img")
		.attr("width","100%")
		.attr("id","main_photo")
		
	d3.select("#div_photo")
		.append("p")
		.attr("id","indic_none_p")
		.style("font-size",25)
		.style("text-align","center")
		.style("margin-top","10%")
		.html("Pas de photo")

	idfam=0;
	for(i=0;i<modele_variable.length;i++){
		famille=modele_variable[i].famille;
		if(modele_variable[i].type!="invisible"){
			if(modele_variable[i].site=="oui"){ 
				var tar="targetedsite"
			}else{
				var tar="targeted"
			}
			// if(modele_variable[i].type=="fam"){
				// idfam++;
				// d3.select("#d_"+famille)
					// .append("ul")
					// .attr("class","elmt")
					// .html(modele_variable[i].Description)
					// .attr("id","fam"+idfam)
					// .append("li")
					// .attr("id",modele_variable[i].variable)
					// .attr("lab","")
					// .attr("class","elmt "+tar)
					// .attr("position",modele_variable[i].position)
					// .attr("type",modele_variable[i].type)
			// } else if(modele_variable[i].type=="in_fam"){
				// d3.select("#fam"+idfam)
					// .append("li")
					// .attr("id",modele_variable[i].variable)
					// .attr("class","elmt "+tar)
					// .attr("lab",modele_variable[i].Description)
					// .attr("position",modele_variable[i].position)
					// .attr("type",modele_variable[i].type)
					// .html(modele_variable[i].Description) //virer
			// }else{
				var elmt;
				if(modele_variable[i].type=="cochage"){
					elmt = "ul";
				} else {
					elmt="li";
				}
				d3.select("#d_"+famille)
					.append(elmt)
					.attr("id",modele_variable[i].variable)
					.attr("class","elmt")
					.attr("tar",tar)
					.attr("lab",modele_variable[i].Description)
					.attr("position",modele_variable[i].position)
					.attr("type",modele_variable[i].type)
					.html(modele_variable[i].Description) //virer
			// }
		}
	}
}

function majChap(){
	d3.selectAll(".div_info").style("display","none")
	d3.select("#d_"+partie).style("display","block")
}

//trucs de forme
function resize(){
	d3.select('#mapid').style('height',window.innerHeight*0.8+'px')
}

function is_touch_device(){
	try{
		document.createEvent("TouchEvent");
		return true;
	} catch(e) {
		return false
	}
}

function makemap(){
	
	
	// map = L.map('mapid').setView([50.681945, 3.186629], 17);
	map = L.map('mapid').setView([50.6302198, 3.1172083], 17);
	
	
	affichage = "cheminee";
	TL.addTo(map);
	L.control.scale().addTo(map);
	
	
	recharge_data();
}

function recharge_data(){
	console.log("affichage"+affichage+" "+map._zoom)
	if(affichage=="cheminee"){
		
		$.ajax({
			type : 'POST',
			url : 'php/request_chem.php',
			dataType: 'json',
			data:{
				xmin : map.getBounds()._southWest['lat'],
				xmax : map.getBounds()._northEast['lat'],									
				ymin : map.getBounds()._southWest['lng'],									
				ymax : map.getBounds()._northEast['lng'],
				lsvar : ls_var_chem
			},
			success : function(msg){
				console.log(msg.length + ' résultats trouvés !')
				chem = {									
					'type' : 'FeatureCollection',
					'crs' : {
						'type': 'name',
						'properties':{
							'name' : 'EPSG:4326'				
						}
					},
					'features':msg
				};		
			},
			complete : function(msg){
				ajax2();
			},
			error : function(msg,statut){
				alert("Erreur:")
				console.log(statut);
				console.log(msg)
			}
		})
		function ajax2(){
			$.ajax({
				type : 'POST',
				url : 'php/request_site.php',
				dataType: 'json',
				data:{
					xmin : map.getBounds()._southWest['lat'],
					xmax : map.getBounds()._northEast['lat'],									
					ymin : map.getBounds()._southWest['lng'],									
					ymax : map.getBounds()._northEast['lng'],	
					lsvar : ls_var_site				
				},
				success : function(msg){
					console.log(msg.length + ' résultats trouvés !')
					datasite = {									
						'type' : 'FeatureCollection',
						'crs' : {
							'type': 'name',
							'properties':{
								'name' : 'EPSG:4326'				
							}
						},
						'features':msg
					};	
					
					// console.log(msg)
				},
				complete : function(msg){	
					// ajax3();
					fonctionsCarto();
					
					// commune.remove()
					// bloo.remove()
					// clock.addTo(map);
					
				},
				error : function(msg,statut){
					alert("Erreur::")
					console.log(statut);
					console.log(msg)
				}
			})
		}
	} else if (affichage=="chemineur"){
		ajax3();
	} else  if (affichage=="commune") {
		ajax4();
	}else  if (affichage=="nuts") {
		ajax5();
	}
}

function ajax3(){
	$.ajax({
		type : 'POST',
		url : 'php/request_chemineurs.php',
		dataType: 'json',
		data:{
			xmin : map.getBounds()._southWest['lat'],
			xmax : map.getBounds()._northEast['lat'],									
			ymin : map.getBounds()._southWest['lng'],									
			ymax : map.getBounds()._northEast['lng'],	
			lsvar : ls_var_auteur			
		},
		success : function(msg){
			console.log(msg.length + ' résultats trouvés !')
			chemineur = {									
				'type' : 'FeatureCollection',
				'crs' : {
					'type': 'name',
					'properties':{
						'name' : 'EPSG:4326'				
					}
				},
				'features':msg
			};	
			// console.log(msg)
		},
		complete : function(msg){	
			fonctionsCarto();
			clock.remove();
			var myIcon = L.icon({
				iconUrl: 'img/cheminee.png',
				iconSize: [40,25],
				iconAnchor: [15,24],
				popupAnchor:  [0, -24]
			});
			
			clock = L.geoJSON(chem, {
				pointToLayer: function (feature, latlng) {
					return L.marker(latlng, {icon: myIcon});
				},
				onEachFeature : target
			}).addTo(map)
			
			commune.remove();
			bloo.addTo(map);
			
		},
		error : function(msg,statut){
			alert("Erreur:::")
			console.log(statut);
			console.log(msg)
		}
	})
}
function ajax4(){
	$.ajax({
		type : 'POST',
		url : 'php/request_communes.php',
		dataType: 'json',
		data:{
			xmin : map.getBounds()._southWest['lat'],
			xmax : map.getBounds()._northEast['lat'],									
			ymin : map.getBounds()._southWest['lng'],									
			ymax : map.getBounds()._northEast['lng'],	
			lsvar : ls_var_communes				
		},
		success : function(msg){
			console.log(msg.length + ' résultats trouvés !')
			comm = {									
				'type' : 'FeatureCollection',
				'crs' : {
					'type': 'name',
					'properties':{
						'name' : 'EPSG:4326'				
					}
				},
				'features':msg
			};	
			console.log("---------comm-------");
			console.log(comm);
			// console.log("---------comm_anc------");
			// console.log(comm_anc);
		},
		complete : function(msg){	
			fonctionsCarto();
			// if(bloo){
				// bloo.remove();
			// }
			// if(clock){
				// clock.remove();
			// }
			// commune.addTo(map);
		},
		error : function(msg,statut){
			alert("Erreur::::")
			console.log(statut);
			console.log(msg)
		}
	})
}

function ajax5(){
	$.ajax({
		type : 'POST',
		url : 'php/request_nuts.php',
		dataType: 'json',
		data:{
			xmin : map.getBounds()._southWest['lat'],
			xmax : map.getBounds()._northEast['lat'],									
			ymin : map.getBounds()._southWest['lng'],									
			ymax : map.getBounds()._northEast['lng'],	
			lsvar : ls_var_nuts				
		},
		success : function(msg){
			console.log(msg.length + ' résultats trouvés !')
			nuts = {									
				'type' : 'FeatureCollection',
				'crs' : {
					'type': 'name',
					'properties':{
						'name' : 'EPSG:4326'				
					}
				},
				'features':msg
			};	
			console.log(nuts);
		},
		complete : function(msg){	
			fonctionsCarto();
			// if(bloo){
				// bloo.remove();
			// }
			// if(clock){
				// clock.remove();
			// }
			// commune.addTo(map);
		},
		error : function(msg,statut){
			alert("Erreur::::nuts")
			console.log(statut);
			console.log(msg)
		}
	})
}

function fonctionsCarto(){
		if(commune){
			commune.remove();
		}
		if(affichage=="commune"){
			commune = L.geoJSON(comm, {
				style:{
					fillColor: '#ffff00',
					opacity:0.5
				},
				onEachFeature : target3
			}).addTo(map);
		}
		
		if(varnuts){
			varnuts.remove();
		}
		if(affichage=="nuts"){
			varnuts = L.geoJSON(nuts, {
				style:{
					fillColor: '#00ff00',
					opacity:0.5
				},
				onEachFeature : target3
			}).addTo(map);
		}
		
		if(clock){
			clock.remove();
		}
		if(affichage=="cheminee"){
			clock = L.geoJSON(chem, {
				pointToLayer: function (feature, latlng) {
					return L.marker(latlng, {icon: myIcon});
				},
				onEachFeature : target
			}).addTo(map);
		}
		if(bloo){
			bloo.remove();
		}
		if(affichage=="chemineur"){
			bloo = L.geoJSON(chemineur, {
				pointToLayer: function (feature, latlng) {
					return L.marker(latlng, {icon: myIcon2});
				},
				onEachFeature : target2
			});
		}
		

		
		
		
}


function target(feature, layer) {
	layer.on({
		mouseover: infos_min,
		mouseout: del_min,
		click: infos_max,
	});
	
};
function target2(feature, layer) {
	layer.on({
		mouseover: infos_min2,
		mouseout: del_min2,
		click: infos_max2,
	});
	
};
function target3(feature, layer) {
	layer.on({
		mouseover: infos_min3,
		mouseout: del_min3,
		click: zoomToFeature,
	});
	
};


function infos_min(e){
	ls_it=[];
	d3.select(e.target._icon).attr("class","leaflet-marker-icon leaflet-zoom-animated leaflet-interactive nb") //.attr("class","leaflet-marker-icon leaflet-zoom-animated leaflet-interactive nb")
	var props = e.target.feature.properties;
	i=0;
	for(j in clock._layers){
		// alert(j);
		var ID = chem.features[i].properties['id'];
		if(ID.split("_")[0]+"_"+ID.split("_")[1]+"_"+ID.split("_")[2]==(props.id).split("_")[0]+"_"+(props.id).split("_")[1]+"_"+(props.id).split("_")[2]){
			ls_it.push(j);
			d3.select(clock._layers[j]._icon).attr("class","leaflet-marker-icon leaflet-zoom-animated leaflet-interactive nb");
		}
		i++;
	}
	
	if(props.nbphsit>0){
		var idPhoto = (props.id).split("_")[0]+"_"+(props.id).split("_")[1]+"_"+(props.id).split("_")[2]+"_99_01"
	} else {
		var idPhoto = props.id+"_01"
	}
	if(props.nbphsit==0&&props.nbphind==0){
		e.target.bindPopup(props.nomChem+" - " +props.nomSitHist+" - "+props.nomSitUsa+" (Pas de photo)").openPopup();
	} else {
		e.target.bindPopup(props.nomChem+" - " +props.nomSitHist+" - "+props.nomSitUsa+"<img class='img_min pu_"+props.id+"' src='img/"+idPhoto+".jpg'/>").openPopup();
	}
};

function infos_min2(e){
	d3.select(e.target._icon).style("opacity",0.75)
	var props = e.target.feature.properties;
	ls_ch = (props.cheminees).split("__")
	for(C in ls_ch){
		chem_id=ls_ch[C];
	
		i=0;
		for(j in clock._layers){ //à voir pour mettre les data à la place
			var ID = chem.features[i].properties['id'];
			if(ID.split("_")[0]+"_"+ID.split("_")[1]+"_"+ID.split("_")[2]==(chem_id).split("_")[0]+"_"+(chem_id).split("_")[1]+"_"+(chem_id).split("_")[2]){
				var ind=61+i*1;
				ls_it2.push(j);
				d3.select(clock._layers[j]._icon).attr("class","leaflet-marker-icon leaflet-zoom-animated leaflet-interactive nb");
			}
			i++;
		}
	}

};

function infos_min3(e){
	d3.select(e.target._path).style("opacity",1)
	var props = e.target.feature.properties;
	i=0;
	e.target.bindPopup(props.name+" : " +props.nbr_site+" site(s) - "+props.nbr_chem+" cheminée(s)").openPopup();
}

function del_min(e){
	d3.select(e.target._popup._container).remove();//leaflet-popup  leaflet-zoom-animated
	for(i in ls_it){
		if(clock._layers[ls_it[i]]){}else{
			alert("erreur sur le désurvol");
			console.log(ls_it[i]);
			console.log(clock._layers);
		}
		d3.select(clock._layers[ls_it[i]]._icon).attr("class","leaflet-marker-icon leaflet-zoom-animated leaflet-interactive")
	}
	ls_it=[];
	
};	

function del_min2(e){
	for(i in ls_it2){
		d3.select(clock._layers[ls_it2[i]]._icon).attr("class","leaflet-marker-icon leaflet-zoom-animated leaflet-interactive")
	}
	ls_it2=[];
	d3.select(e.target._icon).style("opacity",1)
	
};

function del_min3(e){
	d3.select(e.target._path).style("opacity",0.5)
	e.target.closePopup();
}


function infos_max2(e){
	commune.eachLayer(function (layer) {
		layer._path.style.display = 'none';
	});
		
	var props = e.target.feature.properties;
	console.log(props)
	
	d3.select("#if_formulaire").style("display","none");
	
	
	d3.selectAll(".leaflet-marker-icon")
		.attr("src",function(){
			if(this.attributes.src){
				if(this.attributes.src.value=="img/cheminee2.png"||this.attributes.src.value=="img/cheminee3.png"){
					return "img/cheminee.png";
				} else if(this.attributes.src.value=="img/chemineur2.png"){
					return "img/chemineur.png";
				} else {
					return this.attributes.src.value;
				}
			}
		})
	
	d3.select(e.target._icon).attr("src","img/chemineur2.png")
	
	
	///Général
	d3.select("#tout_infos2").style("display","block").transition().duration(200).style("opacity",1)
	d3.select("#tout_infos").style("display","none")
	
	///Titre
	if(props["nomstru"]){
		d3.select("#titre_fiche2").html(props["nomstru"]).style("font-style","")
	} else if(props["nomsitusa"]){
		d3.select("#titre_fiche2").html(props["nomperso"]+" "+props["prenom"]).style("font-style","")
	} else if(props["prenom"]){
		d3.select("#titre_fiche2").html(props["prenom"]).style("font-style","")
	} else {
		d3.select("#titre_fiche2").html("Nom non-renseigné").style("font-style","italic")
	}
	
	///Eléments
	for(i=0;i<modele_variable.length;i++){
		var vari="";
		var vari_maj = (modele_variable[i].variable);
		var vari = (modele_variable[i].variable).toLowerCase();
		
		d3.select("#"+vari_maj)
			.style("display",function(){
				
				if(props[vari]){
					return "list-item"
				} else {
					return "none"
					
				}
			})
			.html(function(){
				if(props[vari]){
					if((this.attributes.style.value).indexOf("display: none")==-1){
						if(this.attributes.position.value=="avant"){
							return this.attributes.lab.value + "<span class='targeted'>"+props[vari]+"</span>";
						} else {
							return "<span class='targeted'>"+props[vari]+"</span>" + this.attributes.lab.value;
						}
					}
				}
				
			})
		
			
	}
	
	///Liste cheminées (factoriser)
	d3.selectAll("leaflet-marker-icon")
		.attr("src",function(){
			if(this.attributes.src){
				if(this.attributes.src.value=="img/cheminee2.png"){
					return "img/cheminee.png";
				}
			}
		})
		
	ls_ch = (props.cheminees).split("__")
	for(C in ls_ch){
		chem_id=ls_ch[C];
		
		i=0;
		for(j in clock._layers){
			var ID = chem.features[i].properties['id'];
			if(ID==chem_id){
				var ind=61+i*1;
				ls_it.push(j);
				d3.select(clock._layers[j]._icon).attr("src","img/cheminee2.png");
			}
			i++;
		}
	}
}

function aff_chemineur() {
	affichage = "chemineur";
	recharge_data();


		
}
function del_chemineur() {
	// if(map._zoom<zoomNuts){
		// affichage = "nuts";
	// } else if(map._zoom<zoomComm){
		affichage = "cheminee"; //oui vu que le truc est bloqué quand on est en dézoom
	// } else {
		// affichage = "site";
	// };
	
	recharge_data();
	bloo.remove()
	
	clock.remove();
	var myIcon = L.icon({
		iconUrl: 'img/cheminee.png',
		iconSize: [48,55],
		iconAnchor: [18,53],
		popupAnchor:  [0, -53]
	});
	
	clock = L.geoJSON(chem, {
		pointToLayer: function (feature, latlng) {
			return L.marker(latlng, {icon: myIcon});
		},
		onEachFeature : target
	}).addTo(map)
}
	
function zoomToFeature(e) {
	// map.setView([e.latlng.lat, e.latlng.lng], 15);		 //pour des centroides!
	
	///ICI PLUTOT METTRE UN SETVIEW AVEC LE CENTROID DE LA COMMUNE --- MAIS LE PBLM C QUIL FAUT AUSI AFFICHER LES FRONTIERES :PK PAS AU SURVOL?? CHARGER DEUX COUCHES
	map.fitBounds(e.target.getBounds());
	setTimeout(function(){
		d3.select(e.target._path).style("display",'block');
	},500)
};


function boutons(){
	
	
	d3.select("#bout_chemineur")
		// .on("change",function(){
		.on("click",function(){
			// if(this.checked){
			if(affichage=="chemineur"){
				del_chemineur();
			} else {
				aff_chemineur();
			}
		})
		
	map.on('zoom', function() {
		
		if(map._zoom<zoomNuts){
			affichage = "nuts";	
			d3.select("#bout_chemineur").style("display","none")
		} else if(map._zoom<zoomComm){
			affichage = "commune";	
			d3.select("#bout_chemineur").style("display","none")
		} else {
			affichage = "cheminee";
			d3.select("#bout_chemineur").style("display","block")
		}
		// xmin = map.getBounds()._southWest['lat'];
		// xmax = map.getBounds()._northEast['lat'];									
		// ymin = map.getBounds()._southWest['lng'];								
		// ymax = map.getBounds()._northEast['lng'];
		recharge_data();
	});
	
	map.on('dragend', function() {
		// console.log("iiiiiiiiiiiii");
		// xmin = map.getBounds()._southWest['lat'];
		// xmax = map.getBounds()._northEast['lat'];									
		// ymin = map.getBounds()._southWest['lng'];								
		// ymax = map.getBounds()._northEast['lng'];
		// console.log(xmin+" "+xmax+" "+ymin+" "+ymax);
		recharge_data();
	});

	// map.on('resize', function() {
		// alert("ajax")
	// })
	// alert("h");
	
	
	d3.selectAll(".interru")
		.style("cursor","pointer")
		.on("click",function(){
			d3.select(this)
				.transition()
				.duration(150)
				.attr("opacity",0)
				.transition()
				.attr("display","none")
			ID= this.id;
			
			if(this.id=="pos_osm"){
				var app = "#pos_va"
				TL.remove();
				Esri_WorldImagery.addTo(map);
				d3.select("#tx_va").attr("font-weight","700")
				d3.select("#tx_osm").attr("font-weight","300")
			} else {
				var app = "#pos_osm"
				Esri_WorldImagery.remove();
				TL.addTo(map);
				d3.select("#tx_va").attr("font-weight","300")
				d3.select("#tx_osm").attr("font-weight","700")
			}
			
			d3.select(app)
				.attr("display","block")
				.transition()
				.duration(150)
				.attr("opacity",1)
				
		})

	d3.select("#contrib").on("click",function(){
		if(bloo){
			del_chemineur()
		}
		d3.select("#boutt_chemm").style("display","none").attr("unchecked")
		
		d3.select("#if_formulaire")
			.style("display","block")
			.transition()
			.duration(200)
			.style("opacity",1)
		
		d3.select("#tout_infos").style("display","none")
		d3.select("#tout_infos2").style("display","none")
		clock.remove();
		d3.select(this).style("display","none")
	
		
	//HAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
	// d3.select(myFrameDocument.getElementById("makeCoord"))
		// .attr("value",phrase_localchem)
		// .attr("done","false")
		// .on("click",function(){
		
		// })
	
		
		
	})

}
	
function majCartoSite(e,props_site,props){
	///Maj carto
		d3.selectAll(".leaflet-marker-icon")
			.attr("src",function(){
				if(this.attributes.src){
					if(this.attributes.src.value=="img/cheminee2.png"||this.attributes.src.value=="img/cheminee3.png"){
						return "img/cheminee.png";
					} else if(this.attributes.src.value=="img/chemineur2.png"){
						return "img/chemineur.png";
					} else {
						return this.attributes.src.value;
					}
				}
			})
			
		i=0;
		for(j in clock._layers){
			if((chem.features[i].properties['id']).indexOf(props_site.id)>-1){
				d3.select(clock._layers[j]._icon).attr("src","img/cheminee3.png");
			}
			i++;
		}
		i=0;
		if(props){
			
		if(bloo){
			for(j in bloo._layers){
				if((chemineur.features[i].properties['cheminees']).indexOf(props.id)>-1){
					d3.select(bloo._layers[j]._icon).attr("src","img/chemineur2.png");
				}
				i++;
			}
		}
			
			
				
			d3.select(e.target._icon).attr("src","img/cheminee2.png") 
		}
		
		
}
function infos_max(e){
		///données
			
		var props = e.target.feature.properties;
		var props_site;
		for(d=0;d<datasite.features.length;d++){
			console.log(datasite.features[d].properties);
			console.log(datasite.features[d].properties.id+"      "+props.id.split("_")[0]+"_"+props.id.split("_")[1]+"_"+props.id.split("_")[2])
			if(datasite.features[d].properties.id==props.id.split("_")[0]+"_"+props.id.split("_")[1]+"_"+props.id.split("_")[2]){
				var props_site=datasite.features[d].properties;
			}
				
		}
		console.log("props_site");
		console.log(props_site);
		console.log("props");
		console.log(props);
		if(props_site){}else{alert("erreur ! le site n'existe pas pour la cheminée '"+props.id+"'")}
		
		majCartoSite(e,props_site,props);
		///Général
		d3.select("#tout_infos").style("display","block").transition().duration(200).style("opacity",1)
		d3.select("#tout_infos2").style("display","none")
		d3.selectAll(".div_info").style("display","none")
		d3.select("#d_Général").style("display","block")
		
		///Titre
		if(props_site["nomsitusa"]){
			if(props["nomchem"]){
				d3.select("#titre_fiche").html(props_site["nomsitusa"]+"<br/>"+props["nomchem"]).style("font-style","")
			} else {
				d3.select("#titre_fiche").html(props_site["nomsitusa"]).style("font-style","")
			}
		} else if(props_site["nomsithist"]){
			if(props["nomchem"]){
				d3.select("#titre_fiche").html(props_site["nomsithist"]+"<br/>"+props["nomchem"]).style("font-style","")
			} else {
				d3.select("#titre_fiche").html(props_site["nomsithist"]).style("font-style","")
			}
		} else {
			if(props["nomchem"]){
				d3.select("#titre_fiche").html("Nom inconnu<br/>"+props["nomchem"]).style("font-style","italic")
			} else {
				d3.select("#titre_fiche").html("Nom inconnu").style("font-style","italic")
			}
		}
		
		
		///Eléments
		for(i=0;i<modele_variable.length;i++){
			var vari="";
			var vari_maj = (modele_variable[i].variable);
			var vari = (modele_variable[i].variable).toLowerCase();
			
			if(modele_variable[i].site=="oui"){
				proOk = props_site;
				tar="targetedsite"
			} else {
				proOk = props;
				tar="targeted"
			}
			
			
			d3.select("#"+vari_maj)
				.style("display",function(){
					
					if((this.attributes.type.value=="booleen") && proOk[vari]=="false"){
						return "none";
						
					} else if(vari=="hauteures"){
						if(proOk["hauteurpr"]){
							return "none";
						}else {
							return "block";
						}
					} else {
						if(proOk[vari]){
							if(this.attributes.type.value=="cochage"){
								return "block"
							} else {
								return "list-item"
							}
						} else {
							// alert(vari+"   "+tar);
							// console.log(proOk);
							return "none"
							
						}
					}	
				})
				.html(function(){
					if(proOk[vari]){
						if((this.attributes.style.value).indexOf("display: none")==-1){
							if(this.attributes.type.value=="booleen"){
								return "<span class='"+tar+"'>"+this.attributes.lab.value+"</span>" ;
							} else if(this.attributes.type.value=="cochage"){
								tx=""
								for(j=0;j<(proOk[vari].split("_")).length;j++){
									tx=tx+"<li class='elmt "+tar+"'>"+proOk[vari].split("_")[j]+"</li>";
								}
								return this.attributes.lab.value +tx;
							}else{
								if(this.attributes.position.value=="avant"){
									return this.attributes.lab.value + "<span class='"+tar+"'>"+proOk[vari]+"</span>";
								} else {
									return "<span class='"+tar+"'>"+proOk[vari]+"</span>" + this.attributes.lab.value;
								}
							}
							
						}
					}
					
				})
		
				
		}
		
		///Photos (factoriser)
		var lsTot=[];
		for(i=0;i<props.nbphind;i++){
			if(i<10){
				it="0"+(i*1+1);
			} else {
				it=i*1+1;
			}
			idPhoto = props.id+"_"+it;
			lsTot.push(idPhoto);
		}
		for(j=0;j<props_site.nbphsit;j++){
			if(j<10){
				it="0"+(j*1+1);
			} else {
				it=+j*1+1;
			}
			
			idPhoto = props_site.id+"_99_"+it
			lsTot.push(idPhoto);
		}
		if(props.nbphind==0&&props_site.nbphsit==0){
			d3.select("#svg_photos").style("display","none");
			d3.select("#cont_main_photo").style("display","none");
			d3.select("#indic_none_p").style("display","block");
	
		} else {
			photos_diapo(i,lsTot);
		}
	
	}

function photos_diapo(nb,tot){
	var ray = 15;
	d3.select("#indic_none_p").style("display","none");
	d3.select("#cont_main_photo").style("display","block");
	d3.select("#svg_photos").style("display","block").selectAll(".cont_clip").remove();
	
	d3.select("#svg_photos")
		.selectAll("g")
		.data(tot)
		.enter()
		.append("g")
		.attr("class","cont_clip")
		.attr("photo",function(d){return d})
		.attr("typephoto",function(d,i){
			if(i>=nb){
				return "Site"
			}else {
				return "Cheminée"
			}
		})
		.append("clipPath")
		.attr("id",function(d,i){
			return "cp"+i;
		})
		.append("circle")
		.attr("cx",function(d,i){
			return 15+20*(i%2);
		})
		.attr("cy",function(d,i){
			return 20+30*i;
		})
		.attr("r",ray)
		
		
	//ajouter site et pas site test avec i et mettre le nbr de truc 
	d3.select("#svg_photos")
		.selectAll(".cont_clip")
		.on("mouseover",function(){
			d3.select(this)
				.select(".c_anim")
				.transition()
				.duration(100)
				.attr("stroke-width",2.5)
		})
		.on("mouseout",function(){
			d3.select(this)
				.select(".c_anim")
				.transition()
				.duration(100)
				.attr("stroke-width",0)
		})
		.on("click",function(){
			var src =this.attributes.photo.value;
			var type =this.attributes.typephoto.value;
			d3.select("#main_photo")
				.attr("src","img/"+src+".jpg")
			d3.select("#indic_typephoto")
				.text(type)
				.attr("transform",function(){
					if(type=="Site"){
						return "rotate(-90 75 59) translate(33,0)"
					}else {
						return "rotate(-90 75 59)"
					}
				})
				
		})
		.style("cursor","pointer")
		.append("g")
		
		.attr("clip-path",function(d,i){
			return "url(#cp"+i+")";
		})
		
		.append("image")
		.attr("x",function(d,i){
			var val = 15+20*(i%2)-ray;
			return val;
		})
		.attr("y",function(d,i){
			return 20+30*i-ray*2
		})
		.attr("id",function(d,i){
			return "ima_"+i;
		})
		.attr("xlink:href",function(d){
			return "img/"+d+".jpg";
		})
		.attr("width",ray*2)
		.attr("height",ray*4)	
		
	d3.select("#svg_photos")
		.selectAll(".cont_clip")
		.append("circle")
		.attr("class","c_anim")
		.attr("cx",function(d,i){
			return 15+20*(i%2);
		})
		.attr("cy",function(d,i){
			return 20+30*i;
		})
		.attr("fill","none")
		.attr("r",ray)
		.attr("stroke",function(d,i){
			if(i>=nb){
				return "#c17130"
			}else{
				return "#329899"
			}
		})
		.attr("stroke-width",0)
	
	d3.select("#main_photo")
		.attr("src","img/"+tot[0]+".jpg")
	if(nb==0){
		d3.select("#indic_typephoto")
			.text("Site")
			.attr("transform","rotate(-90 75 59) translate(33,0)")
			
	}else{
		d3.select("#indic_typephoto")
			.text("Cheminée")
			.attr("transform","rotate(-90 75 59)")
	}
}

///Fonctions appelées dans l'iframe


function select_site(formu,site_exist){
	//visibilité
	d3.select(TL._container).transition().duration(300).style("opacity",0.4)
	d3.select(Esri_WorldImagery._container).transition().duration(300).style("opacity",0.4)	
	clock.addTo(map);	
	d3.select(formu).select("#makeCoord").attr("mode",phrase_selectsite).attr("value",function(){
		if(if_formulaire.style.width=="29%"){
			return phrase_suite;
		} else{
			return phrase_selectsite;
		}
	})
	
	clock.eachLayer(function (layer) {
		// layer.on({
			// click: getData,
		// });
		layer._events.click[0].fn=getData;
		// console.log(layer._events.click);
	});
	function getData(e){
		idsite = (e.target.feature.properties["id"]).split("_")[0]+"_"+(e.target.feature.properties["id"]).split("_")[1]+"_"+(e.target.feature.properties["id"]).split("_")[2];
		// alert(idsite);
		for(d=0;d<datasite.features.length;d++){
			console.log(datasite.features[d].properties.id+"          ----        "+idsite);
			if(datasite.features[d].properties.id==idsite){
				var propsite=datasite.features[d].properties;
			}
		}
		for(i=0;i<modele_variable.length;i++){
			if(modele_variable[i].site=="oui"){
				vall = propsite[(modele_variable[i].variable).toLowerCase()];
				// console.log(vall);
				// console.log("#"+modele_variable[i].variable_form);
				d3.select(formu).select("#"+modele_variable[i].variable_form).style("color","grey").attr("value",vall)
					.each(function(){
						// modifCompCochage mettre un if pour rajouter // supprimer
							
						if(modele_variable[i].type=="cochage"){
							// alert(this.id);
							ls=vall.split("_");
							d3.select(this)
								.selectAll("input")
								.attr("checked",function(){
									if(ls.indexOf(this.id)!=-1){
										return true;
									}
								})
						} else {
							this.value = vall;
						}
					})
			}
		}
		site_exist.attributes.value.value = idsite;
		
		var props = e.target.feature.properties;
		var props_site;
		for(d=0;d<datasite.features.length;d++){
			console.log(datasite.features[d].properties.id+"      "+props.id.split("_")[0]+"_"+props.id.split("_")[1]+"_"+props.id.split("_")[2])
			if(datasite.features[d].properties.id==props.id.split("_")[0]+"_"+props.id.split("_")[1]+"_"+props.id.split("_")[2]){
				var props_site=datasite.features[d].properties;
			}
				
		}
		majCartoSite(e,props_site);
	}
}

function end_site(formu){
	//visibilité
	clock.remove();
	
	d3.select(TL._container).transition().duration(300).style("opacity",1)
	d3.select(Esri_WorldImagery._container).transition().duration(300).style("opacity",1)
	d3.select(formu).select("#makeCoord").attr("mode",phrase_localchem).attr("value",function(){
		// alert(if_formulaire.style.width);
		if(if_formulaire.style.width=="29%"){
			return phrase_suite;
		} else{
			return phrase_localchem;
		}
	})
	
	clock.eachLayer(function (layer) {
		layer._events.click[0].fn=infos_max;
	});
	for(i=0;i<modele_variable.length;i++){
		if(modele_variable[i].site=="oui"){
			d3.select(formu).select("#"+modele_variable[i].variable_form).style("color","black").attr("value","").each(function(){
						this.value = "";
					})
		}
	}
	

}

function pointerr(obj,objX,objY,formu){
	map.on("mousemove",function(e){
			if(MODEMAP=="selection"){
				var X= e.latlng['lng'];
				var Y= e.latlng['lat'];
				var margX = (e.containerPoint["x"]*1+20)+"px";
				var margY = (e.containerPoint["y"]*1+20)+"px";
				d3.select("#x_temp").html(X); 
				d3.select("#y_temp").html(Y);
				d3.select("#localtemp").style("display","block").style("margin-left",margX).style("margin-top",margY)
			}
		})
		.on("click",function(e){
			if(MODEMAP=="selection"){
				var X= e.latlng['lng'];
				var Y= e.latlng['lat'];
				objX.value = X;
				objY.value = Y;
				if(pointNewChem){
					pointNewChem.remove();
				}
				pointNewChem = L.marker([Y,X], {icon: myIconNew}).addTo(map)
				 // .attr("src","img/cheminee.png")
			}
			
		})
		.on("mouseout",function(e){
			if(MODEMAP=="selection"){
				d3.select("#localtemp").style("display","none")
			}
		})
	
	if(obj.attributes.done.value=="false"){
		d3.select(obj)
			.attr("done","true")
			.attr("value",phrase_suite)
		MODEMAP = "selection";
		// map
			// .on("mousemove",function(e){
				// if(this.attributes.mode.value=="selection"){
					// var X= e.latlng['lng'];
					// var Y= e.latlng['lat'];
					// var margX = (e.containerPoint["x"]*1+20)+"px";
					// var margY = (e.containerPoint["y"]*1+20)+"px";
					// d3.select("#x_temp").html(X); 
					// d3.select("#y_temp").html(Y);
					// d3.select("#localtemp").style("display","block").style("margin-left",margX).style("margin-top",margY)
				// }
			// })
			// .on("click",function(e){
				// if(this.attributes.mode.value=="selection"){
					// var X= e.latlng['lng'];
					// var Y= e.latlng['lat'];
					// objX.value = X;
					// objY.value = Y;
					// if(pointNewChem){
						// pointNewChem.remove();
					// }
					// pointNewChem = L.marker([Y,X], {icon: myIconNew}).addTo(map)
				// }
				
			// })
			// .on("mouseout",function(e){
				// if(this.attributes.mode.value=="selection"){
					// d3.select("#localtemp").style("display","none")
				// }
			// })
			
		console.log(map.on)
		
		d3.select("#mapid")
			.style("cursor","crosshair")
			
		d3.select("#if_formulaire")
			// .transition()
			// .duration(300)
			.style("width","29%")
			.style("margin-left","70%")
			
		d3.select(formu).selectAll(".additionnel").style("display","none")
		d3.select(formu).selectAll(".eff_local").style("display","none")
	} else {
		clock.addTo(map);
		d3.select(obj)
			.attr("done","false")
			.attr("value",function(){
				var val = this.attributes.mode.value;
				return val;
			})
		
		MODEMAP = "observation";
		// map.on("click",function(e){
			// console.log("a")
		// })
		// map.on("mouseout",function(e){console.log("b")})
		// map.on("mousemove",function(e){console.log("c")})
		d3.select("#mapid").style("cursor","grab")
		
		d3.select("#if_formulaire")
			.style("width","84%")
			.style("margin-left","15%")
			
		d3.select(formu).selectAll(".additionnel").style("display","block")
		d3.select(formu).selectAll(".eff_local").style("display","block")
	}
}	


function chargement(){
	d3.select("#chargement").style("display","block")
	d3.selectAll(".charg").attr("class","charg tourne enc")
}
function chargement_end(){
	// d3.selectAll(".enc").attr("opacity",1).transition().duration(600).attr("opacity",0)
	// d3.select("#chargeok").attr("opacity",1).transition().duration(600).attr("opacity",1)
	// setTimeout(function(){
		// alert("ok")
		d3.select("#chargement").style("display","none")
		d3.selectAll(".charg").attr("class","charg enc")
		// d3.selectAll(".enc").attr("opacity",1)
	// },1200)
}

function closeContrib(){
	d3.select("#if_formulaire").style("display","none");
	d3.select("#boutt_chemm").style("display","block")
	document.getElementById("boutt_chemm").checked=false;
	d3.select("#contrib").style("display","block")
	if(pointNewChem){
		pointNewChem.remove()
	}
}

function openIdentif(){
	d3.select("#if_formulaire").style("display","none").style("opacity",0);
	d3.select("#if_identif").style("display","block").transition().duration(500).style("opacity",1);
}

function close_identif(){
	d3.select("#if_formulaire").style("display","block").transition().duration(500).style("opacity",1);
	d3.select("#if_identif").style("display","none").style("opacity",0);
}

function maj_variables(param1,param2){
	identifiant_chemineur = param1;
	verrouillage = param2;
}

function get_identifiant(){
	if (identifiant_chemineur){
		return identifiant_chemineur;
	}else {
		return 'anonyme';
	}
}
function get_verrouillage(){
	return verrouillage;
}

function make_ls_var(){
	for(i=0;i<modele_variable.length;i++){
		
		
		if(modele_variable[i].famille!="Chemineurs"&&modele_variable[i].famille!="communes"&&modele_variable[i].famille!="nuts"){
			if(modele_variable[i].site=="non"){
				ls_var_chem.push(modele_variable[i].variable);
			} else {
				ls_var_site.push(modele_variable[i].variable);
			}
		} else if (modele_variable[i].famille=="Chemineurs") {
			ls_var_auteur.push(modele_variable[i].variable);
		} else if (modele_variable[i].famille=="communes") {
			ls_var_communes.push(modele_variable[i].variable);
		} else if (modele_variable[i].famille=="nuts") {
			ls_var_nuts.push(modele_variable[i].variable);
		}
	}
	console.log("ls_var_chem")
	console.log(ls_var_chem)
	console.log("ls_var_site")
	console.log(ls_var_site)
	console.log("ls_var_auteur")
	console.log(ls_var_auteur)
}
