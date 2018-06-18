var datacsv=[],
width=800,
height=500,
debCarX=20,
langue="english",
// nbselect=0,
selected=[],
types=[["Attractif","Répulsif","Incitatif","Réglementaire"],["Attractive","Repulsive","Incentive","Regulatory"]],
absolue_rep=[["Oui","Non"],["Yes","No"]],
clcpath="\\\\gpsrv1.univ-lille1.fr\\Dossier_Utilisateurs_2\\GEOGRAPHIE\\DOCTORANTS\\cabarry\\Documents\\ordi_bureau\\modelisation_rasters\\donnees\\clc_44\\",
colonnes=["layer_name","layer_path","type","coeff_ponderation","distancemax/buffer","description","code"]

///geom formulaires
var larg=230,
haut=80,
debX = 300,
debY = 0,
sizeCar=12,
sizeSel=6,
sizeT=9,
spCh=13,
nbtable=0;

var c;
window.onload = initialize();

function initialize(){
	queue()											
		.defer(d3.csv,"data/clc_nomenclature.csv")
		.await(callback1);

	function callback1(error,datacsv){
		data = datacsv;
		build_dessin();
	}
}

function hexadecimal(rouge,vert,bleu){
	hexa = ["0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f"];
	
	rouge_hexa=hexa[(rouge/16-(rouge%16)/16)]+hexa[(rouge%16)];
	vert_hexa=hexa[(vert/16-(vert%16)/16)]+hexa[(vert%16)];
	bleu_hexa=hexa[(bleu/16-(bleu%16)/16)]+hexa[(bleu%16)];
	
	couleur_hexa="#"+rouge_hexa+vert_hexa+bleu_hexa;
	return couleur_hexa;
}


function add_choix(nom,da,code,coul){
	///choix texte
	d3.select("#"+nom+code)
		.selectAll(".choix")
		.data(da[0])
		.enter()
		.append("g")
		.attr("class","choix")
		.attr("checked","false")
		.attr("id",function(d){
			return "ch_"+d
		})
		.style("cursor","pointer")
		.on("click",function(){
			d3.select("#"+nom+code)
				.selectAll(".choix")
				.attr("checked","false")
				.select(".ischecked")
				.transition()
				.duration(200)
				.attr("opacity",0)
				
			d3.select(this)
				.attr("checked","true")
				.select(".ischecked")
				.transition()
				.duration(200)
				.attr("opacity",1)
				
			d3.select("#absolu"+code).attr("display","block").transition().duration(200).attr("opacity",1)
			d3.select("#buff_dist"+code).attr("display","block").transition().duration(200).attr("opacity",1)
			
			if((this.id).split("_")[1]==types[0][0]||(this.id).split("_")[1]==types[0][1]){
				d3.select("#buff_dist"+code).select("#text_dist").transition().duration(200).attr("opacity",1)
				d3.select("#buff_dist"+code).select("#text_buff").transition().duration(200).attr("opacity",0)
			}else if((this.id).split("_")[1]==types[0][2]||(this.id).split("_")[1]==types[0][3]){
				d3.select("#buff_dist"+code).select("#text_dist").transition().duration(200).attr("opacity",0)
				d3.select("#buff_dist"+code).select("#text_buff").transition().duration(200).attr("opacity",1)
			}
			
		})
		.append("text")
		.attr("tx_fr",function(d,i){
			return da[0][i]
		})
		.attr("tx_en",function(d,i){
			return da[1][i]
		})
		.text(function(){
			if(langue=="francais"){
				return this.attributes.tx_fr.value;
			}else {
				return this.attributes.tx_en.value;
			}
		})
		.attr("x",debX*1+sizeCar*1.2+sizeSel*1)
		.attr("y",function(d,i){
			return debY*1+33+i*spCh
		})
		.attr("font-size",sizeT*0.65)
		
	///choix cercle fond
	d3.select("#"+nom+code)
		.selectAll(".choix")
		.append("circle")
		.attr("cx",debX*1+sizeCar*1.2)
		.attr("cy",function(d,i){
			return debY*1+30+i*spCh
		})
		.attr("r",sizeSel*0.5)
		.attr("fill","#ffffff")
		.attr("stroke","#000000")

	///choix cercle sélectionné
	d3.select("#"+nom+code)
		.selectAll(".choix")
		.append("circle")
		.attr("cx",debX*1+sizeCar*1.2)
		.attr("cy",function(d,i){
			return debY*1+30+i*spCh
		})
		.attr("r",sizeSel*0.2)
		.attr("fill","#000000")
		.attr("class","ischecked")
		.attr("opacity",0)
		.attr("fill",coul)
}

