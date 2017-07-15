/////////////////////////////////////////////////    variables globales (fixes et non-fixes confondues)

///thématiques
date = 1945, //date de départ par défaut
anneeMin=1945,  //année de début des données
anneeMax=2016, //année de fin des données
ampli = (anneeMax-anneeMin) //amplitude temporelle

listeDates = [1945,1960,1970,1984,2000,2016]; //date commentée
itDate =0, //indicateur permettant d'aller boucler dedans (heu peut-être à virer)

dataQuot = [], //variable qui va contenir les données sur chaque quotidien
dataTir = [],  //variable qui va contenir le tirage et le nombre de titre par année
dataTextes = [], //variable qui va contenir les textes
nomsVilles = [], //listedes villes implémentée dans la fonction buildListes
listeVilles = new Object(), //idem en objet : va contenir els valeur par ville (nb quotidiens)
nomsDepts = [], //idem par département
listeDept = new Object(), //idem par département
nomsGroupes = ["Rossel","La dépêche","Sud Ouest","Centre-France La Montagne","Sipa Ouest-France","EBRA - Crédit Mutuel","LVMH","Bernard Tapie","SNIC (Société normande d'information et de communication)"] //Idem par groupe : on définit ceux qu'on va garder ici
listeGroupes = new Object(),

lsDeptsSrc = "(Allier,Ardèche, Aveyron, Calvados, Bas-Rhin, Cantal, Charente, Corse du Sud, Dordogne, Doubs, Gard, Haute-Corse, Haute-Vienne, Haut-Rhin, Hérault, Île-et-vilaine, Indre, Isère, Loire-Atlantique, Loiret, Marne, Moselle, Nord, Pyrénées-Atlantiques, Pyrénées-Orientales, Saône-et-Loire, Seine-Maritime, Tarn, Var, Vienne, Puy-de-Dôme)",


valsChoro = [0,1,2,4,6], //discrétisation
valsChoroLeg = ["0","1","2 - 4","4 - 6","6 et plus"]; //discrétisation

///graphiques
var widthGraph = (document.getElementById("graph").attributes.viewBox.value).split(" ")[2], //viewBox-width de l'espace SVG global "graph"
heightGraph = ((document.getElementById("graph").attributes.viewBox.value).split(" ")[3]).split(")")[0], //viewBox-height de l'espace SVG global "graph"

diam = 45,  //diamètre des cercles représentant les quotidiens
strokeQuot = 3.5, //épaisseur du contour des cercles 
widthBarres = 26, //barres
heightBarres = widthBarres*1.5,
socle = widthBarres*1.5, //largeur du socle représentant la ville

scale = 9000, //échelle de la carte

nuancier = ["#0E1A4F","#0D470D","#000000","#FCD96D", "#F08300","#E42420"], //titres locaux, titres nationaux,contours boules et legende, survol locaux(!!dans le css, class hightligth), tirage locaux, tirage nationaux
nuancierChoro = ["#FFFFFF","#CCCEAF","#D1D7E8","#A7B2D3","#7788BB"], 

rmax = 500, //équivaut au rayon max des éléments 'tourne', sert à pondérer la vitesse de chacun

//variables liée au graphique en courbes
maxTit = 200, //maximum de l'axe Y
maxTir = 10000000, //idem pour le tirage
xMin = document.getElementById("emprise_courbe").attributes.x.value, //position du graphique récupérée dans les repères 
xMax = xMin*1+(document.getElementById("emprise_courbe").attributes.width.value)*1 //idem
yMax = document.getElementById("emprise_courbe").attributes.y.value, //idem
yMin = yMax*1+(document.getElementById("emprise_courbe").attributes.height.value)*1 //idem
w = xMax-xMin, //idem
h = yMin-yMax, //idem : le max et le min sont inversés car la valeur 0 est en bas
nbLines = 10, //nombre de lignes de repères apparaissant
pasX= w/ampli, // x parcouru pour une année
echTit = h/maxTit, // y parcouru 1 titre en  +
echTir = h*100000/maxTir; //divisé par 100 000 : on a divisé par 100 dans le talbeau, et dans la source c'est écrit "tirage moyen journalier en millier au mois de juin chaque année" 

///animations
vitAnim = 2000, //durée des transitions (à 0 lors de la sélection manuelle)
dragX = 0, //position du curseur en x : implémenter au survol de l'objet à qui on attribue la fonction drag, avec une fonction au survol (la fonction drag renvoie la distance parcourue et non la position)
dragY = 0, //idem en y
posX =0, //dragX adaptée à la surface du SVG
posY =0, //idem en y
angle =0, //angle 
ancAngle=0,  //angle ??
angle0 = 0,  //angle ??
ancY=0, 
tours = 0,
angleOk = 0,
itTest = 0, //fonction tourne ??
mode_legende = true;

/////////////////////////////////////////////////    Fonctions principales
window.onload = initialize();

function initialize(){
	initMap(); 
	actions(); 
}

