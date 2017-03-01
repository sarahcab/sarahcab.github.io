var nuancier = ["#FFFFFF", "#BABABA","#767676","#353535"]
var nuancier2 = ["#B6B6B6","#0058E5","#BDB5DA","#4B37B5"]
var nuancierGRIS = ["#FFFFFF","#BBBBBB","#888888","#333333","#000000"];
var nuancier_PIB = ["#D4EEFC","#BDD4EA","#98A9D1","#9974AE","#952C83"];
var nuancier_GIN = ["#FCDBCD","#F3BFA9","#ED8464","#D6493D","#AC2D2C"];
var discretPIB= [0,1000,10000,100000,200000];
var discretGIN= [0,20,40,60,80];
var width = 1000;
var widthCarte = width/2.5;
var height = 1000;
var centreX = 500;
var centreY = 470;
var rLoupe = 80;
var minimum = 100;
var tst=0;
var scale=320;
var anneeMin = 1985;
var anneeMax = 2016;
var anneeDef = 2002;
var etendue = anneeMax - anneeMin;
var Max = document.getElementById("fix").attributes.width.value- document.getElementById("curs0").attributes.width.value;
var choix  = "pib_";
var quot = 0.02;
var opaclone = 0.8;
					
var zp = document.getElementById("zp")
var zm = document.getElementById("zm")
	
var proj = d3.geo.orthographic()
	.translate([widthCarte, height / 3])
	.clipAngle(90)
	.scale(scale);

var sky = d3.geo.orthographic()
	.translate([widthCarte, height / 3])
	.clipAngle(90)
	.scale(400);

window.onload = initialize();

function initialize() {
	drawMap();
	dragTime();
	zoom();
}

function dragTime(){
	var drag = d3.behavior.drag() //fonction "drag" veut dire que tu fais bouger l'objet en l'attrapant
	.on("drag", function(d) {
		//pour récupérer la position des autres boules (peut-être ya plus simple mais ca marche)
		var idMin = d.ind - 1;
		var idMax = parseFloat(d.ind) + 1;
		
		var min=0;
		var max=Max;
		d.x += d3.event.dx;
		if(d.x<=min){
			d.x = min;
		} else if(d.x>=max){
			d.x = max;
		}
		// id(d.x>idMin)
		d3.select(this).style("cursor","grabbing").attr("transform", function(d,i){
			return "translate("+d.x+",0)"
		})
		d3.select("#curs0_label").style("cursor","grabbing").attr("transform", function(){
			return "translate("+d.x+",0)"
		})
		affiche(d.x, this);
	})
	.on("dragend", function(d){
		d3.select(this).style("cursor","grab");
	})
		
	//on déclenche l'évèneemntet positionne place apr défaut
	var val = parseInt(((anneeDef-anneeMin)*Max/(anneeMax-anneeMin)));
	
	d3.select("#curs"+0).data([ {"x":val}]).attr("transform","translate("+val+",0)")
		.call(drag).style("cursor","grab")
	
	d3.select("#curs0_label").text(anneeDef).attr("transform","translate("+val+",0)")
}

//a la place de ça a fonction de carto
function affiche(params, obj){ 
	var idCurs = obj.attributes.id.value; //récupreè l'identifiant du truc que t'as bougé pour choper le bon label
	//var val = parseInt(params)
	var val = parseInt((params*etendue/Max) + anneeMin);
	d3.select("#"+idCurs+"_label").html(val) //on écrit dans le label
	queue()											
		.defer(d3.csv,"data/datata.csv")
		.await(callback1); 
	function callback1(error, datata){
		choix = "pib_";
		carto(val, true, datata);
		choix= "gin_";
		carto(val, false, datata);
	}

}

function carto(annee, cond, datata){
		var nuancierOk;
		var ind;
		if(choix=="pib_"){
			nuancierOk = nuancier_PIB;
			discretOk = discretPIB;
		} else if(choix=="gin_"){
			nuancierOk = nuancier_GIN;
			discretOk = discretGIN;
		} else {
			nuancierOk = nuancierGRIS;
			discretOk = [10,20,30,40,50];
		}
		if(cond==true){
			ind = "#clo0_"
		} else {
			ind = "#clo1_"
		}
		for(i=0;i<datata.length;i++){
			d3.select(ind+datata[i].Code_aplha2)
				// .attr("stroke","#FFFFFF")
				// .attr("stroke-width",0.6)
				.attr("fill",function(d){
				if(datata[i][choix+annee]>discretOk[4]){
					return nuancierOk[4]
				} else if(datata[i][choix+annee]>discretOk[3]){
					return nuancierOk[3]
				} else if(datata[i][choix+annee]>discretOk[2]){
					return nuancierOk[2]
				} else if(datata[i][choix+annee]>discretOk[1]){
					return nuancierOk[1]
				}else if(datata[i][choix+annee]>0){
					return nuancierOk[0]
				} else {
					return nuancier2[0];
				}
			})
		}
		
		////beug : efface ou marche pas complètement pour tous
		// d3.selectAll(".pays").attr("fill",function(){
			// if(this.attributes.fill){
				// return this.attributes.fill.value;
			// } else {
				// return nuancier2[0];
			// }
		// })
		//d3.selectAll(".pays").attr("fill","none").attr("stroke","none")
		d3.selectAll(".paysclone").attr("fill",function(){
			if(this.attributes.fill){
				return this.attributes.fill.value;
			} else {
				return nuancier2[0];
			}
		})
		d3.select("#clone_petit").attr("fill","#FFFFFF").attr("stroke","red")
		//d3.select("#clone_FR").attr("fill","blue");
	
}

