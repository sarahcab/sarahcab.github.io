///--------------------Variables géométriques

var reducteur = 170,
co_fl=2,
contourflech=0.9,

///--------------------Variables logiques
data0=[],
datatrad=[],
data1=[],
datedebut=1987,
datefin=2018,
dateA=datedebut,
annees=[],
vit=1000,
id_fleche=0,
ray=5,
X_pays_autres=25,
Y_pays_autres=-60,
cercle_pays_autres=180,
// ls_pays=["Albania","Andorra","Austria","Belarus","Belgium","Bosnia_and_Herzegovina","Bulgaria","Croatia","Cyprus","Czech_Republic","Denmark","Estonia","Finland","France","Germany","Greece","Holy_See","Hungary","Iceland","Ireland","Italy","Latvia","Liechtenstein","Lithuania","Luxembourg","Macedonia_FYR","Malta","Moldova","Monaco","Montenegro","Netherlands","Norway","Poland","Portugal","Romania","Russia","San_Marino","Serbia","Slovak_Republic","Slovenia","Spain","Sweden","Switzerland","Ukraine","United_Kingdom"];
ls_pays=[],
paysActu=[],
ls_pays_autre=[],
ls_pays_tout=[],
ls_pays_trad=[];


///--------------------Action au chargement
window.onload = initialize();

///--------------------Fonctions
function initialize(){
	queue()											
		.defer(d3.csv,"data/all_links_30000_7.csv")
		.defer(d3.csv,"data/traductions.csv")
		.await(callback0); 
	
	function callback0(error, datacsv,trad){
		data0 = datacsv;
		datatrad=trad;
		data();
		build_dessins();
		boutons();
		mer();
		pas();
		// first=ls_pays[getRandomInt(ls_pays.length)];
		
		// build_fleches(first)
	}
}