function build_form(code,coul0,labfr,laben,coul){
	nbselect = selected.length;
	
	if(selected.indexOf(code)==-1){
		d3.select("#validation")
			.attr("display","block")
			.transition()
			.duration(300)
			.attr("transform","translate(0,"+((nbselect*1.1+1)*haut)+")")
		
		debY = nbselect*haut*1.1;
		d3.select("#dessin").attr("viewBox",function(){
			if(((nbselect*1.1+2)*haut)>500){
				return "0 0 800 "+(nbselect*1.1+2)*haut
			}else {
				return "0 0 800 500"
			}
		})
		////////////rectangles couleur
		d3.select("#dessin")
			.append("g")
			.attr("class","select")
			.attr("id","select_"+code)
			.append("rect")
			.attr("x",debX)
			.attr("y",debY)
			.attr("width",larg)
			.attr("height",haut)
			.attr("fill","#ffffff")
			.attr("fill-opacity",0.7)
			.attr("stroke",coul0)
			
		d3.select("#select_"+code)
			.append("g")
			.attr("id","open"+code)
			.append("rect")
			.attr("x",debX)
			.attr("y",debY)
			.attr("width",sizeCar)
			.attr("height",sizeCar)
			.attr("fill",coul0)
			
		////////////titre
		d3.select("#select_"+code)
			.append("text")
			.attr("class","titre")
			.attr("tx_fr", labfr)
			.attr("tx_en", laben)
			.text(function(){
				if(langue=="francais"){
					return labfr
				}else {
					return laben
				}
			})
			.attr("font-size",sizeT)
			.attr("x",debX*1+sizeCar*1.2)
			.attr("y",debY*1+sizeT*1)
		
		////////////Type
		///s-titre
		d3.select("#select_"+code)
			.append("g")
			.attr("class","decision")
			.attr("id","type"+code)
			.append("text")
			.attr("tx_fr","Type de contrainte")
			.attr("tx_en","Type of constraint")
			.text(function(){
				if(langue=="francais"){
					return this.attributes.tx_fr.value;
				}else {
					return this.attributes.tx_en.value;
				}
			})
			.attr("font-size",sizeT*0.8)
			.attr("x",debX*1+sizeCar*1.2)
			.attr("y",debY*1+20)
		
		///réponses
		add_choix("type",types,code,coul)
			
		////////////Contarinte absolue
		///s-titre
		d3.select("#select_"+code)
			.append("g")
			.attr("id","absolu"+code)
			.attr("class","decision")
			.attr("display","none")
			.attr("opacity",0)
			.attr("transform","translate("+larg*0.4+",0)")
			.append("text")
			.attr("tx_fr","La contrainte est-elle absolue?")
			.attr("tx_en","Is the constraint absolute?")
			.text(function(){
				if(langue=="francais"){
					return this.attributes.tx_fr.value;
				}else {
					return this.attributes.tx_en.value;
				}
			})
			
			.attr("font-size",sizeT*0.8)
			.attr("x",debX*1+sizeCar*1.2)
			.attr("y",debY*1+20)
			
		///réponses
		add_choix("absolu",absolue_rep,code,coul)
			
		////////////Buffer-distance
		///s-titre
		d3.select("#select_"+code)
			.append("g")
			.attr("transform","translate("+larg*0.4+","+haut*0.47+")")
			.attr("display","none")
			.attr("opacity",0)
			.attr("class","decision")
			.attr("id","buff_dist"+code)
			.append("text")
			.attr("id","text_dist")
			.attr("tx_fr","Contrainte effective jusqu'à :")
			.attr("tx_en","Constraint effective up to :")
			
		d3.select("#buff_dist"+code)
			.append("text")
			.attr("id","text_buff")
			.attr("tx_fr","Elargir la zone de :")
			.attr("tx_en","Expand area by :")
			
		d3.select("#buff_dist"+code)
			.selectAll("text")
			.text(function(){
				if(langue=="francais"){
					return this.attributes.tx_fr.value;
				}else {
					return this.attributes.tx_en.value;
				}
			})
			.attr("font-size",sizeT*0.8)
			.attr("x",debX*1+sizeCar*1.2)
			.attr("y",debY*1+20)
			.attr("opacity",0)
		
		d3.select("#buff_dist"+code)
			.selectAll(".range")

			.data(["+"," -"])
			.enter()
			.append("g")
			.attr("class","range")
			.style("cursor","pointer")
			.attr("sens",function(d){
				return d
			})
			.attr("code",code)
			.on("mousedown",function(){
				var sens=this.attributes.sens.value;
				var code=this.attributes.code.value;
				c = setInterval(function(){
					d3.select("#number"+code).text(function(){
						var val = this.attributes.val.value;
						if(sens=="+"){
							val = val*1+50;
						}else{
							if(val>0){
								val = val-50;
							}
							
						}
						d3.select(this).attr("val",val);
						if(val==0){
							return ""
						}else {
							return val+" mètres";
						}
					})
				},100)
			})
			.on("mouseup",function(){
				clearInterval(c);
			})
			.append("circle")
			.attr("cx",function(d,i){
				return debX*1+sizeCar*1.2+spCh*i
			})
			.attr("cy",debY*1+30)
			.attr("r",sizeSel*0.5)
			.attr("fill","#ffffff")
			.attr("stroke","#000000")

		d3.select("#buff_dist"+code)
			.selectAll(".range")
			.append("text")
			.attr("x",function(d,i){
				return debX*1+sizeCar*1.2+spCh*i-sizeSel/4
			})
			.attr("y",debY*1+30+sizeSel*0.4)
			.text(function(d){
				return d;
			})
			.attr("font-weight","800")
			.attr("font-size",sizeSel)
			
		d3.select("#buff_dist"+code)
			.append("text")
			.attr("id","number"+code)
			.attr("val",0)
			.attr("x",debX*1+sizeCar*1.2+spCh*2-sizeSel/4)
			.attr("y",debY*1+30+sizeSel*0.4)
			.attr("font-size",sizeT*0.65)
			.attr("fill",coul)
			
		////////////Pondération
		haut_red=haut-sizeCar*2;
		d3.select("#select_"+code)
			.append("g")
			.attr("transform","translate("+larg+",0)")
			.attr("class","decision")
			.attr("id","pond"+code)
			.append("rect")
			.attr("x",debX)
			.attr("y",debY*1+sizeCar)
			.attr("width",sizeCar)
			.attr("height",haut_red)
			.attr("stroke",coul)
			.attr("fill","#ffffff")
			
		var drag = d3.behavior.drag() //fonction "drag" veut dire que tu fais bouger l'objet en l'attrapant
			.on("drag", function(d) {
				haut_red_2=haut-sizeCar*3;
				d3.select(this).style("cursor","grabbing");	
				console.log(d.y+" "+haut_red_2);
				// if((d.y>(haut_red_2*-1)||d3.event.dy>0)&&(d.y<0||d3.event.dy<0)){
					d.y += d3.event.dy;
					d.s += d3.event.dy;
				// }
				if(d.y>0){
					t=0;
					d.s=0
				} else if(d.y<(haut_red_2*-1)){
					t=(haut_red_2*-1);
					d.s=(haut_red_2*-1);
				} else {
					t=d.y;
					d.s=d.y;
				}
				d3.select(this).attr("transform","translate(0,"+t+")")
				var co = d.code;
				var val=parseInt(-10*t/haut_red_2);
				d3.select("#indic_pond"+co).attr("val",val).text("Importance : "+val);
			})
			.on("dragend", function(d){
				d3.select(this).style("cursor","grab");
				d.y=d.s;	
			})	
			
			
		d3.select("#pond"+code)
			.append("rect")
			.attr("id","selpond"+code)
			.attr("x",debX)
			.attr("y",debY*1+haut_red*1)
			.attr("width",sizeCar)
			.attr("height",sizeCar)
			.attr("fill",coul)
			.data([{"s":0,"y":0,"code":code}]).call(drag).style("cursor","grab");
			
		d3.select("#pond"+code).append("text").attr("font-size",6).attr("x",debX*1+3).attr("y",debY+sizeCar*1-2).text("10")
		d3.select("#pond"+code).append("text").attr("font-size",6).attr("x",debX*1+5).attr("y",debY+sizeCar*2-5+haut_red*1).text("0")
		d3.select("#pond"+code).append("text").attr("font-size",8).attr("x",debX*1+sizeCar*1+5).attr("y",debY+sizeCar*1.5-2+haut_red*0.5).text("Importance : 0").attr("id","indic_pond"+code).attr("val",0)
		////////////Liste logique
		selected.push(code)
	}
	
}



