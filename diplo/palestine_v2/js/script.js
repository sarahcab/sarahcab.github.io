//////////////////////////fonctions/////////////
//tout
var scrollTime=-1,
vbH=550,
vbW=1190.5,
vbY=50,
timeEt=1600,
lengthOp=80;
time_dash=0,
parts_legende = ["routes","mur","postes"],
vbX=[0,30,60,90,10,-30],
ls_trans=[[230,230],[190,75],[190,75],[190,110],[150,300],[150,300]],

//v1 (laisser dans v2 pask ya d'autres blocages dans le code)
av=true,

//v2
way=0,
pl_traces=[0],
vit=8;
timeNP=900,

window.onload = initialize();

//////////////////////////fonctions/////////////
//tout
function initialize(){
	
	variables(); 
	scrollable();
	boutons_et();
	selections();
	caisson();
}

function variables(){
	for(i=1;i<6;i++){
		l = d3.select("#trace_"+i).node().getTotalLength();
		d3.select("#trace_"+i).attr("stroke-dasharray","0,"+l);
		pl_traces.push(l);
	}
	
}

function scrollable(){
	scrollTime=1;  //avec scrollanim v2
	window.addEventListener("wheel", function (e){
		// scrollanim(e);
		
		scrollanim2(e);
	}, false);
}

function boutons_et(){
	// alert("i")
	for(i=0;i<6;i++){
		d3.select("#etape_"+i)
			.style("cursor","pointer")
			.on("click",function(){
				if(av==true){ //v1!!
					t = (this.id).split("_")[1];
					if(document.getElementById("point_"+t)&&scrollTime>=0){
						var Y=document.getElementById("point_"+t).attributes.cy.value;
						d3.select("#svg_scroll")
							.transition()
							.duration(timeEt)
							.attr("viewBox",vbX[t]+" "+(Y-vbH/2)+" "+vbW+" "+vbH)
							
						d3.selectAll(".info").attr("display","none")
						d3.select("#k_"+scrollTime).attr("display","block")
						
						trans=ls_trans[scrollTime]
						d3.select("#informations_etape").transition().duration(timeEt).attr("transform","scale(0.85) translate("+trans[0]+","+trans[1]+")")
					}
					
			
				}
				
			})
			.on("mouseover",function(){
				if(av==true){ //v1!!
					d3.select(this)
						.transition()
						.duration(150)
						.selectAll("*")
						.attr("fill","black")
				}
					
			})
			.on("mouseout",function(){
				if(av==true){ //v1!!
					d3.select(this)
						.transition()
						.duration(150)
						.selectAll("*")
						.attr("fill","#ffffff")
				}
			})
			
	}
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

function caisson(){
	// d3.select("#bout_caisson")
		// .on("mouseover",function(){
			// d3.select("#tout_caisson")
				// .attr("display","block")
				// .transition()
				// .duration(800)
				// .attr("transform","")
		// })
		// .on("mouseout",function(){
			// d3.select("#tout_caisson")
				
				// .transition()
				// .duration(800)
				// .attr("transform","translate(0,900)")
				// .transition()
				// .attr("display","block")
		// })
		
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
				
				// d3.select("#fond_caisson")
					// .transition()
					// .duration(700)
					// .attr("opacity",0.9)
			} else {
				d3.select(this)
					.attr("zm","out")
					.style("cursor","zoom-in")
					.transition()
					.duration(700)
					.attr("transform","scale(0.255) translate(3500,2300)")
				
				// d3.select("#fond_frise")
					// .transition()
					// .duration(700)
					// .attr("opacity",0)
			}
		})
}



