var deform = 2;
var widthBarres = 5;
var heightBarres = widthBarres/100;
var nuancier = ["#E58A30", "#C31A1D","#3C5E48", "black", "#FFFFFF", "#FCFCFC","#333333","#C1C1C1"];
var choro = ["#ffe008","#ff8408","#ff0825","#b308ff","#0810ff"];
var discret = [80,200,380,640]
var decalageX = widthBarres/2;
var decalageY = widthBarres/2;
var transformation ="scale3d("+deform+", 1, 15)";
var skewB = Math.atan(decalageX/decalageY) //côté gauche
var skewC = Math.atan(decalageY/decalageX) //couvercle
var skewA = 0.8; //ombre
var transformation2 = "";
var width = 1000; 
var height = 600;

window.onload = initialize();


function initialize(){
	draw();		
		
}


function draw(){
	queue()	//chargement des donénes					 
		.defer(d3.json, "data/dept3.json") //geoDepts : polygones de la carte (départements)
		.defer(d3.csv, "data/carreaux_lille_ok.csv") 
		.await(callback0);
	
	function callback0(error,geoDepts,geo){
		
		var projection = d3.geo.albers() //définition de la projection  : carte centrée manuellement, l'échelle est définie en variabe globale
			.center([3.08,50.72])
			.rotate([0, 0])
			.parallels([43, 62])
			.scale(220000)
		
		var path = d3.geo.path() 
			.projection(projection);
		
		var map = d3.select("#content")
			.append("svg")
			.attr("viewBox","0 0 1000 1000")
			.attr("width","100%")
			.attr("id", "carte")
			.style("cursor","crosshair")
	
		// var depts = map.selectAll(".dept") //implémentation des départements
			// .data(topojson.feature(geoDepts,
				// geoDepts.objects.nuts3).features)
			// .enter()
			// .append("path")
			// .attr("d", path) 
			// .attr("fill","#FFFFFF")
			// .attr("fill-opacity",0.3)
			// .attr("opacity",0.3)
			// .attr("stroke","#FFFFFF")
			// .attr("stroke-width",0.1)
			// .attr("code", function(d){ //code
				// var code = d.properties.nuts_id;
				// var result = "";
				// if(code.length==8){
					// result = code[6] + code[7];
				// } else if(code.length==7){
					// result = code[6];
				// }
				// return result;
			// })
			// .attr("id", function(d){
				// var code = this.attributes.code.value;
				// return "d"+code;
			// })
			// .attr("name", function(d){
				// var name = d.properties.name;
				// return name;
			// })
			// .attr("class","dept")
			
		var gVilles = map.selectAll(".gVille")
			.data(geo)
			.enter()
			.append("g")
			.attr("class", "gVille")
			.attr("id", function(d,i){
				return "gr_"+i
			})
			.attr("cX", function(d) {
				return projection([d.cX, d.cY])[0]
			})
			.attr("cY", function(d) {
				return parseFloat(projection([d.cX, d.cY])[1]);
			})
			.attr("fill",function(d){
				var val = d.pop;
				if(val>discret[3]){
					return choro[4];
				} else if(val>discret[2]){
					return choro[3]
				} else if(val>discret[1]){
					return choro[2]
				} else if(val>discret[0]){
					return choro[1]
				} else {
					return choro[0]
				}
			})
			
			// .attr("opacity",0)
			
		//espace survol
		var barresA = map.selectAll(".gVille")
			.append("circle")
			.attr("cx", function(d) {
				return projection([d.cX, d.cY])[0]
			})
			.attr("class","rep")
			.attr("cy", function(d) {
				return parseFloat(projection([d.cX, d.cY])[1]);
			})
			.attr("r",25)
			// .attr("opacity",0)
			.attr("fill-opacity",0)
			// .attr("stroke",function(d){
				// var val = d.pop;
				// if(val>discret[3]){
					// return choro[4];
				// } else if(val>discret[2]){
					// return choro[3]
				// } else if(val>discret[1]){
					// return choro[2]
				// } else if(val>discret[0]){
					// return choro[1]
				// } else {
					// return choro[0]
				// }
			// })
			
		var barresA = map.selectAll(".gVille")
			.append("circle")
			.attr("class","rep")
			.attr("cx", function(d) {
				return projection([d.cX, d.cY])[0]
			})
			.attr("cy", function(d) {
				return parseFloat(projection([d.cX, d.cY])[1]);
			})
			// .attr("fill","none")
			// .attr("stroke",function(d){
				// var val = d.pop;
				// if(val>discret[3]){
					// return choro[4];
				// } else if(val>discret[2]){
					// return choro[3]
				// } else if(val>discret[1]){
					// return choro[2]
				// } else if(val>discret[0]){
					// return choro[1]
				// } else {
					// return choro[0]
				// }
			// })
			.attr("r",0.5)
			// .attr("stroke-opacity",0.3)
			
		
		//côté gauche
		var barresA = map.selectAll(".gVille")
			.append("rect")
			.attr("x", function(d) {
				return projection([d.cX, d.cY])[0]
			})
			.attr("y0", function(d) {
				var val = d.pop;
				return parseFloat(projection([d.cX, d.cY])[1]) - heightBarres*val;
			})
			.attr("stroke-width",0.2)
			.attr("stroke",nuancier[4])
			.attr("width", decalageX)
			.attr("height0", function(d){
				var val = d.pop;				
				return heightBarres*val
			})
			.attr("height",0)
			.attr("y", function(d) {
				return parseFloat(projection([d.cX, d.cY])[1]);
			})
			// .attr("opacity", 0.8)
			.attr("class", "barresA")
			.attr("id", function(d){
				return "bA_"+d.Ville
			})
			.style("transform", function(d){
				var decalX = parseFloat(projection([d.cX, d.cY])[0]);		
 				var decalY = Math.tan(skewC)*decalX;
 				return transformation2+" skewY("+skewC+"rad) translate(-"+decalageX+"px,-"+decalY+"px)";
 			});
		
		//plafond
		var barresB = map.selectAll(".gVille")
			.append("rect")
			.attr("x", function(d) {
				return projection([d.cX, d.cY])[0]
			})
			.attr("y", function(d) {
				var val = d.pop;
				return parseFloat(projection([d.cX, d.cY])[1]) - heightBarres*val
			})
			.attr("width", widthBarres)
			.attr("height", decalageY)
			.attr("yb", function(d) {
				return parseFloat(projection([d.cX, d.cY])[1]);
			})
			.attr("opacity", 0)
			.attr("class", "barresB")
			.attr("id", function(d){
				return "bB_"+d.Ville
			})
			.style("transform", function(d){
				var val = d.pop;
				var decalY = parseFloat(projection([d.cX, d.cY])[1]) - heightBarres*val;	
 				var decalX = (Math.tan(skewB)*decalY) //+parseFloat(decalageX);
 				return transformation2+" skewX("+skewB+"rad) translate(-"+decalX+"px, -"+decalageY+"px)";
 			});
			
		
		//barres de face
		var barres = map.selectAll(".gVille")
			.append("rect")
			.attr("x", function(d) {
				return projection([d.cX, d.cY])[0]
			})
			.attr("y0", function(d) {
				var val = d.pop;
				return parseFloat(projection([d.cX, d.cY])[1]) - heightBarres*val;
			})
			.attr("height0", function(d){
				var val = d.pop;				
				return heightBarres*val
			})
			.attr("height",0)
			.attr("y", function(d) {
				return parseFloat(projection([d.cX, d.cY])[1]);
			})
			.attr("width", widthBarres)
			.style("opacity", 0.95)
			.attr("stroke-width",0.2)
			.attr("stroke",nuancier[4])
			.style("transform", transformation2)
			.attr("class", "barres")
			.attr("ville",  function(d){
				return d.Ville
			})
			.attr("id", function(d){
				return "b_"+d.Ville
			})
			.on("mouseover", function(){
				hoverVille(this);
			})
			.on("mouseout", function(){
				outVille(this);
			})
			.on("click", function(){
				labelVille(this);
			})
		
		map.selectAll(".gVille").on("mouseover",function(){
			d3.select(this).selectAll(".rep")
				// .attr("opacity",1)
				// .transition()
				// .duration(1000)
				// .attr("r",20)
				// .attr("opacity",0)
				.remove()
					
			d3.select(this).select(".barresA")
				.transition()
					.duration(500)
					.attr("height",function(){
						return this.attributes.height0.value;
					})
					.attr("y",function(){
						return this.attributes.y0.value;
					})
			
			d3.select(this).select(".barresB")
				.transition()
				.duration(500)
				.attr("opacity",1)			
			
			d3.select(this).select(".barres")
				.transition()
				.duration(500)
				.attr("height",function(){
					return this.attributes.height0.value;
				})
				.attr("y",function(){
					return this.attributes.y0.value;
				})
			})
		ind=00
		// montimer=window.setInterval(plouc,100);
		function plouc(){
			ind++;
			d3.select("#v0").attr("value",ind)
			// d3.select("#gr_"+ind).attr("opacity",1)
			d3.select("#gr_"+ind).select(".barresA")
				.transition()
					.duration(500)
					.attr("height",function(){
						return this.attributes.height0.value;
					})
					.attr("y",function(){
						return this.attributes.y0.value;
					})
			
			d3.select("#gr_"+ind).select(".barresB")
				.transition()
				.delay(500)
				.attr("opacity",1)			
			
			d3.select("#gr_"+ind).select(".barres")
				.transition()
				.duration(500)
				.attr("height",function(){
					return this.attributes.height0.value;
				})
				.attr("y",function(){
					return this.attributes.y0.value;
				})
		}
	}
}
