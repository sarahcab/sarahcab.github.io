/////////////////////////////////////////////////    variables globales (fixes et non-fixes confondues)

///thématiques
var liste_ecritures = ["arabe","armenien","bengali","birman","chinis","chinois","cinghalais","coreen","cyrillique","ethiopien","georgien","goujarati","gourmoukhi","grec","hebreu","japonais","kannada","khmer","lao","latin","malayalam","maldivien","manipouri","mongol","nagari","oriya","tamoul","telougou","thai","tibet","tibetain","tifinagh"],
liste_textes = ["afrique","ameriques","asieSe","caucase","chine","corees","ethiopieErythree","europe","hebreu","inde","japon","kurde","macedoine","moldavie","ouigours","serboCroate","tifinagh","turquie","vietnam"],

///graphiques
widthGraph = (document.getElementById("carte").attributes.viewBox.value).split(" ")[2], //viewBox-width de l'espace SVG global 
heightGraph = ((document.getElementById("carte").attributes.viewBox.value).split(" ")[3]).split(")")[0], //viewBox-height de l'espace SVG global
xfondtexte = 320,
yfondtexte = 420,
sizeexit = 4,
marg_text = 10;

/////////////////////////////////////////////////    Fonctions principales
window.onload = initialize();

function initialize(){
	initMap(); 
	actions(); 
	
	d3.select("#carte")
		.transition()
		.duration(1000)
		.attr("opacity",1)
}

function initMap(){
	d3.selectAll(".texte_spe")
		.attr("display","none")
		.attr("transform","translate("+xfondtexte+","+yfondtexte+") scale(1.5)")
		.append("circle")
		.attr("cx",marg_text*(-0.5))
		.attr("cy",marg_text*(-0.5))
		.attr("r",sizeexit)
		.attr("fill","red")
		.attr("class","exit")
		.style("cursor","pointer")
	
	d3.selectAll(".texte_spe")
		.select("rect")
		.attr("x",marg_text*(-1))
		.attr("y",marg_text*(-1))
		.attr("width",function(){
			w = this.attributes.width.value;
			return w*1 + marg_text*2
		})
		.attr("heigth",function(){
			h = this.attributes.height.value;
			return h*1 + marg_text*2
		})
		//ajouter drag et bouton truc
}

function actions(){
	for(i=0;i<liste_ecritures.length;i++){
		ec = liste_ecritures[i]
		d3.selectAll(".case_"+ec)
			.attr("ecriture",ec)
			.attr("lock","false")
			.style("cursor","crosshair")
			.on("mouseover",function(){
				ec_obj = this.attributes.ecriture.value;
				d3.selectAll(".plani")
					.attr("opacity",0)
				d3.selectAll(".trame_"+ec_obj)
					.attr("opacity",1)				
				d3.selectAll(".fond_"+ec_obj)
					.attr("opacity",1)
				
			})
			
	}
	for(j=0;j<liste_textes.length;j++){
		te = liste_textes[j];
		d3.select("#point_"+te)
			.attr("zone",te)
			.style("cursor","pointer")
			.on("click",function(){
				
				te_obj =  this.attributes.zone.value;
				
				d3.select("#texte_"+te_obj)
					.attr("display","block")
				
				// alert(te_obj)
				// content = document.getElementById("texte_"+te_obj);
				// d3.select("#carte")
					// .append("svg")
					// .attr("id","bulletext")
					
					// .attr("x",100)
					// .attr("y",100)
					
					// .attr("background-color","#FFFFFF")
					// .append(content)
					// .text(content)
			})
			
		d3.select("#texte_"+te)
			.attr("zone",te)
			.on("click",function(){
				te_obj =  this.attributes.zone.value;
				d3.select("#texte_"+te_obj)
					.attr("display","none")
			})
			
	}
}