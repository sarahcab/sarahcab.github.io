///////////////////////////////////////variables globales////////////////////////////////////////
////éléments cliquables
var change = document.getElementById("change");
var inner = document.getElementById("inner");
var pop = document.getElementById("pop");
var p_phase = document.getElementById("explis");
var bout_0 = document.getElementById("bouton_0"); //bouton "démarrer"
var bout_l = document.getElementById("bouton_l"); //bouton "démarrer"
var barre = document.getElementById("barre");

////valeurs fixes
var coordph = [138.7,168.7,613.4,799.6,1016,2000];
var coordCapt = [166.9,569,638.5,1028, 2000]; //palliers horizontaux pour la fuite des capitaux
var coordPres = [42.5,186.8,763.6]; //palliers pour la présidence
var nuancierP = ["#b8b8b8","#e40134","#00a7ca","#65b22e","#f7a600","#ec6a05"];
var barbougeX = document.getElementById("barbouge").attributes.cx.value; //balancier (coordonnées pour la rotation)
var barbougeY = document.getElementById("barbouge").attributes.cy.value;
var dicoMois = ["janvier","février","mars","avril","mai","juin","juillet","août","septembre","octobre","novembre","décembre"];
var dicoCapit = ["octobre 2002","mai 2008","avril 2009","septembre 2014","(...)"];
var dicoPres = ["1995 - 2003","2003 - 2011","2011 - 2016"];
var listePres = ["Fernando Henrique Cardoso","Luiz Inácio Lula da Silva","Dilma Roussef"];
var listeCouhces = ["phasess","pres","fuiteflux"]   ////courbe, presidence, fuiteflux
var listeTextes = ["","Candidat de la gauche, Luiz Inácio Lula da Silva est sur le point de gagner la présidentielle. Les investisseurs fuient le pays : le real dégringole. Les premières mesures de Lula rassurent la finance.",
"Dopée par la croissance chinoise, la demande en matières premières alimente la croissance. Celle-ci attire les capitaux étrangers productifs (IDE*) et spéculatifs, qui viennent tirer profit du taux directeur* très élevé de la banque centrale. La balance commerciale devient très positive et génère une rente permettant au pouvoir de mettre en œuvre une politique sociale ambitieuse sans réforme structurelle (notamment sur le plan fiscal). Mais l’afflux de capitaux renchérit le real et sape la compétitivité des industries locales : l’économie se reprimarise* et sa dépendance vis-à-vis des cycles des pays du Nord et de la Chine s’aggrave.",
"La balance commerciale s’équilibre. En réponse à la crise, les banques centrales du Nord injectent d’énormes quantités de liquidités (quantitative easing*), que les spéculateurs placent au Sud. La presse célèbre la bonne santé du Brésil et son « découplage » (lire p. 166). Il est pourtant suspendu aux caprices des flux de capitaux étrangers.",
"La demande de matières premières s’effondre alors que les politiques d’augmentations salariales soutiennent les importations : la balance commerciale plonge dans le rouge. Dilma Rousseff tente de défendre l’industrie (notamment en cherchant à déprécier la monnaie), mais les entrepreneurs préfèrent investir dans des produits financiers et affaiblir la présidente.",
"Dilma Rousseff se plie aux appels à l’austérité. Elle abolit notamment les prix contrôlés : l’inflation bondit. Les perspectives économiques s’assombrissent. L’opposition en profite pour lancer l’offensive politique, qui aggrave la crise."]
var widthPop = document.getElementById("pop").offsetWidth;
var x2000 = 42.5;
var x2016av= 1148;

////valeurs mouvantes
var affSpi = false;
var ancPhase = 0;
var phase = 0;
var itcouches = 0;

////fonctions de base
move(0); 
polices();
resize();

///////////////////////////////////////fonctions principales////////////////////////////////////////
window.onresize=function(){
	resize();
}

