var chapitres=["Général","Description","Usage","Histoire","Protection","Transformation","Photographies","Evènements"],
partie = "",
sizeI = 500, //vb de la fenêtre info
sizeC = 300, //taille de l'espace des chapitres
mar_yC = 40, //marge en y de l'espace des chaptires
esp_yC =27, //Espace entre les chapitres
ecp=9,
datachem,
ect=ecp*2,
map;

$(function() {
//////////////////////////Variables/////////////


window.onload = initialize();

//////////////////////////fonctions/////////////
function initialize(){
	
	resize();
	window.onresize=function(){
		resize();
	}
	makemap();
	drawInit();
}

function drawInit(){
	choixChapitres();
	build_afficheInfo();

		
}
function choixChapitres(){
	d3.select("#cont_plus")
		.append("div")
		.attr("id","tout_infos")
		.append("h2")
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
				.attr("fill","#336666")
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
		.attr("x1",function(d,i){
			var bbox = d3.select(this).node().getBBox();
			return sizeI/2-ect+Math.trunc(i/4)*ect*2-bbox.width*(1-Math.trunc(i/4));
		})	
		.attr("x2",function(d,i){
			d3.select(this).attr("font-weight",200)
				.attr("font-size",25)
				
			var bbox = d3.select(this).node().getBBox();
			return sizeI/2-ect+Math.trunc(i/4)*ect*2-bbox.width*(1-Math.trunc(i/4));
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
		.attr("fill","#336666")
		.attr("stroke","#329899")
		.attr("stroke-width",0)
	
	d3.select("#tout_infos").style("display","none")
}

function build_afficheInfo(){
	queue()	//chargement des donénes					 
		.defer(d3.csv, "data/modele_chem.csv") //modèle de données pour es cheminées
		.await(callback0);
		
	function callback0(error,datata){
		datachem = datata;
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

		idfam=0;
		for(i=0;i<datachem.length;i++){
			famille=datachem[i].famille;
			if(datachem[i].type!="invisible"){
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
						.attr("class","elmt targeted")
						.attr("position",datachem[i].position)
						.attr("type",datachem[i].type)
				} else if(datachem[i].type=="in_fam"){
					d3.select("#fam"+idfam)
						.append("li")
						.attr("id",datachem[i].variable)
						.attr("class","elmt targeted")
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
}

function majChap(){
	d3.selectAll(".div_info").style("display","none")
	d3.select("#d_"+partie).style("display","block")
}

//trucs de forme
function resize(){
	$('#mapid').css('height',window.innerHeight*0.8+'px')
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
	map = L.map('mapid').setView([50.681945, 3.186629], 15);
	L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
	}).addTo(map);


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
	
	// L.geoJSON(sites, {
		// pointToLayer: function (feature, latlng) {
			// return L.circleMarker(latlng, {
				// fillColor: '#303192',
				// fillOpacity:0.5,
				// color:'none',
				// stroke:'none',
				// radius : feature.properties.nbrchem*5
			// })
		// }
	// }).addTo(map);
	
	
	var commune = L.geoJSON(comm, {
		style:{
			color : '#303192',
			fillColor: '#303192',
			display:'none'
		},
		onEachFeature : target3
	}).addTo(map);
	
	var clock = L.geoJSON(chem, {
		pointToLayer: function (feature, latlng) {
			return L.marker(latlng, {icon: myIcon});
		},
		onEachFeature : target
	}).addTo(map);
	
	var bloo;

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
			click: zoomToFeature,
		});
		
	};
	
	var ls_it=[];
	var ls_it2=[];
	
	function infos_min(e){
		d3.select(e.target._icon).style("opacity",0.7).attr("class","leaflet-marker-icon leaflet-zoom-animated leaflet-interactive nb") //.attr("class","leaflet-marker-icon leaflet-zoom-animated leaflet-interactive nb")
		var props = e.target.feature.properties;
		i=0;
		for(j in clock._layers){
			var ID = chem.features[i].properties['id'];
			if(ID.split("_")[0]+"_"+ID.split("_")[1]+"_"+ID.split("_")[2]==(props.id).split("_")[0]+"_"+(props.id).split("_")[1]+"_"+(props.id).split("_")[2]){
				var ind=61+i*1;
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
			e.target.bindPopup(props.nomchem+" - " +props.nomsithist+" - "+props.nomsitusa+" (Pas de photo)").openPopup();
		} else {
			e.target.bindPopup(props.nomchem+" - " +props.nomsithist+" - "+props.nomsitusa+"<img class='img_min pu_"+props.id+"' src='img/"+idPhoto+".jpg'/>").openPopup();
		}
	};
	
	function infos_min2(e){
		e.target.setStyle({
			fillColor : "red"
		});
		var props = e.target.feature.properties;
		ls_ch = (props.cheminees).split("__")
		for(C in ls_ch){
			chem_id=ls_ch[C];
		
			i=0;
			for(j in clock._layers){
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
	
	
	function del_min(e){
		d3.select(e.target._icon).style("opacity",1) //.attr("class","leaflet-marker-icon leaflet-zoom-animated leaflet-interactive")
		for(i in ls_it){
			d3.select(clock._layers[ls_it[i]]._icon).attr("class","leaflet-marker-icon leaflet-zoom-animated leaflet-interactive")
		}
		ls_it=[];
		e.target.closePopup();
	};	
	function del_min2(e){
		e.target.setStyle({
			fillColor : "red"
		});
		for(i in ls_it2){
			d3.select(clock._layers[ls_it2[i]]._icon).attr("class","leaflet-marker-icon leaflet-zoom-animated leaflet-interactive")
		}
		ls_it2=[];
		e.target.closePopup();
	};

	function infos_max(e){
		
		var props = e.target.feature.properties;
		
		///Général
		d3.select("#tout_infos").style("display","block").transition().duration(200).style("opacity",1)
		d3.select("#tout_infos2").style("display","none")
		d3.selectAll(".div_info").style("display","none")
		d3.select("#d_Général").style("display","block")
		
		///Titre
		if(props["nomchem"]){
			d3.select("#titre_fiche").html(props["nomchem"]).style("font-style","")
		} else if(props["nomsitusa"]){
			d3.select("#titre_fiche").html(props["nomsitusa"]).style("font-style","")
		} else if(props["nomsithist"]){
			d3.select("#titre_fiche").html(props["nomsithist"]).style("font-style","")
		} else {
			d3.select("#titre_fiche").html("Nom inconnu").style("font-style","italic")
		}
		
		///Eléments
		for(i=0;i<datachem.length;i++){
			var vari="";
			var vari_maj = (datachem[i].variable);
			var vari = (datachem[i].variable).toLowerCase();
			d3.select("#"+vari_maj)
				.style("display",function(){
					if((this.attributes.type.value=="booleen_0"||this.attributes.type.value=="booleen") && props[vari]=="false"){
						return "none";
					} else {
						if(props[vari]){
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
					if(props[vari]){
						if((this.attributes.style.value).indexOf("display: none")==-1){
							if(this.attributes.type.value=="booleen"){
								return this.attributes.lab.value;
							} else if(this.attributes.type.value=="booleen_0"){
								return "<span class='targeted'>"+this.attributes.lab.value+"</span>" ;
							} else if(this.attributes.type.value=="cochage"){
								tx=""
								for(j=0;j<(props[vari].split("_")).length;j++){
									tx=tx+"<li class='elmt targeted'>"+props[vari].split("_")[j]+"</li>";
								}
								return this.attributes.lab.value +tx;
							}else{
								if(this.attributes.position.value=="avant"){
									return this.attributes.lab.value + "<span class='targeted'>"+props[vari]+"</span>";
								} else {
									return "<span class='targeted'>"+props[vari]+"</span>" + this.attributes.lab.value;
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
		for(j=0;j<props.nbphsit;j++){
			if(j<10){
				it="0"+(j*1+1);
			} else {
				it=+j*1+1;
			}
			
			idPhoto = (props.id).split("_")[0]+"_"+(props.id).split("_")[1]+"_"+(props.id).split("_")[2]+"_99_"+it
			lsTot.push(idPhoto);
		}
		if(i==0&&j==0){
			// alert("Pas de photo! à écrire")
		}
		photos_diapo(i,lsTot);
		
		///Maj cheminées
		d3.selectAll(".leaflet-marker-icon")
			.attr("src",function(){
				if(this.attributes.src){
					if(this.attributes.src.value=="img/cheminee2.png"){
						return "img/cheminee.png";
					} else {
						return this.attributes.src.value;
					}
				}
			})
		d3.select(e.target._icon).attr("src","img/cheminee2.png") 
	
	}
	
	function infos_max2(e){
		var props = e.target.feature.properties;
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
		bloo = L.geoJSON(chemineur, {
			pointToLayer: function (feature, latlng) {
				return L.circleMarker(latlng, {
					fillColor: '#0000ff',
					fillOpacity:0.9,
					color:'none',
					stroke:'#ffffff',
					radius : 5
				})
			},
			onEachFeature : target2
		}).addTo(map);
	}
	function del_chemineur() {
		bloo.remove()
	}
	
	
	function zoomToFeature(e) {
		// map.setView([e.latlng.lat, e.latlng.lng], 15);		 //pour des centroides!
		map.fitBounds(e.target.getBounds());
	
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
		if(map._zoom<13){
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
}



	function photos_diapo(nb,tot){
		var ray = 15;
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
					return "#329899"
				}else{
					return "blue"
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

});