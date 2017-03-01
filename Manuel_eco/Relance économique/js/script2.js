//variables globales
var vit = 800;
var itBout = 0;
var robi = document.getElementsByClassName("rob");
var noeuds = document.getElementsByClassName("noeud");
var boutTout = document.getElementById("boutTout");
var boutLibre = document.getElementById("boutLibre");
//var boutonDem = document.getElementById("bou_n8");
var boutons = document.getElementsByClassName("boutPlus");
var bout_0 = document.getElementById("bouton_0"); //bouton "démarrer"
var bout_l = document.getElementsByClassName("bouton_l"); //bouton "démarrer"
var init = document.getElementById("init");
var boutTest = document.getElementById("pausee");
var boutTestP = document.getElementById("playy");
var etape = document.getElementById("etape");
var etapepause = document.getElementById("etapepause");
var boutmeca= document.getElementById("boutmeca");
var vol_moins= document.getElementById("vol_moins");
var vol_plus= document.getElementById("vol_plus");
var son_tbn = document.getElementById("toutdemo");
var tstmeca = 0 ;
d3.select("#anime").selectAll(".eteint").style("display","none")

//var affMode = document.getElementById("affMode");
//var nuancier = ["#F5F6F7", "#E6E8EE","#ACC1C3","#6F9E9C","#22847D"];
var nuancier = ["#F5F6F7", "#8CCFD8","#459BA9","#1D7184","#02465B"];
var lquali = ["NULLE","FAIBLE","MOYENNE","ÉLEVÉE","TRÈS ÉLEVÉE"];
var listeTemps = [1000,2000,3000,4000,5000,6000,7000,12000,21454,30125,37161,41283,48450,59740,63913,72833,85179,94270,99668,103000,108508,117014,124676];
var listeNoeuds = ["a", "b", "c", "d", "e", "f", "g","m", "q", "u","n", "o", "p", "w", "v", "r","t", "h", "s","k", "i", "j", "l"];	
var animDem = [];
var temps = 0;
var tempsTest = 0;
var ind=0;
var curt = 0;
//d3.select("#anime").selectAll(".txtDemo").transition().duration(vit).attr("opacity", 1).attr("fill","blue")
//pour la barre
d3.select("#toutdemo").append("source").attr("src", "audio/final.wav");

var totalTime = listeTemps[listeTemps.length-1];

var sizeTw = 1150;
var sizeTh = 700;
var sizeW = sizeTw/totalTime;
var debX = 30;
var debY = 32;
var sizeH = 10;




var csvData;

//onkeypress = function(e){
   // if(e.charCode == 8){
       // alert(e.charCode);
    //}
//}
polices();
resize();

window.onresize=function(){
	resize();
	
}


window.onload = function(){
	queue()											
	.defer(d3.csv,"data/relations2.csv")
	.await(callback2); 
	function callback2(error, csv){
		csvData = csv;
		initialize();
		reinitialize();
	};
	
}


var c = 0;
var t;

function timedCount() {
	
    
    c = son_tbn.currentTime;
	d = son_tbn.duration;
	var tmin = parseInt(c/60);
	var tsec = parseInt(c%60);
	if(tsec<10){
		tsec = "0" + tsec
	}
	if(c==0){
		d3.select("#playy").attr("value","Lancer ("+tmin+":"+tsec+")");
		d3.select("#etape").attr("value","Lancer ("+ind+")");
	} else {
		d3.select("#playy").attr("value","Continuer ("+tmin+":"+tsec+")");
		d3.select("#etape").attr("value","Continuer ("+ind+")");
	}
	d3.select("#pausee").attr("value","Pause ("+tmin+":"+tsec+")");
	d3.select("#etapepause").attr("value","Pause ("+ind+")");
    t = setTimeout(function(){ timedCount() }, 1000);
	if(c==d){
		fin();
	}
}


