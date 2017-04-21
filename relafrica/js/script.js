window.onload = initialize();

function initialize() {
	events();
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
	txtMove(pers,trans,bool);
}

function allumer(pers){
	var trans = document.getElementById("titre_"+pers).attributes.transformaff.value;
	var bool = 1;
	txtMove(pers,trans,bool);
}

function txtMove(pers,trans,bool){
	var invBool=bool-2*bool+1;
	d3.select("."+pers+".gris").transition().duration(500).attr("opacity",bool-2*bool+1);
	d3.select("#titre_"+pers).transition().duration(500).attr("transform",trans);
	d3.select("#txt_"+pers).transition().duration(500).attr("opacity",bool);
}