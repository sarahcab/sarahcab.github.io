//////////////////////////fonctions/////////////
//tout
var scrollTime=-1,
vbH=550,
vbW=1190.5,
vbY=50,
timeEt=1600,
lengthOp=120;
time_dash=0,
parts_legende = ["routes","mur","postes"],
vbX=[0,30,60,90,10,-30],
ls_trans=[[230,230],[190,95],[190,95],[190,110],[150,300],[150,300]],
deplace=false;
deplace_rond=false;
//v1 (laisser dans v2 pask ya d'autres blocages dans le code)
av=true,

//v2
way=0,
pl_traces=[0],
vit=7;
timeNP=900,

window.onload = initialize();

//////////////////////////fonctions/////////////
//tout
function initialize(){
	
	
	demarrer();
	// debut();
}


function demarrer(){
	d3.select("#bouton_l")
		.on("click",function(){
			setTimeout(function(){
				scrollTo(0,0);
				variables(); 
				scrollable();
				boutons_et();
				selections();
				zooms();
				d3.select("#fleche").transition().duration(500).attr("transform","translate(0,500)").transition().remove();
			
				
			},1800)
			d3.select("#debutt").transition().duration(200).attr("opacity",0).transition().remove()
			x = document.getElementById("globale").offsetLeft;
			w = document.getElementById("globale").offsetWidth;
			W = document.getElementById("dessins").offsetWidth;
			d3.select("#globale").style("margin-left",x+"px").style("opacity",1).style("width",w+"px").transition().duration(700).style("margin-left",(-x)+"px").style("width",(W*2)+"px").style("opacity",0).transition().remove();
			d3.select("body").attr("class","descendre");
			d3.select("#svg_scroll").transition().delay(700).duration(800).attr("opacity",1); 
			d3.select("#svg_fix").transition().delay(700).duration(1000).attr("opacity",1);
			
			var Y=document.getElementById("point_0").attributes.cy.value;
			vb=(vbX[0])+" "+(Y-vbH/2)+" "+vbW+" "+vbH;
			console.log(vb)
			d3.select("#svg_scroll").attr("viewBox",vb)
			trans=ls_trans[0]
			d3.select("#informations_etape").attr("transform","scale(0.85) translate("+trans[0]+","+trans[1]+")")
				
			
		})
}

function variables(){
	for(i=1;i<6;i++){
		l = d3.select("#trace_"+i).node().getTotalLength();
		d3.select("#trace_"+i).attr("stroke-dasharray","0,"+l);
		pl_traces.push(l*1+2*lengthOp);
	}
	
}

function scrollable(){
	scrollTime=1;  //avec scrollanim v2
	// way=lengthOp;  //avec scrollanim v2
	window.addEventListener("wheel", function (e){
		// scrollanim(e);
		
		scrollanim2(e);
	}, false);
}

function boutons_et(){
	// for(i=0;i<6;i++){
		// d3.select("#etape_"+i)
			// .style("cursor","pointer")
			// .on("click",function(){
				// if(av==true){ //v1!!
					// t = (this.id).split("_")[1];
					// if(document.getElementById("point_"+t)&&scrollTime>=0){
						// var Y=document.getElementById("point_"+t).attributes.cy.value;
						// d3.select("#svg_scroll")
							// .transition()
							// .duration(timeEt)
							// .attr("viewBox",vbX[t]+" "+(Y-vbH/2)+" "+vbW+" "+vbH)
							
						// d3.selectAll(".info").attr("display","none")
						// d3.select("#k_"+scrollTime).attr("display","block")
						
						// trans=ls_trans[scrollTime];
						// d3.select("#informations_etape").transition().duration(timeEt).attr("transform","scale(0.85) translate("+trans[0]+","+trans[1]+")")
					// }
					
			
				// }
				
			// })
			// .on("mouseover",function(){
				// if(av==true){ //v1!!
					// d3.select(this)
						// .transition()
						// .duration(150)
						// .selectAll("*")
						// .attr("fill","black")
				// }
					
			// })
			// .on("mouseout",function(){
				// if(av==true){ //v1!!
					// d3.select(this)
						// .transition()
						// .duration(150)
						// .selectAll("*")
						// .attr("fill","#ffffff")
				// }
			// })
			
	// }
	
	d3.select("#aide")
		.style("cursor","default")
	
	d3.select("#bout_aide")
		.style("cursor","pointer")
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
}