function boutons(){
	d3.select("#raz")
		.style("cursor","pointer")
		.on("mouseover",function(){
			d3.select(this).select("#blop")
				.attr("opacity",0)
				.transition()
				.duration(300)
				.attr("opacity",0.4)
		})
		.on("mouseout",function(){
			d3.select(this).select("#blop")
				.attr("opacity",0.4)
				.transition()
				.duration(300)
				.attr("opacity",0)
		})
		.on("click",function(){
			d3.select("#place_fleches")
				.selectAll("g")
				.attr("opacity",1)
				.transition()
				.duration(400)
				.attr("opacity",0)
				.remove();
			
			d3.select("#place_fleches")
				.select("defs")
				.selectAll("clipPath")
					.transition()
				.duration(400)
				.remove();
			
		})
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function build_dessins(){
	d3.select("#rep_cercles")
		.selectAll("path")
		.each(function(){
			var ID = "c-"+this.id;
			var ID2 = "t-"+this.id;
			
			var paysOk=ls_pays_trad[ls_pays_tout.indexOf(this.id)];
			
			var X = ((this.attributes.d.value).split("M")[1]).split(",")[0];
			var Y = (((this.attributes.d.value).split("M")[1]).split(",")[1]).split("C")[0];
			
			d3.select("#place_cercles").append("circle").attr("cx",X).attr("cy",Y).attr("id",ID).attr("r",0).attr("opacity",0.3).attr("fill","#ffffff");
			d3.select("#place_cercles").append("text").attr("id",ID2).attr("opacity",0)
				.attr("x",X*1+ray).attr("y",Y*1+2.5).text(paysOk).attr("font-size",6.5);
		})
		
	for(i=0;i<ls_pays_autre.length;i++){
		if(ls_pays_autre[i]!="russie"){
			var ID = "c-"+ls_pays_autre[i];
			var ID2 = "t-"+ls_pays_autre[i];
			var paysOk=ls_pays_trad[ls_pays_tout.indexOf(ls_pays_autre[i])];
			
			var X = X_pays_autres;
			var Y = Y_pays_autres;
			
			var angle = 15+52*i/(ls_pays_autre.length-1);
			angle=angle*Math.PI/180;
			X1=X*1+Math.sin(angle)*cercle_pays_autres
			Y1=Y*1+Math.cos(angle)*cercle_pays_autres
			
			d3.select("#place_cercles").append("circle").attr("cx",X1).attr("cy",Y1).attr("id",ID).attr("r",ray*0.8).attr("stroke","#ffffff").attr("fill","#EDEDED")
			
			d3.select("#place_cercles").append("text").attr("id",ID2).attr("opacity",1).attr("x",function(){
				var val=(ls_pays_autre[i]).length*2;
				return X1-val;
			}).attr("y",Y1-ray).text(paysOk).attr("font-size",6.5).attr("font-style","italic");
		}else {
			X=310;
			Y=115;
			d3.select("#place_cercles").append("circle").attr("cx",X).attr("cy",Y).attr("id","c-russie").attr("r",ray*0.8).attr("stroke","#ffffff").attr("fill","#EDEDED")
			
			d3.select("#place_cercles").append("text").attr("id","t-russie").attr("opacity",1).attr("x",function(){
				var val=(ls_pays_autre[i]).length*2.1;
				return X-val;
			}).attr("y",Y-ray*1.2).text("Russie").attr("font-size",6.5).attr("font-style","italic");
		}
	}
	
	d3.selectAll(".click-pays")
		.style("cursor","pointer")
		.attr("pays",function(){
			var p = (this.id).split("-")[1];
			return p;
		})
		.on("click",function(){
			var val = this.attributes.pays.value;
			build_fleches(val)
		})
		.on("mouseover",function(){
			var val = this.attributes.pays.value;
			
			d3.select("#c-"+val) //cercles
				.attr("r",0)
				.attr("opacity",0.8)
				.transition()
				.duration(200)
				.attr("r",ray)
				.attr("opacity",0.3)
			
			d3.select("#t-"+val)
				.transition()
				.duration(200)
				.attr("opacity",1)
		})
		.on("mouseout",function(){
			var val = this.attributes.pays.value;
			d3.select("#c-"+val) //cercles
				.attr("r",ray)
				.attr("opacity",0.3)
				.transition()
				.duration(200)
				.attr("r",0)
				.attr("opacity",0.8)
			
			d3.select("#t-"+val)
				.transition()
				.duration(200)
				.attr("opacity",0)
		})
}


function build_fleches(pays){
	if(paysActu.indexOf(pays)!=-1){
		paysActu.splice((paysActu.indexOf(pays)),1)
		///effacement lignes d'avant
		d3.selectAll(".line"+pays).remove();
		
		// d3.selectAll(".line1").attr("class","line0").attr("opacity",1)
		// d3.selectAll(".line2").attr("class","line1").attr("opacity",0.8)
		// d3.selectAll(".line3").attr("class","line2").attr("opacity",0.6)
		// d3.selectAll(".line4").attr("class","line3").attr("opacity",0.4)
	} else {
		paysActu.push(pays);
		///effacement lignes d'avant
		// d3.selectAll(".line4").remove();
		// d3.selectAll(".line3").attr("class","line4").attr("opacity",0.2)
		// d3.selectAll(".line2").attr("class","line3").attr("opacity",0.4)
		// d3.selectAll(".line1").attr("class","line2").attr("opacity",0.6)
		// d3.selectAll(".line0").attr("class","line1").attr("opacity",0.8)
		
		///nouvelles lignes
		if(pays.indexOf("_")!=-1){
			paysTx=pays.replace('_', ' ')
			if(paysTx.indexOf("_")!=-1){
				paysTx=paysTx.replace('_', ' ')
			}
		}else {
			paysTx=pays;
		}
		var dataDate = data0[ls_pays.indexOf(paysTx)];
		values=[];
		total_countries=[];
		
		var total_values = [];
		var valeurs_ok=[];
		var countries_ok=[];
		
		for(i in dataDate){
			if(i!="Origine"){
				if(parseInt(dataDate[i])){
					values.push(parseInt(dataDate[i]));
					total_values.push(parseInt(dataDate[i]));
					total_countries.push(i);
				}
				
			}
		}
		for(n=0;n<7;n++){
			valeurs_ok.push(Math.max(...values));
			values.splice((values.indexOf(Math.max(...values))),1)
		}
		
		// alert(valeurs_ok);
		for(v=0;v<valeurs_ok.length;v++){
			countries_ok.push(total_countries[total_values.indexOf(valeurs_ok[v])]);
			pays1 = total_countries[total_values.indexOf(valeurs_ok[v])];
			if(ls_pays.indexOf(pays1)!=-1){
				fillFleche="#D63517";
				if(pays1.indexOf(" ")!=-1){
					pays1=pays1.replace(' ', '_')
					if(pays1.indexOf(" ")!=-1){
						pays1=pays1.replace(' ', '_')
					}
				}
			} else {
				fillFleche="#931c3e";
			}
			val = valeurs_ok[v];
			if(val>30000){
				
				x01 = document.getElementById("c-"+pays.toLowerCase()).attributes.cx.value;
				y01 = document.getElementById("c-"+pays.toLowerCase()).attributes.cy.value;
				
				
				
				if(document.getElementById("c-"+pays1.toLowerCase())){
					x02 = document.getElementById("c-"+pays1.toLowerCase()).attributes.cx.value;
					y02 = document.getElementById("c-"+pays1.toLowerCase()).attributes.cy.value;
					
					///épaisseur de la fleche
					if(val>1000000){
						var stW = 8;
						co_fl_x=co_fl;
						co_fl_y=co_fl;
					}else if(val>600000){
						var stW = 4;
						co_fl_x=co_fl;
						co_fl_y=co_fl;
					} else if(val>200000){
						var stW = 3;
						co_fl_x=co_fl;
						co_fl_y=co_fl;
					} else {
						var stW = 1.5;
						co_fl_x=co_fl*0.5;
						co_fl_y=co_fl*0.5;
					}
					
					///identifiant de la flèche
					id_fleche=id_fleche*1+1;
			
					
					///Modification des coordonnées d'arrivées et de départ (x01->x1) en tenant compte d'un rayon 'ray' autour des centroides des pays
					taille0=Math.sqrt((x01-x02)*(x01-x02)+(y01-y02)*(y01-y02));
					dx=x02-x01;
					dy=y02-y01;
					
					x1=x01*1+(dx*(ray/taille0));
					y1=y01*1+(dy*(ray/taille0));
					x2=x02-(dx*((ray*1+stW*0.5+co_fl_y*1)/taille0)); //pour l'arrivée on tient compte du bout de la fleche en plus (ajustement au bout : voir commentaires suivants)
					y2=y02-(dy*((ray*1+stW*0.5+co_fl_y*1)/taille0)); //ajsutement : co_fl_y pour la auteur du bout et co_fl_x pour sa largeur, multipliés par l'épaisseur de la flèche
					// alert(x2+" "+x02)
					///Mesure pour assurer les transitions et dessins
					taille=Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2)) //taille du segment tracé
					angle=Math.atan((x1-x2)/(y1-y2))*180/Math.PI; //angle de rotation
					if(x2>x1&&y2>y1){ //angle trouvé entre 0 et 90 : adapter par rapport à la direction
						angle=angle*-1+180
					} else if(x2<x1&&y2>y1){
						angle=angle*-1-180
					} else {
						angle=angle*-1;
					}
					
					d3.select("#place_fleches").append("g").attr("id","g_"+id_fleche).attr("class","line"+pays);
					
					///contour
					d3.select("#g_"+id_fleche)
						.append("polyline").attr("transform","rotate("+angle+" "+x1+" "+y1+")")
						.attr("stroke","#DAD9D3")
						.attr("stroke-width",contourflech)
						.attr("fill","none")
						.attr("points",(x1*1+stW*0.5)+","+(y1*1-taille+stW*0.5)+" "+x1+","+y1+" "+(x1-stW*0.5)+","+(y1-taille+stW*0.5))
						.attr("opacity",0)
						.transition()
						.delay(vit)
						.duration(vit)
						.attr("opacity",1)
					
					///tête
					d3.select("#g_"+id_fleche).append("g").attr("id","fl_"+id_fleche).attr("stroke","#DAD9D3").attr("stroke-width",0).attr("transform","translate("+x1+","+y1+")")
						.append("polygon").attr("transform","rotate("+angle+")")
						// .attr("points",(stW*-co_fl_x)+","+(stW*co_fl_y)+" "+(stW*co_fl_x)+","+(stW*co_fl_y)+" 0,"+(stW*-co_fl_y))  //sans ajustement au bout
						.attr("points",(-stW/2-co_fl_x)+","+(stW*0.5+co_fl_y*1)+" "+(stW*0.5+co_fl_x*1)+","+(stW*0.5+co_fl_y*1)+" 0,"+(-stW*0.5-co_fl_y))
						.attr("fill",fillFleche)
						
						
					///masque pour l'effet pointu
					d3.select("#place_fleches")
						.select("defs")
						.append("clipPath")
						.attr("class","line"+pays)
						.attr("id","cp_"+id_fleche)
						.append("polygon").attr("transform","rotate("+angle+" "+x1+" "+y1+")")
						// .attr("points",x1+","+y1+" "+(x1*1+stW*0.5)+","+(y1*1-taille)+" "+(x1-stW*0.5)+","+(y1-taille)) //sans ajustement au bout
						.attr("points",x1+","+y1+" "+(x1*1+stW*0.5)+","+(y1*1-taille+stW*0.5)+" "+(x1-stW*0.5)+","+(y1-taille+stW*0.5))
						// .attr("fill","blue")
						// .attr("opacity",0.5);
					
					///corps de la flèche 
					d3.select("#g_"+id_fleche).append("line").attr("x1",x1).attr("y1",y1).attr("x2",x1).attr("y2",y1).attr("stroke-width",stW).attr("stroke",fillFleche)
						.attr("clip-path","url(#cp_"+id_fleche+")")
						.transition()
						.duration(vit)
						.attr("x2",x2).attr("y2",y2)
						
						
					///transition pour la tête de flèche
					d3.select("#fl_"+id_fleche)
						.transition()
						.duration(vit*0.97)
						.attr("transform","translate("+x2+","+y2+")")
						.transition()
						.delay(vit)
						.duration(vit)
						.attr("stroke-width",contourflech/2)
						
				} else {
					d3.select("#cont2")
						.append("p")
						.attr("class","plus_"+pays)
						.html(pays+" : "+pays1)
				}
				
			}
		}
		
	}
}

