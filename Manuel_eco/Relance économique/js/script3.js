///////////////////////////////////////variables globales////////////////////////////////////////
////valeurs mouvantes
var vit = 800; //vitesse des flux : remise à zéro dans le mode démo quand on passe d'une étape à l'autre
var continuue = true; //différencier le bouton Continuer lorsqu'il s'est mis en pause autmoatiquement ou volontaireùent
var tstmeca = 0 ; //tst en %2 pour afficher/désafficher
var t; //fonction répétée de timedcount (compte le temps)
var ind=0; //étape courante
var curt = 0; //récupère le currentTime du son aux fonctions pause et continuer
var csvData; //variable contenant la liste des relations entre les noeuds
var cont;  //fonction setTimeout qui permet de mettre en pause à la fin d'une étape

////valeurs fixes
var nuancier = ["#F5F6F7", "#8CCFD8","#459BA9","#1D7184","#02465B"]; //couleurs de l'utilisation libre
var listeTemps = [0000,12000,29500,41283,59740,72833,84353,94270,108372,124676]; //temps de déclenchement des étapes
var listeNoeuds = [["a", "b", "c", "d", "e", "f", "g"],["m", "q"], ["u"],["n", "o", "p"], ["w", "v"], ["r"],["t"], ["h", "s","k"], ["i", "j"], ["l"]];	//tuyaux contenus dans chaque étape

//barre du bas (mode démo)
var sizeTw = 1145; //largeur totale
var sizeTh = 690; //position en y
var debX = 30; //position de l'encadré
var debY = 30; //position de l'encadré
var sizeH = 10; //hauteur de la barre

////éléments cliquables
var robi = document.getElementsByClassName("rob"); //boutons cliquables du mode libre
var noeuds = document.getElementsByClassName("noeud"); //Ménages, entreprises...
var boutons = document.getElementsByClassName("boutPlus"); //bouton au niveau du noeud "budget de l'état"

var bout_0 = document.getElementById("bouton_0"); //bouton "démarrer"
var bout_l = document.getElementsByClassName("bouton_l"); //bouton 'démonstration' et 'utilisation libre par défaut'

var boutTout = document.getElementById("boutTout"); //mode démonstration
var boutLibre = document.getElementById("boutLibre"); //mode libre
var init = document.getElementById("init"); //bouton de remise à zéro (evènement change en fonction du mode)

var etape = document.getElementById("etape"); //bouton Continuer ou Lancer
var etapepause = document.getElementById("etapepause"); //bouton pause
var boutmeca= document.getElementById("boutmeca"); //bouton '?' responsable de l'affichage de l'encadré 'Le mécanisme mutliplicateur'
var vol_moins= document.getElementById("vol_moins"); // boutons de volume
var vol_plus= document.getElementById("vol_plus");

////éléments non cliquables
var son_tbn = document.getElementById("toutdemo"); //son de la démonstartion
d3.select("#toutdemo").append("source").attr("src", "audio/final.wav"); //chargement de la source;

////fonctions de base pour la police et le format
polices();
resize();

///////////////////////////////////////fonctions principales////////////////////////////////////////
window.onresize=function(){
	resize(); //permet de changer les polices en responsive par palier (commune à toutes infographies)
}

window.onload = function(){ //lorsque les éléments de l'index sont chargés
	queue()											
	.defer(d3.csv,"data/relations2.csv")
	.await(callback2); 
	function callback2(error, csv){ //les fonctions rendant la page fonctionnelle se déclenchent lorsque les donénes du csv sont chargées
		csvData = csv;
		initialize(); //construction des éléments qui ne sont pas dans l'index
		reinitialize(); //fonction de remise à zéro globale qui est générée chaque changement de mode/remise à zéro;
	};
}

///////////////////////////////////////fonctions globales (communes aux deux modes)////////////////////////////////////////
function initialize(){	
	////choix entre les deux boutons  au tout début: défini les actions communes
	for(k=0;k<2;k++){ 
		bout_l[k].onclick = function(){		
			////actions d'affichage : entrée dans l'infographie
			//suppression des règles intiales
			d3.select("#rules").transition().duration(1000).style("margin-left","0").style("margin-top","500px").style("font-size", "12px").selectAll("p").style("margin","0px")
			d3.select("#rules").transition().delay(1000).style("margin-top","63%").style("width","98%").style("text-align","right").attr("class","adapte")
			d3.select("#default").style("display","none");
			
			//ajout des règles fixes 
			d3.select("#pexplis").style("display","block");
			
			//affichage de l'infographie qui était tranparente
			d3.select("#images").transition().duration(500).style("opacity",1);
			d3.select("#all").transition().duration(500).style("opacity",1);
			
			////premier mode choisi par l'utilisateur:  même action que les boutons actuels
			if(this.attributes.effet.value=="libre"){
				utlibre();
			} else {
				boutdemo();
				paus();
			}
		}
	}
	
	////éléments cliquables globaux (communs au deux mode)
	//bouton démarrer au tout début
	bout_0.onclick = function(){
		this.style.display = "none"; 
		d3.select("#rules").style("display","block");
	}
	
	//bouton permettant d'afficher l'éncadré "le mécanime mutliplicateur"
	boutmeca.onclick = function(){
		var tst = tstmeca%2;
		if(tst==0){
			d3.select("#anime").selectAll(".meca").transition().duration(1000).attr("opacity",1);
			d3.select(this).attr("class","on");
		}else {
			d3.select("#anime").selectAll(".meca").transition().duration(1000).attr("opacity",0);
			d3.select(this).attr("class","off");
		}
		tstmeca ++;
	}

	boutmeca.onmouseover = function(){
		d3.select(this).select("rect").transition().duration(100).attr("fill","#be2e0d");
		d3.select(this).select("text").transition().duration(100).attr("fill","#FFFFFF");
	}
		
	boutmeca.onmouseout = function(){
		if(this.attributes.class.value=="off"){
			d3.select(this).select("rect").transition().duration(100).attr("fill","#f6e9d9");
			d3.select(this).select("text").transition().duration(100).attr("fill","#333333");
		} else {
			d3.select(this).select("rect").transition().duration(100).attr("fill","#333333");
			d3.select(this).select("text").transition().duration(100).attr("fill","#FFFFFF");
		}
	}
	
	//activité des boutons de passage d'un mode à l'autre fixes (les deux actuels ayant disparu avec le div defaut), et du coup réinitialisation
	boutTout.onclick = function(){
		boutdemo();
		paus();
	}
	
	boutLibre.onclick = function(){
		utlibre();
	}

	////éléments cliquables propres à chaque mode
	choice(); //mode démo
	choice2(); //mode libre
	
	////éléments cliquables propres au mode démo (ne sont pas dans une fonction)
	vol_moins.onmouseover = function(){
		labb("moins");
	}
	vol_moins.onmouseout = function(){
		delab("moins");
	}
	vol_plus.onmouseover = function(){
		labb("plus");
	}
	vol_plus.onmouseout = function(){
		delab("plus")
	}
	vol_moins.onclick = function(){
		var vol = son_tbn.volume;
		if(vol>0.1){
			son_tbn.volume = vol - 0.1;
			d3.select("#sss").html(son_tbn.volume);
		} else {
			son_tbn.volume = 0;
			d3.select("#sss").html(son_tbn.volume);
		}
		reglageson(son_tbn.volume)
	}
	vol_plus.onclick = function(){
		var vol = son_tbn.volume;
		if(vol<1){
			var val = parseFloat(vol) + 0.1;
			son_tbn.volume = val;
			d3.select("#sss").html(son_tbn.volume);
		}else {
			son_tbn.volume = 1;
			d3.select("#sss").html(son_tbn.volume);
		}
		reglageson(son_tbn.volume)
	}

	////construction des éléments du mode démo
	appendBarre(); //barre du bas(mode démo) + cache
	
}

