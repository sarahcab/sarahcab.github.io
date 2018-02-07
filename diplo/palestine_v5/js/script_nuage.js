

window.onload = initialize();

//////////////////////////fonctions/////////////
//tout
function initialize(){
	alert("h")
	nuage();
	// debut();
}

nuage(){
	d3.select("#nuage5")
	.style("cursor","pointer")
		.on("mouseover",function(){
			d3.select(this).attr("transform","translate(300,300)")
		})
	
}