function data(){
	
		for(i=0;i<data0.length;i++){
			if(ls_pays.indexOf(data0[i].origine)==-1){
				ls_pays.push(data0[i].origine)
			} 
		}
		for(j in data0[0]){
			if(ls_pays.indexOf(j)==-1){
				if(j!="origine"){
					if(j!=""){
						ls_pays_autre.push(j)
					}
				}
			}
		}
		for(k=0;k<datatrad.length;k++){
			ls_pays_tout.push(datatrad[k].variable)
			ls_pays_trad.push(datatrad[k].litteral)
		}
		console.log(ls_pays_tout);
		console.log(ls_pays_trad);
}
function pas(){
	d3.select("#hors_europe").attr("class","paspas")
	d3.select("#pays_cliquables").attr("class","paspas")
	d3.select("#fixes").append("g").attr("id","place_pas")
	var ancX=0;
	var ancY=0;
	var itp=0;
	var cont=true; //régulateur
	var gauche =["M0,123.668c0.534-26.24,3.635-54.223,16.996-80.082 C24.16,29.721,33.861,18.062,47.059,9.511c22.273-14.431,44.854-11.887,63.239,7.255c13.819,14.388,21.013,32.197,25.624,51.186 c9.493,39.091,4.783,77.338-7.355,115.062c-2.138,6.646-4.439,13.26-7.079,19.72c-2.912,7.128-6.05,8.901-13.67,7.548 c-19.83-3.523-39.738-4.081-59.715-1.92c-7.76,0.84-15.495,2.075-23.164,3.537c-10.482,2-13.963-0.254-16.116-10.689 C3.7,176.372,0.178,151.357,0,123.668z","M21.646,267.26c12.761-1.664,24.943-3.277,37.132-4.838 c19.313-2.473,38.642-4.822,57.933-7.461c2.72-0.371,4.063-0.058,4.68,2.662c4.713,20.77,9.846,41.424,7.732,63.098 c-2.272,23.301-16.255,39.738-38.59,44.395c-24.625,5.133-45.652-4.442-56.794-25.814c-7.496-14.377-9.382-30.066-10.668-45.863 C22.382,284.992,22.134,276.51,21.646,267.26z"]
	var droite = ["M298.188,135.517c-1.526,12.622-4.033,33.761-6.676,54.882 c-0.576,4.606-1.297,9.248-2.552,13.704c-1.928,6.846-5.096,9.074-12.144,8.247c-10.064-1.182-20.024-3.36-30.105-4.254 c-17.612-1.563-35.219-1.733-52.703,2.038c-11.626,2.508-14.801,0.479-18.793-10.577c-6.727-18.629-13.146-37.328-16.354-56.992 c-3.783-23.209-1.962-46.113,2.792-68.958c3.876-18.627,10.177-36.23,21.708-51.571c19.406-25.821,48.104-29.239,73.231-8.726 c19.296,15.753,29.483,36.94,35.432,60.551C296.406,91.252,297.647,108.999,298.188,135.517z","M276.421,267.248c-1.52,21.725-1.541,42.804-8.453,62.926 c-6.861,19.977-19.676,33.723-41.605,35.948c-31.424,3.19-53.537-14.477-56.785-45.78c-2.311-22.268,1.943-44.022,8.074-65.812 C210.617,258.775,243.216,262.973,276.421,267.248z"]
	d3.select("#hors_europe")
		.on("mousemove",function(){
			X = d3.event.clientX/2.35;
			
			if(cont==true){
				console.log(ancX-X)
				if(itp%2==0){
					var data = gauche;
					trans=-100;
				}else {
					var data = droite;
					trans=100;
				}
				itp++;
				X = d3.event.clientX/2.35;
				Y = d3.event.clientY/2.35;
				d3.select("#place_pas")
					.append("g")
					.attr("opacity",0.7)
					.attr("transform","scale(0.01) translate("+(X*100+trans*1)+","+Y*100+")")
					.selectAll("path")
					
					.data(data)
					.enter()
					.append("path")
					.attr("d",function(d){
						return d
					})
					.attr("opacity",0.5)
					.attr("transform",function(){
						angle=Math.atan((X-ancX)/(Y-ancY))*180/Math.PI; 
						if(ancX>X&&ancY>Y){ 
							angle=angle*-1
						} else if(ancX<X&&ancY>Y){
							angle=angle*-1
						} else {
							angle=angle*-1-180;
						}
						return "rotate("+angle+" 149.094 184.452)"
					})
					.transition()
					.duration(120)
					.attr("opacity",1)
					.transition()
					.delay(1500)
					.duration(1500)
					.attr("opacity",0)
					.remove()
				
				ancX=X;
				ancY=Y;
				cont=false;
				setTimeout(function(){cont=true},70)
			}
			
			
			
		})
	
}

function mer(){
	var cont2=true; //régulateur
	
		d3.select("#fond")
			.on("mousemove",function(){
				if(cont2==true){
					console.log("hello");
					X = d3.event.clientX;
					Y = d3.event.clientY;
					margX=document.getElementById("dessin").style//["margin-left"];
					console.log(margX);
					for(i=0;i<3;i++){
						d3.select("#fond")
							.append("circle")
							.attr("cx",X/2.35)
							.attr("cy",Y/2.35)
							.attr("r",0)
							.attr("opacity",1)
							.attr("fill","none")
							.attr("stroke","#000000")
							.attr("stroke-width",0.1)
							.transition()
							.delay(i*100)
							.duration(1000)
							// .attr("r",5)
							// .transition()
							// .duration(700)
							.attr("r",10)
							.attr("opacity",0.1)
							.remove()
					}
					cont2=false;
					setTimeout(function(){cont2=true},100)
				}
			})
		
	
}
