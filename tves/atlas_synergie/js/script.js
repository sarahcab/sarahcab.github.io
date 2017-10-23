var VBbase="0 0 1000 1000",
diffLEgende = 203.52,
wi_vbzomm = 545.50236,
lsRes0 = [],
lsRes = [],
lsCouple = [],
projection = d3.geo.albers() //définition de la projection  : carte centrée manuellement, l'échelle est définie en variabe globale
	.center([2.9,50.9])
	.rotate([0, 0])
	.parallels([43, 62])
	.scale(30000),
	
nuancier = ["#FFFFFF","#91c497","#0d562c","#c9c19b","#000000","#123456","#996666"] //[0]blanc, [1]couleurs princiaples(point), [2]couleur de sélection, [3]contours depts, [4]noir, [5]ittecop, [6]rosé emrpises et typo detps

window.onload = initialize();

function initialize(){
	drawmap()
	actions()
}

function drawmap(){
	queue()	//chargement des donénes					 
		.defer(d3.json, "data/dept3.json") //geoDepts : polygones de la carte (départements)
		.defer(d3.csv, "data/emprises.csv") //http://geofree.fr/gf/coordinateconv.asp#listSys
		.defer(d3.csv, "data/res_indiv.csv") 
		.await(callback0);
	
	function callback0(error,geoDepts,emprises,res_ind){
		var path = d3.geo.path() 
			.projection(projection);
		
		var map = d3.select("#carte")
			.attr("viewBox",VBbase)
		
		map.append("rect")
			.attr("fill","url(#rad_fond)")
			// .attr("fill",nuancier[2])
			.attr("id","coucou")
			.attr("x",0)
			.attr("y",0)
			.attr("width",VBbase.split(" ")[2])
			.attr("height",VBbase.split(" ")[3])
		
		var depts = map.selectAll(".dept") //implémentation des départements
			.data(topojson.feature(geoDepts,
				geoDepts.objects.nuts3).features)
			.enter()
			.append("path")
			.attr("d", path) 
			.attr("fill",nuancier[0])
			.attr("fill-opacity",0.6)
			.attr("stroke",nuancier[3])
			.attr("stroke-width",0.75)
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
				return "d"+code;
			})
			.attr("name", function(d){
				var name = d.properties.name;
				return name;
			})
			.attr("class","dept")
		
		map.append("rect")
			.attr("id","cache")
			.attr("fill",nuancier[0])
			.attr("width",VBbase.split(" ")[2])
			.attr("height",VBbase.split(" ")[3])
			.attr("cx",0)
			.attr("cy",0)
			.attr("opacity",0)
		
		map.append("text")
			.attr("id","select_spe")
			.attr("font-size",25)
			.attr("x",500)
			.attr("y",210)
			.text("Choisir le réservoir associé :")
			.attr("display","none")
			.attr("font-weight","800")
			
		map.append("text")
			.attr("id","indic")
			.attr("font-size",25)
			.attr("x",600)
			.attr("y",250)
			
		buildInd(res_ind,emprises)
			
		var liens = map.selectAll(".lien")
			.data(emprises)
			.enter()
			.append("line")
			.attr("x1",function(d){
				var id0=(d.id).split("_")[0]
				var val = document.getElementById("g_"+id0).attributes.xc.value;
				return val;
			})
			.attr("x2",function(d){
				var id0=(d.id).split("_")[1]
				var val = document.getElementById("g_"+id0).attributes.xc.value;
				return val;
			})			
			.attr("y1",function(d){
				var id0=(d.id).split("_")[0]
				var val = document.getElementById("g_"+id0).attributes.yc.value;
				return val;
			})
			.attr("y2",function(d){
				var id0=(d.id).split("_")[1]
				var val = document.getElementById("g_"+id0).attributes.yc.value;
				return val;
			})
			.attr("stroke",nuancier[4])
			.attr("stroke-width",1.5)
			.attr("stroke-dasharray","3,2")
			.attr("class","lien")
			.attr("id",function(d){
				return "e"+d.id
			})
			.attr("code",function(d){
				return d.id
			})
			.attr("XMIN",function(d){
				return projection([d.XMIN, d.YMIN])[0];
			})
			.attr("YMIN",function(d){
				return projection([d.XMIN, d.YMIN])[1];
			})
			.attr("XMAX",function(d){
				return projection([d.XMAX, d.YMAX])[0];
			})
			.attr("YMAX",function(d){
				return projection([d.XMAX, d.YMAX])[1];
			})
			.attr("WIDTH",function(d){
				return projection([d.XMAX, d.YMAX])[0] - projection([d.XMIN, d.YMIN])[0];
			})
			.attr("HEIGHT",function(d){
				return  projection([d.XMIN, d.YMIN])[1] - projection([d.XMAX, d.YMAX])[1];
			})
			.attr("viewbox",function(d){
				return d.viewbox
			})
			.attr("centrex_zoom",function(d){
				return d.centrex_zoom
			})
			.attr("centrey_zoom",function(d){
				return d.centrey_zoom
			})
			.attr("centrex",function(d){
				return d.centrex
			})
			.attr("centrey",function(d){
				return d.centrey
			})
			.attr("zoom",function(d){
				return d.zoom
			})
			.attr("echelle1",function(d){
				return d.echelle1
			})
			.attr("echelle2",function(d){
				return d.echelle2
			})
		
		map.append("g").attr("id","emprises")
				
	}
}

