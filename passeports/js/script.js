///Géométriques
var width = 1500,
height = 1000,

///Graphiques
nuancier = ["#FFFFFF","#EEEEEE","#CCCCCC","#EEEEFF","#000000","#0000ff"],
// nuancierQuot = ["#D4EEFC","#BDD4EA","#98A9D1","#9974AE","#952C83"],
nuancierQuot = ["#DBBAA6","#CE9683","#C57968","#B8574C","#AD3335"],
nuancierPower = ["#952C83","#9974AE","#BDD4EA","#98A9D1"],
discretQuot = [0,0.2,0.5,0.8,1],
discretPower = ["Visa free","Visa on arrival","Visa eTA","Visa required"],

///Géographiques
rayon_terre =  6378140,
super_total=0, //mise a jour dans drawMap, var pays = ..
scale=320,
pos_mapX=width/4,
pos_mapY=height/3,
proj = d3.geo.orthographic()
	.translate([pos_mapX, pos_mapY])
	.clipAngle(90)
	.scale(scale)
	.rotate([-130,-20]),
proj2 = d3.geo.orthographic()
	.translate([pos_mapX, pos_mapY])
	.clipAngle(90)
	.scale(scale)
	.rotate([-240,20]);

window.onload = initialize();

function initialize() {
	///Chargement des données
	queue()											
		.defer(d3.json,"data/pays.topojson")
		.defer(d3.csv,"data/iso.csv")
		.defer(d3.csv,"data/passeportpower.csv")
		.defer(d3.csv,"data/eurostat_superficie.csv")
		.defer(d3.csv,"data/coast.csv")
		.await(callback0); 
	
	function callback0(error, dataPays,iso,dataPower,supers,coast){
		drawMap(dataPays,iso,dataPower,supers,coast);
		dragMap();
	}
	
	// alert(d3.select("#milieu").node().getTotalLength())
	// alert(d3.select("#cote").node().getTotalLength())
	// alert(d3.select("#total").node().getTotalLength())
}

