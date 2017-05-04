//variables fixes
var width = 950,
height = 700,
CX = width/2.4,
CY = height/1.9,
nuancier = ["#DFF1FD", "#E2BF9F","#FFFFFF","#CCCCCC","#030041","red"], //mer,terre,contour,boutons,relafrica,red
// nuancierCand = ["#be2523","#f7a509","#49b7a4","#368cbe","#49bfa8","blue",nuancier[4],"orange","yellow","pink","purple"],
nuancierCand = ["#555555","#000000","#EEEEEE","#be2523","#f7a509","#2a2a5e","#368cbe","#52b588","#4a5ba5","#eb6109","#7f3011","#654595","#bec531","#c37193"],
listeCand = ["abstention","blancs","nuls","melenchon","hamon","lepen","macron","fillon","dupont","arthaud","poutou","cheminade","lassalle","asselineau"],
listeCandTX = ["Abstention","Blancs","Nuls","Jean-Luc Mélenchon","Benoît Hamon","Marine Lepen","Emmanuel Macron","François Fillon","Nicolas Dupont-Aignan","Nathalie Arthaud","Philippe Poutou","Jacques Cheminade","Jean Lassalle","François Asselineau"],
listeManquant = [],
dataVote = [],
opaFond=0.1,
lpatt = 30,
prop = 60,
esp = 30,
seuil100 = 100/prop;
Nba = 1,
abs = true,
mode = "cercles";

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
			.attr("width","80%")
			.attr("viewBox","0 0 "+width+" "+height)
			.attr("id", "map")
			.style("position","absolute")
	
	d3.select("#dessin").attr("width","80%").attr("viewBox","0 0 "+width+" "+height)
	queue()							
		.defer(d3.json,"data/pays.topojson")
		.defer(d3.csv,"data/isoAfrique.csv")
		.defer(d3.csv,"data/premiertourAfrique.csv")
		.await(callback0); 
	
	function callback0(error, dataPays,iso,dataV){
		
		dataVote = dataV;
		var path = d3.geo.path() 
			.projection(proj);
		
	  map.append("circle")
		.attr("cx", CX).attr("cy", CY)
		.attr("r", proj.scale())
		.attr("id","lamer")
		.attr("opacity",0.25)
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
						.attr("r", 0)
						.attr("id", "c"+code)
						.attr("code", code)
						.attr("class", "centro")
				}
				
			})
			.on("mouseover",showData)
			.on("mouseout",delData)
			.on("mousemove",moveLabel)
		
		// d3.select("#indic").html(listeManquant)
		d3.selectAll(".autre").attr("opacity",opaFond)
		drawInter();
		abstentionBandes()
		modeBandes();

		//draaa();
	}

}


