# -*- coding: utf-8  -*-

#-------------------------------------------------------------------------------
# Name:        create_table_site
# Purpose:      générer la table nuts
# Version:    Avec les polyline
#
# Author:      Sarah
#
# Created:     01/06/2018
# Copyright:   (c) Sarah 2018
# Licence:     <your licence>
#-------------------------------------------------------------------------------

##----------------------- Paramètre globaux
##---- Définis
srid=4326

##---- Implémentés
ls_nuts= []

##----------------------- Modules
import psycopg2


##----------------------- Connexion à la base
con = psycopg2.connect(database='postgis_24_sample', user='postgres', password="postgres", port="5433")
cur = con.cursor()

##Au cas ou :
cur.execute('''
    alter table cheminee2 add column if not exists nuts TEXT
''')

##----------------------- Création des tables
cur.execute("DROP TABLE IF EXISTS nuts")

cur.execute('''
    CREATE TABLE nuts (
        nuts_id TEXT,
        name TEXT,
        nbr_chem INTEGER,
        nbr_site INTEGER,
        x TEXT,
        y TEXT)
''')

cur.execute('''
    SELECT AddGeometryColumn('nuts', 'geom',  %(srid)s, 'MULTIPOLYGON', 2);
''',{'srid':srid})

##----------------------- Liste des communes
cur.execute('''
    select distinct(nuts_id,nuts_name,st_astext(st_centroid(nuts_eurostat.geom))) from nuts_eurostat,cheminee2 where st_intersects(nuts_eurostat.geom,cheminee2.geom)
''')

for i in cur.fetchall() :
    print i
    ls_nuts.append([(i[0].split(",")[0].split("(")[1]),(i[0].split(",")[1]),(i[0].split(",")[2].split('"')[1].split(")")[0])+")"])

print ls_nuts
##----------------------- Valeurs par site
for nuts_infos in ls_nuts :
    nuts=nuts_infos[0]
    name=nuts_infos[1]
    centre=nuts_infos[2]
    ls_chem=[]
    ls_site=[]
    ##---- Variables des attributs
    ##Attributaires
    id=""
    nbrChem=0
    nbrSit=0

    ##Géométriques
    geomX=0
    geomY=0

    #---------------------ATTRIBUTS DES ELEMENTS CHEMINEES ET SITES
    cur.execute('''
select cheminee2.id from cheminee2,nuts_eurostat
where st_intersects(nuts_eurostat.geom,cheminee2.geom)
and nuts_eurostat.nuts_id LIKE %(nuts_id)s
    ''',{'nuts_id':nuts})
    infos = cur.fetchall()


    for chem in infos :
        ls_chem.append(chem[0])

    cur.execute('''
select  distinct(substring(cheminee2.id,0,19)) from cheminee2,nuts_eurostat
where st_intersects(nuts_eurostat.geom,cheminee2.geom)
and nuts_eurostat.nuts_id LIKE %(nuts_id)s
    ''',{'nuts_id':nuts})
    infos = cur.fetchall()


    for site in infos :
        ls_site.append(site[0])

    nbr_chem = len(ls_chem)
    nbr_site = len(ls_site)


    #---------------------ATTRIBUTS GEOMETRIQUES
    cur.execute('''
SELECT st_astext(geom) from nuts_eurostat where nuts_id like %(nuts_id)s
    ''',{'nuts_id':nuts})

    polygon = cur.fetchone();

    X=centre.split("(")[1].split(")")[0].split(" ")[0]
    Y=centre.split("(")[1].split(")")[0].split(" ")[1]
    print X+"    "+Y

    cur.execute('''
INSERT INTO nuts (nuts_id,nbr_chem,nbr_site,name,x,y,geom) VALUES (%(nuts_id)s,%(nbrChem)s,%(nbrSit)s,%(name)s,%(x)s,%(y)s,ST_GeomFromText(%(geo)s, %(srid)s))
    ''',{'nuts_id':nuts, 'nbrChem':nbr_chem, 'nbrSit':nbr_site,'name':name,'x':X,'y':Y,'geo':polygon,'srid':srid})


con.commit()
con.close()