//v2
function scrollanim2(e){
	console.log(scrollTime)
	var L=pl_traces[scrollTime];
	
	///ALLER
	if(e.deltaY>0){
		console.log(way+" "+scrollTime)
		if(scrollTime>5&&(way>=L||way==0)){
			console.log("!!!!!!!!!!!!!!!!")
			
			d3.select("body").attr("class","monter")
		} else {
			d3.select("body").attr("class","deux_sens")
		
			op=0;
			op2=0;
			way=way*1+vit*1;		
			if(way<L){
				d3.select("#trace_"+scrollTime).attr("stroke-dasharray",way+","+(L-way)).attr("opacity",1).attr("stroke","#92C020")
				d3.select("#k_"+(scrollTime-1)).attr("opacity",function(){
					op = way/lengthOp;
					if (op>1){
						op=1;
					}
					op=1-op;
					console.log(scrollTime-1+" op : "+op)
					return op;
				})
				d3.select("#k_"+scrollTime).attr("opacity",function(){
					op2 = (L-way)/lengthOp;
					if (op2>1){
						op2=1;
					}
					op2=1-op2;
					console.log(scrollTime+" op2 : "+op2)
					return op2;
				})
				
				d3.select("#info_tous")
					.attr("opacity",op*1+op2*1/2)
			} else {
					d3.select("#trace_"+scrollTime).transition().duration(200).attr("stroke","#ffffff").attr("opacity",0.35).attr("stroke-width",11.3386)
					//aller
					d3.select("#etape_"+scrollTime).transition().duration(timeNP).attr("opacity","1")
					d3.select("#etape_"+scrollTime).selectAll("circle")
						.transition()
						.duration(timeNP)
						.attr("r",function(){
							r = this.attributes.r0.value;
							return r;
						})
					
					d3.select("#lum_pt"+scrollTime+"_plus").transition().duration(timeNP).attr("opacity","1")
					d3.select("#lum_pt"+(scrollTime-1)+"_plus").attr("opacity","0")
					d3.select("#lum_pt"+(scrollTime-1)).attr("opacity","1")
					
					d3.select("#contour"+(scrollTime-1)+"_plus").attr("display","none")
					
					d3.select("#contour"+scrollTime+"_plus").attr("display","block")
					d3.select("#contour"+scrollTime).attr("display","block")
					
					// d3.select("#k_"+(scrollTime-1)).attr("display","none")
					// d3.select("#k_"+scrollTime).attr("display","block")
					//aller - fin
					
					//afonction
					if(document.getElementById("point_"+scrollTime)&&scrollTime>=0){
						var Y=document.getElementById("point_"+scrollTime).attributes.cy.value;
						d3.select("#svg_scroll")
							.transition()
							.duration(timeNP)
							.attr("viewBox",vbX[scrollTime]+" "+(Y-vbH/2)+" "+vbW+" "+vbH)
							
						trans=ls_trans[scrollTime]
						d3.select("#informations_etape").transition().duration(timeEt).attr("transform","scale(0.85) translate("+trans[0]+","+trans[1]+")")
						
					}
					
					scrollTime++;
					way=0;
				
				
					
			}
		}
	} else { ///RETOUR
		if(scrollTime==0&&way==0){
			d3.select("body").attr("class","descendre")
		} else {
			d3.select("body").attr("class","deux_sens")
		
			way=way-vit;
			if(way>0){
				op=0;
				op2=0;
				d3.select("#trace_"+scrollTime).attr("stroke-dasharray",way+","+(L-way)).attr("opacity",1).attr("stroke","#92C020")
				d3.select("#k_"+(scrollTime-1)).attr("opacity",function(){
					op = way/lengthOp;
					if (op>1){
						op=1;
					}
					op=1-op;
					console.log(scrollTime-1+" op : "+op)
					return op;
				})
				d3.select("#k_"+scrollTime).attr("opacity",function(){
					op2 = (L-way)/lengthOp;
					if (op2>1){
						op2=1;
					}
					op2=1-op2;
					console.log(scrollTime+" op22 : "+op2)
					return op2;
				})
				d3.select("#info_tous")
					.attr("opacity",op*1+op2*1/2)
			} else {
				d3.select("#trace_"+scrollTime).attr("opacity",0);
				//retour + aller_retour
				d3.select("#etape_"+scrollTime).transition().duration(timeNP).attr("opacity","0")
				d3.select("#etape_"+scrollTime).selectAll("circle")
					.transition()
					.duration(timeNP)
					.attr("r",0)
				
				d3.select("#lum_pt"+scrollTime+"_plus").transition().duration(timeNP).attr("opacity","0")
				d3.select("#lum_pt"+scrollTime).attr("opacity","0")
				d3.select("#lum_pt"+(scrollTime-1)+"_plus").attr("opacity","1")
				
				d3.select("#contour"+(scrollTime-1)+"_plus").attr("display","block")
				d3.select("#contour"+scrollTime).attr("display","none")
				d3.select("#contour"+scrollTime+"_plus").attr("display","none")
				
				// d3.select("#k_"+(scrollTime-1)).attr("display","block")
				// d3.select("#k_"+scrollTime).attr("display","none")
				
				scrollTime=scrollTime-1;
				//retour - fin
				way=pl_traces[scrollTime];
				
				if(document.getElementById("point_"+scrollTime)&&scrollTime>=0){
					var Y=document.getElementById("point_"+scrollTime).attributes.cy.value;
					d3.select("#svg_scroll")
						.transition()
						.duration(timeNP)
						.attr("viewBox",vbX[scrollTime]+" "+(Y-vbH/2)+" "+vbW+" "+vbH)
					
					trans=ls_trans[scrollTime]
					d3.select("#informations_etape").transition().duration(timeEt).attr("transform","scale(0.85) translate("+trans[0]+","+trans[1]+")")
						
				}
				
			}
		}
	}

}


//v1		
function scrollanim(e){
		if(av==true){
			plus=false;
			ancScrollTime=scrollTime;
			if(e.deltaY>0){
				console.log("<")
				scrollTime=scrollTime*1+1;
			}
			if(scrollTime<0){
				console.log("<0")
				scrollTime=0;
			} else if(scrollTime>5){
				console.log(">5")
				plus=true;
				scrollTime=5;
			}
			console.log(scrollTime);
			if(e.deltaY!=0){
				av=false;
				time_dash=pl_traces[scrollTime]*timeEt/150;
				setTimeout(function(){av=true},time_dash*1.05)
				if(scrollTime>0){
					if(ancScrollTime<scrollTime||plus==true){
						// setTimeout(function(){aller(scrollTime)},timeDeclenche);
						aller(scrollTime)
					} else {
						// setTimeout(function(){retour(scrollTime)},timeDeclenche);
						retour(scrollTime)
						
					}
				}
				// setTimeout(function(){aller_retour(scrollTime)},timeDeclenche);
				aller_retour(scrollTime);
			}
		} 
		

	

}

function aller(blop){
	console.log("scrollTime"+blop);
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
	console.log("scrollTime_retour"+blop);
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
		console.log("blop"+blop)
		var Y=document.getElementById("point_"+blop).attributes.cy.value;
		d3.select("#svg_scroll")
			.transition()
			.duration(time_dash)
			.attr("viewBox",vbX[blop]+" "+(Y-vbH/2)+" "+vbW+" "+vbH)

		trans=ls_trans[blop]
		d3.select("#informations_etape").transition().duration(time_dash).attr("transform","scale(0.85) translate("+trans[0]+","+trans[1]+")")
	}
}					
