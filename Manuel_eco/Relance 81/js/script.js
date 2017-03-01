///////////////////////////////////////variables globales////////////////////////////////////////
////valeurs mouvantes
var etape = -2; //étape en flottant
var ind="-2"; //étape mise en formeavec les unités en 0
var test =""; //test sur le choix suivant
var ancChoix=""; //test sur le choix précédent - plus utile mais laissé en cas de retour
var sens = "false"; //controle retour en arrière : laisse si modification
var choix= ""; //rouge, vert, bleu
var itl = 0; //itération pour la légende(zoom)
var it21 = 0; //itération pour la bulle d'info 21(zoom)
var it27 = 0; //itération pour la bulle d'info 27(zoom)

////valeurs fixes
var flecheSize = 10;

////éléments cliquables
var suite = document.getElementById("suite");
var masque = document.getElementById("masque");
var init = document.getElementById("init"); 
var bout_0 = document.getElementById("bouton_0"); //bouton "démarrer"
var bout_l = document.getElementById("bouton_l"); //bouton "démarrer"
var legende = document.getElementById("legende"); //légende
var info21 = document.getElementById("infoa21"); //info bulle 21
var info27 = document.getElementById("info27"); //info bulle 27

////fonctions de base pour la police et le format
polices();
resize();

///////////////////////////////////////fonctions principales////////////////////////////////////////
window.onresize=function(){
	resize();
}

window.onload = function(){
	initialize();
}

///////////////////////////////////////fonctions générales////////////////////////////////////////
function initialize(){ // activité des boutons initiaux (appel unique)
	bout_l.onclick = function(){	
		this.style.display = "none";
		//remplacement du bloc règles
		d3.select("#rules").transition().duration(1000).style("margin-left","900px").style("font-size", "12px").selectAll("p").style("margin","0px").style("opacity","0")
		d3.select("#bydefault").transition().delay(1000).style("display","inline");
		d3.select("#rule").transition().delay(1000).style("display","block");
		
		//allumage du schéma au début
		d3.select("#legende").transition().transition(1000).attr("opacity",1);
		d3.select("#anime").transition().duration(1000).attr("opacity",1)
		d3.select("#defaut").transition().duration(700).attr("opacity",1);
		
		//fonction initiale (interactivité des éléments)
		lancement();
		
		//fonction de mise à jour des éléments (première implémentation)
		majBout(flecheSize);
		affiche(ind,choix);
	}
	bout_0.onclick = function(){
		this.style.display = "none"; 
		d3.select("#rules").style("display","block");
	}
}

function lancement() { // activité des éléments du schéma (appel unique)
	//petite flèche - ce qui est arrivé - 
	suite.onclick = function(){ 
		sens = "false";
		maj();
		if(document.getElementById("chem"+ind)){
			choix ="";
		} else {
			choix = "a"
		}
		affiche(ind, choix); //mise à jour du schéma
		majBout(flecheSize); //mise à jour de la flèche
	}
	suite.onmouseover = function(){
		if(document.getElementById("chem"+ind)){
			choix ="";
		} else {
			choix = "a"
		}
		survolBout(flecheSize*2,choix,ind,"suite");
	}
	suite.onmouseout = function(){
		if(document.getElementById("chem"+ind)){
			choix ="";
		} else {
			choix = "a"
		}
		survolBout(flecheSize,choix,ind,"suite");
	}
	
	//remise à zéro
	init.onclick =function(){
		zero();
		d3.select("#anime").transition().duration(500).style("opacity",0.4);
		setTimeout(function(){
			majBout(flecheSize);
			affiche(ind, choix);	
			
			d3.select("#revol").style("transform-origin", centre).attr("class", ""); //animation de la flèche du bouton
			d3.select("#revol").selectAll(".revolp").attr("fill","#000000"); 
			d3.select("#init").style("display","none").attr("class","bouts");
			d3.select("body").style("cursor","")
			d3.select("#patienter").style("display","none");
			d3.select("#anime").transition().duration(500).style("opacity",1);
		},1500);
		
		var centre = document.getElementById("revol").attributes.centre.value; //centre de la flèche dans le bouton
		d3.select("#patienter").style("display","block");
		d3.select("body").style("cursor","wait")
		d3.select("#init").attr("class","bouts on");
		d3.select("#revol").style("transform-origin", centre).attr("class", "debitGauche"); //animation de la flèche du bouton
		d3.select("#revol").selectAll(".revolp").attr("fill","#FFFFFF"); //changement de couleur de la flèche
		
	}
	
	//zoom sur les éléments autres que les étapes
	legende.onclick = function(){
		agrandir2(this, itl);
	}
	info21.onclick = function(){
		agrandir2(this, it21);
	}
	info27.onclick = function(){
		agrandir2(this, it27);
	}
}