function initialize(){	
	//Choix des boutons
	
	for(k=0;k<2;k++){
		bout_l[k].onclick = function(){			
			//d3.select("#rules").style("display", "none")
			d3.select("#rules").transition().duration(1000).style("margin-left","0").style("margin-top","500px").style("font-size", "12px").selectAll("p").style("margin","0px")
			d3.select("#rules").transition().delay(1000).style("margin-top","63%").style("width","98%").style("text-align","right").attr("class","adapte")
			d3.select("#pexplis").style("display","block");
			d3.select("#default").style("display","none");
			d3.select("#images").transition().duration(500).style("opacity",1);
			d3.select("#all").transition().duration(500).style("opacity",1);
			//d3.select("#explications2").attr("")
			
			choice2();
			appendBarre();
			
			boutTout.onclick = function(){
				boutdemo();
				paus();
			}
			
			boutLibre.onclick = function(){
				utlibre();
			}
			
			for(i=0; i<robi.length; i++){	
				robi[i].onclick = function(){
					maj(this.id);
					//maj(this.id, capInit);
				};
				
			};
			
			for(j=0; j<noeuds.length; j++){	
				// var idnew = noeuds[j].id
				// var bouton = document.getElementById("bou_"+idnew);
				noeuds[j].onclick = function(){
					var idbout = this.id;
					maj(idbout);
					//maj(idbout, capInit);
				};
				
			};
			if(this.attributes.effet.value=="libre"){
				utlibre();
			} else {
				boutdemo();
				paus();
			}
		}
	}
	
	
	bout_0.onclick = function(){
		this.style.display = "none"; 
		d3.select("#rules").style("display","block");
	}
	
	boutmeca.onclick = function(){
		var tst = tstmeca%2;
		if(tst==0){
			d3.select("#anime").selectAll(".meca").transition().duration(1000).attr("opacity",1);
			d3.select(this).attr("class","bouts adapte on");
		}else {
			d3.select("#anime").selectAll(".meca").transition().duration(1000).attr("opacity",0);
			d3.select(this).attr("class","bouts adapte");
		}
		tstmeca ++;
	}
	
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
	
}

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

// function majcoul(){
	// d3.select("#anime").selectAll(".relation").attr("stroke",function(){
		// var val = this.attributes.cond.value;
		// return nuancier[val]
	// })
	// d3.select("#anime").selectAll(".fd").attr("fill",function(){
		// var index = this.id;
		// var liste = index.split("_")
		// var idOk = liste[1];
		
		// var val = document.getElementById(idOk).attributes.cond.value;
		// return nuancier[val];
	// })	

// }

function appendBarre(){
	totalTime = son_tbn.duration*1000;
	sizeW = sizeTw/totalTime; //faut le redéclarer maintenant que tout est chargé, au début ca voulait pas
	d3.select("#anime").append("g").attr("id","barretime")
	
	// d3.select("#anime").append("line").attr("id","playet")
		// .attr("y1", sizeTh+parseFloat(debY)-sizeH*3)
		// .attr("y2", sizeTh+parseFloat(debY)-sizeH*(-1))
		// .attr("x1",0)
		// .attr("x2",0)
		// .attr("stroke-width",2)
		// .attr("stroke","#FFFFFF")
		// .attr("opacity",1)
		
	d3.select("#anime").append("line").attr("id","playch")
		.attr("y1", sizeTh+parseFloat(debY)-sizeH*3)
		.attr("y2", sizeTh+parseFloat(debY))
		.attr("x1",0)
		.attr("x2",0)
		.attr("stroke-width",1)
		.attr("stroke","#000000")
		.attr("opacity",0)

	d3.select("#anime").append("text").attr("id","placeBarre")
		.attr("y", sizeTh+parseFloat(debY)-sizeH*2)
		.attr("x",5)
		.attr("class","adapte")
		.attr("opacity",0)
		
	d3.select("#anime").append("rect").attr("id","video").attr("x",debX).attr("y",debY).attr("width",sizeTw-listeTemps[0]*sizeW).attr("height",parseFloat(sizeTh)+20).attr("fill","none").attr("stroke","#E6E8EE").attr("stroke-width",2)
	
	d3.select("#barretime").append("text").attr("id","titreBarre")
		.attr("x",sizeTw-168)
		.attr("y", sizeTh+parseFloat(debY)+16)
		.attr("class","adapte2")
		.text("Etapes de la démonstrations")
	
	var cumulTps = 0;
	for (i=0;i<listeNoeuds.length;i++){
		cumulTps = listeTemps[i]*sizeW;
		noeu = listeNoeuds[i];
		temps = listeTemps[i+1]*sizeW - cumulTps;
		if(!temps){
			var duree = son_tbn.duration*1000;
			var temps = duree*sizeW - cumulTps;
		}
		var xOk = cumulTps +parseFloat(debX)-listeTemps[0]*sizeW;
		d3.select("#barretime").append("rect")
			.attr("x", xOk)
			.attr("width", temps)
			//.attr("stroke-width",2)
			//.attr("stroke","#E6E8EE")
			.attr("id","barre"+listeNoeuds[i])
			.attr("y", sizeTh+parseFloat(debY)-sizeH)
			.attr("height", sizeH)
			.attr("time",listeTemps[i])
			.attr("fill", function(){
				var coul = document.getElementById(noeu).attributes.stroke2.value;
				return coul;
			})
			.attr("opacity",0.2)
			.on("mouseover",function(){
				var bouge = this.attributes.x.value;
				var time = this.attributes.time.value/1000;
				var tmin = parseInt(time/60);
				var tsec = parseInt(time%60);
				if(tsec<10){
					tsec = "0" + tsec
				}
				d3.select("#playch").transition().duration(500).attr("opacity",1).attr("transform","translate("+bouge+", 0)")
				d3.select("#placeBarre").transition().duration(500).attr("opacity",1).attr("transform","translate("+bouge+", 0)").text(tmin+":"+tsec)
			})
			.on("mouseout",function(){
				d3.select("#playch").transition().duration(500).attr("opacity",0)
				d3.select("#placeBarre").transition().duration(500).attr("opacity",0)
			})
			.on("click",function(){
				var playing = false;
				// if(boutTestP.style.display =="block"){
					// playing = true;
				// }
				boutdemo();
				var time = this.attributes.time.value;
				son_tbn.pause();
				son_tbn.currentTime = time/1000;
				curt=time;
				for(i=0;i<listeTemps.length;i++){
					clearTimeout(animDem[i]);
				}
				animeDem = [];
				vit=0;
				setTimeout(function(){
					vit = 600;
				},10)
				demoo(time);
				// if(playing ==true){
					// paus();
				// } else {
					boutTest.style.display = "inline";
					boutTestP.style.display = "none";
					etape.style.display = "none";
					etapepause.style.display = "none";
					d3.select("#label_interromp").html("");
					d3.select("#label_continue").style("display","block").html("Sans interruption : ");
					
				// }
			})
	}
}


