var chapitres=["Général","Description","Usage","Histoire","Protection","Transformation","Photographies","Evènements"],
partie = "",
sizeI = 500, //vb de la fenêtre info
sizeC = 300, //taille de l'espace des chapitres
mar_yC = 40, //marge en y de l'espace des chaptires
esp_yC =27, //Espace entre les chapitres
ecp=9,
ect=ecp*2;

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
		.attr("id","svg_infos")
		
		.append("svg")
		.style("width","100%")
		.attr("viewBox","10 0 "+sizeI+" 100")
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
	
	d3.select("#fen_choix")
		.append("g")
		.attr("id","chaps")
		// .append("line").attr("x1",xg).attr("x2",xg).attr("y1",yh).attr("y2",yb).attr("stroke","#000000")
	// d3.select("#chaps")
		// .append("line").attr("x1",xd).attr("x2",xd).attr("y1",yh).attr("y2",yb).attr("stroke","#000000")
		
	// d3.select("#chaps")
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
	
}

function build_afficheInfo(){
	queue()	//chargement des donénes					 
		.defer(d3.csv, "data/modele_chem.csv") //modèle de données pour es cheminées
		.await(callback0);
		
	function callback0(error,datachem){
		for(c=0;c<chapitres.length;c++){
			d3.select("#svg_infos").append("div").attr("id","d_"+chapitres[c]).attr("class","div_info")
		}
		for(i=0;i<datachem.length;i++){
			famille=datachem[i].famille;
			if(datachem[i].famille!="invisible"){
				if(datachem[i].type=="fam"){
					d3.select("#d_"+famille)
						.append("p")
						.attr("p","p_info")
						.html(datachem[i].Description)
						//.attr("display","none")//remettre
					d3.select("#d_"+famille)
						.append("li")
						.attr("id",datachem[i].variable)
						.attr("lab","")
						.attr("position",datachem[i].position)
						.attr("type",datachem[i].type)
						//.attr("display","none")//remettre
				} else {
					var elmt;
					if(datachem[i].type=="unique" || datachem[i].type=="nombre" || datachem[i].type=="selecteur" || datachem[i].type=="booleen"|| datachem[i].type=="in_fam"|| datachem[i].type=="texte_libre"){
						elmt="li";
					} else if(datachem[i].type=="cochage"){
						elmt = "ul";
					} else if(datachem[i].type=="in_bool"){
						elmt = "p"
					}
					d3.select("#d_"+famille)
						.append(elmt)
						.attr("id",datachem[i].variable)
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
	d3.selectAll(".item")
		.remove();
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
	var map = L.map('mapid').setView([50.681945, 3.186629], 15);
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
	L.geoJSON(sites, {
		pointToLayer: function (feature, latlng) {
			return L.circleMarker(latlng, {
				fillColor: '#303192',
				fillOpacity:0.5,
				color:'none',
				stroke:'none',
				radius : feature.properties.nbrchem*5
			})
		}
	}).addTo(map);
	
	L.geoJSON(chemineur, {
		pointToLayer: function (feature, latlng) {
			return L.circleMarker(latlng, {
				fillColor: 'red',
				fillOpacity:0.9,
				color:'none',
				stroke:'none',
				radius : 4
			})
		}
	}).addTo(map);
	
	L.geoJSON(chem, {
		pointToLayer: function (feature, latlng) {
			
			return L.marker(latlng, {icon: myIcon});
		},
		onEachFeature : target
	}).addTo(map);

	function target(feature, layer) {
		layer.on({
			mouseover: infos_min,
			mouseout: del_min,
			click: infos_max,
		});
		
	};
	
	
	function infos_min(e){
		$(e.target._icon).css("opacity",0.7) //.attr("class","leaflet-marker-icon leaflet-zoom-animated leaflet-interactive nb")
		// console.log((e.target._icon).attributes.class.value)
		var props = e.target.feature.properties;
		if(props.nbphsit>0){
			var idPhoto = (props.id).split("_")[0]+"_"+(props.id).split("_")[1]+"_"+(props.id).split("_")[2]+"_99_01"
		} else {
			var idPhoto = props.id+"_01"
		}
		console.log(idPhoto);
		if(props.nbphsit==0&&props.nbphind==0){
			e.target.bindPopup(props.nomchem+" - " +props.nomsithist+" - "+props.nomsitusa+" (Pas de photo)").openPopup();
		} else {
			e.target.bindPopup(props.nomchem+" - " +props.nomsithist+" - "+props.nomsitusa+"<img class='img_min pu_"+props.id+"' src='img/"+idPhoto+".jpg'/>").openPopup();
		}
	};
	
	
	function del_min(e){
		$(e.target._icon).css("opacity",1) //.attr("class","leaflet-marker-icon leaflet-zoom-animated leaflet-interactive")
		e.target.closePopup();
	};
	


	function infos_max(e){
		var props = e.target.feature.properties;
		var txt="<div class='div_infosmax'><p>"+props.nomchem+" - " +props.nomsithist+" - "+props.nomsitusa+"</p><p>"+props.commune+"</p></div><div class='div_photos'>"
		for(i=0;i<props.nbphind;i++){
			if(i<10){
				it="0"+i;
			} else {
				it=i;
			}
			txt = txt+"<img class='img_max' src='img/"+props.id+"_"+it+".jpg'/>"
		}
		for(j=0;j<props.nbphsit;j++){
			if(j<10){
				it="0"+j;
			} else {
				it=j;
			}
			txt = txt+"<img class='img_max' src='img/"+((props.id).split("_")[0])+"_99_"+it+".jpg'/>"
		}
		txt=txt+"</div>";
		$("#infos").html(txt)
	}
}
});