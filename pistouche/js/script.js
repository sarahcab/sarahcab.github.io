let nbCaseX=10;
let nbCaseY=20;
let widthCase;
let heightCase;
let strokeCaseBase =1.5;
let strokeCaseActive =4;
let itt=0;
let vitAnim = 500;
let vitCreate = 200;
let margX=60;

let posPerso =1;

let fillM = "purple";
let fillN = "green";

let scoreM=0;
let scoreN=0;

let lsValues=[];//["url(#nicolas7)","url(#marielle6)","url(#marielle7)","url(#marielle4)","purple","green"];//,"blue","grey","black","white","cyan","yellow"]

window.onload = initialize();

function initialize(){
	dessin();
	activeDrag();
	maj();
}

function dessin(){
	vB = document.getElementById("dessin").attributes.viewBox.value;
	widthCase = (vB.split(" ")[2]-margX)/nbCaseX;
	heightCase = vB.split(" ")[3]/nbCaseY;

	for(i=0;i<3;i++){
		let chiffreM = getRandomInt(7)*1+1;
		let chiffreN = getRandomInt(7)*1+1;
		lsValues.push("url(#marielle"+chiffreM+")");
		lsValues.push("url(#nicolas"+chiffreN+")");
	}
	
	points("marielle",fillM);
	points("nicolas",fillN);
	
	
	createBalls();


}

function points(personnage,fill){
	d3.select("#dessin")
		.append("circle")
		.attr("id","cercle_"+personnage)
		.attr("cx",widthCase*nbCaseX+22)
		.attr("cy",posPerso*100)
		.attr("r",10)
		.attr("fill",fill)
		.attr("stroke",fill)
		.attr("stroke-opacity",0.5)
		.attr("stroke-width",4)

	d3.select("#dessin")
		.append("text")
		.attr("id","score_"+personnage)
		.attr("x",widthCase*nbCaseX+15)
		.attr("y",posPerso*100+30)
		.text("0")
		
	posPerso++;
};

function createBalls(){
	for(x=0;x<nbCaseX;x++){
		for(y=nbCaseY-1;y>-1;y=y-1){
			let test = d3.selectAll(".mooveCase[cx='"+(x*widthCase+widthCase*0.5)+"'][cy='"+(y*heightCase+heightCase*0.5)+"']")[0];
			if(test==0){
				d3.select("#dessin")
					.append("circle")
					// .attr("idX",x)
					.attr("idY",y)
					.attr("id","case_"+itt)
					.attr("class","mooveCase")
					.attr("cx",x*widthCase+widthCase*0.5)
					.attr("cy",y*heightCase+heightCase*0.5)
					
					.attr("r",0)
					.attr("stroke-width",strokeCaseBase)
					// .attr("height",heightCase)
					.attr("fill",function(){
						let index = getRandomInt(lsValues.length);
						return  lsValues[index];
					})
					.attr("stroke",function(){
						let fill=this.attributes.fill.value;
						if((fill.split("marielle")).length>1){
							return fillM;
						}else{
							return fillN;
						}
					})
					.transition()
					.duration(vitCreate)
					.attr("r",widthCase*0.5)
					
				itt++;
			}
		}
	}
}

function activeDrag(){
	let lsFill=[];
	
	var drag = d3.behavior.drag() //fonction "drag" veut dire que tu fais bouger l'objet en l'attrapant
		.on("drag", function(d) {
			d3.select(this).style("cursor","grabbing");	
			d.x += d3.event.dx;
			d.y += d3.event.dy;
			// desiner un trait!!
			
			// d3.select(this).attr("class","mooveCase actived").transition().duration(200).attr("stroke-width",strokeCaseActive);
					
			// let fill = this.attributes.fill.value;	
			
			// if(lsFill.indexOf(fill)==-1){
				// lsFill.push(fill)
			// }
			
			
		})
		.on("dragend", function(d){
			d3.select(this).style("cursor","grab");	
			
			let baseX = this.attributes.cx.value*1;
			let baseY = this.attributes.cy.value*1;
			// alert(baseX);
			
			let nbActive=0;
			
			let lsCoordX=[];
			let lsCoordY=[];
			
			d3.selectAll(".mooveCase")
				.each(function(){
					
					let X = this.attributes.cx.value*1;
					let Y = this.attributes.cy.value*1;
					let fill = this.attributes.fill.value;
					
					if(Math.abs(d.y<heightCase)){
						if(  (X>=baseX&&X<=(baseX*1+widthCase*0.5+d.x*1) ||  X<=baseX&&X>=(baseX*1-widthCase*0.5+d.x*1) )  &&  Math.abs(Y-baseY)<heightCase ){
							d3.select(this).attr("class","mooveCase actived").attr("stroke-width",strokeCaseActive);
							nbActive++;
							if(lsCoordX.indexOf(X)==-1){
								lsCoordX.push(X);
							}
							if(lsFill.indexOf(fill)==-1){
								lsFill.push(fill)
							}
						}
					} 
					if(Math.abs(d.x<widthCase)){
						if(  (Y>=baseY&&Y<=(baseY*1+heightCase*0.5+d.y*1)  ||  Y<=baseY&&Y>=(baseY*1-heightCase*0.5+d.y*1)   )  &&  Math.abs(X-baseX)<widthCase){
							d3.select(this).attr("class","mooveCase actived").attr("stroke-width",strokeCaseActive);
							nbActive++;
							if(lsCoordY.indexOf(Y)==-1){
								lsCoordY.push(Y);
							}
							if(lsFill.indexOf(fill)==-1){
								lsFill.push(fill)
							}
						}
						
						
					}
					
				})
			
			if(lsFill.length==1&&nbActive>2){
				let fill=lsFill[0];
				if((fill.split("marielle")).length>1){
					scoreM=scoreM*1+nbActive*1;
					d3.select("#score_marielle").text(scoreM);
				}else{
					scoreN=scoreN*1+nbActive*1;
					d3.select("#score_nicolas").text(scoreM);
				}
				
				d3.selectAll(".actived")
					.each(function(){
						baseX=this.attributes.cx.value;
						baseY=this.attributes.idY.value;
						d3.selectAll(".mooveCase[cx='"+baseX+"']").each(function(){
							if(this.attributes.idY.value*1<=baseY*1){
								d3.select(this)//.attr("fill","black")
									.attr("idY",function(){
										return this.attributes.idY.value*1+1;
									})
							}
						})
						d3.selectAll(".mooveCase[cx='"+baseX+"']").each(function(){
							if(this.attributes.idY.value*1<=baseY*1){
								d3.select(this)
									.transition()
									.duration(vitAnim*0.8)
									.attr("cy",function(){
										return this.attributes.idY.value*heightCase+heightCase*0.5;
									})
							}
						})
					})
					.transition().duration(vitAnim).attr("r",0).transition().remove();
					
				
			}else{
				d3.selectAll(".actived").attr("class","mooveCase").transition().delay(vitAnim*0.5).duration(vitAnim*0.5).attr("stroke-width",strokeCaseBase);
			}
				
				
			nbActive=0,
			d.x =0;
			d.y =0;
			lsFill=[];
			
			setTimeout(function(){
				createBalls();
			},vitAnim*1.5);
			
			
			lsCoordX=[];
			lsCoordY=[];
		})
		
	d3.selectAll(".mooveCase").each(function(){
		d3.select(this).style("cursor","grab").data([{"x":0,"y":0}]).call(drag).style("cursor","grab");	
	});
};

// function tomber(lsCoordX,lsCoordY){
	// d3.selectAll(".mooveCase").each(function(){
		
	// }
	
// };

function maj(){};


function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}