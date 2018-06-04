# coding: utf-8

#-------------------------------------------------------------------------------
# Name:        module1
# Purpose:
#
# Author:      Sarah
#
# Created:     23/05/2018
# Copyright:   (c) Sarah 2018
# Licence:     <your licence>
#-------------------------------------------------------------------------------

##----------------------- Modules
import psycopg2

##----------------------- Connexion à la base
con = psycopg2.connect(database='postgis_24_sample', user='postgres', password="postgres", port="5433")
cur = con.cursor()

def ajustColumn(param) :
    print param;
    if param == "archiSite" :
        request = "ALTER TABLE cheminee2 ALTER COLUMN "+param+" TYPE VARCHAR(20000)"
    else :
        request = "ALTER TABLE cheminee2 ALTER COLUMN "+param+" TYPE VARCHAR(1200)"
    cur.execute(request)

ls_vals_maj=["nomSitHist","nomSitUsa","archiSite","etatSite","ajoutCont","usHist","usActu","reconv","occup","typeProSi","infoHist","ptcSite","typeProSi","amSiteA","amSiteV","valSite"]

for val in ls_vals_maj :
    ajustColumn(val)


con.commit()
con.close()