function selections(){
	for(i=0;i<parts_legende.length;i++){
		nom=parts_legende[i];
		
		d3.select("#tout_"+nom)
			.attr("lock","true")
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
				nom = (this.id).split("_")[1];
				d3.select("#legende_"+nom)
					.attr("opacity",0.75)
			})
			.on("mouseout",function(){
				nom = (this.id).split("_")[1];
				d3.select("#legende_"+nom)
					.attr("opacity",1)
			})
		
		
		
		/////////////:::Pour faire individuellement
		// nb_n=nb_parts_legende[i];
		// for(j=0;j<nb_n;j++){
			// d3.selectAll(".elt_"+nom+"_"+j)
					// .attr("sujet",nom+"_"+j)
					// .attr("lock","true")
					// .style("cursor","pointer")
					// .attr("opacity",1)
					// .on("mouseover",function(){
						// sujet = this.attributes.sujet.value;
						// tst=this.attributes.lock.value;
						// d3.selectAll("."+sujet)
							// .attr("opacity",0.8)				
						
						// d3.selectAll(".elt_"+sujet)
							// .attr("opacity",0.5)
					// })
					// .on("click",function(){
						// tst = this.attributes.lock.value;
						// if(tst=="false"){
							// d3.selectAll(".elt_"+sujet).attr("lock","true").attr("opacity",1)
							// d3.selectAll("."+sujet).attr("opacity",1)
						// } else {
							// d3.selectAll(".elt_"+sujet).attr("lock","false").attr("opacity",0.5)
							// d3.select("#tout_"+nom).attr("lock","false")
								// .select(".bou")
								// .transition()
								// .duration(400)
								// .attr("transform","")
							// d3.select("#tout_"+nom)
								// .transition()
								// .selectAll(".ti")
								// .attr("fill",function(){
									// var val = this.attributes.fill_off.value;
									// return val;
								// })
							// d3.selectAll(".elt_"+sujet).attr("lock","false").attr("opacity",0.5)
							// d3.selectAll("."+sujet).attr("opacity",0)
						// }
					// })
					// .on("mouseout",function(){
						// sujet = this.attributes.sujet.value;
						// tst = this.attributes.lock.value;
						// if(tst=="false"){
							// d3.selectAll(".elt_"+sujet).attr("opacity",0.2)				
							// d3.selectAll("."+sujet).attr("opacity",0)
						// } else {
							// console.log("false")
							// d3.selectAll(".elt_"+sujet).attr("opacity",1)				
							// d3.selectAll("."+sujet).attr("opacity",1)
						// }
						
					// })
		// }
	
	
	}
}