function zero(){ //fonction de remise à zéro
	//mise à zéro des valeurs
	etape = -2;
	test="-1";
	ind="-2";	
	choix="";
	
	d3.select("#suite").attr("opacity",1);
	d3.select("#anime").selectAll(".opa02").transition().duration(1000).attr("opacity",0.02)
	d3.select("#anime").selectAll(".opa0").transition().duration(1000).attr("opacity",0)
	d3.select("#anime").selectAll(".opa01").transition().duration(1000).attr("opacity",0.1)
	d3.select("#anime").selectAll(".stroked").transition().duration(1000).attr("stroke-dasharray","0,300")
	d3.select("#anime").selectAll(".fleches").remove();
	
	d3.select("#anime").selectAll(".zoomMoins").attr("transform","").attr("class",function(){
		var val = this.attributes.class.value;
		var liste = val.split("zoom")
		return liste[0]+ " zoomNon"
	})
	d3.select("#anime").selectAll(".zoomPlus").attr("transform","").attr("class",function(){
		var val = this.attributes.class.value;
		var liste = val.split("zoom")
		return liste[0]+ " zoomNon"
	})
	d3.select("#legende").attr("class","zoomPlus");
	majBout(flecheSize);
	d3.select("#suite").attr("fill","#B3D8ED");
}

function maj(){	//mise à jour des variables identifiant les étapes
	etape++;
	ind = etape;
	if (etape>=0&&etape<=9){
		ind = "0"+etape;
	}
	var et2 = etape;
	et2 ++;
	if (et2>=0&&et2<=9){
		test = "0"+et2;
	} else {
		test = et2;
	}	
}

function polices(){ //mets à jour toutes les polices en fonction du paramètre "oldfamily"
	d3.select("body").selectAll("text").style("font-family",function(){
		if(this.attributes.oldfamily){
			return this.attributes.oldfamily.value + ", RobotoBold"
		} else {
			return ""
		}
		
	})
	d3.select("body").selectAll("tspan").style("font-family",function(){
			if(this.attributes.oldfamily){
			return this.attributes.oldfamily.value + ", RobotoBold"
		} else {
			return ""
		}
	})
}

function resize(){ //fonction de taille des polices par parlier (identique par tout)
	widthPop = document.getElementById("line").offsetWidth;

	if(widthPop<100){
		d3.select("body").selectAll(".adapte").style("font-size","6px")
		d3.select("body").selectAll(".adapte2").style("font-size","9px")
		d3.select("body").selectAll(".adapte3").style("font-size","12px")
	} else if(widthPop<500){
		d3.select("body").selectAll(".adapte").style("font-size","8px")
		d3.select("body").selectAll(".adapte2").style("font-size","10px")
		d3.select("body").selectAll(".adapte3").style("font-size","13px")
	}else if(widthPop<800){
		d3.select("body").selectAll(".adapte").style("font-size","10px")
		d3.select("body").selectAll(".adapte2").style("font-size","12px")
		d3.select("body").selectAll(".adapte3").style("font-size","18px")
	}else {
		d3.select("body").selectAll(".adapte").style("font-size","13px")
		d3.select("body").selectAll(".adapte2").style("font-size","16px")
		d3.select("body").selectAll(".adapte3").style("font-size","25px")
	} 
		
}


