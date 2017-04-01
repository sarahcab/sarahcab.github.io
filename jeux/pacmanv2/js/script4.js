var niveau = 1,
width = 600,
widthLab = width*0.9,
height = 620,
nbX = 0,
nbY = 0,
widthCase =0,
score=0,
vitesse = 100,
nbMonstres = 3,
t,
viesInit = 100,
vies = 100,
itson = 0;
nuancier = ["#000000","#DDDDDD","red","yellow","green", "#BBBBBB"]; //sol, murs, pacgum, pacman, barrevie, mort

window.onload = initialize();


function initialize() {
	buildSVG();
	buildLab(niveau);
}

function buildSVG(){
	var svg = d3.select("#jeu")
		.append("svg")
		.attr("width", width)
		.attr("height", height)
		.attr("id","svgJeu")
		
	var vi = svg.append("g")
		.attr("id","afficheVie")
	
	vi.append("text")
		.text("Vie :")
		.attr("x",+width*0.12)
		.attr("y",widthLab*1.13)
	
	vi.selectAll("rect")
		.data( [["barreMort",nuancier[5]],["barreVie",nuancier[4]]])
		.enter()
		.append("rect")
		.attr("x",widthLab*0.1+width*0.1)
		.attr("y",widthLab*1.1)
		.attr("width",widthLab*0.8)
		.attr("height",20)
		.attr("fill",function(d){
			return d[1]
		})
		.attr("id",function(d){
			return d[0]
		})
}

function buildLab(){
	delLab();
	queue()											
		.defer(d3.csv,"laby/lab"+niveau+".csv")
		.await(callback0); 
	
}

function delLab(){
	d3.select("#lab").remove();
	d3.select("#pacman").remove();
	d3.selectAll(".gum").remove();
	window.onkeypress = function(){
		alert("attends")
	}
	score = 0;
	vies = viesInit;
	d3.select("#vies").html("Vies : "+vies);
	d3.select("#score").html("Score : "+score);
	var nbGum = document.getElementsByClassName("gum").length;
	d3.select("#nb_gum").html("Nombre de Pac Gum à manger : "+nbGum)
	d3.selectAll(".monstres").remove();
	
	clearTimeout(t);
}

function callback0(error,dataLab){
	var it=0;
	var len = dataLab.length -1;
	nbX =dataLab[len].it_x;
	nbY =dataLab[len].it_y;
	widthCase = (widthLab)/nbX;
	var itTime = 0;

	////////////Méthode traditionnelle
	// for(i=0;i<nbX;i++){
		// for(j=0;j<nbX;j++){
			// it++;
			// d3.select("#lab")
				// .append("rect")
		// }
	// }
	
	d3.select("#svgJeu").append("g")
		.attr("id","lab")
	
	d3.select("#lab").selectAll(".case")
		.data(dataLab)
		.enter()
		.append("rect")
		.attr("width",widthCase)
		.attr("height",widthCase)
		.attr("id",function(d){
			return "c"+d.ID;
		})
		.attr("idData",function(d){
			return d.ID;
		})
		.attr("x",function(d){
			var larg = this.attributes.width.value;
			return d.it_x*larg + width*0.1;
		})
		.attr("y",function(d){
			var larg = this.attributes.width.value;
			return d.it_y*larg;
		})
		.attr("mur",function(d){
			if(d.mur=="true"){
				d3.select(this).attr("fill",nuancier[1]).attr("stroke",nuancier[0]).attr("class","case mur")
			} else {
				d3.select(this).attr("fill",nuancier[0]).attr("stroke",nuancier[0]).attr("class","case sol")
			}
			return d.mur;
		})
		
		
		
		d3.selectAll(".sol")
			.each(function(){
				var x = parseFloat(this.attributes.x.value) + widthCase/2;
				var y = parseFloat(this.attributes.y.value) + widthCase/2;
				var id = this.attributes.idData.value
				d3.select("#svgJeu")
					.append("circle")
					.attr("r",widthCase/10)
					.attr("cx",x)
					.attr("cy",y)
					.attr("fill",nuancier[2])
					.attr("id","g"+id)
					.attr("class","gum")
					// .attr("opacity",0)
					// .transition()
					// .duration(1000)
					// .delay(20*itTime)
					.attr("opacity",1)
					
					
				itTime++;
			})

		// setTimeout(function(){
			pacMan();
			monstre(niveau*nbMonstres)
		// },itTime*20);
		
}

