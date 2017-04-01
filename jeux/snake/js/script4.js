var width = 900,
height = 500,
size=15,
border =0,
continuue = false,
placeInit = 4,
longueur = 7,
sens = [-1,0],
it = 0,
itf =1,
vit = 300,
nbfeed = 5,
vies = 2,
score = 0,
nuancier = ["#333333","#F4F4F4","yellow","blue"],
c;
// nbLarg = width/size,
// nbHaut = height/size;
// var play = document.getElementById("play");
// var pause = document.getElementById("pause");
var stop = document.getElementById("stop");
var haut = document.getElementById("haut");
var bas = document.getElementById("bas");
var gauche = document.getElementById("gauche");
var droite = document.getElementById("droite");

window.onload = initialize();

function initialize() {
	draw();
	snakeInit();
	getRandomFeed();
	
	haut.onclick = function(){
		continuue = true;
		if(sens[1]!=1){
			sens = [-1,1];
			// snakeMoove()
		}
	}	
	bas.onclick = function(){
		continuue = true;
		if(sens[1]!=1){
			sens = [1,1];
			// snakeMoove()
		}
	}
	gauche.onclick = function(){
		
		continuue = true;
		if(sens[1]!=0){
			sens = [-1,0];
			// snakeMoove()
		}
	}	
	droite.onclick = function(){
		continuue = true;
		if(sens[1]!=0){
			sens = [1,0];
			// snakeMoove()
		}
	}	
	
	stop.onclick = function(){
		var tst = it%2;
		if(tst==0){
			continuue = true;
			snakeMoove();
		} else {
			continuue = false;
			clearTimeout(c)
		}
		it ++;
	}	
	
	// play.onclick = function(){
		// getRandomFeed();
	// }
	
}

function draw(){
	d3.select("#jeu").append("svg")
		.attr("id","geom")
		.attr("overflow","visible")
		.attr("width",width)
		.attr("height", height)
		.style("background-color","#EEEEEE")
	
	for(i=0;i<width/size;i++){
		for(j=0;j<height/size;j++){
			d3.select("#geom")
				.append("rect")
				.attr("x",i*size)
				.attr("y",j*size)
				.attr("width",size-border)
				.attr("height",size-border)
				// .attr("rx",2)
				.attr("id","pix"+i+"_"+j)
				.attr("fill",nuancier[0])
				.attr("opa",1)
				.attr("opacity",1)
				.attr("place",0)
				.attr("class","pix")
		}	
	}
}

function snakeInit(){
	var place2 = parseFloat(placeInit) + parseFloat(longueur);
	var j =-1;
	for(i=placeInit;i<place2;i++){
		j++;
		d3.select("#pix"+i+"_"+placeInit).attr("fill",nuancier[1]).attr("class","pix moving pla" + j)
		
		
	}
	d3.select(".pla0").attr("fill",nuancier[3]);
	
}

function snakeMoove(){
	c = setTimeout(function(){
		if(continuue==true){
			var actu = document.getElementsByClassName("pix moving pla0")[0].id;
			var ls = actu.split("pix")[1].split("_");
			var direction = sens[1];
			var nb=parseFloat(ls[direction])+parseFloat(sens[0]);
			ls[direction] = nb;
			maxs = [parseInt(width/size)-1,parseInt(height/size)]
			if(ls[direction]>maxs[direction]){
				ls[direction] = 0;
			} else if(ls[direction]<0){
				ls[direction] = maxs[direction];
			}
			
			d3.selectAll(".moving")
				.attr("class",function(){
					var classe = this.attributes.class.value;
					var place = classe.split("pla")[1]
					place ++;
					//alert(place)
					if(place>=longueur){
						return "pix"
					} else {
						// alert(place)
						return "pix moving pla" + place;
					}
				})
				.attr("fill",function(){
					var classe = this.attributes.class.value;
					var test = classe.split(" ")[1]
					if(test=="moving"){
						return nuancier[1]
					} else {
						return nuancier[0]
					}
				});
			d3.select("#pix"+ls[0]+"_"+ls[1]).attr("class","pix moving pla0").attr("fill",function(){
				var val = this.attributes.fill.value;
				if(val==nuancier[1]){
					vies = vies -1;
					d3.select("#vies").html(vies);
					d3.selectAll(".moving").transition().duration(vit/4).attr("opacity",0).transition().delay(vit/4).duration(vit/2).attr("opacity",1)
					if(vies==0){
						perdu()
					}
				} else if(val==nuancier[2]){
					feed();
				}else if(val==nuancier[3]){
					getRandomFeed();
				}
				return nuancier[3]
			});
			
			
			snakeMoove();
		}
		
			
	},vit);
}

function getRandomFeed(){
	for(i=0;i<nbfeed;i++){
		var x = parseInt((Math.random() * (width/size)) + 1);
		var y = parseInt((Math.random() * (height/size)) + 1);
		d3.select("#pix"+x+"_"+y)
			.attr("fill",function(){
				var val = this.attributes.class.value;
				var classe = this.attributes.class.value;
				var test = classe.split(" ")[1]
					if(test=="moving"){
						return nuancier[1]
					} else {
						return nuancier[2]
					}
			})
	}
	
}

function feed(){
	longueur ++;
	vit = vit-10;
	var tst = itf%(nbfeed-1);
	if(tst==0){
		getRandomFeed();
	}
	itf++;
	score ++;
	d3.select("#score").html(score);
	d3.select("#vitesse").html(vit);
}


function perdu(){
	continuue = false;
	clearTimeout(c);
	it=0;
	itf=0;
	sens = [-1,0],
	alert("perdu");
	d3.selectAll(".pix").attr("class","pix").attr("fill",nuancier[0])
	longueur = 7;
	snakeInit();
	// getRandomFeed();
	vies = 2;
	score = 0;
	vit=300;
	d3.select("#score").html(score);
	d3.select("#vies").html(vies);
}