function drawMap(dataPays,iso,dataPower,supers,coast){
		///SVG content
		var map = d3.select("#carte") 
			.append("svg")
			.attr("viewBox","0 -30 "+width+" "+height)
			.attr("width", "100%")
			.attr("id", "map")
			.style("overflow","visible")
		
		///Gradient
		grandient = map.append("defs")
			.append("radialGradient")
			.attr("id","white_light")
			.selectAll("stop")
			.data([[0.7,"5%"],[0,"100%"]])
			.enter()
			.append("stop")
			.attr("stop-color",nuancier[0])
			.attr("stop-opacity",function(d){
				return d[0]
			})
			.attr("offset",function(d){
				return d[1]
			})
			
			
		///Elements principaux		
		var copie= map.append("g")
			.attr("id","copie")
			.attr("opacity",1)
			.attr("transform","translate(1200,50) scale(-0.7,0.7)")
		var copieB= map.append("g")
			.attr("id","copieB")
			.attr("opacity",1)
			.attr("transform","translate(680,50) scale(0.7,0.7)")
		
		var copie2= map.append("g")
			.attr("id","copie")
			.attr("opacity",1)
			.attr("clip-path","url(#miroir_clip)")
		
		var miroir = map.append("g")
			.attr("id","miroir")
			.attr("opacity",0.7)
			
		var legende = map.append("g")
			.attr("id","legende")
		
		var globe = map.append("g")
			.attr("id","globe")
			
		var graticule = d3.geo.graticule()
			.step([30, 20]); 
			
		var sup= map.append("g")
			.attr("id","super")
			
		
		var path = d3.geo.path() 
			.projection(proj);
			
		var echelle = map.append("g")
			.attr("id","echelle")
			.attr("display","none")
			.attr("opacity",0)
		
		var echelle_aff = map.append("g")
			.attr("id","echelle_aff")
			
		
		///Mer
		globe.append("circle")
			.attr("cx", pos_mapX).attr("cy", pos_mapY)
			.attr("r", proj.scale())
			.attr("id","lamer")
			.style("fill",nuancier[3])
			.style("stroke", nuancier[0]);
			
		globe.append("circle")
			.attr("cx", pos_mapX*1+100).attr("cy",pos_mapY*1+100)
			.attr("r", 200)
			.attr("id","lum_mer")
			.style("fill", "url(#white_light)")
		
		///Géographie
		var gratLines = globe.append("g").attr("id","graticule").selectAll(".gratLines") 
			.data(graticule.lines) 
			.enter() 
			.append("path")
			.attr("class", "gratLines")
			.attr("d", path)
			.attr("fill","none")
			.attr("stroke",nuancier[0])
			.attr("stroke-width",0.6)
		
		var pays = globe.selectAll(".pays")  
			.data(topojson.feature(dataPays,
				dataPays.objects.countries).features)
			.enter() 
			.append("path") 
			.attr("d", path) 
			.attr("stroke",nuancier[0])
			.attr("stroke-width",0.6)
			.style("cursor","pointer")
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
			.attr("nom",function(d){
				var code = this.attributes.code.value;
				for(i=0;i<dataPower.length;i++){
					if(dataPower[i].code==code){
						val = dataPower[i].nom;
						d3.select(this).attr("visa_free",dataPower[i].visa_free);
						d3.select(this).attr("visa_arrival",dataPower[i].visa_arrival);
						d3.select(this).attr("visa_eTA",dataPower[i].visa_eTA);
					}
				}
				return val;
			})
			.attr("fill0",function(d){
				var code = this.attributes.code.value;
				var val;
				for(i=0;i<coast.length;i++){
					if(coast[i].code==code){
						val = coast[i].Quotient;
						d3.select(this).attr("medianGDP",coast[i].Median_GDP_per_capita/12);
						d3.select(this).attr("passeportfees",coast[i].Fees);
						d3.select(this).attr("quotient",coast[i].Quotient);
					}
				} 
				fl = "";
				for(v=0;v<discretQuot.length;v++){
					if(val > discretQuot[v]){
						fl=nuancierQuot[v];
					}
				}
				if(fl==""){
					fl=nuancier[2]
				}
				return fl;
			})
			
			.attr("fill",function(){
				return this.attributes.fill0.value;
			})
			.on("click",function(){
				affiPower(this.attributes);
			})
			.attr("id", function(){
				var val = this.attributes.code.value;
				return val;
			})
			.attr("superficie",function(d){
				var code = this.attributes.code.value;
				for(i=0;i<supers.length;i++){
					if(supers[i].CNTR_ID==code){
						val = supers[i].superficie;
					}
				}
				
				super_total =val*1+super_total*1;
				return val;
			})
			// .attr("centre",function(d,i){
				// var centro = path.centroid(d);
				// return centro;
			// })
			.attr("class",function(){
				var val = this.attributes.code.value;
				return val+" pays";
			})
			.on("mouseover",function(d,i){
				var val = this.attributes.nom.value;
				d3.select("#indic").html(val);
			})
		///Miroir et lumière			
		miroir.append("rect")
			.attr("x",0)
			.attr("y",0)
			.attr("width",1600)
			.attr("height",600)
			.attr("fill",nuancier[1])
			.attr("id","surface_mir")
		
		miroir.append("clipPath")
			.attr("id","miroir_clip")
			.append("use")
			.attr("xlink:href","#surface_mir")
			
		miroir.append("circle")
			.attr("cx",1200)
			.attr("cy",260)
			.attr("r",500)
			.attr("fill","url(#white_light)")
			.attr("clip-path","url(#miroir_clip)")
			
		///Copies
		copie2.append("use")
			.attr("xlink:href","#legende")
			.attr("x",0)
			.attr("y",0)
			.attr("id","clone_legende")
			.attr("transform","translate(4,-1.5)")
		
		copie2.append("use")
			.attr("xlink:href","#titre_pays")
			.attr("x",0)
			.attr("y",0)
			.attr("id","clone_titrepays")
			.attr("transform","translate(4,-1.5)")
		
		copie2.append("use")
			.attr("xlink:href","#super")
			.attr("x",0)
			.attr("y",0)
			.attr("id","clone_super")
			.attr("transform","translate(4,-1.5)")
			
		copie.append("use")
			.attr("xlink:href","#lamer")
			.attr("x",0)
			.attr("y",0)
			.attr("id","clone_lamer")
			
		// copieB.append("use")
			// .attr("xlink:href","#echelle")
			// .attr("x",0)
			// .attr("y",0)
			// .attr("id","clone_echelle")
			
		copieB.append("use")
			.attr("xlink:href","#echelle_aff")
			.attr("x",0)
			.attr("y",0)
			.attr("id","clone_echelleaff")

		var path = d3.geo.path() 
			.projection(proj2);
		
		var gratLines = copie.append("g").attr("id","graticule2").selectAll(".gratLines") 
			.data(graticule.lines) 
			.enter() 
			.append("path")
			.attr("class", "gratLines")
			.attr("d", path)
			.attr("fill","none")
			.attr("stroke",nuancier[0])
			.attr("stroke-width",0.6)		
			
		var pays2 = copie.selectAll(".pays")  
			.data(topojson.feature(dataPays,
				dataPays.objects.countries).features)
			.enter() 
			.append("path") 
			.attr("d", path)
			.attr("stroke",nuancier[0])
			.attr("stroke-width",0.6)
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
			.attr("class",function(){
				var val = this.attributes.code.value;
				return val+" pays2";
			})
			.attr("fill0",function(d){
				var code = this.attributes.code.value;
				var val;
				for(i=0;i<coast.length;i++){
					if(coast[i].code==code){
						val = coast[i].Quotient;
						d3.select(this).attr("medianGDP",coast[i].Median_GDP_per_capita/12);
						d3.select(this).attr("passeportfees",coast[i].Fees);
						d3.select(this).attr("quotient",coast[i].Quotient);
					}
				} 
				fl = "";
				for(v=0;v<discretQuot.length;v++){
					if(val > discretQuot[v]){
						fl=nuancierQuot[v];
					}
				}
				if(fl==""){
					fl=nuancier[2]
				}
				return fl;
			})
			
			.attr("fill",function(){
				return this.attributes.fill0.value;
			})
			
	
		///Titre
		map.append("text")
			.attr("x",400)
			.attr("y",-10)
			.text("TITRE")
			.attr("font-size",24)
		
		map.append("text")
			.attr("x",1350)
			.attr("y",95)
			.attr("font-size",22)
			.attr("font-weight",600)
			.attr("id","titre_pays")

		map.append("text")
			.attr("x",0)
			.attr("y",0)
			.attr("font-size",15)
			.attr("font-weight",600)
			.attr("id","indic")
			
		///Légende
		legende_coast=legende.append("g").attr("id","legende_coast").on("click",function(){raz()}).style("cursor","pointer").attr("opacity",1)
		legende_power=legende.append("g").attr("id","legende_power").attr("opacity",0.1)
	
		makeLegend("Coût d'un passeport en pourcentage du salaire moyen",legende_coast,1200,70,discretQuot,nuancierQuot,true)
		makeLegend("Accès privilégié",legende_power,1350,150,discretPower,nuancierPower,false)
		
		values_circle=["RU","FR"];
		legende_super = legende.append("g").attr("id","legende_super").attr("opacity",0.1)
		
		legende_super.selectAll("circle")
			.data(values_circle)
			.enter()
			.append("circle")
			.attr("r",function(d){
				var ar = document.getElementById(d).attributes.superficie.value;
				var m = Math.sqrt(ar/Math.PI)
				var val = m*scale/rayon_terre;
				return val;
			})
			.attr("cx",1350)
			.attr("cy",400)
			.attr("fill","none")
			.attr("stroke",nuancier[4])
			.attr("stroke-width",1)
			
		legende_super.selectAll("text")
			.data(values_circle)
			.enter()
			.append("text")
			.attr("y",function(d){
				var ar = document.getElementById(d).attributes.superficie.value;
				
				var m = Math.sqrt(ar/Math.PI)
				var val = m*scale/rayon_terre;
				return 420+val*1;
			})
			.attr("x",1300)
			.text(function(d){
				var ar = document.getElementById(d).attributes.superficie.value;
				var nom = document.getElementById(d).attributes.nom.value;
				return Math.round(ar/1000000)+" km² ("+nom+")";
			})
		
		///echelle
		var lmil = 55.5999755859375;
		var lcote= 19.20001220703125;
		var ltotal = 640;
		var ls_flech = [];
		
		var vit=300;
		
		var proj3 = proj;
		proj3.rotate([0,0]);
		var path_e = d3.geo.path().projection(proj3);
		var graticule_e = d3.geo.graticule().step([10,10]); 	
		
		// echelle.append("circle")
			// .attr("cx", pos_mapX).attr("cy", pos_mapY)
			// .attr("r", proj.scale())
			// .attr("fill",nuancier[0])
			// .attr("opacity",0.85)
		
		echelle.append("rect")
			.attr("x",0)
			.attr("y",0)
			.attr("width",1600)
			.attr("height",600)
			.attr("fill",nuancier[0])
			.attr("opacity",0.85)
		
		echelle.append("g").attr("id","graticule_echelle").selectAll(".gratLines") 
			.data(graticule_e.lines) 
			.enter() 
			.append("path")
			.attr("class", "gratLines")
			.attr("d", path_e)
			.attr("fill","none")
			.attr("stroke",nuancier[2])
			.attr("stroke-width",0.6)
			
		////création des lignes
		echelle.append("line").attr("y1",pos_mapY).attr("y2",pos_mapY).attr("stroke",nuancier[5]).attr("stroke-width",3)
			.attr("x1",pos_mapX-lmil)
			.attr("x2",pos_mapX*1+lmil*1)
		
		echelle.append("line").attr("y1",pos_mapY).attr("y2",pos_mapY).attr("stroke",nuancier[5]).attr("stroke-width",3)
			.attr("x1",pos_mapX*1+proj.scale())
			.attr("x2",pos_mapX*1+proj.scale()-lcote)
			
		echelle.append("line").attr("x1",pos_mapX).attr("x2",pos_mapX).attr("stroke",nuancier[5]).attr("stroke-width",3)
			.attr("y1",pos_mapY-lmil)
			.attr("y2",pos_mapY*1+lmil*1)
		
		echelle.append("line").attr("x1",pos_mapX).attr("x2",pos_mapX).attr("stroke",nuancier[5]).attr("stroke-width",3)
			.attr("y1",pos_mapY*1-proj.scale())
			.attr("y2",pos_mapY*1-proj.scale()*1+lcote*1)
			
		//création des flèches
		echelle.selectAll("line")
			.each(function(){
				var x1 = this.attributes.x1.value;
				var y1 = this.attributes.y1.value;
				var x2 = this.attributes.x2.value;
				var y2 = this.attributes.y2.value;
				ls_flech.push([x1,y1])
				ls_flech.push([x2,y2])
			})
			
			
		ctrTxX = pos_mapX*1+proj.scale()/2-20;
		ctrTxY = pos_mapY-proj.scale()*1+20;

		echelle.selectAll(".flech_ech")
			.data(ls_flech)
			.enter()
			.append("line")
			.attr("class","flech_ech")
			.attr("x1",ctrTxX*1)
			.attr("y1",ctrTxY)
			.attr("x2",function(d){
				return d[0]
			})
			.attr("y2",function(d){
				return d[1]
			})
			.attr("stroke",nuancier[4])
			.attr("stroke-width",0.2)
			.attr("stroke-dasharray","0 400")
		
		//bouton
		echelle_aff.append("text")
			.attr("x",ctrTxX)
			.attr("y",ctrTxY)
			.text("Voir l'échelle")
			.attr("font-family",'Roboto')
			.attr("fill",nuancier[4])
			.style("cursor","crosshair")
			.on("mouseover",function(){
				d3.select(this)
					.transition().duration(vit).attr("fill",nuancier[5]).attr("font-family",'RobotoBold').text("625 000 kilomètres")
					
				d3.select("#echelle")
					.attr("display","block")
					.transition().duration(vit).attr("opacity",1)
				
				d3.selectAll(".flech_ech")
					.transition().duration(vit).delay(vit/2).attr("stroke-dasharray","400 0")
					
			})
			.on("mouseout",function(){
				d3.select(this)
					.transition().duration(vit).attr("fill",nuancier[4]).attr("font-family",'Roboto').text("Voir l'échelle")
				
				d3.select("#echelle")
					.transition().duration(vit).attr("opacity",0)
					.transition().delay(vit).attr("display","none")
				
				d3.selectAll(".flech_ech")
					.transition().duration(vit).attr("stroke-dasharray","0 400")
					
			})
}