function getData(){
	var csv=""
	datas=[colonnes]
	for(c=0;c<colonnes.length;c++){
		csv=csv+colonnes[c]+";"
	}
	for(i=0;i<selected.length;i++){
		rowid = selected[i];
		console.log(rowid);
		
		if(document.querySelector("#datapath").value!=""){
			path=document.querySelector("#datapath").value
		} else {
			path=clcpath
		}
		
		var layer_name = "clc_"+rowid+".shp"
		var layer_path = path+layer_name
		
		///type
		var cat;
		var abs;
		var type;
		d3.select("#select_"+rowid).select("#type"+rowid).selectAll(".choix").each(function(){
			if(this.attributes.checked.value=="true"){
				cat=(this.id).split("_")[1];
			};
		})
		d3.select("#select_"+rowid).select("#absolu"+rowid).selectAll(".choix").each(function(){
			if(this.attributes.checked.value=="true"){
				abs=(this.id).split("_")[1];
			};
		})
		if(abs=="Oui"){
			if(cat==types[0][0]){
				type="7"
			}else if(cat==types[0][1]){
				type="8"
			}else if(cat==types[0][2]){
				type="5"
			}else if(cat==types[0][3]){
				type="6"
			}else {
				type="0"
			}
		} else { //Non par défaut
			if(cat==types[0][0]){
				type="1"
			}else if(cat==types[0][1]){
				type="2"
			}else if(cat==types[0][2]){
				type="3"
			}else if(cat==types[0][3]){
				type="4"
			}else {
				type="0"
			}
			
		}
		
		///ponderation
		var coeff_ponderation = document.getElementById("indic_pond"+rowid).attributes.val.value;
		
		///distancemax/buffer
		var distancemax_buffer;
		d3.select("#buff_dist"+rowid)
			.select("#number"+rowid)
			.each(function(){
				distancemax_buffer=this.attributes.val.value;
				
			})
		if(distancemax_buffer==0){
			distancemax_buffer="";
		}
		
		///description
		var description;
		d3.select("#select_"+rowid)
			.select(".titre")
			.each(function(){
				if(langue=="francais"){
					description=this.attributes.tx_fr.value;
				}else{
					description=this.attributes.tx_en.value;
				}
			})
		
		csv=csv+"\n"+layer_name+";"+layer_path+";"+type+";"+coeff_ponderation+";"+distancemax_buffer+";"+description+";"+rowid+";"
		datas.push([layer_name,layer_path,type,coeff_ponderation,distancemax_buffer,description,rowid])
	}
	console.log(csv);
	console.log(datas);
	
	
	///Construction d'un tableau
	d3.select("#tableaux").append("table").attr("id","table"+nbtable)
	for(i=0;i<datas.length;i++){
		d3.select("#table"+nbtable).append("tr").attr("id","row"+i)
		for(j=0;j<datas[i].length;j++){
			d3.select("#table"+nbtable).select("#row"+i)
				.append("td")	
					.html(datas[i][j])
					.style("font-weight",function(){
						if(i==0){
							return "800";
						}
					})
		}
	}
	
	nbtable++;
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}


