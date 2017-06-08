//variables fixes
var width = 420; 
var height = 450;
var date = 1945;
var listeDates = [1945,1950,1972];
var widthBarres = 8;
var anneeMin=1945;
var anneeMax=2016;
var heightBarres = widthBarres;
var diam = heightBarres;
var strokeQuot = 1.7;
var socle = diam*2.5;
var dataQuot = [];
var dataTir = [];
var scale = 2200;
var coeffSvg = 0.47; //svgcarte/svggraph
var nuancier = ["#F08300","#E42420","#CCCCCC","#F08300", "#4EBCC2","#2A4A9A"]; //titres locaux, titres nationaux,contours boules+roues arrières, survol locaux(!!dans le css), tirage locaux, tirage nationaux
var nuancierChoro = ["#BAADCC","#D2CB96","#95916D","#605F42"]; //titres locaux, titres nationaux,contours boules+roues arrières
var valsChoro = [2,4,6];
var itDate =0;
var vitAnim = 2000;

//variables fixes du graphique (récupérées du SVG)
var decalFin = 30;
var maxTit = 200;
var maxTir = 10000000;
var xMin = document.getElementById("trait_0").attributes.x1.value;
var xMax = document.getElementById("trait_0").attributes.x2.value - decalFin;
var yMin = document.getElementById("axe_vert").attributes.y1.value; 
var yMax = document.getElementById("axe_vert").attributes.y2.value;
var w = xMax-xMin;
var h = yMin-yMax; //le max et le min sont inversés car la valeur 0 est en bas

var ampli = (anneeMax-anneeMin)
var pasX= w/ampli;
var echTit = h/maxTit;
var echTir = h*100000/maxTir; //divisé par 100 000 : on a divisé par 100 dans le talbeau, et dans la source c'est écrit "tirage moyen journalier en millier au mois de juin chaque année" 
	

//variables mobiles
var nomsVilles = [];
var listeVilles = new Object();

var nomsDepts = [];
var listeDept = new Object();

//donnees fictives!!
var listeDate = [1946,1960,1970,1984,2000,2016];

window.onload = initialize();


function initialize(){
	initMap();
	actions();
}

function actions(){
	d3.select("#reculer").on("click",function(){
		// d3.selectAll(".mdSimple").attr("class","cliquable mdSimple");
		// d3.selectAll(".mdExplo").attr("class","mdExplo");
		d3.selectAll(".indSimple").attr("fill","#3F1112");
		d3.selectAll(".indExplo").attr("fill","#FFFFFF");
		d3.select("#voile_roue0").transition().duration(500).attr("opacity",0.5)
		
		itDate = itDate -1;
		if(itDate<0){
			itDate=0
		}
		if(itDate==0){
			d3.select(this).attr("class","mdSimple").attr("opacity",0.2);
		}
		d3.select("#avancer").attr("class","mdSimple cliquable").attr("opacity",1);
		date = listeDate[itDate];
		calc();
		majVilles();
		majDepts();
		majGraph();
	})
	
	d3.select("#avancer").on("click",function(){
		// d3.selectAll(".mdSimple").attr("class","cliquable mdSimple");
		// d3.selectAll(".mdExplo").attr("class","mdExplo");
		d3.selectAll(".indSimple").attr("fill","#3F1112");
		d3.selectAll(".indExplo").attr("fill","#FFFFFF");
		d3.select("#voile_roue0").transition().duration(500).attr("opacity",0.5)
		
		
		itDate = itDate*1 + 1;
		if(itDate>listeDate.length-1){
			itDate=listeDate.length-1;
		}
		if(itDate==listeDate.length-1){
			d3.select(this).attr("class","mdSimple").attr("opacity",0.2);
		}
		d3.select("#reculer").attr("class","mdSimple cliquable").attr("opacity",1);
		var ancDate=date;
		date = listeDate[itDate];
		d3.select("#date_ind").text(date)
		calc();
		majVilles();
		majDepts();
		majGraph();
		
		indic=ampli*0.15/(date-ancDate);
		tourne(indic)
		setTimeout(function(){
			tourne()
		},vitAnim);
	})
	
	d3.select("#explo").on("click",function(){
		// d3.selectAll(".mdSimple").attr("class","mdSimple");
		// d3.selectAll(".mdExplo").attr("class","cliquable mdExplo");
		d3.selectAll(".indSimple").attr("fill","#FFFFFF");
		d3.selectAll(".indExplo").attr("fill","#3F1112");
		d3.select("#voile_roue0").transition().duration(500).attr("opacity",0)
		
		tourne(1)
	})
	
	dragWheel()
	
}

