///Géométriques
var width = 1500,
height = 500,

///Graphiques
nuancier = ["#FFFFFF","#EEEEEE","#CCCCCC","#EEEEFF","#000000","#0000ff"],
nuancierDiscr1 = ["#DBBAA6","#CE9683","#C57968","#B8574C","#AD3335"],
nuancierDiscr2= ["#dddddd","#952C83","#9974AE","#BDD4EA","#98A9D1"],

///Géographiques
rayon_terre =  6378140,
super_total=0, //mise a jour dans drawMap, var pays = ..
scale=400000,
pos_mapX=width/4,
pos_mapY=height/3,
proj = d3.geo.conicConformal() //définition de la projection  : carte centrée manuellement, l'échelle est définie en variabe globale
			.center([3.014053,50.630297])
			.rotate([0, 0])
			.scale(scale)
			
///Logique
hexa=["0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F"]

window.onload = initialize();

function initialize() {
	///Chargement des données
	queue()											
		// .defer(d3.json,"data/pays.topojson")
		.defer(d3.json,"data/mygeodata2/iris_nrd_4326.topojson")
		.defer(d3.csv,"data/dvf_lille_2018.csv")
		.defer(d3.csv,"data/dvf_lille_2017.csv")
		.await(callback0); 
	
	function callback0(error,dataIris,data2018,data2017){
		fond(dataIris);
		
		d3.select("#carte").append("input")
			.attr("type","button")
			.attr("value","2017")
			.on("click",function(){
				visio_2018(data2017,"2017");
			})
		
		d3.select("#carte").append("input")
			.attr("type","button")
			.attr("value","2018")
			.on("click",function(){
				visio_2018(data2018,"2018");
			})

		
		
	}
	
}

function visio_2018(datas,annee){
	ls_val=[];
	
	d3.selectAll("circle").transition().duration(500).attr("rayon",0).transition().remove();
	
	for(i=0;i<datas.length;i++){
		
		xy=proj([datas[i].longitude,datas[i].latitude]);
		if(datas[i].surface_reelle>0&&datas[i].Valeur_fonciere>0){
			val_m2=datas[i].Valeur_fonciere/datas[i].surface_reelle;
			
			if(parseFloat(val_m2)<10000){ //valeur surestimée
				ls_val.push(parseFloat(val_m2))
			}
		}else{
			val_m2 = "none" ;
		}
		
		
		d3.select("svg")
			.append("circle")
			.attr("class","c_"+annee)
			.attr("r",0)
			.attr("fill","red")
			.attr("cx",xy[0])
			.attr("cy",xy[1])
			.attr("val_m2",val_m2)
	}
	
	max = Math.max(...ls_val);
	min = Math.min(...ls_val);
	console.log(ls_val);
	d3.selectAll(".c_"+annee)
		.attr("fill",function(){
			if(this.attributes.val_m2.value=="none"){
				d3.select(this).attr("display","none");
				return "#222222"
				// return "#ffffff"
			}else{
				val = parseInt(255*(this.attributes.val_m2.value-min)/(max-min));
				val_hexa = convert_hexa(val);
				return "#"+val_hexa+val_hexa+"ff"
				// return "#0000ff"
			}
		})
		.transition()
		.duration(500)
		.attr("r",3)
		
	// alert(convert_hexa(200))
}

function convert_hexa(dec){
	unit_s = hexa[dec%16]
	diz_s = hexa[parseInt(dec/16)]
	
	return diz_s+unit_s;
}

function fond(dataIris){
		///SVG content
		var map = d3.select("#carte")
			.append("svg")
			.attr("viewBox","0 -30 "+width+" "+height)
			.attr("width", "100%")
			.attr("id", "map")
			.style("overflow","visible")
			
		
	var path = d3.geo.path() 
			.projection(proj);
	
		
		var iris = map.selectAll(".iris")  
			.data(topojson.feature(dataIris,
				dataIris.objects.iris_nrd_4326).features)	
			
			.enter() 
			.append("path") 
			.attr("d", path)
			.attr("CODE_IRIS", function(d){
				return d.properties.CODE_IRIS;
				
			})
			.attr("fill",function(){
				code = this.attributes.CODE_IRIS.value;
				if(code.indexOf("59350")!=-1){
					return "#000000"
				}else{
					return "#333333"
				}
			})
			
			
}