function makeLegend(titre, obj,debX,debY,discret,nuanc,inter){
	wCa = 20;
	
	obj.append("text")
		.attr("x",debX)
		.attr("y",debY-20)
		.text(titre)
	
	obj.selectAll(".eltQuot")
		.data(discret)
		.enter()
		.append("text")
		.attr("x",debX*1+wCa*1.2)
		.attr("y",function(d,i){
			if(inter==true){
				return debY*1+3+wCa*1.2*i;
			} else {
				return debY*1+15+wCa*1.2*i;
			}
		})
		.text(function(d){
			if(discret == discretQuot){
				return (d*100)+" %"
			} else {
				return d
			}
		})
		
	obj.selectAll(".eltQuot")
		.data(nuanc)
		.enter()
		.append("rect")
		.attr("x",debX)
		.attr("y",function(d,i){
			return debY*1+wCa*1.2*i;
		})
		.attr("width",wCa)
		.attr("height",wCa)
		.attr("fill",function(d){
			return d
		})
}
		
function raz(){
	d3.select("#legende_coast").transition().duration(200).attr("opacity",1)
	d3.select("#legende_power").transition().duration(200).attr("opacity",0.1)
	d3.select("#legende_super").transition().duration(200).attr("opacity",0.1)
	d3.select("#titre_pays").text("")
	d3.select("#super").selectAll(".del_su").remove();
	d3.selectAll(".pays").transition().duration(200).attr("fill",function(){return this.attributes.fill0.value}).attr("stroke",nuancier[0]);
	d3.selectAll(".pays2").transition().duration(200).attr("fill",function(){return this.attributes.fill0.value}).attr("stroke",nuancier[0]); //a la place faire les couleurs par défaut et mettre un fill0
}

