///Géométriques
var width = 1500,
height = 1000,

///Graphiques
nuancier = ["#FFFFFF","#EEEEEE","#CCCCCC","#EEEEFF","#000000"],
nuancierQuot = ["#D4EEFC","#BDD4EA","#98A9D1","#9974AE","#952C83"],
discretQuot = [0,0.2,0.5,0.8,1],

///Géographiques
scale=320,
proj = d3.geo.orthographic()
	.translate([width / 4, height / 3])
	.clipAngle(90)
	.scale(scale)
	.rotate([-50,-20]),
proj2 = d3.geo.orthographic()
	.translate([width / 4, height / 3])
	.clipAngle(90)
	.scale(scale)
	.rotate([-240,20]);

window.onload = initialize();

function initialize() {
	///Chargement des données
	queue()											
		.defer(d3.json,"data/pays.topojson")
		.defer(d3.csv,"data/iso.csv")
		.await(callback0); 
	
	function callback0(error, dataPays,iso){
		drawMap(dataPays,iso);
		dragMap();
	}
}

function drawMap(dataPays,iso){
		///SVG content
		var map = d3.select("#carte") 
			.append("svg")
			.attr("viewBox","0 0 "+width+" "+height)
			.attr("width", "100%")
			.attr("id", "map")
			.style("overflow","visible")
		
		///Gradient
		grandient = map.append("defs")
			.append("radialGradient")
			.attr("id","white_light")
			.selectAll("stop")
			.data([[nuancier[0],"5%"],[nuancier[1],"100%"]])
			.enter()
			.append("stop")
			.attr("stop-color",function(d){
				return d[0]
			})
			.attr("offset",function(d){
				return d[1]
			})
			
			
			
		///Elements principaux		
		var copie= map.append("g")
			.attr("id","copie")
			.attr("opacity",1)
			.attr("transform","translate(1200,50) scale(-0.7,0.7)")
		
		var copie2= map.append("g")
			.attr("id","copie")
			.attr("opacity",1)
			.attr("clip-path","url(#miroir_clip)")
		
		var miroir = map.append("g")
			.attr("id","miroir")
			.attr("opacity",0.85)
			
		var legende = map.append("g")
			.attr("id","legende")
			
		var globe = map.append("g")
			.attr("id","globe")
			
		var graticule = d3.geo.graticule()
			.step([30, 20]); 
		
		var path = d3.geo.path() 
			.projection(proj);
		
		///Mer
		globe.append("circle")
			.attr("cx", width / 4).attr("cy", height / 3)
			.attr("r", proj.scale())
			.attr("id","lamer")
			.style("fill", nuancier[3])
			.style("stroke", nuancier[0]);
			
		// copie.append("use")
			// .attr("xlink:href","#lamer")
			// .attr("x",0)
			// .attr("x",width/2.5)
			// .attr("y",0)
			// .attr("id","clone_lamer")
			
	
		
		///Géographie
		var gratLines = globe.append("g").attr("id","graticule").selectAll(".gratLines") 
			.data(graticule.lines) 
			.enter() 
			.append("path")
			.attr("class", "gratLines")
			.attr("d", path)
			.attr("fill","none")
			.attr("stroke",nuancier[0])
			.attr("stroke-width",0.6)
		
		var pays = globe.selectAll(".pays")  
			.data(topojson.feature(dataPays,
				dataPays.objects.countries).features)
			.enter() 
			.append("path") 
			.attr("d", path) 
			.attr("fill", nuancier[2])
			.attr("stroke",nuancier[0])
			.attr("stroke-width",0.6)
			.style("cursor","pointer")
			.attr("centre",function(d,i){
				var centro = path.centroid(d);
				return centro;
			})
			.attr("codeNum", function(d){
				var code = d.id;
				return code;
			})
			.attr("code", function(d){
				var code = d.id;
				var val = "";
				for(i=0;i<iso.length;i++){
					if(iso[i].num==code){
						val = iso[i].alpha;
					}
				}
				return val;
			})
			.attr("id", function(){
				var val = this.attributes.code.value;
				return val;
			})
			.attr("class",function(){
				var val = this.attributes.code.value;
				return val+" pays";
			})
			// .each(function(d,i){
				// var val = this.attributes.code.value;
				// d3.select("#copie").append("use")
					// .attr("xlink:href","#"+val)
					// .attr("x",0)
					// .attr("y",0)
					// .attr("class","paysclone")
					// .attr("id","clo_"+val)	
			// })
			.on("mouseover",function(d,i){
				var val = this.attributes.code.value;
				d3.select("#indic").html(val);
			})
			
		///Miroir
		miroir.append("rect")
			.attr("x",0)
			.attr("y",0)
			.attr("width",1600)
			.attr("height",600)
			.attr("fill",nuancier[1])
			.attr("id","surface_mir")
		
		miroir.append("clipPath")
			.attr("id","miroir_clip")
			.append("use")
			.attr("xlink:href","#surface_mir")
			
		miroir.append("circle")
			.attr("cx",710)
			.attr("cy",60)
			.attr("r",500)
			.attr("fill","url(#white_light)")
			.attr("clip-path","url(#miroir_clip)")
			
		///Copies
		copie2.append("use")
			.attr("xlink:href","#legende")
			.attr("x",0)
			.attr("y",0)
			.attr("id","clone_legende")
			.attr("transform","translate(4,-1.5)")
			
		copie.append("use")
			.attr("xlink:href","#lamer")
			.attr("x",0)
			.attr("y",0)
			.attr("id","clone_lamer")

		var path = d3.geo.path() 
			.projection(proj2);
		
		var gratLines = copie.append("g").attr("id","graticule2").selectAll(".gratLines") 
			.data(graticule.lines) 
			.enter() 
			.append("path")
			.attr("class", "gratLines")
			.attr("d", path)
			.attr("fill","none")
			.attr("stroke",nuancier[0])
			.attr("stroke-width",0.6)		
			
		var pays2 = copie.selectAll(".pays")  
			.data(topojson.feature(dataPays,
				dataPays.objects.countries).features)
			.enter() 
			.append("path") 
			.attr("d", path) 
			.attr("fill", nuancier[2])
			.attr("stroke",nuancier[0])
			.attr("stroke-width",0.6)
			.attr("class","pays2")
			
	
		///Titre
		map.append("text")
			.attr("x",400)
			.attr("y",-10)
			.text("Frontière : ligne imaginaire facile à traverser lorsqu'on est blanc")
			.attr("font-size",20)
			
		///Légende
		var debX=750,
		debY=520,
		wCa = 20;

		legende.selectAll(".eltQuot")
			.data(discretQuot)
			.enter()
			.append("text")
			.attr("x",debX*1+wCa*1.2)
			.attr("y",function(d,i){
				return debY*1+3+wCa*1.2*i;
			})
			.text(function(d){
				return d
			})
			
		legende.selectAll(".eltQuot")
			.data(nuancierQuot)
			.enter()
			.append("rect")
			.attr("x",debX)
			.attr("y",function(d,i){
				return debY*1+wCa*1.2*i;
			})
			.attr("width",wCa)
			.attr("height",wCa)
			.attr("fill",function(d){
				return d
			})
			
}

function dragMap(){
	var drag = d3.behavior.drag() //fonction "drag" veut dire que tu fais bouger l'objet en l'attrapant
		.on("drag", function(d) {
			d3.select(this).style("cursor","grabbing");	
			d.x += d3.event.dx/2;
			d.y += -d3.event.dy/2;
			
			proj.rotate([d.x,d.y])
			var path = d3.geo.path().projection(proj);
			d3.select("#map").selectAll(".pays")  
				.attr("d", path)
			d3.select("#graticule").selectAll(".gratLines") 
				.attr("d", path)
				
			proj2.rotate([d.x-180,-d.y])
			var path = d3.geo.path().projection(proj2);
			d3.select("#copie").selectAll(".pays2")  
				.attr("d", path)
			d3.select("#graticule2").selectAll(".gratLines") 
				.attr("d", path)
		})
		.on("dragend", function(d){
			d3.select(this).style("cursor","grab");	
			// alert(d.x+" , -"+d.y);
		})
	d3.select("#globe").data([{"x":-50,"y":-20}]).call(drag).style("cursor","grab");	
}