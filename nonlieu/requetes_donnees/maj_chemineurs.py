# coding: utf-8

#-------------------------------------------------------------------------------
# Name:        maj_chemineurs
# Purpose:
#
# Author:      Sarah
#
# Created:     30/05/2018
# Copyright:   (c) Sarah 2018
# Licence:     <your licence>
#-------------------------------------------------------------------------------


##---- Définis
srid=4326
##----------------------- INTRO
import psycopg2
con = psycopg2.connect(database='postgis_24_sample', user='postgres', password="postgres", port="5433")
cur = con.cursor()
choix=raw_input("Ecrire XY pour ajouter X et Y")


##----------------------- PARTIE 1 : champs cheminées
cur.execute('select identi from chemineur')
res_id = cur.fetchall()

for i in res_id:
    iden=i[0]
    cur.execute('''
    select id from cheminee2 where auteur like %(id_auteur)s
    ''',{'id_auteur':iden})

    chems = cur.fetchall()
##    print(chems)
    cheminees = ""
    for c in chems:
        if cheminees =="":
            cheminees = c[0]
        else :
            cheminees = cheminees+"__"+c[0]
    print cheminees

    cur.execute('''
    update chemineur set cheminees = %(cheminees)s where identi like %(id_auteur)s
    ''',{'id_auteur':iden,'cheminees':cheminees})



##----------------------- PARTIE 2 : champs X, Y


    if choix=="XY" and cheminees != "":
        ls_chems=cheminees.split("__")
        print ls_chems

        geomX=0
        lsX=[]
        nbX=0
        geomY=0
        lsY=[]
        nbY=0

        for c in ls_chems :
            print(c)

            cur.execute('''
                select st_astext(geom) from cheminee2 where id LIKE %(chemid)s
            ''',{'chemid':c})
            geom = cur.fetchone()
            print(geom)
            g = geom[0].split("(")[1].split(")")[0].split(" ")

            geomX+=float(g[0])
            lsX.append(float(g[0]))
            nbX+=1
            geomY+=float(g[1])
            lsY.append(float(g[1]))
            nbY+=1

        ##---- Calcul des attributs géométriques
        ##Point
        X = str(geomX/nbX)
        Y = str(geomY/nbY)
        newpoint="POINT("+X+" "+Y+")"

        cur.execute('''
        update chemineur set cheminees = %(cheminees)s where identi like %(id_auteur)s
        ''',{'id_auteur':iden,'cheminees':cheminees})

        cur.execute('''
        UPDATE chemineur
        SET geom = st_geomfromtext(%(newpoint)s,%(srid)s) , x=%(X)s, y=%(Y)s
        WHERE identi like %(auteur)s
        ''',{'auteur':iden,'newpoint':newpoint,'srid':srid,'X':X,'Y':Y})



con.commit()
con.close()