function dragMap(){
	var drag = d3.behavior.drag() //fonction "drag" veut dire que tu fais bouger l'objet en l'attrapant
		.on("drag", function(d) {
			d3.select(this).style("cursor","grabbing");	
			d.x += d3.event.dx/2;
			d.y += -d3.event.dy/2;
			// d3.select("#indic").text(d.y); //faudrait régler
			
			proj.rotate([d.x,d.y])
			var path = d3.geo.path().projection(proj);
			d3.select("#map").selectAll(".pays")  
				.attr("d", path)
			d3.select("#graticule").selectAll(".gratLines") 
				.attr("d", path)
				
			proj2.rotate([d.x-180,-d.y])
			var path = d3.geo.path().projection(proj2);
			d3.select("#copie").selectAll(".pays2")  
				.attr("d", path)
			d3.select("#graticule2").selectAll(".gratLines") 
				.attr("d", path)
		})
		.on("dragend", function(d){
			d3.select(this).style("cursor","grab");	
			// alert(d.x+" , -"+d.y);
		})
	d3.select("#globe").data([{"x":-50,"y":-20}]).call(drag).style("cursor","grab");	
}

function affiPower(obj){
	
	///Général
	var nom = obj.nom.value;
	d3.select("#titre_pays").text(nom);
	d3.selectAll(".pays").attr("fill",nuancierPower[3]).attr("stroke",nuancier[0])
	d3.selectAll(".pays2").attr("fill",nuancierPower[3]).attr("stroke",nuancier[0])
	
	d3.selectAll("."+obj.id.value).attr("fill","none").attr("stroke",nuancier[4])
	
	d3.select("#legende_coast").transition().duration(200).attr("opacity",0.1)
	d3.select("#legende_power").transition().duration(200).attr("opacity",1)
	d3.select("#legende_super").transition().duration(200).attr("opacity",1)
	
	if(obj.visa_free){
		var ls_vf = (obj.visa_free.value).split("_");
	
		var ls_voa = (obj.visa_arrival.value).split("_");
		var ls_eta = (obj.visa_eTA.value).split("_");
		
		var super_vf = 0;
		var super_voa = 0;
		var super_eta = 0;	
		var ls_super_vf = [];
		var ls_super_voa = [];
		var ls_super_eta = [];
		
		for(i=0;i<ls_vf.length;i++){
			code = ls_vf[i];
			if(document.getElementById(code)){
				var s = document.getElementById(code).attributes.superficie.value;
				super_vf=super_vf*1+s*1;
				ls_super_vf.push(s);
			}
			d3.selectAll("."+code).transition().duration(500).attr("fill",nuancierPower[0])
		}
		for(j=0;j<ls_voa.length;j++){
			code = ls_voa[j];
			if(document.getElementById(code)){
				var s = document.getElementById(code).attributes.superficie.value;
				super_voa=super_voa*1+s*1;
				ls_super_voa.push(s);
			}
			d3.selectAll("."+code).transition().duration(500).attr("fill",nuancierPower[1])
		}
		for(k=0;k<ls_eta.length;k++){
			code = ls_eta[k];
			if(document.getElementById(code)){
				var s = document.getElementById(code).attributes.superficie.value;
				super_eta=super_eta*1+s*1;
				ls_super_eta.push(s);
			}
			d3.selectAll("."+code).transition().duration(500).attr("fill",nuancierPower[2])
		}
		
		makeSuperficie([super_vf,super_voa,super_eta],[ls_super_vf,ls_super_voa,ls_super_eta]);
	} else {
		console.log("ERROR" + obj.id.value)
	}
}