function dragWheel(){
	var drag = d3.behavior.drag() //fonction "drag" veut dire que tu fais bouger l'objet en l'attrapant
	.on("drag", function(d) {
		
		d.x += d3.event.dx;
		d.y += d3.event.dy;
		
		var quot= Math.sqrt(d.x*d.y);
		
		// if(d.x<=min){
			// d.x = min;
		// } else if(d.x>=max){
			// d.x = max;
		// }
		d3.select("#roue0").style("cursor","grabbing").attr("transform", function(){
			return "rotate("+quot+" 311.5 184.3)"
		})
		
	})
	.on("dragend", function(d){
		var quot= d.x*d.y;
		alert(quot)
		d3.select(this).style("cursor","grab");
	})
		
	
	d3.select("#drag0").data([ {"x":0,"y":0}]).attr("transform","rotate(0 311.5 184.3)")
		.call(drag).style("cursor","grab")
}
var itTest = 0;
function tourne(indic){
	if(itTest%2==0){
		d3.selectAll(".tourne")
			.attr("class","tourne active")
			.style("animation",function(){
				if(this.attributes.sens.value=="false"){//sens non trigo
					var ss = "tourneD "
				} else {
					var ss= "tourneG "
				}
				var vit = indic*8/(this.attributes.vitesse.value)
				return ss+vit+"s linear"
			})
			.style("animation-iteration-count","infinite")
			.style("transform-origin",function(){
				if(this.attributes.centrex){
					var cx = this.attributes.centrex.value;
					var cy= this.attributes.centrey.value;
					return cx+"px "+cy+"px"
				}			
			})
		
		//les textes
		// var cxT = document.getElementById("roue0").attributes.centrex.value;
		// var cyT = document.getElementById("roue0").attributes.centrey.value;
		// d3.selectAll(".exdate")
			// .style("animation","opac 8s linear")
			// .style("animation-iteration-count","infinite")
		
	} else {
		d3.selectAll(".tourne")
		.attr("class","tourne")
		.style("animation","")
		.style("animation-iteration-count","")
		.style("transform-origin","")
	}
	itTest++;
	
		
}

