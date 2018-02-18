///        ------        variables        ------        ///

///Etapes du trajet

var scrollTime=0,

//vue
vbH=550,
vbW=1190.5,
vbY=50,
vbX=[0,30,60,90,10,-30],
av=true,

//texte accompagnant
ls_trans=[[230,230],[190,95],[190,95],[190,110],[150,300],[150,300]],

//trace
way=0,
km=0,
way_km=0,
pl_traces=[0],
deplace=false,
deplace_rond=false,
deplace2=false,
deplace2_rond=false,
// echell=31.9,
echell=28.2,

//dynamique
lengthOp=175,
vit=9;

//horloge
ctr_hor=[452.9,245.9],
heure=6.5,
H=6.5,
palliers=[6.5,6.5,7.5,9.25,(9*1+35/60),10.5,11.5],
px_h=1174.582214,
bloc_debut=[0,0,1.400295568,0,0.10883186,0.5740891] //temps de blocage par début de trajet (h) -> voir fichier xlsx 'trajets'
bloc_fin=[0,0.775980515,0.247110983,0,0.616713871,0.101309841]//temps de blocage par fin de trajet(h) -> voir fichier xlsx 'trajets'

///Elements de la carte
parts_legende = ["routes","mur","postes"],
flechee=false;

///        ------        fonctions       ------        ///

///général
window.onload = initialize();
function initialize(){
	//adapter à la configuration W/H
	window.onresize=function(){
		resize();
	}
	//au démarrage
	resize(); 
	demarrer();
}

///fonctions au démarrage
//affichage
function resize(){
	//blocage du scroll
	var coefff = 2.09;
	if(window.innerWidth/window.innerHeight>coefff){
		var val = 100*coefff*(window.innerHeight/window.innerWidth)
		d3.select("#dessins")
			.style("width",val+"%")
	}else{
		d3.select("#dessins")
			.style("width","99.5%")
	}
	
	//adaptation de la taille des textes <html> en fonction de la largeur de la page
	widthPop = document.getElementById("dessins").offsetWidth;
	var val = widthPop/126.8;
	var val2 = widthPop/63;
	d3.selectAll(".src")
		.style("font-size",val+"px")
	d3.select("#indication_debut")
		.style("font-size",val2+"px")
		
}

//évènements
function demarrer(){
	d3.select("#bouton_l")
		.on("click",function(){
			//interactivité de la carte _ commence lorsque tout est affiché et après les premières instructions
			setTimeout(function(){
				scrollTo(0,0); //remise à 0 de la position du scroll (securite)
				variables(); //implementation des variables globales (recherche des chemins)
				scrollable(); //évènements au scroll
				boutons(); //évènements au clic - boutons
				zooms(); //évènements au clic - zoom
				
				//deuxième indication de scroll
				d3.select("#fleche").transition().delay(2000).duration(650).attr("transform","translate(0,450)").transition().attr("class","clignote")
				d3.select("#cible_caisson").transition().delay(2000).attr("class","clignote").transition().delay(5000).attr("class","")
				d3.select("#boutons").transition().delay(2000).attr("class","clignote").transition().delay(5000).attr("class","")
				
			},2500)
			
			//cercles montrant le temps d'attente
			d3.select("#debutt").transition().duration(200).attr("opacity",0).transition().remove() 
			
			//agrandissement de l'image par défaut
			x = document.getElementById("inner_img").offsetLeft;
			w = document.getElementById("inner_img").offsetWidth;
			W = document.getElementById("globale").offsetWidth;
			d3.select("#inner_img").style("margin-left",x+"px").style("opacity",1).style("width",w+"px").transition().duration(1000).style("margin-left","0px").style("width",(W)+"px").style("opacity",0).transition().remove();
			
			//curseur par défaut
			d3.select("body").attr("class","descendre");
			
			//affichage des figures définitives
			d3.select("#div_svg").style("display","block")
			d3.select("#svg_scroll").transition().delay(750).duration(800).attr("opacity",1); 
			d3.select("#svg_fix").transition().delay(750).duration(1000).attr("opacity",1);
			// d3.select("#bloc_src").transition().delay(700).duration(1000).style("opacity",1);
			
			
			//adaptation de la vue et de la position du texte par défaut
			var Y=document.getElementById("point_0").attributes.cy.value;
			vb=(vbX[0])+" "+(Y-vbH/2)+" "+vbW+" "+vbH;
			d3.select("#svg_scroll").attr("viewBox",vb)
			trans=ls_trans[0]
			d3.select("#informations_etape").attr("transform","scale(0.85) translate("+trans[0]+","+trans[1]+")")			
		})
}

