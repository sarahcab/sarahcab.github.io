# -*- coding: utf-8  -*-

#-------------------------------------------------------------------------------
# Name:        add_one_chem
# Purpose:
#
# Author:      Sarah
#
# Created:     24/04/2018
# Copyright:   (c) Sarah 2018
# Licence:     <your licence>
#-------------------------------------------------------------------------------
import time
t0 = time.clock()
##----------------------- Modules
import psycopg2
import sys

##----------------------- Paramètre globaux
##---- Définis
srid=4326
newCom=False
##---- Implémentés

gid = sys.argv[1]
site_exists = sys.argv[2]
id_auteur = sys.argv[3]
##gid = 79
##site_exists = "new"
##id_auteur = 'anonyme'

print(sys.argv)

##----------------------- TEST
file_csv=r"C:\wamp\www\cartononlieu\python\tst2.txt"
f=open(file_csv, "w")
for a in sys.argv :

    f.write(a)

f.write("\n\n")

##----------------------- Connexion à la base
con = psycopg2.connect(database='postgis_24_sample', user='postgres', password="postgres", port="5433")
cur = con.cursor()

##----------------------- Sélection de la nouvelle cheminée
##cur.execute('''
##    select * from cheminee2 where gid = %(gid)s
##''',{'gid':gid})
##
##print cur.fetchall()
##print "<br/>"
##print(type(site_exists))

##------------ Récup infos nuts

print 'aaa'
cur.execute('''
select nuts_eurostat.nuts_id, nuts_eurostat.nuts_name from nuts_eurostat,cheminee2
where st_intersects((select nuts_eurostat.geom ),(select cheminee2.geom where cheminee2.gid = %(gid)s ))
''',{'gid':gid})

c=cur.fetchone()

if c == None:
    print "Géolocalisation hors europe"
    cur.execute('''
    delete from cheminee2 where gid =%(gid)s
    ''',{'gid':gid})

else :
    nuts_id = c[0]
    nuts_name = c[1]


    ##------------ Récup infos communes
    cur.execute('''
    select communes_eurostat.comm_id,communes_eurostat.comm_name from communes_eurostat,cheminee2
    where st_intersects((select communes_eurostat.geom ),(select cheminee2.geom where cheminee2.gid = %(gid)s ))
    and communes_eurostat.nuts_code like  %(nuts_id)s
    ''',{'gid':gid,'nuts_id':nuts_id})
    c=cur.fetchone()
    comm_id = c[0]
    comm_name = c[1]

    part_id = '%'+comm_id+'%'
    f.write(part_id)

        ##------------ Création de l'identifiant
    if site_exists =="new" or not site_exists :
        print("NONE")
        f.write("NONE")
        cur.execute('''
    select id from cheminee2 where id like %(part_id)s
        ''',{'part_id':part_id})

        ls_site_idem=cur.fetchall()
        if len(ls_site_idem) > 0:
            ls_indiv = []
    ##        print(ls_site_idem)
            for idd in ls_site_idem :
    ##            print idd
                indiv = int(idd[0].split('_')[2])
    ##            print(indiv)
                ls_indiv.append(indiv)

            pos_site = max(ls_indiv)
            pos_site += 1

            if pos_site >= 100 :
                idsite = str(pos_site)
            elif pos_site >= 10 :
                idsite = "0" + str(pos_site)
            else :
                idsite = "00" + str(pos_site)
        else :
            newCom=True
            idsite = "001"


        part_id2 = comm_id+"_"+idsite
        cur.execute('''
    select count(*) from cheminee2 where id like %(part_id)s
        ''',{'part_id':part_id2})

        pos_chem=cur.fetchone()[0]
        pos_chem += 1
        if pos_chem >= 10 :
            idchem = str(pos_chem)
        else :
            idchem = "0" + str(pos_chem)

        newid="C_"+comm_id+"_"+idsite+"_"+idchem

    else:
        idsite = site_exists+"%"
        cur.execute('''
    select id from cheminee2 where id like %(idsite)s
        ''',{'idsite':idsite})

        c = cur.fetchall()
        chems=[]
        for i in c :
            chems.append(int(i[0].split("_")[3]))
        pos_chem = max(chems) + 1
        if pos_chem >= 10 :
            idchem = str(pos_chem)
        else :
            idchem = "0" + str(pos_chem)

        newid = site_exists+"_"+idchem

        ##------------ Mise à jour table sites
        cur.execute('''
        select nbrchem from sites where id like %(id)s
        ''',{'id':site_exists})

        c = cur.fetchone()
        nbchem=c[0]
    ##
        nbchem+=1
        cur.execute('''
        UPDATE sites
        SET nbrchem = %(nbchem)s
        WHERE id like %(id)s
        ''',{'id':site_exists,'nbchem':nbchem})

    ##------------ Mise à jour chemiéne
    cur.execute('''
    UPDATE cheminee2
    SET id = %(newid)s, commune = %(commune)s, nuts = %(nuts_name)s
    WHERE gid = %(gid)s
    ''',{'gid':gid,'newid':newid,'commune':comm_name,'nuts_name':nuts_name})

    ##con.commit() ##prend en compte la nouvelle cheminée

    ##------------ Mise à jour communes
    if newCom==True:
        cur.execute('''
        insert into communes (id_comm,name,nuts_id,geom)
        select comm_id, comm_name, nuts_code,geom from communes_eurostat where comm_id like %(id_comm)s
        ''',{'id_comm':comm_id})


    cur.execute('''
    select nbr_chem,nbr_site from communes where id_comm like %(id_comm)s
    ''',{'id_comm':comm_id})

    c = cur.fetchone()
    ##print c
    nbchem=c[0]
    nbsit=c[1]

    if nbchem:
        nbchem+=1
    else:
        print 'bloo'
        nbchem=1

    if nbsit:
        nbsit+=1
    else:
        print 'bloo'
        nbsit=1

    cur.execute('''
    UPDATE communes
    SET nbr_chem = %(nbchem)s, nbr_site = %(nbsit)s
    WHERE id_comm like %(id_comm)s
    ''',{'id_comm':comm_id,'nbchem':nbchem,'nbsit':nbsit})

    cur.execute('''
    select cheminees from chemineur where identi like %(auteur)s
    ''',{'auteur':id_auteur})

    test=cur.fetchone()
    ##print "TEST"
    ##print test
    ##print "FINI"

    if test :
        if "C_" in test[0] :
    ##        print "aaaaa"
    ##        print(test)
            chem_auteur = test[0]+"__"+newid
        else :
            chem_auteur = newid

    else :
        chem_auteur = newid

    ##----------------------- UPDATE CHEMINEURS
    ls_chems=chem_auteur.split("__")
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
    newpoint="POINT("+str(geomX/nbX)+" "+str(geomY/nbY)+")"
    print newpoint

    cur.execute('''
    UPDATE chemineur
    SET cheminees = %(id_comm)s, geom = st_geomfromtext(%(newpoint)s,%(srid)s)
    WHERE identi like %(auteur)s
    ''',{'auteur':id_auteur,'id_comm':chem_auteur,'newpoint':newpoint,'srid':srid})

##----------------------- Fermetures
f.close()
con.commit()
con.close()

t1 =time.clock()
##print(t1-t0)
