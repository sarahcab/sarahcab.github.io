//scroll
posY=2;
scrollTime=0;
av=true;
vbH=600;
vbW=1190.5;
vbY=50;
timeEt=1000;
timeDeclenche=200;
parts_legende = ["main","routes","mur","postes"];
nb_parts_legende = [10,3,5,2];

window.onload = initialize();

function initialize(){
	scrollanim();
	selections();
	d3.select("#dessins").style("display","block")
}

function selections(){
	for(i=0;i<parts_legende.length;i++){
		nom=parts_legende[i];
		nb_n=nb_parts_legende[i];
		for(j=0;j<nb_n;j++){
			d3.selectAll(".elt_"+nom+"_"+j)
					.attr("sujet",nom+"_"+j)
					.attr("lock","true")
					.style("cursor","pointer")
					.attr("opacity",1)
					.on("mouseover",function(){
						sujet = this.attributes.sujet.value;
						tst=this.attributes.lock.value;
						d3.selectAll("."+sujet)
							.attr("opacity",0.8)				
						
						d3.selectAll(".elt_"+sujet)
							.attr("opacity",0.5)
					})
					.on("click",function(){
						tst = this.attributes.lock.value;
						if(tst=="false"){
							d3.selectAll(".elt_"+sujet).attr("lock","true").attr("opacity",1)
							d3.selectAll("."+sujet).attr("opacity",1)
						} else {
							d3.selectAll(".elt_"+sujet).attr("lock","false").attr("opacity",0.5)
							d3.select("#tout_"+nom).attr("lock","false")
								.select(".bou")
								.transition()
								.duration(400)
								.attr("transform","")
							d3.select("#tout_"+nom)
								.transition()
								.selectAll(".ti")
								.attr("fill",function(){
									var val = this.attributes.fill_off.value;
									return val;
								})
							d3.selectAll(".elt_"+sujet).attr("lock","false").attr("opacity",0.5)
							d3.selectAll("."+sujet).attr("opacity",0)
						}
					})
					.on("mouseout",function(){
						sujet = this.attributes.sujet.value;
						tst = this.attributes.lock.value;
						if(tst=="false"){
							d3.selectAll(".elt_"+sujet).attr("opacity",0.2)				
							d3.selectAll("."+sujet).attr("opacity",0)
						} else {
							console.log("false")
							d3.selectAll(".elt_"+sujet).attr("opacity",1)				
							d3.selectAll("."+sujet).attr("opacity",1)
						}
						
					})
		}
	}
}

function scrollanim(){
	console.log(posY)
	window.onscroll = function(e){
		repY=pageYOffset;
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
						scrollTime=scrollTime-1;
					}
				}
				setTimeout(function(){aller_retour(scrollTime)},timeDeclenche);
			}
		} 
		scrollTo(0,posY);
	}
	

}

function aller(blop){
	console.log("scrollTime"+blop);
	d3.select("#traces").select("#trace_"+blop).transition().duration(timeEt).attr("stroke-dasharray","1000,5000");
	d3.select("#traces").select("#etape_"+blop).transition().duration(timeEt).attr("opacity","1")
	d3.select("#contour"+(blop-1)+"_plus").attr("display","none")
	d3.select("#contour"+blop).attr("display","block")
}

function retour(blop){
	console.log("scrollTime"+blop);
	d3.select("#traces").select("#trace_"+blop).transition().duration(timeEt).attr("stroke-dasharray","0,5000");
	d3.select("#traces").select("#etape_"+blop).transition().duration(timeEt).attr("opacity","0")
	d3.select("#contour"+(blop-1)+"_plus").attr("display","block")
	d3.select("#contour"+blop).attr("display","none")
}

function aller_retour(blop){
	// d3.select("#cache").attr("display","block")
	d3.selectAll(".trace").attr("stroke","#92C020").attr("opacity",1).attr("stroke-width",7)
	setTimeout(function(){
		// d3.select("#cache").attr("display","none")
		d3.selectAll(".trace").transition().duration(200).attr("stroke","#ffffff").attr("opacity",0.35).attr("stroke-width",11.3386)
		d3.select("#contour").attr("display","block")
	},timeEt)
	
	if(document.getElementById("point_"+blop)&&blop>0){
		var Y=document.getElementById("point_"+blop).attributes.cy.value;
		d3.select("#svg_scroll")
			.transition()
			.duration(timeEt)
			.attr("viewBox","0 "+(Y-vbH/2)+" "+vbW+" "+vbH)
	}
}					
