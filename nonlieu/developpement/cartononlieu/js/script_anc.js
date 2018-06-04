var chapitres=["Général","Description","Usage","Histoire","Protection","Transformation","Photographies","Evènements"],
partie = "",
sizeI = 500, //vb de la fenêtre info
sizeC = 300, //taille de l'espace des chapitres
mar_yC = 40, //marge en y de l'espace des chaptires
esp_yC =27, //Espace entre les chapitres
ecp=9,
datachem,
datasite,
ect=ecp*2,
map;
// var myFrame = document.getElementById("if_formulaire");
// var myFrameContent = (myFrame.contentWindow || myFrame.contentDocument);
// var myFrameDocument = myFrameContent.document ? myFrameContent.document : myFrameContent;

//////////////////////////Variables/////////////


window.onload = initialize();

//////////////////////////fonctions/////////////
function initialize(){
	queue()	//chargement des donénes					 
		.defer(d3.csv, "data/modele_chem.csv") //modèle de données pour es cheminées
		// .defer(d3.json, "data/sites.geojson") //couche site utilisée sans la géométrie
		.await(callback0);
		
	function callback0(error,datata){
		datachem = datata;
	
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

	d3.select("#chaps").append("text").attr("font-size",16).attr("font-weight",500).style("cursor","pointer").attr("class","hl_bout")
		.text("CONTRIBUER")
		.attr("x",sizeI-40)
		.attr("y",yh*1+30)
		
	d3.select("#chaps").append("text").attr("font-size",16).attr("font-weight",500).style("cursor","pointer").attr("class","hl_bout")
		.text("RECHERCHER")
		.attr("x",sizeI-40)
		.attr("y",yb-30)
		
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
	for(i=0;i<datachem.length;i++){
		famille=datachem[i].famille;
		if(datachem[i].type!="invisible"){
			if(datachem[i].site=="oui"){ 
				var tar="targetedsite"
			}else{
				var tar="targeted"
			}
			if(datachem[i].type=="fam"){
				idfam++;
				d3.select("#d_"+famille)
					.append("ul")
					.attr("class","elmt")
					.html(datachem[i].Description)
					.attr("id","fam"+idfam)
					.append("li")
					.attr("id",datachem[i].variable)
					.attr("lab","")
					.attr("class","elmt "+tar)
					.attr("position",datachem[i].position)
					.attr("type",datachem[i].type)
			} else if(datachem[i].type=="in_fam"){
				d3.select("#fam"+idfam)
					.append("li")
					.attr("id",datachem[i].variable)
					.attr("class","elmt "+tar)
					.attr("lab",datachem[i].Description)
					.attr("position",datachem[i].position)
					.attr("type",datachem[i].type)
					.html(datachem[i].Description) //virer
			}else{
				var elmt;
				if(datachem[i].type=="unique" || datachem[i].type=="nombre" || datachem[i].type=="selecteur" || datachem[i].type=="booleen_0"||  datachem[i].type=="booleen"|| datachem[i].type=="in_fam"|| datachem[i].type=="texte_libre"){
					elmt="li";
				} else if(datachem[i].type=="cochage"){
					elmt = "ul";
				} else if(datachem[i].type=="in_bool"){
					elmt = "p"
				}
				d3.select("#d_"+famille)
					.append(elmt)
					.attr("id",datachem[i].variable)
					.attr("class","elmt")
					.attr("lab",datachem[i].Description)
					.attr("position",datachem[i].position)
					.attr("type",datachem[i].type)
					.html(datachem[i].Description) //virer
					//.attr("display","none")//remettre
			}
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

	/****Important! on peut créer la varible et ajotuer des données */
	
	// var myLayer = L.geoJSON().addTo(map);
// myLayer.addData(chem_feature);

	/**** Tile */
	//http://leaflet-extras.github.io/leaflet-providers/preview/
	map = L.map('mapid').setView([50.681945, 3.186629], 15);
	var TL = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
	}).addTo(map);
	
	L.control.scale().addTo(map);

	var Esri_WorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
		attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
	});

    /**** Chargement json */
	// var chem_feature = $.getJSON( "data/cheminees.geojson", function( data ) {
	  // console.log(data);
	// });
	// var sites_feature = $.getJSON( "data/sites_zone.geojson", function( data ) {
	  // console.log(data);
	// });
	
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
	
	// var couche_site = L.geoJSON(sites, {
		// pointToLayer: function (feature, latlng) {
			// return L.circleMarker(latlng, {
				// fillOpacity:0,
			// })
		// }
	// }).addTo(map);
	
	var chem;
	///***AJAX***///
	
	function fonctionsCarto(){
		var commune = L.geoJSON(comm, {
			style:{
				fillColor: '#ffff00',
				opacity:0.5
			},
			onEachFeature : target3
		}).addTo(map);
		
		commune.eachLayer(function (layer) {
			layer._path.style.display = 'none';
		});
		var clock = L.geoJSON(chem, {
			pointToLayer: function (feature, latlng) {
				return L.marker(latlng, {icon: myIcon});
			},
			onEachFeature : target
		}).addTo(map);
		
		var bloo = L.geoJSON(chemineur, {
			pointToLayer: function (feature, latlng) {
				return L.marker(latlng, {icon: myIcon2});
			},
			onEachFeature : target2
		});

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
		
		var ls_it=[];
		var ls_it2=[];
		
		function infos_min(e){
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
			d3.select(e.target._icon).style("opacity",1) //.attr("class","leaflet-marker-icon leaflet-zoom-animated leaflet-interactive")
			for(i in ls_it){
				d3.select(clock._layers[ls_it[i]]._icon).attr("class","leaflet-marker-icon leaflet-zoom-animated leaflet-interactive")
			}
			ls_it=[];
			e.target.closePopup();
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
		
		function infos_max(e){
			///données
			d3.select("#if_formulaire").style("display","none");
			var props = e.target.feature.properties;
			var props_site;
			;
			for(d=0;d<datasite.features.length;d++){
				if(datasite.features[d].properties.id==props.id.split("_")[0]+"_"+props.id.split("_")[1]+"_"+props.id.split("_")[2]){
					var props_site=datasite.features[d].properties;
				}
					
			}
			if(props_site){}else{alert("erreur ! le site n'existe pas pour la cheminée '"+props.id+"'")}
			
			///Maj carto
			commune.eachLayer(function (layer) {
				layer._path.style.display = 'none';
			});
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
			for(j in bloo._layers){
				if((chemineur.features[i].properties['cheminees']).indexOf(props.id)>-1){
					d3.select(bloo._layers[j]._icon).attr("src","img/chemineur2.png");
				}
				i++;
			}
				
			d3.select(e.target._icon).attr("src","img/cheminee2.png") 
			
			
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
			for(i=0;i<datachem.length;i++){
				var vari="";
				var vari_maj = (datachem[i].variable);
				var vari = (datachem[i].variable).toLowerCase();
				
				if(datachem[i].site=="oui"){
					proOk = props_site;
					tar="targetedsite"
				} else {
					proOk = props;
					tar="targeted"
				}
				
				
				d3.select("#"+vari_maj)
					.style("display",function(){
						if((this.attributes.type.value=="booleen_0"||this.attributes.type.value=="booleen") && proOk[vari]=="false"){
							return "none";
						} else {
							if(proOk[vari]){
								if(this.attributes.type.value=="in_bool"||this.attributes.type.value=="cochage"){
									return "block"
								} else {
									return "list-item"
								}
							} else {
								return "none"
								
							}
						}	
					})
					.html(function(){
						if(proOk[vari]){
							if((this.attributes.style.value).indexOf("display: none")==-1){
								if(this.attributes.type.value=="booleen"){
									return this.attributes.lab.value;
								} else if(this.attributes.type.value=="booleen_0"){
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
		function infos_max2(e){
			commune.eachLayer(function (layer) {
				layer._path.style.display = 'none';
			});
				
			var props = e.target.feature.properties;
			
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
			for(i=0;i<datachem.length;i++){
				var vari="";
				var vari_maj = (datachem[i].variable);
				var vari = (datachem[i].variable).toLowerCase();
				
				d3.select("#"+vari_maj)
					.style("display",function(){
						
						if(props[vari]){
							if(this.attributes.type.value=="in_bool"){
								return "block"
							} else {
								return "list-item"
							}
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
			bloo.addTo(map);
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

				
		}
		function del_chemineur() {
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
			map.fitBounds(e.target.getBounds());
			setTimeout(function(){
				d3.select(e.target._path).style("display",'block');
			},500)
		};
		
		d3.select("#bout_chemineur")
			.on("change",function(){
				if(this.checked){
					aff_chemineur();
				} else {
					del_chemineur();
				}
			})
			
		map.on('zoom', function() {
			if(map._zoom<11){
				clock.eachLayer(function (layer) {
					layer._icon.style.display = 'none';
				});
				commune.eachLayer(function (layer) {
					layer._path.style.display = 'block';
				});
		
			} else {
				clock.eachLayer(function (layer) {
					layer._icon.style.display = 'block';
				});
				commune.eachLayer(function (layer) {
					layer._path.style.display = 'none';
				});
			}
			
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
			d3.select("#if_formulaire")
				.style("display","block")
				.transition()
				.duration(200)
				.style("opacity",1)
			
			d3.select("#tout_infos").style("display","none")
			d3.select("#tout_infos2").style("display","none")
			
			var myFrame = document.getElementById("if_formulaire");
		var myFrameContent = (myFrame.contentWindow || myFrame.contentDocument);
		var myFrameDocument = myFrameContent.document ? myFrameContent.document : myFrameContent;

		console.log(myFrameDocument.getElementById("x"));
		
		//HAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
		d3.select(myFrameDocument.getElementById("makeCoord"))
			.attr("value","Localiser sur la carte")
			.attr("done","false")
			.on("click",function(){
				console.log(map);
				if(this.attributes.done.value=="false"){
					d3.select(this)
						.attr("done","true")
						.attr("value","Terminer")
					map.on("click",function(e){
							var X = e.latlng['lng'];
							var Y = e.latlng['lat'];
							// console.log(X+" "+Y);
							// console.log();
							//http://www.developpez.net/forums/d271424/webmasters-developpement-web/contribuez/transferer-informations-fenetre-parent-fenetre-enfant/
							// .select("form")
							// .style("display","none")						
							myFrameDocument.getElementById("x").value = X;
							myFrameDocument.getElementById("y").value = Y;
							
							// console.log(document);
							// console.log(myFrameDocument)
						})
					
					d3.select("#mapid")
						.style("cursor","crosshair")
				} else {
					d3.select(this)
						.attr("done","false")
						.attr("value","Localiser sur la carte")
					map.on("click",function(e){})
					d3.select("#mapid").style("cursor","grab")
				}
			})
		
			
			
		})
	}

	recharge_data();
}

function recharge_data(){
		alert("hey");
	$.ajax({
		type : 'POST',
		url : 'php/request_chem.php',
		dataType: 'json',
		data:{
			xmin : map.getBounds()._southWest['lat'],
			xmax : map.getBounds()._northEast['lat'],									
			ymin : map.getBounds()._southWest['lng'],									
			ymax : map.getBounds()._northEast['lng'],									
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
		error : function(msg,statut){
			alert("Erreur:")
			console.log(statut);
			console.log(msg)
		}
	})

	$.ajax({
		type : 'POST',
		url : 'php/request_site.php',
		dataType: 'json',
		data:{
			xmin : map.getBounds()._southWest['lat'],
			xmax : map.getBounds()._northEast['lat'],									
			ymin : map.getBounds()._southWest['lng'],									
			ymax : map.getBounds()._northEast['lng'],									
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
			fonctionsCarto();
			// console.log(msg)
		},
		error : function(msg,statut){
			alert("Erreur:")
			console.log(statut);
			console.log(msg)
		}
	})

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