///--------------------Variables géométriques

var reducteur = 170,
co_fl_x=1.6,
co_fl_y=1,
contourflech=0.9,

///--------------------Variables logiques
data0=[],
data1=[],
datedebut=1987,
datefin=2018,
dateA=datedebut,
annees=[],
vit=1000,
id_fleche=0,
ray=7,
// ls_pays=["Albania","Andorra","Austria","Belarus","Belgium","Bosnia_and_Herzegovina","Bulgaria","Croatia","Cyprus","Czech_Republic","Denmark","Estonia","Finland","France","Germany","Greece","Holy_See","Hungary","Iceland","Ireland","Italy","Latvia","Liechtenstein","Lithuania","Luxembourg","Macedonia_FYR","Malta","Moldova","Monaco","Montenegro","Netherlands","Norway","Poland","Portugal","Romania","Russia","San_Marino","Serbia","Slovak_Republic","Slovenia","Spain","Sweden","Switzerland","Ukraine","United_Kingdom"];
ls_pays=[];


///--------------------Action au chargement
window.onload = initialize();

///--------------------Fonctions
function initialize(){
	queue()											
		.defer(d3.csv,"data/all_links.csv")
		.await(callback0); 
	
	function callback0(error, datacsv){
		data0 = datacsv;
		data();
		build_dessins();
		
		first=ls_pays[getRandomInt(ls_pays.length)];
		
		build_fleches(first)
	}
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function build_dessins(){
	d3.select("#rep_cercles")
		.selectAll("path")
		.each(function(){
			// var fill = this.attributes.fill.value;
			var ID = "c_"+this.id;
			var X = ((this.attributes.d.value).split("M")[1]).split(",")[0];
			var Y = (((this.attributes.d.value).split("M")[1]).split(",")[1]).split("C")[0];
			d3.select("#place_cercles").append("circle").attr("cx",X).attr("cy",Y).attr("id",ID).attr("r",0).attr("opacity",0.3).attr("fill","#ffffff");
			
			
		})
	// for(i=0;i<ls_pays.length;i++){
		// pays = ls_pays[i];
		// d3.select("#cont2")
			// .append("input")
			// .attr("type","button")
			// .attr("pays",pays)
			// .attr("value",pays)
			// .on("click",function(){
				// var val = this.attributes.pays.value;
				// build_fleches(val)
			// })
		
	// }
	
	d3.selectAll(".click_pays")
		.style("cursor","pointer")
		.attr("pays",function(){
			var p = (this.id).split("_")[1];
			return p;
		})
		.on("click",function(){
			var val = this.attributes.pays.value;
			build_fleches(val)
		})
		.on("mouseover",function(){
			
			var val = this.attributes.pays.value;
			d3.select("#c_"+val) //cercles
				.attr("r",0)
				.attr("opacity",0.8)
				.transition()
				.duration(200)
				.attr("r",ray)
				.attr("opacity",0.3)
			
			// d3.select(this)
				// .transition()
				// .duration(200)
				// .attr("opacity",0.3)
				
		})
		.on("mouseout",function(){
			var val = this.attributes.pays.value;
			d3.select("#c_"+val) //cercles
				.attr("r",ray)
				.attr("opacity",0.3)
				.transition()
				.duration(200)
				.attr("r",0)
				.attr("opacity",0.8)
			
			// d3.select(this)
				// .transition()
				// .duration(200)
				// .attr("opacity",0)
		})
}


function build_fleches(pays){
	///effacement lignes d'avant
	d3.selectAll(".line4").remove();
	d3.selectAll(".line3").attr("class","line4").attr("opacity",0.2)
	d3.selectAll(".line2").attr("class","line3").attr("opacity",0.4)
	d3.selectAll(".line1").attr("class","line2").attr("opacity",0.6)
	d3.selectAll(".line0").attr("class","line1").attr("opacity",0.8)
	
	///nouvelles lignes
	
	
	var dataDate = data0[ls_pays.indexOf(pays)];
	console.log(dataDate);
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
		val = valeurs_ok[v];
		if(val>30000){
			
			x01 = document.getElementById("c_"+pays.toLowerCase()).attributes.cx.value;
			y01 = document.getElementById("c_"+pays.toLowerCase()).attributes.cy.value;
			
			
			
			if(document.getElementById("c_"+pays1.toLowerCase())){
				x02 = document.getElementById("c_"+pays1.toLowerCase()).attributes.cx.value;
				y02 = document.getElementById("c_"+pays1.toLowerCase()).attributes.cy.value;
				
				///épaisseur de la fleche
				if(val>1000000){
					var stW = 7;
				}else if(val>600000){
					var stW = 5;
				} else if(val>200000){
					var stW = 4;
				} else {
					var stW = 2;
				}
				
				///identifiant de la flèche
				id_fleche=id_fleche*1+1;
		
				///Modification des coordonnées d'arrivées et de départ (x01->x1) en tenant compte d'un rayon 'ray' autour des centroides des pays
				taille0=Math.sqrt((x01-x02)*(x01-x02)+(y01-y02)*(y01-y02));
				dx=x02-x01;
				dy=y02-y01;
				
				x1=x01*1+(dx*(ray/taille0));
				y1=y01*1+(dy*(ray/taille0));
				x2=x02-(dx*((ray*1+stW*co_fl_y)/taille0)); //pour l'arrivée on tient compte du bout de la fleche en plus (ajustement au bout : voir commentaires suivants)
				y2=y02-(dy*((ray*1+stW*co_fl_y)/taille0)); //ajsutement : co_fl_y pour la auteur du bout et co_fl_x pour sa largeur, multipliés par l'épaisseur de la flèche
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
				
				d3.select("#place_fleches").append("g").attr("id","g_"+id_fleche).attr("class","line0");
				
				// d3.select("#g_"+id_fleche)
					// .append("polyline").attr("transform","rotate("+angle+" "+x1+" "+y1+")")
					// .attr("stroke","#DAD9D3")
					// .attr("stroke-width",contourflech)
					// .attr("fill","none")
					// .attr("points",(x1*1+stW*0.5)+","+(y1*1-taille+stW*co_fl_y)+" "+x1+","+y1+" "+(x1-stW*0.5)+","+(y1-taille+stW*co_fl_y))
					// .attr("opacity",0)
					// .transition()
					// .delay(vit)
					// .duration(vit)
					// .attr("opacity",1)
				
				d3.select("#g_"+id_fleche).append("g").attr("id","fl_"+id_fleche).attr("transform","translate("+x1+","+y1+")")
					.append("polygon").attr("transform","rotate("+angle+")")
					// .attr("points",(stW*-co_fl_x)+","+(stW*co_fl_y)+" "+(stW*co_fl_x)+","+(stW*co_fl_y)+" 0,"+(stW*-co_fl_y))  //sans ajustement au bout
					.attr("points",(stW*-co_fl_x)+","+(stW*co_fl_y)+" "+(stW*co_fl_x)+","+(stW*co_fl_y)+" 0,"+(stW*co_fl_y*-1))
					.attr("fill","red")
					.attr("stroke","#DAD9D3")
					.attr("stroke-width",contourflech)
					
				d3.select("#place_fleches")
					.select("defs")
					.append("clipPath")
					.attr("id","cp_"+id_fleche)
					.append("polygon").attr("transform","rotate("+angle+" "+x1+" "+y1+")")
					// .attr("points",x1+","+y1+" "+(x1*1+stW*0.5)+","+(y1*1-taille)+" "+(x1-stW*0.5)+","+(y1-taille)) //sans ajustement au bout
					.attr("points",x1+","+y1+" "+(x1*1+stW*0.5)+","+(y1*1-taille)+" "+(x1-stW*0.5)+","+(y1-taille))
					// .attr("fill","blue")
					// .attr("opacity",0.5);
				
				//points de controle à -3
				controle=taille*0.4;
				
				d3.select("#g_"+id_fleche)
					// .append("line")
					// .attr("x1",x1).attr("y1",y1).attr("x2",x1).attr("y2",y1)
					// .attr("clip-path","url(#cp_"+id_fleche+")")
					.append("path")
					///Pour la ligne arrondi
					// .attr("d","M "+x1+" "+y1+" C"+(x1-controle)+" "+(y1-controle*0.5)+","+(x1-controle)+" "+(y1-taille+controle*0.5)+","+x1+" "+(y1-taille))
					///Pour le clip-path arrondi
					.attr("d","M "+x1+" "+y1+" C"+(x1-controle)+" "+(y1-controle*0.5)+","+(x1-controle)+" "+(y1-taille+controle*0.5)+","+x1+" "+(y1-taille)+"h "+stW+" C"+(x2*1+stW*1-controle)+" "+(y1-taille+controle*0.5)+","+(x2*1+stW*1-controle)+" "+(y1-controle*0.5)+","+x1+" "+y1)
					.attr("transform","rotate("+angle+" "+x1+" "+y1+")")
					.attr("stroke-dasharray","0,100")
					.attr("stroke-width",stW).attr("stroke","red")
					.attr("stroke-width",0.5).attr("stroke","red")
					// .attr("fill","red")
					.transition()
					.duration(vit)
					// .attr("x2",x2).attr("y2",y2)
					.attr("stroke-dasharray","100,0")
					
				
					
				
				d3.select("#fl_"+id_fleche)
					.transition()
					.duration(vit)
					.attr("transform","translate("+x2+","+y2+")")
					
			} else {
				d3.select("#cont2")
					.append("p")
					.attr("class","plus_"+pays)
					.html(pays+" : "+pays1)
			}
			
		}
	}
	
}

function data(){
	
		for(i=0;i<data0.length;i++){
			console.log(data0[i].origine);
			if(ls_pays.indexOf(data0[i].origine)==-1){
				ls_pays.push(data0[i].origine)
			} 
		}
}