///--------------------Variables géométriques

var reducteur = 1200,


///--------------------Variables logiques
datedebut=1800,
datefin=2050,
dateA=datedebut,
annees=[],
vit=15,
data0 = [],
data1 = [],
fillAs='#f9b233',
fillEu='#d10a10',
fillAf='#6fb52b',
fillOc='#c665a4',
fillAl='#84c7ef',
fillAn='#419fd9',
ls_reg=['af','al','an','as','eu','oc'],
ls_reg_entier=['AFRIQUE',['AMERIQUE','CENTRALE','ET DU SUD'],['AMERIQUE','DU NORD'],'ASIE','EUROPE','OCEANIE'],
nuancier=[fillAf,fillAl,fillAn,fillAs,fillEu,fillOc];

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
		build_dessin();
		defile(vit);
		// build_cartogramme("2050");
	}
	
}

function build_dessin(){
	
	for(i=0;i<ls_reg.length;i++){
		d3.select("#place_cercles").append("circle")
			.attr("id",ls_reg[i])
			.attr("fill",nuancier[i])
		d3.select("#place_textes")
			
			.attr("fill","#000000")
			.attr("stroke","#000000")
			.attr("stroke-with",4)
			.append("g")
			.attr("id","gt_"+ls_reg[i])
			.append("text")
			.attr("id","tx_"+ls_reg[i])
			.attr("font-size",5.5)
			
		// alert(typeof(ls_reg_entier[i]));
		if(typeof(ls_reg_entier[i])=='string'){
			d3.select("#tx_"+ls_reg[i])
				.append("tspan")
				.attr("x",0)
				.attr("y",0)
				.text(ls_reg_entier[i])
			YY = 1;
		} else {
			ls=ls_reg_entier[i];
			for(l=0;l<ls.length;l++){
				d3.select("#tx_"+ls_reg[i])
					.append("tspan")
					.attr("x",0)
					.attr("y",l*6)
					.text(ls[l])
			}
			YY=ls.length;
		}
		
		d3.select("#tx_"+ls_reg[i])
			.append("tspan")
			.attr("id","val_"+ls_reg[i])
			.attr("x",0)
			.attr("y",YY*6)
		
		d3.select("#place_uses")
			.append("use")
			.attr("href","#tx_"+ls_reg[i])
			.attr("fill",nuancier[i])
	}
};

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
		build_cartogramme(dateA+"");
	},vitt)
	
	d3.select("#stop")	
		.on("click",function(){
			clearInterval(c);
		})
}

