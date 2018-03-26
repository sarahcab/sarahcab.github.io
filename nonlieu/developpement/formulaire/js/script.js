ls_var=["id","adresse","commune","region","pays","nbr_photo_ind","nbr_photo_site","nom_cheminee","nom_site_historique","nom_site_usage","nbr_cheminees","bati_industriel","particularite_architecturale_site","etat_site","etat_cheminee","ajout_contemporain","visibilite_appreciation","visibilite_commentaire","hauteur_distance","hauteur_estimation","particularite_architecturale_cheminee","materiau_cheminee","usage_historique","usage_actuel","reconversion","occupation","type_proprietaire","informations_historiques","protection_site","protection_cheminee","projet_amenagement_site","projet_amenagement_site_detail","projet_amenagement_cheminee","projet_amenagement_cheminee_detail","projet_amenagement_site_avenir","projet_amenagement_site_avenir_detail","projet_amenagement_cheminee_avenir","projet_amenagement_cheminee_avenir_detail","projet_valorisation_site","projet_valorisation_site_detail","projet_valorisation_cheminee","projet_valorisation_cheminee_detail"]

data_ok=[]
//////////////////////////Variables/////////////
window.onload = initialize();

//////////////////////////fonctions/////////////
function initialize(){
	d3.selectAll(".additionnel")
		.style("height","20px")
		.style("overflow","hidden")
		.on("mouseover",function(){
			d3.select(this)
				.transition()
				.duration(500)
				.style("height","")
			// d3.select(this)
				// .select("legend")
				// .html(function(){
					// var val = this.attributes.value.value;
					// return val;
				// })
		})
		.on("mouseout",function(){
			d3.select(this)
				.transition()
				.duration(500)
				.style("height","20px")
			var obj=this;
			// setTimeout(function(){
				// d3.select(obj)
					// .select("legend")
					// .html(function(){
						// var val = this.attributes.value.value;
						// return val + " (Survoler pour dérouler)";
					// })
			// },250)
		})
		.select("legend")
			.html(function(){
				var val = this.attributes.value.value;
				return val + " (Survoler pour dérouler)";
			})
			
	d3.select("#validation")
		.on("click",function(){
			for(i=0;i<ls_var.length;i++){
				variable=ls_var[i];
				var obj=document.getElementById(variable);
				if(obj){
					name = obj.localName;
					if(name=="input"){
						var type=obj.attributes.type.value;
						data_ok.push(obj.value)
						console.log(variable+" : "+obj.value+" "+name+" "+type)
					} else if(name=="select"){
						var ind = obj.selectedIndex;
						data_ok.push(obj[ind].value);
						console.log(variable+" : "+obj[ind].value+" "+name)
					} else if(name=="textarea"){
						data_ok.push(obj.value)
						console.log(variable+" : "+obj.value+" "+name+" ")
					} else if(name=="div" && obj.className=="cochage"){
						console.log(obj);
						var rep="";
						for(j in obj.children){
							if(obj.children[j].localName=="input"){
								if(obj.children[j].type=="checkbox"&&obj.children[j].checked==true){
									rep=rep+"_"+obj.children[j].value;
								} else if(obj.children[j].type=="text"&&obj.children[j].value!=""){
									rep=rep+"_"+obj.children[j].value;
								}
							};
						};
						data_ok.push(rep)
						console.log(variable+" : "+rep+" cochage ")
					} else {
						console.log("erreur : "+variable+" : "+name);
					}
				} else {
					data_ok.push("");
					console.log(variable+" : automatique");
					
				}
				
			}
			var A="";
			console.log(data_ok);
			for(d=0;d<data_ok.length;d++){
				A=A+data_ok[d]+";"
			}
			data_ok=[];
			// alert(A);
			// alert(data_ok.length)
			d3.select("body")
				.append("p")
				.style("margin-bottom","0px")
				.html("Copier le texte dans l'encadré ci-dessous puis ajouter dans excel")
			d3.select("body")
				.append("div")
				.style("margin-top","0px")
				.style("border","dashed 1px black")
				.append("p")
				.html(A)
		})
}