function revolution(){
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
		// if(choix=="libre"){
			// utlibre();
		// } else if(choix=="tout"){
			// boutdemo();
			// paus();
		// }
	}, 1000)

}	

function utlibre(){
	boutLibre.style.display = "none";
	boutTout.style.display = "inline";
	init.style.display = "block";
	
	init.onclick = function(){
		revolution();
		utlibre();
	}
	
	//boutTout.value = "Mode démonstration";
	d3.select("#avertson2").style("display","inline");
	boutTout.style.paddingLeft = "10%"
	//arrêt de la fonction demo
	continuue = false;
	reinitialize();
	
	d3.select("#soundcontrol").style("display","none");
	d3.select("#cache").remove();
	d3.select("#barretime").style("display","none");
	d3.select("#video").style("display","none");
	d3.select("#playch").style("display","none");
	d3.select("#rule").style("display","none");
	d3.select("#rule2").style("display","block");
	//d3.select("#instant").style("display","block").style("border-style","solid");
	d3.select("#anime").selectAll(".fd").attr("fill","#F5F6F7")
	d3.select("#anime").selectAll(".goutte").attr("fill","#F5F6F7")
	d3.select("#txtFix").transition().duration(0.5*vit).attr("opacity", 1);
	d3.select("#legende").transition().duration(0.5*vit).attr("opacity", 1).style("display", "block");
	d3.select("#legende2").transition().duration(0.5*vit).attr("opacity", 1).style("display", "flex");
	//d3.select("#divChoix2").style("display", "block");
	d3.select("#anime").selectAll(".boutPlus").style("display","block");
	d3.select("#n12").attr("cond",3).attr("opacity", 1);
	d3.select("#n8").attr("opacity",1);
	d3.select("#fond_n12").attr("fill",nuancier[3]);
	d3.select("#pexplis").html("Cliquer sur le bouton \"Démonstration\" pour lancer une version commentée du schéma<br>Cliquer sur <img src = 'img/return.png' style='width:10%'/> pour remettre à zéro")
	
			
	
	 
	
	//d3.select("#introduction").style("display", "none");
}

