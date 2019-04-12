///Géométriques
var width = 1500,
height = 1000,

///Graphiques
nuancier = ["#FFFFFF","#EEEEEE","#CCCCCC","#EEEEFF","#000000","#0000ff"],
nuancierDiscr1 = ["#DBBAA6","#CE9683","#C57968","#B8574C","#AD3335"],
nuancierDiscr2= ["#dddddd","#952C83","#9974AE","#BDD4EA","#98A9D1"],

///Géographiques
rayon_terre =  6378140,
super_total=0, //mise a jour dans drawMap, var pays = ..
scale=30000,
pos_mapX=width/4,
pos_mapY=height/3,
proj = d3.geo.conicConformal() //définition de la projection  : carte centrée manuellement, l'échelle est définie en variabe globale
			.center([3.5,50.5])
			.rotate([0, 0])
			.scale(scale)
			
///Logique
type_affichage="valeur_brut",
discret=[],
discretP=[],
MAX=0,
MAXP=0;
			

window.onload = initialize();

function initialize() {
	///Chargement des données
	queue()											
		// .defer(d3.json,"data/pays.topojson")
		.defer(d3.json,"data/mygeodata2/iris_nrd_4326.topojson")
		.defer(d3.csv,"data/data_iris_nord.csv")
		.defer(d3.csv,"data/variables.csv")
		.await(callback0); 
	
	function callback0(error,dataIris,datalog,datavar){
		drawMap(dataIris,datalog,datavar);
	}
	
}

function drawMap(dataIris,datalog,datavar){
	// charge();
	// console.log(dataPays);
	// console.log(dataIris);
		///SVG content
		var map = d3.select("#carte") 
			.append("svg")
			.attr("viewBox","0 -30 "+width+" "+height)
			.attr("width", "100%")
			.attr("id", "map")
			.style("overflow","visible")
			
			
		// const deps = map.append("g");
		
	var path = d3.geo.path() 
			.projection(proj);
	
		
		var iris = map.selectAll(".iris")  
			.data(topojson.feature(dataIris,
				dataIris.objects.iris_nrd_4326).features)	
			
			.enter() 
			.append("path") 
			.attr("d", path)
			.attr("class","iris")
			.attr("blop", "") 
			.attr("brut", "") 
			.attr("prc", "") 
			.attr("NOM_COM", function(d){
				return d.properties.NOM_COM;
				
			})
			.attr("NOM_IRIS", function(d){
				return d.properties.NOM_IRIS;
				
			})
			.attr("CODE_IRIS", function(d){
				return d.properties.CODE_IRIS;
				
			})
			.attr("centre",function(d,i){
				var centro = path.centroid(d);
				return centro;
			})
			.each(function(d,i){
				var centre = this.attributes.centre.value;
				var code = this.attributes.CODE_IRIS.value;
				var liste = centre.split(",");
				map.append("circle")
					.attr("class","iris_centroide")
					.attr("cx", liste[0])
					.attr("cy", liste[1])
					.attr("r", 0)
					.attr("id", "c_"+code)
					.attr("fill","none")
					.attr("stroke","#333333")
			})
			// .each(function(d){
				
				// var code = d.properties.CODE_IRIS;
				// for(v=0;v<datavar.length;v++){
					// varid=datavar[v]["VAR_ID"];
					// d3.select(this).attr(varid, function(d){
							// var code = d.properties.CODE_IRIS;
							// var val = "";
							// for(i=0;i<datalog.length;i++){
								// if(datalog[i].IRIS==code){
									// val = datalog[i][varid];
								// }
							// }
							// return val;
						// })
				// }
				
			// })
			.on("mouseover",function(){
				d3.select("#indic").html(this.attributes.NOM_IRIS.value+" - "+this.attributes.NOM_IRIS.value+" : "+this.attributes.blop.value)
			})
			.attr("stroke","#ffffff")
			.attr("stroke-width",0.5)
			.style("cursor","pointer")
			
			.attr("fill",nuancier[2])
			
	map.append("g")
		.attr("id","liste_var")
		
	map.append("g")
		.attr("id","type_var")	
		
	map.append("g")
		.attr("id","legende")
		
	d3.select("#type_var").append("text").attr("x",300).attr("y",15).text("Valeur brut")
	d3.select("#type_var").append("text").attr("x",300).attr("y",35).text("Pourcentage")	
	d3.select("#type_var").append("rect").attr("x",280).attr("y",5).attr("width",10).attr("height",10).attr("id","valeur_brut").attr("fill","#ffffff").attr("stroke","blue").style("cursor","pointer").on("click",function(){type_affichage="valeur_brut";val_abs()})
	d3.select("#type_var").append("rect").attr("x",280).attr("y",25).attr("width",10).attr("height",10).attr("id","pourcentage").attr("fill","#ffffff").attr("stroke","blue").style("cursor","pointer").on("click",function(){type_affichage="pourcentage";pourcentage()})
		
	for(l=0;l<5;l++){
		d3.select("#legende")
			.append("rect")
			.attr("class","item_legende")
			.attr("id","item"+l)
			.attr("x",578)
			.attr("y",38+l*15)
			.attr("width",20)
			.attr("height",10)
			
		d3.select("#legende")
			.append("text")
			.attr("class","label_legende")
			.text("-")
			.attr("id","label"+l)
			.attr("x",600)
			.attr("y",50+l*15)
	}
	for(v=0;v<datavar.length;v++){
		d3.select("#liste_var")
			.append("text")
			.attr("class","variable")
			.text(datavar[v]["VAR_LIB"])
			.attr("x",function(){
				if(v<50){
					return 850
				}else{
					return 1250
				}
			})
			.attr("y",15*(v%50))
			.attr("code",datavar[v]["VAR_ID"])
			.attr("max",datavar[v]["max"])
			.attr("min",datavar[v]["min"])
			.on("click",function(){
				var varid=this.attributes.code.value;
				
				var max = 0;
				var min = "none"; 	
				
				var maxP = 0;
				var minP = "none"; 				
					
				d3.selectAll(".variable").attr("font-weight",400)
				d3.select(this).attr("font-weight",800).attr("fill","blue")
				
				d3.selectAll(".iris")
					.attr("brut",function(){
						code = this.attributes.CODE_IRIS.value;
						val="";
						for(i=0;i<datalog.length;i++){
							if(datalog[i].IRIS==code){
								val = datalog[i][varid];
								prc = 100*datalog[i][varid]/datalog[i]["P15_LOG"];
							}
						}
						d3.select(this).attr("prc",prc);
						
						if(min=="none"){
							min = val;
						} else if(min > val){
							min = val
						}
						if(parseFloat(val)>parseFloat(max)){
							max = val;
						}
						
						if(minP=="none"){
							minP = prc;
						} else if(minP > prc){
							minP = prc
						}
						if(prc>maxP){
							maxP = prc;
						}
						
						return val;
					})
					.attr("blop",function(){
						if(type_affichage=="valeur_brut"){
							return this.attributes.brut.value;
						}else if(type_affichage=="pourcentage"){
							return this.attributes.prc.value+"%";
						}else{
							return this.attributes.brut.value +" - "+ this.attributes.brut.value+"%";
						}
					})
					
				var ampli = max - min;
				var ampliP = maxP - minP;
				
				
				discret=[min,min*1+ampli*0.2,min*1+ampli*0.4,min*1+ampli*0.6,min*1+ampli*0.8]
				discretP=[minP,minP*1+ampliP*0.2,minP*1+ampliP*0.4,minP*1+ampliP*0.6,minP*1+ampliP*0.8]
				MAX=max;
				MAXP=maxP;
				
				console.log(discretP)
				
				
				if(type_affichage=="valeur_brut"){
					val_abs()
				}
				if(type_affichage=="pourcentage"){
					pourcentage()
				}
				
			
				
			})
			.style("cursor","pointer")
			
	}
	
	// end_charge();
}


