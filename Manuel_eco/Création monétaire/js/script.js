///////////////////////////////////////variables globales////////////////////////////////////////
////éléments cliquables
var avancer = document.getElementById("avancer"); //element svg constituant le bouton "continuer"
var init = document.getElementById("init"); //element svg constituant le bouton "remise à 0"
var bout_0 = document.getElementById("bouton_0"); //bouton "démarrer"
var bout_l = document.getElementById("bouton_l"); //bouton "ok" qui confirme la lecture des règles
////valeurs mouvantes
var etape = 0; //variable de temps initalement à 0
var nuancier = ["","#F27B30","#C8596A","#3595B5","#86BC25","#F27B30","#86BC25","#F27B30","#F27B30"]
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
 
///////////////////////////////////////Evènements des boutons////////////////////////////////////////
//appel unique: définit toutes les actions sur les boutons
function initialize() { 

	d3.select("#anime").style("opacity", 1); //apparition de l'infographie
	d3.select("#fonds").selectAll("g").transition().duration(1500).attr("opacity",0.2); //apparition des fonds en coloré en transparence
	d3.select("body").selectAll(".pli").style("transform","translate(-30px)"); // décalage des fonds de droite pour enlever l'espace du pli
	
	bout_0.onclick = function(){
		this.style.display = "none"; 
		d3.select("#rules").style("display","block") //apparition des règles
	}
	
	bout_l.onclick = function(){
		d3.select("#avancer").style("display","inline"); //apparition du bouton "continuer"
		//décalage des règle :
		d3.select("#rules").transition().duration(1000).style("margin-left","-200px").style("margin-top","0px").style("font-size", "12px").selectAll("p").style("opacity","0")
		d3.select("#rule").transition().delay(1000).duration(1000).style("display","block");
		d3.select("#bouton_l").style("display","none"); //disparition totale du bouton ok
		d3.select("#general").transition().delay(1000).duration(1000).attr("opacity",1)
	}
	
	init.onclick = function(){ //réinitialisation au clic
		reseet();
	}
	
	avancer.onclick = function(){ 
		suivant(); //fonction principale de mise à jour du schéma en fonction de l'étape	
	}
}