function affEmprise(obj){
	// alert(obj)
	
	var id=obj.id;
	var XMIN = obj.attributes.XMIN.value;
	var YMIN = obj.attributes.YMIN.value;
	var XMAX = obj.attributes.XMAX.value;
	var YMAX = obj.attributes.YMAX.value;
	d3.select("#emprises")
		.append("polygon")
		.attr("fill","none")
		.attr("stroke",nuancier[6])
		.attr("id","emp_"+id)
		.attr("class","emp")
		.attr("points",function(){
			
			return XMIN+","+YMIN+" "+XMAX+","+YMIN+" "+XMAX+","+YMAX+" "+XMIN+","+YMAX
		})
		.attr("transform",function(){
			var X = (XMAX*1 + XMIN*1)/2
			var Y = (YMAX*1 + YMIN*1)/2
			return "scale(0.25) translate("+X*3+","+Y*3+") "
		})
		.transition()
		.duration(1000)
		.attr("transform","")			
					
}


function affFiche(obj){
	d3.select(obj).attr("lock","true")
	d3.selectAll(".lien").attr("display","none")
	d3.selectAll(".eltCh").attr("display","none")

	var x = obj.attributes.XMIN.value;
	var y = obj.attributes.YMAX.value;
	var width = obj.attributes.WIDTH.value;
	var height = obj.attributes.HEIGHT.value;
	var vb = obj.attributes.viewbox.value;
	var code=obj.attributes.code.value;
	var zoom=obj.attributes.zoom.value;
	var centrex= obj.attributes.centrex.value;
	var centrey= obj.attributes.centrey.value;
	var centrex_zoom= obj.attributes.centrex_zoom.value;
	var centrey_zoom= obj.attributes.centrey_zoom.value;
	var echelle1= Math.abs(obj.attributes.echelle1.value);
	var echelle2= obj.attributes.echelle2.value;
	
	d3.select("#select_spe")
		.attr("display","none")
		
	d3.select("#carte")
		.attr("vb",x+" "+y+" "+width+" "+height)
		.attr("opacity",1)
		.transition()
		.duration(900)
		.attr("viewBox",x+" "+y+" "+width+" "+height)
		.attr("opacity",0)
		
	setTimeout(function(){fiche(code,vb,zoom,centrex,centrey,centrex_zoom,centrey_zoom,echelle1,echelle2)},1000)
}

function selection(idd,liste){
	d3.select("#cache")
		.transition()
		.duration(300)
		.attr("opacity",0.6)
		
	d3.selectAll(".eltCh")
		.attr("display","none")

	d3.selectAll(".lien")
		.attr("display","none")
		
	d3.select("#select_spe")
		.attr("display","block")
		
	var x = document.getElementById("g_"+idd).attributes.xc.value;
	var y = document.getElementById("g_"+idd).attributes.yc.value;
	
	d3.select("#carte")
		.append("circle")
		.attr("r",6)
		.attr("fill","#FFFFFF")
		.attr("fill-opacity",0.6)
		.attr("cx",x)
		.attr("cy",y)
		.attr("class","c_cache")
	
	for(i=0;i<liste.split(",").length;i++){
		d3.select("#g_"+liste.split(",")[i])
			.attr("display","block")
		
		if(document.getElementById("e"+idd+"_"+liste.split(",")[i])){
			obj = document.getElementById("e"+idd+"_"+liste.split(",")[i])
		} else {
			obj = document.getElementById("e"+liste.split(",")[i]+"_"+idd)
		}
		d3.select(obj)
			.attr("display","block")
	}
}