function actions(){ //animation et interactivités
	//Bouton "commencer" : effet visuel d'apparition du schéma
	d3.select("#bouton_l").on("click",function(){
		d3.select("#rules").transition().duration(1000).style("opacity",0).transition().style("display","none")
		d3.select("#innercarte").transition().duration(1000).style("opacity",1);
		d3.selectAll(".discret").transition().delay(1000).duration(1500).style("opacity",1); //groupes contenu dans "graph", à 0 par défaut
		d3.selectAll(".feche").attr("stroke-dasharray","0,500").transition().delay(1500).duration(1000).attr("stroke-dasharray","500,0")
	})
	
	//Bouton 'Reculer' -> aller à la date commentée précédente
	d3.select("#reculer").on("click",function(){
		vitAnim = 1500; //il faut remettre une duration poru les transition, nulle pour la sélection manuelle
		d3.selectAll(".indSimple").attr("fill","#3F1112"); //servira si on met un bouton explo 
		d3.selectAll(".indExplo").attr("fill","#FFFFFF"); //idem
		
		for(i=0;i<listeDates.length;i++){ //permet de récupérer la date antérieure la plus proche s'il y a eu sélection manuelle
			if(date<=listeDates[listeDates-i]){
				itDate = i;
			}
		}
		itDate = itDate -1 //nouvelle date 
		
		if(itDate<0){ //bornes
			itDate=0
		}
		if(itDate==0){
			d3.select(this).attr("class","mdSimple").attr("opacity",0.2); //on vire cliquable lorsque c'est la date minimale
			d3.select("#label_reculer").attr("opacity",0.2); //idem label
		}
		
		d3.select("#avancer").attr("class","mdSimple cliquable").attr("opacity",1); //on rend forcément 'avancer' cliquable
		d3.select("#label_avancer").attr("opacity",1); //idem label
		
		date = listeDates[itDate]; //mise à jour de la date par rapport à la liste de dates commentées
		
		//4 fonctions de mise à jour : une pour les données, deux pour la carte, une pour le graphique
		calc();
		majVilles();
		majDepts();
		// majBarres(); 
		majGraph();
		
		//mise à jour géométrique des roues
		angleOk = (date - anneeMin)*45 //on met à jour la variable qui sert a tourner la roue manuelle (valeur contant les tours)
		tourne(angleOk,false) //fonction qui fait tourner
		setTimeout(function(){  //arrêt dela rotation : dans ce cas la c'est la rotation css
			stop(angleOk%360) //le paramètre sert 
		},vitAnim);
		
		tours = angleOk/360 - (angleOk%360)/360; //mise à jour du nombre de tours : division entière (nombre le plus petit, parseInt n'aurait pas marché) par 360 pour connaitre le nombre de tours
		
		//mise à jour des variables repères :
		ancAngle = angleOk;
		test_ancY = (angleOk%360)/180 
		if(test_ancY<1){
			ancY = 1 // ! le plan de coordonnées est orienté vers le bas
		} else {
			ancY = -1
		}

	})
	
	window.onkeypress = function(e){ //a virer
		d3.selectAll(".tourne")
			.attr("class","tourne active")
			.style("animation",function(){
				if(this.attributes.sens.value=="false"){//sens non trigo
					var ss = "tourneD "
				} else {
					var ss= "tourneG "
				}
				var vit = 5
				return ss+vit+"s linear"
			})
			.style("animation-iteration-count","infinite")
			.style("transform-origin",function(){
				if(this.attributes.centrex){
					var cx = this.attributes.centrex.value;
					if(this.attributes.centrey){
						var cy= this.attributes.centrey.value;
						return cx+"px "+cy+"px"
					} else {
						alert(this.id)
					}
				}			
			})
	}
	
	window.onkeyup = function(e){
		stop(0)
	}
	
	//Bouton 'Avancer' -> aller à la date commentéesuivante
	d3.select("#avancer").on("click",function(){
		vitAnim = 1500; //il faut remettre une duration poru les transition, nulle pour la sélection manuelle
				
		d3.selectAll(".indSimple").attr("fill","#3F1112"); //servira si on met un bouton explo 
		d3.selectAll(".indExplo").attr("fill","#FFFFFF"); //idem

		for(i=0;i<listeDates.length;i++){ //permet de récupérer la date antérieure la plus proche s'il y a eu sélection manuelle
			if(date>=listeDates[i]){
				itDate = i;
			}
		}
		
		itDate = itDate*1 + 1; //nouvelle date
		if(itDate>listeDates.length-1){  //bornes 
			itDate=listeDates.length-1;
		}
		if(itDate==listeDates.length-1){ 
			d3.select(this).attr("class","mdSimple").attr("opacity",0.2); //on vire cliquable lorsque c'est la date maximale
			d3.select("#label_avancer").attr("opacity",0.2); //idem label
		}
		d3.select("#reculer").attr("class","mdSimple cliquable").attr("opacity",1);  //on rend forcément 'reculer' cliquable
		d3.select("#label_reculer").attr("opacity",1); //idem label
		
		// var ancDate=date; //récupération de l'ancienne date pour voir la vitesse de rotation des roues
		date = listeDates[itDate]; //mise à jour de la date par rapport à la liste de dates commentées
		
		//4 fonctions de mise à jour : une pour les données, deux pour la carte, une pour le graphique
		calc();
		majVilles();
		// majBarres(); 
		majDepts();
		majGraph();
		
		//mise à jour géométrique des roues
		angleOk = (date - anneeMin)*45 //on met à jour la variable qui sert a tourner la roue manuelle (valeur contant les tours)
		tourne(angleOk,false) //fonction qui fait tourner
		setTimeout(function(){  //arrêt dela rotation : dans ce cas la c'est la rotation css
			stop(angleOk%360) //le paramètre sert 
		},vitAnim);
		
		tours = angleOk/360 - (angleOk%360)/360; //mise à jour du nombre de tours : division entière (nombre le plus petit, parseInt n'aurait pas marché) par 360 pour connaitre le nombre de tours
		
		//mise à jour des variables repères :
		ancAngle = angleOk;
		test_ancY = (angleOk%360)/180 
		if(test_ancY<1){
			ancY = 1 // ! le plan de coordonnées est orienté vers le bas
		} else {
			ancY = -1
		}
	})
	
	//choix d'une date précise : drag sur la roue n°0
	d3.select("#drag0")	
		.on("mousemove",function(e){ //fonction de survol permettant de récupérer la position du curseur, ce que ne permet pas drag
			dragX = d3.event.clientX;
			dragY = d3.event.clientY;
		})
	dragWheel() //implémentation du drag
}