///implementation des variables globales (recherche des chemins)
function variables(){
	for(i=1;i<6;i++){
		l = d3.select("#trace_"+i).node().getTotalLength(); //longueur des tracé
		console.log("longueur du chemin "+i+" : "+l);
		d3.select("#trace_"+i).attr("stroke-dasharray","0,"+l);
		pl_traces.push(l*1+2*lengthOp); //ajout des tracés fictifs (affichage progressif des étapes)
	}
}

///évènements au scroll
function scrollable(){
	
	//indication du lien entre la carte et les étapes à droite : évènement ponctuel qui sera répété
	trans=ls_trans[0]
	var X=document.getElementById("point_0").attributes.cx.value;
	var Y=document.getElementById("point_0").attributes.cy0.value;
	
	d3.select("#legende_etape")
		.attr("opacity",0.65)
		.selectAll("circle")
		.attr("cx",X)
		.attr("cy",Y)
		.transition()
		.duration(1000)
		.attr("cx",935)
		.attr("cy",185)
		
	d3.select("#grad_leg")
		.attr("cx",X)
		.attr("cy",Y)
		.transition()
		.duration(1000)
		.attr("cx",935)
		.attr("cy",185)
		
	d3.select("#legende_etape")
		.attr("transform","")
		
		.transition()
		.duration(1000)
		.attr("transform","scale(0.85) translate("+(trans[0])+","+(trans[1])+")")
						
	//fonctionnement des évènements au scroll
	scrollTime=1;  //variable d'étape par défaut
	way=lengthOp*0.75;  //variable du trajet par défaut
	window.addEventListener("wheel", function (e){
		scrollanim2(e);
	}, false);
}

///évènements au clic - boutons
function boutons(){	
	
	//afficher/masquer les éléments de la légende
	for(i=0;i<parts_legende.length;i++){
		nom=parts_legende[i];
		
		d3.select("#tout_"+nom)
			.each(function(){
				d3.select(this).attr("lock","false")
				d3.selectAll(".elements_"+nom).transition().duration(1400).attr("opacity",0)

				d3.select(this).select(".bou")
					.transition()
					.duration(1400)
					.attr("transform","translate(-17,0)")
				d3.select(this)
					.transition()
					.delay(1000)
					.selectAll(".ti")
					.attr("fill",function(){
						var val = this.attributes.fill_off.value;
						return val;
					})					
			})
			.style("cursor","pointer")
			.on("click",function(){
				nom = (this.id).split("_")[1];
				tst = this.attributes.lock.value;
				if(tst=="false"){
					d3.select(this).attr("lock","true")
					d3.selectAll(".elements_"+nom).transition().duration(400).attr("opacity",1)	

					d3.select(this).select(".bou")
						.transition()
						.duration(400)
						.attr("transform","")
					d3.select(this)
						.selectAll(".ti")
						.attr("fill",function(){
							var val = this.attributes.fill_on.value;
							return val;
						})
					
				} else {
					d3.select(this).attr("lock","false")
					d3.selectAll(".elements_"+nom).transition().duration(400).attr("opacity",0)

					d3.select(this).select(".bou")
						.transition()
						.duration(400)
						.attr("transform","translate(-17,0)")
					d3.select(this)
						.transition()
						.selectAll(".ti")
						.attr("fill",function(){
							var val = this.attributes.fill_off.value;
							return val;
						})					
				}
			})
			.on("mouseover",function(){
				d3.select("#boutons").attr("class","")
				nom = (this.id).split("_")[1];
				d3.select("#legende_"+nom)
					.attr("opacity",0.75)
			})
			.on("mouseout",function(){
				nom = (this.id).split("_")[1];
				d3.select("#legende_"+nom)
					.attr("opacity",1)
			})
	
	}

	//afficher l'aide (instructions de fonctionnement de la carte)
	d3.select("#aide")
		.style("cursor","default")
	
	d3.select("#bout_aide")
		.style("cursor","pointer")
		.on("mouseover",function(){
			d3.select(this).attr("opacity",1)

		})
		.on("mouseout",function(){
			d3.select(this).attr("opacity",0.3)
		})
		.on("click",function(){
			d3.select("#rules").transition().duration(700).attr("transform","")
			d3.select(this).attr("display","none")
		})

	d3.select("#retour_aide")
		.style("cursor","pointer")
		.on("click",function(){
			d3.select("#rules").transition().duration(700).attr("transform","translate(0,-200)")
			d3.select("#bout_aide").attr("display","block")
		})
		.on("mouseover",function(){
			d3.select(this).attr("opacity",1)
		})
		.on("mouseout",function(){
			d3.select(this).attr("opacity",0.6)
		})
}