function drawInter(){
	
	//images
	// d3.select("#map").append("image")
		// .attr("x:href","img/logo.png")
		// .attr("width",")
		// .attr("height",100)
		// .attr("x",0)
		// .attr("y",0)
	
	var debX = width/1.34,
	debY = 120;
	
	d3.select("#map")
		.append("g")
		.attr("id","candidats")
		.append("rect")
		.attr("id","fond_cercles")
		.attr("x",debX-15)
		.attr("y",debY-15)
		.attr("fill","#FFFFFF")
		.attr("width",300)
		.attr("opacity",0.7)
		.attr("height",listeCand.length*esp)
		// .on("mouseover",function(){
			// modeCercles();
		// })
		
	d3.select("#candidats")
		.selectAll(".bouleCand")
		.data(nuancierCand)
		.enter()
		.append("circle")
		.attr("cx",debX)
		.attr("cy",function(d,i){
			return i*esp + parseFloat(debY)+20;
		})
		.attr("r",8)
		.attr("fill",function(d){
			return d
		})
		.attr("class",function(d,i){
			return "bouleCand eltLeg c"+listeCand[i];
		})
		.attr("id",function(d,i){
			return "boul_"+listeCand[i];
		})
		.on("mouseover",showVote)
		// .on("mouseout",delVote)
		
	d3.select("#candidats")
		.selectAll(".recCand")
		.data(nuancierCand)
		.enter()
		.append("rect")
		.attr("x",debX-10)
		.attr("y",function(d,i){
			return i*esp + parseFloat(debY)+10;
		})
		.attr("width",20)
		.attr("height",20)
		.attr("fill",function(d){
			return d
		})
		.attr("class",function(d,i){
			return "recCand eltLeg c"+listeCand[i];
		})

	d3.select("#candidats")
		.selectAll(".nomsCand")
		.data(listeCandTX)
		.enter()
		.append("text")
		.attr("id",function(d,i){
			return "nom_"+listeCand[i];
		})
		.attr("class",function(d,i){
			return "nomsCand eltLeg c"+listeCand[i];
		})
		.attr("x",parseFloat(debX)+15)
		.attr("y",function(d,i){
			return i*esp +25+ parseFloat(debY)
		})
		.text(function(d){
			return d
		})
		.attr("font-size",14)
		// .on("mouseover",showVote)
		// .on("mouseout",delVote)
	
		
	//selecteurs bandes
	debX2 = 182;
	debY2 = 120,

	d3.select("#map")
		.append("g")
		.attr("id","s_bandes")
		.append("rect")
		.attr("id","fond_bandes")
		.attr("x",debX2-160)
		.attr("y",debY2-15)
		.attr("fill","#FFFFFF")
		.attr("width",140)
		.attr("rx",10)
		.attr("height",80)
		.attr("opacity",0.7)
		// .on("mouseover",function(){
			// modeBandes();
		// })

	d3.select("#s_bandes").selectAll(".txBd")
		.data([["premier(s)"],["candidat(s)"]])
		.enter()
		.append("text")
		.text(function(d){
			return d[0]
		})
		.attr("x",debX2-120)
		.attr("y",function(d,i){
			return parseFloat(debY2)+5+i*20
		})
		.attr("class","txBd")
	
	var vX1 = debX2-150;
	var vX2 = debX2-140;
	var vX3 = debX2-130;

	d3.select("#s_bandes").selectAll(".triBd")
		.data([[parseFloat(debY2)+30,parseFloat(debY2)+20,"moins"],[debY2-8,parseFloat(debY2)+2,"plus"]])
		.enter()
		.append("polygon")
		.attr("points",function(d){
			return vX1+","+d[1]+" "+vX2+","+d[0]+" "+vX3+","+d[1]
		})
		.attr("class","triBd")
		.attr("opacity",0.3)
		.attr("id",function(d){
			return d[2]
		})
		.attr("fill",nuancier[4])
		.on("click",function(d,i){
			var n = 2*i-1;
			change(n);
		})
		
	d3.select("#s_bandes")
		.append("text")
		.text("1")
		.attr("id","indic")
		.attr("x",debX2-144)
		.attr("font-size",14)
		.attr("font-weight",800)
		.attr("y",parseFloat(debY2)+16)
		
	//MEP
		
	d3.select("#map").selectAll(".titles")
		.data([["(Survoler les noms des candidats)",14,debX-10,0],["Par nombre de voix :",16,debX-10,1],["En pourcentage des bulletins",16,debX2-150,1],["",16,debX2-150,0]])
		.enter()
		.append("text")
		.text(function(d){
			return d[0]
		})
		.attr("x",function(d){
			return d[2]
		})
		.attr("font-weight",800)
		.attr("y",function(d){
			return debY-25-20*d[3]
		})
		.attr("font-size",function(d){
			return d[1]
		})
		.attr("id",function(d,i){
			return "title"+i;
		})
		.attr("class","titles")

		
	d3.select("#title3")
		.attr("transform",function(){
			var x = this.attributes.x.value;
			var y = this.attributes.y.value;
			return "matrix(1 0 0 1 "+x+" "+y+")"
		})
		.selectAll("tspan")
		.data([["exprimés",0,"expinsc",nuancier[3]],["pour le(s)..",80,"pourles","black"]])
		.enter()
		.append("tspan")
		.text(function(d){
			return d[0]
		})
		.attr("y",0)
		.attr("x",function(d){
			return d[1]
		})
		.attr("id",function(d){
			return d[2]
		})
		.attr("fill",function(d){
			return d[3]
		})
	
			
	d3.select("#s_bandes").append("text")
		.attr("id","selectAbs")
		.attr("text","Inscrits")
		.attr("x",debX2-120)
		.attr("y",parseFloat(debY)+52)
		
		
	d3.select("#s_bandes")
		.append("g")
		.attr("id","add")
		.on("click",abstentionBandes)
		.attr("opacity",0.3)
		.selectAll("rect")
		.data([["horiz",15,5],["vertic",5,15]])
		.enter()
		.append("rect")
		.attr("id",function(d){
			return d[0]
		})
		.attr("width",function(d){
			return d[1]
		})
		.attr("height",function(d){
			return d[2]
		})
		.attr("x",function(d,i){
			return debX2-147.5+(i*5)
		})
		.attr("y",function(d,i){
			return parseFloat(debY)+45-(i*5)
		})
		.attr("fill",nuancier[4])
	

	d3.select("#map").selectAll(".arrerieMode")
		.data([true,false])
		.enter()
		.append("circle")
		.attr("class","arrerieMode")
		.attr("id",function(d,i){
			return "fonddd"+i;
		})
		.attr("fill","#FFFFFF")
		.attr("stroke","#000000")
		.attr("stroke-width",0.5)
		.attr("r",12)
		.attr("cx",function(d){
			if(d==true){
				return debX-27
			} else {
				return debX2-167
			}
		})
		.attr("cy",debY-40)

	d3.select("#map").selectAll(".boutmode")
		.data([true,false])
		.enter()
		.append("circle")
		.attr("class","boutmode")
		.attr("id",function(d,i){
			return "select"+i;
		})
		.attr("fill",nuancier[3])
		.attr("r",5)
		.attr("fill",function(d){
			if(d==true){
				return nuancier[3]
			} else {
				return nuancier[4]
			}
		})
		.attr("cx",function(d){
			if(d==true){
				return debX-27
			} else {
				return debX2-167
			}
		})
		.attr("cy",debY-40)
		.on("mouseover",function(){
			d3.select(this).attr("r",10)
		})
		.on("mouseout",function(){
			d3.select(this).attr("r",5)
		})
		.on("click",function(d){
			if(d==false){
				modeBandes();
				d3.select(this).attr("fill",nuancier[4])
				d3.select("#select0").attr("fill",nuancier[3])
			} else {
				modeCercles();
				d3.select(this).attr("fill",nuancier[4])
				
				d3.select("#select1").attr("fill",nuancier[3])
			}
		})
		
		
	d3.select("#map").append("text")
		.text("")
		.attr("id","nompays")
		.attr("x",debX-10)
		.attr("y",debY)
		.attr("font-size",14)
		.attr("font-weight",800)
		

		
	// legende cercles
	var debX = 200,
	debY = height-150,
	valeurs = [500,1500,3000,5000];
	
	d3.select("#map")
		.append("g")
		.attr("id","legendeCercles")
		.attr("opacity",0)
		.append("rect")
		.attr("x",debX-160)
		.attr("y",debY-185)
		.attr("width",150)
		.attr("height",150)
		.attr("fill","#FFFFFF")
	
	d3.select("#legendeCercles")
		.append("text")
		.attr("x",debX-150)
		.attr("y",debY-175)
		.attr("font-size",16)
		.attr("font-weight",800)
		.text("Nombre de voix")
	
	d3.select("#legendeCercles").selectAll(".cirLegen")
		.data(valeurs)
		.enter()
		.append("circle")
		.attr("fill","none")
		.attr("stroke","black")
		.attr("stroke-width",1)
		.attr("cx",debX)
		.attr("id",function(d,i){
			return "CL"+i;
		})
		.attr("class","cirLegen")
		.attr("r",function(d){
			return d/prop;
		})
		.attr("cy",function(){
			var val = this.attributes.r.value;
			return debY - val;
		})
	

	d3.select("#legendeCercles").selectAll(".txLegen")
		.data(valeurs)
		.enter()
		.append("text")
		.attr("x",debX-150)
		.attr("class","txLegen")
		.attr("y",function(d,i){
			var val = document.getElementById("CL"+i).attributes.r.value;
			return debY - val-3;
		})
		.text(function(d){
			return d;
		})
	
	d3.select("#legendeCercles").selectAll(".liLegen")
		.data(valeurs)
		.enter()
		.append("line")
		.attr("class","liLegen")
		.attr("stroke","black")
		.attr("x1",debX-150)
		.attr("x2",function(d,i){
			var val = document.getElementById("CL"+i).attributes.r.value;
			return debX - val;
		})
		.attr("stroke-width",0.5)
		.attr("y1",function(d,i){
			var val = document.getElementById("CL"+i).attributes.r.value;
			return debY - val;
		})
		.attr("y2",function(d,i){
			var val = document.getElementById("CL"+i).attributes.r.value;
			return debY - val;
		})
		

	
	//moins de 100 voix
	d3.select("#legendeCercles").append("circle").attr("cx",debX).attr("cy",debY-3).attr("r",seuil100).attr("opacity",0.6);
	d3.select("#legendeCercles").append("line").attr("x1",debX).attr("x2",parseFloat(debX)+104).attr("y1",debY-3).attr("y2",debY-3).attr("stroke-width",0.5).attr("stroke","black").attr("opacity",0.6)
	d3.select("#legendeCercles").append("text").attr("x",parseFloat(debX)+52).attr("y",debY-7).attr("font-size",12).text("Moins de")
	d3.select("#legendeCercles").append("text").attr("x",parseFloat(debX)+55).attr("y",parseFloat(debY)+10).attr("font-size",12).text("100 voix")
	
	
	// legende bandes
	var decal = document.getElementById("bandeau").offsetHeight;
	d3.select("#legendeBandes")
		.attr("transform","translate("+(debX-140)+" "+(debY-165-decal)+") scale("+(lpatt/30)+")")
	
	
	//init
	d3.select("#moins").style("display","none")
	
}

