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
		.defer(d3.csv,"data/all_links_30000.csv")
		.defer(d3.csv,"data/traductions.csv")
		.await(callback0); 
	
	function callback0(error, datacsv,trad){
		data0 = datacsv;
		datatrad=trad;
		data();
		build_dessins();
		boutons();
		// first=ls_pays[getRandomInt(ls_pays.length)];
		
		// build_fleches(first)
	}
}

function boutons(){
	d3.select("#raz")
		.style("cursor","pointer")
		.on("mouseover",function(){
			d3.select(this).select("#blop")
				.attr("r",0)
				.transition()
				.duration(300)
				.attr("r",5)
		})
		.on("mouseout",function(){
			d3.select(this).select("#blop")
				.attr("r",5)
				.transition()
				.duration(300)
				.attr("r",0)
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
			// var fill = this.attributes.fill.value;
			var ID = "c-"+this.id;
			var ID2 = "t-"+this.id;
			
			var paysOk=ls_pays_trad[ls_pays_tout.indexOf(this.id)];
			// console.log(val+" "+paysOk);
			
			var X = ((this.attributes.d.value).split("M")[1]).split(",")[0];
			var Y = (((this.attributes.d.value).split("M")[1]).split(",")[1]).split("C")[0];
			
			d3.select("#place_cercles").append("circle").attr("cx",X).attr("cy",Y).attr("id",ID).attr("r",0).attr("opacity",0.3).attr("fill","#ffffff");
			d3.select("#place_cercles").append("text").attr("id",ID2).attr("opacity",0)
				.attr("x",X*1+ray).attr("y",Y*1+2.5).text(paysOk).attr("font-size",6.5);
		})
		
	for(i=0;i<ls_pays_autre.length;i++){
		var ID = "c-"+ls_pays_autre[i];
		var ID2 = "t-"+ls_pays_autre[i];
		var paysOk=ls_pays_trad[ls_pays_tout.indexOf(ls_pays_autre[i])];
		
		var X = X_pays_autres;
		var Y = Y_pays_autres;
		
		var angle = 10+52*i/ls_pays_autre.length;
		angle=angle*Math.PI/180;
		X1=X*1+Math.sin(angle)*cercle_pays_autres
		Y1=Y*1+Math.cos(angle)*cercle_pays_autres
		
		d3.select("#place_cercles").append("circle").attr("cx",X1).attr("cy",Y1).attr("id",ID).attr("r",ray*0.8).attr("stroke","#ffffff").attr("fill","#EDEDED")
		
		d3.select("#place_cercles").append("text").attr("id",ID2).attr("opacity",1).attr("x",function(){
			var val=(ls_pays_autre[i]).length*2;
			return X1-val;
		}).attr("y",Y1-ray).text(paysOk).attr("font-size",6.5).attr("font-style","italic");
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