///////////////////////////////////////fonctions des éléments////////////////////////////////////////
function affiche(ind, choix){ //affichage des étapes du chemin
	///affichage du bouton init
	if(ind!="-2"){
		d3.select("#init").style("display","inline")
	}
	
	///différents éléments du dessin, par id
	d3.select("#anime").selectAll(".strokke").transition().duration(500).attr("fill","#FFFFFF");
	d3.select("#anime").selectAll(".strokkke").transition().duration(500).attr("stroke","#FFFFFF"); //les contous b sont des vrais cintours, les autes de path comme un tracé vectorisé
	d3.select("#att"+choix+ind).transition().duration(1000).attr("opacity",1);
	d3.select("#dessin"+choix+ind).transition().duration(1000).attr("opacity",1)//.attr("class", function(){var val = this.attributes.class.value;return val+ " d"+choix+ind})
	d3.select("#texte"+choix+ind).attr("opacity",1).transition().duration(2000)
	d3.select("#ind"+choix+ind).transition().duration(1000).attr("opacity",1).select("line").transition().duration(1000).attr("stroke-dasharray","500,0")
	d3.select("#info"+choix+ind)
		.attr("transform",function(){
			var cX = this.attributes.cx.value/2;
			var cY = this.attributes.cy.value/2;
			return "translate("+cX+","+cY+") scale(0.5)"
		})
		.transition()
		.duration(1000)
		.attr("opacity",1)
		.attr("transform",function(){
			var cX = this.attributes.cx.value/2;
			var cY = this.attributes.cy.value/2;
			return ""
		})
	d3.select("#chem"+choix+ind).attr("opacity",0.9).attr("stroke-dasharray","0,300").transition().duration(1500).attr("stroke-dasharray","300,0")
	d3.select("#chem"+choix+ind+"_2").attr("opacity",0.9).attr("stroke-dasharray","0,300").transition().duration(1500).attr("stroke-dasharray","300,0");
	d3.select("#chem"+choix+ind+"_3").attr("opacity",0.9).attr("stroke-dasharray","0,300").transition().duration(1500).attr("stroke-dasharray","300,0");
	
	///surlignage des contours
	if(choix=="b"||ind=="26"||ind=="27"){ //exceptions (stroke ou fill)
		d3.select("#cont"+choix+ind).transition().duration(500).attr("opacity",1).attr("stroke","#000000").attr("class", function(){var val = this.attributes.class.value;return val+ " strokkke"})
	} else {
		d3.select("#cont"+choix+ind).transition().duration(500).attr("opacity",1).attr("fill","#0000000").attr("class", function(){var val = this.attributes.class.value;return val+ " strokke"})
	}
	
	///survol et click d'agrandissement (par groupe et non par élément)
	d3.select("#anime").selectAll(".d"+choix+ind).attr("class", function(){
		var val = this.attributes.class.value;
		var liste = val.split("zoom")
		return liste[0]+ " zoomPlus"
	})
	.on("click", function(){
		var ch = choix;
		var im = ind;
		agrandir(ch,im, this.attributes.class.value);
	})

	///exceptions des éléments
	if(ind=="-2"){
		for(i=1;i<8;i++){
			d3.select("#b"+i).on("click",function(){
				var id = this.id;
				big(id);
			}).attr("transform", function(){
				var cx = this.attributes.cx.value;
				var cy = this.attributes.cy.value;
				return "translate("+cx+","+cy+") scale(0)";
			}).transition().duration(1000).attr("transform","")
		}	
	}
	if(ind=="16"){
		d3.select("body").selectAll(".haut")
			.attr("class","haut coupeHaut")
			.style("transform-origin",function(){
				var cX = this.attributes.cx.value;
				var cY = this.attributes.cy.value;
				return cX+"px "+cY+"px";
			})
		d3.select("body").selectAll(".bas")
			.attr("class","bas coupeBas")
			.style("transform-origin",function(){
				var cX = this.attributes.cx.value;
				var cY = this.attributes.cy.value;
				return cX+"px "+cY+"px";
			})
		if(document.getElementById("dessin16").attributes.opacity.value == 0){
			d3.select("#dessin16")
				.attr("transform", "translate(-30)")
				.transition().duration(4000)
				.attr("transform", "")
				.attr("opacity", "1")		
			d3.select("#dessin16droite")
				.attr("transform", "translate(30)")
				.transition().duration(4000)
				.attr("transform", "")
				.attr("opacity", "1")
		}
	} else {
		d3.select("body").selectAll(".bas").attr("class","bas")
		d3.select("body").selectAll(".haut").attr("class","haut")
	}
	if(ind=="15"||ind=="09"||ind=="25"||ind=="07"){
		d3.select("#dessin"+choix+ind).select(".courbe").transition().delay(500).duration(2500).attr("stroke-dasharray","200,0")
		d3.select("#dessin"+choix+ind).select(".tete").transition().delay(2000).duration(500).attr("opacity","1")
		d3.select(".dessinT").select(".courbe").transition().delay(500).duration(2500).attr("stroke-dasharray","200,0")
		d3.select(".dessinT").select(".tete").transition().delay(2000).duration(500).attr("opacity","1")
	}
	if(choix+ind=="a13"||choix+ind=="a18"){
		var cX = document.getElementById("dessin"+choix+ind).attributes.cx.value;
		var cY = document.getElementById("dessin"+choix+ind).attributes.cy.value;
		d3.select("#dessin"+choix+ind).selectAll("polygon")
			.attr("class","tourne")
			.style("transform-origin",function(){
				return cX+"px "+cY+"px";
			})
	} else{
		d3.select("#anime").selectAll(".tourne")
			.attr("class","")
	}
	if(ind=="06"){
		d3.select("body").selectAll(".fleur")
			.attr("class","fleur tourne10")
			.style("transform-origin",function(){
				var cx = this.attributes.cx.value;
				var cy = this.attributes.cy.value;
				return cx+"px "+cy+"px";
			})
			.transition()
			.delay(2000)
			.attr("class","fleur")
		
		d3.select("body").selectAll(".tijmob2").attr("opacity",1).transition().duration(1000).attr("opacity",0)
		d3.select("body").selectAll(".tijmob").attr("opacity",0).transition().duration(1000).attr("opacity",1)
	}
	if(etape=="02"){
		d3.select("#dessin02").attr("transform","translate(-20)").attr("opacity",0).transition().duration(1000).attr("transform","").attr("opacity",1)
	}
	
	ancChoix = choix; //mise à jour de la variable ancChoix, var de test
}