function monstre(nb){
	var nbSol= document.getElementsByClassName("case sol").length;
	for(i=0;i<nb;i++){
		var itSol = parseInt(nbSol/(parseFloat(i)+1)-1);
		var x =document.getElementsByClassName("sol")[itSol].attributes.x.value;
		var y = document.getElementsByClassName("sol")[itSol].attributes.y.value;
		var ID = document.getElementsByClassName("sol")[itSol].attributes.idData.value;
		var nextCaseM = ID;
		pac = d3.select("#svgJeu").append("image")
			.attr("id","monstre"+i)
			.attr("case",nextCaseM)
			.attr("xlink:href","img/macron.png")
			.attr("x",0)
			.attr("y",0)
			.attr("class","monstres")
			.attr("width",widthCase)
			.attr("height",widthCase)
			.attr("transform","translate("+x+","+y+")")
	}
	
	permanent();
	
	
	
}

function permanent() {   
	var val = getRandomArbitrary(0,4);
	
	var nbm = niveau*nbMonstres;
	for(i=0;i<nbm;i++){
		var nextCaseM = document.getElementById("monstre"+i).attributes.case.value;
		nextCaseM = choix(nextCaseM,val);
		if(document.getElementById("c"+nextCaseM) && document.getElementById("c"+nextCaseM).attributes.class.value=="case sol"){
			bouge(nextCaseM,"monstre"+i);
			find = true;
		} 
		
	}
	
	t = setTimeout(function(){ permanent() }, vitesse);
}

function choix(nextCaseM,val){
	if(val==0){
		nextCaseM = nextCaseM - nbX-1;
	} else if(val==1){
		nextCaseM ++;
	} else if(val==2){
		nextCaseM = parseFloat(nextCaseM) + parseFloat(nbX) +1;
	} else if(val==3){
		nextCaseM = nextCaseM-1;
	}
	return nextCaseM
}


function getRandomArbitrary(min, max) {
	var val = Math.random() * (max - min) + min;
	return parseInt(val)
}

function pacMan(){
	var x = parseFloat(document.getElementsByClassName("sol")[0].attributes.x.value)+widthCase/2;
	var y = parseFloat(document.getElementsByClassName("sol")[0].attributes.y.value)+widthCase/2;
	var ID = document.getElementsByClassName("sol")[0].attributes.idData.value;
	var nextCase = ID;
	pac = d3.select("#svgJeu").append("g")
		.attr("id","pacman")
		.attr("case",nextCase)
		.attr("transform","translate("+x+","+y+")")
		
	pac.append("circle")
		.attr("fill",nuancier[3])
		.attr("cx",0)
		.attr("cy",0)
		.attr("r",widthCase/2.5)
		
	var ptX = 0+widthCase/2;
	var ptY1 = 0-widthCase/2;
	var ptY2 = 0+widthCase/2;
	pac.append("polygon")
		.attr("points",0+","+0+" "+ptX+","+ptY1+" "+ptX+","+ptY2)
		.attr("fill",nuancier[0])
		.attr("id","bouche")
		.attr("class","clignote")
	
	mange();
	window.onkeypress = function(e){
		var sens  = e.keyCode;
		if(sens==37){
			nextCase = nextCase - nbX-1;
			d3.select("#bouche").attr("transform","rotate(180)")
		} else if(sens==40){
			nextCase ++;
			d3.select("#bouche").attr("transform","rotate(90)")
		} else if(sens==39){
			nextCase = parseFloat(nextCase) + parseFloat(nbX) +1;
			d3.select("#bouche").attr("transform","")
		} else if(sens==38){
			nextCase = nextCase-1;
			d3.select("#bouche").attr("transform","rotate(270)")
		}
		if(document.getElementById("c"+nextCase).attributes.class.value=="case sol"){
			bouge(nextCase,"pacman")
		} else {
			nextCase = document.getElementById("pacman").attributes.case.value;
		}
		mange();
	}
	//////http://www.commentcamarche.net/faq/18760-javascript-manipulation-des-controles-clavier#evenements-du-clavier
}

