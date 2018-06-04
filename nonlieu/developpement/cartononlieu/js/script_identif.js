//readonly="readonly" ou disabled (ajouter lorsqu'on se connecte) -> ou pour tous dt un bouton modifier (êtes vous sures que la donéne est incorrecte??)
var datachem,
auteur = '',
var_obli = ["identifiant","motdepasse","mail"];


//////////////////////////Variables/////////////
window.onload = initialize();

//////////////////////////fonctions/////////////
function initialize(){
	queue()	//chargement des donénes					 
		.defer(d3.csv, "data/modele_chem.csv") 
		.await(callback0);
		
	function callback0(error,datata){
		datachem = datata;
		bouboutons();
		register();
	}
}
function bouboutons(){
	d3.select("#retour_identif")
		.on("click",function(){
			parent.close_identif();
		})
		
	d3.select("#connect")
		.on("click",function(){
			d3.selectAll("fieldset").style("display","none");
			d3.selectAll(".fix_fieldset").style("display","block");
			
			d3.selectAll(".non_connect").style("display","none");
			d3.selectAll(".bou_connect").style("display","block").style("opacity",0).transition().duration(350).style("opacity",1);
		})
	
	d3.select("#connect_retour")
		.on("click",function(){
			d3.selectAll("fieldset").style("display","block");
			d3.selectAll(".bou_connect").style("display","none");
			d3.selectAll(".non_connect").style("display","block");
		})
		
	d3.select("#connect_ok")
		.on("click",function(){
			
			d3.selectAll("fieldset").style("display","block");
			d3.selectAll(".bou_connect").style("display","none");
			d3.selectAll(".non_connect").style("display","block");
			parent.chargement();
			$.ajax({
				type : 'POST',
				url : 'php/connect_chemineur.php',
				dataType: 'html',
				data:{
					identi : $("#identifiant").val(),
					mdp : $("#motdepasse").val()
				},
				success : function(msg){
					parent.chargement_end();
					if(msg.indexOf('error')!=-1){
						alert('Erreur!');
						console.log(msg)
					} else if(msg.indexOf("L'identifiant n'existe pas")!=-1){
						alert("L'identifiant n'existe pas!");
						console.log(msg)
					} else if(msg.indexOf("Mot de passe incorrect")!=-1){
						alert("Mot de passe incorrect");
						console.log(msg)
					} else if(msg.indexOf("valide")){
						alert("Autentification réussie");
						console.log(msg);
						var auteur = $("#identifiant").val();
						parent.maj_variables(auteur,$("#verrouillage").is(':checked'));
						parent.close_identif();
					} else {
						alert('Erreur non détectée par PHP');
						console.log(msg)
					}
				}
			})
		
			
		})
}


function register(){
	$('#form_identif').submit(function(){
		// alert("|"+document.getElementById(var_obli[0]).value+'|'+document.getElementById(var_obli[1]).value+'|'+document.getElementById(var_obli[2]).value+"|");
		// if(document.getElementById(var_obli[0]).value==""){
			// alert(var_obli[0])
		// }
		// if(document.getElementById(var_obli[1]).value==""){
			// alert(var_obli[1])
		// }
		// if(document.getElementById(var_obli[2]).value==""){
			// alert(var_obli[2])
		// }
		if(document.getElementById(var_obli[0]).value==""||document.getElementById(var_obli[1]).value==""||document.getElementById(var_obli[2]).value==""){
			alert("Les champs suivis d'un * sont obligatoires")
		}else {
			data_ok=[];
			ls_var=[];
			identifiant=[];
			for(i=0;i<datachem.length;i++){ //faire pareil pour le script_form
				// alert(datachem[i]);
				if(datachem[i].famille=="Chemineurs"){
					variable=datachem[i].variable_form;
					var obj=document.getElementById(variable);
					if(obj){
						var addi;
						addi = (obj.value)
					}else {
						addi="";
					}
					addi = "'"+addi+"'";
					data_ok.push(addi);
					ls_var.push(datachem[i].variable);
					if(variable=="identifiant"){
						identifiant = addi;
					}
				}
			}
			
			parent.chargement();
			
			$.ajax({
				type : 'POST',
				url : 'php/check_chemineur.php',
				dataType: 'html',
				data:{
					identifiant : identifiant
				},
				success : function(msg){
					parent.chargement_end();
					if(msg.indexOf('error')!=-1){
						alert('Erreur!');
						console.log(msg)
					}else if(msg=="0") {
						console.log(msg);
						add_chemAjax();
					} else {
						alert('Identifiant déjà pris');
						console.log(msg);
					}
				}
			})
			
			function add_chemAjax(){
				$.ajax({
					type : 'POST',
					url : 'php/contrib_chemineur.php',
					dataType: 'html',
					data:{
						lsvar : ls_var,
						dataok : data_ok,
						chem_exist : document.getElementById("iddchem").attributes.value.value
					},
					success : function(msg){
						parent.chargement_end();
						if(msg.indexOf('error')!=-1){
							alert("Erreur d'ajout du profil");
							console.log("--------")
							console.log(msg)
						}else {
							alert('Profil ajouté');
							console.log("--------")
							console.log(msg);
						}
					},
					complete : function(){
						parent.recharge_data();
						parent.close_identif();
						parent.maj_variables(identifiant,$("#verrouillage").is(':checked'));
					}
				})
			}
		}	
		return false ;
		
	}) ;

} ;

			