function boutdemo(){
	// boutTout.value = "Rafraîchir";
	// boutLibre.value = "Utilisation libre";
	boutTout.style.display = "none";
	boutLibre.style.display = "inline";
	init.style.display = "block";
	init.onclick = function(){
		revolution();
		boutdemo();
		paus();
	}
	
	
	d3.select("#avertson2").style("display","none");
	boutTout.style.paddingLeft = "7px"
	continuue = false;
	var taps = 0;

	//initialisation
	reinitialize();
	d3.select("#barretime").style("display","block");
	d3.select("#soundcontrol").style("display","flex");
	d3.select("#video").style("display","block");
	d3.select("#playch").style("display","block");
	d3.select("#rule").style("display","block");
	d3.select("#rule2").style("display","none");
	d3.select("#fonds").selectAll(".fd").attr("fill","#FFFFFF")
	d3.select("#anime").selectAll(".goutte").attr("fill","#98C3D7")
	d3.select("#fond_n8").attr("fill","#ACCEDE");
	boutTestP.style.display = "inline";
	etape.style.display = "inline";
	boutTest.style.display = "none";
	etapepause.style.display = "none";
	d3.select("#label_interromp").style("display","block").html("Suivre la démonstration par étapes :");
	d3.select("#label_continue").style("display","block").html("Sans interruption : ");
	
	d3.select("#anime").append("rect").attr("x",debX).attr("y",200).attr("fill","red").attr("id","cache").attr("opacity","0").attr("width",sizeTw-listeTemps[0]*sizeW).attr("height",sizeTh-sizeH*3-170)
	d3.select("#txtFix").transition().duration(0.5*vit).attr("opacity", 0);
	d3.select("#noeuds_demo").transition().duration(0.5*vit).attr("opacity",1 ).style("display", "block").selectAll("g").attr("opacity",0.2);
	d3.select("#txt_n8").transition().duration(0.5*vit).attr("opacity", 1).style("display", "block")
	d3.select("#legende").transition().duration(0.5*vit).attr("opacity", 0).style("display", "none");
	d3.select("#legende2").transition().duration(0.5*vit).attr("opacity", 0).style("display", "none");
	//d3.select("#introduction").style("display", "block");
	//d3.select("#divChoix2").style("display", "none");
	d3.select("#anime").selectAll(".boutPlus").style("display","none");
	d3.select("#pexplis").html("Cliquer sur le bouton \"Utilisation libre\" pour lancer la version interactive du schéma<br>Cliquer sur <img src = 'img/return.png' style='width:10%'/> pour remettre à zéro")
	
	
	
	
	//Lancement de la démo : voir https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Instructions/continue et https://openclassrooms.com/courses/dynamisez-vos-sites-web-avec-javascript/la-gestion-du-temps-3
	demoo(0);
	
	boutTest.onclick = function(){
		paus();
		etape.style.display = "inline";
		d3.select("#label_interromp").html("Suivre la démonstration par étapes :");
		d3.select("#label_continue").html("Sans interruption : ");
	}
	boutTestP.onclick = function(){
		pla();
		etape.style.display = "none";
		etapepause.style.display = "none";
		d3.select("#label_interromp").html("");
		d3.select("#label_continue").html("Sans interruption : ");
	}
	etape.onclick = function(){
		suivant();
		boutTestP.style.display = "none";
		boutTest.style.display = "none";
		etapepause.style.display = "inline";
		etape.style.display = "none";
		d3.select("#label_interromp").html("Suivre la démonstration par étapes :");
		d3.select("#label_continue").html("");
	}
	etapepause.onclick = function(){
		paus();
		etape.style.display = "inline";
		etapepause.style.display = "none";
		boutTestP.style.display = "inline";
		d3.select("#label_interromp").html("Suivre la démonstration par étapes :");
		d3.select("#label_continue").html("Sans interruption : ");
	}
	
	//paus();
}

function suivant(){
	for(i=0;i<listeTemps.length;i++){
		clearTimeout(animDem[i]);
	}
	clearTimeout(t);
	animeDem = [];
	maj2(listeNoeuds[ind],csvData);
	if(i==0){
		d3.select("#n12d").transition().duration(vit).attr("opacity", 1);
	}
	var time;
	if(ind<7){
		time = 0; 
		var inter = listeTemps[6]/1000 - time; 
	} else {
		time = listeTemps[ind-1]/1000;
		var inter = listeTemps[ind]/1000 - time; 
	}
	curt = time;
	// son_tbn.currentTime = time;
	// son_tbn.play();
	pla();
	setTimeout(function(){
		paus();
		etape.style.display = "inline";
		etapepause.style.display = "none";
		boutTestP.style.display = "inline";
		d3.select("#label_interromp").html("Suivre la démonstration par étapes :");
		d3.select("#label_continue").html("Sans interruption : ");
	},(inter-1)*1000)
	ind++;
	//a la fin du setTimeout, remettre les bouton lancer et this cliquables)
	//séparer les deux par un petit triat
	//mettre un gros div commun pur  les effacer en mode démonstartion
	
	
	
	
}

function paus(){
	son_tbn.pause();
	for(i=0;i<listeTemps.length;i++){
		clearTimeout(animDem[i]);
	}
	clearTimeout(t);
	animeDem = [];
	curt = son_tbn.currentTime;
	
	//continuue = false;
	boutTestP.style.display = "inline";
	boutTest.style.display = "none";	
	etapepause.style.display = "none";
}