function bouge(ca,obj){
	if(obj=="pacman"){
		var decal = widthCase
	} else {
		var decal = 0;
	}
	var x = parseFloat(document.getElementById("c"+ca).attributes.x.value)+decal/2; //on laisse le /2 ici sinon faut refaire un parseFLoat
	var y = parseFloat(document.getElementById("c"+ca).attributes.y.value)+decal/2;
	d3.select("#"+obj)
		.attr("case",ca)
		.attr("transform","translate("+x+","+y+")")
		
	var nb = niveau*nbMonstres;
	for(i=0;i<nb;i++){
		var casePac = document.getElementById("pacman").attributes.case.value;
		var caseMons = document.getElementById("monstre"+i).attributes.case.value;
		//si touche
		if(casePac==caseMons){
			touche();
		}
		
		//si voit
		if(document.getElementById("c"+caseMons)){
			var xP = document.getElementById("c"+casePac).attributes.x.value;
			var yP = document.getElementById("c"+casePac).attributes.y.value;
			var xM = document.getElementById("c"+caseMons).attributes.x.value;
			var yM = document.getElementById("c"+caseMons).attributes.y.value;
			if(xP==xM){
				d3.select("#monstre"+i)
					
					.transition()
					.duration(vitesse*8)
					.attr("transform","translate("+xM+","+yP+")")
					.attr("case",casePac)
			}
			if(yP==yM){
				d3.select("#monstre"+i)
					
					.transition()
					.duration(vitesse*8)
					.attr("transform","translate("+xP+","+yM+")")
					.attr("case",casePac)
			}
			setTimeout(function(){
				if(casePac==caseMons){
					touche();
				}
			},vitesse*8)
			
		}
		
	}
}

function touche(){
	itson ++;
	if(itson==4){
		itson = 0;
	}
	// document.getElementById("projet"+itson).currentTime = 0;
	// document.getElementById("projet"+itson).play();
	
	vies = vies -1;
	d3.select("#vies").html("Vies : "+vies)
	if(vies==0){
		alert("Perdu!")
		buildLab(niveau);
	}
	
	d3.select("#barreVie")
		.attr("width", function(){
			var totalW = document.getElementById("barreMort").attributes.width.value;
			return totalW*vies/viesInit;
		})
}

function fantome(){
		var casePac = document.getElementById("pacman").attributes.case.value;
		var caseFant = document.getElementById("fantome").attributes.case.value;
	//si voit
		var xP = document.getElementById("c"+casePac).attributes.x.value;
		var yP = document.getElementById("c"+casePac).attributes.y.value;
		var xM = document.getElementById("c"+caseMons).attributes.x.value;
		var yM = document.getElementById("c"+caseMons).attributes.y.value;
		if(xP==xM|| yP==yM){
			d3.select("#fantome")
				.attr("case",casePac)
				.transition()
				.duration(vitesse*3)
				.attr("transform","translate("+xP+","+yP+")")
		}
}

function mange(){
	var id = document.getElementById("pacman").attributes.case.value;
	if(document.getElementById("g"+id)){
		d3.select("#g"+id).remove();
		score++;
		d3.select("#score").html("Score : "+score)
	}
	var nbGum = document.getElementsByClassName("gum").length;
	d3.select("#nb_gum").html("Nombre de Pac Gum à manger : "+nbGum)

	if(document.getElementsByClassName("gum").length==0){
		niveau++;
		alert("Gagné!! Prochain niveau : "+niveau);
		buildLab(niveau);
	}
}