function sortNumber(a,b){
	return a - b;
}

function abstentionBandes(){
	if(abs==false){
		abs=true;
		d3.select("#selectAbs").text("Exprimés")
		d3.select("#pourles").attr("x",66)
		d3.select("#expinsc").text("inscrits")
		d3.select("#vertic").attr("opacity",0)
		d3.selectAll(".cabstention").attr("opacity",1)
		d3.selectAll(".eltLeg").transition().duration(700).attr("transform","")
		
	} else {
		abs=false;
		d3.select("#selectAbs").text("Inscrits")
		d3.select("#pourles").attr("x",80)
		d3.select("#expinsc").text("exprimés")
		d3.select("#vertic").attr("opacity",1)
		d3.selectAll(".cabstention").attr("opacity",0)
		d3.selectAll(".eltLeg").transition().duration(700).attr("transform","translate(0 -"+esp+")")
	}
	
	bandes(Nba,abs);
}

function modeBandes(){
	if(mode == "cercles"){
		d3.selectAll(".recCand").attr("opacity",1).style("display","block")
		d3.selectAll(".bouleCand").attr("opacity",0).style("display","none")
		
		d3.select("#legendeCercles").transition().duration(400).attr("opacity",0);
		
		d3.select("#legendeBandes").transition().duration(400).attr("opacity",1);
		d3.select("#s_bandes").transition().duration(400).attr("opacity",1)
		d3.selectAll(".centro").attr("r",0).attr("opacity",0);
		d3.selectAll(".bouleCand").attr("r",8);
		
		d3.selectAll(".pays")
			.attr("fill",function(d){
				
				if(this.attributes.fill2){
					var val = this.attributes.fill2.value;
					return val;
				} else {
					return nuancier[1]
				}
			
			});
			
		if(abs==false){
			d3.selectAll(".cabstention").attr("opacity",0)
			d3.selectAll(".eltLeg").transition().duration(700).attr("transform","translate(0 -"+esp+")")
		} else {
			d3.selectAll(".cabstention").attr("opacity",1)
			d3.selectAll(".eltLeg").transition().duration(700).attr("transform","")
		}
			
		
	}
	
	mode = "bandes";
}

