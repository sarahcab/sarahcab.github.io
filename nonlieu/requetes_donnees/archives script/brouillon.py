# -*- coding: utf-8  -*-

#-------------------------------------------------------------------------------
# Name:        module1
# Purpose:
#
# Author:      Sarah
#
# Created:     08/03/2018
# Copyright:   (c) Sarah 2018
# Licence:     <your licence>
#-------------------------------------------------------------------------------

lsData = ["id","nbPhInd","nbPhSit","nomSitHist","nomSitUsa","nbrChem","batiIndus","archiSite","etatSite","ajoutCont","usHist","usActu","reconv","occup","typePropr","infoHist","ptcSite","amSiteA","amSiteA_D","amSiteV","amSiteV_D","valSite","valSiteD"]
##for i in lsData:
##    print i+ '=""'
lsChemineurs=["nomPerso","prenom","nomStru","objet","territoire","cheminees","actions","agenda","envieProp","mail","tel","adresse","codePost","commune","site"]
lsCheminees =["id","adresse","commune","region","pays","nbPhInd","nbPhSit","nomChem","nomSitHist","nomSitUsa","nbrChem","batiIndus","archiSite","etatSite","etatChem","ajoutCont","visAppre","visComm","hauteurPr","hauteurEs","archiChem","materChem","usHist","usActu","reconv","occup","typePropr","infoHist","ptcSite","ptcChem","amSiteA","amSiteA_D","amChemA","amChemA_D","amSiteV","amSiteV_D","amChemV","amChemV_D","valSite","valSiteD","valChem","valChemD"]
total=""
it=0

for j in lsChemineurs:
    total=total+"'"+j+"':lsvals["+str(it)+"],"
    it += 1

##for j in lsData :
##    total=total+"'"+j+"':"+j+","
##
##for j in lsData :
##    total=total+",%("+j+")s"

print total

##---- Définis
##srid=4326
##---- Implémentés
##ls_site = []
##site="C_59512_001"

##----------------------- Modules
##import psycopg2


##----------------------- Connexion à la base
##con = psycopg2.connect(database='postgis_24_sample', user='postgres', password="postgres", port="5433")
##cur = con.cursor()
##
##cur.execute('''
##        select id, nbPhInd, nbPhSit, nomSitHist, nomSitUsa, batiIndus, archiSite, etatSite, ajoutCont, usHist, usActu, reconv, occup, typePropr, infoHist, ptcSite, amSiteA, amSiteA_D, amSiteV, amSiteV_D, valSite, valSiteD, st_astext(geom) from cheminee where Id LIKE %(site)s
##    ''',{'site':site+'%'})
##
##print(cur.fetchall())
##con.commit()
##con.close()