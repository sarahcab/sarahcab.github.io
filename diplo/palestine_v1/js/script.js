//scroll
posY=2;
scrollTime=0;
av=true;
vbH=550;
vbW=1190.5;
vbY=50;
timeEt=800;
timeDeclenche=200;
parts_legende = ["routes","mur","postes"];
// nb_parts_legende = [10,3,5,2],
vbX=[0,30,60,90,45,-10];

window.onload = initialize();

function initialize(){
	scrollanim();
	// scrollanim2();
	// selections();
	// caisson();
}

//https://forum.alsacreations.com/topic-1-74402-1-Commentbloquerlescrollverticalsurunonepagevertical.html
function scrollanim2(){

	window.addEventListener("DOMMouseScroll", function (e){
		console.log(e);
		// window.scrollTo(0,0);
		scrollTime++;
		console.log(scrollTime)
		d3.select("#trace_1").attr("stroke-dasharray",scrollTime*10+",5000").attr("opacity",1);
	
	}, false);
}

function caisson(){
	d3.select("#bout_caisson")
		.on("mouseover",function(){
			d3.select("#tout_caisson")
				.attr("display","block")
				.transition()
				.duration(800)
				.attr("transform","")
		})
		.on("mouseout",function(){
			d3.select("#tout_caisson")
				
				.transition()
				.duration(800)
				.attr("transform","translate(0,900)")
				.transition()
				.attr("display","block")
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

function scrollanim(){
	console.log(posY)
	window.addEventListener("wheel", function (e){
		// repY=pageYOffset;
		// scrollTo(0,posY);
		repY=15;
		if(av==true){
			plus=false;
			ancScrollTime=scrollTime;
			if(repY>posY){
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
			if(posY!=repY){
				av=false;
				setTimeout(function(){av=true},timeEt*1.05)
				if(scrollTime>0){
					if(ancScrollTime<scrollTime||plus==true){
						setTimeout(function(){aller(scrollTime)},timeDeclenche);
					} else {
						setTimeout(function(){retour(scrollTime)},timeDeclenche);
						
					}
				}
				setTimeout(function(){aller_retour(scrollTime)},timeDeclenche);
			}
		} 
		
	}, false);
	

}

function aller(blop){
	console.log("scrollTime"+blop);
	d3.select("#trace_"+blop).transition().duration(timeEt).attr("stroke-dasharray","1000,5000").attr("opacity",1);
	d3.select("#etape_"+blop).transition().duration(timeEt).attr("opacity","1")
	d3.select("#etape_"+blop).selectAll("circle")
		.transition()
		.duration(timeEt)
		.attr("r",function(){
			r = this.attributes.r0.value;
			return r;
		})
	
	d3.select("#lum_pt"+blop+"_plus").transition().duration(timeEt).attr("opacity","1")
	d3.select("#lum_pt"+(blop-1)+"_plus").attr("opacity","0")
	d3.select("#lum_pt"+(blop-1)).attr("opacity","1")
	
	d3.select("#contour"+(blop-1)+"_plus").attr("display","none")
	
	d3.select("#k_"+(blop-1)).attr("display","none")
	d3.select("#k_"+blop).attr("display","block")
	
	setTimeout(function(){
		
		d3.select("#contour"+blop+"_plus").attr("display","block")
		d3.select("#contour"+blop).attr("display","block")
	},(timeEt-timeDeclenche))
}

function retour(blop){
	console.log("scrollTime_retour"+blop);
	d3.select("#trace_"+blop).transition().duration(timeEt).attr("stroke-dasharray","0,5000").attr("opacity",0);
	d3.select("#etape_"+blop).transition().duration(timeEt).attr("opacity","0")
	d3.select("#etape_"+blop).selectAll("circle")
		.transition()
		.duration(timeEt)
		.attr("r",0)
	
	d3.select("#lum_pt"+blop+"_plus").transition().duration(timeEt).attr("opacity","0")
	d3.select("#lum_pt"+blop).attr("opacity","0")
	d3.select("#lum_pt"+(blop-1)+"_plus").attr("opacity","1")
	
	d3.select("#contour"+(blop-1)+"_plus").attr("display","block")
	d3.select("#contour"+blop).attr("display","none")
	d3.select("#contour"+blop+"_plus").attr("display","none")
	
	d3.select("#k_"+(blop-1)).attr("display","block")
	d3.select("#k_"+blop).attr("display","none")
	
	setTimeout(function(){
		
		scrollTime=scrollTime-1;
	},(timeEt-timeDeclenche))
}

function aller_retour(blop){
	// d3.select("#cache").attr("display","block")
	// d3.selectAll(".trace").attr("stroke","#92C020").attr("opacity",1).attr("stroke-width",7)
	d3.selectAll(".trace").attr("opacity",0.8).attr("stroke-width",7).attr("stroke","#92C020")
	d3.selectAll(".etapes").selectAll("*").attr("fill","#92C020")
	setTimeout(function(){
		// d3.select("#cache").attr("display","none")
		d3.selectAll(".trace").transition().duration(200).attr("stroke","#ffffff").attr("opacity",0.35).attr("stroke-width",11.3386)
		d3.selectAll(".etapes").selectAll("*").transition().duration(200).attr("fill","#ffffff")
		d3.select("#contour").attr("display","block")
	},timeEt)
	
	if(document.getElementById("point_"+blop)&&blop>0){
		var Y=document.getElementById("point_"+blop).attributes.cy.value;
		d3.select("#svg_scroll")
			.transition()
			.duration(timeEt)
			.attr("viewBox",vbX[blop]+" "+(Y-vbH/2)+" "+vbW+" "+vbH)
	}
}					
