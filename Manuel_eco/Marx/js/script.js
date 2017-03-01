///////////////////////////////////////variables globales////////////////////////////////////////
////valeurs mouvantes
var decalage = [0,1000,2000,3000,4000,4800,5600];
var etape = 0; 
var init = document.getElementById("init"); 
var bout_0 = document.getElementById("bouton_0"); //bouton "démarrer"
var bout_l = document.getElementById("bouton_l"); //bouton "démarrer"

////fonctions de base pour la police et le format
polices();
resize();

///////////////////////////////////////fonctions principales////////////////////////////////////////
window.onresize=function(){
	resize(); //permet de changer les polices en responsive par palier (commune à toutes infographies)
}

window.onload = function(){ //fonction des boutons princpaux+ évènements des boutons initiaux
	initialize();
	
	d3.select("#tout").transition().delay(200).duration(500).style("opacity",0.5);  //(un fois que tout a été chargé)
	bout_l.onclick = function(){	
		//on vire les règles intiales
		d3.select("#rules").attr("class","adapte2").transition().duration(1000).style("margin-left","1000px").style("margin-top","0px")
		d3.select("#rules").transition().delay(1000).style("margin-top","0%").style("margin-left","80%").style("width","18%").select("img").style("width","10%")
		d3.select("#default").style("width","99%")
		resize();
		this.style.display = "none";
		//affichage de l'infographie
		d3.select("#general").transition().duration(1000).attr("opacity",1);
		d3.select("#tout").transition().duration(500).style("opacity",1);
		for(i=1;i<7;i++){ //affichage des cercles autour des bulles
			d3.select(".deboule"+i).attr("display","block");
		}
	}
	
	bout_0.onclick = function(){ //affichage des règles (bouton commencer)
		this.style.display = "none"; 
		d3.select("#rules").style("display","block");
	}
}

///////////////////////////////////////fonctions générales////////////////////////////////////////
///appel unique
//construction activité sur les bulles et init une fois seulement que l'on a démarré
function initialize() {	 
	reseet(); //fonction commune de réinitialisation
	init.onclick = function(){
		var id= this.id;
		var centre = document.getElementById("revol").attributes.centre.value; //centre de la flèche dans le bouton
		etape = 0; //réinitialisation du temps
		d3.select("#patienter").style("display","block");
		//animation de la roue
		d3.select("#init").attr("class","bouts on");
		d3.select("#revol").style("transform-origin", centre).attr("class", "debitGauche"); //animation de la flèche du bouton
		d3.select("#revol").selectAll(".revolp").attr("fill","#FFFFFF"); //changement de couleur de la flèche
		for(i=1;i<7;i++){
			d3.select(".deboule"+i).attr("display","none");
			document.getElementById("b"+i+"_contour").removeEventListener("click",myfunction) //supprime les évènements de bulles : ne seront activées que là;
		}
		//affichage du bouton cliqué
		d3.select("#default").selectAll("text").style("display","none");
		d3.select("body").style("cursor","wait")
		//extinction du schéma
		d3.select("#general").transition().duration(1000).attr("opacity",0);
		d3.select("#anime").transition().duration(500).style("opacity",0.01);
		setTimeout(function(){
			reseet(); //fonction de réinitialisation et d'initialisation de l'état initial des éléments
			//fin d'animation de la roue
			d3.select("#revol").style("transform-origin", centre).attr("class", ""); //animation de la flèche du bouton
			d3.select("#revol").selectAll(".revolp").attr("fill","#000000"); 
			for(i=1;i<7;i++){
				d3.select(".deboule"+i).attr("display","block");
			}
			d3.select("#default").selectAll("text").style("display","block");
			d3.select("#init").style("display","none").attr("class","bouts");
			
			 //affichage du bouton cliqué
			d3.select("body").style("cursor","")
			d3.select("#patienter").style("display","none");
			
			//allumage du schéma
			d3.select("#general").transition().duration(1000).attr("opacity",1);
			d3.select("#anime").transition().duration(500).style("opacity",1);
		},6500);
	}
}

