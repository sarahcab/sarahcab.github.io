# -*- coding: utf-8  -*-

#-------------------------------------------------------------------------------
# Name:        create_table_site
# Purpose:      générer la table des sites à partir de la table des cheminées : les requêtes pourront être récupérées pour être exécutées en PHP
# Version:    Avec les polyline
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
        typeProSi TEXT,
        infoHist TEXT,
        ptcSite	TEXT,
        amSiteA TEXT,
        amSiteV TEXT,
        valSite TEXT,
        rayon_m FLOAT
        )
''')

cur.execute('''
    SELECT AddGeometryColumn('sites', 'geom',  %(srid)s, 'POINT', 2);
''',{'srid':srid})

##---- Données zonales
##cur.execute("DROP TABLE IF EXISTS sites_zone")
##
##cur.execute('''
##    CREATE TABLE sites_zone (
##        id TEXT,
##        nbPhInd INTEGER,
##        nbPhSit INTEGER,
##        nomSitHist TEXT,
##        nomSitUsa TEXT,
##        nbrChem INTEGER,
##        batiIndus BOOLEAN,
##        archiSite TEXT,
##        etatSite TEXT,
##        ajoutCont TEXT,
##        usHist TEXT,
##        usActu TEXT,
##        reconv TEXT,
##        occup TEXT,
##        typeProSi TEXT,
##        infoHist TEXT,
##        ptcSite	TEXT,
##        amSiteA BOOLEAN,
##        amSiteA_D TEXT,
##        amSiteV BOOLEAN,
##        amSiteV_D TEXT,
##        valSite BOOLEAN,
##        valSiteD TEXT,
##        rayon_m FLOAT
##        )
##''')
##
##cur.execute('''
##    SELECT AddGeometryColumn('sites_zone', 'geom',  %(srid)s, 'POLYGON', 2);
##''',{'srid':srid})

