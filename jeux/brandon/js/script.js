var it=0;

window.onload = initialize();

function initialize(){
	jeu();
	d3.select("#debut").style("display","block")
	d3.select("#content").style("opacity",0.1)
	d3.select("#play")
		.on("click",function(){
			d3.select("#debut").style("display","none")
			d3.select("#content").style("opacity",1)
			animations()
		})
}
function jeu(){
	d3.select("#content")
		.append("svg")
		.attr("id","jeu"+it)
		.attr("viewBox","-30 -30 1060 710")
		.attr("width","100%")
		.append("image")
		.attr("id","b")
		.attr("xlink:href","img/brandon.png")
		.attr("rx",10)
		.attr("width",30)
		.attr("height",30)
		
	d3.select("#jeu"+it)
		.append("g")
		.attr("id","obs")
		
	
	d3.select("#obs")
		.selectAll(".bords")
		.data([[-30,-30,1060,30],[-30,50,30,650],[1000,-30,30,710],[-30,650,1060,30]])
		.enter()
		.append("rect")
		.attr("x",function(d){
			return d[0]
		})
		.attr("y",function(d){
			return d[1]
		})
		.attr("width",function(d){
			return d[2]
		})
		.attr("height",function(d){
			return d[3]
		})
		.attr("fill","#BBBBBB")
		
	d3.select("#obs")
		.selectAll(".couloir")
		.data([[-30,50],[50,150],[-30,250],[50,350],[-30,450],[160,550]])
		.enter()
		.append("rect")
		.attr("x",function(d){
			return d[0]
		})
		.attr("y",function(d){
			return d[1]
		})
		.attr("y0",function(d){
			return d[1]
		})
		.attr("width",980)
		.attr("height",40)
		.attr("fill","#BBBBBB")
		.attr("class",function(d,i){
			if(i%2==0){
				return "couloir gonfle"
			}else{
				return "couloir"
			}
		})
	
	d3.select("#obs")
		.selectAll(".ecrase")
		.data([[500,70,70,40,2000],[500,170,130,40,2000],[200,370,370,50,1000],[200,470,420,50,1000],[50,270,270,80,3000],[50,270,190,80,3000]])
		.enter()
		.append("rect")
		.attr("x",function(d){
			return d[0]
		})
		.attr("y",function(d){
			return d[1]
		})
		.attr("y0",function(d){
			return d[1]
		})
		.attr("y2",function(d){
			return d[2]
		})
		.attr("width",80)
		.attr("height",0)
		.attr("height2",function(d){
			return d[3]
		})
		.attr("vitesse",function(d){
			return d[4]
		})
		.attr("fill","#BBBBBB")
		.attr("class","ecrase")
		
	d3.select("#obs")
		.selectAll(".chiant")
		.data([350,780])
		.enter()
		.append("rect")
		.attr("x",function(d){
			return d
		})
		.attr("y",function(d,i){
			return i*350
		})
		.attr("y0",function(d,i){
			return i*350
		})
		.attr("width",30)
		.attr("height",300)
		.attr("class","chiant")
		.attr("fill","#BBBBBB")
	
	d3.select("#obs")
		.attr("stroke","blue")
		.attr("stroke-opacity",0)
		.attr("stroke-width",15)
		.append("g")
		.attr("id","roue")
	
	for(i=0;i<360;i+=60){
		d3.select("#roue")
			.append("rect")
			.attr("x",75)
			.attr("y",480)
			.attr("width",10)
			.attr("height",160)
			.attr("rx",5)
			.attr("fill","#BBBBBB")
			.attr("transform","rotate("+i+" 80 570)")
	}
	
	
	
	
	
	
}



function animations(){
	repeat()
	d3.selectAll(".ecrase")
		.each(function(){
			ecrase(this)
		})
	bouge()
	
	d3.select("#roue").attr("class","roue")
	
	d3.select("#jeu"+it)
		.on("mousemove",function(){
			x = d3.mouse(this)[0]; 
			y = d3.mouse(this)[1]; 
			d3.select("#b").attr("x",x-16.5).attr("y",y-18)
		})
		.style("cursor","none")
		
		
	d3.select("#obs")
		.on("mouseover",perdu)
		
	function repeat() {
		d3.selectAll(".gonfle")
			.transition()
			.duration(4000)
			// .ease("linear")
			.attr("height",70)
			.attr("y",function(){
				var val=this.attributes.y0.value;
				return val-20;
			})
			.transition()
			.delay(4000)
			.duration(4000)
			// .ease("linear")
			.attr("height",40)
			.attr("y",function(){
				var val=this.attributes.y0.value;
				return val;
			})
			.each("end", repeat);
    }
	
	function ecrase(obj){
		d3.select(obj)
			.transition()
			.duration(function(){
				return this.attributes.vitesse.value
			})
			.attr("height",function(){
				return this.attributes.height2.value;
			})
			.attr("y",function(){
				return this.attributes.y2.value;
			})
			.transition()
			.delay(function(){
				return this.attributes.vitesse.value
			})
			.duration(function(){
				return this.attributes.vitesse.value
			})
			.attr("height",0)
			.attr("y",function(){
				return this.attributes.y0.value;
			})
			.each("end", function(){
				ecrase(this)
			})
	}
	
	function bouge(){
		d3.selectAll(".chiant")
			.transition()
			.duration(1700)
			.ease("bounce")
			.attr("y",function(){
				var val= 350-this.attributes.y0.value;
				return val;
			})
			.transition()
			.delay(1700)
			.duration(1700)
			.attr("y",function(){
				return this.attributes.y0.value;
			})
			.each("end",bouge)
			
	}
}

function perdu(){
	if(it!=3){
		alert("Perdu!");
	} else {
		alert("Perdu!");
		alert("T'es vraiment naze");
	}
	
	d3.select("#jeu"+it).remove();
	it++;
	initialize();
	
}
