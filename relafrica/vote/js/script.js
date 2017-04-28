//variables fixes
var width = 1000,
height = 600,
CX = width/3.5,
CY = height/2,
nuancier = ["#DFF1FD", "#E2BF9F","#FFFFFF"], //mer,terre,contour
nuancierCand = ["#be2523","#f7a509","#49b7a4","#368cbe","#49bfa8","blue","red","orange","yellow","pink","purple"],
listeCand = ["melenchon","hamon","lepen","macron","fillon","dupont","arthaud","poutou","cheminade","lassalle","asselineau"],
listeManquant = [],
dataVote = [],
opaFond=0.2,
prop = 50;

var proj = d3.geo.orthographic()
	.translate([CX, CY])
	.clipAngle(90)
	.rotate([-15,-2])
	.scale(460);

window.onload = initialize();

function initialize() {
	drawMap();
}

function drawMap(){
	var map = d3.select("#carte") 
			.append("svg")
			.attr("width", width)
			.attr("height", height)
			.attr("id", "map")
	
	
	queue()											
		.defer(d3.json,"data/pays.topojson")
		.defer(d3.csv,"data/isoAfrique.csv")
		.defer(d3.csv,"data/premiertour.csv")
		.await(callback0); 
	
	function callback0(error, dataPays,iso,dataV){
		
		dataVote = dataV;
		var path = d3.geo.path() 
			.projection(proj);
		

	  map.append("circle")
		.attr("cx", CX).attr("cy", CY)
		.attr("r", proj.scale())
		.attr("id","lamer")
		.attr("opacity",opaFond)
		.style("fill", nuancier[0]);
		

		
/////////////////////////////////////////////////////////////////////////////////////////:
		
		var pays = map.selectAll(".pays")  
			.data(topojson.feature(dataPays,
				dataPays.objects.countries).features)
			.enter() 
			.append("path") 
			.attr("d", path) 
			.attr("fill", nuancier[1])
			.attr("stroke",nuancier[2])
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
				if(val!=""){
					d3.select(this).attr("class","pays afrique")
					return val;
				} else {
					d3.select(this).attr("class","pays autre")
					return "";
				}
				
			})
			.attr("name", function(d){
				var code = d.id;
				var val = "";
				for(i=0;i<iso.length;i++){
					if(iso[i].num==code){
						val = iso[i].name;
					}
				}
				return val;
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
			.each(function(d,i){
				var centre = this.attributes.centre.value;
				var code = this.attributes.code.value;
				var nam = this.attributes.name.value;
				var liste = centre.split(",");
				if(liste[0]=="NaN"||code==""){
					listeManquant.push(nam)
				} else {
					map.append("circle")
						.attr("cx", liste[0])
						.attr("cy", liste[1])
						.attr("r", 1)
						.attr("id", "c"+code)
						.attr("code", code)
						.attr("class", "centro")
				}
				
			})
		
		// d3.select("#indic").html(listeManquant)
		d3.selectAll(".autre").attr("opacity",opaFond)
		drawInter();
		//draaa();
	}

}


function drawInter(){
	var debX = width/1.6,
	debY = 30,
	esp = 40;
	
	d3.select("#map")
		.append("g")
		.attr("id","candidats")
		.append("rect")
		.attr("x",debX-15)
		.attr("y",debY-15)
		.attr("fill","#FFFFFF")
		.attr("width",120)
		.attr("opacity",0.7)
		.attr("height",listeCand.length*esp)
		
	d3.select("#candidats")
		.selectAll(".boule")
		.data(nuancierCand)
		.enter()
		.append("circle")
		.attr("cx",debX)
		.attr("cy",function(d,i){
			return i*esp + parseFloat(debY);
		})
		.attr("r",10)
		.attr("fill",function(d){
			return d
		})
		.attr("class","boule")
		.attr("id",function(d,i){
			return "boul_"+listeCand[i];
		})
		.on("mouseover",showVote)
		.on("mouseout",delVote)

	d3.select("#candidats")
		.selectAll(".nomsCand")
		.data(listeCand)
		.enter()
		.append("text")
		.attr("x",parseFloat(debX)+15)
		.attr("y",function(d,i){
			return i*esp + 5+ parseFloat(debY)
		})
		.text(function(d){
			return d
		})
		.attr("class","nomsCand")
		
		
	// legende
	var debX = 40,
	debY = height-40,
	valeurs = [100,500,1000,5000];
	
	d3.select("#map")
		.append("g")
		.attr("id","legende")
	
	d3.select("#legende").selectAll(".cirLegen")
		.data(valeurs)
		.enter()
		.append("circle")
		.attr("fill","none")
		.attr("stroke","black")
		.attr("stroke-width",2)
		.attr("cx",debX)
		.attr("class","cirLegen")
		.attr("r",function(d){
			return d/prop;
		})
		.attr("cy",function(){
			var val = this.attributes.r.value;
			return debY - val;
		})
		
}

function showVote(){
	var cand = (this.id).split("_")[1];
	//alert(dataVote.length)
	for(i=0;i<dataVote.length;i++){
		var val = dataVote[i][cand];
		var pays = dataVote[i].Code;
		d3.select("#c"+pays)
			.transition()
			.duration(500)
			.attr("r",val/prop)
			.attr("opacity",0.5)
			.attr("fill",nuancierCand[(listeCand.indexOf(cand))]);
	}
	d3.select(this).attr("r",20)
}

function delVote(){
	d3.select(this).attr("r",10)
	d3.selectAll(".centro").attr("r",0).attr("opacity",0)
	
}

function draaa(){
	d3.select("#map").append("circle").attr("id","slt")
		.attr("fill",nuancier[3]).attr("r",15).attr("cx",CX).attr("cy",CY);
	var drag = d3.behavior.drag() //fonction "drag" veut dire que tu fais bouger l'objet en l'attrapant
		.on("drag", function(d) {
			d.x += d3.event.dx;
			d.y += d3.event.dy;
			d3.select(this).style("cursor","grabbing").attr("transform", function(d,i){
				return "translate("+d.x+","+d.y+")"
			})
			proj.rotate([d.x,-d.y])
			var path = d3.geo.path().projection(proj);
			d3.select("#map").selectAll(".pays")  
				.attr("d", path)
				.attr("centre",function(d){
					var centro = path.centroid(d);
					return centro;
				})
			d3.select("#map").selectAll(".centro").attr("cx",function(){
				var id = this.attributes.code.value;
				if(document.getElementById(id)){
					var centre = document.getElementById(id).attributes.centre.value;
					var liste = centre.split(",");
					return liste[0]
				} else {
					//alert(id);
					return 0;
				}
				
			})
			.attr("cy",function(){
				var id = this.attributes.code.value;
				if(document.getElementById(id)){
					var centre = document.getElementById(id).attributes.centre.value;
					var liste = centre.split(",");
					return liste[1]
				} else {
					//alert(id);
					return 0;
				}
				
			})
		})
		.on("dragend", function(d){
			d3.select(this).style("cursor","grab");
			alert(d.x+" : -"+d.y)
			
		})
	d3.select("#slt").data([{"x":-10,"y":-5}]).call(drag)
}