var limX2 = 1100,
limY2 = 500,
limX1 = 10,
limY1 = 10,
widthBarre = 100,
vies = 10,
score = 0,
x1=0,
directionX = 1,
angle = 1,
vit = 1000,
force = 0.4,
x2=widthBarre;
continuue = false;

var play = document.getElementById("play");
var pause = document.getElementById("pause");

window.onload = initialize();

function initialize() {
	draw();
	
	play.onclick = function(){
		continuue = true;
		transition()
	}	
	
	pause.onclick = function(){
		continuue = false;
	}	
	
}

function draw(){
	var drag = d3.behavior.drag() //fonction "drag" veut dire que tu fais bouger l'objet en l'attrapant
		.on("drag", function(d) {
			var min=limX1;
			var max = limX2-widthBarre;
			d.x += d3.event.dx;
			if(d.x<min){
				d.x = min;
			} else if(d.x>max){
				d.x = max;
			}
			// id(d.x>idMin)
			d3.select(this).style("cursor","grabbing").attr("transform", function(d,i){
				return "translate("+d.x+",0)"
			})
			x1 = d.x;
			x2 = d.x + parseFloat(widthBarre);
		})
		.on("dragend", function(d){
			d3.select(this).style("cursor","grab")
		})
		
	d3.select("#jeu").append("svg")
		.attr("id","geom")
		.attr("overflow","visible")
		.append("rect")
		.attr("id","space")
		.attr("width",limX2-limX1)
		.attr("height",limY2-limY1)
		.attr("x",limX1)
		.attr("y",limY1)
		.attr("fill-opacity",0.6)
		.attr("stroke","#000000")
		.attr("fill","#FFFFAA")
		.attr("stroke-width",2)
	
	d3.select("#geom")
		.append("rect")
		.attr("x",0)
		.attr("y",limY2-5)
		.attr("width",widthBarre)
		.attr("height",10)
		.attr("fill","blue")
		.style("cursor","grab")
		.data([{"x":limX1}]).attr("transform","translate("+limX1+",0)")
		.call(drag)
				
	for(i=0;i<44;i++){
		for(j=0;j<30;j++){
			d3.select("#geom")
				.append("rect")
				.attr("x",100+i*20)
				.attr("y",80+j*10)
				.attr("width",19)
				.attr("height",9)
				.attr("rx",2)
				.attr("fill","purple")
				.attr("opa",1)
				.attr("opacity",1)
				.attr("class","brique")
		}	
	}
	
	d3.select("#geom")
		.append("circle")
		.attr("id","boule")
		.attr("r",5)
		.attr("cx",parseFloat(limX1)+limX2/3)
		.attr("cy",limY1)
		.attr("directionX",1)
		.attr("directionY",1)
		.attr("angle",0.2)
		.attr("opacity",0.6)
		.attr("fill","grey")
		.attr("stroke","white")
}
function transition(){
	
	if(continuue==true){
		//test pour savoir de quel côté on va taper : dépend de l'angle avec l'axe X
		directionX = document.getElementById("boule").attributes.directionX.value;
		var directionY = document.getElementById("boule").attributes.directionY.value;
		var dimX = directionX;
		var dimY = directionY;
		var posX = document.getElementById("boule").attributes.cx.value;
		var posY = document.getElementById("boule").attributes.cy.value;
		angle = document.getElementById("boule").attributes.angle.value;
		
		if(posY==limY2){
			bas(posX);
		}
		
		if(directionX==-1){
			var distX = posX - limX1; //mettre direct le X la (on verra plus tard)
			var X = limX1;
		} else {
			var distX = limX2 - posX;
			var X = limX2;
		}
		if(directionY==-1){
			var distY = posY - limY1;
			var Y = limY1;
		} else {
			var distY = limY2 - posY;
			var Y =limY2;
		}
		
		if(directionX*directionY==1){
			var angleTest = Math.atan(distX/distY);
			var valtanX =(Math.abs(Y-posY))*(Math.tan(angle));
			var valtanY =(Math.abs(X-posX))/(Math.tan(angle));
		} else {
			var angleTest = Math.atan(distY/distX);
			var valtanX=(Math.abs(Y-posY))/(Math.tan(angle))
			var valtanY=(Math.abs(X-posX))*(Math.tan(angle))
		}
		
		var blop = (angle-angleTest)*(directionX*directionY);
		if (blop<0){
			X = parseFloat(posX) + valtanX*directionX;
			directionY = directionY*(-1);
		} else {
			Y = parseFloat(posY) + valtanY*directionY;
			directionX = directionX*(-1);
		}
		nAngle = Math.PI/2 - angle;
		
		//on définit la fonction affine de la droite créée (pour les briques)
		var miX = Math.abs(Math.abs(X)-Math.abs(posX))*dimX; ///a définir avant les nouvelles direction!!
		var miY = Math.abs(Math.abs(Y)-Math.abs(posY))*dimY;
		var coeff = miY/miX;
		var ori = Y-coeff*X;
		//alert(ori+": "+coeff);
		
		var distDash = Math.sqrt(miX*miX+miY*miY);
	
		d3.select("#geom").append("line")
			.attr("x1",posX)
			.attr("x2",X)
			.attr("y1",posY)
			.attr("y2",Y)
			.attr("stroke","#FFFFFF")
			.attr("class","linee")
			.attr("stroke-width",3)
			.style("filter","blur(2px)")
			.attr("opacity",1)
			.attr("stroke-dasharray","0,"+distDash)
			.transition()
			.duration(vit)
			.attr("stroke-dasharray",distDash+",0")
			.transition()
			.delay(vit*2)
			.duration(vit*4)
			.attr("opacity",0)
			
		d3.select("#boule")
			.transition()
			//.delay(2000)
			.duration(vit)
			.attr("cx",X)
			.attr("cy",Y)
			.attr("directionX",directionX)
			.attr("directionY",directionY)
			.attr("angle",nAngle)
			.each("end", transition);// infinite loop
		
		d3.selectAll(".brique")
			.attr("opa", function(){
				var opa = this.attributes.opacity.value;
				
				var xMin = this.attributes.x.value;
				var xMax = parseFloat(this.attributes.x.value)+parseFloat(this.attributes.width.value);
				var yMin = this.attributes.y.value;
				var yMax = parseFloat(this.attributes.y.value)+parseFloat(this.attributes.height.value);
				
				var tstMi = coeff*xMin+parseFloat(ori);
				var tstMa = coeff*xMax+parseFloat(ori);
				var tstMi2 = (yMin-ori)/coeff;
				var tstMa2 = (yMax-ori)/coeff;
				if ((tstMi<yMax&&tstMi>yMin)||(tstMa<yMax&&tstMa>yMin)||(tstMi2<xMax&&tstMi2>xMin)||(tstMa2<xMax&&tstMa2>xMin)){
					score  ++;
					if(posX<X){
						time = vit*(xMin-posX)/miX
					} else {
						time = vit*(xMin-X)/miX
					}
					d3.select(this).transition().delay(time).attr("opacity",opa-force)
					vit = vit - 1;
					return opa - force;
				} else {
					return opa;
				}
			})
		d3.select("#score").html("Score : "+score+"  - vitesse :"+vit);
	}
}

function bas(x){
	if(x<x2 && x>x1){
		//vies ++;
		var coeff = (x-x1)/widthBarre;
		if(coeff>0.5){
			directionX = 1;
			angle = Math.PI*(1-coeff);
			// alert(angle)
		}else {
			directionX = -1;
			angle = Math.PI/2*(coeff);
			// alert(angle)
		}
	} else {
		vies = vies-1;
		continuue  = false;
		vit += 200;
	}
	
	if(vies==0){
		alert("perdu!!")
		continuue  = false;
		play.style.display = "none"
	}
	
	d3.select("#vies").html("Vies : "+vies);
}