function build_cartogramme(date){
	dataDate = data1[annees.indexOf(date)];
	
	///------CERCLES
	var x0=document.getElementById("centro0").attributes.cx.value;
	var y0=document.getElementById("centro0").attributes.cy.value;
	// var x1=document.getElementById("centro1").attributes.cx.value;
	// var y1=document.getElementById("centro1").attributes.cy.value;
	// var x2=document.getElementById("centro2").attributes.cx.value;
	// var y2=document.getElementById("centro2").attributes.cy.value;
	
	var valEu = dataDate[0]['eu'];
	var valAs = dataDate[0]['as'];
	var valAf = dataDate[0]['af'];
	
	var rAs = Math.sqrt(dataDate[0]['as']/Math.PI)/reducteur;
	var rEu = Math.sqrt(dataDate[0]['eu']/Math.PI)/reducteur;
	var rAf = Math.sqrt(dataDate[0]['af']/Math.PI)/reducteur;
	var rOc = Math.sqrt(dataDate[0]['oc']/Math.PI)/reducteur;
	var rAl = Math.sqrt(dataDate[0]['al']/Math.PI)/reducteur;
	var rAn = Math.sqrt(dataDate[0]['an']/Math.PI)/reducteur;
	
	var aEu = rAs*1+rAf*1
	var aAf = rAs*1+rEu*1
	var aAs = rEu*1+rAf*1
	
	var alphaAs = Math.acos((-1*(aAs*aAs)+(aEu*aEu)+(aAf*aAf))/(2*aEu*aAf));
	var alphaAf = Math.acos((-1*(aAf*aAf)+(aEu*aEu)+(aAs*aAs))/(2*aEu*aAs));
	var alphaEu=Math.acos((-1*(aEu*aEu)+(aAf*aAf)+(aAs*aAs))/(2*aAf*aAs));
	var alphaEu2=Math.acos((-1*(aEu*aEu)+(aAf*aAf)+(aAs*aAs))/(2*aAf*aAs));

	var cxAs=x0*1+rAs*1;
	var cyAs=y0-(Math.tan(alphaAs/2)*rAs);
	
	var cxEu=x0-rEu;
	var cyEu=y0-(Math.tan(alphaAs/2)*rEu);
	
	var cxAf=cxEu*1+(rEu*1+rAf*1)*Math.cos(alphaEu);
	var cyAf=cyEu*1+(rEu*1+rAf*1)*Math.sin(alphaEu);
	
	var cxOc=x0*1+rAs;
	var cyOc=y0*1+rAs;
	
	if(rAf>rEu){
		var EL=rAf;
	}else {
		var EL=rEu;
	}
	var cxAl=x0-EL*2-rAl-10;
	var cyAl=y0*1+rAl;
	var cxAn=x0-EL*2-rAn-10;
	var cyAn=y0*1-rAn;
	
	d3.select("#as").attr("cx",cxAs).attr("cy",cyAs).attr("r",rAs);
	d3.select("#eu").attr("cx",cxEu).attr("cy",cyEu).attr("r",rEu);
	d3.select("#af").attr("cx",cxAf).attr("cy",cyAf).attr("r",rAf);
	
	d3.select("#oc").attr("cx",cxOc).attr("cy",cyOc).attr("r",rOc)
	d3.select("#al").attr("cx",cxAl).attr("cy",cyAl).attr("r",rAl);
	d3.select("#an").attr("cx",cxAn).attr("cy",cyAn).attr("r",rAn);

	if(dateA>2018){
		d3.select("#place_cercles").selectAll("circle")
			.attr("opacity",0.5)
	}else {
		d3.select("#place_cercles").selectAll("circle")
			.attr("opacity",1)
	}
	
	///------TEXTES
	d3.select("#tx_as").attr("transform","translate("+(cxAs*1+rAs*1)+","+(cyAs-rAs)+")");
	d3.select("#val_as").text(parseInt(dataDate[0]['as']/1000000))

	d3.select("#tx_eu").attr("transform","translate("+(cxEu-rEu-5)+","+(cyEu-rEu-10)+")");
	d3.select("#val_eu").text(parseInt(dataDate[0]['eu']/1000000))
	
	d3.select("#tx_af").attr("transform","translate("+(cxAf-15)+","+(cyAf*1+rAf*1+10)+")");
	d3.select("#val_af").text(parseInt(dataDate[0]['af']/1000000))
	
	d3.select("#tx_oc").attr("transform","translate("+(cxOc)+","+(cyOc*1+rOc*1+10)+")");
	d3.select("#val_oc").text(parseInt(dataDate[0]['oc']/1000000))
	
	d3.select("#tx_an").attr("transform","translate("+(cxAn-rAn-20)+","+(cyAn-rAn-10)+")");
	d3.select("#val_an").text(parseInt(dataDate[0]['an']/1000000))

	d3.select("#tx_al").attr("transform","translate("+(cxAl-rAl-20)+","+(cyAl*1+rAl*1+10)+")");
	d3.select("#val_al").text(parseInt(dataDate[0]['al']/1000000))
	
	///------GLOBAL
	global=0;
	globalMin=0;
	globalMax=0;
	for(i=0;i<ls_reg.length;i++){
		global=global*1+dataDate[0][(ls_reg[i])]*1
		globalMin=globalMin*1+data1[0][0][(ls_reg[i])]*1
		globalMax=globalMax*1+data1[(annees.length-1)][0][(ls_reg[i])]*1
	}

	if(global<1000000000){
		var globalTx = parseInt(global/1000000)+" millions"
	} else if(dateA<2019) {
		var globalTx = (parseInt(global/100000000))/10+" milliards"
	} else {
		var globalTx = (parseInt(global/100000000))/10+" milliards ?"
	}
	
	d3.select("#globalvalue").text(globalTx);
	d3.select("#indicdate").text(date).attr("font-size",function(){
		var fmin = this.attributes.fmin.value;
		var fmax = this.attributes.fmax.value;
		fs=fmin*1+(fmax-fmin)*(global-globalMin)/(globalMax-globalMin);
		// alert(fmin)
		return fs;
	})
	
}

function data(){
	
		for(i=0;i<data0.length;i++){
			if(annees.indexOf(data0[i].annee)==-1){
				annees.push(data0[i].annee)
				data1.push([data0[i]])
			} else {
				data1[annees.indexOf(data0[i].annee)].push(data0[i]);
			}
		}
		console.log(data1);
}