function pla(){
	son_tbn.play();
	timedCount();
	demoo(curt*1000);
	boutTest.style.display = "inline";

	boutTestP.style.display = "none";
}

function fin(){
	clearTimeout(t);
	son_tbn.currentTime = 0;
	boutTest.style.display = "none";	
	etapepause.style.display = "none";	
	d3.select("#label_interromp").style("display","block").html("Démonstration terminée. Cliquer sur \"Rafraîchir\" ou sur la barre colorée pour la lancer à nouveau.");
	d3.select("#label_continue").style("display","none");
	
}

function demoo(etat){
	son_tbn.play();
	timedCount();
	continuue = true;
	deb = ind;
	for(i=deb;i<listeTemps.length;i++){
		animDem[i] = setTimeout(function(){	
			if(continuue == true){
				
				maj2(listeNoeuds[ind],csvData);
				
				// var cx = parseFloat(document.getElementById("barre"+listeNoeuds[ind]).attributes.width.value) + parseFloat(document.getElementById("barre"+listeNoeuds[ind]).attributes.x.value);
				// var duree = listeTemps[ind+1]-listeTemps[ind];
				// d3.select("#playet").transition().duration(duree).attr("transform", "translate("+cx+",0)")
				
				if(ind==0){
					d3.select("#n12d").transition().duration(vit).attr("opacity", 1);
				}
				// var fin = listeTemps.length
				// alert(fin);
				
				//alert(fin);
				
				// if(i==0){
					// d3.select("#fg_n10").attr("opacity", 1);
					// d3.select("#fg_n10").transition().duration(vit).attr("transform", "translate("+0 +"," + 43 + ")");
					// d3.select("#fa_n10").transition().duration(0.5*vit).attr("opacity", 1);
				// } else if(i==8){
					// d3.select("#n8d").transition().duration(500).style("opacity", 0).transition().delay(500).duration(500).style("opacity", 1)
				// } else if(i==19){
					// d3.select("#n8d").transition().duration(500).style("opacity", 0).transition().delay(500).duration(500).style("opacity", 1)
					// d3.select("#fg_n9").attr("opacity", 1);
					// d3.select("#fg_n9").transition().duration(vit).attr("transform", "translate("+0 +"," + 43 + ")");
					// d3.select("#fa_n9").transition().duration(0.5*vit).attr("opacity", 1);
				// }
				ind ++;
			};				
		}, listeTemps[i]-etat)
//	alert(listeNoeuds[ind]+"  "+listeTemps[i])
	}
}

function reinitialize(){
	clearTimeout(t);
	//boutons play pause
	boutTestP.style.display = "none";
	etape.style.display = "none";
	boutTest.style.display = "none";
	etapepause.style.display = "none";
	d3.select("#label_interromp").style("display","none").html("Suivre la démonstration par étapes :");
	d3.select("#label_continue").style("display","none").html("Sans interruption : ");

	//réinitialisation des tuyaux			
	d3.select("#anime").selectAll(".relation").attr("stroke-dasharray","0, 1000").attr("opacity",0); 
	d3.select("#anime").selectAll(".debit").attr("class", "none");
	//d3.select("#instant").style("display","none").style("border-style","none").selectAll("p").remove();
	
	
	//barre du bas
	d3.select("#barretime").selectAll("rect").attr("y", sizeTh+parseFloat(debY)-sizeH).attr("height", sizeH).attr("opacity",0.2);
	
	//capital
	d3.select("#noeuds").selectAll("g").attr("cond", 0).attr("cliquable","false").attr("deja",0);
	d3.select("#relations").selectAll("*").attr("cond", 0);
	
	d3.select("#anime").selectAll(".eff").attr("opacity",0);
	
	//noeuds dessin
	d3.select("#anime").selectAll(".t1").attr("opacity", 0);
	d3.select("#anime").selectAll(".t2").attr("opacity", 0);
	d3.select("#anime").selectAll(".t3").attr("opacity", 0);
	d3.select("#anime").selectAll(".t4").attr("opacity", 0);
	d3.select("#anime").selectAll("g").attr("cond", 0);
	
	//noeuds gris
	d3.select("#n13").attr("opacity", 1);
	d3.select("#n12").attr("opacity", 0);
	d3.select("#n8").attr("opacity", 0);
	d3.select("#anime").selectAll(".eteint").transition().duration(0.5*vit).attr("opacity", 1).attr("fill","red")
	d3.select("#anime").selectAll(".allume").transition().duration(0.5*vit).attr("opacity", 0);
	d3.select("#noeuds_demo").transition().duration(0.5*vit).attr("opacity", 0).style("display", "none");
	
	//mecansme mutliplicateur
	d3.select("#anime").selectAll(".meca").transition().duration(0.5*vit).attr("opacity",0)
	
	//gouttes
	d3.select("#anime").selectAll(".goutte").attr("class","goutte").style("opacity", 1);
	
	//fuites
	d3.select("#anime").selectAll(".fas").transition().duration(vit).style("opacity", 0);
	d3.select("#anime").selectAll(".fgs").transition().duration(vit).style("opacity", 0).attr("transform", "");
	
	//periscope
	d3.select("#periscope").transition().duration(vit).attr("opacity", 0);
	d3.select("#perisVar").attr("transform", "");
	
	//textes de la demo
	d3.select("#anime").selectAll(".txtDemo").transition().duration(vit).attr("opacity", 0);
	
	//boutons
	d3.select("#textes_bouts").selectAll(".boutCont").style("display", "none");
	
	//arrêt du son
	son_tbn.pause();
	son_tbn.currentTime = 0;
	for(i=0;i<listeTemps.length;i++){
		clearTimeout(animDem[i]);
	}
	animDem = [];
	ind = 0;
	curt = 0;
	// son_tbn.volume = 0.5;
	// reglageson(0.5);
	
	// clignotements
	d3.select("#anime").selectAll(".clignote").attr("class",function(){
		var val = this.attributes.class.value;
		var liste = val.split("clignote");
		return liste[0]
	})
}