//fonction principale de mise à jour du schéma en fonction de l'étape	
function suivant(){ 
	etape++; //mise à jour du temps
	//blocage et animation des boutons
	d3.select("#avancer").attr("class","bouts on");
	d3.select("#init").attr("class","bouts on");
	d3.select("#init").style("display","inline");
	d3.select("#anime").style("opacity", 1);
	d3.select("#divBouton").append("div").attr("id", "cache");
	d3.select("#avancer").selectAll(".rempli").attr("fill","#FFFFFF").transition().duration(2650).attr("transform","translate(33)")
	setTimeout(function(){
		//déblocage des boutons
		d3.select("#cache").remove();
		d3.select("#avancer").attr("class","bouts");
		d3.select("#init").attr("class","bouts");
		d3.select("#avancer").selectAll(".rempli").attr("transform","").attr("fill","#333333");
	},2700)

	//apparition des spirales
	if(document.getElementsByClassName("spi"+etape)){
		d3.select("#anime").selectAll(".spi"+etape).transition().duration(6000).attr("stroke-dasharray", "2000, 0").attr("stroke-width", function(){
			return this.attributes.strokeinit.value;
		});
	}
	
	//tracé des liens entre les rouages et élément 'chaine'
	if(document.getElementsByClassName("trace"+etape)){
		d3.select("#anime").selectAll(".trace"+etape).transition().delay(function(){
			if(this.attributes.decal) {
				return 3500;
			} else {
				return 1500;
			}
		}).duration(2000).attr("stroke-dasharray", "3000, 0");
		d3.select("#anime").selectAll(".dtrace"+etape).transition().delay(function(){
			if(this.attributes.decal) {
				return 4500;
			} else {
				return 2500;
			}
		}).duration(2000).attr("opacity",0.6);
	}
	
	//dessin autour des fonds en couleurs - puis disparition
	if(document.getElementsByClassName("d"+etape)){
		d3.select("#anime").selectAll(".d"+etape).transition().delay(function(){
			if(this.attributes.decal) {
				return 2000;
			} else {
				return 0;
			}
		}).duration(3000).attr("stroke-dasharray", "3000, 0").attr("stroke-width", 2);
		d3.select("#anime").selectAll(".d"+etape).transition().delay(function(){
			if(this.attributes.decal) {
				return 4500;
			} else {
				return 2000;
			}
		}).duration(500).attr("opacity", 0);
	}
	
	//apparition des fonds en plus saturé
	if(document.getElementsByClassName("a"+etape)){
		d3.select("body").selectAll(".a"+etape).transition().delay(function(){
			if(this.attributes.decal) {
				return 4000;
			} else {
				return 800;
			}
		}).duration(1700).attr("opacity", 1);
	}
	
	//apparition des textes
	if(document.getElementsByClassName("txt"+etape)){
		d3.select("#anime").selectAll(".txt"+etape).transition().delay(function(){
			if(this.attributes.decal) {
				return 4500;
			} else {
				return 2000;
			}
		}).duration(2000).attr("opacity", 1);
	}
	
	//apparition des centres de spirales
	if(document.getElementsByClassName("centre"+etape)){
		d3.select("#anime").selectAll(".centre"+etape).transition().delay(1000).duration(1000).attr("opacity", 1);
	}
	
	//apparition des boules numérotées
	if(document.getElementById("boule"+etape)){
		d3.select("#boule"+etape)
			.on("mouseover", function(){
				var val = this.attributes.etape.value;
				hover(val);
			})
			.on("mouseout", function(){
				var val = this.attributes.etape.value;
				out(val);
			})
			.on("click", function(){
				var val = this.attributes.etape.value;
				this.attributes.class.value = "boule";
				afficheT(val)
			})
			.style("transform-origin",function(){
				var cx = this.attributes.cx.value;
				var cy = this.attributes.cy.value;
				return cx+ "px " + cy + "px";
			})
			.transition()
			.duration(2000)
			.attr("opacity", 1)
			.attr("class","boule clignote")
	}
	
	//apparition des roues et animations en fonction du centre
	if(document.getElementsByClassName("r"+etape)){
		var liste = document.getElementsByClassName("r"+etape);
		for(i=0;i<liste.length;i++){
			var centre = liste[i].attributes.centre.value;
			var coords = centre.split(" ");
			var id = liste[i].id;
			d3.select("#"+id).style("transform-origin", centre);
			var	sens = " debitDroite";
			var attente =0;
			d3.select("#"+id).transition().delay(function(){
				if(this.attributes.decal){
					attente = 4000;
					return 4000;
				} else {
					attente = 2000;
					return 2000;
				}
			}).duration(1000).attr("opacity", 1).attr("class", "r"+etape+ " debitDroite");
			d3.select("#anime").append("circle").attr("class","centresroue")
				.attr("cx", coords[0])
				.attr("cy", coords[1])
				.attr("r",0)
				.transition()
				.delay(attente)
				.duration(1000)
				.attr("r",3)
		}
	}
	
	//disparition du bouton continuer à la fin du schéma
	if(etape == 8){
		d3.select("#avancer").style("display","none");
	}
}