function survolBout(size,choix,indo,id){ //survol des petites flèches (bleu et rouge)
	var centre = document.getElementById("chem"+choix+indo).attributes.middle.value;
	var coord = centre.split(",");
	d3.select("#"+id)
		.attr("points",function(){
			coordYm = parseFloat(coord[1])+parseFloat(size); //eviter les parseFloat
			coordXm = parseFloat(coord[0])+parseFloat(size);	
			coordXn = parseFloat(coord[0])-size;	
			return coord[0]+","+coordYm+" "+coordXn+","+coord[1]+" "+coordXm+","+coord[1]
		}).attr("transform",function(){
			var rota = document.getElementById("chem"+choix+indo).attributes.sens.value;
			return "rotate("+rota+","+coord[0]+","+coord[1]+")";
		})
}

function majBout(size){ //mise à jour de la petite flèche (bleu et rouge) au changement d'étape
	if(ind!="28"){
		var centre = document.getElementById("chem"+choix+ind).attributes.middle.value;
		var coord = centre.split(",");
		if(document.getElementById("chema"+test)){
			var couleur = "#E30613"
		} else {
			var couleur = "#B3D8ED"
		}
		d3.select("#suite")
			.attr("points",function(){
				coordYm = parseFloat(coord[1])+parseFloat(size); //eviter les parseFloat
				coordXm = parseFloat(coord[0])+parseFloat(size);	
				coordXn = parseFloat(coord[0])-size;	
				return coord[0]+","+coordYm+" "+coordXn+","+coord[1]+" "+coordXm+","+coord[1]
			}).attr("transform",function(){
				var rota = document.getElementById("chem"+choix+ind).attributes.sens.value;
				return "rotate("+rota+","+coord[0]+","+coord[1]+")";
			}).attr("fill", couleur);
		
		if(document.getElementById("chemb"+test)){ //ajout d'un flèche verte
			var indOk = test;
			var centre = document.getElementById("chemb"+indOk).attributes.middle.value;
			var coord = centre.split(",");
			var id  = "flecheb"+indOk;
			d3.select("#anime").append("polygon").attr("id",id)
				.attr("fill","#7FB029")
				.attr("stroke","#000000")
				.attr("points",function(){
					coordYm = parseFloat(coord[1])+parseFloat(size); //eviter les parseFloat
					coordXm = parseFloat(coord[0])+parseFloat(size);	
					coordXn = parseFloat(coord[0])-size;	
					return coord[0]+","+coordYm+" "+coordXn+","+coord[1]+" "+coordXm+","+coord[1];
				})
				.attr("transform",function(){
					var rota = document.getElementById("chemb"+indOk).attributes.sens.value;
					return "rotate("+rota+","+coord[0]+","+coord[1]+")";
				})
				.attr("class","fleches")
				.on("click", function(){
					sens = "false";
					choix = "b";
					affiche(indOk, choix);
					this.remove();
				})
				.on("mouseover",function(){
					survolBout(flecheSize*2,"b",indOk,id)
				})
				.on("mouseout",function(){
					survolBout(flecheSize,"b",indOk,id)
				})
		}
	} else {
		d3.select("#suite").attr("opacity",0); //on éteint la flèche à la fin du schéma
	}
}

