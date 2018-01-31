posY=10;
scrollTime=0;
av=true;
vbH=500;
timeEt=1000;

window.onload = initialize();

function initialize(){
	scrollTo(pageYOffset,posY);
	window.onscroll = function(e){
		if(av==true){
			plus=false;
			console.log(av)
			ancScrollTime=scrollTime;
			// if(pageYOffset>posY){
				// if(document.getElementById("trace_"+scrollTime)){
					// tst = (document.getElementById("trace_"+scrollTime).attributes["stroke-dasharray"].value).split(",")[0];
					// console.log("t"+tst)
					// if(tst==0){
						// scrollTime=scrollTime-1; 
					// }
				// }
			// } else 
			if(pageYOffset>posY){
				scrollTime=scrollTime*1+1;
			}
			if(scrollTime<0){
				scrollTime=0;
			} else if (scrollTime>5){
				plus=true;
				scrollTime=5;
			}
			console.log(scrollTime);
			if(posY!=pageYOffset){
				av=false;
				setTimeout(function(){av=true},timeEt*1.05)
				if(scrollTime>0){
					if(ancScrollTime<scrollTime||plus==true){
						d3.select("#trace_"+scrollTime).transition().duration(timeEt).attr("stroke-dasharray","1000,5000")
						d3.select("#etape_"+scrollTime).transition().duration(timeEt).attr("opacity","1")
					} else {
						d3.select("#trace_"+scrollTime).transition().duration(timeEt).attr("stroke-dasharray","0,5000")
						d3.select("#etape_"+scrollTime).transition().duration(timeEt).attr("opacity","0")
						scrollTime=scrollTime-1;
					}
				}
				
				
				
				d3.select("svg")
					.transition()
					.duration(timeEt)
					.attr("viewBox",function(){
						var vb = (this.attributes.viewBox.value).split(" ");
						if(document.getElementById("point_"+scrollTime)&&scrollTime>0){
							
							var Y=document.getElementById("point_"+scrollTime).attributes.cy.value;
							console.log("point_"+scrollTime+"   "+(Y-vbH/2))
							console.log(vb)
							console.log(vb[0]+" "+(Y-vbH/2)+" "+vb[2]+" "+vbH)
							return vb[0]+" "+(Y-vbH/2)+" "+vb[2]+" "+vbH
						} else{
							return this.attributes.viewBox.value;
						}
						
					})
			}
		}
		scrollTo(pageYOffset,posY);
	}
	

}