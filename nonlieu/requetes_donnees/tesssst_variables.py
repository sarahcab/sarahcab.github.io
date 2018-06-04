# coding: utf-8

#-------------------------------------------------------------------------------
# Name:        module1
# Purpose:
#
# Author:      Sarah
#
# Created:     24/05/2018
# Copyright:   (c) Sarah 2018
# Licence:     <your licence>
#-------------------------------------------------------------------------------

ls_var=["id","adresse","commune","region","pays","nbr_photo_ind","nbr_photo_site","nom_cheminee","nom_site_historique","nom_site_usage","nbr_cheminees","bati_industriel","particularite_architecturale_site","etat_site","etat_cheminee","ajout_contemporain","visibilite_appreciation","visibilite_commentaire","hauteur_distance","hauteur_estimation","particularite_architecturale_cheminee","materiau_cheminee","usage_historique","usage_actuel","reconversion","occupation","type_proprietaire","informations_historiques","protection_site","protection_cheminee","projet_amenagement_site_actuel","projet_amenagement_site_actuel_detail","projet_amenagement_cheminee_actuel","projet_amenagement_cheminee_actuel_detail","projet_amenagement_site_avenir","projet_amenagement_site_avenir_detail","projet_amenagement_cheminee_avenir","projet_amenagement_cheminee_avenir_detail","projet_valorisation_site","projet_valorisation_site_detail","projet_valorisation_cheminee","projet_valorisation_cheminee_detail","x","y","formefut","type_proprietaire_chem"]
ls_var2=["id","adresse","commune","region","pays","nbPhInd","nbPhSit","nomChem","nomSitHist","nomSitUsa","nbrChem","batiIndus","archiSite","etatSite","etatChem","ajoutCont","visAppre","visComm","hauteurPr","hauteurEs","archiChem","materChem","usHist","usActu","reconv","occup","typeProSi","infoHist","ptcSite","ptcChem","amSiteA","amSiteA_D","amChemA","amChemA_D","amSiteV","amSiteV_D","amChemV","amChemV_D","valSite","valSiteD","valChem","valChemD","x","y","formefut","typeProCh"]

ls_mod = []
ls_mod2 = []
poubelle = []

