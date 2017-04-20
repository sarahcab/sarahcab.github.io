var names = ["longuet","bourgi","bohn"];
var rayon = 68;
var opac = 0.4;

window.onload = initialize();

function initialize() {
	events();
	for(j=0;j<names.length;j++){	
		appendGrise(names[j])
	}
}

function events(){
	d3.selectAll(".gris")
		.on("click", function(){
			var it= this.attributes.it.value;
			var pers = (this.attributes.class.value).split(" ")[0];
	
			it++;
			if(it%2==0){
				eteindre(pers);
				
			}else {
				allumer(pers);
				for(i=0;i<names.length;i++){
					if(pers!=names[i]){
						eteindre(names[i])
					}
				}
			}
			d3.select(this).attr("it",it)
			
		})
}

function eteindre(pers){
	var trans = document.getElementById("titre_"+pers).attributes.transformdef.value;
	var bool = 0;
	anim(pers,trans,bool);
}

function allumer(pers){
	var trans = document.getElementById("titre_"+pers).attributes.transformaff.value;
	var bool = 1;
	anim(pers,trans,bool);
}

function anim(pers,trans,bool){
	grise(pers,bool-bool*2+1)
	d3.select("#titre_"+pers).transition().duration(500).attr("transform",trans);
	d3.select("#txt_"+pers).transition().duration(500).attr("opacity",bool);
}

function appendGrise(pers){
	var list = [];
	for(i=0;i<rayon*1.5;i++){
		list.push([i*2.5])
	}
	d3.select("."+pers+".gris").selectAll(".rayures")
		.data(list)
		.enter()
		.append("line")
		.attr("x1",function(d){
			var val=d[0]-rayon*2;
			return val;
		})
		.attr("x2",function(d){
			var val=parseFloat(d[0]);
			return val;
		})
		.attr("y1",0)
		.attr("y2",rayon*2)
		.attr("stroke",function(d){
			if(d[0]%5==0){
				return "black"
			}else{
				return "white"
			}
		})
		.attr("stroke-width",2)
		.attr("opacity",opac)
		.attr("class","rayures")
		.attr("id","tt")
		
}

function grise(pers,bool){
	
	d3.select("."+pers+".gris")//.selectAll(".rayures")
		// .transition()
		// .duration(1500)
		// .attr("stroke-dasharray",function(){
			// var lol = this.getTotalLength();
			// return lol+",0";
		// })
		.transition()
		// .delay(function(d){
			// return d[0]*2
		// })
		.duration(800)
		.attr("opacity",bool)
}