// function val_abs(){
	
	// for(i=0;i<discret.length;i++){
		// d3.select("#label"+i).text(discret[i])
		// d3.select("#item"+i).attr("fill",nuancierDiscr1[i])
	// }
	
	// d3.selectAll(".iris")
	// .attr("blop",function(){
			// this.attributes.brut.value;
		// })
		// .attr("fill",function(){
			// var valeur = parseFloat(this.attributes.brut.value);
			// var fill="#333333";
			// var b;
			// for(d=0;d<discret.length;d++){
				// if(valeur>discret[d]){
					// fill = nuancierDiscr1[d];
				// }
			// }
			// return fill;
		// })
		
	
// }

function val_abs(){
	
	for(i=0;i<discret.length;i++){
		d3.select("#label"+i).text(discret[i])
		d3.select("#item"+i).attr("fill",nuancierDiscr1[i])
	}
	
	d3.selectAll(".iris")
		.attr("blop",function(){
			return this.attributes.brut.value;
		})
		.attr("fill",nuancier[2])
		.each(function(){
			id = this.attributes.CODE_IRIS.value;
			var valeur = parseFloat(this.attributes.brut.value);
			// alert(discret);
			var r = valeur*15/MAX;
			
			d3.select("#c_"+id).attr("ray",r);
		})
		
	d3.selectAll(".iris_centroide")
		.transition().duration(350)
		.attr("r",function(){
			return this.attributes.ray.value;
		})
		
	
}

function pourcentage(){	

	d3.selectAll(".iris_centroide")
		.transition().duration(350)
		.attr("r",0)
	
	for(i=0;i<discretP.length;i++){
		d3.select("#label"+i).text(discretP[i])
		d3.select("#item"+i).attr("fill",nuancierDiscr2[i])
	}
		
	d3.selectAll(".iris")
		.attr("blop",function(){
			return this.attributes.prc.value+"%";
		})
		.transition()
		.duration(350)
		.attr("fill",function(){
			var valeur = parseFloat(this.attributes.prc.value);
			var fill="#333333";
			
			for(d=0;d<discretP.length;d++){
				if(valeur>discretP[d]){
					fill = nuancierDiscr2[d];
				}
			}
			return fill;
		})
		
		
	
}