table = [["variable_form","variable","Description","type","famille","position","site"],["nom_cheminee","nomChem","Elément particulier de la cheminée : ","unique","Général","avant","non"],["nom_site_historique","nomSitHist","Nom historique du site : ","unique","Général","avant","oui"],["nom_site_usage","nomSitUsa","Nom d'usage du site : ","unique","Général","avant","oui"],["id","id","","Texte","invisible","avant","non"],["adresse","adresse","Adresse : ","unique","Général","avant","non"],["commune","commune","Commune : ","unique","Général","avant","non"],["region","region","Région : ","unique","Général","avant","non"],["pays","pays","Pays : ","unique","Général","avant","non"],["nbr_photo_ind","nbPhInd","","Nombre entier","invisible","avant","non"],["nbr_photo_site","nbPhSit","","Nombre entier","invisible","avant","oui"],["nbr_cheminees","nbrChem"," cheminée(s) sur le site","nombre","Général","apres","oui"],["auteur","auteur","Auteur","unique","Général","avant","non"],["bati_industriel","batiIndus","Présence de bâti industriel","booleen_0","Description","avant","non"],["particularite_architecturale_site","archiSite","Particularités architecturales et décoratives du bâti : ","cochage","Description","avant","oui"],["etat_site","etatSite","Etat du site : ","selecteur","Description","avant","oui"],["etat_cheminee","etatChem","Etat de la cheminée : ","selecteur","Description","avant","non"],["ajout_contemporain","ajoutCont","Ajout(s) contemporains de la cheminée : ","cochage","Description","avant","non"],["visibilite_appreciation","visAppre","Visibilité de la cheminée dans le paysage depuis l'espace public : ","fam","Description","avant","non"],["visibilite_commentaire","visComm","Commentaire(s) : ","in_fam","Description","avant","non"],["hauteur_distance","hauteurPr","Hauteur de la cheminée (précise) : ","nombre","Description","avant","non"],["hauteur_estimation","hauteurEs","Hauteur de la cheminée (estimation) : ","intervalle","Description","avant","non"],["particularite_architecturale_cheminee","archiChem","Particularité(s) architecturale(s) et décorative(s) de la cheminée: ","cochage","Description","avant","non"],["materiau_cheminee","materChem","Principal matériau de construction de la cheminée : ","selecteur","Description","avant","non"],["formefut","formefut","Forme du fût : ","selecteur","Description","avant","non"],["usage_historique","usHist","Usage historique du site : ","cochage","Usage","avant","oui"],["usage_actuel","usActu","Usage actuel du site : ","cochage","Usage","avant","oui"],["reconversion","reconv","Le site est : ","selecteur","Usage","avant","oui"],["occupation","occup"," occupé","selecteur","Usage","apres","oui"],["type_proprietaire_chem","typeProCh","Type de propriétaire de la cheminée : ","selecteur","Usage","avant","non"],["type_proprietaire_site","typeProSi","Type de propriétaire du site : ","selecteur","Usage","avant","oui"],["informations_historiques","infoHist","Information(s) historique(s) : ","texte_libre","Histoire","avant","oui"],["protection_site","ptcSite","Protection du site : ","cochage","Protection patrimoniale","avant","oui"],["protection_cheminee","ptcChem","Protection de la cheminée : ","cochage","Protection patrimoniale","avant","non"],["projet_amenagement_site_actuel","amSiteA","Projet(s) d'aménagement en cours sur le site : ","booleen","Transformation","avant","oui"],["projet_amenagement_site_actuel_detail","amSiteA_D","","in_bool","Transformation","avant","oui"],["projet_amenagement_cheminee_actuel","amChemA","Projet(s) d'aménagement en cours sur la cheminée : ","booleen","Transformation","avant","non"],["projet_amenagement_cheminee_actuel_detail","amChemA_D","","in_bool","Transformation","avant","non"],["projet_amenagement_site_avenir","amSiteV","Projet(s) d'aménagement à venir sur le site : ","booleen","Transformation","avant","oui"],["projet_amenagement_site_avenir_detail","amSiteV_D","","in_bool","Transformation","avant","oui"],["projet_amenagement_cheminee_avenir","amChemV","Projet(s) d'aménagement à venir sur la cheminée : ","booleen","Transformation","avant","non"],["projet_amenagement_cheminee_avenir_detail","amChemV_D","","in_bool","Transformation","avant","non"],["projet_valorisation_site","valSite","Projet(s) de valorisation et d'animation sur le site : ","booleen","Transformation","avant","oui"],["projet_valorisation_site_detail","valSiteD","","in_bool","Transformation","avant","oui"],["projet_valorisation_cheminee","valChem","Projet(s) de valorisation et d'animation en cours sur la cheminée : ","booleen","Transformation","avant","non"],["projet_valorisation_cheminee_detail","valChemD","","in_bool","Transformation","avant","non"],["nom_perso","nomPerso","","invisible","Chemineurs","avant","non"],["prenom","prenom","","invisible","Chemineurs","avant","non"],["nom_structure","nomStru","","invisbile","Chemineurs","avant","non"],["objet","objet","Objet de la structure/ motivations: ","texte_libre","Chemineurs","avant","non"],["territoire","territoire","Lieu ou territoire d'intervention/de prédilection : ","texte_libre","Chemineurs","avant","non"],["cheminees","cheminees","","invisible","Chemineurs","avant","non"],["actions","actions","Types d'actions menées/envisagées autour des cheminées d'usine: ","texte_libre","Chemineurs","avant","non"],["agenda","agenda","Votre agenda d'actions récurrentes ou ponctuelles sur l'année :","texte_libre","Chemineurs","avant","non"],["envie_propo","envieProp","Vos envies ou propositions : ","texte_libre","Chemineurs","avant","non"],["mail","mail","","invisible","Chemineurs","avant","non"],["tel","tel","","invisible","Chemineurs","avant","non"],["adresse","adresse","","invisible","Chemineurs","avant","non"],["code_postal","codePost","","invisible","Chemineurs","avant","non"],["commune","commune","","invisible","Chemineurs","avant","non"],["site_web","siteWeb","Site web : ","invisible","Chemineurs","avant","non"],["identifiant","identi","Identifiant : ","invisible","Chemineurs","avant","non"],["motdepasse","mdp","Mot de passe : ","invisible","Chemineurs","avant","non"]]

i = -1

for row in table :
    i += 1
    if"variable_form" not in row :
##        print i

        ls_mod2.append(row[1])
        if row[0] in ls_var :
            ls_mod.append(row[0])
        else :
            poubelle.append(row[0])
        if row[1] in ls_var :
            ls_mod2.append(row[1])

print len(ls_var)
print len(ls_var2)

print len(ls_mod)
print len(ls_mod2)

print poubelle