function buildInd(indiv,data){
	var centreX=VBbase.split(" ")[2]/2,
	centreY=VBbase.split(" ")[3]/2,
	rayon=0.98*VBbase.split(" ")[2]/2;
	// lockCercle="false";
	
	d3.select("#carte")
			.append("g")
			.attr("id","cercleChoix")
			.append("circle")
			.attr("fill-opacity",0)
			.attr("stroke","#FFFFFF")
			.attr("stroke-width",35)
			.attr("cx",centreX)
			.attr("cy",centreY)
			.attr("r",rayon)		
			// .attr("opacity",0.8)			
						
	for(i=0;i<indiv.length;i++){
		if((indiv[i].Id).length==2){
			lsRes0.push("0"+indiv[i].Id)
			lsRes.push("0"+indiv[i].Id)
		} else {
			lsRes0.push(indiv[i].Id)
			lsRes.push(indiv[i].Id)
		}
		
	}
	lsRes.sort();
	console.log(lsRes0)
	console.log(lsRes)
	for(j=0;j<lsRes.length;j++){
		lsCouple.push([])
		e = lsRes0.indexOf(lsRes[j])
		lsRes[j] = parseInt(lsRes[j])
		for(k=0;k<data.length;k++){
			nb1=(data[k].id).split("_")[0];
			nb2=(data[k].id).split("_")[1];
			if(nb1==lsRes[j]){
				lsCouple[j].push(nb2)
			} 
			if(nb2==lsRes[j]){
				lsCouple[j].push(nb1)
			} 
		}
		var angle = 2*Math.PI*j/lsRes.length;
		d3.select("#cercleChoix")
			.append("g")
			.attr("class","eltCh")
			.attr("id","g_"+lsRes[j])
			.attr("xc",projection([indiv[e].x, indiv[e].y])[0])
			.attr("yc",projection([indiv[e].x, indiv[e].y])[1])
			.attr("liste",lsCouple[j])
			.on("mouseover",function(){
				
				//valeurs
				var liste=this.attributes.liste.value;
				var idd= this.id;
				
				//a zéro
				d3.select("#cercleChoix").selectAll("text").attr("font-weight",400).attr("fill",nuancier[4])
				d3.select("#cercleChoix")
					.selectAll(".colore")
					.attr("fill",nuancier[1])
					.attr("r",function(){
						var r0 = this.attributes.r0.value;
						return r0
					})
				
				//mise à jour
				d3.select("#indic").text(idd.split("_")[1])
	
				
				for(i in liste.split(",")){
					var ind = liste.split(",")[i];
					var x2 = document.getElementById("t_"+ind).attributes.x.value;
					var y2 = document.getElementById("t_"+ind).attributes.y.value;
					
					
					
					d3.select("#t_"+ind)
						.attr("font-weight",800)
						
					d3.select(this)
						.select("text")
						.attr("font-weight",800)
						.attr("fill",nuancier[2])
					
					d3.select("#g_"+ind)
						.selectAll(".colore")
						.attr("fill",nuancier[2])

					d3.select(this)
						.selectAll(".colore")
						.attr("fill",nuancier[2])
						.transition()
						.duration(100)
						.attr("r",function(){
							var r0 = this.attributes.r0.value;
							return r0*2
						})
				}
				if(liste.split(",").length==1){
					if(document.getElementById("e"+idd.split("_")[1]+"_"+ind)){
						obj = document.getElementById("e"+idd.split("_")[1]+"_"+ind)
					} else {
						obj = document.getElementById("e"+ind+"_"+idd.split("_")[1])
					}
					affEmprise(obj)
				} 
			})
			.on("mouseout",function(){
				d3.selectAll(".emp").remove()
				d3.select("#cercleChoix").selectAll("text").attr("font-weight",400).attr("fill",nuancier[4])
				d3.select("#cercleChoix")
					.selectAll(".colore")
					.attr("fill",nuancier[1])
					.transition()
					.duration(100)
					
					.attr("r",function(){
						var r0 = this.attributes.r0.value;
						return r0
					})
			})
			.on("click",function(){
				var liste=this.attributes.liste.value;
				var idd= this.id;
				if(liste.split(",").length==1){
					var ind = liste.split(",")[0];
					if(document.getElementById("e"+idd.split("_")[1]+"_"+ind)){
						obj = document.getElementById("e"+idd.split("_")[1]+"_"+ind)
					} else {
						obj = document.getElementById("e"+ind+"_"+idd.split("_")[1])
					}
					affFiche(obj)
				} else {
					selection(idd.split("_")[1],liste)
				}
			})
			.append("text")
			.attr("id","t_"+lsRes[j])
			.text(lsRes[j])
			.attr("x", centreX*1+rayon*Math.cos(angle)-12)
			.attr("y", centreY*1+rayon*Math.sin(angle)+5)
			.attr("font-size",15)
			
		d3.select("#g_"+lsRes[j])
			.selectAll("circle")
			.data([[nuancier[1],0.5,10],[nuancier[1],1,7],[nuancier[0],1,2.5]])
			.enter()
			.append("circle")
			.attr("cx",projection([indiv[e].x, indiv[e].y])[0])
			.attr("cy",projection([indiv[e].x, indiv[e].y])[1])
			.attr("fill",function(d){
				return d[0]
			})
			.attr("opacity",function(d){
				return d[1]
			})
			.attr("r0",function(d){
				return d[2]
			})
			.attr("r",function(d){
				return d[2]
			})
			.attr("class",function(d){
				if(d[0]==nuancier[0]){
					return "blanc"
				} else {
					return "colore"
				}
			})
	}	
}

