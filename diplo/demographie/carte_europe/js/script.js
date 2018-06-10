///--------------------Variables géométriques



///--------------------Variables logiques
data0=[],
data1=[],
dateDebut=1987,
dateFin=2018,
XdebGr=0,
YdebGr=8,
widthG=150,
heightG=70,
minVal=70,
maxVal=160,
colonne=4,
// nbrGra=0,
viewbox=566.9,
ls_pays=[];

///--------------------Action au chargement
window.onload = initialize();

///--------------------Fonctions
function initialize(){
	queue()											
		.defer(d3.csv,"data/pop_100_seul.csv")
		.defer(d3.csv,"data/pop_exact_seul.csv")
		.await(callback0); 
	
	function callback0(error, datacsv, dataexact){
		data0 = datacsv;
		data1 = dataexact;
		data();
		build_dessins();
		build_graphiques
	}
}

function build_dessins(){
	d3.selectAll(".paysclick")
		.style("cursor","pointer")
		.on("click",function(){
			var ID = this.id;
			d3.select("#titre_graphiques").transition().duration(500).attr("opacity",1);
			if(document.getElementById("gra_"+ID)){
				var rang = document.getElementById("gra_"+ID).attributes.rang.value;
				d3.selectAll(".g_graph")
					.transition()
					.duration(500)
					.attr("transform",function(){
						nbrGra = this.attributes.rang.value;
						if(this.attributes.rang.value<rang){
							nbrGra=nbrGra*1+1;
							d3.select(this).attr("rang",nbrGra)
							if(nbrGra>colonne*2+1){
								d3.select(this).remove();
							} else if(nbrGra<=colonne){
								X = widthG*-1;
								Y = (nbrGra*1+1)*heightG*1.5;
							} else {
								X = viewbox*1;
								Y = (nbrGra-colonne)*heightG*1.5;
							}
							nbrGra++;
							return "translate("+X+","+Y+")"
						} else {
							return this.attributes.transform.value;
						}
					})
				d3.select("#gra_"+this.id)
					.attr("rang",0)
					.transition()
					.duration(500)
					.attr("transform",function(){
						nbrGra = 0;
						if(nbrGra>colonne*2+1){
								d3.select(this).remove();
						} else if(nbrGra<=colonne){
							X = widthG*-1;
							Y = (nbrGra*1+1)*heightG*1.5;
						} else {
							X = viewbox*1;
							Y = (nbrGra-colonne)*heightG*1.5;
						}
						return "translate("+X+","+Y+")"
					})
					
			
			} else {
				var ind = ls_pays.indexOf(ID);
				var data = data0[ind];
				var dataE = data1[ind];
				points="";
				
				d3.select("#place_graphiques")
						.append("g")
						.attr("class","g_graph")
						.attr("id","gra_"+this.id)
						.attr("transform",function(){
							var X;
							var Y;
							d3.select("#"+ID)
								.select("text").each(function(){
									var t = this.attributes.transform.value;
									X = t.split(" ")[4];
									Y = (t.split(" ")[5]).split(")")[0];
								})
							return "translate("+X+","+Y+")"
						})
						.attr("rang",-1)
						
				d3.selectAll(".g_graph")
						.attr("rang",function(){
							return this.attributes.rang.value*1+1;
						})
						.transition()
						.duration(500)
						.attr("transform",function(){
							var nbrGra = this.attributes.rang.value;
							if(nbrGra>colonne*2+1){
								d3.select(this).remove();
							} else if(nbrGra<=colonne){
								X= widthG*-1;
								Y = (nbrGra*1+1)*heightG*1.5;
							} else {
								X= viewbox*1;
								Y = (nbrGra-colonne)*heightG*1.5;
							}
							nbrGra++;
							return "translate("+X+","+Y+")"
						})
						
				d3.select("#gra_"+this.id)
					.append("use")
					.attr("href","#context")
				
				d3.select("#gra_"+this.id)
					.append("text")
					.text(this.id)
					.attr("x",XdebGr)
					.attr("y",YdebGr-heightG)
					// .attr("font-weight",400)
					.attr("font-size",9)
				
				d3.select("#gra_"+this.id)
					.append("polyline")
					
				for(i=dateDebut;i<dateFin;i++){
					X = XdebGr*1+(i-dateDebut)*widthG/(dateFin-dateDebut);
					Y= YdebGr*1-(data[i]-minVal)*heightG/(maxVal-minVal);
					if(data[i]!="none"&&dataE[i]!=":"){
						d3.select("#gra_"+this.id)
							.append("rect")
							.attr("x",X-widthG*0.3/(dateFin-dateDebut))
							.attr("y",Y-widthG*0.3/(dateFin-dateDebut))
							.attr("width",widthG*0.6/(dateFin-dateDebut))
							.attr("height",widthG*0.6/(dateFin-dateDebut))
							.attr("id","c_"+i)
							.attr("class","rep_survol")
							// .attr("fill-opacity",0)
							.attr("fill","#006699")
							// .attr("r",widthG*0.5/(dateFin-dateDebut))
							.style("cursor","crosshair")
							.attr("val",data[i])
							.attr("val2",dataE[i])
							.on("mouseover",function(){
								var tx = (this.id).split("_")[1];
								var val = parseInt(this.attributes.val2.value/1000);//*1000)100;
								var X = this.attributes.x.value;
								var Y = this.attributes.y.value;
								d3.select(this)
									.attr("transform","translate(-"+widthG*0.2/(dateFin-dateDebut)+",0)")
									.attr("width",widthG/(dateFin-dateDebut))
									.attr("height",widthG/(dateFin-dateDebut))
								d3.select("#gra_"+ID)
									.append("text")
									.attr("x",X*1+10)
									.attr("y",Y-10)
									// .attr("font-weight","700")
									.attr("font-size",8)
									.text(val)
									.attr("id","t_"+tx)
							})
							.on("mouseout",function(e){
								var tx = (this.id).split("_")[1];
								d3.select("#t_"+tx).remove();
								d3.select(this)
									.attr("transform","")
									.attr("width",widthG*0.6/(dateFin-dateDebut))
									.attr("height",widthG*0.6/(dateFin-dateDebut))
							})
						points=points+" "+X+','+Y;
					}
					
				}
				
				// console.log(data);
				d3.select("#gra_"+this.id)
					.select("polyline")
					.attr("fill","none")
					.attr("stroke","#006699")
					.attr("stroke-width",0.5)
					.attr("points",points)
			}
		})
		
	d3.select("#ex_graphiques")
		.append("g")
		.attr("id","context")
		
	for(i=minVal;i<maxVal;i=i*1+10){
			d3.select("#context")
				.append("line")
				.attr("x1",XdebGr)
				.attr("x2",XdebGr*1+widthG*1)
				// .attr("y1",YdebGr*1)
				// .attr("y2",YdebGr*1+heightG*1)
				.attr("y1",YdebGr*1-(i-minVal)*heightG/(maxVal-minVal))
				.attr("y2",YdebGr*1-(i-minVal)*heightG/(maxVal-minVal))
				.attr("stroke",function(){
					if(i!=100){
						return "#aaaaaa"
					}else {
						return "#000000"
					}
				})
				.attr("stroke-width",0.2)
			d3.select("#context")
				.append("text")
				.text(i)
				
				.attr("fill",function(){
					if(i!=100){
						return "#aaaaaa"
					}else {
						return "#000000"
					}
				})
				.attr("x",XdebGr*1+widthG*1+5)
				.attr("y",YdebGr*1+2.5-(i-minVal)*heightG/(maxVal-minVal))
				.attr("font-size",5)
	}
	
	for(i=dateDebut;i<dateFin;i++){

		if((i%5)==0){
			d3.select("#context")
				.append("text")
				.text(i)
				.attr("fill","#aaaaaa")
				.attr("y",YdebGr*1+10)
				.attr("x",XdebGr*1-5+(i-dateDebut)*widthG/(dateFin-dateDebut))
				.attr("font-size",5)
				
				
			Y2 = YdebGr*1+5;
		} else {
			Y2 = YdebGr*1+2.5;
		}
		
		d3.select("#context")
			.append("line")
			.attr("y1",YdebGr)
			.attr("y2",Y2)
			.attr("x1",XdebGr*1+(i-dateDebut)*widthG/(dateFin-dateDebut))
			.attr("x2",XdebGr*1+(i-dateDebut)*widthG/(dateFin-dateDebut))
			.attr("stroke","#aaaaaa")
			.attr("stroke-width","0.5")
		
	}
	
	// d3.select("#place_graphiques")
		// .append("g")
		// .attr("id","courbes")
		
	// d3.select("#place_graphiques")
		// .append("g")
		// .attr("id","points")

}



function build_graphiques(pays){
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
			ls_pays.push(data0[i].pays);
		}
}