function agrandir(ch, im, test){ //fonction d'agrandissement des étapes du schéma
	var liste = test.split("zoom");
	if(liste[1]=="Plus"){
		d3.select("#anime").selectAll(".zoomMoins").attr("transform","").attr("class",function(){
			var val = this.attributes.class.value;
			var liste = val.split("zoom")
			return liste[0]+ " zoomPlus"
		})
		var centre = document.getElementById("chem"+ch+im).attributes.middle.value;
		var coord = centre.split(",")
		var bX = coord[0]
		var bY = coord[1]
		
		//exceptions
		if(ch+im=="b07"||ch+im=="-1"){ 
			var bX = coord[0] - 115;
		}
		if(ch+im=="b07"){ 
			var bY = parseFloat(coord[1])+60;
			d3.select("#anime").selectAll(".d07").attr("opacity",0.1) //exception spéciale sur le croisement : probleme de superposition sinon
			d3.select("#indb07").selectAll("text").attr("fill", "#FFFFFF");
			d3.select("#dessinb07").select("path").attr("stroke", "#FFFFFF");
			d3.select("#dessinb07").select("polygon").attr("fill", "#FFFFFF");		
		} else{
			d3.select("#anime").selectAll(".d07").attr("opacity",1);
			d3.select("#indb07").selectAll("text").attr("fill", "#5E9333");
			d3.select("#dessinb07").select("path").attr("stroke", "#5E9333");
			d3.select("#dessinb07").select("polygon").attr("fill", "#5E9333");
		}
		if(ch+im=="07"){
			d3.select("#anime").selectAll(".db07").attr("opacity",0.1);
			d3.select("#flecheb07").attr("opacity",0.1);
		} else {
			d3.select("#anime").selectAll(".db07").attr("opacity",1);
			d3.select("#flecheb07").attr("opacity",1);
		}
		if(ch+im=="07"||ch+im=="a08"){
			var bY = parseFloat(coord[1]) + 50;
		}
		if(ch+im=="b15"||ch+im=="b13"||ch+im=="b14"){ 
			var bY =coord[1]-150;
		}
		if(ch+im=="b13"){ 
			var bX =parseFloat(coord[0])+80;
		}
		if(ch+im=="b14"){ 
			var bX =parseFloat(coord[0])+100;
		}
		if(ch+im=="22"){ 
			var bX =parseFloat(coord[0])-55;
		}
		d3.select("#anime").selectAll(".d"+ch+im).attr("transform",function(){
			if(this.attributes.transform){
				var val = this.attributes.transform.value;
				return val + " scale(1.5) translate(-"+bX/3+",-"+bY/3+")"
			} else {
				return "scale(1.5) translate(-"+bX/3+",-"+bY/3+")"
			}	
		}).attr("class", function(){
			var val = this.attributes.class.value;
			var liste = val.split("zoom")
			return liste[0]+ " zoomMoins"
		})
		
		d3.select("#chem"+ch+im).attr("opacity",1)
	} else if(liste[1]=="Moins"){
		d3.select("#anime").selectAll(".d"+ch+im).attr("transform","")
			.attr("class", function(){
				var val = this.attributes.class.value;
				var liste = val.split("zoom")
				return liste[0]+ " zoomPlus"
			})
		d3.select("#chem"+ch+im).attr("opacity",0.9)
		d3.select("#anime").selectAll(".d07").attr("opacity",1); //exceptions car les deux doivent effacer l'autre pour zoomer
		d3.select("#anime").selectAll(".db07").attr("opacity",1);
		d3.select("#flecheb07").attr("opacity",1);
		d3.select("#indb07").selectAll("text").attr("fill", "#5E9333");
		d3.select("#dessinb07").select("polygon").attr("fill", "#5E9333");
		d3.select("#dessinb07").select("path").attr("stroke", "#5E9333");
	}

}

