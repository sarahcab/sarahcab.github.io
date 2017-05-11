//fixes
var width = 900,
height = 380,
size=20,
sizeTir = 5,
border =0,
sens = [-1,0],
nuancier = ["#333333","#F4F4F4","yellow","red"], //fond,perso, mechant, tir


//mobiles :
vitM = 500, //déplacement des monstres
vitA = 3000, //apparition des monstres
diff = 10000/(vitM*vitA),
// vitT = 200, //tire
vies = 30,
score = 0,
itMech = 0;

//fonctions : 
var c;

window.onload = initialize();

function initialize() {
	
	alert("Utilises les flèches pour te déplacer, la barre espace pour tirer")
	draw();
	makeBlop();
	mechants();
	mechantsMoove();
	d3.select("#vies").html("Vies : "+vies) ///faire une barre de vie et de score, et de diff
	d3.select("#score").html("Score : "+score)
	d3.select("#diff").html("Difficulté : "+diff)
	
	window.onkeypress = function(e){
		
		var touche  = e.keyCode;
		if(touche=="37"){ //gauche
			sens = [-1,0];
		} else if(touche=="38"){ //haut
			sens = [-1,1];
		} else if(touche=="39"){ //droite
			sens = [1,0];
		} else if(touche=="40"){ //bas
			sens = [1,1];
		} 
		if(touche=="0"){
			tire();
		} else {
			moove()
		}
	}
	
}


function reinit(){
	clearTimeout(c)
	clearTimeout(t)
	d3.select("#geom").remove()
	vitM = 500, //déplacement des monstres
	vitA = 3000, //apparition des monstres
	diff = 10000/(vitM*vitA),
	// vitT = 200, //tire
	vies = 30,
	score = 0;
	
	initialize();	
}

function draw(){
	d3.select("#jeu").append("svg")
		.attr("id","geom")
		.attr("overflow","visible")
		.attr("width","100%")
		.attr("viewBox","0 0 "+width+" "+height)
		.style("background-color","#EEEEEE")
	
	// for(i=0;i<width/size;i++){ ///à virer
		// for(j=0;j<height/size;j++){
			// d3.select("#geom")
				// .append("rect")
				// .attr("x",i*size)
				// .attr("opacity",0)
				// .attr("y",j*size)
				// .attr("width",size-border)
				// .attr("height",size-border)
				// .attr("stroke",nuancier[0])
				// .attr("id","pix"+i+"_"+j)
				// .attr("fill",nuancier[0])
				// .attr("opa",1)
				// .attr("opacity",1)
				// .attr("place",0)
				// .attr("class","pix")
		// }	
	// }
}

function makeBlop(){
	// d3.select("#geom").append("rect")
		// .attr("x",0)
		// .attr("y",0)
		// .attr("id","blop")
		// .attr("width",size-border)
		// .attr("height",size-border)
		// .attr("fill", nuancier[1])
		// .attr("verti",0)
		// .attr("hori",0)
		// .attr("transform",function(){
			// var hori = this.attributes.hori.value;
			// var verti = this.attributes.verti.value;
			// return "translate("+hori*size+" "+verti*size+")"
		// })

	d3.select("#geom").append("image")
		.attr("xlink:href","img/blop.png")
		.attr("x",-20)
		.attr("y",-20)
		.attr("id","blop")
		.attr("width",size-border*1+40)
		.attr("height",size-border*1+40)
		// .attr("fill", nuancier[1])
		.attr("verti",0)
		.attr("hori",0)
		.attr("transform",function(){
			var hori = this.attributes.hori.value;
			var verti = this.attributes.verti.value;
			return "translate("+hori*size+" "+verti*size+")"
		})
	
}

function moove(){
	var place = [(document.getElementById("blop").attributes.hori.value),(document.getElementById("blop").attributes.verti.value)]
	var dirOk = sens[1];
	place[dirOk] = parseFloat(place[dirOk])+ parseFloat(sens[0]);
	if(place[0]>=0&&place[0]<=(width/size-1)&&place[1]>=0&&place[1]<=(height/size-1)){
		d3.select("#blop")
			.attr("hori",place[0])
			.attr("verti",place[1])
			.attr("transform",function(){
				var hori = this.attributes.hori.value;
				var verti = this.attributes.verti.value;
				return "translate("+hori*size+" "+verti*size+")"
			})
		
		d3.selectAll(".mechant")
			.each(function(){//test touche blop (exsite aussi dans la fonction mechantsMoove)
				hor = this.attributes.hori.value;
				ver = this.attributes.verti.value;
				if(hor==place[0]&&ver==place[1]){
					touche(this)
				}
			})
	}
	
}

