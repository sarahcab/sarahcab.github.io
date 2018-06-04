//readonly="readonly" (ajouter pour site existant pour les caractères non changeables)

// var ls_var=["id","adresse","commune","region","pays","nbr_photo_ind","nbr_photo_site","nom_cheminee","nom_site_historique","nom_site_usage","nbr_cheminees","bati_industriel","particularite_architecturale_site","etat_site","etat_cheminee","ajout_contemporain","visibilite_appreciation","visibilite_commentaire","hauteur_distance","hauteur_estimation","particularite_architecturale_cheminee","materiau_cheminee","usage_historique","usage_actuel","reconversion","occupation","type_proprietaire","informations_historiques","protection_site","protection_cheminee","projet_amenagement_site_actuel","projet_amenagement_site_actuel_detail","projet_amenagement_cheminee_actuel","projet_amenagement_cheminee_actuel_detail","projet_amenagement_site_avenir","projet_amenagement_site_avenir_detail","projet_amenagement_cheminee_avenir","projet_amenagement_cheminee_avenir_detail","projet_valorisation_site","projet_valorisation_site_detail","projet_valorisation_cheminee","projet_valorisation_cheminee_detail","x","y","formefut","type_proprietaire_chem"],
// ls_var2=["id","adresse","commune","region","pays","nbPhInd","nbPhSit","nomChem","nomSitHist","nomSitUsa","nbrChem","batiIndus","archiSite","etatSite","etatChem","ajoutCont","visAppre","visComm","hauteurPr","hauteurEs","archiChem","materChem","usHist","usActu","reconv","occup","typeProSi","infoHist","ptcSite","ptcChem","amSiteA","amSiteA_D","amChemA","amChemA_D","amSiteV","amSiteV_D","amChemV","amChemV_D","valSite","valSiteD","valChem","valChemD","x","y","formefut","typeProCh"],
var ls_var=[],
ls_var2=[],
ls_type=[],

data_ok=[];

var modele_variable;

//////////////////////////Variables/////////////
window.onload = initialize();

//////////////////////////fonctions/////////////
function initialize(){
	queue()	//chargement des donénes					 
		.defer(d3.csv, "data/modele_chem.csv") 
		.await(callback0);
		
	function callback0(error,datata){
		modele_variable = datata;
		
		make_ls_var();
		
		boubouons();
		contribue();
	}
}


function make_ls_var(){
	for(i=0;i<modele_variable.length;i++){
		if(modele_variable[i].go_to_request=="oui"&&modele_variable[i].famille!="Chemineurs"&&modele_variable[i].famille!="communes"&&modele_variable[i].famille!="nuts"){
			ls_var2.push(modele_variable[i].variable);
			ls_var.push(modele_variable[i].variable_form);
			ls_type.push(modele_variable[i].type);
		}
	}

}

function boubouons(){
	//question du site existant
	d3.select("#new_site")
		.on("click",function(){
			document.getElementById("site_existant").checked=false;
			parent.end_site(document.getElementById("formulaire_contribuer"));
			document.getElementById("iddsite").attributes.value.value = "new";
		})
	
	d3.select("#site_existant")
		.on("click",function(){
			document.getElementById("new_site").checked=false;
			parent.select_site(document.getElementById("formulaire_contribuer"),document.getElementById("iddsite"));
			
		})
		
	document.getElementById("new_site").checked=true;
	document.getElementById("site_existant").checked=false;
	
	//pointage
	d3.select("#makeCoord")
			.attr("value","Localiser sur la carte")
			.attr("done","false")
			.on("click",function(){
				parent.pointerr(this,document.getElementById("x"),document.getElementById("y"),document.getElementById("formulaire_contribuer"))
			})
			
	//petit plus dans les cochages
	d3.selectAll(".plus_autre")
		.on("click",function(){
			// alert("Hello")
			d3.select(d3.select(this).node().parentNode)
				.append("input")
				.attr("type","text")
				.attr("id","autre0")
				.attr("class","autre_cochage")
				
		})
	
	//petits plus defieldset
	d3.selectAll(".additionnel")
		.style("height","20px")
		.style("overflow","hidden")
		
		.select("legend")
			.html(function(){
				var val = this.attributes.value.value;
				return val + " <input type='button' value='+' etat='plie' class='boubou'/>";
			})
		.select(".boubou")
		.style("color","red")
		.on("click",function(){
			if(this.attributes.etat.value=="plie"){
				var dad = d3.select(d3.select(this).node().parentNode).node().parentNode;
				d3.select(dad)
					.transition()
					.duration(500)
					.style("height","")
					
				d3.select(this)
					.attr("value","-")
					.attr("etat","deplie")
			} else {
				var dad = d3.select(d3.select(this).node().parentNode).node().parentNode;
				d3.select(dad)
					.transition()
					.duration(500)
					.style("height","20px")
						
				d3.select(this)
					.attr("value","+")
					.attr("etat","plie")
			}
		})
		

	d3.select("#quit_form")
		.on("click",function(){
			parent.pointerr(document.getElementById("makeCoord"),document.getElementById("x"),document.getElementById("y"),document.getElementById("formulaire_contribuer"))
			parent.closeContrib();
			// trye();
		})
	d3.select("#identif")
		.on("click",function(){
			parent.openIdentif();
		})
	// d3.select("#validation")
		// .on("click",function(){
			// for(i=0;i<ls_var.length;i++){
				// variable=ls_var[i];
				// var obj=document.getElementById(variable);
				// if(obj){
					// name = obj.localName;
					// if(name=="input"){
						// var type=obj.attributes.type.value;
						// data_ok.push(obj.value)
					// } else if(name=="select"){
						// var ind = obj.selectedIndex;
						// data_ok.push(obj[ind].value);
					// } else if(name=="textarea"){
						// data_ok.push(obj.value)
					// } else if(name=="div" && obj.className=="cochage"){
						// var rep="";
						// for(j in obj.children){
							// if(obj.children[j].localName=="input"){
								// if(obj.children[j].type=="checkbox"&&obj.children[j].checked==true){
									// rep=rep+"_"+obj.children[j].value;
								// } else if(obj.children[j].type=="text"&&obj.children[j].value!=""){
									// rep=rep+"_"+obj.children[j].value;
								// }
							// };
						// };
						// data_ok.push(rep)
						// console.log(variable+" : "+rep+" cochage ")
					// } else {
						// console.log("erreur : "+variable+" : "+name);
					// }
				// } else {
					// data_ok.push("");
					// console.log(variable+" : automatique");
					
				// }
				
			// }
			// var A="";
			// console.log(data_ok);
			// for(d=0;d<data_ok.length;d++){
				// A=A+data_ok[d]+";"
			// }
			// data_ok=[];
			// d3.select("#indic_valid")
				// .style("display","block")
			// d3.select("#resultatss")
			// .style("display","block")
				// .append("p")
				// .html(A)
		// })
}

