
let dateMin = 2006;
let dateMax = 2016;
let annee=dateMin;
let csp = 1;
let dataInseeCSV=[];

let map;
let vectorLayer;

const couleurDates = "#bbbbbb";
const couleursCSP = ["#5800F1","#0021F1","#0075F1","#05A1A6","#05A638","#6BA605","#F7CF1B","#CB2A53","#CB2A2A"]
const couleursCSP_choro=[["#260165","#3E01A5","#5800F1","#792EF9","#9E66FC","#C19DFE"],
["#010F69","#0119AC","#0021F1","#3B54F5","#6D80FA","#9FABFC"],
["#003062","#0154AC","#0075F1","#2D92FE","#62ACFC","#A2CDFB"],
["#014446","#02797D","#05A1A6","#06D6DD","#64F5F9","#ACF8FA"],
["#014E1A","#01822A","#05A638","#0ADE4D","#3DF677","#7EFBA5"],
["#345101","#4E7A02","#6BA605","#8CDA04","#ABE547","#C9F184"],
["#836B03","#C29F06","#F7CF1B","#F2D44B","#F4DF7E","#EBE0A9"],
["#710A24","#A11639","#CB2A53","#D45373","#D77A91","#D9A8B4"],
["#630303","#9F1010","#CB2A2A","#E14A4A","#ED7F7F","#E7B7B7"]]
const classifCSP = ["Agriculteurs exploitants","Artisans, Commerçants, Chefs d'entreprise","Cadres et Professions intellectuelles supérieures","Professions intermédiaires"," Employés"," Ouvriers"," Retraités","Autres sans activité professionnelle"]
const discret = [15,30,45,60,75];

window.onload = initialize();

/**
  * Initialise le dessin de la carte, crée les checkbox, active les évènements des boutons et écrit le texte des erreurs
  */
function initialize(){ 
	queue()											
		.defer(d3.csv,"data/insee_csp_lille.csv")
		.await(callback0);
		
	function callback0(error, dataInsee){
		dataInseeCSV = dataInsee;
		dessinMap();
		addBoutons();
		legende();
		majCarte()
		
	}
		
}

function legende(){
	for(i=0;i<6;i++){
		d3.select("#svgDates")
			.append("rect")
			.attr("class","rectLegende")
			.attr("x",1100)
			.attr("y",i*15)
			.attr("width",20)
			.attr("height",10)
			.attr("itLegende","legende_"+(5-i))
			
		if(i<5){
			d3.select("#svgDates")
				.append("text")
				.attr("x",1125)
				.attr("y",(i*1+1)*15)
				.text(discret[i]+" %")
				.attr("font-size",14)

			d3.select("#svgDates")
				.append("line")
				.attr("x1",1090)
				.attr("x2",1125)
				.attr("y1",(i*1+1)*15-2)
				.attr("y2",(i*1+1)*15-2)
				.attr("stroke",couleurDates)
				.attr("stroke-width",0.5)
		}
	}
	
	d3.select("#svgDates").append("rect")
			.attr("x",1100)
			.attr("y",90)
			.attr("width",20)
			.attr("height",10)
			.attr("fill",couleurDates)
			
		d3.select("#svgDates")
			.append("text")
			.attr("x",1125)
			.attr("y",99)
			.attr("font-size",14)
			.text("Nodata")

}

function mefAnnee(a){
	let newA;
	newA = a%100;
	if(newA<10){
		newA="0"+newA;
	}else{
		newA=""+newA;
	}
	return newA;
}

function choroplete(valeur){
	if(valeur){
		if(valeur<discret[0]){
			return couleursCSP_choro[csp-1][5];
		}else if(valeur<discret[1]){
			return couleursCSP_choro[csp-1][4];
		}else if(valeur<discret[2]){
			return couleursCSP_choro[csp-1][3];
		}else if(valeur<discret[3]){
			return couleursCSP_choro[csp-1][2];
		}else if(valeur<discret[4]){
			return couleursCSP_choro[csp-1][1];
		}else if(valeur<100){
			return couleursCSP_choro[csp-1][0];
		}
	}else{
		return couleurDates;
	}
}