function initMap(){
	queue()									 
		.defer(d3.json, "data/dept3.json") 
		.defer(d3.csv,"data/coordVilles.csv")
		.defer(d3.csv,"data/Nombre_tirages.csv")
		.defer(d3.csv,"data/quotidiens.csv")
		.await(callback0);


	function callback0(error, geoDepts, geoVilles, dataT, dataQ){ //geo pays - geo depts - villes - tirage - noms quotidiens 
		dataQuot = dataQ;
		dataTir = dataT
		
		var projection = d3.geo.albers() 
			.center([2.3,46.7])
			.rotate([0, 0])
			.parallels([43, 62])
			.scale(scale)
			.translate([width/2,height/2])
		
		var path = d3.geo.path() 
			.projection(projection);
		
		
		var map = d3.select("#innercarte") 
			.append("svg")
			.attr("viewBox", "0 30 "+width+" "+height)
			.attr("width", coeffSvg*100+"%")
			.attr("id", "carte")
			.style("position","absolute")
			.style("margin-left","53%")
			.style("overflow","visible")
			
		// map.append("rect") //background
			// .attr("x",0)
			// .attr("y",0)
			// .attr("width",width)
			// .attr("height",height)
			// .attr("fill","grey")
			// .attr("opacity",0.1)
		
		var depts = map.selectAll(".dept")
			.data(topojson.feature(geoDepts,
				geoDepts.objects.nuts3).features)
			.enter()
			.append("path")
			.attr("d", path) 
			.attr("fill","#FFFFFF")
			.attr("stroke","#FFFFFF")
			.attr("stroke-width",0.1)
			.attr("code", function(d){
				var code = d.properties.nuts_id;
				var result = "";
				if(code.length==8){
					result = code[6] + code[7];
				} else if(code.length==7){
					result = code[6];
				}
				return result;
			})
			.attr("id", function(d){
				var code = this.attributes.code.value;
				if(code!=""){
					nomsDepts.push(code);
				}
				
				return "d"+code;
			})
			.attr("name", function(d){
				var name = d.properties.name;
				return name;
			})
			.attr("transform",function(){
				if(this.id == "d2A"||this.id=="d2B"){
					return "translate(-40,25)"
				}
			})
			.attr("class","dept")

			
		var gVilles = map.selectAll(".gVille")
			.data(geoVilles)
			.enter()
			.append("g")
			.attr("class", "gVille")
			.attr("Ville", function(d){
				return d.Ville
			})
			.attr("id", function(d){
				return "gr_"+d.Ville
			})
			.attr("cX", function(d) {
				return projection([d.cX, d.cY])[0]
			})
			.attr("cY", function(d) {
				return parseFloat(projection([d.cX, d.cY])[1]);
			})
			.attr("transform",function(){
				if(this.id == "gr_Bastia"||this.id=="gr_Ajaccio"){
					return "translate(-40,25)"
				}
			})
			
		var barres = map.selectAll(".gVille")
			.append("line")
			.attr("x1",function(d) {
				return projection([d.cX, d.cY])[0] - socle/2
			})
			.attr("x2",function(d) {
				return projection([d.cX, d.cY])[0] + socle/2
			})
			.attr("y1",function(d) {
				return parseFloat(projection([d.cX, d.cY])[1]);
			})
			.attr("y2",function(d) {
				return parseFloat(projection([d.cX, d.cY])[1]);
			})
			.attr("stroke-width",strokeQuot*0.7)
			.attr("stroke",nuancier[2])
		
		// var barres = map.selectAll(".gVille")
			// .append("rect")
			// .attr("x", function(d) {
				// return projection([d.cX, d.cY])[0]
			// })
			// .attr("y", function(d) {
				// return parseFloat(projection([d.cX, d.cY])[1]);
			// })
			// .attr("y0", function(d) {
				// return parseFloat(projection([d.cX, d.cY])[1]);
			// })
			// .attr("width", widthBarres)
			// .attr("height", 0)
			// .attr("stroke-width",0.1)
			// .attr("stroke",nuancier[4])
			// .attr("class", "barres")
			// .attr("ville",  function(d){
				// return d.Ville
			// })
			// .attr("id", function(d){
				// return "b_"+d.Ville
			// })
		//trait corse
		p1 = projection([8.5,43.5])
		p2 = projection([5.5,41.5])
		map.append("line")
			.attr("x1",p1[0])
			.attr("y1",p1[1])
			.attr("x2",p2[0])
			.attr("y2",p2[1])
			.attr("stroke-width",strokeQuot/2)
			.attr("stroke",nuancier[2])
			
		//espace survol
		var reps = projection(["-8.5","48"])
		var recul = 110;
		map.selectAll(".indicsCarte")
			.data([[nuancier[2],10,"ind_avant"],["#000000",13,"ind_main"],[nuancier[2],10,"ind_apres"]])
			.enter()
			.append("text")
			.attr("x",reps[0])
			.attr("y",function(d,i){
				var val = reps[1]-i*recul/7-recul/2;
				return val;
			})
			.attr("class","indicsCarte")
			.attr("font-size",function(d){
				return d[1]
			})
			.attr("fill",function(d){
				return d[0]
			})
			.attr("id",function(d){
				return d[2]
			})

		map.selectAll(".trrr")
			.data([[],[]])
			.enter()
			.append("line")
			.attr("x1",reps[0])
			.attr("x2",reps[0])
			.attr("x3",reps[0]*1+150)
			.attr("y1",function(d,i){
				var val = reps[1]-recul/2.1-(1+i*1)*recul/7;
				return val;
			})
			.attr("y2",function(d,i){
				var val = reps[1]-recul/2.1-(1+i*1)*recul/7;
				return val;
			})
			.attr("stroke","#000000")
			.attr("stroke-width",0.5)
			.attr("class","trrr")
			
			
			
		map.append("text")
			.attr("x",reps[0])
			.attr("y",reps[1]-recul)
			.attr("class","indicsCarte")
			.attr("id","ind_ville")
			.attr("font-size",15)
			.style("font-weight",800)
			
		map.append("text")
			.attr("x",projection([dataQuot[0].cX,dataQuot[1].cY])[0])
			.attr("x",projection([dataQuot[0].cX,dataQuot[1].cY])[1])
			.text("NATIONAUX")
		
		buildListes(geoVilles);
		buildGraph();
		calc();
		// majBarres();
		majVilles();
		majDepts();
		majGraph();
	}
}

