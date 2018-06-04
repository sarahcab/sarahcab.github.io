# -*- coding: utf-8  -*-

#-------------------------------------------------------------------------------
# Name:        create_table_site
# Purpose:      générer la table des sites à partir de la table des cheminées : les requêtes pourront être récupérées pour être exécutées en PHP
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
        id SERIAL,
        idd TEXT,
        nom TEXT,
        nb_chem INTEGER,
        photo_site TEXT,
        photo_ind TEXT,
        rayon FLOAT
        )
''')

cur.execute('''
    SELECT AddGeometryColumn('sites', 'geom',  %(srid)s, 'POINT', 2);
''',{'srid':srid})

##---- Données zonales
cur.execute("DROP TABLE IF EXISTS sites_zone")

cur.execute('''
    CREATE TABLE sites_zone (
        id SERIAL,
        idd TEXT,
        nom TEXT,
        nb_chem INTEGER,
        photo_site TEXT,
        photo_ind TEXT,
        rayon FLOAT
        )
''')

cur.execute('''
    SELECT AddGeometryColumn('sites_zone', 'geom',  %(srid)s, 'POLYGON', 2);
''',{'srid':srid})

##----------------------- Liste des entités ciblées
cur.execute('''
    select distinct nom_site from cheminees
''')
for i in cur.fetchall() :
    ls_site.append(i[0])


##----------------------- Valeurs par site
for site in ls_site :
    ##---- Variables des attributs
    idd=""
    nom=""
    nb_chem=0
    photo_site=0
    photo_ind=0
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
        select id,nom_site,photo_site,photo_ind,st_astext(geom) from cheminees where nom_site=%(site)s
    ''',{'site':site})
    infos = cur.fetchall()

    ##---- Récapitualif des attributs de chaque cheminées par site
    for j in infos:
        idd=j[0].split("_")[0]
        nom=j[1]
        nb_chem+=1
        photo_site=j[2]
        photo_ind=photo_ind+j[3]
        g = j[4].split("(")[1].split(")")[0].split(" ")
        geomX+=float(g[0])
        lsX.append(float(g[0]))
        nbX+=1
        geomY+=float(g[1])
        lsY.append(float(g[1]))
        nbY+=1

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
INSERT INTO sites (idd,nom,nb_chem,photo_site,photo_ind,rayon,geom) VALUES (%(idd)s,%(nom)s,%(nb_chem)s,%(photo_site)s,%(photo_ind)s,%(rayon_m)s,ST_GeomFromText(%(geo)s, %(srid)s))
    ''',{'idd':idd,'nom': nom,'nb_chem':nb_chem,'photo_site':photo_site,'photo_ind':photo_ind,'rayon_m':rayon_m,'geo':newpoint,'srid':srid})

    ##Zonale
    cur.execute('''
INSERT INTO sites_zone (idd,nom,nb_chem,photo_site,photo_ind,rayon,geom) VALUES (%(idd)s,%(nom)s,%(nb_chem)s,%(photo_site)s,%(photo_ind)s,%(rayon_m)s,st_buffer(ST_GeomFromText(%(geo)s, %(srid)s),%(rayon)s))
    ''',{'idd':idd,'nom': nom,'nb_chem':nb_chem,'photo_site':photo_site,'photo_ind':photo_ind,'rayon':rayon,'rayon_m':rayon_m,'geo':newpoint,'srid':srid})

    ##Multilineaire
##    cur.execute('''
##INSERT INTO sites_zone (idd,nom,nb_chem,photo_site,photo_ind,rayon,geom) VALUES (%(idd)s,%(nom)s,%(nb_chem)s,%(photo_site)s,%(photo_ind)s,%(rayon_m)s,st_buffer(ST_GeomFromText(%(geo)s, %(srid)s),%(rayon)s))
##    ''',{'idd':idd,'nom': nom,'nb_chem':nb_chem,'photo_site':photo_site,'photo_ind':photo_ind,'rayon':rayon,'rayon_m':rayon_m,'geo':newpoint,'srid':srid})


con.commit()
con.close()