function maj(id) {
	//alert(id)
	var globale = true;
	listeTextes = [];
	listeXlab = [];
	listeYlab = [];
	queue()											
		.defer(d3.csv,"data/relations.csv")
		.await(callback); 
		
	function callback(error, csvData){	
		var jamais = true;
		for(j=0; j<csvData.length; j++){
			var row = csvData[j];
			if (row.n1 == id){
				var cap = document.getElementById(id).attributes.cond.value;
				// var cliquable;
				if(jamais==true){ //permet de gérer les tuyaux qui ont plusieurs destination : sinon le test cliquable va bloquer le second tuyaux
					cliquable = document.getElementById(id).attributes.cliquable.value; //permet de ne pas cliquer indéfiniement sur un tuyaux : se débloque lorsqu'il est réalimenté;
				};
				jamais = false;
				
				if(cap==0||cliquable=="false"){
					rien();
				}else if(document.getElementById(row.n2)){
					var condi = document.getElementById(row.n2).attributes.cond.value;
					var coul = nuancier[condi];
					obj = document.getElementById(row.n1);
					if(row.n1 != "n9" || document.getElementById("n8").attributes.cond.value > 0){
						d3.select("#"+row.n2)
							// .attr("capital", function(){
								// var val = parseFloat(this.attributes.cond.value);
								//var coeff = parseFloat(row.coef)/capInit;
								//var capAd = cap * coeff;
								
								// if(row.n1 == "n9"){											
									// var valGlobal = document.getElementById("n8").attributes.capital.value/capInit;
									// var val = (parseFloat(anc) + parseFloat(capAd))*valGlobal
								// } else {
									// var val = parseFloat(anc) + parseFloat(capAd);
								// }
								// return val;
							// })
							.attr("cond", function(){
								var deja = document.getElementById(id).attributes.deja.value;
								var val = parseFloat(this.attributes.cond.value) + parseFloat(cap-deja);
								if (val>4){
									coul = nuancier[4];
								} else {
									coul = nuancier[val];
								}
								condi = val;
								return val;
								
							})
							.attr("cliquable","true")
							
							//.attr("class", "noeud done")
							
						d3.select("#"+row.r) 
							.attr("stroke-dasharray", "0, 2000")
							.attr("ok", "ok")
							.attr("cond", cap)
							.attr("stroke", function(){
								// if(row.n1 == "n9"){
									// var valGlobal = document.getElementById("n8").attributes.capital.value/capInit;
									// var valGlobal = document.getElementById("n8").attributes.cond.value;
									// coeff = valGlobal*(cap/capInit);
								// } else {
									// coeff = document.getElementById("n8").attributes.cond.value
								// }
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
							
					
						d3.select("#"+id) 
							//.transition().delay(vit)
							.attr("cliquable", "false")
							.attr("deja",cap) //permet de ne pas redonner plusieurs fois le meme argent venant du meme tuyaux
							
						
						// d3.select("#fond_"+id)
							// .attr("fill", function(){
								// var val = document.getElementById("id").attributes.cond.value;
								// return nuancier[val]
							// })
						
						
						//Noeuds
		
						d3.select("#fond_"+row.n2).attr("fill",coul).attr("class",function(){
							if(this.id!="fond_n12"){
								var val = this.attributes.class.value;
								return val + " clignote"
							}else {
								return "";
							}
							
						})
						
						if (condi != 0){
							
							d3.select("#bou_"+row.n2).style("display","block"); //boutons des noeuds
						}
						
						//animations exceptionnelles (dont entreprises : il faut alors être dans le test)					
						if(id!="n9"){
							//d3.select("#g_"+id).transition().delay(2*vit).duration(vit).attr("opacity", 0).attr("transform", "translate("+0 +"," + 100 + ")");
							d3.select("#g_"+id).attr("fill",coul).attr("class","goutte coule"+condi);
						} else {
							d3.select("#g_"+id).selectAll(".goutte").attr("fill",coul).attr("class","goutte coule"+condi);
						}
						
						var coul2 = "#000000";
						
						if(coul==nuancier[4]){
							coul2 = "#FFFFFF";
						}
						
						d3.select("#txt_"+row.r).transition().delay(vit).duration(vit).attr("opacity", 1);
						d3.select("#txt2_"+row.r).transition().delay(vit).duration(vit).attr("opacity", 1);
						d3.select("#txt_"+row.n2).transition().delay(2*vit).duration(vit).attr("opacity", 1).attr("fill",coul2).selectAll("text").attr("fill",coul2);
						
						//if(document.getElementById("fa_"+id)){
						d3.select("#fg_"+id).selectAll(".color").attr("fill",coul)
						d3.select("#fg_"+id).transition().duration(vit).attr("opacity", 1).attr("transform", "translate("+0 +"," + 43 + ")");
						d3.select("#fa_"+id).transition().duration(0.5*vit).attr("opacity", 1);
						//}
									
					
					} else {
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
					
					//fin de clignotements//Noeuds
	
					d3.select("#fond_"+id).attr("class",function(){
						var val = this.attributes.class.value;
						var liste = val.split("clignote");
						return liste[0]
					})
					
					//noeuds exceptionnels				
					if(row.n2=="n8"){
						d3.select("#periscope").transition().duration(1.5*vit).attr("opacity", 1)
					}
					
					if(row.n2=="n13"){
						d3.select("#n13").transition().duration(1.5*vit).attr("opacity", 1)
					}
					
				

					
					
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
					if(document.getElementById(id).attributes.class.value == "rob"){
						animeRob(id);
					}
						
					listeTextes.push(row.texte);
					// d3.select("#instant").selectAll("p").remove();
					// d3.select("#instant").style("border-color", coul)
				}else if( document.getElementById("n8").attributes.cond.value > 0){
					if(row.r=="p"||row.r=="o"){
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
						
						
						listeTextes.push(row.texte);
					}
					
				}
			}
		}
		
		//infosbulles  : a revoir
		var blop = 0;		
		
		// setTimeout(function(){
			// if(globale == true){
				// var time = 1;
				// var ii = 0;
				// for (i=0;i<listeTextes.length;i++){
					// txt = listeTextes [i];
					// ii = 0;
					// longueur = listeTextes[i].length;
					// setTimeout(function(){
						
						// txt = liste[ii];
						// x = listeX[ii]-75;
						// y = listeY[ii]-40;
						//d3.select("#instant").append("p").html(txt);
						// ii++;
					// }, time*vit*0.05);
					// time = parseFloat(time)+ (parseFloat(longueur));
				// }
			// }
		// }, 200);	
	}
}

function choice2(){
	
	//survol rend les boutons opaques : 
	// d3.select("#divChoix2")
		// .on("mouseover", function(){
			// d3.select("#divChoix2").selectAll(".boutPlus").style("opacity", 1);
		// })
		// .on("mouseout", function(){
			// d3.select("#instant2").text("");
			// d3.select("#divChoix2").selectAll(".boutPlus").style("opacity", 0.5);				
		// })
		
	//indications sur l'utilité du bouton demande globale
	// boutonDem.onmouseover = function(){
		// d3.select("#indicDemande").style("opacity",1).transition().duration(2000).style("opacity",0);
	// }
	
	for (i=0;i<boutons.length;i++){
		//indications sur l'utilité des boutons du budget de l'Etat
		boutons[i].onmouseover = function(){
			var id = this.attributes.direction.value;
			d3.select(this).select("rect").attr("fill","#be2e0d");
			var indic = "";
			queue()										//a charger avant	
				.defer(d3.csv,"data/relations.csv")
				.await(callback1); 
			
			function callback1(error, csvData){
				
				for(i=0;i<csvData.length;i++){			
					if(csvData[i].n2==id){
						var indic = csvData[i].txt;
					}
				}
				d3.select("#instant2").html(indic);
			}
			
		}
		
		boutons[i].onmouseout = function(){
			var id = this.attributes.direction.value;
			d3.select(this).select("rect").attr("fill","#f6e9d9")
			d3.select("#instant2").html("");
		}
		//clic sur les boutons de l'Etat 
		boutons[i].onclick = function(){
			var idBout = this.id
			var id = this.attributes.direction.value;
			this.className = "boutPlus on";
			d3.select("#"+idBout).transition().delay(1000).duration(1000).attr("class", "boutPlus off");	
			majdiff(id);
		}
	}
}

function majdiff(id){			
	//reste un peu noir
	if(document.getElementById("n12").attributes.cond.value==0){
		rien();
		d3.select("#avert2")
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
		var condi = 0;
		d3.select("#"+id).attr("cond",function(){
			var val = this.attributes.cond.value;
			return parseFloat(val)+1;
		})
		.attr("cliquable","true")
		d3.select("#n12").attr("cond",function(){
			var val = this.attributes.cond.value;
			if(val>0){
				condi = val-1;
				return val-1;
			}
			
		})

		d3.select("#fond_n12").attr("fill", nuancier[condi])
		majComm(id);
	}
	

}		

function majComm(id){
	// if(capEtat/capInit>0){
	// d3.select("#n12").selectAll(".coul").attr("fill", "#F4CB1E");
	// } else {
		// d3.select("#n12").selectAll(".coul").attr("fill", "red");
	// }
	//var capEtat = document.getElementById("n12").attributes.cond.value;
	d3.csv("data/relations.csv", function(csvData){
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
	})
	
}

function animeRob(rob, vit) {
	//d3.select("#"+rob).select(".eteint").transition().duration(0.5*vit).attr("opacity", 0);
	d3.select("#"+rob).select(".allume").transition().duration(0.5*vit).attr("opacity", 1);
}

function maj2(id, csvData){
	d3.select("#barretime").selectAll("rect").transition().duration(vit*0.3).attr("y", sizeTh+parseFloat(debY)-sizeH).attr("height", sizeH);
	d3.select("#barre"+id).attr("opacity",1).transition().duration(vit*0.3).attr("y", sizeTh+parseFloat(debY)-sizeH*1.8).attr("height", sizeH*2).attr("opacity",1);
				
	
	for(j=0; j< csvData.length; j++){
		if (csvData[j].r == id){
			obj  = document.getElementById(csvData[j].n1);
			d3.select("#"+csvData[j].r) 
				.attr("opacity", 1)
				.attr("stroke", csvData[j].couleur)
				.transition()
				.duration(8*vit)
				.attr("stroke-dasharray", "2000, 1")
				
				
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
						
			if(document.getElementById("txt2_"+csvData[j].r)){
				d3.select("#txt2_"+csvData[j].r).transition().delay(1.5*vit).duration(0.5*vit).attr("opacity", 1);
			}
			
			if(document.getElementById("txt_"+csvData[j].n1)){
				d3.select("#txt_"+csvData[j].n1).transition().delay(0.5*vit).duration(0.5*vit).attr("opacity", 1);
			}
			
			if(id!="n9"){
				d3.select("#fg_"+csvData[j].n1).transition().duration(vit).attr("opacity", 1).attr("transform", "translate("+0 +"," + 43 + ")");
				d3.select("#fa_"+csvData[j].n1).transition().duration(vit).attr("opacity", 1);
				d3.select("#g_"+csvData[j].n1).attr("class","goutte coule2");
			} else {
				d3.select("#g_"+csvData[j].n1).selectAll(".goutte").attr("class","goutte coule2");
				d3.select("#fg_"+csvData[j].r).transition().duration(vit).attr("opacity", 1).attr("transform", "translate("+0 +"," + 43 + ")");
				d3.select("#fa_"+csvData[j].r).transition().duration(vit).attr("opacity", 1);
			}
			

			if(csvData[j].r=="o"||csvData[j].r=="p"||csvData[j].r=="k"||csvData[j].r=="r"||csvData[j].r=="n"){
				d3.select("#n8d").attr("class","clignote")
			} else {
				d3.select("#n8d").attr("class","")
			}
			
			if(csvData[j].r=="u"){
				d3.select("#periscope").transition().duration(vit).attr("opacity","1")
			}

			//if(document.getElementById(csvData[j].n1).attributes.class.value == "rob"){
				animeRob(csvData[j].n1);
			//}
		}
	}
}

function rien(){
	d3.select("#anime").style("opacity",0.2).transition()
		.duration(1000)
		.style("opacity",1)

}

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