function buildListes(geo){
	for(i=0;i<geo.length;i++){
		nomsVilles.push(geo[i].Ville)
		listeVilles[geo[i].Ville] = [0, [],[]]
	}
	for(j=0;j<nomsDepts.length;j++){
		listeDept[nomsDepts[j]] = [0, []]
	}
}

function calc(){
	//initialisation
	for (i=0; i<dataQuot.length; i++){	
		var idVille = dataQuot[i].villeOk;
		listeVilles[idVille][0] = 0;
		listeVilles[idVille][1] = [];
		listeVilles[idVille][2] = [];
	}
	for (k=0; k<nomsDepts.length; k++){	
		var idDe = nomsDepts[k];
		if(listeDept[idDe]){
			listeDept[idDe][0] = 0;
			listeDept[idDe][1] = [];
		} 
		
	}
	//mise à jour
	for (j=0; j<dataQuot.length; j++){
		if (dataQuot[j].Annee >= date && dataQuot[j].Deb_ann <= date){
			var idVille = dataQuot[j].villeOk;
			listeVilles[idVille][0] ++; //nombre de quotidiens par ville
			listeVilles[idVille][1].push(dataQuot[j].Titre1); //liste des quotidiens dans une ville
			var string = dataQuot[j].Liste_entites;
			var liste = string.split(",");
			listeVilles[idVille][2].push(liste);
			if (liste[0]&&liste[0]!="none"&&liste[0]!="National"){
				for(p=0;p<liste.length;p++){	
					var id = liste[p];
					if(listeDept[id]){
						listeDept[id][0] ++;
					} 
					
				}
			}
		}
	}
}

function majBarres(){
	for(i=0;i<nomsVilles.length;i++){
		
		var id = nomsVilles[i];
		// taille des barres
		d3.select("#b_"+id)
			.transition()
			// .delay(100)
			.duration(500)
			.attr("y", function(){
				var newH = heightBarres*listeVilles[id][0];
				var ancY = this.attributes.y0.value;
				var val = parseFloat(ancY - newH);
				return val;
			})
			.attr("height", function(){
				return heightBarres*listeVilles[id][0]
			});	
	}
}