##----------------------- Liste des entités ciblées
cur.execute('''
    select distinct substring(Id,0,19) from cheminee2
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
    typeProSi=""
    infoHist=""
    ptcSite=""
    amSiteA=""
    amSiteV=""
    valSite=""

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

    ##---- Récupération des valeurs des attributs    ##faudrait virer les booleen de transformation mais àa décale tout
    cur.execute('''
        select id, nbPhInd, nbPhSit, nomSitHist, nomSitUsa, batiIndus, archiSite, etatSite, ajoutCont, usHist, usActu, reconv, occup, typeProSi, infoHist, ptcSite, amSiteA, amSiteV, valSite, st_astext(geom) from cheminee2 where Id LIKE %(site)s
    ''',{'site':site+'%'})

    infos = cur.fetchall()
##    print infos
    ##---- Récapitulatif des attributs de chaque cheminées par site
    for j in infos:
        ##---- Récupération des propriétés de chaque cheminées
        id=site
        nbPhInd=0
        nbPhSit=0
        nomSitHist=j[3]
        nomSitUsa=j[4]
        nbrChem=nbrChem+1

        if j[5] == "true":
            batiIndus = True

        if j[6] and j[6] not in archiSite :
            if archiSite=="" :
                archiSite=j[6]
            else :
                archiSite=archiSite+"_"+j[6]

        if j[7]=="Bon":
            ls_etatSite.append(2)
        elif j[7]=="Moyen":
            ls_etatSite.append(1)
        elif j[7]=="Mauvais":
            ls_etatSite.append(0)

        if j[8] and j[8] not in ajoutCont :
            if ajoutCont=="" :
                ajoutCont =j[8]
            else :
                ajoutCont = ajoutCont+"_"+j[8]

        if j[9] and j[9] not in usHist :
            if usHist=="":
                usHist=j[9]
            else :
                usHist=usHist+"_"+j[9]

        if j[10] and j[10] not in usActu :
            if usActu=="":
                usActu=j[10]
            else :
                usActu=usActu+"_"+j[10]

##        print("------------")
##        print j[11]
##        print reconv
##        print("------")


##------------------------A VOIR AVEC EUX SI ON PRIORISE RECONVERTIT OU PAS      , IDEM POUR MAORITAIRMENET

##        if j[11] =="Reconverti" :
##            reconv=j[11]
##        elif reconv=="Non reconverti" and j[11]=="En reconversion" :
##            reconv = j[11]
##        elif reconv=="" and j[11]=="Non reconverti" :
##            reconv = j[11]

##        if j[12] =="Majoritairement" :
##            occup=j[12]
##        elif occup=="Pas du tout" and j[12]=="Partiellement" :
##            occup = j[12]
##        elif occup=="" and j[12]=="Pas du tout" :
##            occup = j[12]

        if j[11]:
            reconv = j[11]

        if j[12]:
            occup = j[12]

        if j[13]:
            typeProSi = j[13]

        if j[14] and j[14] not in infoHist :
            if  infoHist=="":
                infoHist = j[14]
            else :
                infoHist=infoHist+"_"+j[14]

        if j[15] and j[15] not in ptcSite :
            if ptcSite == "":
                ptcSite = j[15]
            else :
                ptcSite=ptcSite+"_"+j[15]

        if j[16] and j[16] not in amSiteA :
            if amSiteA == "":
                amSiteA = j[16]
            else :
                amSiteA=amSiteA+"_"+j[16]

        if j[17] and j[17] not in amSiteV :
            if amSiteV == "":
                amSiteV = j[17]
            else :
                amSiteV=amSiteV+"_"+j[17]

        if j[18] and j[18] not in valSite :
            if valSite == "":
                valSite = j[18]
            else :
                valSite=valSite+"_"+j[18]

        ##---- Récupération des attributs géométriques de chaque cheminées
##        print j[19]

        g = j[19].split("(")[1].split(")")[0].split(" ")
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

    ##---- Ecriture dans les nouvelles tables
    ##Ponctuelle
    cur.execute('''
INSERT INTO sites (id, nbPhInd, nbPhSit, nomSitHist, nomSitUsa, nbrChem, batiIndus, archiSite, etatSite, ajoutCont, usHist, usActu, reconv, occup, typeProSi, infoHist, ptcSite, amSiteA,  amSiteV, valSite, rayon_m,geom) VALUES (%(id)s,%(nbPhInd)s,%(nbPhSit)s,%(nomSitHist)s,%(nomSitUsa)s,%(nbrChem)s,%(batiIndus)s,%(archiSite)s,%(etatSite)s,%(ajoutCont)s,%(usHist)s,%(usActu)s,%(reconv)s,%(occup)s,%(typePropr)s,%(infoHist)s,%(ptcSite)s,%(amSiteA)s,%(amSiteV)s,%(valSite)s,%(rayon_m)s,ST_GeomFromText(%(geo)s, %(srid)s))
    ''',{'id':id, 'nbPhInd':nbPhInd, 'nbPhSit':nbPhSit, 'nomSitHist':nomSitHist, 'nomSitUsa':nomSitUsa, 'nbrChem':nbrChem, 'batiIndus':batiIndus, 'archiSite':archiSite, 'etatSite':etatSite, 'ajoutCont':ajoutCont, 'usHist':usHist, 'usActu':usActu, 'reconv':reconv, 'occup':occup, 'typePropr':typeProSi, 'infoHist':infoHist, 'ptcSite':ptcSite, 'amSiteA':amSiteA, 'amSiteV':amSiteV, 'valSite':valSite, 'rayon_m':rayon_m,'geo':newpoint,'srid':srid})

    part_id = id+"%"

##    print  'nomSitHist '+str(len(nomSitHist))
##    print  'nomSitUsa '+str(len(nomSitUsa))
##    print  'archiSite '+str(len(archiSite))
##    print  'etatSite '+str(len(etatSite))
##    print  'ajoutCont '+str(len(ajoutCont))
##    print  'usHist '+str(len(usHist))
##    print  'usActu '+str(len(usActu))
##    print  'reconv '+str(len(reconv))
##    print  'occup '+str(len(occup))
##    print  'typeProSi '+str(len(typeProSi))
##    print  'infoHist '+str(len(infoHist))
##    print  'ptcSite '+str(len(ptcSite))
##    print  'typeProSi '+str(len(typeProSi))
##    print  'amSiteA_D '+str(len(amSiteA))
##    print  'amSiteV_D '+str(len(amSiteV))
##    print  'valSiteD '+str(len(valSite))

    ##Mise à jour de la table
    cur.execute('''
UPDATE cheminee2
SET nbPhSit = %(nbPhSit)s, nomSitHist = %(nomSitHist)s, nomSitUsa = %(nomSitUsa)s, batiIndus = %(batiIndus)s, archiSite = %(archiSite)s, etatSite = %(etatSite)s, ajoutCont = %(ajoutCont)s, usHist = %(usHist)s, usActu = %(usActu)s, reconv = %(reconv)s, occup = %(occup)s, typeProSi = %(typeProSi)s, infoHist = %(infoHist)s, ptcSite = %(ptcSite)s, amSiteA = %(amSiteA)s, amSiteV = %(amSiteV)s, valSite = %(valSite)s
WHERE id like %(part_id)s
    ''',{'part_id':part_id,'nbPhSit':nbPhSit, 'nomSitHist':nomSitHist, 'nomSitUsa':nomSitUsa, 'batiIndus':batiIndus, 'archiSite':archiSite, 'etatSite':etatSite, 'ajoutCont':ajoutCont, 'usHist':usHist, 'usActu':usActu, 'reconv':reconv, 'occup':occup, 'typeProSi':typeProSi, 'infoHist':infoHist, 'ptcSite':ptcSite, 'amSiteA':amSiteA, 'amSiteV':amSiteV,'valSite':valSite})



    ##Zonale
##    cur.execute('''
##INSERT INTO sites_zone (id, nbPhInd, nbPhSit, nomSitHist, nomSitUsa, nbrChem, batiIndus, archiSite, etatSite, ajoutCont, usHist, usActu, reconv, occup, typeProSi, infoHist, ptcSite, amSiteA, amSiteA_D, amSiteV, amSiteV_D, valSite, valSiteD,rayon_m,geom) VALUES (%(id)s,%(nbPhInd)s,%(nbPhSit)s,%(nomSitHist)s,%(nomSitUsa)s,%(nbrChem)s,%(batiIndus)s,%(archiSite)s,%(etatSite)s,%(ajoutCont)s,%(usHist)s,%(usActu)s,%(reconv)s,%(occup)s,%(typePropr)s,%(infoHist)s,%(ptcSite)s,%(amSiteA)s,%(amSiteA_D)s,%(amSiteV)s,%(amSiteV_D)s,%(valSite)s,%(valSiteD)s,%(rayon_m)s,st_buffer(ST_GeomFromText(%(geo)s, %(srid)s),%(rayon)s))
##    ''',{'id':id, 'nbPhInd':nbPhInd, 'nbPhSit':nbPhSit, 'nomSitHist':nomSitHist, 'nomSitUsa':nomSitUsa, 'nbrChem':nbrChem, 'batiIndus':batiIndus, 'archiSite':archiSite, 'etatSite':etatSite, 'ajoutCont':ajoutCont, 'usHist':usHist, 'usActu':usActu, 'reconv':reconv, 'occup':occup, 'typePropr':typeProSi, 'infoHist':infoHist, 'ptcSite':ptcSite, 'amSiteA':amSiteA, 'amSiteA_D':amSiteA_D, 'amSiteV':amSiteV, 'amSiteV_D':amSiteV_D, 'valSite':valSite, 'valSiteD':valSiteD,'rayon':rayon,'rayon_m':rayon_m,'geo':newpoint,'srid':srid})

    ##Multilineaire
##    cur.execute('''
##INSERT INTO sites_zone (idd,nom,nb_chem,photo_site,photo_ind,rayon,geom) VALUES (%(idd)s,%(nom)s,%(nb_chem)s,%(photo_site)s,%(photo_ind)s,%(rayon_m)s,st_buffer(ST_GeomFromText(%(geo)s, %(srid)s),%(rayon)s))
##    ''',{'idd':idd,'nom': nom,'nb_chem':nb_chem,'photo_site':photo_site,'photo_ind':photo_ind,'rayon':rayon,'rayon_m':rayon_m,'geo':newpoint,'srid':srid})

##----------------------- TEST
file_csv=r"C:\wamp\www\cartononlieu\python\tst.txt"
f=open(file_csv, "w")

f.write("ggg")
for l in ls_site :
    f.write("\n"+l)

f.write("\n sarah")
for l in ls_etatSite :
    f.write("\n"+l)

f.close()

con.commit()
con.close()