//réinitialisation au clic
function reseet(){ 
	var centre = document.getElementById("revol").attributes.centre.value; //centre de la flèche dans le bouton

	d3.select("#patienter").style("display","block"); //mode "remise à zéro"
	d3.select("body").style("cursor","wait")
	
	etape = 0; //réinitialisation du temps
	
	d3.select("#anime").transition().duration(1000).style("opacity", 0) //disparition progressive du schéma
	d3.select("#avancer").attr("class","bouts on"); //affichage blocage du bouton avancer
	d3.select("#avancer").style("display","inline"); //réapparition du bouton "continuer" au cas où celui-ci aie disparu
	d3.select("#init").attr("class","bouts on"); //affichage blocage du bouton cliqué
	d3.select("#divBouton").append("div").attr("id","cache"); //blocage effectifs des boutons
	d3.select("#revol").style("transform-origin", centre).attr("class", "debitGauche"); //animation de la flèche du bouton
	d3.select("#revol").selectAll(".revolp").attr("fill","#FFFFFF"); //changement de couleur de la flèche
	document.getElementById("commentaire").innerHTML = ""; //réinitialisation du commentaire
	d3.select("#pasti").transition().duration(1000).attr("fill", "#FFFFFF")
	d3.select("#number").text("")
	document.getElementById("permanent").innerHTML = ""; //note de commentaire
	
	setTimeout(function(){
		//déblocage du bouton avancer et disparition du bouton remise à zero
		d3.select("#cache").remove(); 
		d3.select("#decompte").remove(); 
		d3.select("#avancer").attr("class","bouts");
		d3.select("#init").attr("class","bouts").style("display","none");
		d3.select("#revol").style("transform-origin", centre).attr("class", "");
		d3.select("#revol").selectAll(".revolp").attr("fill","#333333");

		//réapparition de l'infographie
		d3.select("#anime").transition().duration(1000).style("opacity", 1)
		
		//disparition de "patienter"
		d3.select("#patienter").style("display","none"); //mode "remise à zéro"
		d3.select("body").style("cursor","")
		
		//réinitialisation effective de tous els éléments de l'infographie (faite en dernier pour ne pas internvenir avant la fin d'une animation, soit 7500 ms)
		d3.select("#anime").selectAll(".centresroue").remove();
		for(i=0;i<9;i++){ //réinitialisation des éléments propres aux étapes
			d3.select("#anime").selectAll(".spi"+i).attr("stroke-dasharray", "0,3000");
			d3.select("#anime").selectAll(".trace"+i).attr("stroke-dasharray", "0,3000");
			d3.select("#anime").selectAll(".dtrace"+i).attr("opacity",0);
			d3.select("#anime").selectAll(".d"+i).attr("stroke-dasharray", "0, 3000").attr("opacity",1)

			d3.select("#anime").selectAll(".txt"+i).attr("opacity", 0);
			d3.select("#defonce").selectAll(".a"+i).attr("opacity", 0);
			d3.select("#fonds").selectAll("g").attr("opacity",0.2)
			d3.select("#anime").selectAll(".f"+i).attr("opacity", 0);
			d3.select("#anime").selectAll(".centre"+i).attr("opacity", 0);
			d3.select("#anime").selectAll("#boule"+i).attr("opacity", 0).attr("r",0).attr("class", "boule");
			d3.select("#anime").selectAll(".r"+i).attr("opacity", 0).attr("class","r"+i);
		}
	},5500)
}

///////////////////////////////////////Evènements des bulles numérotées////////////////////////////////////////
//clic
function afficheT(etape){
	//apparition du comentaire au clic sur les boules
	document.getElementById("permanent").innerHTML = "Ces commentaires décrivent uniquement la création monétaire par prêts aux entreprises (même si elle s’effectue également par prêts aux particuliers et à l’État)."
	d3.select("#pasti").transition().duration(1000).attr("fill", nuancier[etape])
	d3.select("#number").text(etape)
	d3.csv("data/etapes.csv", function(data){
		var texteOk = "";
		for(i=0;i<data.length;i++){
			if(data[i].etape == etape){
				texteOk = data[i].comm
			}
		}
		d3.select("#commentaire").html(texteOk)
	})	
}

//survol
function hover(etape){
	//animation au survol des boules
	d3.select("#boule"+etape)
		.select("circle")
		.transition()
		.duration(300)
		.attr("fill", "#E2E2E2")
}
function out(etape){
	//fin d'animation au survol des boules
	d3.select("#boule"+etape)
		.select("circle")
		.transition()
		.duration(300)
		.attr("fill", function(){
			var couleur = this.attributes.fill2.value;
			return couleur
		});
}

///////////////////////////////////////fonctions - graphisme////////////////////////////////////////
function polices(){
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

function resize(){
	widthPop = document.getElementById("content").offsetWidth;

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
		d3.select("body").selectAll(".adapte").style("font-size","12px")
		d3.select("body").selectAll(".adapte2").style("font-size","14px")
		d3.select("body").selectAll(".adapte3").style("font-size","25px")
	} 
		
}