function modeCercles(){
	if(mode == "bandes"){
		d3.selectAll(".recCand").attr("opacity",0).style("display","none")
		d3.selectAll(".bouleCand").attr("opacity",1).style("display","block")
		d3.select("#legendeCercles").transition().duration(400).attr("opacity",1)
		
		d3.select("#legendeBandes").transition().duration(400).attr("opacity",0);
		d3.select("#s_bandes").transition().duration(400).attr("opacity",0)
		
		d3.selectAll(".pays").attr("fill",nuancier[1])
		
		d3.selectAll(".cabstention").attr("opacity",1)
		d3.selectAll(".eltLeg").transition().duration(700).attr("transform","")
		
	}
	mode = "cercles";
}

function change(i){
	Nba += i;
	if(Nba==1){
		// Nba=1;
		d3.select("#moins").style("display","none")
	}else if(Nba==5){
		// Nba =9;
		d3.select("#plus").style("display","none")
	} else {
		d3.select("#plus").style("display","block")
		d3.select("#moins").style("display","block")
	
	}
	d3.select("#indic").text(Nba);
	bandes(Nba,abs);
	
	
	
}

function bandes(nb,abs){
	if(abs==false){
		var debut = 3;
		var totalId = "exprimes"
	} else {
		var debut = 0;
		var totalId = "inscrits"
	}
	d3.selectAll("pattern").remove();
	for(i=0;i<dataVote.length;i++){
		var pays = dataVote[i].Code;
		var listeVals = [];
		var listeOk = [];
		var listeCumul = [];
		var cumul = 0;
		
		var total = dataVote[i][totalId];
		for(j=debut;j<listeCand.length;j++){
			var cand = listeCand[j];
			var coul = nuancierCand[j];
			var val = dataVote[i][cand];
			var valTxt = val;
			var perc = val/total;
			
			if(val<100000){
				valTxt = "0"+valTxt;
			} else {
				// alert(val+"_"+cand)
			}
			if(val<10000){
				valTxt = "0"+valTxt;
			}
			if(val<1000){
				valTxt = "0"+valTxt;
			}
			if(val<100){
				valTxt = "0"+valTxt;
			}
			if(val<10){
				valTxt = "0"+valTxt;
			}
			//a voir pour arrondir le pourcentage ca sera moins lourd à trier
			listeVals.push([valTxt,cand,coul,perc]);
		}
		listeVals.sort();
		
		
		for(k=0;k<nb;k++){
			listeOk.push(listeVals[listeVals.length-1-k]);
		}
		
		var cuml = 0;
		d3.select("#map")
			.append("pattern")
			.attr("width",lpatt)
			.attr("overflow","visible")
			.attr("height",lpatt)
			.attr("patternUnits","userSpaceOnUse")
			.attr("id","patt"+pays+nb)
			.attr("viewBox","0 0 90 90")
			.append("g")
			.attr("id","groupe"+pays+nb)
			.append("rect")
			.attr("x",0)
			.attr("y",0)
			.attr("width",90)
			.attr("height",90)
			.attr("fill",nuancier[1])
		
		d3.select("#groupe"+pays+nb)
			.selectAll(".bande")
			.data(listeOk)
			.enter()
			.append("rect")
			.attr("height",90)
			.attr("width",function(d){
				return d[3]*90;
			})
			.attr("class","bande")
			.attr("id",function(d,i){
				return "b"+pays+i
			})
			.attr("y",0)
			.attr("x",function(d,i){
				// var it=parseFloat(i)-1;	
				if(i>=1){
					var val = 0;
						
					for(k=0;k<i;k++){
						var add = document.getElementById("b"+pays+k).attributes.width.value;
						val = parseFloat(val) +parseFloat(add);
					}
					// if(pays=="NE"){
						// alert(val)
					// }
					return val;
					
				} else {
					return 0;
				}
				
				// if(i>0){
							
					// for(k=0;k<it;k++){
						// var val = listeOk[i][3];
						// cuml += val*90;
					// }
					// return cuml;
				// } else {
					// return 0;
				// }
				
			})
			.attr("fill",function(d,i){
				return d[2]
			})
			
		if(pays){
			d3.select("#"+pays)
				.attr("fill","url(#patt"+pays+nb+")")
				.attr("fill2","url(#patt"+pays+nb+")");
		}
	}
}