function actions(){
	d3.select("#dezoom")
		.on("click",function(){
			d3.select("#carte")
				.attr("viewBox",function(){
					return this.attributes.vb.value;
				})
				.style("margin-left","43%")
				.style("margin-top","0%")
				.style("width","49%")
				.transition()
				.delay(100)
				.duration(1000)
				.attr("viewBox",VBbase)
			
			d3.select("#base")
				.style("display","none")
				
			d3.select("#habillage")
				.attr("display","block")
			
			d3.select("#indic")
				.style("display","block")
			
			d3.select("#content")
				.attr("width","100%")
				
			d3.select("#cercleChoix").attr("display","block")
			
			d3.selectAll(".emp").remove()
			
			d3.selectAll(".lien")
				.attr("display","block")
			
			d3.select(this).attr("display","none")
			
			d3.select("#cache").attr("opacity",0)
			
			d3.selectAll(".eltCh")
				.attr("display","block")
			
			d3.select("#elt_scalebar")
				.attr("width",150)
			d3.select("#elt_scalebar2")
				.attr("width",150)
			
			d3.selectAll(".c_cache").remove()

		})
		.on("mouseover",function(){
			d3.select("#carte")
				.attr("opacity",0.5)
		})
		.on("mouseout",function(){
			d3.select("#carte")
				.attr("opacity",1)
		})
}

