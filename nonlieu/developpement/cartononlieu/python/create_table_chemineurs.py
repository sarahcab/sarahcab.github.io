# coding: utf-8

#-------------------------------------------------------------------------------
# Name:        create_table_site
# Purpose:      générer la table des chemineurs avec les infos du csv et leur mettre une géométrie
# Version:    Avec les polyline
#
# Author:      Sarah
#
# Created:     08/03/2018
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
import os


##----------------------- Connexion à la base
con = psycopg2.connect(database='postgis_24_sample', user='postgres', password="postgres", port="5433")
cur = con.cursor()

##----------------------- Création de la table
cur.execute("DROP TABLE IF EXISTS chemineur")

cur.execute('''
    CREATE TABLE chemineur (
        gid SERIAL,
        identi TEXT,
        mdp TEXT,
        nomPerso TEXT,
        prenom TEXT,
        nomStru TEXT,
        objet TEXT,
        territoire TEXT,
        cheminees TEXT,
        actions TEXT,
        agenda TEXT,
        envieProp TEXT,
        mail TEXT,
        tel TEXT,
        adresse TEXT,
        codePost TEXT,
        commune TEXT,
        siteWeb TEXT,
        rayon FLOAT
        )
''')

cur.execute('''
    SELECT AddGeometryColumn('chemineur', 'geom',  %(srid)s, 'POINT', 2);
''',{'srid':srid})

##----------------------- Lecture du fichier de données
file_csv=r"C:\Users\Sarah\Documents\nonlieu\requetes_donnees\donnees_test_v2\chemineurss.csv"
f=  open(file_csv, "r")

for row in f :
    ##----- Récupération des valeurs attributaires dans le CSV
    line = row.decode("utf8")
    valeurs = line.split(";")
    lsvals=[]
    for v in valeurs :
        a = v.encode('utf8')
        lsvals.append(a)

    ##----------------------- Insertion dans la table selon cas de figure
    ls_chems = (lsvals[5]).split("__")
    if lsvals[5] == "" :
        ##Aucune cheminée renseignée : il est dans la base mais pas affiché car il n'a pas de géométrie
        cur.execute('''
INSERT INTO chemineur (nomPerso,prenom,nomStru,objet,territoire,cheminees,actions,agenda,envieProp,mail,tel,adresse,codePost,commune,siteWeb) VALUES (%(nomPerso)s,%(prenom)s,%(nomStru)s,%(objet)s,%(territoire)s,%(cheminees)s,%(actions)s,%(agenda)s,%(envieProp)s,%(mail)s,%(tel)s,%(adresse)s,%(codePost)s,%(commune)s,%(site)s)
        ''',{'nomPerso':lsvals[0],'prenom':lsvals[1],'nomStru':lsvals[2],'objet':lsvals[3],'territoire':lsvals[4],'cheminees':lsvals[5],'actions':lsvals[6],'agenda':lsvals[7],'envieProp':lsvals[8],'mail':lsvals[9],'tel':lsvals[10],'adresse':lsvals[11],'codePost':lsvals[12],'commune':lsvals[13],'site':lsvals[14]})
    elif len(ls_chems) == 1 and "_" in lsvals[5]:
        ##Une seule cheminée : on récupère sa géométrie
        cur.execute('''
            select st_astext(geom) from cheminee where Id LIKE %(site)s
        ''',{'site':ls_chems[0]})
        fet = cur.fetchall()
        geom =""
        for g in fet :
            geom = str(g).split("'")[1]
        cur.execute('''
INSERT INTO chemineur (nomPerso,prenom,nomStru,objet,territoire,cheminees,actions,agenda,envieProp,mail,tel,adresse,codePost,commune,siteWeb,geom) VALUES (%(nomPerso)s,%(prenom)s,%(nomStru)s,%(objet)s,%(territoire)s,%(cheminees)s,%(actions)s,%(agenda)s,%(envieProp)s,%(mail)s,%(tel)s,%(adresse)s,%(codePost)s,%(commune)s,%(site)s,ST_GeomFromText(%(geom)s, %(srid)s))
        ''',{'nomPerso':lsvals[0],'prenom':lsvals[1],'nomStru':lsvals[2],'objet':lsvals[3],'territoire':lsvals[4],'cheminees':lsvals[5],'actions':lsvals[6],'agenda':lsvals[7],'envieProp':lsvals[8],'mail':lsvals[9],'tel':lsvals[10],'adresse':lsvals[11],'codePost':lsvals[12],'commune':lsvals[13],'site':lsvals[14],'geom':geom,'srid':srid})

    elif "__" in lsvals[5]:
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
        for c in ls_chems :
            print(c)
            cur.execute('''
                select st_astext(geom) from cheminee where Id LIKE %(chemid)s
            ''',{'chemid':c})
            fet = cur.fetchall()
            print("---")
            print(fet)
            print("---")
            geom =""
            for g in fet :
                geom = str(g).split("'")[1]
            print(geom)
            g = geom.split("(")[1].split(")")[0].split(" ")

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

        ##------- Ecriture
        cur.execute('''
INSERT INTO chemineur (nomPerso,prenom,nomStru,objet,territoire,cheminees,actions,agenda,envieProp,mail,tel,adresse,codePost,commune,siteWeb,geom) VALUES (%(nomPerso)s,%(prenom)s,%(nomStru)s,%(objet)s,%(territoire)s,%(cheminees)s,%(actions)s,%(agenda)s,%(envieProp)s,%(mail)s,%(tel)s,%(adresse)s,%(codePost)s,%(commune)s,%(site)s,ST_GeomFromText(%(geom)s, %(srid)s))
        ''',{'nomPerso':lsvals[0],'prenom':lsvals[1],'nomStru':lsvals[2],'objet':lsvals[3],'territoire':lsvals[4],'cheminees':lsvals[5],'actions':lsvals[6],'agenda':lsvals[7],'envieProp':lsvals[8],'mail':lsvals[9],'tel':lsvals[10],'adresse':lsvals[11],'codePost':lsvals[12],'commune':lsvals[13],'site':lsvals[14],'geom':newpoint,'srid':srid})




con.commit()
con.close()