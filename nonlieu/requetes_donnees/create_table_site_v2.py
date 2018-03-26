# -*- coding: utf-8  -*-

#-------------------------------------------------------------------------------
# Name:        create_table_site
# Purpose:      générer la table des sites à partir de la table des cheminées : les requêtes pourront être récupérées pour être exécutées en PHP
# Version:    Avec les bons attributs
#
# Author:      Sarah
#
# Created:     01/03/2018
# Copyright:   (c) Sarah 2018
# Licence:     <your licence>
#-------------------------------------------------------------------------------

##----------------------- Paramètre globaux
##---- Définis
srid=4326
##---- Implémentés
ls_site = []

##----------------------- Modules
import psycopg2


##----------------------- Connexion à la base
con = psycopg2.connect(database='postgis_24_sample', user='postgres', password="postgres", port="5433")
cur = con.cursor()

##----------------------- Création des tables
##---- Données ponctuelles
cur.execute("DROP TABLE IF EXISTS sites")

cur.execute('''
    CREATE TABLE sites (
        id TEXT,
        nbPhInd INTEGER,
        nbPhSit INTEGER,
        nomSitHist TEXT,
        nomSitUsa TEXT,
        nbrChem INTEGER,
        batiIndus BOOLEAN,
        archiSite TEXT,
        etatSite TEXT,
        ajoutCont TEXT,
        usHist TEXT,
        usActu TEXT,
        reconv TEXT,
        occup TEXT,
        typePropr TEXT,
        infoHist TEXT,
        ptcSite	TEXT,
        amSiteA BOOLEAN,
        amSiteA_D TEXT,
        amSiteV BOOLEAN,
        amSiteV_D TEXT,
        valSite BOOLEAN,
        valSiteD TEXT,
        rayon_m FLOAT
        )
''')

cur.execute('''
    SELECT AddGeometryColumn('sites', 'geom',  %(srid)s, 'POINT', 2);
''',{'srid':srid})

##---- Données zonales
cur.execute("DROP TABLE IF EXISTS sites_zone")

cur.execute('''
    CREATE TABLE sites_zone (
        id TEXT,
        nbPhInd INTEGER,
        nbPhSit INTEGER,
        nomSitHist TEXT,
        nomSitUsa TEXT,
        nbrChem INTEGER,
        batiIndus BOOLEAN,
        archiSite TEXT,
        etatSite TEXT,
        ajoutCont TEXT,
        usHist TEXT,
        usActu TEXT,
        reconv TEXT,
        occup TEXT,
        typePropr TEXT,
        infoHist TEXT,
        ptcSite	TEXT,
        amSiteA BOOLEAN,
        amSiteA_D TEXT,
        amSiteV BOOLEAN,
        amSiteV_D TEXT,
        valSite BOOLEAN,
        valSiteD TEXT,
        rayon_m FLOAT
        )
''')

cur.execute('''
    SELECT AddGeometryColumn('sites_zone', 'geom',  %(srid)s, 'POLYGON', 2);
''',{'srid':srid})

##----------------------- Liste des entités ciblées
cur.execute('''
    select distinct substring(Id,0,12) from cheminee
''')
for i in cur.fetchall() :
    ls_site.append(i[0])