//premiers boutons au lancement
window.onload = function(){
	bout_l.onclick = function(){
		d3.select("#rules").transition().duration(1000).style("margin-top","-100px").style("font-size","0px").selectAll(".img").style("width","0%") //réduction de
		d3.select("#default").transition().delay(1100).style("display","none");
		d3.select("#rule").transition().delay(1000).style("display","block");
		d3.select("#tout").transition().duration(1000).style("opacity",1);
		this.style.display = "none";
		d3.select("#inner").attr("class","couche0").style("opacity",1).selectAll(".survool").remove();
		d3.select("#change").style("display","");
		
		initialize();
		couches();		
	}
	
	bout_0.onclick = function(){
		this.style.display = "none"; 
		d3.select("#rules").style("display","block");
	}
	
	
 }

///////////////////////////////////////Evènements des boutons////////////////////////////////////////
//appel unique: définit toutes les actions sur les boutons
function initialize() {
	resize();
	
	inner.onmousemove = function(e){
		var cliX = e.clientX;
		move(cliX);
	}
	inner.onmouseout = function(e){
		move(0); //a voir si virer
	}
	change.onclick = function(){
		spirale();
	}
	inner.onclick = function(){
		couches();
	}
}

//clic sur l'écran : changement des couches
function couches(){
	var tst = itcouches%3;
	classname = listeCouhces[tst];
	if(tst == 0){
		d3.select("body").selectAll(".layer").style("opacity",0.1); //remise à zero au premier
	}
	d3.select("body").selectAll("."+classname).style("opacity",1); 
	d3.select("#inner").attr("class","couche"+tst) //pour le curseur
	itcouches ++;
}