///évènements au clic - zooms
function zooms(){
	
	//sources - agrandie par défaut
	// d3.select("#sources_tout")
		// .style("cursor","zoom-out")
		// .attr("zm","in")
		// .on("click",function(){
			// d3.select("#cible_caisson").attr("class","")
				
			// zm = this.attributes.zm.value;
			// if(zm=="out"){
				// d3.select(this)
					// .attr("zm","in")
					// .style("cursor","zoom-out")
				
				// d3.select("#keffieh")
					// .transition()
					// .duration(700)
					// .attr("transform","scale(2.6) translate(-588,100)")
				
				// d3.select("#sources_total")
					// .transition()
					// .duration(700)
					// .attr("opacity",1)
				// d3.select("#sources_icone")
					// .transition()
					// .duration(700)
					// .attr("opacity",0)
				
			// } else {
				// d3.select(this)
					// .attr("zm","out")
					// .style("cursor","zoom-in")
				
				// d3.select("#keffieh")
					// .transition()
					// .duration(700)
					// .attr("transform","translate(130,550)")
				
				// d3.select("#sources_total")
					// .transition()
					// .duration(700)
					// .attr("opacity",0)
				// d3.select("#sources_icone")
					// .transition()
					// .duration(700)
					// .attr("opacity",1)
			// }
		// })
		
	//caisson - réduit par défaut
	d3.select("#tout_caisson")
		.style("cursor","zoom-in")
		.attr("zm","out")
		.on("click",function(){
			d3.select("#cible_caisson").attr("class","")
				
			zm = this.attributes.zm.value;
			if(zm=="out"){
				d3.select(this)
					.attr("zm","in")
					.style("cursor","zoom-out")
					.transition()
					.duration(700)
					.attr("transform","translate(-275,-120),scale(1.25,1.25)")
				
				d3.select("#cible_caisson")
					.transition()
					.duration(700)
					.attr("opacity",0)
			} else {
				d3.select(this)
					.attr("zm","out")
					.style("cursor","zoom-in")
					.transition()
					.duration(700)
					.attr("transform","scale(0.255) translate(2500,550)")
				
				d3.select("#cible_caisson")
					.transition()
					.duration(700)
					.attr("opacity",0.95)
			}
		})
}

