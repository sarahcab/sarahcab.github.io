var marg=20,
vb=256,
sizeTotal=vb-marg*2
wCases = sizeTotal/4,
mid=vb/2,
sizeT=60,
itC=0,
vide=[],
transT=["","translate(-"+sizeTotal/2+",-"+sizeTotal/2+")","translate(-"+sizeTotal+",0)","translate(-"+sizeTotal/2+","+sizeTotal/2+")"]
dirT=["gauche","haut","droite","bas"]

	//(ok)faire le text avec vide remplcaer le 16 par len et apre récupérer rand comme élément de la liste
	//(ok)apres la fonction fait une transition vers la case donnée et si ca match avec un identique ya un fondu pr qu'il disparaisse et l'auter multiplie nb par deux
	//ajotuer un évènement sur les flèches du calvier qui permet de faire pareil que les flèches au click
	//tenter de faire marcher avec le drag

window.onload = initialize();

function initialize(){
	for(i=0;i<4;i++){
		for(j=0;j<4;j++){
			d3.select("svg")
				.append("rect")
				.attr("x",marg*1+i*wCases)
				.attr("y",marg*1+j*wCases)
				.attr("width",wCases)
				.attr("height",wCases)
				.attr("xx",i)
				.attr("yy",j)
				.attr("class","case")
				.attr("fill","none")
				.attr("stroke","grey")
				.attr("id","ca_"+(j*1+4*i))
				// .attr("id","ca_"+i+"_"+j)
				.attr("cube","false")
				.attr("nb","0")
				
			// d3.select("svg")
				// .append("text")
				// .attr("x",marg*1+i*wCases)
				// .attr("y",marg*1+j*wCases)
				// .text("ca_"+(j*1+4*i))
				
			vide.push(j*1+4*i);
		}
	}
	
	for(i=0;i<4;i++){
		d3.select("svg")
			.append("polygon")
			.attr("points","0,"+mid+" "+marg+","+(mid-sizeT)+" "+marg+","+(mid*1+sizeT*1))
			.attr("fill","#008080")
			.attr("opacity",0.5)
			.attr("transform","rotate("+90*i+" "+marg+" "+mid+") "+transT[i])
			.attr("id",dirT[i])
			.on("click",function(){
				dir=this.id;
				allmoove(dir);
				// d3.selectAll(".cube")
					// .each(function(){
						// moove(this,dir)
					// })
				setTimeout(function(){
					add(dir)
				},500)
			})
			.style("cursor","pointer")
	}
	
}

function add(dir){
	itC++;
	lib = vide.length;

	var randInd= Math.floor((Math.random() * lib));
	var rand=vide[randInd];
	if(document.getElementById("ca_"+rand)){
		

		
		var x=document.getElementById("ca_"+rand).attributes.xx.value*wCases;
		var y=document.getElementById("ca_"+rand).attributes.yy.value*wCases;
		
		d3.select("svg")
			.append("g")
			.attr("id","cube"+itC)
			.attr("class","cube")
			.attr("transform","translate("+x+","+y+")")
			.attr("nb",2)
			.attr("xx",document.getElementById("ca_"+rand).attributes.xx.value)
			.attr("yy",document.getElementById("ca_"+rand).attributes.yy.value)
			.attr("opacity",0.2)
			.append("rect")
			.attr("rx",5)
			.attr("fill","#2F4F4F")
			.attr("x",marg*1+wCases*0.1)
			.attr("y",marg*1+wCases*0.1)
			.attr("width",wCases*0.8)
			.attr("height",wCases*0.8)
			
			
		d3.select("#cube"+itC)
			.append("text")
			.attr("opacity",0.5)
			.attr("x",marg*1+wCases*0.4)
			.attr("fill","#FFFFFF")
			.attr("y",marg*1+wCases*0.6)
			.text("2")
			
		d3.select("#ca_"+rand)
			.attr("cube","true")
			.attr("nb","2")
		
		ind=vide.indexOf(rand)
		vide.splice(ind,1)
	
	}else{
		alert("Perdu!")
		d3.selectAll(".cube").remove()
	}
	
}