//affichage progressif au survol
function move(eX){
	var decalIn = inner.offsetLeft; //marge par défaut
	var largeur = inner.offsetWidth; //taille calculée par le pourcneatge
	var taillep = inner.style.width; //taille donnée en pourcentage (vérifier que c la meme partout dans l'index -> pour inner et pour les svg)
	var taille = taillep.split("%")[0]

	var x = eX - decalIn;
	var prc = x/largeur;
	var nX = 1190.5*prc;
	
	//pour les dimensions
	if(nX>40 && nX<1150){
		d3.select("#barre").attr("x1", nX).attr("x2",nX);
		//date
		var ampliMM = x2016av-x2000;
		var date = 2001+ (15+1/3)*(nX-x2000)/ampliMM;
		var annee = parseInt(date);
		var moisInd = parseInt((date-annee)*12);
		var mois = dicoMois[moisInd];
		d3.select("#date").html(annee+" - "+mois);
		
		if(nX< coordph[4]){
			d3.select("#date").attr("x", nX)
		} else {
			d3.select("#date").attr("x", nX-70)
		}
	}
	var glob = (nX/1190.5)*(taille);
	d3.select("#visuel").attr("viewBox","0 0 "+nX+" 813.5").attr("width",glob+"%") //agrandissement du truc visible

	//variables par défaut
	ancPhase = phase;
	phase = 0;
	
	//mise à jour des variables
	for(i=1;i<6;i++){
		if(nX>=coordph[i-1] && nX<coordph[i]){
			phase = i;
		} 
	}
	//texte à gauche : titre
	var titre="";
	d3.select("#titre_phase"+phase).selectAll("tspan").text(function(){ //mise à jour dynamique depuis le dessin
		var val = this.innerHTML;
		titre = titre +"<p style='margin-bottom:-15px;text-align-center'>"+ val +"<p/>";
		return val;
	})
	d3.select("#titreP").html(titre).style("color",nuancierP[phase]).selectAll("p").style("font-family","WalbaumGroteskText")
	
	//texte à gauche : paragrapje
	var explis = listeTextes[phase]; //mise à jour depuis une liste 
	d3.select("#explis").html(explis);
	
	var bloublou = "hh"
	if(phase!=ancPhase){ //éléments se produisant lors d'un changemetn dephase uniquement, et pas en continu
		if(document.getElementById("sep"+phase)){ //se produit si l'on est dans une phase active
			var repPhase = document.getElementById("sep"+phase); //à chaque séparateur sont attribuées les données de la balance, soit l'angle et le décalage (trois ligne c-dessous)
			var balangle = repPhase.attributes.balangle.value; 
			var baldiste = repPhase.attributes.baldiste.value;
			var baldisti = repPhase.attributes.baldisti.value;
			if(document.getElementById("sep"+ancPhase)){ //si la phase précédente était active
				var balangleB = document.getElementById("sep"+ancPhase).attributes.balangle.value
				var angleDiff = balangle - balangleB; //on définit la rotation a effectuer : la roation sera globale, la valeur absolue, mais c'est pur régler e temps
			} else { //sinon, on part de zéro
				var angleDiff = balangle;
			}
			var temps = Math.abs(angleDiff)*50;
			//application de l'animation
			d3.select("#balance0").transition().duration(500).attr("opacity",1) //si l'on était dans une phase passive
			d3.select("#contourbalance").transition().duration(500).attr("stroke",nuancierP[phase]);
			d3.select("#barbouge").transition().duration(temps).attr("transform","rotate("+balangle+", "+barbougeX+", "+barbougeY+")");
			//mouvement dans contenant
			d3.select("#exportations")
				.transition().duration(temps).attr("transform","translate(0, "+baldiste+")")
				.select(".glou").style("transform-origin",function(){
					var cx = this.attributes.cx.value;
					var cy = this.attributes.cy.value;
					return cx+"px "+cy+"px";
				}).transition().delay(temps*0.8).attr("class","tangue glou").transition().delay(temps*2).attr("class","glou");
			d3.select("#importations")
				.transition().duration(temps).attr("transform","translate(0, "+baldisti+")")
				.select(".glou").style("transform-origin",function(){
					var cx = this.attributes.cx.value;
					var cy = this.attributes.cy.value
					return cx+"px "+cy+"px";
				}).transition().delay(temps*0.8).attr("class","tangue glou").transition().delay(temps*2).attr("class","glou");
			//contenu
			d3.select("#balance0").selectAll(".contenu").transition().duration(1000).attr("opacity",0);
			d3.select("#exp"+balangle).transition().duration(1000).attr("opacity",1)
			d3.select("#imp"+balangle).transition().duration(1000).attr("opacity",1)
		} else { //phase passive
			d3.select("#balance0").transition().duration(500).attr("opacity",0.3)
			d3.select("#titre_balance").transition().duration(500).attr("fill","#000000");
			d3.select("#contourbalance").transition().duration(500).attr("stroke","#FFFFFF");
			d3.select("#barbouge").transition().duration(500).attr("transform","");
			d3.select("#exportations").transition().duration(500).attr("transform","");
			d3.select("#importations").transition().duration(500).attr("transform","");
			d3.select("#balance0").selectAll(".contenu").transition().duration(1000).attr("opacity",0.1);
		}
	}
	
	//textes remarquables
	for(i=0;i<6;i++){
		var lim = document.getElementById("et"+i).attributes.x.value
		if(nX>lim){
			var txt = document.getElementById("tx"+i).innerHTML;
			var liste = txt.split(">");
			d3.select("#et"+i).transition().duration(500).attr("opacity",1)
			d3.select("#tx"+i).transition().duration(500).attr("opacity",1)
		} else {
			d3.select("#et"+i).transition().duration(500).attr("opacity",0)
			d3.select("#tx"+i).transition().duration(500).attr("opacity",0)
		}
	}
	for(j=0;j<10;j++){
		var lim = document.getElementById("trait"+j).attributes.x1.value
		if(nX>lim){
			d3.select("#trait"+j).transition().duration(500).attr("opacity",1)
			d3.select("#rem"+j).transition().duration(500).attr("opacity",1)
			
		} else {
			d3.select("#trait"+j).transition().duration(500).attr("opacity",0)
			d3.select("#rem"+j).transition().duration(500).attr("opacity",0)
		}
	}
	d3.select("#text_elect").selectAll("text").transition().duration(500).attr("opacity", function(){
		var lim = this.attributes.position.value;
		var limI = this.attributes.position_init.value;
		if(nX>limI){
			return 1;
		} else {
			return 0;
		}
	})
	d3.select("#intuit").transition().duration(500).attr("opacity", function(){
		var lim = this.attributes.position.value;
		if(nX>lim){
			return 1;
		} else {
			return 0;
		}
	})
	d3.select("#elements_legende").transition().duration(500).attr("opacity", function(){ //factoriser!!
		var lim = this.attributes.position.value;
		if(nX>lim){
			return 1;
		} else {
			return 0;
		}
	})
}
 