function majVilles(){
	d3.selectAll(".titre").remove();
		
	for(i=0;i<nomsVilles.length;i++){
		
		var id = nomsVilles[i];
		var nbQuot = listeVilles[id][0];
		for(j=0;j<nbQuot;j++){
			d3.select("#gr_"+id)
				.append("circle")
				.attr("class","titre")
				.attr("cx",function(){
					var val = document.getElementById("gr_"+id).attributes.cX.value;
					return val;
					
				})
				.attr("cy",function(){
					var val = document.getElementById("gr_"+id).attributes.cY.value;
					return val - diam/2 - j*diam - (j*1+1)*strokeQuot*1.5;
				})
				.attr("r",diam/2)
				.attr("fill",function(){
					if(id=="National"){
						return nuancier[1]
					} else {
						return nuancier[0]
					}
				})
				.attr("stroke",nuancier[2])
				.attr("stroke-width",strokeQuot)
				.style("cursor","pointer")
				.attr("id","quot"+id+j)
				.attr("titre",listeVilles[id][1][j])
				.attr("diff",listeVilles[id][2][j])
				.attr("rang",j)
				.attr("ville",id)
				.on("mouseover",function(){
					var n = j;
					affQuot(this.id,this.attributes.titre.value,this.attributes.diff.value,this.attributes.ville.value,this.attributes.rang.value)
				})
				.on("mouseout",function(){
					delQuot();
				})
		}
	}
}

function majDepts(){
	d3.selectAll(".dept")
		.transition()
		.duration(vitAnim)
		.attr("fill",function(){
			var code = this.attributes.code.value;
			if(code){
				var val = listeDept[code][0];
				if(val>=valsChoro[2]){
					return nuancierChoro[3]
				} else if(val>=valsChoro[1]){
					return nuancierChoro[2]
				} else if(val>=valsChoro[0]){
					return nuancierChoro[1]
				} else {
					return nuancierChoro[0]
				}
			}			
		})
}

function buildGraph(){
	
	d3.select("#graph")
		.append("svg")
		.attr("id","svgCourbes")
		.attr("x",xMin)
		.attr("y",yMax) 
		.attr("viewBox","0 0 "+w+" "+h)
		.attr("width",w)
		.attr("height",h)
		.attr("transform","translate(0,-20)") //meme décalage que le calque "rep_graph"
		
	//courbes
	var YNt = h - (dataTir[0].NAT_Nb_titres*echTit);
	var YLt = h - (dataTir[0].LOC_Nb_titres*echTit);
	var cheminNAT_tit = "M"+0+"," + YNt;
	var cheminLOC_tit = "M"+0+"," + YLt;
	
	var YNr = h - (dataTir[0].NAT_Tirages*echTir);
	var YLr = h - (dataTir[0].LOC_Tirages*echTir);
	var cheminNAT_tir = "M"+0+"," + YNr;
	var cheminLOC_tir = "M"+0+"," + YLr;
	
	for(i=1;i<ampli-2;i++){
		var valNt = dataTir[i].NAT_Nb_titres;
		var valLt = dataTir[i].LOC_Nb_titres;
		cheminNAT_tit = cheminNAT_tit + " L"+parseFloat(0+i*pasX)+","+parseFloat(h-valNt*echTit);
		cheminLOC_tit = cheminLOC_tit + " L"+parseFloat(0+i*pasX)+","+parseFloat(h-valLt*echTit);
		
		var valNr = dataTir[i].NAT_Tirages;
		var valLr = dataTir[i].LOC_Tirages;
		cheminNAT_tir = cheminNAT_tir +" L"+parseFloat(0+i*pasX)+","+parseFloat(h-valNr*echTir);
		cheminLOC_tir = cheminLOC_tir +" L"+parseFloat(0+i*pasX)+","+parseFloat(h-valLr*echTir);

	}
	d3.select("#svgCourbes").selectAll(".courbe")
		.data([[cheminLOC_tit,nuancier[0]],[cheminNAT_tit,"red"],[cheminLOC_tir,nuancier[4]],[cheminNAT_tir,nuancier[5]]])
		.enter()
		.append("path")
		.attr("d", function(d){
			return d[0]
		})
		.attr("stroke",function(d){
			return d[1]
		})
		.attr("stroke-width",1)
		.attr("stroke-linejoin","round")
		.attr("stroke-linecap","round")
		.attr("fill","none")
	
	var pasAnnee = 5;
	var compte = parseInt(ampli/pasAnnee)
	for(j=0;j<ampli;j+=5){
		d3.select("#svgCourbes")
			.append("text")
			.attr("font-size",9)
			.attr("x",j*w/ampli)
			.attr("y",12)
			.text(1945+j*1)
			
		d3.select("#svgCourbes")
			.append("line")
			.attr("font-size",9)
			.attr("x1",j*w/ampli)
			.attr("x2",j*w/ampli)
			.attr("y1",0)
			.attr("y2",4)
			.attr("stroke","#000000")
			.attr("stroke-width",1)
	}
	d3.select("#svgCourbes")
		.append("rect")
		.attr("id","cache_graph")
		.attr("x",0)
		.attr("y",0)
		.attr("width",w*1.08)
		.attr("height",h)
		.attr("fill","#FFFFFF")
		.attr("opacity",0.7)
		
	d3.select("#svgCourbes")
		.append("line")
		.attr("id","barre_date")
		.attr("stroke",nuancier[2])
		.attr("stroke-width",1)
		.attr("stroke-dasharray","5,5")
		.attr("x1",0)
		.attr("x2",0)
		.attr("y1",0)
		.attr("y2",h)
	
	d3.select("#svgCourbes").selectAll(".suiv")
		.data([["ci_Lt",nuancier[0],YLt],["ci_Nt",nuancier[1],YNt],["ci_Lr",nuancier[4],YLr],["ci_Nr",nuancier[5],YNr]])
		.enter()
		.append("circle")
		.attr("id",function(d){
			return d[0]
		})
		.attr("cx",0)
		.attr("cy",function(d){
			return d[2]
		})
		.attr("r",2.5)
		.attr("class","suiv")
		.attr("fill",function(d){
			return d[1]
		})
}