function reinitialize(){
	////commun
	//réinitialisation des tuyaux	(boules et couleur)		
	d3.select("#anime").selectAll(".relation").attr("stroke-dasharray","0, 1000").attr("opacity",0); 
	d3.select("#anime").selectAll(".debit").attr("class", "none");
	//noeuds globaux
	d3.select("#n13").attr("opacity", 1);
	d3.select("#n12").attr("opacity", 0);
	d3.select("#n8").attr("opacity", 0);
	d3.select("#anime").selectAll(".allume").attr("opacity", 0);
	d3.select("#noeuds_demo").transition().duration(0.5*vit).attr("opacity", 0).style("display", "none");
	//gouttes
	d3.select("#anime").selectAll(".goutte").attr("class","goutte").style("opacity", 1);
	//fuites
	d3.select("#anime").selectAll(".fas").transition().duration(vit).attr("opacity", 0);
	d3.select("#anime").selectAll(".fgs").transition().duration(vit).attr("opacity", 0).attr("transform", "");
	//periscope
	d3.select("#periscope").transition().duration(vit).attr("opacity", 0);
	d3.select("#perisVar").attr("transform", "");
	// clignotements
	d3.select("#anime").selectAll(".clignote").attr("class",function(){
		var val = this.attributes.class.value;
		var liste = val.split("clignote");
		return liste[0]
	})	
	
	////mode démo
	//arrêt du son
	son_tbn.pause();
	son_tbn.currentTime = 0;
	//fonctions et variables relatives à la gesiont du temps)
	ind = 0;
	curt = 0;
	continuue = true;
	timedCount(); //réinitialistion des indications
	clearTimeout(t);
	
	//boutons
	etape.style.display = "none";
	etapepause.style.display = "none";
	//barre du bas
	d3.select("#cachetime").selectAll("rect")
		.attr("width",function(){
			var val = this.attributes.width2.value;
			return val;
		})
		.attr("x",function(){
			var val = this.attributes.x2.value;
			return val;
		})
	//textes de la demo
	d3.select("#anime").selectAll(".txtDemo").transition().duration(vit).attr("opacity", 0);
	
	
	////mode libre
	//flux et points contenus dans les noeuds
	d3.select("#noeuds").selectAll("g").attr("cond", 0).attr("cliquable","false").attr("deja",0);
	d3.select("#relations").selectAll("*").attr("cond", 0);
	//noeuds dessin
	d3.select("#anime").selectAll(".t1").attr("opacity", 0);
	d3.select("#anime").selectAll(".t2").attr("opacity", 0);
	d3.select("#anime").selectAll(".t3").attr("opacity", 0);
	d3.select("#anime").selectAll(".t4").attr("opacity", 0);
	d3.select("#anime").selectAll("g").attr("cond", 0);
	//compte pour l'avertissement 3"prélèvement déjà été faits"
	d3.select("#avert3").attr("compte",0)
}

function revolution(){ //permet de faire tourner la flèche de remise à zéro
	var centre = document.getElementById("revol").attributes.centre.value; //centre de la flèche dans le bouton

	d3.select("body").style("cursor","wait")
	d3.select("#init").attr("class","bouts on"); //affichage blocage du bouton cliqué

	d3.select("#revol").style("transform-origin", centre).attr("class", "debitGauche"); //animation de la flèche du bouton
	d3.select("#revol").selectAll(".revolp").attr("fill","#FFFFFF"); //changement de couleur de la flèche
	
	setTimeout(function(){
		d3.select("body").style("cursor","")
		d3.select("#init").attr("class","bouts");
		d3.select("#revol").style("transform-origin", centre).attr("class", "");
		d3.select("#revol").selectAll(".revolp").attr("fill","#333333");
	}, 1000)
}	