function zooms(){
	// scale(1) translate(130,550)
	
	d3.select("#sources_tout")
		.style("cursor","zoom-out")
		.attr("zm","in")
		.on("click",function(){
			zm = this.attributes.zm.value;
			if(zm=="out"){
				d3.select(this)
					.attr("zm","in")
					.style("cursor","zoom-out")
				
				d3.select("#keffieh")
					.transition()
					.duration(700)
					.attr("transform","scale(2.6) translate(-588,100)")
				
				d3.select("#sources_total")
					.transition()
					.duration(700)
					.attr("opacity",1)
				d3.select("#sources_icone")
					.transition()
					.duration(700)
					.attr("opacity",0)
				
			} else {
				d3.select(this)
					.attr("zm","out")
					.style("cursor","zoom-in")
				
				d3.select("#keffieh")
					.transition()
					.duration(700)
					.attr("transform","translate(130,550)")
				
				d3.select("#sources_total")
					.transition()
					.duration(700)
					.attr("opacity",0)
				d3.select("#sources_icone")
					.transition()
					.duration(700)
					.attr("opacity",1)
			}
		})
		
	d3.select("#tout_caisson")
		.style("cursor","zoom-in")
		.attr("zm","out")
		.on("click",function(){
			zm = this.attributes.zm.value;
			if(zm=="out"){
				d3.select(this)
					.attr("zm","in")
					.style("cursor","zoom-out")
					.transition()
					.duration(700)
					.attr("transform","")
			} else {
				d3.select(this)
					.attr("zm","out")
					.style("cursor","zoom-in")
					.transition()
					.duration(700)
					.attr("transform","scale(0.255) translate(2500,550)")
				
				// d3.select("#fond_frise")
					// .transition()
					// .duration(700)
					// .attr("opacity",0)
			}
		})
}

