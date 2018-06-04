# -*- coding: utf-8  -*-

#-------------------------------------------------------------------------------
# Name:        create_table_site
# Purpose:      générer la table des communes et l'identifiant de la couche cheminee + départemments
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
ls_comm = []


##----------------------- Modules
import psycopg2


##----------------------- Connexion à la base
con = psycopg2.connect(database='postgis_24_sample', user='postgres', password="postgres", port="5433")
cur = con.cursor()

##----------------------- Création des tables
cur.execute("DROP TABLE IF EXISTS communes")

cur.execute('''
    CREATE TABLE communes (
        id_comm TEXT,
        nbr_chem INTEGER,
        nbr_site INTEGER,
        name TEXT,
        x TEXT,
        y TEXT,
        dept TEXT)
''')

cur.execute('''
    SELECT AddGeometryColumn('communes', 'geom',  %(srid)s, 'MULTIPOLYGON', 2);
''',{'srid':srid})


####----------------------- Vérif couche communes
##cur.execute('''
##SELECT UpdateGeometrySRID('communes_eurostat','geom', %(srid)s);
##''',{'srid':srid})

##----------------------- Liste des communes
cur.execute('''
    select distinct(comm_id,comm_name,st_astext(st_centroid(communes_eurostat.geom))) from communes_eurostat,cheminee2 where st_intersects(communes_eurostat.geom,cheminee2.geom)
''')

for i in cur.fetchall() :
    print i
    ls_comm.append([(i[0].split(",")[0].split("(")[1]),(i[0].split(",")[1]),(i[0].split(",")[2].split('"')[1].split(")")[0])+")"])

print ls_comm
##----------------------- Valeurs par site
for comm_infos in ls_comm :
    comm=comm_infos[0]
    name=comm_infos[1]
    centre=comm_infos[2]
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
select cheminee2.id from cheminee2,communes_eurostat
where st_intersects(communes_eurostat.geom,cheminee2.geom)
and communes_eurostat.comm_id LIKE %(comm_id)s
    ''',{'comm_id':comm})
    infos = cur.fetchall()


    for chem in infos :
        ls_chem.append(chem[0])

    cur.execute('''
select  distinct(substring(cheminee2.id,0,19)) from cheminee2,communes_eurostat
where st_intersects(communes_eurostat.geom,cheminee2.geom)
and communes_eurostat.comm_id LIKE %(comm_id)s
    ''',{'comm_id':comm})
    infos = cur.fetchall()


    for site in infos :
        ls_site.append(site[0])

    nbr_chem = len(ls_chem)
    nbr_site = len(ls_site)


    #---------------------ATTRIBUTS NUTS
    temoin = ls_chem[0]
    cur.execute('''
select nuts_eurostat.nuts_name from cheminee2,nuts_eurostat
where st_intersects(nuts_eurostat.geom,cheminee2.geom)
and cheminee2.id LIKE %(id)s
    ''',{'id':temoin})

    dept = cur.fetchone()[0]

    #---------------------ATTRIBUTS GEOMETRIQUES
    cur.execute('''
SELECT st_astext(geom) from communes_eurostat where comm_id like %(comm_id)s
    ''',{'comm_id':comm})

    polygon = cur.fetchone();

    X=centre.split("(")[1].split(")")[0].split(" ")[0]
    Y=centre.split("(")[1].split(")")[0].split(" ")[1]
    print X+"    "+Y

    cur.execute('''
INSERT INTO communes (id_comm,nbr_chem,nbr_site,name,dept,x,y,geom) VALUES (%(comm_id)s,%(nbrChem)s,%(nbrSit)s,%(name)s,%(dept)s,%(x)s,%(y)s,ST_GeomFromText(%(geo)s, %(srid)s))
    ''',{'comm_id':comm, 'nbrChem':nbr_chem, 'nbrSit':nbr_site,'name':name,'dept':dept,'x':X,'y':Y,'geo':polygon,'srid':srid})


con.commit()
con.close()