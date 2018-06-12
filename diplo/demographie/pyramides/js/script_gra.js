///--------------------Variables géométriques

///--Pour les pyramides
var debXFe,
debXHo,
fillFe,
fillHo,

debY,
coefX, //pour passer de la valeur en pourcentage à la largeur
hauteurBarre,
strokeBarre,
strokeWidth,

///--Pour le graphique


///--------------------Variables logiques
datedebut=1987,
datefin=2017,
dateA=datedebut,
larg_pyr=147,
larg_gra=140,
haut_gra=230,
annees=[],
vit=200,
ls_pays=['allemagne','bulgarie','croatie','france'],

pays;

///--------------------Action au chargement
window.onload = initialize();

///--------------------Fonctions
function initialize() {
	// pays = (document.getElementById("titre_pays").innerHTML).toLowerCase();
	// queue()											
		// .defer(d3.csv,"data/"+ls_pays[0]+".csv")
		// .defer(d3.csv,"data/"+ls_pays[1]+".csv")
		// .defer(d3.csv,"data/"+ls_pays[2]+".csv")
		// .defer(d3.csv,"data/"+ls_pays[3]+".csv")
		// .await(callback0); 
	
	// function callback0(error, data0,data1,data2,data3){
		// csvAl=data0;
		// csvBu=data1;
		// csvCr=data2;
		// csvFr=data3;
		// lcsv=[csvAl,csvBu,csvCr,csvFr];
		// data();
		transformations();
		
		// build_pyramide(dateA+"",ls_pays[0]);
		// build_pyramide(dateA+"",ls_pays[1]);
		// build_pyramide(dateA+"",ls_pays[2]);
		// build_pyramide(dateA+"",ls_pays[3]);
		
		defile(vit);
	// }
}

function transformations(){
	for(i=0;i<ls_pays.length;i++){
		d3.select("#solde_"+ls_pays[i])
			.attr("transform","translate("+(larg_gra*(i%2)-larg_pyr)+","+parseInt(i/2)*haut_gra+")")

		d3.select("#contexte_"+ls_pays[i])
			.attr("transform","translate("+(larg_gra*(i%2)-larg_pyr)+","+parseInt(i/2)*haut_gra+")")
			
		X=document.getElementById("titre_pays").attributes.x.value;
		Y=((document.getElementById("milliers"+i).attributes.transform.value).split(" ")[5]).split(")")[0];
		
		d3.select("#titres")
			.append("text")
			.attr("x",larg_gra*(i%2))
			.attr("y",Y-15+parseInt(i/2)*haut_gra)
			.text(ls_pays[i].toUpperCase())
	}
	
	for(a=datedebut;a<(datefin*1+1);a++){
		annees.push(a+"");
	}
}

function defile(vitt){
	c = setInterval(function(){
		if(dateA==datefin){
			
			clearInterval(c);
			setTimeout(function(){
				dateA=datedebut;
				defile(vit);
			},1200);
		} else if(dateA==2017){
			clearInterval(c);
			
			setTimeout(function(){
				dateA=dateA*1+1;
				defile(vit);
			},1200);
		} else {
			dateA=dateA*1+1;
		}
		build_pyramide(dateA+"",ls_pays[0]);
		build_pyramide(dateA+"",ls_pays[1]);
		build_pyramide(dateA+"",ls_pays[2]);
		build_pyramide(dateA+"",ls_pays[3]);
	},vitt)

}


function build_pyramide(date,p){
	d3.select("#indic_date").text(date);
	// alert(p);
	///----Pour le graphique
	posDate=annees.indexOf(date);
	d3.select("#solde_"+p)
		.selectAll("g")
		.attr("display",function(d,i){
			// console.log(i+" "+posDate);
			if(i<=posDate){
				return 'block';
			}else {
				return 'none';
			}
		})
		.attr("stroke",function(d,i){
			if(i==posDate){
				return '#eeeeee';
			}else {
				return 'none';
			}
		})
		
	d3.select("#contexte_"+p).select("#indic_date_graphique")
		.selectAll("g")
		.attr("display",function(){
			dateObj = (this.id).split("_")[1];
			if(parseInt(date)>=parseInt(dateObj)){
				return 'block'
			} else {
				return 'none'
			}
		})
		
	if(parseInt(date)>=2001){
		d3.select("#plus_bulgarie").transition().duration(vit).attr("opacity",1).attr("display",'block')
		d3.selectAll(".linemove").transition().duration(vit).attr("x2",214.7)
	}else {
		d3.select("#plus_bulgarie").transition().duration(vit).attr("opacity",0).attr("display",'none')
		d3.selectAll(".linemove").transition().duration(vit).attr("x2",261.5)
	}
		
}