///--------------------Variables géométriques

var reducteur = 170,
co_fl_x=1.8,
co_fl_y=0.9,

///--------------------Variables logiques
data0=[],
data1=[],
datedebut=1987,
datefin=2018,
dateA=datedebut,
annees=[],
vit=5000,
id_fleche=0,
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
		build_fleches('France')
	}
}

function build_dessins(){
	d3.select("#rep_cercles")
		.selectAll("path")
		.each(function(){
			// var fill = this.attributes.fill.value;
			var ID = "c_"+this.id;
			var X = ((this.attributes.d.value).split("M")[1]).split(",")[0];
			var Y = (((this.attributes.d.value).split("M")[1]).split(",")[1]).split("C")[0];
			d3.select("#place_cercles").append("circle").attr("cx",X).attr("cy",Y).attr("id",ID).attr("r",5).attr("opacity",0.3).attr("fill","red");
			
			
		})
	for(i=0;i<ls_pays.length;i++){
		pays = ls_pays[i];
		d3.select("#cont2")
			.append("input")
			.attr("type","button")
			.attr("pays",pays)
			.attr("value",pays)
			.on("click",function(){
				var val = this.attributes.pays.value;
				build_fleches(val)
			})
		
	}
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
		console.log(Math.max(...values));
		valeurs_ok.push(Math.max(...values));
		values.splice((values.indexOf(Math.max(...values))),1)
	}

	for(v=0;v<valeurs_ok.length;v++){
		countries_ok.push(total_countries[total_values.indexOf(valeurs_ok[v])]);
		pays1 = total_countries[total_values.indexOf(valeurs_ok[v])];
		val = valeurs_ok[v];
		if(val>30000){
			
			x1 = document.getElementById("c_"+pays.toLowerCase()).attributes.cx.value;
			y1 = document.getElementById("c_"+pays.toLowerCase()).attributes.cy.value;
			
			
			
			if(document.getElementById("c_"+pays1.toLowerCase())){
				x2 = document.getElementById("c_"+pays1.toLowerCase()).attributes.cx.value;
				y2 = document.getElementById("c_"+pays1.toLowerCase()).attributes.cy.value;
				
				///Pour faire partir et arriver la fleche du pas du centre mais autour
				// dx=x02-x01;
				// dy=y02-y01;
				
				// x1=x01+
				
				if(val>1000000){
					var stW = 8;
				}else if(val>600000){
					var stW = 6;
				} else if(val>200000){
					var stW = 2.8;
				} else {
					var stW = 1.1;
				}
				
				id_fleche=id_fleche*1+1;
				
				taille=Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2))
				alert(taille);
				angle=Math.atan((x1-x2)/(y1-y2))*180/Math.PI;
				// alert(pays1+" "+angle)
				if(x2>x1&&y2>y1){
					angle=angle*-1+180
				} else if(x2<x1&&y2>y1){
					angle=angle*-1-180
				} else {
					angle=angle*-1;
				}
				
				
				d3.select("#place_fleches").append("g").attr("class","line0").attr("id","fl_"+id_fleche).attr("transform","translate("+x1+","+y1+")")
					.append("polygon").attr("transform","rotate("+angle+")").attr("points",(stW*-co_fl_x)+","+(stW*co_fl_y)+" "+(stW*co_fl_x)+","+(stW*co_fl_y)+" 0,"+(stW*-co_fl_y))
					.attr("fill","red")
					.attr("stroke","#DAD9D3")
					
				d3.select("#place_fleches").append("line").attr("class","line0").attr("x1",x1).attr("y1",y1).attr("x2",x1).attr("y2",y1).attr("stroke-width",stW).attr("stroke","red")
					.attr("clip-path","url(#cp_"+id_fleche+")")
					.transition()
					.duration(vit)
					.attr("x2",x2).attr("y2",y2)
					
				
				d3.select("#place_fleches")
					.select("defs")
					.append("clipPath")
					.attr("id","cp_"+id_fleche)
					.append("polygon").attr("class","line0").attr("transform","rotate("+angle+" "+x1+" "+y1+")")
					// .attr("points",x1+","+y1+" "+(x2*1+stW*0.5)+","+(y2*1+stW*0.5)+" "+(x2-stW*0.5)+","+(y2-stW*0.5))
					.attr("points",x1+","+y1+" "+(x1*1+stW*0.5)+","+(y1*1-taille)+" "+(x1-stW*0.5)+","+(y1-taille))
					.attr("fill","blue")
					.attr("opacity",0.5);
					
				
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
			if(ls_pays.indexOf(data0[i].Origine)==-1){
				ls_pays.push(data0[i].Origine)
			} 
		}
		console.log(ls_pays);
}