function makeSuperficie(values,listes){
	posenX=1350;
	posenY=650;
	pourc_total=0;
	d3.select("#super").selectAll(".del_su").remove();
		
	///v1
	for(i=0;i<values.length;i++){
		d3.select("#super")	
			.append("g")
			.attr("id","g_cam"+i)
			.attr("class","del_su")
		
		d3.select("#super")	
			.append("g")
			.attr("id","g_su"+i)
			.attr("opacity",0)
			.attr("class","del_su")
			.append("circle")
			.attr("id","cc"+i)
			.attr("r",function(){
				var ar = values[i]
				var m = Math.sqrt(ar/Math.PI)
				var val = m*scale/rayon_terre;
				return val;
			})
			.attr("stroke",nuancierPower[i])
			.attr("stroke-width",2)
			.attr("fill",nuancier[0])
			.attr("opacity",1)
			.attr("cx",posenX)
			.attr("cy",posenY)
			.attr("fill-opacity",0.5)
			
			
		var payss = listes[i];
		total=0;
		for(p=0;p<payss.length;p++){
			part=payss[p]/values[i];
			total=total*1+part*1;
			d3.select("#g_su"+i)
				.append("line")
				.attr("x1",posenX)
				.attr("x2",posenX)
				.attr("y1",function(){
					var val = document.getElementById("cc"+i).attributes.r.value;
					return posenY-val;
				})
				.attr("y2",posenY)
				.attr("stroke",nuancierPower[i])
				.attr("stroke-width",0.5)
				.attr("transform",function(){
					var center = " "+this.attributes.x1.value+" "+this.attributes.y2.value;
					var ro=total*360;
					return "rotate("+ro+center+")"
				})
		}
	
		///Camemberts
		var met = Math.sqrt(super_total/Math.PI);
		var rtotal = met*scale/rayon_terre;
		var pourc = 100*values[i]/super_total;
		
		console.log(pourc_total+" "+pourc);
		majCam(pourc,i,nuancierPower[i],1000,posenY,rtotal,"g_cam"+i,pourc_total)
		
		///maj values
		var r = document.getElementById("cc"+i).attributes.r.value;
		// posenX= posenX*1+r*2;
		pourc_total = pourc_total + pourc;
	}

	
};