function dragMap(ind){
	var drag = d3.behavior.drag() //fonction "drag" veut dire que tu fais bouger l'objet en l'attrapant
		.on("drag", function(d) {
			d.x += d3.event.dx;
			d.y += d3.event.dy;
			// d3.select(this).style("cursor","grabbing").attr("transform", function(d,i){
				// return "translate("+d.x+","+d.y+")"
			// })
			proj.rotate([d.x,-d.y])
			var path = d3.geo.path().projection(proj);
			d3.select("#map").selectAll(".pays")  
				.attr("d", path)
		})
		.on("dragend", function(d){
			d3.select(this).style("cursor","grab");	
		})
	d3.select(ind).data([{"x":-10,"y":-5}]).call(drag)
}

function drawMap(){
	queue()											
		.defer(d3.json,"data/pays.topojson")
		.defer(d3.csv,"data/iso.csv")
		.await(callback0); 
	
	function callback0(error, dataPays,iso,primos){
		var map = d3.select("#carte") 
			.append("svg")
			.attr("width", width)
			//.attr("height", height)
			.attr("id", "map")
			.style("overflow","hidden")
			// .style("background","#FF88FF")
			.attr("viewBox","90 -50 700 500")
	
		var globe = map.append("g")
		.attr("id","globe")
		
		var copie= map.append("g")
		.attr("id","copie")
		
		var path = d3.geo.path() 
			.projection(proj);
		
//premier globe
	  globe.append("circle")
		.attr("cx", widthCarte).attr("cy", height / 3)
		.attr("r", proj.scale())
		.attr("id","lamer")
		.style("fill", "#CCCCCC")
		.style("stroke", "#FFFFFF");
		
		var i = 1;
		var sca = 1+i*quot;

//deuxème globe		
	map.append("use")
		.attr("xlink:href","#lamer")
		//.attr("x",width/2.5)
		.attr("transform",function(){
			return "scale("+sca+") translate(-"+(width/4/i*quot)+",-"+(height / 3/i*quot)+")"
		})
		.attr("y",0)
		.attr("id","clone_lamer")
		.attr("opacity",opaclone/2)
		
//fondu
//gradient, boule pus tard
	 map.append("defs")
		.append("radialGradient")
		.attr("id","lala")
		.selectAll("stop")
		.data([["70%","white",0],["80%","white",1]])
		.enter()
		.append("stop")
		.attr("offset",function(d,i){
			return d[0]
		}).attr("stop-color",function(d,i){
			return d[1]
		}).attr("stop-opacity",function(d,i){
			return d[2]
		})



		
/////////////////////////////////////////////////////////////////////////////////////////:
		
		var pays = globe.selectAll(".pays")  
			.data(topojson.feature(dataPays,
				dataPays.objects.countries).features)
			.enter() 
			.append("path") 
			.attr("d", path) 
			.attr("fill", nuancier2[0])
			.style("fill", "inherit")
			.style("opacity", "inherit")
			.attr("stroke","#FFFFFF")
			.attr("stroke-width",0.6)
			.attr("centre",function(d,i){
				var centro = path.centroid(d);
				return centro;
			})
			.attr("codeNum", function(d){
				var code = d.id;
				return code;
			})
			.attr("code", function(d){
				var code = d.id;
				var val = "";
				for(i=0;i<iso.length;i++){
					if(iso[i].num==code){
						val = iso[i].alpha;
					}
				}
				return val;
			})
			.attr("code", function(d){
				var code = d.id;
				var val = "";
				for(i=0;i<iso.length;i++){
					if(iso[i].num==code){
						val = iso[i].alpha;
					}
				}
				return val;
			})
			.attr("id", function(){
				var val = this.attributes.code.value;
				return val;
			})
			.attr("class",function(){
				var val = this.attributes.code.value;
				return val+" pays";
			})
			.each(function(d,i){
				var val = this.attributes.code.value;
				for(i=0;i<2;i++){
					var sca = 1+i*quot;
					if(i==0){
						ind="#copie"
					} else {
						ind="#map"
					}
					d3.select(ind).append("use")
					.attr("xlink:href","#"+val)
					//.attr("x",width/0)
					.attr("y",0)
					.attr("transform",function(){
						if(i==1){
							return "scale("+sca+") translate(-"+(width/4/i*quot)+",-"+(height / 3/i*quot)+")"
						}else {
							return "";
						}
					})
					.attr("class","paysclone")
					.attr("id","clo"+i+"_"+val)	
					.attr("opacity",function(){
						if(i==0){
							return 1;
						} else {
							return opaclone ;
						}
					})
				}
			})
			.on("mouseover",function(d,i){
				var val = this.attributes.code.value;
				d3.select(indic).html(val);
			})
		
		map.append("circle")
			.attr("cx", widthCarte).attr("cy", height / 3)
			.attr("r", proj.scale()*(1+quot*3.5))
			.attr("id","flougrand")
			.attr("stroke", "url(#lala)")
			.attr("stroke-width", 300)
			.attr("fill-opacity",0)
			.attr("fill","none")
		

		map.append("use")
			.attr("xlink:href","#globe")
			.attr("x",width*5)
			.attr("transform","scale(0.1)")
			.attr("y",-300)
			.attr("id","clone_petit")
			.style("cursor","grab");
			
		
		map.append("circle")
			.attr("cx", widthCarte).attr("cy", height / 3)
			.attr("r", proj.scale()*(1+quot*30))
			.attr("id","floupetit")
			//.attr("stroke", "url(#lala)")
			.attr("stroke", "white")
			.attr("stroke-width", 500)
			.attr("fill-opacity",0)
			.attr("fill","none")
			.attr("transform","scale(0.1) translate("+width*5+",-300)")
		
		map.append("circle")
			.attr("cx", widthCarte).attr("cy", height / 3)
			.attr("r", proj.scale()*(1+quot*3))
			.attr("id","floupetit2")
			.attr("stroke", "red")
			.attr("stroke-width", 25)
			.attr("fill-opacity",0)
			.attr("fill","none")
			.attr("transform","scale(0.1) translate("+width*5+",-300)")
			
		///////////////Legende

		map.selectAll(".carres")
			.data([[100],[100],[100],[100],[width-280],[width-280],[width-280],[width-280]])
			.enter()
			.append("rect")
			.attr("y",function(d,i){
				if(d[0]<600){
					return 20*i
				} else {
					return 20*i - 4*20
				}
			})
			.attr("fill",function(d,i){
				if(d[0]<600){
					return nuancier_PIB[i]
				} else {
					return nuancier_GIN[i-4]
				}
			})
			.attr("x",function(d,i){
				return d[0]
			})
			.attr("width",10)
			.attr("height",10)
			.attr("class","carres")
			
		map.selectAll(".lableg")
			.data([[100],[100],[100],[100],[100],[width-280],[width-280],[width-280],[width-280],[width-280]])
			.enter()
			.append("text")
			.attr("y",function(d,i){
				if(d[0]<600){
					return 20*i
				} else {
					return 20*i - 5*20
				}
			})
			.text(function(d,i){
				if(d[0]<600){
					return discretPIB[i]
				} else {
					return discretGIN[i-5]
				}
			})
			.attr("x",function(d,i){
				return d[0]
			})
			.attr("id", "lab"+i)
			.attr("transform",function(d,i){
				if(d[0]<600){
					return  "translate(20,0)"
				} else if (discretGIN[i-5]==0) {
					return "translate(-20,0)"
				} else {
					return "translate(-27,0)"
				}
			})
			.attr("class","lableg")
			
		map.selectAll(".titres")
			.data([[100,"Produit intérieur brut"],[width-380,"Indice de GINI"]])
			.enter()
			.append("text")
			.attr("x",function(d){
				return d[0]
			})
			.attr("y",-20)
			.attr("font-size",20)
			.attr("font-family","RobotoBold")
			.attr("class","titres")
			.text(function(d){
				return d[1]
			})
		//	.attr("fill",nuancier_PIB[4])
			
		dragMap("#clone_petit");
		//boule

	queue()											
			.defer(d3.csv,"data/datata.csv")
			.await(callback1); 
		function callback1(error, datata){
			choix = "pib_";
			carto(anneeDef, true, datata);
			choix= "gin_";
			carto(anneeDef, false, datata);
		}
	}
}

function zoom(){
	zp.onclick = function(){
		var r = proj.scale()*1.10;
		d3.select("#lamer").attr("r",r)
		proj.scale([r])
		var path = d3.geo.path().projection(proj);
		d3.select("#map").selectAll(".pays")  
			.attr("d", path)
	}
	zm.onclick = function(){
		var r = proj.scale()*0.90;
		d3.select("#lamer").attr("r",r)
		proj.scale([r])
		var path = d3.geo.path().projection(proj);
		d3.select("#map").selectAll(".pays")  
			.attr("d", path)
	}
}