function allmoove(dir){
	if(dir=="droite"||dir=="gauche"){	
		axe="xx";
	} else {
		axe="yy";
	}
	if(dir=="bas"||dir=="droite"){		
		vals=[3,2,1,0];
	} else {
		vals=[0,1,2,3];
	}
	d3.selectAll('.cube['+axe+'="'+vals[0]+'"]').each(function(){moove(this,dir)})
	d3.selectAll('.cube['+axe+'="'+vals[1]+'"]').each(function(){moove(this,dir)})
	d3.selectAll('.cube['+axe+'="'+vals[2]+'"]').each(function(){moove(this,dir)})
	d3.selectAll('.cube['+axe+'="'+vals[3]+'"]').each(function(){moove(this,dir)})
}

function moove(obj,dir){
	posx=obj.attributes.xx.value;
	posy=obj.attributes.yy.value;
	go="none";
	fusion=false;
	cont=true;
	if(dir=="droite"){	
		for(i=posx*1+1;i<4;i++){
			if(cont==true){
				idCa = posy*1+4*i;
				if(vide.indexOf(idCa)>=0){
					go=idCa;
					cont=true;
				} else {
					desti = d3.select('[class="cube"][xx="'+i+'"][yy="'+posy+'"]').attr("nb");
					expe = obj.attributes.nb.value;
					if(desti==expe){
						fusion=true;
						go=idCa;
					}
						
					cont=false;
				}
			}
		}
		
	} else if(dir=="gauche"){
		for(i=posx-1;i>-1;i=i-1){
			if(cont==true){
				idCa = posy*1+4*i;
				if(vide.indexOf(idCa)>=0){
					
					go=idCa;
					cont=true;
				} else {
					desti = d3.select('[class="cube"][xx="'+i+'"][yy="'+posy+'"]').attr("nb");
					expe = obj.attributes.nb.value;
					if(desti==expe){
						fusion=true;
						go=idCa;
					}
						
					cont=false;
				}
			}
		}
	}else if(dir=="bas"){	
		for(i=posy*1+1;i<4;i++){
			if(cont==true){
				idCa = i*1+4*posx;
				if(vide.indexOf(idCa)>=0){
					go=idCa;
					cont=true;
				} else {
					desti = d3.select('[class="cube"][xx="'+posx+'"][yy="'+i+'"]').attr("nb");
					expe = obj.attributes.nb.value;
					if(desti==expe){
						fusion=true;
						go=idCa;
					}
						
					cont=false;
				}
			}
		}
		
	} else if(dir=="haut"){
		for(i=posy-1;i>-1;i=i-1){
			if(cont==true){
				idCa = i*1+4*posx;
				if(vide.indexOf(idCa)>=0){
					go=idCa;
					cont=true;
				} else {
					desti = d3.select('[class="cube"][xx="'+posx+'"][yy="'+i+'"]').attr("nb");
					expe = obj.attributes.nb.value;
					if(desti==expe){
						fusion=true;
						go=idCa;
					}
						
					cont=false;
				}
			}
		}
	}
	if(go!="none"){
		nx = document.getElementById("ca_"+go).attributes.xx.value;
		ny = document.getElementById("ca_"+go).attributes.yy.value;
		d3.select(obj)
			.attr("xx",nx)
			.attr("yy",ny)
			.transition()
			.duration(200)
			.attr("transform","translate("+(nx*wCases)+","+(ny*wCases)+")")

		origine = posy*1+4*posx;
		if(fusion==false){
			ind=vide.indexOf(go)
			vide.splice(ind,1)
		}
		vide.push(origine)
		
		d3.select("#ca_"+origine)
			.attr("cube","false")
			.attr("nb","0")
		
		d3.select("#ca_"+go)
			.attr("cube","true")
			.attr("nb","2")
			
		if(fusion==true){
			setTimeout(function(){
				d3.select(obj).remove()
			},250)
			nb="";
			d3.selectAll('[xx="'+nx+'"][yy="'+ny+'"]')
				.attr("nb",function(){
					var n = this.attributes.nb.value;
					nb=n*2;
					return n*2;
				})
				.attr("opacity",function(){
					var n = this.attributes.nb.value;
					return n*0.1;
				})
				.select("text")
				.transition()
				.delay(250)
				.text(nb)
		}
		
	}
}