function showVote(){
	// modeCercles();
	d3.selectAll(".centro").attr("r",0).attr("opacity",0);
	d3.selectAll(".bouleCand").attr("r",8)
	var cand = (this.id).split("_")[1];
	//alert(dataVote.length)
	for(i=0;i<dataVote.length;i++){
		var val = dataVote[i][cand];
		var pays = dataVote[i].Code;
		d3.select("#c"+pays)
			.transition()
			.duration(500)
			.attr("r",function(){
				if(val==0){
					return 	0;
				} else if(val/prop<seuil100){
					return seuil100;
				} else {
					return val/prop;
				}
			})
			.attr("opacity",0.5)
			.attr("fill",function(){
				if(val/prop<seuil100){
					return "#333333"
				} else {
					return nuancierCand[(listeCand.indexOf(cand))];
				}
			})
	}
	d3.select("#boul_"+cand).attr("r",13)
}

function delVote(){
	// var cand = (this.id).split("_")[1];
	// d3.select("#boul_"+cand).attr("r",10)
	// d3.selectAll(".centro").attr("r",0).attr("opacity",0)
}


function moveLabel(){ //règle la position de la balise d'info par rapport aux coordonnées de l'évènement
	// var x = d3.event.clientX;
	// var y = d3.event.clientY-75;

	
	// d3.select(".infolabel")
		// .style("margin-left", 50*x/width+"%")
};