//mets à jour toutes les polices en fonction du paramètre "oldfamily"
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

///appels multiples
//fonction de taille des polices par parlier (identique par tout)
function resize(){
	widthPop = document.getElementById("tout").offsetWidth;

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

function reseet() { //fonction remise a zero et initale
	queue()											
		.defer(d3.csv,"data/etapes.csv")
		.await(callback0); 
		
	function callback0(error, data){ //on reboucle dans le fichier de données
		//attribution des attributs aux objets : et donc réinitialisationsi ceux-là sont modifiés
		for(i=0;i<data.length;i++){
			d3.select("#"+data[i].id)
				.attr("class", function(){
					return data[i].class +data[i].etape;
				})
				.attr("animation", function(){
					return data[i].class;
				})
				.attr("etape", function(){
					return data[i].etape
				})
				.attr("decal", function(){
					return data[i].decal
				})
				.attr("duree", function(){
					return data[i].duree
				})
				.attr("size", function(){
					return data[i].size
				})
				.attr("centre", function(){
					return data[i].centre
				})
				.selectAll("tspan")
				.attr("decal", function(){
					return data[i].decal
				})
				.attr("size", function(){
					return data[i].size
				})
		}
		//comportement des éléments par rapport à leurs nouveaux attributes
		for(i=0;i<7;i++){
			//contour des bulles qui possède l'interactivité : réinitialisation à l'état non cliqualbe
			d3.select("#anime")
				.selectAll(".deboule"+i)
				.attr("transform",function(){
					var decal = this.attributes.centre.value;
					var liste = decal.split(",")
					var larg = liste[0]- 5;
					var scale = 15.88/this.attributes.size.value;
					var l = parseFloat(liste[1]) + parseFloat(i*125/scale)-50;
					return "scale("+scale+") translate("+larg+","+l+")";
				})
				.style("cursor","")
				.attr("selected","never")
				.select("path")
				.attr("opacity", 0)
			
			//comportement en fonction des claasses animations notamment
			d3.select("#c"+i+"_titre").attr("opacity",1)
			
			d3.select("#bulle"+i)
				.attr("transform","")
			d3.select("#anime")
				.selectAll(".grandit"+i)
				.attr("font-size",0)
				.selectAll("tspan")
				.attr("font-size",0)
				
			d3.select("#anime")
				.selectAll(".resserre"+i)
				.attr("opacity",0)
				.attr("transform",function(){
					var centre = this.attributes.centre.value;
					return "translate(-"+centre+") scale(2)";
				})	
			d3.select("#b"+i+"_clone")
				.attr("opacity",0)
				
			d3.select("#anime")
				.selectAll(".appar"+i)
				.attr("opacity",0)
				
			d3.select("#anime")
				.selectAll(".opac"+i)
				.attr("opacity",0)
	
			d3.select("#anime")
				.selectAll(".clik"+i)
				.attr("font-size",0)
				.attr("size",0)
				.selectAll("tspan")
				.attr("font-size",0)
				.attr("size",0)		
			
			d3.select("#anime")
				.selectAll(".gauche_droite"+i)
				.attr("width",0)
				
			d3.select("#anime")
				.selectAll(".droite_gauche"+i)
				.attr("width",0)
			
			
			d3.select("#anime")
				.selectAll(".dashplein"+i)
				.selectAll("path")
				.attr("fill","#efefef")
				.attr("stroke","black")
				.attr("stroke-width",0.2)
				.attr("stroke-dasharray",function(){
					alert(lol)
					var lol = this.getTotalLength();
					return "0,"+lol;
				})
			
			d3.select("#anime")
				.selectAll(".gonfle"+i)
				.attr("transform",function(){
					var cx = this.attributes.cx.value;
					var cy = this.attributes.cy.value;
					return "translate("+cx+","+cy+") scale(0)";
				})
				
			d3.select("#chemins")
				.selectAll("path")
				.attr("stroke-dasharray","0,30")

			
		}
		d3.select("#maison").attr("stroke-dasharray","0,300") //pas beosin d'être dans la boucle
		affiche(0); //fonction d'affichage du shcéma
		majBoutons(0); //fonction de mise à jourd e la bulle suivante (indication, la fonctionnalisation est dans la fonction déboule
		etape = 1; //retour à la première étape
		document.getElementById("b"+etape+"_contour").addEventListener("click",myfunction); //évènement sur le premier
	}
	
	d3.select("#anime").selectAll(".blop").attr("class","blop"); //exclusion des clignotements  : ne nécessite pas d epasser par la matrice d'attributs
	d3.select("#default").selectAll("text").attr("opacity",1) //retour aux textes par défaut (dans les bulles de gauche)
}

///////////////////////////////////////évènements sur les bulles////////////////////////////////////////
//action des bulles (avec test cliquée ou non)
function deboule(obj){ 
	etape = obj.attributes.etape.value; //étape définie par l'objet
	test = obj.attributes.selected.value; //action différente si l'objet a déjà cliqué ou pas (zoom ou allumage du schéma)
	if(test=="never"){ //jamais cliqué
		obj.style.cursor = "zoom-in";
		obj.attributes.selected.value="false";
		d3.select("#c"+etape+"_titre").attr("opacity",0)
		affiche(etape);
		d3.select("#init").style("display","inline");
		majBoutons(etape);
	} else if(test=="false") { //déjà cliqué, non zoomé
		obj.style.cursor = "zoom-out";
		obj.attributes.selected.value="true";
		d3.select("#bulle"+etape).transition().duration(1000).attr("transform",function(){
			var centre = document.getElementById("b"+etape+"_titre").attributes.centre.value; 
			var ls=centre.split(",")
			return "translate(-"+ls[0]*0.9+" -"+ls[1]*0.8+") scale(2)";
		})
	} else { //déjà cliqué, zoomé
		obj.style.cursor = "zoom-in";
		obj.attributes.selected.value="false";
		d3.select("#bulle"+etape).transition().duration(1000).attr("transform","")
	}
	etape ++;
	//l'action n'est possible que dans un ordre donné : l'interactivité est activée pour le suivant
	if(document.getElementById("b"+etape+"_contour")){ //si l'on arrive à la fin ça marche pas
		document.getElementById("b"+etape+"_contour").addEventListener("click",myfunction); 
	}
}

//stockage de la fonction déboule : permettra d'effacer l'acition avec addEventListener
function myfunction(){ 
	deboule(this)
}

//dessin du schéma au clic sur les bulles (si test positif)
function affiche(i){ 
	//à partir de l'étape i et de la classe animation, on définit le comportement et l'animation de chaque type d'objet
	d3.select("#anime")
		.selectAll(".grandit"+i)
		.transition()
		.delay(function(){
			var ind = this.attributes.decal.value;
			return decalage[ind];
		})
		.duration(1000)
		.attr("font-size",function(){
			var size = this.attributes.size.value;
			return size;
		})
		
	d3.select("#anime")
		.selectAll(".grandit"+i)
		.selectAll("tspan")
		.transition()
		.delay(function(){
			var ind = this.attributes.decal.value;
			return decalage[ind];
		})
		.duration(1000)
		.attr("font-size",function(){
			var size = this.attributes.size.value;
			return size;
		})

	d3.select("#anime")
		.selectAll(".resserre"+i)
		.transition()
		.delay(function(){
			var ind = this.attributes.decal.value;
			return decalage[ind];
		})
		.duration(1000)
		.attr("opacity",1)
		.attr("transform",function(){
			return "";
		})
	
	d3.select("#anime")
		.selectAll(".dashplein"+i)
		.transition()
		.delay(function(){
			var ind = this.attributes.decal.value;
			return decalage[ind];
		})
		.selectAll("path")
		.transition()
		.duration(1500)
		.attr("stroke-dasharray",function(){
			var lol = this.getTotalLength();
			return lol+",0";
		})
		.transition()
		.duration(500)
		.attr("fill","black")
		.attr("stroke","none")
	
	d3.select("#anime")
		.selectAll(".dash"+i)
		.attr("opacity",1)
		.attr("stroke-dasharray",function(){
			var lol = this.getTotalLength();
			return "0,"+lol;
		})
		.transition()
		.delay(function(){
			var ind = this.attributes.decal.value;
			return decalage[ind];
		})
		.duration(function(){
			if(this.id=="maison"){
				return 1000
			} else {
				var lol = this.getTotalLength();
				return parseFloat(lol)+800;
			}
		})
		.attr("stroke-dasharray",function(){
			var lol = this.getTotalLength();
			return lol+",0";
		})

	d3.select("#anime")
		.selectAll(".appar"+i)
		.attr("opacity",0)
		.transition()
		.delay(function(){
			var liste = this.id.split("_");
			var trace = liste[1];
			var lol = parseFloat(document.getElementById("t"+trace).getTotalLength())+500;
			var ind = this.attributes.decal.value;
			return decalage[ind] + lol;
		})
		.duration(1000)
		.attr("opacity",1)
	
	d3.select("#anime")
		.selectAll(".gonfle"+i)
		.transition()
		.delay(function(){
			var ind = this.attributes.decal.value;
			return decalage[ind];
		})
		.duration(1000)
		.attr("transform",function(){
			return "";
		});
		
	d3.select("#anime")
		.selectAll(".opac"+i)
		.attr("opacity",0)
		.transition()
		.delay(function(){
			var ind = this.attributes.decal.value;
			return decalage[ind];
		})
		.duration(1000)
		.attr("opacity",1);
		
	d3.select("#b"+i+"_clone")
		.transition()
		.duration(1500)	
		.attr("opacity",1)
		
	d3.select("#anime")
		.selectAll(".deboule"+i)
		.transition()
		.delay(function(){
			var ind = this.attributes.decal.value;
			return decalage[ind];
		})
		.duration(1000)
		.attr("transform","")
		
	d3.select("#anime")
		.selectAll(".gauche_droite"+i)
		.attr("width",0)
		.transition()
		.delay(function(){
			var ind = this.attributes.decal.value;
			return decalage[ind];
		})
		.duration(1000)
		.attr("width",68.3)

	d3.select("#anime")
		.selectAll(".droite_gauche"+i)
		.attr("width",0)
		.attr("x",800.6+parseFloat(77.4))
		.transition()
		.delay(function(){
			var ind = this.attributes.decal.value;
			return decalage[ind];
		})
		.duration(1000)
		.attr("width",77.4)
		.attr("x",800.6)
}

//animation au survol des boules
function hover(id){
	d3.select("#"+id)
		.select(".surcercle")
		.transition()
		.duration(1000)
		.attr("fill", "#E2E2E2")
		.transition()
		.delay(700)
		.duration(1000)
		.attr("fill", "#000000");
}

//animatio indiquant que la bulle suivante est cliquable : appelée par ordre des étapes
function majBoutons(etape){ 
	d3.select("#anime").selectAll(".blop").attr("class","blop")
	var id = parseFloat(etape)+1;
	d3.select("#bulle"+id)
		.attr("class",function(){
			var test = document.getElementById("b"+id+"_contour").attributes.selected.value; //ne fonctionne que si lui n'a jamais été cliqué
			if(test=="never"){
				return 	"clignote blop"
			} else {
				return "blop"
			}
		})
	
	d3.select("#b"+id+"_contour").attr("class",function(){
		var val = this.attributes.class.value ;
		return val+" selectable"
	})
}

