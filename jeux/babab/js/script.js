

// maxX = 688.297
// minX=-25.574
// maxY=867.661
// minY=-72.65
// ampliX=maxX-minX
// ampliY=maxY-minY
// margY=(ampliY-ampliX)*0.5

var ampliX=800;
var ampliY=800;

var puissance=7;
var len=Math.pow(4,puissance);
var lines=Math.sqrt(len);

var points;

window.onload = initialize();

function initialize(){
	queue()
		.defer(d3.csv,"data/points.csv")
		.await(callback)
	
	function callback(error, csvpoints){
		points=csvpoints;
		d3.select("#dessin")
			.append("circle")
			.attr("cx",ampliX*0.5)
			.attr("cy",ampliY*0.5)
			.attr("r",ampliX*0.46)
			.attr("rd",ampliX*0.5)
			.attr("fill",points[0].fill)
			.attr("rang",1)
			.attr("posX",1)
			.attr("posY",1)
			.on("mousemove",function(){
				blop(this)
			})
	}
}

function blop(obj){
	var rd= obj.attributes.rd.value*0.5;
	var r= obj.attributes.r.value*0.5;
	var rang= obj.attributes.rang.value;
	var centrex= obj.attributes.cx.value;
	var centrey= obj.attributes.cy.value;
	var posX=obj.attributes.posX.value;
	var posY=obj.attributes.posY.value;
	d3.select(obj)
		// .attr("opacity",1)
		// .transition()
		// .duration(200)
		// .attr("opacity",0)
		.remove();
		
	d3.select("#dessin")
		.append("g")
		.selectAll("circle")
		.data([[centrex-rd,centrey-rd,0,0],[centrex*1+rd*1,centrey-rd,1,0],[centrex-rd,centrey*1+rd*1,0,1],[centrex*1+rd*1,centrey*1+rd*1,1,1]])
		.enter()
		.append("circle")
		.attr("cx",function(d){
			return d[0]
		})
		.attr("cy",function(d){
			return d[1]
		})
		// .attr("r",0)
		.attr("r",r)
		.attr("rd",rd)
		.attr("rang",rang*1+1)
		.attr("posX",function(d){
			var val=posX*1+(lines/(Math.pow(2,rang)))*d[2];
			// alert(lines/(Math.pow(4,rang)))
			return val
		})
		.attr("posY",function(d){
			var val=posY*1+(lines/(Math.pow(2,rang)))*d[3];
			// alert(lines/(Math.pow(4,rang)))
			return val
		})
		// .attr("posY",function(d){
			// if(rang==7){
				// return posY*d[3]+0.5
			// } else {
				// return posY*d[3]
			// }
		// })
		.attr("fill",function(){
			coul="black";
			posx=this.attributes.posX.value;
			posy=this.attributes.posY.value;
			for(i=0;i<points.length;i++){
				// alert(points[i].id_x+" "+posX+" "+typeof(points[i].id_x)+" "+typeof(posX))
				if(points[i].id_x==posx&&points[i].id_y==posy){
					var coul=points[i].fill
				}
			}
			return coul;
		})
		.on("mousemove",function(){
			if(this.attributes.rang.value<=puissance){
				blop(this)
			}
			
		})
		// .transition()
		// .duration(200)
		// .attr("r",r)
		
	
}