##----------------------- Valeurs par site
for site in ls_site :
    ##---- Variables des attributs
    ##Attributaires
    id=""
    nbPhInd=0
    nbPhSit=0
    nomSitHist=""
    nomSitUsa=""
    nbrChem=0
    batiIndus=False
    archiSite=""
    etatSite=""
    ls_etatSite=[]
    ajoutCont=""
    usHist=""
    usActu=""
    reconv=""
    occup=""
    typePropr=""
    infoHist=""
    ptcSite=""
    amSiteA=False
    amSiteA_D=""
    amSiteV=False
    amSiteV_D=""
    valSite=False
    valSiteD=""

    ##Géométriques
    rayon=0
    rayon_m=0
    geomX=0
    lsX=[]
    nbX=0
    geomY=0
    lsY=[]
    nbY=0
    distances=[]
    distances_m=[]

    ##---- Récupération des valeurs des attributs
    cur.execute('''
        select id, nbPhInd, nbPhSit, nomSitHist, nomSitUsa, batiIndus, archiSite, etatSite, ajoutCont, usHist, usActu, reconv, occup, typePropr, infoHist, ptcSite, amSiteA, amSiteA_D, amSiteV, amSiteV_D, valSite, valSiteD, st_astext(geom) from cheminee where Id LIKE %(site)s
    ''',{'site':site+'%'})

    infos = cur.fetchall()

    ##---- Récapitulatif des attributs de chaque cheminées par site
    for j in infos:
        ##---- Récupération des propriétés de chaque cheminées
        id=site
        nbPhInd=nbPhInd+j[1]
        nbPhSit=j[2]
        nomSitHist=j[3]
        nomSitUsa=j[4]
        nbrChem=nbrChem+1
        if j[5] == True :
            batiIndus = True

        archiSite=archiSite+"_"+j[6]

        if j[7]=="Bon":
            ls_etatSite.append(2)
        elif j[7]=="Moyen":
            ls_etatSite.append(1)
        elif j[7]=="Mauvais":
            ls_etatSite.append(0)

        if j[8] not in ajoutCont :
            ajoutCont = ajoutCont+"_"+j[8]
        if j[9] not in usHist :
            usHist=usHist+"_"+j[9]
        if j[10] not in usHist :
            usActu=usActu+"_"+j[10]

        if j[11] =="Reconverti" :
            reconv=j[11]
        elif reconv=="Non reconverti" and j[11]=="En reconversion" :
            reconv = j[11]
        elif reconv=="" and j[11]=="Non reconverti" :
            reconv = j[11]

        if j[12] =="Majoritairement" :
            occup=j[12]
        elif occup=="Pas du tout" and j[12]=="Partiellement" :
            occup = j[12]
        elif occup=="" and j[12]=="Pas du tout" :
            occup = j[12]

        if j[13] not in typePropr :
            typePropr=typePropr+"_"+j[13]

        if j[14] not in infoHist :
            infoHist=infoHist+"_"+j[14]

        if j[15] not in ptcSite :
            ptcSite=ptcSite+"_"+j[15]

        if j[16] == True :
            amSiteA = True
        if j[17] and j[17] not in amSiteA_D :
            amSiteA_D=amSiteA_D+"_"+j[17]

        if j[18] == True :
            amSiteV = True
        if j[19] and j[19] not in amSiteV_D :
            amSiteV_D=amSiteV_D+"_"+j[19]

        if j[20] == True :
            valSite = True
        if j[21] and j[21] not in valSiteD :
            valSiteD=valSiteD+"_"+j[21]

        ##---- Récupération des attributs géométriques de chaque cheminées
        g = j[22].split("(")[1].split(")")[0].split(" ")
        geomX+=float(g[0])
        lsX.append(float(g[0]))
        nbX+=1
        geomY+=float(g[1])
        lsY.append(float(g[1]))
        nbY+=1

    ##---- Cacul des propriétés
    if len(ls_etatSite) == 0:
        etatSite = ""
    else :
        cal = int(round(sum(ls_etatSite)/len(ls_etatSite)))
        if cal == 0:
            etatSite = "Mauvais"
        elif cal ==1 :
            etatSite = "Moyen"
        elif cal==2:
            etatSite = "Bon"
        else :
            etatSite = "Erreur"

    ##---- Calcul des attributs géométriques
    ##Point
    newpoint="POINT("+str(geomX/nbX)+" "+str(geomY/nbY)+")"

    ##Rayon
    #    rayon=max([(max(lsX)-min(lsX))/2,(max(lsY)-min(lsY))/2])
    for r in range(len(lsX)) :
        compare = "POINT("+str(lsX[r])+" "+str(lsY[r])+")"
        cur.execute('''
select st_distance(st_geomfromtext(%(newpoint)s,%(srid)s),st_geomfromtext(%(compare)s,%(srid)s))
        ''',{'newpoint':newpoint,'compare':compare,'srid':srid})
        distances.append(cur.fetchone()[0])

        cur.execute('''
select st_distance(ST_Transform(st_geomfromtext(%(newpoint)s,%(srid)s),26986),ST_Transform(st_geomfromtext(%(compare)s,%(srid)s),26986))
        ''',{'newpoint':newpoint,'compare':compare,'srid':srid})
        distances_m.append(cur.fetchone()[0])
    rayon=max(distances)+0.0002
    rayon_m=max(distances_m)+20

    print "c"
    print amSiteA
    print "c"
    ##---- Ecriture dans les nouvelles tables
    ##Ponctuelle
    cur.execute('''
INSERT INTO sites (id, nbPhInd, nbPhSit, nomSitHist, nomSitUsa, nbrChem, batiIndus, archiSite, etatSite, ajoutCont, usHist, usActu, reconv, occup, typePropr, infoHist, ptcSite, amSiteA, amSiteA_D, amSiteV, amSiteV_D, valSite, valSiteD,rayon_m,geom) VALUES (%(id)s,%(nbPhInd)s,%(nbPhSit)s,%(nomSitHist)s,%(nomSitUsa)s,%(nbrChem)s,%(batiIndus)s,%(archiSite)s,%(etatSite)s,%(ajoutCont)s,%(usHist)s,%(usActu)s,%(reconv)s,%(occup)s,%(typePropr)s,%(infoHist)s,%(ptcSite)s,%(amSiteA)s,%(amSiteA_D)s,%(amSiteV)s,%(amSiteV_D)s,%(valSite)s,%(valSiteD)s,%(rayon_m)s,ST_GeomFromText(%(geo)s, %(srid)s))
    ''',{'id':id, 'nbPhInd':nbPhInd, 'nbPhSit':nbPhSit, 'nomSitHist':nomSitHist, 'nomSitUsa':nomSitUsa, 'nbrChem':nbrChem, 'batiIndus':batiIndus, 'archiSite':archiSite, 'etatSite':etatSite, 'ajoutCont':ajoutCont, 'usHist':usHist, 'usActu':usActu, 'reconv':reconv, 'occup':occup, 'typePropr':typePropr, 'infoHist':infoHist, 'ptcSite':ptcSite, 'amSiteA':amSiteA, 'amSiteA_D':amSiteA_D, 'amSiteV':amSiteV, 'amSiteV_D':amSiteV_D, 'valSite':valSite, 'valSiteD':valSiteD,'rayon_m':rayon_m,'geo':newpoint,'srid':srid})

    ##Zonale
    cur.execute('''
INSERT INTO sites_zone (id, nbPhInd, nbPhSit, nomSitHist, nomSitUsa, nbrChem, batiIndus, archiSite, etatSite, ajoutCont, usHist, usActu, reconv, occup, typePropr, infoHist, ptcSite, amSiteA, amSiteA_D, amSiteV, amSiteV_D, valSite, valSiteD,rayon_m,geom) VALUES (%(id)s,%(nbPhInd)s,%(nbPhSit)s,%(nomSitHist)s,%(nomSitUsa)s,%(nbrChem)s,%(batiIndus)s,%(archiSite)s,%(etatSite)s,%(ajoutCont)s,%(usHist)s,%(usActu)s,%(reconv)s,%(occup)s,%(typePropr)s,%(infoHist)s,%(ptcSite)s,%(amSiteA)s,%(amSiteA_D)s,%(amSiteV)s,%(amSiteV_D)s,%(valSite)s,%(valSiteD)s,%(rayon_m)s,st_buffer(ST_GeomFromText(%(geo)s, %(srid)s),%(rayon)s))
    ''',{'id':id, 'nbPhInd':nbPhInd, 'nbPhSit':nbPhSit, 'nomSitHist':nomSitHist, 'nomSitUsa':nomSitUsa, 'nbrChem':nbrChem, 'batiIndus':batiIndus, 'archiSite':archiSite, 'etatSite':etatSite, 'ajoutCont':ajoutCont, 'usHist':usHist, 'usActu':usActu, 'reconv':reconv, 'occup':occup, 'typePropr':typePropr, 'infoHist':infoHist, 'ptcSite':ptcSite, 'amSiteA':amSiteA, 'amSiteA_D':amSiteA_D, 'amSiteV':amSiteV, 'amSiteV_D':amSiteV_D, 'valSite':valSite, 'valSiteD':valSiteD,'rayon':rayon,'rayon_m':rayon_m,'geo':newpoint,'srid':srid})

    ##Multilineaire
##    cur.execute('''
##INSERT INTO sites_zone (idd,nom,nb_chem,photo_site,photo_ind,rayon,geom) VALUES (%(idd)s,%(nom)s,%(nb_chem)s,%(photo_site)s,%(photo_ind)s,%(rayon_m)s,st_buffer(ST_GeomFromText(%(geo)s, %(srid)s),%(rayon)s))
##    ''',{'idd':idd,'nom': nom,'nb_chem':nb_chem,'photo_site':photo_site,'photo_ind':photo_ind,'rayon':rayon,'rayon_m':rayon_m,'geo':newpoint,'srid':srid})


con.commit()
con.close()