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
datefin=2050,
dateA=datedebut,
annees=[],
dataPyr=[],
dataPyr0=[],
vit=150,
pays;

///--------------------Action au chargement
window.onload = initialize();

///--------------------Fonctions
function initialize() {
	pays = (document.getElementById("titre_pays").innerHTML).toLowerCase();
	queue()											
		.defer(d3.csv,"data/"+pays+".csv")
		.await(callback0); 
	
	function callback0(error, datacsv){
		dataPyr0 = datacsv;
		data();
		recup_val_reperes();
		// build_pyramide('2000');
		
		// d3.select("#let")
			// .on("click",function(){
				defile(vit);
			// })
			
		curs();
	}
}

function curs(){
	d3.select("#rangevit").on("change",function(){
		// console.log(this.value);
		d3.select("#indicrange")
			.html(this.value);
		vit=this.value;
	})
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
		build_pyramide(dateA+"");
	},vitt)
	
	d3.select("#stop")	
	.on("click",function(){
		clearInterval(c);
	})
}


function recup_val_reperes(){	
	///----Pour la pyramide
	rep_fe = document.getElementById("rep_femme");
	rep_ho = document.getElementById("rep_homme");
	
	debXFe = rep_fe.attributes.x.value*1+rep_fe.attributes.width.value*1;
	debXHo = rep_ho.attributes.x.value;
	fillFe = rep_fe.attributes.fill.value;
	fillHo = rep_ho.attributes.fill.value;
	
	debY= rep_ho.attributes.y.value;
	coefX=(debXFe-document.getElementById("ligne8").attributes.x1.value)/8;
	hauteurBarre =((rep_ho.attributes.y.value)-(rep_fe.attributes.y.value))*5/100; //on prend pas la vrai hauteur c'était pas collé
	strokeBarre =rep_fe.attributes.stroke.value;
	strokeWidth =rep_fe.attributes['stroke-width'].value;
}

function build_pyramide(date){
	d3.select("#indic_date").text(date);
	
	///----Pour la pyramide
	dataDate = dataPyr[annees.indexOf(date)];
	if(dataDate[0].Sex=="Female"){
		dataFe = dataDate[0];
		dataHo = dataDate[1];
	} else {
		dataFe = dataDate[1];
		dataHo = dataDate[0];
	} 
	
	valF = 6;
	valH = 5;
	if(parseFloat(date)>2017){
		fillFeDa="none";
		strokeFeDa=fillFe;
		fillHoDa="none";
		strokeHoDa=fillHo;
		strokeW = strokeWidth*2;
	}else {
		fillFeDa=fillFe;
		fillHoDa=fillHo;
		strokeFeDa=strokeBarre;
		strokeHoDa=strokeBarre;
		strokeW = strokeWidth;
	}
	
	d3.selectAll(".recPyr1").remove();
	d3.selectAll(".recPyr0").attr("class","recPyr1").attr("opacity",0.3);
	d3.selectAll(".recPyr").attr("class","recPyr0").attr("opacity",0.6);
	
	for(i=0;i<=(100/5);i++){
		if(i!=(100/5)){
			inter = "a"+(i*5)+"-"+((i*1+1)*5-1)
		
		} else {
			inter="a100+"
		}
		if(dataFe[inter]){
			valF=dataFe[inter].split(",")[0]+"."+dataFe[inter].split(",")[1];
			valH=dataHo[inter].split(",")[0]+"."+dataHo[inter].split(",")[1];
		}else {
			alert(inter);
			console.log(dataFe);
		}
		if(valF.indexOf('undefined')==-1&&valF.indexOf('undefined')==-1) {
			d3.select("#pyramides")
				.selectAll(".rec"+i)
				.data([[debXFe-valF*coefX,valF*coefX,fillFeDa,strokeFeDa],[debXHo*1,valH*coefX,fillHoDa,strokeHoDa]])
				.enter()
				.append("rect")
				.attr("x",function(d){
					return d[0]
				})
				.attr("y",debY-i*hauteurBarre)
				.attr("width",function(d){
					return d[1]
				})
				.attr("class",".rec"+i+" recPyr")
				.attr("height",hauteurBarre)
				.attr("fill",function(d){
					return d[2]
				})
				.attr("stroke",function(d){
					return d[3]
				})
				.attr("stroke-width",strokeW)
		}
	}
	
	///----Pour le graphique
	posDate=annees.indexOf(date);
	d3.select("#solde")
		.selectAll("g")
		.attr("display",function(d,i){
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
		.attr("opacity",function(d,i){
			if(i==0){
				i=0.5;
			}
			return 0.1+Math.sqrt(1-(posDate-i)/posDate);
		})
		
	d3.select("#indic_date_graphique")
		.selectAll("g")
		.attr("opacity",function(){
			dateObj = (this.id).split("_")[1];
			// alert(dateObj);
			// if(parseInt(date)>=parseInt(dateObj)){
				// return 1
			// } else {
				// return 0
			// }
			
			j = annees.indexOf(dateObj)
			// if(j==0){
				// alert(j+" "+(1-(posDate-j)/posDate));
			// }
			if(j==0){
				j=2;
			}
			return 0.1+Math.sqrt(1-(posDate-j)/posDate);
			
		})
		.attr("display",function(){
			dateObj = (this.id).split("_")[1];
			if(parseInt(date)>=parseInt(dateObj)){
				return 'block'
			} else {
				return 'none'
			}
		})
		
	if(pays=="bulgarie"){
		if(parseInt(date)>=2001){
			d3.select("#plus_bulgarie").attr("display",'block')
			d3.selectAll(".linemove").attr("x2",214.7)
		}else {
			d3.select("#plus_bulgarie").attr("display",'none')
			d3.selectAll(".linemove").attr("x2",261.5)
		}
		
	}
}

function data(){
	
		for(i=0;i<dataPyr0.length;i++){
			if(annees.indexOf(dataPyr0[i].Time)==-1){
				annees.push(dataPyr0[i].Time)
				dataPyr.push([dataPyr0[i]])
			} else {
				dataPyr[annees.indexOf(dataPyr0[i].Time)].push(dataPyr0[i]);
			}
		}
		console.log(dataPyr);
}