//affichage de la spirale vicieuse au clic sur le bouton change
function spirale(){ 
	 
	if(affSpi==false){
		d3.select("#fonds").transition().duration(1000).attr("opacity",0.1)
		d3.select("#graphique_fix").transition().duration(1000).attr("opacity",0)
		d3.select("#visuel").transition().duration(1000).attr("opacity",0)
		d3.select("#balance0").transition().duration(1000).style("opacity",0)
		d3.select("#explicationss").transition().duration(1000).style("opacity",0)
		d3.select("#textesRema").transition().duration(1000).style("opacity",0)
		d3.select("#barre").transition().duration(1000).style("opacity",0)
		d3.select("#inner").style("cursor","default")
		d3.select("#titre").html("LA SPIRALE VICIEUSE").transition().duration(500).attr("font-size",30)
		d3.select("#introduction").attr("display","none");
		d3.select("#imgChange").attr("src","img/change_couleur.png");
		d3.select("#change").selectAll(".changecoul").transition().duration(1000).attr("fill",function(){
			var val = this.attributes.fill2.value;
			return val;
		});
		
		d3.select("#spiiii")
			//.attr("transform","translate(536.2,277.6) scale(0)")
			.transition()
			.duration(2000)
			.attr("opacity",1)
			.attr("transform","translate(-100,-70) scale(1.2) ")
		
		affSpi = true;
	} else {
		move(0);
		d3.select("#fonds").transition().duration(1000).attr("opacity",1)
		d3.select("#graphique_fix").transition().duration(1000).attr("opacity",1)
		d3.select("#visuel").transition().duration(1000).attr("opacity",1)
		d3.select("#balance0").transition().duration(1000).style("opacity",1)
		d3.select("#explis").transition().duration(1000).style("opacity",1)
		d3.select("#explicationss").transition().duration(1000).style("opacity",1)
		d3.select("#textesRema").transition().duration(1000).style("opacity",1)
		d3.select("#barre").transition().duration(1000).style("opacity",1)
		
		d3.select("#inner").style("cursor","")
		d3.select("#titre").html("LE BRÉSIL SECOUÉ PAR LES INVESTISSEURS").transition().duration(500).attr("font-size",26);
		d3.select("#introduction").attr("display","block");
		d3.select("#imgChange").attr("src","img/change_gris.png");
		d3.select("#change").selectAll(".changecoul").transition().duration(1000).attr("fill","#A8A7A6");
		
		d3.select("#spiiii")
			.transition()
			.duration(2000)
			.attr("opacity",0.5)
			.attr("transform","translate(536.2,277.6) scale(0)")
		
		affSpi = false;
		
		itcouches = 0;
		couches();
		
	}
 }

///////////////////////////////////////fonctions - graphisme////////////////////////////////////////
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
		d3.select("body").selectAll(".adapte").style("font-size","14px")
		d3.select("body").selectAll(".adapte2").style("font-size","18px")
		d3.select("body").selectAll(".adapte3").style("font-size","24px")
	} 	
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