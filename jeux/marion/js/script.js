var marg=20,
vb=256,
sizeTotal=vb-marg*2
wCases = sizeTotal/4,
mid=vb/2,
sizeT=40,
itC=0,
vide=[],
transT=["","translate(-"+sizeTotal/2+",-"+sizeTotal/2+")","translate(-"+sizeTotal+",0)","translate(-"+sizeTotal/2+","+sizeTotal/2+")"],
dirT=["gauche","haut","droite","bas"],
score=0,
draX=0,
draY=0;

	//(ok)faire le text avec vide remplcaer le 16 par len et apre récupérer rand comme élément de la liste
	//(ok)apres la fonction fait une transition vers la case donnée et si ca match avec un identique ya un fondu pr qu'il disparaisse et l'auter multiplie nb par deux
	//ajotuer un évènement sur les flèches du calvier qui permet de faire pareil que les flèches au click
	//tenter de faire marcher avec le drag

window.onload = initialize();

function initialize(){
	d3.select("svg")
		.append("g")
		.attr("id","abeilles")
		
	for(i=0;i<4;i++){
		for(j=0;j<4;j++){
			petit=wCases*0.2;
			grand=wCases*0.6;
			d3.select("svg")
				.append("rect")
				.attr("x",0)
				.attr("y",0)
				.attr("rx",50)
				// .append("polygon")
				// .attr("points",petit+",0 "+(wCases-petit)+",0 "+wCases+","+petit+" "+wCases+","+(wCases-petit)+" "+(wCases-petit)+","+wCases+" "+petit+","+wCases+" 0,"+(wCases-petit)+" 0,"+petit)
				.attr("transform","translate("+(marg*1+i*wCases)+","+(marg*1+j*wCases)+")")
				.attr("width",wCases)
				.attr("height",wCases)
				.attr("xx",i)
				.attr("yy",j)
				.attr("class","case")
				// .attr("fill","#FFE4B5")
				.attr("fill","none")
				.attr("stroke","#FFE4B5")
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
			.attr("points","0,"+mid+" "+(marg*0.7)+","+(mid-sizeT)+" "+(marg*0.7)+","+(mid*1+sizeT*1))
			.attr("fill","#D2B48C")
			.attr("rx",10)
			.attr("transform","rotate("+90*i+" "+marg+" "+mid+") "+transT[i])
			.attr("id",dirT[i])
			.attr("class","fleche")
			.on("click",function(){
				dir=this.id;
				allmoove(dir);
				// d3.selectAll(".cube")
					// .each(function(){
						// moove(this,dir)
					// })
				setTimeout(function(){
					add()
				},500)
			})
			.style("cursor","pointer")
	}
	
	events();
}

function events(){
	window.onkeypress = function(e){
		// console.log(e.key)
		if(e.key=="ArrowUp"||e.key=="8"){
			dir="haut"
		} else if(e.key=="ArrowLeft"||e.key=="4"){
			dir="gauche"
		} else if(e.key=="ArrowRight"||e.key=="6"){
			dir="droite"
		} else if(e.key=="ArrowDown"||e.key=="2"){
			dir="bas"
		}
		
		allmoove(dir);
		setTimeout(function(){
			add()
		},500)
	}
	
	var drag = d3.behavior.drag() 
		.on("drag", function() {
			draX= d3.event.dx;
			draY= d3.event.dy;
		})
		.on("dragend", function() {
			var dir2="";
			if(draX>0.1&&Math.abs(draX)>Math.abs(draY)){
				dir2="droite";
			} else if(draX<-0.9&&Math.abs(draX)>Math.abs(draY)){
				dir2="gauche";
			} else if(draY<-0.9&&Math.abs(draX)<Math.abs(draY)){
				dir2="haut"
			} else if(draY>0.1&&Math.abs(draX)<Math.abs(draY)){
				dir2="bas"
			}
			if(dir2!=""){
				allmoove(dir2)
				setTimeout(function(){
					add()
				},500)
			}
			draX= 0;
			draY= 0;
		})
		d3.select("svg")//.data([{"x":0}])
			.call(drag)
}

function add(){
	itC++;
	lib = vide.length;

	var randInd= Math.floor((Math.random() * lib));
	var rand=vide[randInd];
	if(document.getElementById("ca_"+rand)){
		

		
		var x=document.getElementById("ca_"+rand).attributes.xx.value*wCases;
		var y=document.getElementById("ca_"+rand).attributes.yy.value*wCases;
		
		d3.select("#abeilles")
			.append("g")
			.attr("id","cube"+itC)
			.attr("class","cube")
			.attr("transform","translate("+x+","+y+")")
			.attr("nb",2)
			.attr("xx",document.getElementById("ca_"+rand).attributes.xx.value)
			.attr("yy",document.getElementById("ca_"+rand).attributes.yy.value)
			// .attr("opacity",0.2)
			// .append("rect")
			// .attr("rx",5)
			// .attr("fill","#2F4F4F")
			// .attr("x",marg*1+wCases*0.1)
			// .attr("y",marg*1+wCases*0.1)
			// .attr("width",wCases*0.8)
			// .attr("height",wCases*0.8)
			.append("g")
			.attr("transform","translate("+(marg*1+wCases*0.5)+","+(marg*1+wCases*0.5)+")")
			.append("image")
			.attr("xlink:href","img/abeille.jpg")
			.attr("width",wCases*0.8)
			.attr("height",wCases*0.8)
			.attr("x",-wCases*0.4)
			.attr("y",-wCases*0.4)
			.attr("transform","scale(0.6)")
			
			
			
		d3.select("#cube"+itC)
			.append("text")
			.attr("x",marg*1+wCases*0.42)
			.attr("fill","#1E90FF")
			.attr("stroke","#FFFFFF")
			.attr("stroke-width",0.4)
			.attr("y",marg*1+wCases*0.75)
			.text("2")
			.attr("font-size",14)
			.attr("font-weight",800)
			
		d3.select("#ca_"+rand)
			.attr("cube","true")
			.attr("nb","2")
		
		ind=vide.indexOf(rand)
		vide.splice(ind,1)
	
	}else{
		alert("Perdu!")
		d3.selectAll(".cube").remove()
		for(v=0;v<16;v++){
			vide.push(v)
		}
		d3.select("#scoress").append("p").html(score)
		d3.select("#prec").style("display","block")
		score = 0;
		
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
			// .attr("nb","0")
		
		d3.select("#ca_"+go)
			.attr("cube","true")
			// .attr("nb","2")
			
		if(fusion==true){
			d3.select(obj).attr("class","bip")
			setTimeout(function(){
				d3.select(obj).remove()
			},250)
			var nb="";
			d3.selectAll('[class="cube"][xx="'+nx+'"][yy="'+ny+'"]')
				.attr("nb",function(){
					var n = this.attributes.nb.value;
					nb=n*2;
					score = score*1+nb;
					console.log(nb)
					return n*2;
				})
				// .attr("opacity",function(){
					// var n = this.attributes.nb.value;
					// return n*0.1;
				// })
				.select("text")
				// .attr("font-size",function(){
					// alert(nb)
					// return 5
				// })
				.transition()
				.delay(250)
				.text(nb)
				.attr("x",function(){
					if(nb<10){
						return marg*1+wCases*0.42;
					} else if(nb<100) {
						return marg*1+wCases*0.35;
					} else if(nb<1000){
						return marg*1+wCases*0.3;
					} else if(nb<10000) {
						return marg*1+wCases*0.285;
					} else {
						return  marg*1+wCases*0.26;
					}
				})
				.attr("font-size",function(){
					if(nb<100){
						return 14
					} else if(nb<1000){
						return 13
					} else if(nb<10000){
						return 11
					} else {
						return 10
					}
				})
				
			d3.selectAll('[xx="'+nx+'"][yy="'+ny+'"]')
				.select("image")
				.transition()
				.delay(260)
				.attr("transform",function(){
					if(nb<16){
						sc= 0.6
					}else if(nb<130){
						sc=0.8 
					}else if(nb<500){
						sc= 1 
					}else if(nb<2000){
						sc= 1.15
					}else{
						sc= 1.3
					}
					return "scale("+sc+")"
				})
			d3.select("#score").html("Score : "+score);
		}
		
	}
}