function trye(){
	alert(document.getElementById("nom_site_historique").value);
		
		console.log(document.getElementById("nom_site_historique"))
		alert(document.getElementById("nom_site_historique").attributes.value.value);
		
}

function contribue(){
	d3.select('#envoie_form')
	.on("click",function(){
		
		// alert(parseFloat(document.getElementById("x").value))
		// if(parseFloat(document.getElementById("x").value)){
			// alert("ok")
		// }
		// alert(typeof(typeof(document.getElementById("x").value)))
		if(document.getElementById("x").value!=""&&document.getElementById("y").value!=""&&parseFloat(document.getElementById("x").value)&&parseFloat(document.getElementById("y").value)){
			data_ok=[];
			for(i=0;i<ls_var.length;i++){
				variable=ls_var[i];
				var obj=document.getElementById(variable);
				console.log("--   "+variable)
				if(obj){
					var addi;
					name = obj.localName;
					if(name=="input"){
						var type=obj.attributes.type.value;
						addi = (obj.value);
					} else if(name=="select"){
						var ind = obj.selectedIndex;
						addi = (obj[ind].value);
						// console.log(variable+" : "+obj[ind].value+" "+name)
					} else if(name=="textarea"){
						addi = (obj.value)
						// console.log(variable+" : "+obj.value+" "+name+" ")
					} else if(name=="div" && (obj.className).indexOf("cochage")>-1){
						var rep="";
						for(j in obj.children){
							if(obj.children[j].localName=="input"&&(obj.children[j].type=="text"||obj.children[j].type=="checkbox")){
								if(obj.children[j].type=="checkbox"&&obj.children[j].checked==true){
									if(rep==""){
										rep=obj.children[j].value;
									} else {
										rep=rep+"_"+obj.children[j].value;
									}
								} else if(obj.children[j].type=="text"&&obj.children[j].value!=""){
									if(rep==""){
										rep=obj.children[j].value;
									} else {
										rep=rep+"_"+obj.children[j].value;
									}
								}
							};
						};
						addi = (rep)
					} else {
						alert("erreur : "+variable+" : "+name);
					}
					
				} else {
					addi = ("");
				}
				if(ls_type[i]=="nombre"){
					if(addi==""){
						addi = 0;
					} else {
					}
				} else {
					var p0 = "'";
					var p1 = "'";
					if(addi.indexOf("'")!=-1){
						alert(addi)
						decoupe = addi.split("'")
						newaddi = decoupe[0]
						for(i=1;i<decoupe.length;i++){
							newaddi=newaddi+"\'\'"+decoupe[i]
						}
						addi=newaddi
						alert(addi);
						var p0 = "('";
						var p1 = "')";
					}
					addi = p0+addi+p1;
				}
				data_ok.push(addi);
				
			}
			
			parent.chargement();
			$.ajax({
				type : 'POST',
				url : 'php/contrib.php',
				dataType: 'html',
				data:{
					lsvar : ls_var2,
					dataok : data_ok,
					X : $("#x").val(),
					Y : $("#y").val(),
					identifiant : parent.get_identifiant(),
					identi_sql : "'"+parent.get_identifiant()+"'",
					site_exist : document.getElementById("iddsite").attributes.value.value,
					verrouillage : parent.get_verrouillage()
				},
				success : function(msg){
					parent.chargement_end();
					if(msg.indexOf('Géolocalisation hors europe')!=-1){
						$('#ok').html(msg);
						alert("La localité se trouve hors de l'Europe");
					} else if(msg.indexOf('error')!=-1||msg.indexOf('ERREUR')!=-1){
						$('#ok').html(msg);
						alert("Une erreur est survenue");
					}else {
						$('#ok').html(msg);
						alert("La cheminée a bien été ajoutée");
						parent.end_site(document.getElementById("formulaire_contribuer"));
						//parent.pointerr(document.getElementById("makeCoord"),document.getElementById("x"),document.getElementById("y"),document.getElementById("formulaire_contribuer"))
						parent.recharge_data();
						parent.closeContrib();
					}
				},
				error : function(){
					alert("Erreur d'exécution");
					$('#ok').html(msg);
				}
				// complete : function(){
					
				// }
			})
		}else {
			alert("La géolocalisation est incorrecte : utiliser le bouton 'Localiser sur la carte'")
		}
		return false ;
	}) ;

} ;

			