function delData(){
	for(i=0;i<listeCand.length;i++){
		var cand = listeCand[i];
		var nom = listeCandTX[i];
		d3.select("#nom_"+cand).text(nom);
	}
	
	d3.select("#nompays").text("(...)")
}

function showData(){
	// var Liste = "";
	var pays = this.attributes.code.value;
	var nom = this.attributes.name.value;
	var test =(this.attributes.class.value).split(" ")[1];
	// var it = this.attributes.it.value;
	if(test=="afrique"){
		for(i=0;i<dataVote.length;i++){
			if(dataVote[i].Code==pays){
				for(j=0;j<listeCand.length;j++){
					var cand = listeCand[j]
					if(mode=="cercles"){
						var val = dataVote[i][cand]
					} else {
						var val = parseInt(100*dataVote[i][cand]/dataVote[i]["exprimes"])+"%"
					}
					d3.select("#nom_"+cand).text(listeCandTX[j]+" : "+val)
					// Liste += (listeCandTX[j]+ " : "+val+"<br/>")
				}
				// var infolabel = d3.select("#carte").append("div") 
					// .attr("class", "infolabel")
					// .attr("id", "label"+pays)
					// .html(nom+"<br/><br/>"+Liste)
				d3.select("#nompays").attr("opacity",1).text(nom);
			}
		}
	}
	
	

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