///fonctionnement des évènements au scroll
function scrollanim2(e){
	if(flechee==false){
		flechee=true;
		d3.select("#fleche").attr("class","").transition().duration(300).attr("transform","translate(0,500)").transition().remove();
	
	}
			
	var L=pl_traces[scrollTime];
	
	///ALLER
	if(e.deltaY>0&&av==true){
		if(scrollTime>5&&(way>=L||way==0)){
			d3.select("body").attr("class","monter")
		} else {
			d3.select("body").attr("class","deux_sens")
		
			op=0;
			op2=0;
			way=way*1+vit*1;		
			if(way<lengthOp){
				d3.select("#k_"+(scrollTime-1)).attr("opacity",function(){
					op = way/lengthOp;
					console.log("op : "+op);
					if (op>1){
						op=1;
					}
					op=Math.sqrt(1-op);
					console.log("opok : "+op);
					return op;
				})
				d3.select("#info_tous")
					.attr("opacity",op)
				d3.select("#legende_etape") 
					.attr("opacity",op)
				d3.select("#roue").attr("opacity",0)
				
				//maj_heures
				H=palliers[scrollTime];
				heure=H*1+(bloc_debut[scrollTime])*(way*1)/lengthOp; //changer la variable H
				d3.select("#test_h").text(heure);
				d3.select("#test_t").text("1 : "+H);
				angle_min=heure*360;
				angle_h=heure*30;
				d3.select("#grande_aiguille").attr("transform","rotate("+angle_min+" "+ctr_hor[0]+" "+ctr_hor[1]+")")
				d3.select("#petite_aiguille").attr("transform","rotate("+angle_h+" "+ctr_hor[0]+" "+ctr_hor[1]+")")
				//
				
				
			} else if(way<(L-lengthOp)){
				d3.select("#lum_pt"+(scrollTime-1)+"_plus").attr("opacity",0)
				d3.select("#lum_pt"+(scrollTime-1)).attr("opacity",1)
				
				d3.select("#info_tous").attr("opacity",0)
				d3.select("#legende_etape").attr("opacity",0)
				d3.select("#k_"+(scrollTime-1)).attr("opacity",0);
				d3.select("#trace_"+scrollTime).attr("stroke-dasharray",(way-lengthOp)+","+(L-way+lengthOp*1)).attr("opacity",1).attr("stroke","#92C020")//.attr("stroke","#0_0A055")//.attr("stroke","#4_8927F")
				
				//km
				way_km = way_km*1+vit*1;
				km=Math.trunc(way_km/echell);
				// d3.selectAll(".route_a")
					// .attr("transform",function(){
						// var val = 320*way/L;
						// var y1 = this.attributes.y1.value;
						// var y2 = this.attributes.y2.value;
						// if(way>y2){
							// return "translate(0,"+(val-320)+")";
						// } else {
							// return "translate(0,"+val+")";
						// }
					// })
					
				// maj_heures
				heure=heure*1+vit/px_h;
				d3.select("#nbkm").text(km).attr("transform",function(){
					if(km<10){
						return "matrix(1 0 0 1 304.0847 266.6378)"
					} else {
						return "matrix(1 0 0 1 295.4929 266.6378)"
					}
				})
				d3.select("#test_h").text(heure);
				d3.select("#test_t").text("2 : "+H);
				angle_min=heure*360;
				angle_h=heure*30;
				d3.select("#grande_aiguille").attr("transform","rotate("+angle_min+" "+ctr_hor[0]+" "+ctr_hor[1]+")")
				d3.select("#petite_aiguille").attr("transform","rotate("+angle_h+" "+ctr_hor[0]+" "+ctr_hor[1]+")")
				//
				
				d3.select("#roue").attr("opacity",0.5) 
					.attr("transform",function(){
						var r = ((this.attributes.transform.value).split("(")[1]).split(" ")[0];
						return "rotate("+(r*1+vit*0.5)+" 98.4 98.4)"
					})
				
			} else if(way<L){

				//maj_heures
				H=palliers[scrollTime*1]*1+(L-lengthOp*2)/px_h+bloc_debut[scrollTime]*1;
				heure=H*1+(bloc_fin[scrollTime])*(way*1-L+lengthOp*1)/lengthOp; //changer la variable H
				d3.select("#test_h").text(heure);
				d3.select("#test_t").text("3 : "+H);
				angle_min=heure*360;
				angle_h=heure*30;
				d3.select("#grande_aiguille").attr("transform","rotate("+angle_min+" "+ctr_hor[0]+" "+ctr_hor[1]+")")
				d3.select("#petite_aiguille").attr("transform","rotate("+angle_h+" "+ctr_hor[0]+" "+ctr_hor[1]+")")
				//
				
				d3.select("#roue").attr("opacity",0) 
				if(deplace==false&&document.getElementById("point_"+scrollTime)){ //retour
					var Y=document.getElementById("point_"+scrollTime).attributes.cy.value;
					vb=(vbX[scrollTime])+" "+(Y-vbH/2)+" "+vbW+" "+vbH;
					d3.select("#svg_scroll").transition().duration(800).attr("viewBox",vb)
					trans=ls_trans[scrollTime]
					d3.select("#informations_etape").transition().duration(800).attr("transform","scale(0.85) translate("+trans[0]+","+trans[1]+")")
					
					deplace=true;
					av=false;
					setTimeout(function(){av=true;},850)
				}
				if(way>((L-lengthOp)+(lengthOp/4))&&deplace_rond==false&&deplace==true){ 
					trans=ls_trans[scrollTime]
					var X=document.getElementById("point_"+scrollTime).attributes.cx.value*1-vbX[scrollTime]*1
					
					if(scrollTime==0){
						var Y=200+vbH/2-56.3;
					} else {
						var Y=200+vbH/2;
					}
					
					d3.select("#legende_etape")
						.attr("opacity",0.65)
						.selectAll("circle")
						.attr("cx",X)
						.attr("cy",Y)
						.transition()
						.duration(1000)
						.attr("cx",935)
						.attr("cy",185)
						
					d3.select("#grad_leg")
						.attr("cx",X)
						.attr("cy",Y)
						.transition()
						.duration(1000)
						.attr("cx",935)
						.attr("cy",185)
						
					d3.select("#legende_etape")
						.attr("transform","")
						
						.transition()
						.duration(1000)
						.attr("transform","scale(0.85) translate("+(trans[0])+","+(trans[1])+")")
						

					deplace_rond=true;
				}
				d3.select("#k_"+scrollTime).attr("opacity",function(){
					op2 = (L-way)/lengthOp;
					
					if (op2>1){
						op2=1;
					}
					console.log("op2 "+(1-op2))
					op2=Math.sqrt(1-op2);
					console.log("ok2 "+op2)
					return op2;
				})
				d3.select("#info_tous").attr("opacity",op2)
					
				d3.select("#etape_"+scrollTime).attr("opacity",op2)
				d3.select("#etape_"+scrollTime).selectAll("circle")
					.attr("r",function(){
						r = this.attributes.r0.value;
						return r*op2;
					})
				
				d3.select("#lum_pt"+scrollTime+"_plus").attr("opacity",op2)
				
										
				
			} else {
				d3.select("#roue").attr("opacity",0)
				d3.select("#k_"+scrollTime).attr("opacity",1);
				d3.select("#trace_"+scrollTime).transition().duration(200).attr("stroke","#ffffff").attr("opacity",0.35).attr("stroke-width",11.3386)

				d3.select("#contour"+(scrollTime-1)+"_plus").attr("display","none")
				
				d3.select("#contour"+scrollTime+"_plus").attr("display","block")
				d3.select("#contour"+scrollTime).attr("display","block")
				
				scrollTime++;
				
				way=0;
				deplace=false;
				deplace_rond=false;				
					
			}
		}
	} else if(av==true) { ///RETOUR
		if(scrollTime==0&&way<=0){
			d3.select("body").attr("class","descendre")
			
			way=0;

			
		} else {
			
			d3.select("body").attr("class","deux_sens")
			op=0;
			op2=0;
			way=way-vit;
			
			if(way>L-lengthOp){
				d3.select("#k_"+scrollTime).attr("opacity",function(){
					op2 = (L-way)/lengthOp;
					if (op2>1){
						op2=1;
					}
					op2=Math.sqrt(1-op2);
					return op2;
				})
				d3.select("#info_tous").attr("opacity",op2)
				d3.select("#legende_etape")
					.attr("opacity",op2)
				//////////////////////
	
				d3.select("#etape_"+scrollTime).attr("opacity",op2)
				d3.select("#etape_"+scrollTime).selectAll("circle")
					.attr("r",function(){
						r = this.attributes.r0.value;
						return r*op2;
					})
				
				d3.select("#lum_pt"+scrollTime+"_plus").attr("opacity",op2)
				d3.select("#roue").attr("opacity",0)
				
				
				//maj_heures
				H=palliers[scrollTime]*1+(L-lengthOp*2)/px_h+bloc_debut[scrollTime]*1;
				heure=H*1+(bloc_fin[scrollTime])*(way*1-L+lengthOp*1)/lengthOp; //changer la variable H
				d3.select("#test_h").text(heure);
				angle_min=heure*360;
				angle_h=heure*30;
				d3.select("#grande_aiguille").attr("transform","rotate("+angle_min+" "+ctr_hor[0]+" "+ctr_hor[1]+")")
				d3.select("#petite_aiguille").attr("transform","rotate("+angle_h+" "+ctr_hor[0]+" "+ctr_hor[1]+")")
				//	
				
			}else if(way>lengthOp){
				d3.select("#contour"+(scrollTime-1)+"_plus").attr("display","block")
				d3.select("#contour"+scrollTime).attr("display","none")
				d3.select("#contour"+scrollTime+"_plus").attr("display","none")
				
				
				d3.select("#info_tous").attr("opacity",0)
				d3.select("#legende_etape").attr("opacity",0)
				d3.select("#k_"+(scrollTime)).attr("opacity",0);
				d3.select("#trace_"+scrollTime).attr("stroke-dasharray",(way-lengthOp)+","+(L-way+lengthOp*1)).attr("opacity",1).attr("stroke","#92C020")
				
				d3.select("#roue").attr("opacity",0.5)
					.attr("transform",function(){
						var r = ((this.attributes.transform.value).split("(")[1]).split(" ")[0];
						return "rotate("+(r*1-vit*0.5)+" 98.4 98.4)"
					})
					
				//km
				way_km = way_km*1-vit*1;
				km=Math.trunc(way_km/echell);
				
				heure=heure*1-vit/px_h;
				// H=heure;
				d3.select("#nbkm").text(km).attr("transform",function(){
					if(km<10){
						return "matrix(1 0 0 1 304.0847 266.6378)"
					} else {
						return "matrix(1 0 0 1 295.4929 266.6378)"
					}
				})
				//maj_heures
				d3.select("#test_h").text(heure);
				angle_min=heure*360;
				angle_h=heure*30;
				d3.select("#grande_aiguille").attr("transform","rotate("+angle_min+" "+ctr_hor[0]+" "+ctr_hor[1]+")")
				d3.select("#petite_aiguille").attr("transform","rotate("+angle_h+" "+ctr_hor[0]+" "+ctr_hor[1]+")")
				//
				
			} else if(way>0){
				d3.select("#roue").attr("opacity",0)
				d3.select("#trace_"+scrollTime).attr("stroke-dasharray","0,"+(L-lengthOp*2)).attr("opacity",0).attr("stroke","#92C020")
				d3.select("#k_"+(scrollTime-1)).attr("opacity",function(){
					op = way/lengthOp;
					if (op>1){
						op=1;
					}
					op=Math.sqrt(1-op);
					return op;
				})
				d3.select("#info_tous").attr("opacity",op)
				
				//maj_heures
				H=palliers[scrollTime];
				heure=H*1+(bloc_debut[scrollTime])*(way)/lengthOp; //changer la variable H
				d3.select("#test_h").text(heure);

				angle_min=heure*360;
				angle_h=heure*30;
				d3.select("#grande_aiguille").attr("transform","rotate("+angle_min+" "+ctr_hor[0]+" "+ctr_hor[1]+")")
				d3.select("#petite_aiguille").attr("transform","rotate("+angle_h+" "+ctr_hor[0]+" "+ctr_hor[1]+")")
				//
				
				d3.select("#etape_"+scrollTime).attr("opacity",op)
				d3.select("#etape_"+scrollTime).selectAll("circle")
					.attr("r",function(){
						r = this.attributes.r0.value;
						return r*op;
					})
				
				if(deplace2==false&&document.getElementById("point_"+scrollTime)){ //retour
					var Y0=document.getElementById("point_"+(scrollTime-1)).attributes.cy.value;
					vb=(vbX[scrollTime-1])+" "+(Y0-vbH/2)+" "+vbW+" "+vbH;
					d3.select("#svg_scroll").transition().duration(800).attr("viewBox",vb)
					
					trans0=ls_trans[scrollTime-1]
					d3.select("#informations_etape").transition().duration(800).attr("transform","scale(0.85) translate("+trans0[0]+","+trans0[1]+")")
					deplace2=true;
					av=false;
					setTimeout(function(){av=true;},850)
				}
				if(way<(lengthOp-(lengthOp/4))&&deplace2_rond==false&&deplace2==true){ //retour
					
					trans=ls_trans[scrollTime-1]
					
					var X=document.getElementById("point_"+(scrollTime-1)).attributes.cx.value*1-vbX[scrollTime-1]*1

					if(scrollTime==1){
						var Y=200+vbH/2-56.3;
					} else {
						var Y=200+vbH/2;
					}
					
					d3.select("#legende_etape")
						.attr("opacity",0.65)
						.selectAll("circle")
						.attr("cx",X)
						.attr("cy",Y)
						.transition()
						.duration(1000)
						.attr("cx",935)
						.attr("cy",185)
						
					d3.select("#grad_leg")
						.attr("cx",X)
						.attr("cy",Y)
						.transition()
						.duration(1000)
						.attr("cx",935)
						.attr("cy",185)
						
					d3.select("#legende_etape")
						.attr("transform","")
						
						.transition()
						.duration(1000)
						.attr("transform","scale(0.85) translate("+(trans[0])+","+(trans[1])+")")
						

					deplace2_rond=true;
				}
				
				d3.select("#lum_pt"+(scrollTime-1)+"_plus").attr("opacity",1)
				d3.select("#lum_pt"+(scrollTime-1)).attr("opacity",0)
				
				
				
			} else {
				d3.select("#roue").attr("opacity",0)
				d3.select("#trace_"+scrollTime).attr("opacity",0).attr("stroke","#ffffff");
				d3.select("#k_"+(scrollTime-1)).attr("opacity",1)

				scrollTime=scrollTime-1;
				way=pl_traces[scrollTime];
				
				deplace2 = false;
				deplace2_rond = false;
				
			}
		}
	}

}

			