function mechants(){
	t = setTimeout(function(){
		itMech ++;
		var Y = getRandomInt(0, height/size);
		// d3.select("#geom")
			// .append("rect")
			// .attr("x",0)
			// .attr("y",0)
			// .attr("id","mech"+itMech)
			// .attr("force",itMech)
			// .attr("hori",width/size)
			// .attr("verti",Y)
			// .attr("width",size-border)
			// .attr("height",size-border)
			// .attr("class","mechant")
			// .attr("fill", nuancier[2])
			// .attr("transform", function(){
				// hor = this.attributes.hori.value;
				// ver = this.attributes.verti.value;
				// return "translate("+hor*size+" "+ver*size+")";
			// })
		d3.select("#geom")
			.append("image")
			.attr("xlink:href","img/brosse.png")
			.attr("x",-10)
			.attr("y",-10)
			.attr("id","mech"+itMech)
			.attr("force",itMech)
			.attr("hori",width/size)
			.attr("verti",Y)
			.attr("width",size-border*1+20)
			.attr("height",size-border*1+20)
			.attr("class","mechant")
			.attr("fill", nuancier[2])
			.attr("transform", function(){
				hor = this.attributes.hori.value;
				ver = this.attributes.verti.value;
				return "translate("+hor*size+" "+ver*size+")";
			})
		mechants();
	},vitA);
		
}

function mechantsMoove(){
	c = setTimeout(function(){
		var hori = document.getElementById("blop").attributes.hori.value;
		var verti = document.getElementById("blop").attributes.verti.value;
		d3.selectAll(".mechant")
			.attr("hori",function(){
				hor = this.attributes.hori.value;
				return hor-1;
			})
			.attr("transform", function(){
				hor = this.attributes.hori.value;
				ver = this.attributes.verti.value;
				return "translate("+hor*size+" "+ver*size+")";
			})
			.each(function(){ //test touche blop (exsite aussi dans la fonction moove)
				hor = this.attributes.hori.value;
				ver = this.attributes.verti.value;
				if(hor==hori&&ver==verti){
					touche(this)
				}
				if(hor<0){
					d3.select(this).remove();
				}
			})

			
		mechantsMoove();
	},vitM);
}


function touche(mech){
	var force = mech.attributes.force.value;
	d3.select("#blop").attr("fill","red")
	setTimeout(function(){
		d3.select("#blop").attr("fill",nuancier[1])
	},500)
	vies = vies-force;
	d3.select("#vies").html("Vies : " + vies);
	if(vies<=0){
		perdu()
	}
	
	///mettre une animation perdu
}

function tire(){
	var hori = document.getElementById("blop").attributes.hori.value;
	var verti = document.getElementById("blop").attributes.verti.value;
	
	var hori2 = 0;
	var kill = "";
	d3.selectAll(".mechant")
		.each(function(){ //test touche tire
			hor = this.attributes.hori.value;
			ver = this.attributes.verti.value;
			if(verti==ver&&hori<=hor&&hor>hori2){
				hori2 = hor;
				kill = this.id;
			}
			// if(hor==hori&&ver==verti){
				// touche(this)
			// }
		})
		
	if(hori2==0){
		hori2=width/size;
	} else {
		setTimeout(function(){
			d3.select("#"+kill).remove();
		},vitM)
		winn(kill);
	}
		
	d3.select("#geom").append("circle")
		.attr("cx",size/2)
		.attr("cy",size/2)
		.attr("r",sizeTir)
		.attr("fill",nuancier[3])
		.attr("opacity",1)
		.attr("transform","translate("+hori*size+" "+verti*size+")")
		.transition()
		.duration(vitM)
		.attr("transform","translate("+(hori2-1)*size+" "+verti*size+")")
		.transition()
		.attr("opacity",0)

}

function winn(k){
	var force = document.getElementById(k).attributes.force.value;
	score = score*1+force*1;
	vitA = vitA - force*2;
	vitM = vitM - force/3;
	diff = vitM*vitA;
	
	d3.select("#score").html("Score : "+score)
	d3.select("#diff").html("Difficulté : "+diff)
}

function perdu(){ ///faire une anim
	alert("perdu!")
	reinit();
}

function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min)) + min;
}