function majCarte(){
	let listeIRIS = [];
	let listeCOULEUR = [];
	let listeCSP = [];
	for(i=0;i<dataInseeCSV.length;i++){
		IRIS = dataInseeCSV[i]["IRIS_"+annee];
		CSP = 100*dataInseeCSV[i]["C"+mefAnnee(annee)+"_POP15P_CS"+csp]/dataInseeCSV[i]["C"+mefAnnee(annee)+"_POP15P"];
		// console.log("C"+mefAnnee(annee)+"_POP15P_CS"+csp);
		couleur = choroplete(CSP);
		listeIRIS.push(IRIS);
		listeCOULEUR.push(couleur);
		listeCSP.push(CSP);
	}
	
	d3.selectAll(".rectLegende")
		.attr("fill",function(){
			let rang = (this.attributes.itLegende.value).split("_")[1];
			return couleursCSP_choro[csp-1][rang]
		})

	d3.selectAll(".txtDate").attr("font-weight",400).attr("fill",couleurDates)
	d3.select("#text_"+annee).attr("font-weight",800).attr("fill","#333333")
	
	d3.selectAll(".txtCSP").attr("stroke","none")
	d3.select("#csp_"+csp).attr("stroke",function(){return this.attributes.fill.value})
	
	let getStyle = function (feature) {
		
		iris = feature.get("CODE_IRIS");
		COULEUR = listeCOULEUR[listeIRIS.indexOf(iris)]
		return new ol.style.Style({
			fill: new ol.style.Fill({
				color: COULEUR,
				opacity : 0.5,
			}),
		});
	
	};

	my_layer = new ol.layer.Vector({
		source: new ol.source.Vector({
			url: 'data/iris_csp_59.geojson',
			format: new ol.format.GeoJSON()
		}),
		style: function (feature) {
			return getStyle(feature);
		}
	});
	my_layer.set("opacity",0.8)
	map.removeLayer(vectorLayer);
	vectorLayer = my_layer;
	map.addLayer(vectorLayer)
}

function addBoutons(){
	for(a=dateMin;a<=dateMax;a++){
		// d3.select("#contBOutons")
			// .append("input")
			// .attr("type","button")
			// .attr("value",a)
			// .on("click",function(){
				// annee = this.attributes.value.value;
				// majCarte();
			// })
		d3.select("#svgDates")
			.append("text")
			.text(a)
			.attr("class","txtDate")
			.attr("id","text_"+a)
			.attr("fill",couleurDates)
			.attr("y",70)
			.attr("x",(a-dateMin)*(1000/(dateMax-dateMin)))
			
	}
	
	var drag = d3.behavior.drag() //fonction "drag" veut dire que tu fais bouger l'objet en l'attrapant
		.on("drag", function(d) {
			d.x += d3.event.dx;
			d3.select(this).style("cursor","grabbing").attr("transform","translate("+d.x+",0)")
			
		})
		.on("dragend", function(d){
			annee = parseInt(dateMin+(d.x*(dateMax-dateMin)/1000));
			d.x=(annee-dateMin)*1000/(dateMax-dateMin);
			d3.select(this).style("cursor","grab").transition().duration(350).attr("transform","translate("+d.x+",0)")
			majCarte();
		})
		
	
	d3.select("#svgDates")
		.append("g")
		.attr("id","bougeDate")
		.data([{"x":0}]).call(drag).style("cursor","grab")	
		.append("circle")
		.attr("cx",10)
		.attr("cy",50)
		.attr("stroke",couleurDates)
		.attr("fill","#ffffff")
		.attr("stroke-opacity",3)
		.attr("r",10)
		
	d3.select("#bougeDate")
		.append("circle")
		.attr("cx",10)
		.attr("cy",50)
		.attr("stroke",couleurDates)
		.attr("fill","#ffffff")
		.attr("stroke-opacity",3)
		.attr("r",5)
		
	
	for(b=0;b<classifCSP.length;b++){
		// d3.select("#contBOutons")
			// .append("input")
			// .attr("type","button")
			// .attr("csp",b*1+1)
			// .attr("value",classifCSP[b])
			// .on("click",function(){
				// csp = this.attributes.csp.value;
				// majCarte();
			// })
		
		d3.select("#svgCSP")
			.append("text")
			.text(classifCSP[b])
			.attr("csp",b*1+1)
			.attr("class","txtCSP")
			.attr("id","csp_"+(b*1+1))
			.attr("fill",couleursCSP[b])
			.style("cursor","pointer")
			.on("click",function(){
				csp = this.attributes.csp.value;
				majCarte();
			})
			.attr("font-size",30)
			.attr("x",5)
			.attr("y",20+b*700/(classifCSP.length))
	}
	
}

	
function dessinMap(){
	
	var stylee = new ol.style.Style({
	  fill: new ol.style.Fill({
		color: '#FF00FF'
	  }),
	  stroke: new ol.style.Stroke({
		color: '#319FD3',
		width: 1
	  }),
	  // text: new Text({
		// font: '12px Calibri,sans-serif',
		// fill: new Fill({
		  // color: '#000'
		// }),
		// stroke: new Stroke({
		  // color: '#fff',
		  // width: 3
		// })
	  // })
	});


	vectorLayer = new ol.layer.Vector({
	  source: new ol.source.Vector({
		url: 'data/iris_csp_59.geojson',
		format: new ol.format.GeoJSON()
	  }),
	  style: stylee
	});
	
	let osmLayer =  new ol.layer.Tile({
		source: new ol.source.OSM()
	  })

	// console.log(vectorLayer);


	let view = new ol.View({
          center: [340000, 6555000],
		  zoom: 12,
		  // extent: [70000,6200000,750000,6750000],
		  // extent: [minx,miny,maxx,maxy]
        });
	
	//Création de la carte
    map = new ol.Map({
        target: 'map',
        layers: [osmLayer],
        view: view,
    });
	

}