function initMap(){ //construction graphique
	queue()	//chargement des donénes					 
		.defer(d3.json, "data/dept3.json") //geoDepts : polygones de la carte (départements)
		.defer(d3.csv,"data/coordVilles.csv") //coordonnées des vills ciblées  
		.defer(d3.csv,"data/Nombre_tirages.csv") //données par année (sur le tirage et le nombre de titres) 
		.defer(d3.csv,"data/quotidiens.csv") //données par quotidien (nom, aire de diffusion, groupe, changement de nom....)
		.defer(d3.csv,"data/textes.csv") //textes sur les dates commentées
		.await(callback0);


	function callback0(error, geoDepts, geoVilles, dataT, dataQ, dataTxt){ //recap : geo depts - villes - tirage - noms quotidiens - textes
		dataQuot = dataQ; //stockage dans les variables globales : permet de ne charger les données qu'une fois
		dataTir = dataT; //idem
		dataTextes = dataTxt; //idem
		
		var projection = d3.geo.albers() //définition de la projection  : carte centrée manuellement, l'échelle est définie en variabe globale
			.center([2.3,46.8])
			.rotate([0, 0])
			.parallels([43, 62])
			.scale(scale)
		
		var path = d3.geo.path() 
			.projection(projection);
		
		var map = d3.select("#graph") //groupe contenant la carte
			.append("g")
			.attr("id", "carte")
			.attr("class","discret")
			.attr("transform",function(){ //réglage par rapport au rectangle défini dans les repères
				var x = document.getElementById("emprise_carte_france").attributes.x.value;
				var y = document.getElementById("emprise_carte_france").attributes.y.value;
				return "translate("+x*1.5+","+y*12+")" //??? indicateurs définis manuellement en fait : a régler
			})
		
		var depts = map.selectAll(".dept") //implémentation des départements
			.data(topojson.feature(geoDepts,
				geoDepts.objects.nuts3).features)
			.enter()
			.append("path")
			.attr("d", path) 
			.attr("fill","#FFFFFF")
			.attr("stroke","#FFFFFF")
			.attr("stroke-width",0.1)
			.attr("code", function(d){ //code
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
			.attr("transform",function(){ //décalage de la corse
				if(this.id == "d2A"||this.id=="d2B"){
					return "translate(-60,25)"
				}
			})
			.attr("class","dept")

			
		var gVilles = map.selectAll(".gVille") //groupe contenant les socles et les ronds des quotidiens : à transformer en barre
			.data(geoVilles) //contiendra les données nécessaire à la position et aux évènement des objets circle et journal
			.enter()
			.append("g")
			.attr("class", "gVille")
			.attr("Ville", function(d){
				return d.Ville
			})
			.on("mouseover",function(){
				ville = this.attributes.Ville.value;
				d3.select("#titre_navi").text(ville);
				affVille(ville);
			})
			.on("mouseout",function(){
				ville = this.attributes.Ville.value;
				d3.select("#titre_navi").text("NAVIGATION");
				delVille(ville);
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
					return "translate(-60,25)"
				}
			})
			
			
		var socles = map.selectAll(".gVille") //socles
			.append("line")
			.attr("Ville", function(d){ //nécessite le nom de la ville
				return d.Ville
			})
			.attr("id", function(d){
				return "socle_"+d.Ville
			})
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
			.attr("stroke-width",strokeQuot*0.5)
			.attr("stroke",nuancier[2])
			.style("cursor","crosshair")
			
		// var barres = map.selectAll(".gVille") //barres
			// .append("rect")
			// .attr("x", function(d) {
				// return projection([d.cX, d.cY])[0] - widthBarres*0.5
			// })
			// .attr("y", function(d) {
				// return parseFloat(projection([d.cX, d.cY])[1]);
			// })
			// .attr("y0", function(d) {
				// return parseFloat(projection([d.cX, d.cY])[1]);
			// })
			// .attr("width", widthBarres)
			// .attr("height", 0)
			// .attr("class", "barres")
			// .attr("ville",  function(d){
				// return d.Ville
			// })
			// .attr("id", function(d){
				// return "b_"+d.Ville
			// })
			// .attr("stroke","#000000")
			// .attr("stroke-width",strokeQuot)
			// .attr("fill",function(d){
				// if(d.Ville=="National"){
					// return nuancier[1]
				// } else {
					// return nuancier[0]
				// }
			// })
			
			
		//trait corse
		p1 = projection([8.5,43.5])
		p2 = projection([6.5,42.2])
		map.append("line")
			.attr("x1",p1[0])
			.attr("y1",p1[1])
			.attr("x2",p2[0])
			.attr("y2",p2[1])
			.attr("stroke-width",strokeQuot/4)
			.attr("stroke-dasharray","10,10")
			.attr("stroke",nuancier[2])
			
		//espace survol
		var indvX = (document.getElementById("expli_titres").attributes.transform.value).split(" ")[4]; //récupéré dans les repères
		var indvY = ((document.getElementById("expli_titres").attributes.transform.value).split(" ")[5]).split(")")[0]; //idem : ! transform de type matrix
		d3.select("#villes_survol").selectAll(".indicsCarte")
			.data([["#CCCCCC",45,"ind_avant"],["#000000",50,"ind_main"],["#CCCCCC",45,"ind_apres"]]) //indicateurs permettant de voir les autres quotidiens de la ville (précedent et suivant)
			.enter()
			.append("text")
			.attr("x",indvX)
			.attr("y",function(d,i){
				var val = indvY-i*70+70 //70 : espace entre les textes
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

		d3.select("#villes_survol")
			.selectAll(".trrr") //petits traits entre les noms
			.data([[],[]])
			.enter()
			.append("line")
			.attr("x1",indvX)
			.attr("x2",indvX)
			.attr("x3",indvX*1+500) //à récupérer pour la transformation ; lorsqu'ils se déclenchent, ils apparaissent en modifiant le x2
			.attr("y1",function(d,i){
				var val = indvY-i*70+18
				return val;
			})
			.attr("y2",function(d,i){
				var val = indvY-i*70+18
				return val;
			})
			.attr("stroke","#000000")
			.attr("stroke-width",1)
			.attr("class","trrr")
		
		///emplacement texte
		var texteX = (document.getElementById("emplacement_texte").attributes.xx.value)*100/widthGraph;
		var texteY = (document.getElementById("emplacement_texte").attributes.yy.value)*100/heightGraph;
		d3.select("#innercarte")
			.append("div")
			.attr("id","text_dates")
			.style("margin-left",texteX+"%")
			.style("margin-top",texteY+"%")
			.attr("class","discret")
			.style("position","absolute")
			.append("p")
			.attr("id","titre_explisdate")
			.style("margin-left","5%")
			.style("margin-top","0%")
			.style("font-weight","600")
			.style("font-size","18px")
			.style("color","#111111")
			
		d3.select("#text_dates")
			.append("p")
			.style("margin-top","-5%")
			.attr("id","txt_explisdate")
			.style("font-size","13px")
			.style("font-style","italic")
		
		///legende
		d3.select("#elt_titre_loc")
			.attr("fill",nuancier[0])
			.attr("opacity",0.8)
			.attr("width",widthBarres)
		
		d3.select("#elt_titre_nat")
			.attr("fill",nuancier[1])
			.attr("opacity",0.8)
			.attr("height",heightBarres)
		
		d3.select("#legende").selectAll(".elt_dep")
			.data(valsChoro)
			.enter()
			.append("rect")
			.attr("x",document.getElementById("rep_elt_0").attributes.x.value)
			.attr("y",function(d,i){
				var rep = document.getElementById("rep_elt_0").attributes.y.value;
				var h = document.getElementById("rep_elt_0").attributes.height.value;
				return rep*1+h*i*1.7
			})
			// .attr("stroke",nuancier[2])
			.attr("width",document.getElementById("rep_elt_0").attributes.width.value)
			.attr("height",document.getElementById("rep_elt_0").attributes.height.value)
			.attr("fill",function(d,i){
				return nuancierChoro[i]
			})
			.attr("class","elt_dep")
			.attr("display",function(d){
				if(d==0){
					return "none"
				} else {
					return ""
				}
			})

		d3.select("#legende").selectAll(".labs_dep")
			.data(valsChoro)
			.enter()
			.append("text")
			.attr("x",document.getElementById("rep_elt_0").attributes.x.value*1 + 70)
			.attr("y",function(d,i){
				var rep = document.getElementById("rep_elt_0").attributes.y.value;
				var h = document.getElementById("rep_elt_0").attributes.height.value;
				return rep*1+h*(i*1+0.5)*1.7
			})
			.attr("font-size",50)
			.text(function(d,i){
				return valsChoroLeg[i]
			})
			.attr("display",function(d){
				if(d==0){
					return "none"
				} else {
					return ""
				}
			})
			.attr("class","labs_dep")
		
		///sources
		d3.select("#indicateurs")
			.append("rect")
			.attr("class","lev")
			.attr("id","fond_source")
			.attr("width",widthGraph)
			.attr("height",300)
			.attr("y",heightGraph)
			.attr("x",0)
			.attr("fill","#FFFFFF")
			.attr("opacity",0.95)
			
		
		d3.select("#indicateurs")
			.append("text")
			.attr("id","src_plus")
			.attr("font-size",45)
			.attr("opacity",0)

		d3.select("#src_plus")
			.selectAll(".ll")
			.data(["(Allier,Ardèche, Aveyron, Calvados, Bas-Rhin, Cantal, Charente, Corse du Sud, Dordogne, Doubs, Gard, Haute-Corse, Haute-Vienne, Haut-Rhin, Hérault, ","Île-et-vilaine, Indre, Isère, Loire-Atlantique, Loiret, Marne, Moselle, Nord, Pyrénées-Atlantiques, Pyrénées-Orientales, Saône-et-Loire, Seine-Maritime, Tarn, Var, Vienne, Puy-de-Dôme)"])
			.enter()
			.append("tspan")
			.attr("x",20)
			.attr("y",function(d,i){
				return i*50 + 2200
			})
			.text(function(d){
				return d
			})
			.attr("class","ll")
			
		d3.select("#indicateurs")
			.append("text")
			.attr("id","src_fix")
			.attr("class","lev")
			.attr("font-size",45)
			.append("tspan")
			.attr("x",20)
			.attr("y",2190)
			.text("Sources : 'Le tirage des quotidiens d'information générale et politique de 1945 à 2014', Ministère de la Culture et de la Communication | Bibliothèque Nationale de France")
		
		d3.select("#src_fix")
			.selectAll(".sp")
			.data([["Archives départementales (",0,""],["+",505,"plus_source"],[")",535,""]])
			.enter()
			.append("tspan")
			.attr("x",function(d){
				return d[1]*1+20
			})
			.attr("y",2240)
			.text(function(d){
				return d[0]
			})
			.attr("class","sp")
			.attr("id",function(d){
				return d[2]
			})

			
		
		d3.select("#plus_source")
			.attr("font-weight",800)
			.style("cursor","pointer")
			.on("click",function(){
				if(mode_legende==true){
					mode_legende=false;
					d3.select(this).text("+")
					d3.selectAll(".lev")
						.transition()
						.duration(800)
						.attr("transform","")
					
					d3.select("#src_plus")
						.transition()
						.duration(800)
						.attr("opacity",0)
				} else {
					mode_legende = true;
					d3.select(this).text("-")
					d3.selectAll("#src_fix")
						.transition()
						.duration(800)
						.attr("transform","translate(0,-105)")
					
					d3.selectAll("#fond_source")
						.transition()
						.duration(800)
						.attr("transform","translate(0,-265)")
					
					d3.select("#src_plus")
						.transition()
						.duration(800)
						.attr("opacity",1)
				}
				
			})
			
		///espace groupes
		var rep_debX = document.getElementById("groupe_ex").attributes.x.value;
		var rep_debY = document.getElementById("groupe_ex").attributes.y.value;
		// var esp_gr_x = 250; //a déplacer en variable globale
		var esp_gr_y = 83; //a déplacer en variable globale
		
		for(i=0;i<nomsGroupes.length;i++){
			d3.select("#indicateurs")
				.append("g")
				.attr("font-size",47)
				.attr("id_liste",i)
				.attr("id","groupe_num"+i)
				.attr("class","nomgroupe")
				.attr("nom",nomsGroupes[i])
				.attr("lock","false")
				.attr("cliquable","false")
				.on("mouseover",function(){
					var tst=this.attributes.cliquable.value;
					if(tst=="true"){
						var id_liste = this.attributes.id_liste.value; //en mettant i direct il va pas vouloir
						var nb = listeGroupes[nomsGroupes[id_liste]][0]
						if(nb>0){
							var li_quot = listeGroupes[nomsGroupes[id_liste]][1]
							var nom = this.attributes.nom.value;
							// d3.select("#ind_groupe").text(nom+" : "+nb+" quotidien(s) possédé(s) | "+li_quot)
							d3.selectAll(".titre_barres")
								.attr("stroke",nuancier[3])
								.attr("stroke-width",function(){
									var nm = this.attributes.titre.value;
									if((listeGroupes[nomsGroupes[id_liste]][1]).indexOf(nm)>=0){
										return 8
									} else {
										return 0
									}
								})
						}
					}
					
					
				})
				.on("mouseout",function(){
					var tst=this.attributes.cliquable.value;
					if(tst=="true"){
						var lock = this.attributes.lock.value;
						if(lock=="false"){
							d3.selectAll(".nomgroupe").select("text").attr("font-weight",400)
							d3.selectAll(".titre_barres")
							.attr("stroke-width",0)
						}
					}
				})
				.on("click",function(){
					var lock = this.attributes.lock.value;
					var tst=this.attributes.cliquable.value;
					if(tst=="true"){
						if(lock=="false"){
							d3.selectAll(".nomgroupe").attr("lock","false").select("text").attr("font-weight",400)
							d3.select(this).attr("lock","true").select("text").attr("font-weight",800)
						} else {
							d3.select(this).attr("lock","false").select("text").attr("font-weight",400)
						}
					}
				})
				.attr("x",rep_debX)
				.attr("y",function(){
					return i*esp_gr_y + parseFloat(rep_debY);
				})
				.append("text")
				.attr("x",rep_debX)
				.attr("y",function(){
					return i*esp_gr_y + parseFloat(rep_debY);
				})
				.text(nomsGroupes[i])
				
		}		
		
		// .attr("class","titre_barres")
				// .attr("titre",listeVilles[id][1][j])
				
				
		//fonctions secondaire de construction thématiques et graphiques
		test(geoVilles) //permet de voir si toutes les villes de la BD sont géoréférencées
		buildListes(geoVilles);
		buildGraph(); //graph et tout le reste
		
		//mise à jour avec les valeur de départ, soit la date 1945
		calc();
		// majBarres(); 
		majVilles();
		majDepts();
		majGraph();
	}
}

/////////////////////////////////////////////////    Fonctions secondaires
///animation et interactivités - appelées dans 'actions'
function dragWheel(){ //fonction drag  à commenter une fois réparée
	var drag = d3.behavior.drag()
	.on("drag", function(d) {
		///définition de l'angle formé par le curseur avec le centre de la roue
		var centrex = document.getElementById("roue_0").attributes.centrex.value; //centre dans le svg (x)
		var centrey = document.getElementById("roue_0").attributes.centrey.value; //centre dans le svg (y)
		var wpage = document.getElementById("innercarte").offsetWidth; //taille effective de la fenêtre carte (largeur)
		var xpage = document.getElementById("innercarte").offsetLeft; //position effective de la fenêtre carte (x)
		posX = (widthGraph/wpage)*(dragX-xpage); //position effective du curseur pour déterminer l'angle (x)
		
		ypage = document.getElementById("innercarte").offsetTop; //position effective de la fenêtre carte (y)
		posY = (widthGraph/wpage)*(dragY-ypage)+4; //position effective du curseur pour déterminer l'angle (y)
		angle = getDeg(Math.atan((posY-centrey)/(posX-centrex))); //angle déterminé par a fonction tangente
		///
		
		///maj par rapport aux QUARTS DE CERCLES : la fonction tangente renvoie une valeur entre -90 et 90
		//sens non-trigo
		if(posX-centrex<0){ //à gauche du cercle
			angle = parseFloat(angle)+180;
			d3.select("#testcoul").attr("stroke","yellow") //tests si probleme : à virer à la fin (l'objet testcoul n'existe plus)
		}else { //droite du cercle
			d3.select("#testcoul").attr("stroke","red")
			if(posY-centrey<0){ //haut (!) du cercle
				angle = parseFloat(angle)+360;
				d3.select("#testcoul").attr("stroke","green")
			}
		}
		///
		
		///ajout des tours (passage du zéro)
		var add = parseFloat(angle)+360*tours-ancAngle; //(!)la variable angleOk (parseFloat(angle)+360*tours) sera implémentée une fois que le nombre de tour aura été mis à jour
		if((posY-centrey)*ancY<0&&(posX-centrex)>0){ //si on passe la ligne du nouveau tour (si on change le signe de la valeur en y ET si on se trouve dans la partie droite)

			if(add>0){ //détermine le sens du passage de la ligne
				tours = parseFloat(tours)-1
			} else {
				tours = parseFloat(tours)+1
			}
		} 
		angleOk = parseFloat(angle)+360*tours;  //la variable angleOk puet ainsi être mise à jour avec le nouvel angle et le nouveau nombre de tour
	
		///mis à jour des variables repère
		ancAngle = angleOk;
		ancY = posY-centrey; //sert pour le nombre de tour : détermine le pasage de la ligne 0/360
		///
		
		///mise à jour de la variable date
		date = anneeMin*1 + parseInt(angleOk/45);
		
		///boutons et bloquage des valeurs min et max
		if(add>0){
			d3.select("#reculer").attr("class","mdSimple cliquable").attr("opacity",1); //on rend forcément 'avancer' cliquable
			d3.select("#reculer").attr("opacity",1); //idem label
		} else if (add<0){
			d3.select("#avancer").attr("class","mdSimple cliquable").attr("opacity",1); //on rend forcément 'avancer' cliquable
			d3.select("#avancer").attr("opacity",1); //idem label
		}
		if (date>anneeMax){
			angleOk = (anneeMax - anneeMin)*45 ;
			date = anneeMax;
			d3.select("#avancer").attr("class","mdSimple").attr("opacity",0.2); //on vire cliquable lorsque c'est la date minimale
			d3.select("#label_avancer").attr("opacity",0.2); //idem label
		} else if (date<anneeMin){
			angleOk = 0;
			date = anneeMin;
			d3.select("#reculer").attr("class","mdSimple").attr("opacity",0.2); //on vire cliquable lorsque c'est la date minimale
			d3.select("#label_reculer").attr("opacity",0.2); //idem label
		}
		///
		
		///actions
		d3.select(this).style("cursor","grabbing");
		
		//mise à jour de la carte
		vitAnim=0; //doit être nulle : les transitions de la carte et du grapj ralentissent considérablement en sélection manuelle
		tourne(angleOk,true);
		
		// d3.selectAll(".gVille").attr("display","none")
		calc();
		majGraph();
		// majVilles();
		majDepts();
		///
		
	})
	.on("dragend", function(d){
		tours = angleOk/360 - (angleOk%360)/360; //par sécurité : si bloquage

		d3.select(this).style("cursor","grab");
		// d3.selectAll(".gVille").attr("display","block")
		// majVilles();
	})
		
	//on applique le drag à l'objet souhaité : ici la manivelle
	d3.select("#drag0").data([ {"a":0,"y":0}]).attr("transform","rotate(0 311.5 184.3)") //les data ne servent à rien en fait
		.call(drag).style("cursor","grab")
}

function tourne(indic,bool){ //animation des rouages
	if(bool==false){ //sélection non-manuelle
		d3.select("#drag0").style("display","none") //évite que l'on puisse tourner pendant l'animation
		d3.selectAll(".tourne")
		.attr("class","tourne active") //animation-iteration-count (pas utile : a virer)
		.style("animation",function(){
			if(this.attributes.sens.value=="false"){//sens non trigo
				var ss = "tourneD "
			} else {
				var ss= "tourneG "
			}
			//on détermine une vitesse et non un temps, qui es tlissé : c'es tla vitesse qui montre le nombre d'années parcouru : l'animation s'arrête au bout de Vitanim
			var vit = (vitAnim/(indic/360 - (indic%360)/360))/1000; //vitAnim/nb tour   ->/1000 car c en secondes en css
			//ponderation de la vitesse par rapport a la taille des roues (avec vitesse 1 pour la roue_0)
			var r_base = document.getElementById("roue_0").attributes.r.value;
			var r_obj = this.attributes.r.value;
			var vitpon = vit*r_base/r_obj //plus rayon est grand, plus la transtion met du temps (ici vit=duration)
			
			
			return ss+vit+"s linear"
		})
		.style("animation-iteration-count","infinite")
		.style("transform-origin",function(){
			if(this.attributes.centrex){
				var cx = this.attributes.centrex.value;
				if(this.attributes.centrey){
					var cy= this.attributes.centrey.value;
					return cx+"px "+cy+"px"
				} else {
					alert(this.id)
				}
			}			
		})
		
	} else {
		
	d3.selectAll(".tourne") //sélection manuelle
		.attr("transform",function(){
			var cx = this.attributes.centrex.value;
			var cy = this.attributes.centrey.value;
			var sens = this.attributes.sens.value;
			
			//ponderation de la vitesse par rapport a la taille des roues (avec vitesse 1 pour la roue_0)
			var r_base = document.getElementById("roue_0").attributes.r.value;
			var r_obj = this.attributes.r.value;
			var vitpon = indic*r_base/r_obj //plus le rayon est grand, plus l'angle à parcourir est petit(car ca va moins vite)
			
			if(sens=="false"){
				var quot = 1;
			} else {
				var quot = -1;
			}
			return "rotate("+vitpon*quot+" "+cx+" "+cy+")"
		})
	}
}

function stop(a){ //stope l'animation (css) : en sélection non-manuelle,
	d3.select("#drag0").style("display","block") //rendu non cliquable lor de l'animation
	d3.selectAll(".tourne")
		.attr("class","tourne")
		.style("animation","")
		.style("animation-iteration-count","")
		.style("transform-origin","")
		.attr("transform",function(){ //lapart de angleOk hors tour : évite que la manivelle se remette en position 0, ce qui fausse la date également
				var cx = this.attributes.centrex.value;
				var cy = this.attributes.centrey.value;
				var sens = this.attributes.sens.value;
				var vit = this.attributes.vitesse.value;
				if(sens=="false"){
					var quot = 1;
				} else {
					var quot = -1;
				}
				return "rotate("+a+" "+cx+" "+cy+")"
			})
}

///construction graphique - appelées dans 'initMap'
function buildGraph(){		
	////espace de travail : basé sur le rectangle "emprise courbe de repères"
	d3.select("#arriere")
		.append("svg")
		.attr("id","svgCourbes")
		.attr("x",xMin) //valeur de emprise_courbe
		.attr("y",yMax) //idem
		.attr("viewBox","0 0 "+w+" "+h) //idem
		.style("overflow","visible") //l'emprise est autour des courbes, les axes dépassent
		.attr("width",w) //valeurs de emprise_courbe
		.attr("height",h) //valeurs de emprise_courbe
	
	////axes
	//axe y
	var rep_hori = []
	for(i=0;i<(nbLines*1+1);i++){  //implémentation de la liste des valeurs de l'axe horizontal
		var pas_line_tir = maxTir/nbLines*i; 
		var pas_line_tit = maxTit/nbLines*i;
		rep_hori.push([pas_line_tir,pas_line_tit])
	}
	var pasAnnee = 10; //indication des années
	
	d3.select("#svgCourbes")  //lignes de repérage à l'endroit des valeurs y
		.append("g")
		.attr("id","linecourbe")
		.selectAll(".lineshori")
		.data(rep_hori)
		.enter()
		.append("line")
		.attr("id",function(d,i){
			"repLine"+i
		})
		.attr("stroke","url(#gradient_lines)")
		.attr("stroke-width",3)
		.attr("x1",-100)
		.attr("x2",function(d,i){
			if(i==rep_hori.length-1){ //on inverse : les valeurs sont dans l'ordre croissant donc de bas en haut
				return w - 4*pasAnnee*w/ampli //pour les deux valeurs d'en haut, on coupe manuellement à l'endroit de l'esacler
			}
			if(i==rep_hori.length-2){
				return w - 3*pasAnnee*w/ampli
			}
			else{
				return w;
			}
		})
		.attr("y1",function(d,i){
			return h-i*h/nbLines
		})
		.attr("y2",function(d,i){
			return h-i*h/nbLines
		})
		.attr("valtir",function(d,i){ //au cas où mette une fonction au survol, les valeurs sont attribuées aux lignes
			return d[0]
		})
		.attr("valtit",function(d,i){
			return d[1]
		})
		.attr("class","lineshori")
	
	d3.select("#svgCourbes")  //valeurs du tirage
		.selectAll(".repTir")
		.data(rep_hori)
		.enter()
		.append("text")
		.attr("class","repTir")
		.attr("font-size",40)
		.text(function(d,i){
			if(i >= rep_hori.length-2) {
				return ""
			} else {
				return d[0]/1000000
			}
		})
		.attr("y",function(d,i){
			return h-i*h/nbLines+10
		})
		.attr("x",function(d){
			if(d[0]==10000000){
				return -165
			} else {
				return - 140;
			}
		})
		
	// d3.select("#svgCourbes")
		// .append("text")
		// .attr("class","rep0")
		// .attr("font-size",40)
		// .text("0")
		// .attr("y",h*1+50)
		// .attr("x",-125)
		
	d3.select("#svgCourbes")  //valeurs des titres
		.selectAll(".repTit")
		.data(rep_hori)
		.enter()
		.append("text")
		.attr("class","repTit")
		.attr("font-size",40)
		.text(function(d,i){
			if(i == rep_hori.length-1) {
				return ""
			} else {
				return d[1]
			}
		})
		.attr("y",function(d,i){
			return h-i*h/nbLines + 10
		})
		.attr("x",-90)
	
	
	
	d3.select("#svgCourbes") //axe Y
		.append("line")
		.attr("x1",-100)
		.attr("x2",-100)
		.attr("y1",0)
		.attr("y2",h)
		.attr("stroke-width",2)
		.attr("stroke","#000000")
		
	d3.select("#svgCourbes")  //lignes des valeurs de l'axe y
		.selectAll(".traits_y")
		.data(rep_hori)
		.enter()
		.append("line")
		.attr("class","traits_y")
		.attr("font-size",40)
		.attr("x1",-93)
		.attr("x2",function(d,i){
			if(i == rep_hori.length-2) {
				return -100
			} else {
				return -108
			}
		})
		.attr("y1",function(d,i){
			return h-i*h/nbLines
		})
		.attr("stroke-width",1.5)
		.attr("stroke","#000000")
		.attr("y2",function(d,i){
			return h-i*h/nbLines
		})
		.attr("opacity",function(d,i){
			if(i == rep_hori.length-1) {
				return 0
			} else {
				return 1
			}
		})
	
	////courbes
	var YNt = h - (dataTir[0].NAT_Nb_titres*echTit); //première valeur titres nationaux
	var YLt = h - (dataTir[0].LOC_Nb_titres*echTit); //première valeur titres locaux
	var cheminNAT_tit = "M"+0+"," + YNt; //début du chemin des titres nationaux
	var cheminLOC_tit = "M"+0+"," + YLt; //début du chemin des titres locaux
	
	var YNr = h - (dataTir[0].NAT_Tirages*echTir); //première valeur  du tirage national
	var YLr = h - (dataTir[0].LOC_Tirages*echTir); //première valeur du tirage local
	var cheminNAT_tir = "M"+0+"," + YNr; //début du chemin du tirage national
	var cheminLOC_tir = "M"+0+"," + YLr; //début du chemin du tirage local
	
	for(i=1;i<ampli;i++){ //bouclage pour chaque année
		if(dataTir[i]){ //si les data existent dans le fichier csv : permet de donner une date maximale supérieure aux données (idem pr le min)
			var valNt = dataTir[i].NAT_Nb_titres; //récupération de la valeur (x4)
			var valLt = dataTir[i].LOC_Nb_titres;
			cheminNAT_tit = cheminNAT_tit + " L"+parseFloat(0+i*pasX)+","+parseFloat(h-valNt*echTit); //implémentation du chemin (x4)
			cheminLOC_tit = cheminLOC_tit + " L"+parseFloat(0+i*pasX)+","+parseFloat(h-valLt*echTit);
			
			var valNr = dataTir[i].NAT_Tirages;
			var valLr = dataTir[i].LOC_Tirages;
			cheminNAT_tir = cheminNAT_tir +" L"+parseFloat(0+i*pasX)+","+parseFloat(h-valNr*echTir);
			cheminLOC_tir = cheminLOC_tir +" L"+parseFloat(0+i*pasX)+","+parseFloat(h-valLr*echTir);
		}
	}
	
	d3.select("#svgCourbes").selectAll(".courbe") //implémentation des courbes par rapport aux paths récupérés
		.data([[cheminLOC_tit,nuancier[0]],[cheminNAT_tit,nuancier[1]],[cheminLOC_tir,nuancier[4]],[cheminNAT_tir,nuancier[5]]])
		.enter()
		.append("path")
		.attr("d", function(d){
			return d[0]
		})
		.attr("stroke",function(d){
			return d[1]
		})
		.attr("stroke-width",3)
		.attr("stroke-linejoin","round")
		.attr("stroke-linecap","round")
		.attr("fill","none")
	
	////repères de mise à jour (date) 
	d3.select("#svgCourbes") //cache des courbes
		.append("rect")
		.attr("id","cache_graph")
		.attr("x",0)
		.attr("y",0)
		.attr("width",w*1.08)
		.attr("height",h*1.03)
		.attr("fill","#FFFFFF")
		.attr("opacity",0.7)
		
	d3.select("#svgCourbes")//ligne qui se déplace sur la date
		.append("line")
		.attr("id","barre_date") 
		.attr("stroke",nuancier[2])
		.attr("stroke-width",1)
		.attr("stroke-dasharray","5,5")
		.attr("x1",0)
		.attr("x2",0)
		.attr("y1",0)
		.attr("y2",h)
	
	d3.select("#svgCourbes").selectAll(".suiv") //petits cercles qui suivent les courbes et la date
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
		.attr("r",8)
		.attr("class","suiv")
		.attr("fill",function(d){
			return d[1]
		})
	
	//axe x (positionné devant le cache)
	var escalier = [0,0,0,0,1,2,2,2]; // !!! à implémenter manuellement, donne la position des marches de l'escalier (ne concerne que les dates écrites, pas tous les repères)
	for(j=0;j<ampli;j+=pasAnnee*0.5){ //bouclage dans l'amplitude en fonction du bas (/2 pour les repères non-légendé, tous les 5 ans)
		if(j%2==0){
			d3.select("#svgCourbes") //textes /10
				.append("text")
				.attr("font-size",40)
				.attr("font-weight",600)
				.attr("x",j*w/ampli-15)
				.attr("y",function(){
					var decl = -22;
					if(escalier[j/pasAnnee]){
						var val = decl+escalier[j/pasAnnee]*h/nbLines
						return val
					}
					else {
						return decl
					};
				})
				.text(anneeMin*1+j*1)
				.attr("id","dd_"+(anneeMin*1+j*1))
				.attr("class","rp_d")
		}
			
		d3.select("#svgCourbes") //traits /5
			.append("line")
			.attr("stroke-width",2)
			.attr("x1",j*w/ampli)
			.attr("x2",j*w/ampli)
			.attr("y1",0)
			.attr("y1",function(){
				var decl = 0;
				if(escalier[parseInt(0.5+(j/pasAnnee))]){
					var val = decl-15+escalier[parseInt(0.5+(j/pasAnnee))]*h/nbLines;
					return val
				} else {
					return decl
				};
			})
			.attr("y2",function(){
				var decl = 15;
				if(escalier[parseInt(0.5+(j/pasAnnee))]){
					var val = decl-15+escalier[parseInt(0.5+(j/pasAnnee))]*h/nbLines;
					return val
				} else {
					return decl*(-1)
				};
			})
			.attr("stroke","#000000")
			.attr("stroke-width",function(){
				if(j%2==0){
					return 2
				}else{
					return 1
				}
			})
			.attr("id","tt_"+(anneeMin*1+j*1))
			.attr("class","rp_d")
			
	//labelY (par dessuss le rect)		
		d3.select("#svgCourbes")
			.selectAll(".repindic")
			.data([["Tirage",-240,0,600,42],["(millions)",-250,50,400,35],["Nombre de titres",-90,0,600,42]])
			.enter()
			.append("text")
			.attr("class","repindic")
			.attr("y",function(d){
				return d[2]*1+35
			})
			.attr("x",function(d){
				return d[1]
			})
			.attr("font-size",function(d){
				return d[4]
			})
			.attr("font-weight",function(d){
				return d[3]
			})
			.text(function(d){
				return d[0]
			})
	}
}

function buildListes(geo){ //implémentation des listes qui vont être mises à jour par la fonction calc
	for(i=0;i<geo.length;i++){
		nomsVilles.push(geo[i].Ville)
		listeVilles[geo[i].Ville] = [0, [],[],[],[]]
	}
	for(j=0;j<nomsDepts.length;j++){
		listeDept[nomsDepts[j]] = [0, []]
	}
	for(k=0;k<nomsGroupes.length;k++){
		listeGroupes[nomsGroupes[k]] = [0,[]]
	}
}

function test(geo){
	for(i=0;i<dataQuot.length;i++){
		vi = dataQuot[i].villeOk;
		var tst = false;
		
		for(j=0;j<geo.length;j++){
			if(geo[j].Ville==vi){
				tst = true;
			}
		}
		if(tst==false){
			alert("Erreur (les coordonées ne sont pas référencées) : "+vi)
		}
	}
}

/////////////////////////////////////////////////    Fonctions de mise à jour par date
function calc(){
	d3.select("#ind_date")//affichage de la date
		.html(date)
		
	///affichage des textes en fonction de la date antérieure la plus proche
	var dateTexte; 
	var titreTexte;
	var texteTexte;
		
	for(da=0;da<listeDates.length;da++){
		if(date >= listeDates[da]){
			dateTexte = listeDates[da]
			titreTexte = dataTextes[da]["titre_partie"]
			texteTexte = dataTextes[da]["texte_partie"]
			
		}	
		if(listeDates[da] != dataTextes[da]["date"]){
			alert("Erreur textes - dates")
		}
	}
	d3.select("#titre_explisdate")
		.html(dateTexte+" | "+titreTexte)	
	d3.select("#txt_explisdate")
		.html(texteTexte)
	
	///calcul des valeurs
	//initialisation
	for (i=0; i<dataQuot.length; i++){	
		var idVille = dataQuot[i].villeOk;
		listeVilles[idVille][0] = 0;
		listeVilles[idVille][1] = [];
		listeVilles[idVille][2] = [];
		listeVilles[idVille][3] = [];
		listeVilles[idVille][4] = [];
		
	}
	for (k=0; k<nomsDepts.length; k++){	
		var idDe = nomsDepts[k];
		if(listeDept[idDe]){
			listeDept[idDe][0] = 0;
			listeDept[idDe][1] = [];
		} 
		
	}
	for (l=0; l<nomsGroupes.length; l++){	
		var idGr = nomsGroupes[l];
		if(listeGroupes[idGr]){
			listeGroupes[idGr][0] = 0;
			listeGroupes[idGr][1] = [];
		}
	}
	//mise à jour
	for (j=0; j<dataQuot.length; j++){
		if (dataQuot[j].Annee >= date && dataQuot[j].Deb_ann <= date){
			var idVille = dataQuot[j].villeOk;
			listeVilles[idVille][0] ++; //nombre de quotidiens par ville
			listeVilles[idVille][1].push(dataQuot[j].titreok_1); //liste des quotidiens dans une ville
			var string = dataQuot[j].Liste_entites; //aires de diffusion
			var liste = string.split(",");
			listeVilles[idVille][2].push(liste); //compte par ville (par quotidien en fait : retrouvé parleur index)
			if (liste[0]&&liste[0]!="none"&&liste[0]!="National"){ //compte du nobmrede de quotidiens par départements
				for(p=0;p<liste.length;p++){	
					var id = liste[p];
					// alert(id)
					if(listeDept[id]){
						// alert(listeDept[id])
						listeDept[id][0] ++;
					} 
					
				}
			}
			if(dataQuot[j].date_groupe <= date){ //groupes
				listeVilles[idVille][3].push(dataQuot[j].appartenance_affiliation_edition)
				if(listeGroupes[dataQuot[j].appartenance_affiliation_edition]){
					listeGroupes[dataQuot[j].appartenance_affiliation_edition][0] ++;
					listeGroupes[dataQuot[j].appartenance_affiliation_edition][1].push(dataQuot[j].titreok_1);
				}
			} else {
				listeVilles[idVille][3].push("")
			}
			listeVilles[idVille][4].push(dataQuot[j].source_erreur);
			
		}
	}
}

function majBarres(){ //a refaire fonctionner
	for(i=0;i<nomsVilles.length;i++){
		var id = nomsVilles[i];
		// taille des barres
		d3.select("#b_"+id)
			.transition()
			// .delay(100)
			.duration(1000)
			.attr("y", function(){
				var newH = heightBarres*listeVilles[id][0];
				var ancY = this.attributes.y0.value;
				var val = parseFloat(ancY - newH);
				return val;
			})
			.attr("height", function(){
				return heightBarres*listeVilles[id][0]
			});	
		
		d3.select("#socle_"+id)
			.attr("opacity",function(){
				if(listeVilles[id][0]==0){
					return 0
				} else {
					return 1
				}
			})
	}
}

var seuil = 450;

function majVilles(){ //mise à jour des barres, boules et aussi des groupes
	d3.selectAll(".titre_boules").remove();
	d3.selectAll(".titre_barres").remove();
	for(i=0;i<nomsVilles.length;i++){ //bouclage dans les villes
		var id = nomsVilles[i];
		var nbQuot = listeVilles[id][0];
		
		//mise à jour des socles
		if(nbQuot == 0){
			d3.select("#socle_"+id).attr("display","none")
		} else {
			d3.select("#socle_"+id).attr("display","")
		}
		
		//mise à jour des barres/boules
		for(j=0;j<nbQuot;j++){ //bouclage dans la liste des quotidiens de chaque liste
			//id = ville
			d3.select("#gr_"+id)
				.append("g") //on met les objet dans un g pour que le journal comme le rond soit cliquable (meme si ca ne marche pas trop)
				.attr("id","quot"+id+j)
				.attr("class","titre_barres")
				.style("cursor","crosshair")
				// .attr("class","titre_boules")
				// .style("display","none")
				.attr("titre",listeVilles[id][1][j])
				.attr("diff",listeVilles[id][2][j])
				.attr("source",listeVilles[id][4][j])
				.attr("rang",j)
				.attr("ville",id)
				.on("mouseover",function(){
					var n = j;
					affQuot(this.attributes.titre.value,this.attributes.diff.value,this.attributes.ville.value,this.attributes.rang.value,this)
					//paramètres : nom du Titre, liste des départements de l'aire de diffusion, nom de la ville, rang dans la liste, objet
				})
				.on("dblclick",function(){
					var src = this.attributes.source.value;
					if(src.split(":")[0]=="http"){
						window.open(src,"","",false)
						// window.location=src;
					} else if (src.split("_")[0]=="archives"){
						dep = src.split("_")[1]  //au cas où
						alert("Informations obtenues au près du service départemental d'archives")
					}
				})
				.on("mouseout",function(){
					var n = j;
					delQuot(this.attributes.ville.value,n,this);
				})
				.append("rect")
				
				
				.attr("titre",listeVilles[id][1][j])
				.attr("x", document.getElementById("gr_"+id).attributes.cX.value -widthBarres/2)
				.attr("y",document.getElementById("gr_"+id).attributes.cY.value - (j*1+1)*heightBarres*1.1)
				.attr("width",widthBarres)
				.attr("height",heightBarres)
				.attr("fill",function(){
					if(id=="National"){
						return nuancier[1]
					} else {
						return nuancier[0]
					}
				})
				.attr("fill-opacity",0.8)
				
			var dessin = document.getElementById("journal_dessin").innerHTML; //on récupère dans les repères le dessin du petit journal
			var posx = document.getElementById("gr_"+id).attributes.cX.value - widthBarres*0.75; //la position x et y, un peu différente de celle des cercles
			var posy = document.getElementById("gr_"+id).attributes.cY.value - (j*1+1)*heightBarres*1.1
			
			d3.select("#quot"+id+j) //ajout du journal invisible par dessus les cercles
				.append("g")
				.attr("id","journ_"+id+j)
				.attr("transform","translate("+posx+","+posy+")")
				.attr("opacity",0)
				.attr("class","journ")
				.html(dessin)	
		}
	}

	//mise à jour des groupes
	d3.selectAll(".journ_groupe").remove()
	tst_nb = 0;
	d3.selectAll(".nomgroupe")
		.each(function(){
			var x = this.attributes.x.value;
			var y = this.attributes.y.value;
			var nom = this.attributes.nom.value;
			
			var nb = listeGroupes[nom][0];
			if(nb==0){
				d3.select(this).attr("opacity",0.2).style("cursor","default").attr("cliquable","false")
			} else {
				tst_nb++;
				d3.select(this).attr("opacity",1).style("cursor","crosshair").attr("cliquable","true")
				var dessin = document.getElementById("journal_dessin").innerHTML; //on récupère dans les repères le dessin du petit journal
				var eca = 3.5
				for(i=0;i<nb;i++){
					d3.select(this)
						.append("g")
						.attr("transform",function(){
							X = x*1+(nb-i)*eca-50-eca*nb;
							Y = y*1+(nb-i)*eca-40-eca*nb;
							return "translate("+X+","+Y+")"
						})
						.attr("opacity",0.6)
						.attr("class","journ_groupe")
						.html(dessin)
				}
			}
		})
	if(tst_nb==0){
		d3.select("#groupe_sstitre").attr("display","none")
	} else {
		d3.select("#groupe_sstitre").attr("display","block")
	}
}

function majDepts(){ //mise à jour de la carte choro des départements
	d3.selectAll(".dept")
		.transition()
		.duration(vitAnim)
		.attr("fill",function(){
			var code = this.attributes.code.value;
			if(code){
				var val = listeDept[code][0];
				for(i=0;i<valsChoro.length;i++){
					if(val >= valsChoro[i]){
						coul = nuancierChoro[i]
					}
				}
				return coul
			}
		})
}

function majGraph(){ //mise à jour des courbes
	var vB = w*(date-anneeMin)/ampli; //position dans le graph par rapport à la géomtrie du graph
	var itD = date-anneeMin; //numéro de ligne dans les données
	if(dataTir[itD]){
		//tout va bien
	} else {
		itD = dataTir.length-1; //on reste à la date maximale pour ne pas faire d'erreur dans le tableau
	}
	var valNt = dataTir[itD].NAT_Nb_titres; //récupération des valeurs
	var valLt = dataTir[itD].LOC_Nb_titres;
	var valNr = dataTir[itD].NAT_Tirages;
	var valLr = dataTir[itD].LOC_Tirages;
	var listeH= [(h-valLt*echTit),(h-valNt*echTit),(h-valLr*echTir),(h-valNr*echTir)]; //liste des hauteurs pour les cercles : on inverse car on va du haut vers le bas
	var ids = ["Lt","Nt","Lr","Nr"]; //liste des noms
	
	d3.select("#barre_date") //on déplace la barre selon la date
		.transition()
		.duration(vitAnim)
		.attr("x1",vB)
		.attr("x2",vB)
		
	d3.select("#cache_graph") //pareil
		.transition()
		.duration(vitAnim)
		.attr("width",w*1.09-vB)
		.attr("x",vB)
		
	// d3.select("#partie_graphique")
		// .transition()
		// .duration(vitAnim)
		// .attr("transform",function(){
			// val = w-vB;
			// return "translate(-"+val+",0)"
		// })
	
	for(i=0;i<ids.length;i++){ //on déplace tous les cercles selon leur valeur 
		d3.select("#ci_"+ids[i])
			.attr("cx",vB)
			.attr("cy",listeH[i])	
	}
	
	d3.selectAll(".rp_d") //allumage des valeurs de l'axe X en fonction de la date
		.transition()
		.duration(vitAnim)
		.attr("opacity",function(){
			var d = (this.id).split("_")[1]
			if(d<=date){
				return 1
			} else {
				return 0.4
			}
		})	
}


/////////////////////////////////////////////////    Fonctions d'affichage par quotidiens
function affQuot(titre,diff,ville,n,obj){ //affichage au survol des cercles représentatns les titres
	//paramètres : nom du Titre, liste des départements de l'aire de diffusion, nom de la ville, rang dans la liste, objet
	var lsDep = diff.split(","); //liste départements de l'airede de diffusion
	for(i=0;i<lsDep.length;i++){ //allumage des départements concernés
		d3.select("#d"+lsDep[i])
			.attr("class","dept hightlight")
	}
	
	//mise à jour de l'esapce contenant les noms
	d3.select("#ind_avant").text(listeVilles[ville][1][n-1]) //noms
	d3.select("#ind_main").text(listeVilles[ville][1][n])
	d3.select("#ind_apres").text(listeVilles[ville][1][n*1+1])
	d3.selectAll(".trrr").transition().duration(500).attr("x2",function(){ //traits
		var val = this.attributes.x3.value
		return val;
	})
	
	d3.select("#partie_ponctuelle") //suppression temporaire de la légende concernant le survol des ronds
		.transition()
		.duration(500)
		.attr("opacity",0)
		
	d3.select("#titre_navi") //le titre Navigation prend le nom de la ville concernée
		.attr("opacity",0)
		.transition()
		.duration(500)
		.attr("opacity",1)
		.text(ville)
	
	d3.select(obj).select(".journ").attr("opacity",0.75) //on allume le ptit journal pour éteindre le cercle
	d3.select(obj).select("circle").attr("opacity",0)
	
	//surbrillance du groupe 
	groupe = listeVilles[ville][3][n]
	if(groupe){
		idG = nomsGroupes.indexOf(groupe)
		d3.select("#groupe_num"+idG)
			.attr("font-weight",800)
	}
	
}

// for(i=0;i<nomsGroupes.length;i++){
			// d3.select("#indicateurs")
				// .append("text")
				// .attr("x",rep_debX)
				// .attr("y",function(){
					// return i*esp_gr_y + parseFloat(rep_debY);
				// })
				// .text(nomsGroupes[i])
				// .attr("font-size",47)
				// .attr("id_liste",i)
				// .attr("id","groupe_num"+i)
				// .attr("class","nomgroupe")
				// .attr("nom",nomsGroupes[i])
				// .on("mouseover",function(){
					// var id_liste = this.attributes.id_liste.value; //en mettant i direct il va pas vouloir
					// var nb = listeGroupes[nomsGroupes[id_liste]][0]
					// if(nb>0){
						// var li_quot = listeGroupes[nomsGroupes[id_liste]][1]
						// var nom = this.attributes.nom.value;
						// d3.select("#ind_groupe").text(nom+" : "+nb+" quotidien(s) possédé(s) | "+li_quot)
						
						// d3.selectAll(".titre_barres")
							// .attr("stroke",nuancier[3])
							// .attr("stroke-width",function(){
								// var nm = this.attributes.titre.value;
								// if((listeGroupes[nomsGroupes[id_liste]][1]).indexOf(nm)>=0){
									// return 8
								// } else {
									// return 0
								// }
							// })
					// }
					
				// })
				// .on("mouseout",function(){
					// d3.selectAll(".titre_barres")
						// .attr("stroke-width",0)
				// })
function delQuot(ville,n,obj){ //init de la fonction précédente
	d3.selectAll(".hightlight").attr("class","dept") //département d'aire de diffusion
	
	d3.selectAll(".trrr").transition().duration(500).attr("x2",function(){ //suppression des traits de l'espace noms
		var val = this.attributes.x1.value;
		return val;
	})
	
	d3.select("#partie_ponctuelle") //réapparition de la légende
		.transition()
		.duration(500)
		.attr("opacity",1)
	
	d3.select("#titre_navi") //initialisation de 'Navitation' -> le fait de l'éteindre permet que la transofrmation prenne le même temps que les autres
		.attr("opacity",0)
		.transition()
		.duration(500)
		.attr("opacity",1)
		.text("NAVIGATION")
	
	d3.select(obj).select(".journ").attr("opacity",0) //disparition du journal et réapparition du cercle
	d3.select(obj).select("circle").attr("opacity",1)
	
	//surbrillance du groupe 
	d3.selectAll(".nomgroupe")
		.attr("font-weight",400)
}

function affVille(){
	// d3.select("#gr_"+ville)
		// .selectAll(".titre_boules")
		// .style("display","block")
	
	// d3.select("#gr_"+ville)
		// .selectAll(".titre_barres")
		// .style("display","none")
	
	// d3.select("#b_"+ville)
		// .style("display","none")
}

function delVille(){
	// d3.select("#gr_"+ville)
		// .selectAll(".titre_boules")
		// .style("display","none")
		
	// d3.select("#gr_"+ville)
		// .selectAll(".titre_barres")
		// .style("display","block")
		
	// d3.select("#b_"+ville)
		// .style("display","block")
}

/////////////////////////////////////////////////    Fonctions d'affichage par quotidiens

function getDeg(a){ //retourne un angle en degrés
	return 180 * (a) / Math.PI 
}