function majCam(valPerc, nb, couleur,centreX,centreY,r,ID,tot){
	console.log(valPerc+" "+ nb+" "+ couleur+" "+centreX+" "+centreY+" "+r+" "+ID)
	// d3.select("#super").selectAll(".debitDroite").attr("class","rond");
	// d3.select("#part"+nb).remove();
	
	var angle = (2*Math.PI)*valPerc/100;
	// var degres = 360*valPerc/100;
	// var angle = (Math.PI/180)*degres;
	
	var ax  = centreX + (r * Math.cos(Math.PI*2));
	var ay  = centreY + (r * Math.sin(Math.PI*2));
	var bx  = centreX + (r * Math.cos(angle)) -ax;
	var by  = centreY + (r * Math.sin(angle)) - ay;
	
	
	//alert(ax+" "+ay+" "+bx+" "+by);
	d3.select("#"+ID)
		.append("path")
		.attr("d", function(){
			if(valPerc<=50){
				return "m"+ax+" "+ay+" a"+r+" "+r+", 0, 0, 1, "+bx+" "+by+" L"+centreX+" "+centreY+" z"
			} else {
				
				return "m"+ax+" "+ay+" a"+r+" "+r+", 0, 1, 1, "+bx+" "+by +" L"+centreX+" "+centreY+" z"
			}	
		})
		//.attr("d", "m"+ax+" "+ay+" a"+r+" "+r+", 0, 0, 0, "+bx+" "+by +" L"+centreX+" "+centreY+" z")
		.attr("class", "rond")
		.attr("id","part"+nb)
		.attr("nb",nb)
		.attr("pourc",valPerc)
		.attr("stroke",couleur)
		.attr("fill","none")
		// .style("transform-origin", centreX+"px "+centreY+"px")
		.attr("transform",function(){
			var val  = 180+tot*360/100;
			return "rotate("+val+" "+centreX+" "+centreY+")"
		})
		.attr("fill",nuancier[0])
		.attr("fill-opacity",0.5)
		.style("cursor","crosshair")
		.on("mouseover",function(){
			var nb=this.attributes.nb.value;
			d3.selectAll(".rond").transition().duration(500).attr("opacity",0.1)
			d3.select(this).transition().duration(500).attr("opacity",1)
			d3.select("#g_su"+nb).transition().duration(500).attr("opacity",1)
		})
		.on("mouseout",function(){
			var nb=this.attributes.nb.value;
			d3.selectAll(".rond").transition().duration(500).attr("opacity",1)
			
			d3.select("#g_su"+nb).transition().duration(500).attr("opacity",0)
		})
	
	d3.select("#draw").selectAll(".rond").attr("class","debitDroite");
}

