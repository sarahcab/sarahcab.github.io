#-------------------------------------------------------------------------------
# Name:        module1
# Purpose:
#
# Author:      Sarah
#
# Created:     13/04/2018
# Copyright:   (c) Sarah 2018
# Licence:     <your licence>
#-------------------------------------------------------------------------------

ls =["id","adresse","commune","region","pays","nbPhInd","nbPhSit","nomChem","nomSitHist","nomSitUsa","nbrChem","batiIndus","archiSite","etatSite","etatChem","ajoutCont","visAppre","visComm","hauteurPr","hauteurEs","archiChem","materChem","usHist","usActu","reconv","occup","typeProSi","infoHist","ptcSite","ptcChem","amSiteA","amSiteA_D","amChemA","amChemA_D","amSiteV","amSiteV_D","amChemV","amChemV_D","valSite","valSiteD","valChem","valChemD","gidSit","x","y","formefut","typeProCh"]
blop=""

for i in ls :
      blop=blop + "'"+i.lower()+"'=> $data['"+i.lower()+"'], "

print blop

print(" ")
print(" ")

ls_site = ["id","nbPhInd","nbPhSit","nomSitHist","nomSitUsa","nbrChem","batiIndus","archiSite","etatSite","ajoutCont","usHist","usActu","reconv","occup","typeProSi","infoHist","ptcSite","amSiteA","amSiteA_D","amSiteV","amSiteV_D","valSite","valSiteD","rayon_m"]
blap = ""

for i in ls_site :
      blap=blap + "'"+i.lower()+"'=> $data['"+i.lower()+"'], "

print blap
