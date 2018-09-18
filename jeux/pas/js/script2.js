
window.onload = initialize();



function initialize(){
	queue()											
		.defer(d3.csv,"data/data_english.csv")
		.defer(d3.csv,"data/meta_source.csv")
		.await(callback1);

	function callback1(error,data1,data2){
		pas();
		mer();
	}
	
}

function pas(){
	d3.select("#ase").attr("class","paspas")
	d3.select("#auters").attr("class","paspas")
	d3.select("svg").append("g").attr("id","place_pas")
	
	var ancX=0;
	var ancY=0;
	var itp=0;
	var cont=true; //régulateur
	var gauche =["M0,123.668c0.534-26.24,3.635-54.223,16.996-80.082 C24.16,29.721,33.861,18.062,47.059,9.511c22.273-14.431,44.854-11.887,63.239,7.255c13.819,14.388,21.013,32.197,25.624,51.186 c9.493,39.091,4.783,77.338-7.355,115.062c-2.138,6.646-4.439,13.26-7.079,19.72c-2.912,7.128-6.05,8.901-13.67,7.548 c-19.83-3.523-39.738-4.081-59.715-1.92c-7.76,0.84-15.495,2.075-23.164,3.537c-10.482,2-13.963-0.254-16.116-10.689 C3.7,176.372,0.178,151.357,0,123.668z","M21.646,267.26c12.761-1.664,24.943-3.277,37.132-4.838 c19.313-2.473,38.642-4.822,57.933-7.461c2.72-0.371,4.063-0.058,4.68,2.662c4.713,20.77,9.846,41.424,7.732,63.098 c-2.272,23.301-16.255,39.738-38.59,44.395c-24.625,5.133-45.652-4.442-56.794-25.814c-7.496-14.377-9.382-30.066-10.668-45.863 C22.382,284.992,22.134,276.51,21.646,267.26z"]
	var droite = ["M298.188,135.517c-1.526,12.622-4.033,33.761-6.676,54.882 c-0.576,4.606-1.297,9.248-2.552,13.704c-1.928,6.846-5.096,9.074-12.144,8.247c-10.064-1.182-20.024-3.36-30.105-4.254 c-17.612-1.563-35.219-1.733-52.703,2.038c-11.626,2.508-14.801,0.479-18.793-10.577c-6.727-18.629-13.146-37.328-16.354-56.992 c-3.783-23.209-1.962-46.113,2.792-68.958c3.876-18.627,10.177-36.23,21.708-51.571c19.406-25.821,48.104-29.239,73.231-8.726 c19.296,15.753,29.483,36.94,35.432,60.551C296.406,91.252,297.647,108.999,298.188,135.517z","M276.421,267.248c-1.52,21.725-1.541,42.804-8.453,62.926 c-6.861,19.977-19.676,33.723-41.605,35.948c-31.424,3.19-53.537-14.477-56.785-45.78c-2.311-22.268,1.943-44.022,8.074-65.812 C210.617,258.775,243.216,262.973,276.421,267.248z"]
	
	//adaptation
	var Wpage = document.getElementById("cont").offsetWidth//*ajust;
	var vbW = (document.getElementById("dessin").attributes.viewBox.value).split(" ")[2];
	var vbX = (document.getElementById("dessin").attributes.viewBox.value).split(" ")[0];
	var coeffW=vbW/Wpage;
		
	var Hpage = document.getElementById("cont").offsetHeight//*ajust;
	var vbH = (document.getElementById("dessin").attributes.viewBox.value).split(" ")[3];
	var vbY = (document.getElementById("dessin").attributes.viewBox.value).split(" ")[1];
	var coeffH=vbH/Hpage;
		
	
	d3.selectAll(".paspas")
		.on("mousemove",function(){
			X = d3.event.clientX/2.35;
			if(cont==true){
				// console.log(ancX-X)
				if(itp%2==0){
					var data = gauche;
					trans=-100;
				}else {
					var data = droite;
					trans=100;
				}
				itp++;
				X = d3.event.clientX*coeffW+vbX*1;
				Y = d3.event.clientY*coeffH+vbY*1;
				// console.log(d3.event.clientX+" "+X+" "+Wpage+" "+vbW+" "+vbX);
				// d3.select("#dessin").append("circle").attr("cx",X).attr("cy",Y).attr("r",5).attr("fill","red")
				
				d3.select("#place_pas")
					.append("g")
					.attr("opacity",0.7)
					.attr("transform","translate("+(X)+","+Y+")")
					.append("g")
					.attr("transform","scale(0.007)")
					.selectAll("path")
					
					.data(data)
					.enter()
					.append("path")
					
					.attr("d",function(d){
						return d
					})
					.attr("opacity",0.4)
					.attr("transform",function(){
						angle=Math.atan((X-ancX)/(Y-ancY))*180/Math.PI; 
						if(ancX>X&&ancY>Y){ 
							angle=angle*-1
						} else if(ancX<X&&ancY>Y){
							angle=angle*-1
						} else {
							angle=angle*-1-180;
						}
						return "rotate("+angle+" 149.094 184.452)"
					})
					.transition()
					.duration(120)
					.attr("opacity",0.8)
					.transition()
					.delay(2000)
					.duration(6000)
					.attr("opacity",0)
					.remove()
				
				ancX=X;
				ancY=Y;
				cont=false;
				setTimeout(function(){cont=true},30)
			}
			
			
			
		})
	
}

function mer(){
	var cont2=true; //régulateur
	
		//adaptation
	var Wpage = document.getElementById("cont").offsetWidth//*ajust;
	var vbW = (document.getElementById("dessin").attributes.viewBox.value).split(" ")[2];
	var vbX = (document.getElementById("dessin").attributes.viewBox.value).split(" ")[0];
	var coeffW=vbW/Wpage;
		
	var Hpage = document.getElementById("cont").offsetHeight//*ajust;
	var vbH = (document.getElementById("dessin").attributes.viewBox.value).split(" ")[3];
	var vbY = (document.getElementById("dessin").attributes.viewBox.value).split(" ")[1];
	var coeffH=vbH/Hpage;
		
	
		d3.select("svg")
			.style("cursor","none")
			.on("mousemove",function(){
				if(cont2==true){
					X = d3.event.clientX*coeffW+vbX*1;
					Y = d3.event.clientY*coeffH+vbY*1;
					for(i=0;i<3;i++){
						d3.select("#Calque_2")
							.append("circle")
							.attr("cx",X)
							.attr("cy",Y)
							.attr("r",0)
							.attr("stroke-opacity",1)
							.attr("fill","D6D8E5")
							.attr("stroke","#000000")
							.attr("stroke-width",0.1)
							.transition()
							.delay(i*100)
							.transition()
							.duration(6000)
							.attr("r",50)
							.attr("stroke-opacity",0.05)
							.remove()
					}
					cont2=false;
					setTimeout(function(){cont2=true},50)
				}
			})
		
	
}
