///--------------------Variables géométriques

var reducteur = 170,


///--------------------Variables logiques
data0=[],
data1=[],
datedebut=1987,
datefin=2018,
dateA=datedebut,
annees=[],
vit=30,
ls_pays=["Albania","Andorra","Austria","Belarus","Belgium","Bosnia_and_Herzegovina","Bulgaria","Croatia","Cyprus","Czech_Republic","Denmark","Estonia","Finland","France","Germany","Greece","Holy_See","Hungary","Iceland","Ireland","Italy","Latvia","Liechtenstein","Lithuania","Luxembourg","Macedonia_FYR","Malta","Moldova","Monaco","Montenegro","Netherlands","Norway","Poland","Portugal","Romania","Russia","San_Marino","Serbia","Slovak_Republic","Slovenia","Spain","Sweden","Switzerland","Ukraine","United_Kingdom"];

///--------------------Action au chargement
window.onload = initialize();

///--------------------Fonctions
function initialize(){
	queue()											
		.defer(d3.csv,"data/data_eu.csv")
		.await(callback0); 
	
	function callback0(error, datacsv){
		data0 = datacsv;
		data();
		build_dessins();
		defile(vit);
		// build_cercles("2018");
	}
}

function build_dessins(){
	d3.select("#rep_cercles")
		.selectAll("path")
		.each(function(){
			var fill = this.attributes.fill.value;
			var ID = "c_"+this.id;
			var X = ((this.attributes.d.value).split("M")[1]).split(",")[0];
			var Y = (((this.attributes.d.value).split("M")[1]).split(",")[1]).split("C")[0];
			d3.select("#place_cercles").append("circle").attr("fill",fill).attr("cx",X).attr("cy",Y).attr("id",ID).attr("stroke","#000000").attr("stroke-width",0.2);
		})
}

function defile(vitt){
	// console.log(datedebut);
	c = setInterval(function(){
		if(dateA>=datefin){
			dateA=datedebut;
			clearInterval(c);
			setTimeout(function(){
				defile(vit);
			},500);
		} else {
			dateA=dateA*1+1;
		}
		build_cercles(dateA+"");
	},vitt)
	
	// d3.select("#toute_dates")	
		// .on("click",function(){
			// clearInterval(c);
			// setTimeout(function(){
				// defile(vit,1800,2050);
			// },500);
		// })

	// d3.select("#dates_reduct")	
		// .on("click",function(){
			// clearInterval(c);
			// setTimeout(function(){
				// defile(vit,1987,2018);
			// },500);
		// })
}

function build_cercles(date){
	console.log(date);
	dataDate = data1[annees.indexOf(date)];
	// console.log(annees);
	// console.log(annees.indexOf(date));
	
	for(i=0;i<ls_pays.length;i++){
		var val=dataDate[0][ls_pays[i]];
		var r = Math.sqrt(val/Math.PI)/reducteur;
		d3.select("#c_"+(ls_pays[i]).toLowerCase()).attr("r",r);
	}
	
	d3.select("#indicdate").text(date);
}

function data(){
	
		for(i=0;i<data0.length;i++){
			if(annees.indexOf(data0[i].annee)==-1){
				if(data0[i].annee>=datedebut&&data0[i].annee<=datefin){
					annees.push(data0[i].annee)
					data1.push([data0[i]])
				}
			} else {
				data1[annees.indexOf(data0[i].annee)].push(data0[i]);
			}
		}
}