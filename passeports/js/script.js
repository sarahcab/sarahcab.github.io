///Géométriques
var width = 1500,
height = 1000,

///Graphiques
nuancier = ["#FFFFFF", "#BABABA","#767676","#353535"],

///Géographiques
scale=320,

proj = d3.geo.orthographic()
	.translate([width / 4, height / 3])
	.clipAngle(90)
	.scale(scale)
	.rotate([0,-10]);

proj2 = d3.geo.orthographic()
	.translate([width / 4, height / 3])
	.clipAngle(90)
	.scale(scale)
	.rotate([180,10]);

window.onload = initialize();

function initialize() {
	drawMap();
	dragMap();
}

function drawMap(){
	///Chargement des données
	queue()											
		.defer(d3.json,"data/pays.topojson")
		.defer(d3.csv,"data/iso.csv")
		.await(callback0); 
	
	function callback0(error, dataPays,iso,primos){
		///SVG content
		var map = d3.select("#carte") 
			.append("svg")
			.attr("width", width)
			.attr("height", height)
			.attr("id", "map")
			.style("overflow","visible")
		
		///Gradient
		grandient = map.append("defs")
			.append("radialGradient")
			.attr("id","white_light")
			.selectAll("stop")
			.data([["#FFFFFF","5%"],["#EEEEEE","100%"]])
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
		
		var miroir = map.append("g")
			.attr("id","miroir")
			.attr("opacity",0.85)
			
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
			.style("fill", "#CCCCCC")
			.style("stroke", "#FFFFFF");
			
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
			.attr("stroke","#FFFFFF")
			.attr("stroke-width",0.6)
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
			
		///Copie
		copie.append("use")
			.attr("xlink:href","#lamer")
			.attr("x",0)
			.attr("y",0)
			.attr("id","clone_lamer")

		// copie.append("use")
			// .attr("xlink:href","#graticule")
			// .attr("x",0)
			// .attr("y",0)
			// .attr("id","clone_graticule")
		var path = d3.geo.path() 
			.projection(proj2);
		
		var gratLines = copie.append("g").attr("id","graticule").selectAll(".gratLines") 
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
			.attr("stroke","#FFFFFF")
			.attr("stroke-width",0.6)
			.attr("class","pays2")

		///Miroir
		miroir.append("rect")
			.attr("x",640)
			.attr("y",0)
			.attr("width",600)
			.attr("height",600)
			.attr("fill","#EEEEEE")
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
	}
		
}

function dragMap(){
	var drag = d3.behavior.drag() //fonction "drag" veut dire que tu fais bouger l'objet en l'attrapant
		.on("drag", function(d) {
			d3.select(this).style("cursor","grab");	
			d.x += d3.event.dx/2;
			d.y += d3.event.dy/2;
			proj.rotate([d.x,d.y])
			var path = d3.geo.path().projection(proj);
			d3.select("#map").selectAll(".pays")  
				.attr("d", path)
		})
		.on("dragend", function(d){
			d3.select(this).style("cursor","grab");	
			// alert(d.x+" , -"+d.y);
		})
	d3.select("#globe").data([{"x":0,"y":-10}]).call(drag)
}