function animeRob(rob, vit) { //ouvre les robinets
	d3.select("#"+rob).select(".allume").transition().duration(0.5*vit).attr("opacity", 1);
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
	widthPop = document.getElementById("all").offsetWidth;

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

///////////////////////////////////////fonctions du mode démo////////////////////////////////////////
////appel unique
function appendBarre(){ //construction de la barre
	//variables ne pouvant être des variables globales car doivent être déclarées quand c'est chargé
	var totalTime = son_tbn.duration*1000; //duration rend des secondes et non milisecondes
	var sizeW = sizeTw/totalTime; //variable pour calculer lataille d'une étape
	
	//cache : pour que les noeuds et robinets ne soient pas cliquables en mode démo
	d3.select("#anime").append("rect").attr("x",debX).attr("y",200).attr("fill","red").attr("id","cache").attr("opacity","0").attr("width",sizeTw-listeTemps[0]*sizeW).attr("height",sizeTh-sizeH)
	
	//groupe contenant les éléments de la barre : peut être effacer d'un coup en reinitialize
	d3.select("#anime").append("g").attr("id","barretime")
		
	//cadre
	d3.select("#barretime").append("rect").attr("id","video").attr("x",debX).attr("y",debY).attr("width",sizeTw-listeTemps[0]*sizeW).attr("height",parseFloat(sizeTh)+20).attr("fill","none").attr("stroke","#E6E8EE").attr("stroke-width",2)
	
	//ligne se déplaçant au survol
	d3.select("#anime").append("line").attr("id","playch")
		.attr("y1", sizeTh+parseFloat(debY)+sizeH*0.5)
		.attr("y2", sizeTh+parseFloat(debY)+sizeH*3.5)
		.attr("x1",0)
		.attr("x2",0)
		.attr("stroke-width",1)
		.attr("stroke","#000000")
		.attr("opacity",0)

	//texte indicatif se déplaçant au survol
	d3.select("#anime").append("text").attr("id","placeBarre")
		.attr("y", sizeTh+parseFloat(debY)+sizeH*1.5)
		.attr("x",5)
		.attr("font-size",14)
		.attr("opacity",0)
	
	//titre de la barre
	d3.select("#barretime").append("text").attr("id","titreBarre")
		.attr("x",sizeTw/2-80)
		.attr("y", sizeTh+parseFloat(debY))
		.attr("font-size",18)
		.text("Étapes de la démonstration")
	
	//barre de progression (indépendante des étapes : mais est censée se superposer)
	d3.select("#barretime").append("rect").attr("id","cachetime")
		.attr("x",debX)
		.attr("x2",debX)
		.attr("width",sizeTw-listeTemps[0]*sizeW)
		.attr("width2",sizeTw-listeTemps[0]*sizeW)
		.attr("fill",nuancier[1])
		.attr("y", sizeTh+parseFloat(debY)+sizeH*2)
		.attr("height", sizeH*1.5)
		.attr("opacity", 1);

	//construction des rectangles correspondant aux étapes et supérieurs à la barre : définissent l'interactivité car on ne peut revenir qu'au début d'une étape
	var cumulTps = 0;
	for (i=0;i<listeNoeuds.length;i++){
		//variables de constriction géométriques correspondant au temps
		cumulTps = listeTemps[i]*sizeW; 
		var temps = listeTemps[i+1]*sizeW - cumulTps;
		if(!temps){
			var duree = son_tbn.duration*1000;
			var temps = duree*sizeW - cumulTps;
		}
		var xOk = cumulTps +parseFloat(debX)-listeTemps[0]*sizeW;
		d3.select("#barretime").append("rect")
			.attr("x", xOk)
			.attr("width", temps)
			.attr("stroke-width",2)
			.attr("stroke","#888888")
			.attr("id","barre"+i)
			.style("cursor","pointer")
			.attr("etap","barre"+listeNoeuds[i][0])
			.attr("y", sizeTh+parseFloat(debY)+sizeH*2)
			.attr("height", sizeH*1.5)
			.attr("time",listeTemps[i])
			.attr("fill", "#FFFFFF")
			.attr("fill-opacity", 0.1) //vide mais cliquable
			.attr("opacity",0.2)
			.on("mouseover",function(){ 
				//indication de l'étape vers laquelle on se dirige, numéro de l'étape, temps
				var bouge = this.attributes.x.value;
				var time = this.attributes.time.value/1000;
				var tmin = parseInt(time/60);
				var tsec = parseInt(time%60);
				var number = this.attributes.id.value;
				var nbr = number.split("e");
				var nb = parseFloat(nbr[1])+1;
				if(tsec<10){
					tsec = "0" + tsec
				}
				if(nb==10){
					d3.select("#placeBarre").attr("x",-53);
					d3.select("#playch").attr("y1", sizeTh+parseFloat(debY)+sizeH*2)
				} else {
					d3.select("#placeBarre").attr("x",5);
					d3.select("#playch").attr("y1", sizeTh+parseFloat(debY)+sizeH*0.5)
				}
				d3.select("#cachetime").transition().duration(200).attr("fill",nuancier[3]);
				d3.select("#playch").transition().duration(500).attr("opacity",1).attr("transform","translate("+bouge+", 0)")
				d3.select("#placeBarre").transition().duration(500).attr("opacity",1).attr("transform","translate("+bouge+", 0)").text("Étape "+nb+" ("+tmin+":"+tsec+")")
			})
			.on("mouseout",function(){
				//effacement des indications
				d3.select("#playch").transition().duration(500).attr("opacity",0)
				d3.select("#placeBarre").transition().duration(500).attr("opacity",0)
				d3.select("#cachetime").transition().duration(200).attr("fill",nuancier[1])
			})
			.on("click",function(){
				var time = this.attributes.time.value; //temps correspondant à chaque étape (a du être stokée en attribut)
				var number = this.attributes.id.value;
				var nbr = number.split("e");
				var nb = nbr[1]; //3derniers : idenfication de l'étape (a du être stokée en attribut)
			
				//réinitialisation (on lève tout au coup on l'on reviennet à un élément extérieur)
				paus();
				boutdemo();
				
				//application du temps et de l'identificants correpsondant à 'létape choisie (élément son et variables globales)
				son_tbn.currentTime = time/1000;
				ind=nb;
				curt=time/1000; 
				//débloque le vrou des pauses automatique
				continuue=true;
				
				//permet de faire en sorte que les étpaes antérieurs s'affichent directement sans l'animation
				vit=0;
				for(k=0;k<ind;k++){
					for(l=0;l<listeNoeuds[k].length;l++){
						maj2(listeNoeuds[k][l],csvData);
					}
				}
				
				//affichage de l'animation relative à l'étape actuelle
				vit=600;
				suivant();
				
				//mise à jours de boutons
				etape.style.display = "none";
				etapepause.style.display = "inline";
			})
	}
}
function choice(){ //intéractivité
	etape.onclick = function(){
		suivant();
		etapepause.style.display = "inline";
		etape.style.display = "none";
	}
	etapepause.onclick = function(){
		paus();
		continuue = false;
		//mise à jour des boutons faite dans la fonction car on a besoin lors d'une pause autmoatique, en fin d'étape
	}
}

////appels multiple
//déclenchement du mode et initialisation
function boutdemo(){
	//mise à jour des boutons
	boutTout.style.display = "none";
	boutLibre.style.display = "inline";
	init.style.display = "block";
	init.onclick = function(){ //l'action de ce même bouton change à chaque mode, hormis la fonction révolution
		revolution();
		boutdemo();
		paus();
	}

	//petit glyphe son pour annoncer le mode démo et gesiton de son placement dans le bouton	
	d3.select("#avertson2").style("display","none");
	boutTout.style.paddingLeft = "7px"

	////reinitialisation des éléments (sera donc répétée au bouton init)
	///commune aux deux modes
	reinitialize();
	
	///règles propres à chaque mode 
	d3.select("#rule").style("display","block");
	d3.select("#rule2").style("display","none");
	d3.select("#pexplis").html("Cliquer sur le bouton \"Utilisation libre\" pour lancer la version interactive du schéma<br>Cliquer sur <img src = 'img/return.png' style='width:10%;margin-top:5%'/> pour remettre à zéro")
	
	///réinitialisation des couleurs (gouttes, noeuds, etc)
	d3.select("#fonds").selectAll(".fd").attr("fill","#FFFFFF").attr("stroke","#E6E8EE");
	d3.select("#anime").selectAll(".goutte").attr("fill","#98C3D7")
	d3.select("#anime").selectAll(".color").attr("fill","#98C3D7")
	
	///éléments présents dans le mode démo (affichage)
	d3.select("#barretime").style("display","block");
	d3.select("#soundcontrol").style("display","flex");
	d3.select("#video").style("display","block");
	d3.select("#playch").style("display","block");
	d3.select("#txt_n8").transition().duration(0.5*vit).attr("opacity", 1).style("display", "block")
	d3.select("#noeuds_demo").transition().duration(0.5*vit).attr("opacity",1 ).style("display", "block").selectAll("g").attr("opacity",0.2);
	//décalage du titre de noeud 11 (création d'emplois et donc placement d'une ristourne 
	d3.select("#ristourne").attr("opacity",1);
	d3.select("#txt_n11").select("text").attr("transform","matrix(0.9 0 0 1 315 483)"); //mauvaises dimensiosn et dessins pas à la meme place
	//cache qui rend les éléments non cliquables
	d3.select("#cache").attr("display","block")
	//boutons
	etape.style.display = "inline";
	etapepause.style.display = "none";
	
	///éléments présents dans le mode libre (désaffichage ou dépersonnalisation)
	d3.select("#fond_n8").attr("fill","#ACCEDE");
	d3.select("#anime").selectAll(".boutPlus").style("display","none");
}
//gestion du temps (basée sur la lecture du fichier son)
function timedCount() {   
	var c = son_tbn.currentTime; //récupère le moment actuel de la elcture du son : toutes les actions définies ici sont donc dépendante de cette date
	var d = son_tbn.duration; //durée totale du son
	
	//// indication du temps en lettres sur les boutons pause ou continuer
	//mise en forme
	var tmin = parseInt(c/60); //en minutes
	var tsec = parseInt(c%60); //en secondes
	if(tsec<10){ 
		tsec = "0" + tsec //forme des secondes
	}
	//affichage 
	//bouton continuer
	if(c==0){ //test pour 'Lancer' ou 'Continuer'
		d3.select("#etape").attr("value","Lancer ("+tmin+":"+tsec+")");
	} else {
		d3.select("#etape").attr("value","Continuer ("+tmin+":"+tsec+")");
	}
	//bouton pause
	d3.select("#etapepause").attr("value","Pause ("+tmin+":"+tsec+")");
	
	//// indication du temps en géom sur la barre de temps en bas
	d3.select("#cachetime")
		.attr("width",function(){
			var val = this.attributes.width2.value;
			return val*c/d;
		})

	////délenchement de la fonction fin lorque l'on arrive au bout du fichier son
	if(c==d){
		fin();
	}
	
	////répétition de la fonction
    t = setTimeout(function(){ timedCount() }, 200);
}
function rien(){
	d3.select("#anime").style("opacity",0.2).transition()
		.duration(1000)
		.style("opacity",1)

}
//fonctions relatives au volume
function reglageson(son){
	for(i=1;i<6;i++){
		if(i<son*6){
			d3.select("#son"+i).attr("opacity",1);
		} else {
			d3.select("#son"+i).attr("opacity",0);
		}
	}
}
function delab(lab){
	d3.select("#label_"+lab).transition().duration(200).attr("stroke","#FFFFFF").selectAll("line").attr("stroke","#FFFFFF")
	d3.select("#fond"+lab).selectAll("circle").transition().duration(200).attr("opacity",0.07)
}
function labb(lab){
	d3.select("#label_"+lab).transition().duration(200).attr("stroke","#000000").selectAll("line").attr("stroke","#000000")
	d3.select("#fond"+lab).selectAll("circle").transition().duration(400).attr("opacity",0.03)
}
//lecture
function suivant(){ //continuer/lancer
	d3.select("#term").style("display","none"); //indication que l'infograpie est terminée : donc a virer dès que l'on relance la démo
	timedCount(); //fonction qui gère l'indication du temps
	son_tbn.play(); //activation du son (qui va avec donc)
	var index = parseFloat(ind)+1; //temps suivant pour calulcer l'intervalle pour la fonction cont défini ci-après
	if(ind>8){ //au temps max, ind+1 n'existe pas et donc on prend la durée totale qui correspond à ce indt+1
		var inter = son_tbn.duration*1000-curt*1000;
	} else {
		var inter = listeTemps[index]-curt*1000; //improtant : curt et non listeTemps[ind], au coup on l'ait déjà avancé et fait une pause manuelle
	}
	//sur la barre de temps, les étapes écoutées s'allument : un des seuls éléments qui ne se réinitialise pas
	d3.select("#barre"+ind).attr("opacity",1)
	
	//animations
	if(continuue==true){ //permet de vérifier que l'on n'a pas fait de pause manuelle : si ct le cas, on répèterait deux fois la même anumation
		for(l=0;l<listeNoeuds[ind].length;l++){
			maj2(listeNoeuds[ind][l],csvData);
		}
	}
	cont = setTimeout(function(){//permet de s'arrêter après chaque étape
		if(ind<9){
			paus();
			continuue = true; //permet de réactiver et de dire que l'on est pas dans une pause manuelle
			ind++; //lui ne change qu'à lafin d'une étape, jamais dans une pause manuelle (sauf utilisation de la barre de temps)
			var indi = parseFloat(ind)+1; //les étapes dans le code vont de 0 à 9, mais pour l'utilisateur elles doivent commencer à 1;
			d3.select("#etape").attr("value","Continuer (Étape "+indi+")"); //lorsqu'une étpae est finie, le bonton continuer n'indique plus le temps mais l'étape suivante
		} else {
			//la fonction fin() est déjà déclarer dans timedCount, c'est mieux;
		}
	},inter);
}
function paus(){ //pause
	son_tbn.pause();
	clearTimeout(t); //arrête le timedcount
	clearTimeout(cont); //enlève la fonction de pause automatique, sinon elle va se délcencher n'importe comment
	curt = son_tbn.currentTime; //mise à jour de la variable curt : plus propre de stoker dans une variable;
	
	//mise à jour des boutons
	etapepause.style.display = "none";
	etape.style.display = "inline";
}
function fin(){ //se déclenche à la fin de la lecture
	clearTimeout(t);
	son_tbn.currentTime = 0;
	etapepause.style.display = "none";	
	d3.select("#term").style("display","block").html("Démonstration terminée"); //indication qui sra suprrimée au clic sur suivant
}
//animations
function maj2(id, csvData){
	for(j=0; j< csvData.length; j++){
		if (csvData[j].r == id){
			obj  = document.getElementById(csvData[j].n1);
			d3.select("#"+csvData[j].r) 
				.attr("opacity", 1)
				.attr("stroke", csvData[j].couleur)
				.transition()
				.delay(function(){
					var val = this.attributes.decal.value;
					return val*8*vit
				})
				.duration(8*vit)
				.attr("stroke-dasharray", "2000, 0")
				
			d3.select("#boules_"+csvData[j].r) 
				.transition()
				.delay(vit)
				.attr("class", "debit");
			
			d3.select("#"+csvData[j].n1+"d")
				.transition()
				.duration(0.2*vit)
				.attr("opacity", 1)
										
			d3.select("#"+csvData[j].n2+"d")
				.transition()
				.delay(1.8*vit)
				.duration(0.2*vit)
				.attr("opacity", 1)
				
			if(document.getElementById("txt_"+csvData[j].r)){
				d3.select("#txt_"+csvData[j].r).transition().delay(0.5*vit).duration(0.5*vit).attr("opacity", 1);
			} 
			if(csvData[j].n2!="n8"){
				d3.select("#fond_"+csvData[j].n2).transition().delay(1.8*vit).duration(0.2*vit).attr("stroke","#333333");
			}
			if(document.getElementById("txt2_"+csvData[j].r)){
				d3.select("#txt2_"+csvData[j].r).transition().delay(1.5*vit).duration(0.5*vit).attr("opacity", 1);
			}
			if(document.getElementById("txt_"+csvData[j].n1)){
				d3.select("#txt_"+csvData[j].n1).transition().delay(0.5*vit).duration(0.5*vit).attr("opacity", 1);
			}
			if(csvData[j].n1!="n9"){
				d3.select("#g_"+csvData[j].n1).attr("class","goutte coule2");
			} else {
				d3.select("#g_"+csvData[j].n1).selectAll(".goutte").attr("class","goutte coule2");
			}			
			if(csvData[j].n1=="n2"){
				d3.select("#fg_n9").transition().delay(vit*8).duration(vit*2).attr("opacity", 1).attr("transform", "translate("+0 +"," + 43 + ")");
				d3.select("#fa_n9").transition().delay(vit*8).duration(vit*2).attr("opacity", 1);
			}			
			if(csvData[j].n1=="n10"){
				d3.select("#fg_n10").transition().delay(vit*8).duration(vit*2).attr("opacity", 1).attr("transform", "translate("+0 +"," + 43 + ")");
				d3.select("#fa_n10").transition().delay(vit*8).duration(vit*2).attr("opacity", 1);
			}
			if(csvData[j].r=="o"||csvData[j].r=="p"||csvData[j].r=="k"||csvData[j].r=="r"||csvData[j].r=="n"){
				d3.select("#n8d").attr("class","clignote")
			} else {
				d3.select("#n8d").attr("class","")
			}			
			if(csvData[j].r=="u"){
				d3.select("#periscope").transition().duration(vit).attr("opacity","1")
			}
			animeRob(csvData[j].n1);
		}
	}
}

///////////////////////////////////////fonctions du mode libre////////////////////////////////////////
////appel unique
function choice2(){ //intéractivité
	queue()//csv différentdu mode démo : chargé ici une seule fois
		.defer(d3.csv,"data/relations.csv")
		.await(callback1); 
			
	function callback1(error, csvData){
		///boutons "+" au budget de l'état
		for (i=0;i<boutons.length;i++){
			//indications sur l'utilité des boutons du budget de l'Etat
			boutons[i].onmouseover = function(){
				var id = this.attributes.direction.value;
				d3.select(this).select("rect").attr("fill","#be2e0d");
				var indic = "";
				// queue()//csv différentdu mode démo : cargé ici une seule fois
					// .defer(d3.csv,"data/relations.csv")
					// .await(callback1); 
				
				// function callback1(error, csvData){
					for(i=0;i<csvData.length;i++){			
						if(csvData[i].n2==id){
							var indic = csvData[i].txt;
						}
					}
					d3.select("#instant2").html(indic);
				// }
				
			}
			
			boutons[i].onmouseout = function(){
				var id = this.attributes.direction.value;
				d3.select(this).select("rect").attr("fill","#f6e9d9")
				d3.select("#instant2").html("");
			}
			//clic sur les boutons de l'Etat 
			boutons[i].onclick = function(){
				var idBout = this.id;
				var id = this.attributes.direction.value;
				this.className = "boutPlus on";
				d3.select("#"+idBout).transition().delay(1000).duration(1000).attr("class", "boutPlus off");	
				majdiff(id, csvData);
			}
		}

		///robinets à ouvrir
		for(j=0; j<robi.length; j++){	
			robi[j].onclick = function(){
				maj(this.id, csvData);
			};
		};

		///noeuds : même fonction que les robinets (pourrait être rassemblés en une classe)
		for(k=0; k<noeuds.length; k++){	
			noeuds[k].onclick = function(){
				var idbout = this.id;
				maj(idbout, csvData);
			};
			
		};
	}
	

}

////appels multiple
//déclenchement du mode et initialisation
function utlibre(){
	//mise à jour des boutons
	boutLibre.style.display = "none"; 
	boutTout.style.display = "inline";
	init.style.display = "block";
	init.onclick = function(){ //l'action de ce même bouton change à chaque mode, hormis la fonction révolution
		revolution();
		utlibre();
	}

	//petit glyphe son pour annoncer le mode démo et gesiton de son placement dans le bouton
	d3.select("#avertson2").style("display","inline"); 
	boutTout.style.paddingLeft = "10%";
	
	////reinitialisation des éléments (sera donc répétée au bouton init)
	///commune aux deux modes
	reinitialize();
	
	///règles propres à chaque mode 
	d3.select("#rule").style("display","none");
	d3.select("#rule2").style("display","block");
	d3.select("#pexplis").html("Cliquer sur le bouton \"Démonstration\" pour lancer une version commentée du schéma<br>Cliquer sur <img src = 'img/return.png' style='width:10%;margin-top:5%'/> pour remettre à zéro") 
	
	///réinitialisation des couleurs (gouttes, noeuds, etc)
	d3.select("#anime").selectAll(".fd").attr("fill","#F5F6F7").attr("stroke","#F5F6F7");
	d3.select("#anime").selectAll(".goutte").attr("fill","#F5F6F7")
	d3.select("#anime").selectAll(".color").attr("fill","#F5F6F7")
	
	///éléments présents dans le mode démo (désaffichage)
	d3.select("#soundcontrol").style("display","none");
	d3.select("#barretime").style("display","none");
	d3.select("#video").style("display","none");
	d3.select("#playch").style("display","none");
	//décalage du titre de noeud 11 (création d'emplois et donc placement d'une ristourne 
	d3.select("#ristourne").attr("opacity",0);
	d3.select("#txt_n11").select("text").attr("transform","matrix(0.9 0 0 1 315 488)");
	//cache qui rend les éléments non cliquables
	d3.select("#cache").attr("display","none");
	
	///éléments présents dans le mode libre (affichage)
	d3.select("#anime").selectAll(".boutPlus").style("display","block");
	//budget de l'état
	d3.select("#n12").attr("cond",3).attr("opacity", 1);
	d3.select("#fond_n12").attr("fill",nuancier[3]);
	//demande globale
	d3.select("#n8").attr("opacity",1);	
}

//animations
function maj(id, csvData) {
		var jamais = true;
		for(j=0; j<csvData.length; j++){
			var row = csvData[j];
			if (row.n1 == id){
				//test le capital disponible dans le noeud
				var cap = document.getElementById(id).attributes.cond.value;
				var cliquable; 
				if(jamais==true){ //permet de gérer les tuyaux qui ont plusieurs destination : sinon le test cliquable va bloquer le second tuyaux
					var cliquable = document.getElementById(id).attributes.cliquable.value; //permet de ne pas cliquer indéfiniement sur un tuyaux : se débloque lorsqu'il est réalimenté;
				};
				jamais = false; //voilà : ça ne peut se faore qu'une fois;
				
				if(cap==0||cliquable=="false"){ //test à double condition pour savoir si l'on peut cliquer sur le noeud
					rien();
					if(id=="n8"&&cap!=0){ //test pr voir si l'on est dans le cas de figure précis ou l'on veut recliquer sur ma demande gloable qui est foncée alors que l'état est gris
						d3.select("#avert3").attr("compte",function(){
							var val = parseFloat(this.attributes.compte.value) + 1;
							return val;
						})
						if(document.getElementById("avert3").attributes.compte.value > 3){
							document.getElementById("avert3").attributes.compte.value = 0;
							d3.select("#avert3")
								.style("display", "block")
								.transition()
								.duration(500)
								.style("opacity", "1")
								.transition()
								.delay(2500)
								.duration(500)
								.style("opacity", "0")
								.transition()
								.delay(3000)
								.style("display", "none")
						}

					}
				}else if(document.getElementById(row.n2)){ //vérifie que le noeud suivant existe bien : dans la table de relation certains ont des faux n2 : pour le n1_entreprise
					var condi = document.getElementById(row.n2).attributes.cond.value; //disponibilité du n2 : sera ensuite mise à jour avec le n2, ci-après
					var coul = nuancier[cap]; //couleur pour les fuites et gouttes, et fonds : sera mise à jour aussi avec le n2
					//pareil pour le n : mais la on test pr voir si'l dépasse pas(servira pour les couleurs et animations):
					var capok = cap;	
					if(cap>4){
						capok =4;
					}
					
					if(row.n1 != "n9" || document.getElementById("n8").attributes.cond.value > 0){ //vérifie que la demande globale est remplis si on va vers les entreprises 
						////mise à jour des valeur des noeuds et relations
						d3.select("#"+row.n2)
							.attr("cond", function(){
								//mise à jour des points disponibls dans le noeud suivant
								var initial =this.attributes.cond.value;
								if(row.r=="u"){ // le problème dans ce cas là est que le déjà a déjà été fait et donc aucun flux ne va pas vers les entreprises : là le problème que c'est ilimité
									var val = parseFloat(initial)+1;
									if (val>4){
										coul = nuancier[4];
									} else {
										coul = nuancier[val];
									}
								} else {
									var deja = document.getElementById(id).attributes.deja.value;
									var val = parseFloat(this.attributes.cond.value) + parseFloat(cap-deja);
									if (val>4){
										coul = nuancier[4];
									} else {
										coul = nuancier[val];
									}
									
								}
								if(initial!=val){
									d3.select(this).attr("cliquable","true");
								}
								condi = val;
								return val;
							})
							
						d3.select("#"+row.r) 
							.attr("stroke-dasharray", "0, 2000")
							.attr("ok", "ok")
							.attr("cond", cap)
							.attr("stroke", function(){
								//la couleur est celle du noeud parent :
								return nuancier[capok];
							})
							.attr("opacity", 1)
							.transition()
							.duration(1.8*vit)
							.attr("stroke-dasharray", "2000, 0")
							
						d3.select("#boules_"+row.r) //boules blanches qui se déplacent : c'est un surtuyau
							.transition()
							.delay(vit)
							.attr("class", "debit"); 
							
					
						d3.select("#"+id) 
							.attr("cliquable", "false")
							.attr("deja",cap) //permet de ne pas redonner plusieurs fois le meme argent venant du meme tuyaux

						////animations complémentaires
							
						//clignotement
						var cliquable2 = document.getElementById(row.n2).attributes.cliquable.value;
						d3.select("#fond_"+row.n2).attr("fill",coul).attr("class",function(){
							if(this.id!="fond_n12"&&cliquable2=="true"){
								var val = this.attributes.class.value;
								return val + " clignote"
							}else {
								return "";
							}
						})
						
						//gouttes(dont entreprises : il faut alors être dans le test) - seulement les entreprises on plusieurs gouttes			
						if(id!="n9"){
							d3.select("#g_"+id).attr("fill",nuancier[capok]).attr("class","goutte coule"+capok);
						} else {
							d3.select("#g_"+id).selectAll(".goutte").attr("fill",nuancier[capok]).attr("class","goutte coule"+capok);
						}
						
						//fuites
						if(document.getElementById("fg_"+id)){
							d3.select("#fg_"+id).selectAll(".color").attr("fill",nuancier[capok])
							d3.select("#fg_"+id).transition().duration(vit).attr("opacity", 1).attr("transform", "translate("+0 +"," + 43 + ")");
							d3.select("#fa_"+id).transition().duration(0.5*vit).attr("opacity", 1);
						}
						
						//textes fixes
						var coul2 = "#000000"; //couleur du texte des titres
						if(coul==nuancier[4]){
							coul2 = "#FFFFFF";
						}
						d3.select("#txt_"+row.r).transition().delay(vit).duration(vit).attr("opacity", 1);
						d3.select("#txt2_"+row.r).transition().delay(vit).duration(vit).attr("opacity", 1);
						d3.select("#txt_"+row.n2).transition().delay(2*vit).duration(vit).attr("opacity", 1).attr("fill",coul2).selectAll("text").attr("fill",coul2);
							
						//dessins des noeuds
						if(condi==4){
							d3.select("#"+row.n2).selectAll(".t"+condi).transition().duration(500).attr("opacity", 1);
							d3.select("#"+row.n2).selectAll(".t"+3).transition().duration(500).attr("opacity", 0);
							d3.select("#"+row.n2).selectAll(".t"+2).transition().duration(500).attr("opacity", 0);
							d3.select("#"+row.n2).selectAll(".t"+1).transition().duration(500).attr("opacity", 1);
						} else if (condi==3){
							d3.select("#"+row.n2).selectAll(".t"+condi).transition().duration(500).attr("opacity", 1);
							d3.select("#"+row.n2).selectAll(".t"+2).transition().duration(500).attr("opacity", 0);
							d3.select("#"+row.n2).selectAll(".t"+4).transition().duration(500).attr("opacity", 0);
							d3.select("#"+row.n2).selectAll(".t"+1).transition().duration(500).attr("opacity", 1);
						} else if (condi==2){
							d3.select("#"+row.n2).selectAll(".t"+condi).transition().duration(500).attr("opacity", 1);
							d3.select("#"+row.n2).selectAll(".t"+3).transition().duration(500).attr("opacity", 0);
							d3.select("#"+row.n2).selectAll(".t"+4).transition().duration(500).attr("opacity", 0);
							d3.select("#"+row.n2).selectAll(".t"+1).transition().duration(500).attr("opacity", 1);
						} else if (condi==1){
							d3.select("#"+row.n2).selectAll(".t"+condi).transition().duration(500).attr("opacity", 1);
							d3.select("#"+row.n2).selectAll(".t"+3).transition().duration(500).attr("opacity", 0);
							d3.select("#"+row.n2).selectAll(".t"+4).transition().duration(500).attr("opacity", 0);
							d3.select("#"+row.n2).selectAll(".t"+2).transition().duration(500).attr("opacity", 0);
						} else if (condi==0){
							d3.select("#"+row.n2).selectAll(".t"+1).transition().duration(500).attr("opacity", 0);
							d3.select("#"+row.n2).selectAll(".t"+3).transition().duration(500).attr("opacity", 0);
							d3.select("#"+row.n2).selectAll(".t"+4).transition().duration(500).attr("opacity", 0);
							d3.select("#"+row.n2).selectAll(".t"+2).transition().duration(500).attr("opacity", 0);
						}	
					} else { //si l'on est dans le cas de figure ou la demande globale est vide et que l'on clique sur ls entreprises
						globale = false;
						rien();
						d3.select("#avert")
							.style("display", "block")
							.transition()
							.duration(500)
							.style("opacity", "1")
							.transition()
							.delay(3500)
							.duration(500)
							.style("opacity", "0")
							.transition()
							.delay(4000)
							.style("display", "none")
					}
					
					////se fait dans tous les cas : demande globale vide ou non
					d3.select("#fond_"+id).attr("class",function(){
						var val = this.attributes.class.value;
						var liste = val.split("clignote");
						return liste[0]
					})
					
					//noeuds exceptionnels(pareil : pas de risuqe qu'on clique sur "n9")			
					if(row.n2=="n8"){
						d3.select("#periscope").transition().duration(1.5*vit).attr("opacity", 1)
					}
					
					if(row.n2=="n13"){
						d3.select("#n13").transition().duration(1.5*vit).attr("opacity", 1)
					}
										
					if(document.getElementById(id).attributes.class.value == "rob"){
						animeRob(id);
					}
				}else if(document.getElementById("n8").attributes.cond.value > 0){ //en gros : on est dans n9
					if(row.r=="p"||row.r=="o"){ //en fait vu que avant on aavit un test pr virer fauxnoeuds des relatiosn p et o (que d'ailleurs on pourrait supprimer),il faut alors activer les relations de ces faut noeuds
						d3.select("#"+row.r) 
							.attr("stroke-dasharray", "0, 2000")
							.attr("ok", "ok")
							.attr("cond", cap)
							.attr("stroke", function(){
								var coeff = this.attributes.cond.value;
								if(coeff>4){
									var couleur = nuancier[4];
								} else {
									var couleur = nuancier[coeff];
								}
								return couleur;
							})
							.attr("opacity", 1)
							.transition()
							.duration(1.8*vit)
							.attr("stroke-dasharray", "2000, 0")
								
						d3.select("#boules_"+row.r) 
							.transition()
							.delay(vit)
							.attr("class", "debit");
						
						d3.select("#txt_"+row.r).transition().delay(vit).duration(vit).attr("opacity", 1);
						d3.select("#txt2_"+row.r).transition().delay(vit).duration(vit).attr("opacity", 1);
						d3.select("#txt_"+row.n2).transition().delay(2*vit).duration(vit).attr("opacity", 1);
					}
				}
			}
		}
}
function majdiff(id, csvData){			
	if(document.getElementById("n12").attributes.cond.value==0){
		rien();
		d3.select("#avert2") //les caisses de l'Etat sont vides!!
			.style("display", "block")
			.transition()
			.duration(500)
			.style("opacity", "1")
			.transition()
			.delay(2500)
			.duration(500)
			.style("opacity", "0")
			.transition()
			.delay(3000)
			.style("display", "none")
	} else {
		var condi;  //mise à jour des points
		d3.select("#"+id).attr("cond",function(){
			var val = this.attributes.cond.value;
			return parseFloat(val)+1;
		})
		.attr("cliquable","true")
		d3.select("#n12").attr("cond",function(){
			var val = this.attributes.cond.value;
			condi = val-1;
			return val-1;
		})
		if(condi>4){
			condi=4;
		}
		d3.select("#fond_n12").attr("fill", nuancier[condi]) //mise à jour couelur
		majComm(id, csvData); //animation
	}
}		
function majComm(id, csvData){ //fonction d'nimation de maj en simplifiées : pourrait être intégrée à maj 
	for(j=0; j< csvData.length; j++){
		if (csvData[j].n2 == id){
			var row = csvData[j];
			d3.select("#"+row.r) 
				.attr("stroke-dasharray", "0, 2000")
				.attr("ok", "ok")
				.attr("cond", function(){
					var val = parseFloat(this.attributes.cond.value) + 1;
					return val
				})
				.attr("stroke", function(){
					var coeff = this.attributes.cond.value;
					if(coeff>4){
						coeff = 4;
					}
					var couleur = nuancier[coeff];	
					return couleur;
				})
				.attr("opacity", 1)
				.transition()
				.duration(1.8*vit)
				.attr("stroke-dasharray", "2000, 0")
				
			d3.select("#boules_"+row.r) 
				.transition()
				.delay(vit)
				.attr("class", "debit");
		}
	}
}