function agrandir2(obj){ //fonction d'agrandissement des légendes et bulles 
	var cx = obj.attributes.cx.value;
	var cy = obj.attributes.cy.value;
	var tst = itl%2;
	if(tst==0){
		d3.select(obj).attr("class",function(){
			var val = this.attributes.class.value;
			var liste = val.split("zoom")
			return liste[0]+ " zoomMoins"
		})
		
		d3.select(obj).transition().duration(500).attr("transform", "translate(-"+cx+",-"+cy+") scale(2)")
	} else {
		d3.select(obj).attr("class",function(){
			var val = this.attributes.class.value;
			var liste = val.split("zoom")
			return liste[0]+ " zoomPlus"
		})
		d3.select(obj).transition().duration(500).attr("transform", "")
	}
	itl++;
}

function big(id){ //fonction d'agrandissement des bulles de l'héritage
	var ind = id[1];
	var tx="";
	var obj = document.getElementById(id);
	var contenu = obj.innerHTML;
	var cx = obj.attributes.cx.value;
	var cy = obj.attributes.cy.value;
		
	d3.select("#t"+ind).selectAll("tspan").text(function(){
		var val = this.innerHTML;
		tx = tx+" "+val;
		return val;
	})
	var duree = tx.length; //la bulle rétrécit en fonction d'un temps proportionnel au nombre de caractères
	var total = parseFloat(duree*50)+ 300;
	
	d3.select("#defaut").append("g").attr("id","clone"+ind).html(contenu);
	d3.select("#clone"+ind).transition().duration(500).attr("transform", function(){
		return "scale(1.5) translate(-"+cx/3+",-"+cy/3+")";
	}).transition().delay(duree*50).duration(500).attr("transform","")
	setTimeout(function(){
		d3.select("#clone"+ind).remove();
	},total);
}
