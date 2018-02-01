//scroll
posY=2;
scrollTime=0;
av=true;
vbH=600;
vbY=50;
timeEt=800;
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
		
		// 
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
						setTimeout(function(){test(scrollTime)},200);
						// d3.select("#traces").select("#trace_"+scrollTime).transition().duration(timeEt).attr("stroke-dasharray","1000,5000")
						// d3.select("#traces").select("#etape_"+scrollTime).transition().duration(timeEt).attr("opacity","1")
					} else {
						setTimeout(function(){test2(scrollTime)},200);
						// d3.select("#traces").select("#trace_"+scrollTime).transition().duration(timeEt).attr("stroke-dasharray","0,5000")
						// d3.select("#traces").select("#etape_"+scrollTime).transition().duration(timeEt).attr("opacity","0")
						scrollTime=scrollTime-1;
					}
				}
				
				
				setTimeout(function(){test3(scrollTime)},200);
				// d3.transition()
					// .delay(1500)
					// .duration(7500)
					// .tween("scroll", scrollTween(posY));

				// function scrollTween(offset) {
				  // return function() {
					// var i = d3.interpolateNumber(window.pageYOffset || document.documentElement.scrollTop, offset);
					// return function(t) { scrollTo(0, i(t)); };
				  // };
				// }
				
				// d3.select("#svg_scroll")
					// .transition()
					// .duration(timeEt)
					// .attr("viewBox","0 "+scrollTime*100+" 1190.5 600")
					// .attr("viewBox",function(){
						// var vb = "0 200 1190.5 600";
						// if(document.getElementById("point_"+scrollTime)&&scrollTime>0){
							
							// var Y=document.getElementById("point_"+scrollTime).attributes.cy.value;
							// return "0 "+scrollTime*100+" 1190.5 600";
						// } else{
							// return this.attributes.viewBox.value;
						// }
					// })
			}
		} 
		scrollTo(0,posY);
	}
	

}

function test(blop){
	console.log("scrollTime"+blop);
	d3.select("#traces").select("#trace_"+blop).transition().duration(timeEt).attr("stroke-dasharray","1000,5000");
	d3.select("#traces").select("#etape_"+blop).transition().duration(timeEt).attr("opacity","1")
	// d3.select("#
}

function test2(blop){
	console.log("scrollTime"+blop);
	d3.select("#traces").select("#trace_"+blop).transition().duration(timeEt).attr("stroke-dasharray","0,5000");
	d3.select("#traces").select("#etape_"+blop).transition().duration(timeEt).attr("opacity","0")
	// d3.select("#
}



function test3(blop){
	d3.select("#svg_scroll")
		.transition()
		.duration(timeEt)
		.attr("viewBox","0 "+blop*100+" 1190.5 600")
}					

// d3.transition()
    // .delay(1500)
    // .duration(7500)
    // .tween("scroll", scrollTween(document.body.getBoundingClientRect().height - window.innerHeight));

// function scrollTween(offset) {
  // return function() {
    // var i = d3.interpolateNumber(window.pageYOffset || document.documentElement.scrollTop, offset);
    // return function(t) { scrollTo(0, i(t)); };
  // };
// }