function majGraph(){
	var vB = w*(date-anneeMin)/ampli;
	var itD = date-1945;
	var valNt = dataTir[itD].NAT_Nb_titres;
	var valLt = dataTir[itD].LOC_Nb_titres;
	var valNr = dataTir[itD].NAT_Tirages;
	var valLr = dataTir[itD].LOC_Tirages;
	var listeH= [(h-valLt*echTit),(h-valNt*echTit),(h-valLr*echTir),(h-valNr*echTir)];
	var ids = ["Lt","Nt","Lr","Nr"];
	d3.select("#svgCourbes")
		// .transition()
		// .duration(vitAnim)
		.attr("viewBox","0 0 "+w+" "+h)
		// .attr("width",vB)
		// .attr("x",w-vB+xMin*1)
		// .style("overflow","hidden")
	
	d3.select("#barre_date")
		.transition()
		.duration(vitAnim)
		.attr("x1",vB)
		.attr("x2",vB)
		
	d3.select("#cache_graph")
		.transition()
		.duration(vitAnim)
		.attr("width",w*1.09-vB)
		.attr("x",vB)
	
	for(i=0;i<ids.length;i++){
		d3.select("#ci_"+ids[i])
			.attr("cx",vB)
			.attr("cy",listeH[i])	
	}
	
		
}

function affQuot(id,titre,diff,ville,n){
	var lsDep = diff.split(",");
	for(i=0;i<lsDep.length;i++){
		d3.select("#d"+lsDep[i])
			.attr("class","dept hightlight")
	}
	d3.select("#ind_ville").text(ville)
	d3.select("#ind_avant").text(listeVilles[ville][1][n-1])
	d3.select("#ind_main").text(listeVilles[ville][1][n])
	d3.select("#ind_apres").text(listeVilles[ville][1][n*1+1])
	// alert(listeVilles[ville][1][n]+" || "+titre)
	
	d3.selectAll(".trrr").transition().duration(500).attr("x2",function(){
		var val = this.attributes.x3.value
		return val;
	})

}

function delQuot(){
	d3.selectAll(".hightlight").attr("class","dept")
	// d3.selectAll(".indicsCarte").text("")
	
	d3.selectAll(".trrr").transition().duration(500).attr("x2",function(){
		var val = this.attributes.x1.value;
		return val;
	})
}