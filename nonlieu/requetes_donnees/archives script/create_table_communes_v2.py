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
ls_nuts= []
ls_sitbynuts=[]
ls_chembynuts=[]
ls_namenuts=[]

##----------------------- Modules
import psycopg2


##----------------------- Connexion à la base
con = psycopg2.connect(database='postgis_24_sample', user='postgres', password="postgres", port="5433")
cur = con.cursor()

##Au cas ou :
cur.execute('''
    alter table cheminee add column if not exists nuts TEXT
''')

##----------------------- Création des tables
cur.execute("DROP TABLE IF EXISTS communes")
cur.execute("DROP TABLE IF EXISTS nuts")


cur.execute('''
    CREATE TABLE communes (
        id_comm TEXT,
        nbr_chem INTEGER,
        nbr_site INTEGER,
        name TEXT,
        nuts_id TEXT,
        nuts_name TEXT)
''')

cur.execute('''
    SELECT AddGeometryColumn('communes', 'geom',  %(srid)s, 'MULTIPOLYGON', 2);
''',{'srid':srid})


cur.execute('''
    CREATE TABLE nuts (
        id_nuts TEXT,
        name TEXT,
        nbr_chem INTEGER,
        nbr_site INTEGER)
''')

cur.execute('''
    SELECT AddGeometryColumn('nuts', 'geom',  %(srid)s, 'MULTIPOLYGON', 2);
''',{'srid':srid})

##----------------------- Vérif couche communes
cur.execute('''
SELECT UpdateGeometrySRID('communes_eurostat','geom', %(srid)s);
''',{'srid':srid})

##----------------------- Liste des communes
cur.execute('''
    select distinct(comm_id) from communes_eurostat,cheminee where st_intersects(communes_eurostat.geom,cheminee.geom)
''')

for i in cur.fetchall() :
    ls_comm.append(i[0])

print ls_comm

##----------------------- Valeurs par site
for comm in ls_comm :
    ##---- Variables des attributs
    ##Attributaires
    id=""
    nbrChem=0
    nbrSit=0

    ##Géométriques
    geomX=0
    geomY=0

    ##---- Récupération des valeurs des attributs
    cur.execute('''
select cheminee.gid,gid_site,communes_eurostat.comm_name,nuts_eurostat.nuts_id,nuts_eurostat.nuts_name  from cheminee,communes_eurostat,nuts_eurostat
where st_intersects((select communes_eurostat.geom where communes_eurostat.comm_id LIKE %(comm_id)s),cheminee.geom)
and st_intersects((select communes_eurostat.geom where communes_eurostat.comm_id LIKE %(comm_id)s),nuts_eurostat.geom)
    ''',{'comm_id':comm})
    infos = cur.fetchall()
    print("--")
    print(infos)

    ##---- Liste des sites
    cur.execute('''
        select distinct gid_site from cheminee
    ''')
    ls_chembysite = []
    ls_site=[]
    for l in cur.fetchall() :
        ls_site.append(l[0])
        ls_chembysite.append([])

    for j in infos:
        ##---- Récupération des propriétés de chaque cheminées
        ind = ls_site.index(j[1])
        if len(ls_chembysite[ind])==0 :
            nbrSit += 1
            print("site")
            print nbrSit
        nbrChem +=1
        ls_chembysite[ind].append(j[0])

        ##id site
        if j[1] >= 100 :
            idsite = str(j[1])
        elif j[1] >= 10 :
            idsite = "0" + str(j[1])
        else :
            idsite = "00" + str(j[1])

        ##idcheminée
        if len(ls_chembysite[ind]) >= 10 :
            idchem = len(ls_chembysite[ind]==0)
        else :
            idchem = "0" + str(len(ls_chembysite[ind]))

        ##id global
        newid="C_"+comm+"_"+idsite+"_"+idchem

        cur.execute('''
UPDATE cheminee
SET id = %(newid)s, commune = %(commune)s, nuts = %(nuts_name)s
WHERE gid = %(gid)s
        ''',{'gid':j[0],'newid':newid,'commune':j[2],'nuts_name':j[4]})

        name=j[2]
        nuts_id=j[3]
        nuts_name=j[4]

    if nuts_id in ls_nuts :
        ind = ls_nuts.index(nuts_id)
        ls_sitbynuts[ind]+=nbrSit
        ls_chembynuts[ind]+=nbrChem
    else :
        ls_nuts.append(nuts_id)
        ls_namenuts.append(nuts_name)
        ls_sitbynuts.append(nbrSit)
        ls_chembynuts.append(nbrChem)



    cur.execute('''
SELECT st_astext(geom) from communes_eurostat where comm_id like %(comm_id)s
    ''',{'comm_id':comm})

    newpoint = cur.fetchone();

    ##---- Ecriture dans les nouvelles tables
    ##Ponctuelle
    cur.execute('''
INSERT INTO communes (id_comm,nbr_chem,nbr_site,name,nuts_id,nuts_name,geom) VALUES (%(comm_id)s,%(nbrChem)s,%(nbrSit)s,%(name)s,%(nuts_id)s,%(nuts_name)s,ST_GeomFromText(%(geo)s, %(srid)s))
    ''',{'comm_id':comm, 'nbrChem':nbrChem, 'nbrSit':nbrSit,'name':name,'nuts_id':nuts_id,'nuts_name':nuts_name,'geo':newpoint,'srid':srid})

    ##Multilineaire
##    cur.execute('''
##INSERT INTO sites_zone (idd,nom,nb_chem,photo_site,photo_ind,rayon,geom) VALUES (%(idd)s,%(nom)s,%(nb_chem)s,%(photo_site)s,%(photo_ind)s,%(rayon_m)s,st_buffer(ST_GeomFromText(%(geo)s, %(srid)s),%(rayon)s))
##    ''',{'idd':idd,'nom': nom,'nb_chem':nb_chem,'photo_site':photo_site,'photo_ind':photo_ind,'rayon':rayon,'rayon_m':rayon_m,'geo':newpoint,'srid':srid})

print(ls_nuts)
print(ls_sitbynuts)
print(ls_chembynuts)

for nu in range(len(ls_nuts)) :
    cur.execute('''
INSERT INTO nuts (id_nuts,name,nbr_chem,nbr_site,geom) VALUES (%(id_nuts)s,%(name)s,%(nbr_chem)s,%(nbr_site)s,(select nuts_eurostat.geom from nuts_eurostat where nuts_eurostat.nuts_id = %(id_nuts)s))
    ''',{'id_nuts':ls_nuts[nu], 'name':ls_namenuts[nu], 'nbr_chem':ls_chembynuts[nu], 'nbr_site':ls_sitbynuts[nu]})


con.commit()
con.close()