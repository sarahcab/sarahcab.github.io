let activelaser=false;

window.onload = initialize();

function initialize(){
	d3.select("#tactile")
		.style("cursor","none")
		.on("mousemove",function(){
			activelaser=true;
			d3.select("#pointeur").attr("opacity","1");
		
			offsetW= document.getElementById("fond_macron_png").offsetWidth;
			offsetH= document.getElementById("fond_macron_png").offsetHeight;
			vbWIDTH = (d3.select("#svglasers").attr("viewBox")).split(" ")[2];
			vbHEIGHT = (d3.select("#svglasers").attr("viewBox")).split(" ")[3];

			Xsvg = d3.event.layerX*vbWIDTH/offsetW;
			Ysvg = d3.event.layerY*vbHEIGHT/offsetH;
			
			d3.selectAll("line")
				.attr("x2",Xsvg)
				.attr("y2",Ysvg)
				.attr("longeur",function(){
					x1 = this.attributes.x1.value;
					y1 = this.attributes.y1.value;
					pytha = Math.sqrt(Math.abs(Xsvg-x1)*Math.abs(Xsvg-x1)+Math.abs(Ysvg-y1)*Math.abs(Ysvg-y1))
					// console.log(pytha)
					return pytha;
				})
				
			d3.select("#pointeur")
				.attr("transform","translate("+Xsvg+","+Ysvg+")")
		})
		.on("mouseout",function(){
			activelaser=false;
			d3.select("#pointeur").attr("opacity","0");
			d3.select("#content").attr("opacity","1");
			d3.select("#fache").attr("opacity","0");
		})
			
		
	c = setInterval(function(){
		if(activelaser==true){
			d3.selectAll("circle").transition().duration(150).attr("r",5)
				.transition().delay(1500).duration(200).attr("r",0)
			
			d3.selectAll("line").transition().duration(100).attr("stroke-opacity",1).transition().duration(200).attr("stroke-dasharray",function(){
				var longeur = this.attributes.longeur.value;
				return longeur+" 0"
			}).transition().delay(1500).duration(200).attr("stroke-dasharray",function(){
				var longeur = this.attributes.longeur.value;
				return "0 "+longeur;
			}).transition().duration(100).attr("stroke-opacity",0)
			
			d3.select("#content").transition().delay(1500).duration(200).attr("opacity","0");
			d3.select("#fache").transition().delay(1500).duration(200).attr("opacity","1");
		}
	},3000)
	
	// setTimeout(function(){
		// d = setInterval(function(){
			// d3.selectAll("line").transition().duration(200).attr("stroke-dasharray",function(){
				// var longeur = this.attributes.longeur.value;
				// return "0 "+longueur
			// })
		// },500)
}
