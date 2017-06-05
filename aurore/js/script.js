//fixes (rep svg)

var yDeb = 176,
vit =10;
listeChoix = ["formation","stages","methode","cours"],
nuancier = ["green","orange"]

window.onload = initialize();

function initialize() {
	dessinInit();
	dessinDraw();
	repeatDessin();
	couleur();
	choix();
	
}

function dessinInit(){
	for(i=0;i<4;i++){
		d3.select("#msg"+i).attr("opacity",0).attr("transform",function(){
			var val = yDeb - (this.attributes.pos.value);
			return "translate(0 "+val+")"
		})
	}
	d3.select("#soluce").attr("transform",function(){
		var x = this.attributes.cx.value;
		var y = this.attributes.cy.value;
		return "translate("+x+" "+y+") scale(0) "
	})
	d3.select("#geom_droite").transition().duration(500).attr("opacity",1)
}

function dessinDraw(){
	var cumul = 0;
	for(i=0;i<4;i++){
		d3.select("#msg"+i).transition()
			.delay(cumul*vit+1000)
			.duration(function(){
				var val = yDeb - (this.attributes.pos.value);
				cumul = cumul*1+val*1
				return val*vit;
			})
			.attr("opacity",1).attr("transform","")

	}
	d3.select("#soluce")
		.transition()
		.duration(1200)
		.delay(cumul*8+2000)
		.attr("transform","")
}

function repeatDessin(){
	var c = setTimeout(function(){
		dessinInit();
		dessinDraw();
		repeatDessin();
	},vit*1000)
}

function choix(){			
	for(i=0;i<listeChoix.length;i++){
		d3.select("#"+listeChoix[i])
			.attr("animation2",function(){
				var val = this.style.animation;
				return val;
			})
			.on("click",function(){
				// document.location.href=this.id+".html"; 
				affiche(this.id)
			})
			.on("mouseover",function(){
				// document.location.href=this.id+".html"; 
				d3.select(this).attr("opacity",1)
			})
			.on("mouseout",function(){
				// document.location.href=this.id+".html"; 
				d3.select(this).attr("opacity",function(){
					var val = this.attributes.opacity2.value;
					return val;
				})
			})
	}
	d3.select("#accueil")
		.on("click",function(){
			d3.select(this)
				.transition()
				.duration(1200)
				.attr("opacity",0)
				.transition()
				.style("display","none")
			
			d3.selectAll(".bouge")
				
				.transition()
				.duration(1200)
				.attr("transform","")
				.attr("opacity",1)
				.transition()
				.style("animation",function(){
					var val = this.attributes.animation2.value;
					return val;
				})
				.attr("opacity2",1)
			
			d3.select("#intro")
				.style("display","block")
				.transition()
				.duration(1200)
				.style("opacity",1)
			
			d3.selectAll(".bloc")
				.transition()
				.duration(1200)
				.style("opacity",0)
				.transition()
				.style("display","none")
			
			d3.select("#fondfond")
			.transition()
			.duration(1000)
			.attr("transform","")


			d3.select("#margedroite")
				.transition()
				.duration(1000)
				.style("opacity",1)
				.style("display","block")
		})
			

}

function affiche(ch){
	// if(ch=="stages"){
		d3.select("#intro")
			.transition()
			.duration(1200)
			.style("opacity",0)
			.transition()
			.style("display","none")
			
		d3.selectAll(".bouge")
			.style("animation","")
			.attr("opacity2",function(){
				if(this.id==ch){
					return 1
				} else {
					return 0.4
				}
			})
			.transition()
			.duration(1200)
			.attr("transform",function(){
				var val = this.attributes.transform2.value;
				return val;
			})
			.attr("opacity",function(){
				if(this.id==ch){
					return 1
				} else {
					return 0.4
				}
			})
		
		d3.selectAll(".bloc")
			.transition()
			.duration(1200)
			.style("opacity",0)
			.transition()
			.style("display","none")
		
		d3.select("#bloc_"+ch)
			.style("display","block")
			.transition()
			.duration(1200)
			.style("opacity",1)
		
		d3.select("#accueil")
			.transition()
			.duration(1200)
			.attr("opacity",1)
			.style("display","block")
		
		d3.select("#fondfond")
			.transition()
			.duration(1000)
			.attr("transform","translate(460 0)")

		d3.select("#margedroite")
			.transition()
			.duration(1000)
			.style("opacity",0)
	// }
}

function couleur(){
	d3.selectAll(".orange")
		.attr("fill",nuancier[1])

	d3.selectAll(".orangespe")
		.attr("style","stop-color:"+nuancier[1])

	d3.selectAll(".vert")
		.attr("fill",nuancier[0])
	
	
	d3.selectAll(".vertspe")
		.attr("style","stop-color:"+nuancier[0])
	
	d3.selectAll("h2")
		.style("color",nuancier[0])
}