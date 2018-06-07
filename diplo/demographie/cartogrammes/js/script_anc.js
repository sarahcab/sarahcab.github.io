///--------------------Variables géométriques

///--Pour les pyramides


///--------------------Variables logiques
datedebut=1800,
datefin=2050,
dateA=datedebut,
annees=[],
vit=150,
data0 = [],
data1 = [];

///--------------------Action au chargement
window.onload = initialize();

///--------------------Fonctions
function initialize(){
	queue()											
		.defer(d3.csv,"data/donnees_tout.csv")
		.await(callback0); 
	
	function callback0(error, datacsv){
		data0 = datacsv;
		data();
		defile(vit);
		// build_cartogramme("2018");
	}
	
}

function defile(vitt){
	c = setInterval(function(){
		if(dateA==datefin){
			dateA=datedebut;
			clearInterval(c);
			setTimeout(function(){
				defile(vit);
			},500);
		} else {
			dateA=dateA*1+1;
		}
		// date(dateA)
		build_cartogramme(dateA+"");
	},vitt)
	
	d3.select("#stop")	
		.on("click",function(){
			clearInterval(c);
		})
}

function build_cartogramme(date){
	dataDate = data1[annees.indexOf(date)];
	var x0=50;
	var y0=20;
	
	///Trois continent contigus (voir figure pour le calcul):
	var valEu = dataDate[0]['eu'];
	var valAs = dataDate[0]['as'];
	var valAf = dataDate[0]['af'];
	
	var rAs = Math.sqrt(dataDate[0]['as']/Math.PI)/1500;
	var rEu = Math.sqrt(dataDate[0]['eu']/Math.PI)/1500;
	var rAf = Math.sqrt(dataDate[0]['af']/Math.PI)/1500;
	
	
	
	var alphaAs = Math.PI*(1/valAs)/((1/valEu)+(1/valAs)+(1/valAf));
	var alphaEu = Math.PI*(1/valEu)/((1/valEu)+(1/valAs)+(1/valAf));
	var alphaAf = Math.PI*(1/valAf)/((1/valEu)+(1/valAs)+(1/valAf));

	var cxAs=x0*1+rAs*1;
	var cyAs=y0-(Math.tan(alphaAs/2)*rAs);
	
	var cxEu=x0-rEu;
	var cyEu=y0-(Math.tan(alphaAs/2)*rEu);
	
	var cxAf=cxEu*1+(rEu*1+rAf*1)*Math.cos(alphaEu);
	var cyAf=cyEu*1+(rEu*1+rAf*1)*Math.sin(alphaEu);
	
	d3.select("#as").attr("cx",cxAs).attr("cy",cyAs).attr("r",rAs);
	d3.select("#eu").attr("cx",cxEu).attr("cy",cyEu).attr("r",rEu);
	d3.select("#af").attr("cx",cxAf).attr("cy",cyAf).attr("r",rAf);
	
	
	// console.log(dataDate);
	
	// d3.selectAll("circle")
		// .attr("opacity",0.5)
		// .attr("r",function(){
			// reg = this.id;
			// console.log(reg);
			// val = dataDate[0][reg];
			// r = Math.sqrt(val/Math.PI)/1500;
			
			// console.log(r);
			// return r;
		// })
		
	
	
}

function data(){
	
		for(i=0;i<data0.length;i++){
			if(annees.indexOf(data0[i].annee)==-1){
				annees.push(data0[i].annee)
				data1.push([data0[i]])
			} else {
				data1[annees.indexOf(data0[i].Time)].push(data0[i]);
			}
		}
		console.log(data1);
}