//v2
function scrollanim2(e){
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
				console.log("a0 "+way)
				d3.select("#k_"+(scrollTime-1)).attr("opacity",function(){
					op = way/lengthOp;
					if (op>1){
						op=1;
					}
					op=1-op;
					return op;
				})
				d3.select("#info_tous")
					.attr("opacity",op)
				d3.select("#legende_etape") //retour
					.attr("opacity",op)
				
			} else if(way<(L-lengthOp)){
				d3.select("#lum_pt"+(scrollTime-1)+"_plus").attr("opacity",0)
				d3.select("#lum_pt"+(scrollTime-1)).attr("opacity",1)
				
				console.log("a1 "+way)
				d3.select("#info_tous").attr("opacity",0)
				d3.select("#k_"+(scrollTime-1)).attr("opacity",0);
				d3.select("#trace_"+scrollTime).attr("stroke-dasharray",(way-lengthOp)+","+(L-way+lengthOp*1)).attr("opacity",1).attr("stroke","#92C020")
				
			} else if(way<L){
				
				console.log("a2 "+way)
				if(deplace==false){ //retour
					if(document.getElementById("point_"+scrollTime)&&scrollTime>=0){
						var Y=document.getElementById("point_"+scrollTime).attributes.cy.value;
						vb=(vbX[scrollTime])+" "+(Y-vbH/2)+" "+vbW+" "+vbH;
						console.log(vb)
						d3.select("#svg_scroll").transition().duration(800).attr("viewBox",vb)
						trans=ls_trans[scrollTime]
						d3.select("#informations_etape").transition().duration(800).attr("transform","scale(0.85) translate("+trans[0]+","+trans[1]+")")
					}
					deplace=true;
					av=false;
					setTimeout(function(){av=true;},850)
				}
				if(way>((L-lengthOp)+(lengthOp/4))&&deplace_rond==false&&deplace==true){ //retour
					trans=ls_trans[scrollTime]
					var X=document.getElementById("point_"+scrollTime).attributes.cx.value*1-vbX[scrollTime]*1
					
					if(scrollTime==0){
						var Y=200+vbH/2-55;
					} else {
						var Y=200+vbH/2;
					}
					
					console.log(X+" "+Y);
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
					op2=1-op2;
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
				
				console.log("a3 "+way)
				d3.select("#k_"+scrollTime).attr("opacity",1);
				d3.select("#trace_"+scrollTime).transition().duration(200).attr("stroke","#ffffff").attr("opacity",0.35).attr("stroke-width",11.3386)
				//aller
				
				
				d3.select("#contour"+(scrollTime-1)+"_plus").attr("display","none")
				
				d3.select("#contour"+scrollTime+"_plus").attr("display","block")
				d3.select("#contour"+scrollTime).attr("display","block")
				
				// d3.select("#k_"+(scrollTime-1)).attr("display","none")
				// d3.select("#k_"+scrollTime).attr("display","block")
				//aller - fin
				
				

				scrollTime++;
				
				way=0;
				deplace=false;
				deplace_rond=false;
			
				
					
			}
		}
	} else if(av==true) { ///RETOUR
		console.log("retour")
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
					op2=1-op2;
					return op2;
				})
				d3.select("#info_tous").attr("opacity",op2)
				d3.select("#legende_etape") //retour
					.attr("opacity",op2)
				//////////////////////
	
				d3.select("#etape_"+scrollTime).attr("opacity",op2)
				d3.select("#etape_"+scrollTime).selectAll("circle")
					.attr("r",function(){
						r = this.attributes.r0.value;
						return r*op2;
					})
				
				d3.select("#lum_pt"+scrollTime+"_plus").attr("opacity",op2)
				
				
					
			}else if(way>lengthOp){
				d3.select("#contour"+(scrollTime-1)+"_plus").attr("display","block")
				d3.select("#contour"+scrollTime).attr("display","none")
				d3.select("#contour"+scrollTime+"_plus").attr("display","none")
				
				
				d3.select("#info_tous").attr("opacity",0)
				d3.select("#k_"+(scrollTime)).attr("opacity",0);
				d3.select("#trace_"+scrollTime).attr("stroke-dasharray",(way-lengthOp)+","+(L-way+lengthOp*1)).attr("opacity",1).attr("stroke","#92C020")
			} else if(way>0){
				d3.select("#trace_"+scrollTime).attr("stroke-dasharray","0,"+(L-lengthOp*2)).attr("opacity",0).attr("stroke","#92C020")
				d3.select("#k_"+(scrollTime-1)).attr("opacity",function(){
					op = way/lengthOp;
					if (op>1){
						op=1;
					}
					op=1-op;
					return op;
				})
				d3.select("#info_tous").attr("opacity",op)
				
				
				d3.select("#etape_"+scrollTime).attr("opacity",op)
				d3.select("#etape_"+scrollTime).selectAll("circle")
					.attr("r",function(){
						r = this.attributes.r0.value;
						return r*op;
					})
				
				if(deplace2==false){ //retour
					var Y=document.getElementById("point_"+scrollTime).attributes.cy.value;
					var Y0=document.getElementById("point_"+(scrollTime-1)).attributes.cy.value;
					
					vb_tst=vb=(vbX[scrollTime-1])+" "+(Y0-vbH/2)+" "+vbW+" "+vbH;
					console.log(document.getElementById("svg_scroll").attributes.viewBox.value+"   -   "+vb_tst);
					if(document.getElementById("svg_scroll").attributes.viewBox.value==vb_tst){
						console.log("IDEM")
					}else{
					
						vb=(vbX[scrollTime-1]*1+(vbX[scrollTime]*1-vbX[scrollTime-1]*1)*(way/lengthOp))+" "+(Y0*1+(Y*1-Y0*1)*(way/lengthOp)-vbH/2)+" "+vbW+" "+vbH;
						d3.select("#svg_scroll").attr("viewBox",vb)
						
						trans0=ls_trans[scrollTime-1]
						trans=ls_trans[scrollTime]
						d3.select("#informations_etape").attr("transform","scale(0.85) translate("+(trans0[0]*1+(trans[0]*1-trans0[0]*1)*(way/lengthOp))+","+(trans0[1]*1+(trans[1]*1-trans0[1]*1)*(way/lengthOp))+")")
					
					}
					deplace2=true;
					av=false;
					setTimeout(function(){av=true;},850)
				}
				if(way<(lengthOp-(lengthOp/4))&&deplace2_rond==false&&deplace2==true){ //retour
					trans=ls_trans[scrollTime-1]
					
					var X=document.getElementById("point_"+(scrollTime-1)).attributes.cx.value*1-vbX[scrollTime-1]*1
					var Y=200+vbH/2;
					console.log(X+" "+Y);
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
				
				d3.select("#lum_pt"+(scrollTime-1)+"_plus").attr("opacity",op)
				d3.select("#lum_pt"+(scrollTime-1)).attr("opacity",1-op)
				
				
				
			} else {
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

function aller(blop){
	d3.select("#trace_"+blop).transition().duration(time_dash).attr("stroke-dasharray",pl_traces[blop]+",0").attr("opacity",1);
	d3.select("#etape_"+blop).transition().duration(time_dash).attr("opacity","1")
	d3.select("#etape_"+blop).selectAll("circle")
		.transition()
		.duration(time_dash)
		.attr("r",function(){
			r = this.attributes.r0.value;
			return r;
		})
	
	d3.select("#lum_pt"+blop+"_plus").transition().duration(time_dash).attr("opacity","1")
	d3.select("#lum_pt"+(blop-1)+"_plus").attr("opacity","0")
	d3.select("#lum_pt"+(blop-1)).attr("opacity","1")
	
	d3.select("#contour"+(blop-1)+"_plus").attr("display","none")
	
	d3.select("#k_"+(blop-1)).attr("display","none")
	d3.select("#k_"+blop).attr("display","block")
	
	setTimeout(function(){
		
		d3.select("#contour"+blop+"_plus").attr("display","block")
		d3.select("#contour"+blop).attr("display","block")
	},(time_dash))
}

function retour(blop){
	d3.select("#trace_"+blop).transition().duration(time_dash).attr("stroke-dasharray","0,"+pl_traces[blop]).attr("opacity",0);
	d3.select("#etape_"+blop).transition().duration(time_dash).attr("opacity","0")
	d3.select("#etape_"+blop).selectAll("circle")
		.transition()
		.duration(time_dash)
		.attr("r",0)
	
	d3.select("#lum_pt"+blop+"_plus").transition().duration(time_dash).attr("opacity","0")
	d3.select("#lum_pt"+blop).attr("opacity","0")
	d3.select("#lum_pt"+(blop-1)+"_plus").attr("opacity","1")
	
	d3.select("#contour"+(blop-1)+"_plus").attr("display","block")
	d3.select("#contour"+blop).attr("display","none")
	d3.select("#contour"+blop+"_plus").attr("display","none")
	
	d3.select("#k_"+(blop-1)).attr("display","block")
	d3.select("#k_"+blop).attr("display","none")
	
	// setTimeout(function(){
		
		scrollTime=scrollTime-1;
	// },(time_dash))
}

function aller_retour(blop){
	// d3.select("#cache").transition().duration(200).attr("opacity","0.35");
	// d3.selectAll(".trace").attr("stroke","#92C020").attr("opacity",1)
	d3.selectAll(".trace").attr("opacity",1).attr("stroke","#92C020")
	d3.selectAll(".etapes").selectAll("*").attr("fill","#92C020")
	setTimeout(function(){
		// d3.select("#cache").transition().duration(200).attr("opacity","0");
		d3.selectAll(".trace").transition().duration(200).attr("stroke","#ffffff").attr("opacity",0.35).attr("stroke-width",11.3386)
		d3.selectAll(".etapes").selectAll("*").transition().duration(200).attr("fill","#ffffff")
		// d3.select("#contour").attr("display","block")
	},time_dash)
	
	if(document.getElementById("point_"+blop)&&blop>=0){
		var Y=document.getElementById("point_"+blop).attributes.cy.value;
		d3.select("#svg_scroll")
			.transition()
			.duration(time_dash)
			.attr("viewBox",vbX[blop]+" "+(Y-vbH/2)+" "+vbW+" "+vbH)

		trans=ls_trans[blop]
		d3.select("#informations_etape").transition().duration(time_dash).attr("transform","scale(0.85) translate("+trans[0]+","+trans[1]+")")
	}
}					