function build_dessin(){
	wrec=8;
	d3.select("#dessin")
		.append("g")
		.attr("id","validation")
		.style("cursor","pointer")
		.attr("display","none")
		.on("click",function(){
			getData();
		})
		

		
	d3.select("#validation")
		.append("circle")
		.attr("cx",debX*1+71)
		.attr("r",20)
		.attr("cy",25)
		.attr("fill","#dddddd")
		
	d3.select("#validation")
		.append("text")
		.attr("x",debX*1+60)
		.attr("y",31)
		.text("Ok !")
	
	for(i=0;i<data.length;i++){
		labfr=data[i].libelle_fr;
		laben=data[i].libelle_en;
		if(langue=="francais"){
			var couche = labfr;
		} else {
			var couche = laben;
		}
		var code= data[i].code_clc_niveau_3;
		var fill0=hexadecimal(data[i].rouge,data[i].vert,data[i].bleu)
		var tot=data[i].rouge*1+data[i].vert*1+data[i].bleu*1;
		
		if(tot>255*2.5){
			fill="#333333";
		}else{
			fill=fill0;
		}
		
		d3.select("#dessin")
			.append("g")
			.attr("id","g"+code)
			.attr("class","base")
			.attr("code",code)
			.attr("coul0",fill0)
			.attr("coul",fill)
			.attr("labfr",labfr)
			.attr("laben",laben)
			
			.style("cursor","pointer")
			.attr("checked","false")
			.on("click",function(){
				var code = this.attributes.code.value;
				var fill0 = this.attributes.coul0.value;
				var fill = this.attributes.coul.value;
				var labfr = this.attributes.labfr.value;
				var laben = this.attributes.laben.value;
				build_form(code,fill0,labfr,laben,fill);
				d3.select(this).select("rect","")
			})
			
		d3.select("#g"+code)
			.append("rect")
			.attr("x",debCarX)
			.attr("y",i*wrec*1.2)
			.attr("width",wrec)
			.attr("height",wrec)
			.attr("fill",fill0)

			
		d3.select("#g"+code)
			.append("text")
			.attr("x",debCarX*1+wrec*1.2)
			.attr("y",6.5+i*wrec*1.2)
			.attr("font-size",7)
			.text(couche)

	}
}