function fiche(ind,vb,z,ccx,ccy,czx,czy,ech1,ech2){
	coeff = vb.split(" ")[3]/vb.split(" ")[2]
	
	d3.select("#dezoom").style("display","block")
	// d3.select("#titree").text(ind.split("_")[0]+" - "+ind.split("_")[1])

	d3.select("#habillage")
		.attr("display","none")
	
	d3.select("#base")
		.style("display","block")
	
	d3.select("#indic").style("display","none")
		
	affEmprise(document.getElementById("e"+ind))
	d3.select(".emp")
		.attr("fill",nuancier[6])
		
	
	//---------------------------------------------------------------------------------------ancien truc avant a virer
	
	if(z=="false"){
		if(coeff<=1){
			config=1;
		} else {
			config=2;
		}
	} else {
		if(coeff<=1){
			config=3;
		} else {
			config=4;
		}
	}
	trans(config)
	
	d3.select("#carte")
		.attr("viewBox",VBbase)
		
		.style("width","11.5%")
		.style("margin-left",function(){
			var cx = document.getElementById("dezoom").attributes.cx.value-document.getElementById("dezoom").attributes.r.value;
			var X = (document.getElementById("carte_indiv").attributes.viewBox.value).split(" ")[0];
			var W = (document.getElementById("carte_indiv").attributes.viewBox.value).split(" ")[2];
			
			var val = (cx-X)*100/W;
			return val+"%";
		})
		.style("margin-top",function(){
			var cy = document.getElementById("dezoom").attributes.cy.value-document.getElementById("dezoom").attributes.r.value;
			var Y = (document.getElementById("carte_indiv").attributes.viewBox.value).split(" ")[1];
			var H = (document.getElementById("carte_indiv").attributes.viewBox.value).split(" ")[3];
			
			var val = (cy-Y)*51/H;
			return val+"%";
		})
		.transition()
		.duration(500)
		.attr("opacity",1)
		// d3.select("#reperes_cartep")
		// .append("use")
		
	//carte principale
	var width_rep = document.getElementById("rep_carte").attributes.width.value;
	var height_rep =document.getElementById("rep_carte").attributes.height.value;
	var x_rep =document.getElementById("rep_carte").attributes.x.value;
	var y_rep =document.getElementById("rep_carte").attributes.y.value;
	var coeff_rep = height_rep/width_rep;
		
	if(coeff<=coeff_rep){
		var Xc = x_rep;
		var Wc = width_rep;
		var Hc = Wc*coeff;
		var Yc = y_rep*1+(height_rep-Hc)*0.5;
		
	} else {
		var Yc = y_rep;
		var Hc = height_rep;
		var Wc = Hc/coeff;
		var Xc = x_rep*1+(width_rep-Wc)*0.5;
	}
			
	
	d3.select("#carte_p")
		.attr("x",Xc)
		.attr("y",Yc)
		.attr("width",Wc)
		.attr("height",Hc)
		
		.attr("href","resultats/resultatsA_"+ind+".svg")
		
	//echelle
	var w_sca = document.getElementById("elt_scalebar").attributes.width.value;
	var sca = w_sca * ech1*vb.split(" ")[2]/Wc;
	console.log(w_sca)
	console.log(ech1)
	console.log(vb.split(" ")[2]/Wc)
	sca2=sca-sca%500;
	w_sca2=w_sca*sca2/sca;
	d3.select("#lab_scalebar")
		.text(sca2+" mètres"+sca)
	d3.select("#elt_scalebar")
		.attr("width",w_sca2)
		
		
	//carte zoomée
	d3.select("#carte_zoom")
		.attr("x",document.getElementById("rep_z").attributes.x.value)
		.attr("y",document.getElementById("rep_z").attributes.y.value)
		.attr("width",document.getElementById("rep_z").attributes.width.value)
		.attr("height",document.getElementById("rep_z").attributes.height.value)
		.attr("href","resultats/zoomA_"+ind+".svg")
		
		
	//titre
		
	d3.select("#titre_carte")
		.select(".conf1")
		
		.text("Réservoirs "+ind.split("_")[0]+" et "+ind.split("_")[1])

	it = 0
	d3.select("#titre_carte")
		.selectAll(".conf2")
		.text(function(){
			if(it==0){
				it++;
				return "Réservoirs "+ind.split("_")[0]
			} else {
				return "et "+ind.split("_")[1]
			}
		})
		
		
	//zoom
	if(z=="true"){
		var xx = Xc*1+(ccx-vb.split(" ")[0])*Wc/vb.split(" ")[2];
		var yy = Yc*1+(ccy-vb.split(" ")[1])*Hc/vb.split(" ")[3];
		
		d3.select("#carte_indiv")
			.append("g")
			
			.attr("transform","translate("+xx+","+yy+")")
			.append("use")
			.attr("id","clipp")
			.attr("xlink:href","#moindre_zoom")
		
		// d3.select("#carte_indiv")
			// .append("g")
			
			// .attr("transform","translate("+xx+","+yy+")")
			// .append("use")
			// .attr("id","clipp")
			// .attr("xlink:href","#moindre_zoom")
		
			
		//echelle2
		var w_sca = document.getElementById("elt_scalebar2").attributes.width.value;
		var sca = w_sca * ech2*wi_vbzomm/document.getElementById("rep_z").attributes.width.value;
		
		sca2=sca-sca%1;
		w_sca2=w_sca*sca2/sca
		d3.select("#lab_scalebar2")
			.text(sca2+" mètres"+sca)
		d3.select("#elt_scalebarb2")
			.attr("width",w_sca)
		
	}
	
}

function trans(n){
	d3.selectAll(".disp").attr("display","none")
	d3.selectAll(".conf"+n).attr("display","block")
	d3.selectAll(".transf")
		.transition()
		.duration(200)
		.attr("transform",function(){
			if(this.attributes["transform"+n]){
				var val = this.attributes["transform"+n].value;
				return val;
			} else {
				alert(this.id)
			}
		})
		
	d3.selectAll(".changex1")
		.attr("x1",function(){
			var val = this.attributes["x1_"+n].value;
			return val;
		})
		
	d3.selectAll(".changeRec")
		.attr("x",function(){
			var val = this.attributes["x"+n].value;
			return val;
		})
		.attr("y",function(){
			var val = this.attributes["y"+n].value;
			return val;
		})	
		.attr("width",function(){
			var val = this.attributes["width"+n].value;
			return val;
		})
		.attr("height",function(){
			var val = this.attributes["height"+n].value;
			return val;
		})		
		
	d3.selectAll(".changeCir")
		.attr("cx",function(){
			var val = this.attributes["cx"+n].value;
			return val;
		})
		.attr("cy",function(){
			var val = this.attributes["cy"+n].value;
			return val;
		})	
		.attr("r",function(){
			var val = this.attributes["r"+n].value;
			return val;
		})
		
}
