# -*- coding: utf-8  -*-

#-------------------------------------------------------------------------------
# Name:		test_params.py
# Objet:	Trouver la distance optimale de visibile entre des points spécifiques (points_entree) et des points de vente(pt_de_vue)
#
# Auteur:	  Sarah Cabarry
#
# Date de création:	 14/06/2017
# Copyright:   (c) scabarry 2017
# Licence:
#-------------------------------------------------------------------------------

### Import des modules
import arcpy
import psycopg2
from arcpy import env
from arcpy.sa import *

### Configuration
arcpy.env.overwriteOutput = True
arcpy.CheckOutExtension("Spatial")

### Paramètres de la boite à outil
raster_in = arcpy.GetParameterAsText(0) #Raster en entrée
points_entree = arcpy.GetParameterAsText(1) #Couche de points ciblés
road_param = arcpy.GetParameterAsText(2) #Routes
pt_de_vue = arcpy.GetParameterAsText(3) #Points de vue (à implémenter dans postgres au préalable)
chem = arcpy.GetParameterAsText(4) #Emplacement en sortie
curved = arcpy.GetParameterAsText(6) #CURVED_EARTH
buff = arcpy.GetParameter(7) #Buffer autour des routes : équivaut au seil à partir duquel la distance à parcourir hors de la route est minimisée en priorité de celle à parcourir sur la route
srid = arcpy.GetParameter(8)
nbr_entites = arcpy.GetParameterAsText(9).split(";") #Nombre de cibles à analyser
nbr_entites_vue = arcpy.GetParameterAsText(10).split(";") #Nombre de points de vue à analyser

###Fonctions
def make_PGlayer_temp(couche): #fonction de création de couche temporaire (ne s'applique pas aux couches en entrées)
    cur.execute("DROP TABLE IF EXISTS temp") #écrasmeent de la précédente

    cur.execute('''
        CREATE TABLE temp (
            id SERIAL,
            idd INTEGER,
            longueur_source FLOAT,
            longueur_seg FLOAT
            )
    ''') #création des champs nécessaires (inutile d'importe tous les attributs de la couche -> voir pour ajouter cout
    cur.execute('''
        SELECT AddGeometryColumn('temp', 'geom',  %(srid)s, 'MULTILINESTRING', 2);

    ''',{'srid':srid}) #la longueur récupérée est celle du tronçon source

    rows= arcpy.SearchCursor(couche)  #bouclage dans la couche paramètre

    for row in rows:
        ##champs conservés depuis la table source
        t = row.getValue('Shape')
        idd=row.getValue('IDD')

        ##champs calculés (geom, length)
        line = "MULTILINESTRING(("
        blop = [i for i in t ] #geom (lecture)
        for j in str(blop).split("(") :
            if ',' in j :
                cX = j.split(', ')[0]
                cY = j.split(', ')[1]
                line += str(cX)+" "+str(cY)+","

        line= line[:-1] +"))"
        cur.execute('''
INSERT INTO temp (idd,geom) VALUES (%(idd)s,ST_GeomFromText(%(geo)s, %(srid)s));
        ''',{'idd':idd,'geo': line,'srid':srid}) #geom (écriture)

    cur.execute('''
update temp SET longueur_seg = st_length(geom);
update temp SET longueur_source = st_length(routes_pg.geom) from routes_pg
     where routes_pg.idd = temp.idd;
    ''') #length : mieux vaut tout calculer ici plutot que de prendre la longueur initiale des tronçons d'arcgis, ce qui permet d'avoir constamment la même unité
    del rows
    con.commit()


## Listes fixes temporaires (implémentées en phase A, testées en phases B, C, D)
liste = [] #couches cas1, cas2, cas3 à envoyer dans PG
paires_spe = [] #test cas4
liste_euclidienne = [] #liste des distances euclidienne
index_eucli = [] #liste des index pour récupérer la distance correspondant à chaque couple


##prise en charge des paramètre réduistant l'analyse
##Points cibles
result = arcpy.GetCount_management(points_entree)
totalpoints = int(result.getOutput(0))

if len(nbr_entites) ==1 and nbr_entites[0]=='' :
    nbr_entites = []
    arcpy.AddMessage("\rPoints cibles : tous("+str(totalpoints)+")")
    for i in range(totalpoints) :
        nbr_entites.append(i)
    arcpy.AddMessage(nbr_entites)
else :
    arcpy.AddMessage("\rPoints cibles : ")
    arcpy.AddMessage(nbr_entites)

##Points de vue
result2 = arcpy.GetCount_management(pt_de_vue)
totalpoints2 = int(result2.getOutput(0))

if len(nbr_entites_vue) ==1 and nbr_entites_vue[0]=='' :
    nbr_entites_vue = []
    arcpy.AddMessage("\rPoints source : tous("+str(totalpoints2)+")")
    for i in range(totalpoints2) :
        nbr_entites_vue.append(i)
    arcpy.AddMessage(nbr_entites_vue)
else :
    arcpy.AddMessage("\rPoints source : ")
    arcpy.AddMessage(nbr_entites_vue)


#---------------------------------------------------------------Phase de calcul de la distance visuelle entre la route et le point visé : sélection des cibles (arcgis)-------------------------
arcpy.AddMessage(u"\r\rPhase a - sélection Arcgis\r")

###Paramètre phase A
##Paramètres du champs de vision
zFactor = 1
refractivityCoefficient = 0.15
if curved == 1 :
	useEarthCurvature = "CURVED_EARTH"
else :
	useEarthCurvature = ""

###Dossier fichiers temporaires et fichiers détails
arcpy.CreateFolder_management(chem, "temp")


###Champs "IDD" des couches en entrée
arcpy.AddField_management(road_param, "IDD", "TEXT","","","") #nécessaire car la jointure ne renvoie pas le FID : par cointre ca sera égal au GID dans postres
arcpy.CalculateField_management(road_param, "IDD", "[FID]", "VB", "")

arcpy.AddField_management(points_entree, "IDD", "TEXT","","","") #nécessaire car la jointure ne renvoie pas le FID : par cointre ca sera égal au GID dans postres
arcpy.CalculateField_management(points_entree, "IDD", "[FID]", "VB", "")

arcpy.AddField_management(pt_de_vue, "IDD_int", "LONG","","","") #nécessaire car la jointure ne renvoie pas le FID : par cointre ca sera égal au GID dans postres
arcpy.CalculateField_management(pt_de_vue, "IDD_int", "[FID]", "VB", "")


###Prise en compte du nombre de points si non renseigné ou si renseignement non valide



##if nbr_entites > totalpoints or nbr_entites==0 :
##	nbr_entites = int(totalpoints)
##	arcpy.AddMessage(u"Points cibles de la couche : "+str(totalpoints))
##else :
##	arcpy.AddMessage(u"Points cibles à analyser : "+str(nbr_entites))
##	arcpy.AddMessage(u"Points cibles de la couche : "+str(totalpoints))


##
##if nbr_entites_vue > totalpoints2 or nbr_entites_vue==0 :
##	nbr_entites_vue = int(totalpoints2)
##	arcpy.AddMessage(u"Points de vue de la couche : "+str(totalpoints2))
##else :
##	arcpy.AddMessage(u"Points de vue à analyser : "+str(nbr_entites_vue))
##	arcpy.AddMessage(u"Points de vue de la couche : "+str(totalpoints2))
##
### Calcul par point
for j in range(len(nbr_entites)):
    i = int(nbr_entites[j])
    arcpy.AddMessage(u"Point "+str(i))

    ## Listes locales temporaires (implémentées en phase A, testées en phases B, C, D)
    testA = [] #liste de tronçons intersectant la surface visbile

    ##Variables locales
    raster_sortie = chem +"\\temp\\visions"+str(i) #raster sortie du champs de vision
    point_cdv = chem +"\\temp\\point_cdv"+str(i)+".shp" #couche de point individuelle
    polygon = chem +"\\temp\\poly"+str(i)+".shp" #sortie du champs de vision convertie en polygone
    sur_vis = chem +"\\temp\\sur_vis"+str(i)+".shp" #couche contenant seulement la surface visible
    sur_nnvis = chem +"\\temp\\sur_nnvis"+str(i)+".shp" #couche contenant seulement la surface non-visible -> sert pour intersecter cas1
    where_clause = '"IDD" LIKE \''+str(i)+'\'' #requete pour individualiser les points
    where_clause2 = '"GRIDCODE" = 1' #requête pour extraire la surface visible
    where_clause2b = '"GRIDCODE" = 0' #requête pour extraire la surface non visible
    sur_buffer = chem +"\\temp\\buffer"+str(i)+".shp" #buffer autour de la surface visible (si renseigné)

    cas1 = chem +"\\temp\\cas1_"+str(i)+".shp" #tronçons de route intersectant la surface visible
    cas2 = chem +"\\temp\\cas2_"+str(i)+".shp" #tronçons de route intersectant le buffer
    cas3 = chem +"\\temp\\cas3_"+str(i)+".shp" #tronçon le plus proche du buffer (s'il n'y a pas d'intersection)
    cas5 = chem +"\\temp\\cas5_"+str(i)+".shp" #tronçon complètement ç l'intérieur de la surface visible (particularité du cas 5)

    cas1_inter = chem +"\\temp\\cas1_inter"+str(i)+".shp" #part du tronçons en dehors de la surface visible
    cas2_inter = chem +"\\temp\\cas2_inter"+str(i)+".shp" #part du tronçons à l'intérieur du buffer
    cas3_inter = chem +"\\temp\\cas3_inter"+str(i)+".shp" #part du tronçons à l'intérieur du buffer de la surface visible (buffer j> la distance min entre route/survis)

    cas1_split = chem +"\\temp\\cas1_split"+str(i)+".shp" #les parts sont divisés et représentent chacune une entité (suppression des multilignes)
    cas2_split = chem +"\\temp\\cas2_split"+str(i)+".shp" #idem
    cas3_split = chem +"\\temp\\cas3_split"+str(i)+".shp" #idem

    cas3_buff =  chem +"\\temp\\cas3_buff"+str(i)+".shp" #buffer autour des routes de la taille juste un peu plus grande de celle minimale entre une route et la surface visible

    stat = chem +"\\temp\\stat"+str(i) #statistiques sur la cas3 pour trouver le min

    test_cas4 = chem +"\\temp\\test_cas4.shp" #test d'intersection entre les points  de vue et la surface visible
    test_eucli = chem +"\\temp\\test_eucli.shp" #calcul des distances euclidiennes entre les points de vue et la surface visible

    ###taches------------------------------------------------------------------Point ciblé
    ##Extraction du point
    arcpy.Select_analysis(points_entree, point_cdv, where_clause)

    ##Pour les points inclus dans le raster :
    #try : (à remettre pour renvoyer l'erreur sur CURVED EARTH)
    ##Champs de vision
    outViewshed = Viewshed(raster_in, point_cdv, zFactor, useEarthCurvature, refractivityCoefficient)
    outViewshed.save(raster_sortie)

    ##Vectorisation
    arcpy.RasterToPolygon_conversion(raster_sortie, polygon, "NO_SIMPLIFY", "VALUE")

    ##Extraction des surfaces en classes d'entités
    arcpy.Select_analysis(polygon, sur_vis, where_clause2)
    arcpy.Select_analysis(polygon, sur_nnvis, where_clause2b)

    ##Buffer si le paramètre est renseigné :
    if buff > 0 :
        arcpy.Buffer_analysis(sur_vis, sur_buffer, buff)
        arcpy.MakeFeatureLayer_management(sur_buffer,"sur_buffer")

    ##cartographie des couches dont on teste la superposition (nécessaire pour select By location)
    arcpy.MakeFeatureLayer_management(sur_vis,"sur_vis")
    arcpy.MakeFeatureLayer_management(road_param,"roads")
    arcpy.MakeFeatureLayer_management(pt_de_vue,"pt_de_vue")

    ###taches------------------------------------------------------------------Points de vue
    ##test d"intersection (distance 0 ) entre les points de vue et la surface visible
    arcpy.SelectLayerByLocation_management("pt_de_vue","INTERSECT","sur_vis","","NEW_SELECTION")
    arcpy.CopyFeatures_management("pt_de_vue",test_cas4)
    result_test = arcpy.GetCount_management(test_cas4)
    nb_test = int(result_test.getOutput(0))

    if nb_test > 0:
        rowstest = arcpy.SearchCursor(test_cas4)
        for rtest in rowstest :

            fid = rtest.getValue("IDD")
            paires_spe.append([i,fid])
            arcpy.AddMessage(str(fid)+";"+str(i))
        del rowstest
##        arcpy.DeleteFeatures_management(test_cas4)

    arcpy.AddMessage('paires_spe')
    arcpy.AddMessage(paires_spe)
    ##calcul de distance euclidienne entre les points de vue et la surface visible
    arcpy.SpatialJoin_analysis(pt_de_vue, sur_vis, test_eucli,"","","","CLOSEST","","dist")
    rowstest = arcpy.SearchCursor(test_eucli)
    for rtest in rowstest :
        j = rtest.getValue("FID")
        d = rtest.getValue("dist")
        liste_euclidienne.append([i,j,d])
        index_eucli.append([i,j])
    del rowstest
    arcpy.DeleteFeatures_management(test_eucli)

##     #~~~~~~~~~~~~~~~~~~~~~~virer et remettre truc précédent
##    rowstest = arcpy.SearchCursor(pt_de_vue)
##    for rtest in rowstest :
##        j = rtest.getValue("FID")
##        d = 60+int(i)
##        liste_euclidienne.append([i,j,d])
##        index_eucli.append([i,j])
##    del rowstest



    ###taches---------------------------------------------------------Sélection des couches 'cas' pour aller dans PostGis
    ##Création de cas1 : premier test d'intersection


    arcpy.SelectLayerByLocation_management("roads","INTERSECT","sur_vis","","NEW_SELECTION")
    arcpy.CopyFeatures_management("roads",cas1)

    ##variable à implémenter pour les test d'exception
    arcpy.SelectLayerByLocation_management("roads","COMPLETELY_WITHIN","sur_vis","","NEW_SELECTION")
    arcpy.CopyFeatures_management("roads",cas5)
    rows = arcpy.SearchCursor(cas5)
    test_interA = [] #contiendra la liste de tronçons pour chaque entite cible (utilisé en phase D)
    for row in rows :
        idd = row.getValue("idd")
        test_interA.append(int(idd))

    ##test si intersection cas1 et cartographie
    result_cas1 = arcpy.GetCount_management(cas1)
    nbpoints_cas1 = int(result_cas1.getOutput(0))
    arcpy.MakeFeatureLayer_management(cas1,"cas1")

    ##Création de cas2 : second test d'intersection (buffer)
    if buff > 0 :
        arcpy.SelectLayerByLocation_management("roads","INTERSECT","sur_buffer","","NEW_SELECTION")
        arcpy.SelectLayerByLocation_management("roads","INTERSECT","sur_vis","","REMOVE_FROM_SELECTION")
        arcpy.CopyFeatures_management("roads",cas2)
        result_cas2 = arcpy.GetCount_management(cas2)
        nbpoints_cas2 = int(result_cas2.getOutput(0))
    else :
        nbpoints_cas2 = 0

    ##Si aucun des deux n'est positif, cas 3 :
    if nbpoints_cas1 == 0 and nbpoints_cas2 == 0:
        arcpy.AddMessage(u"Cas 3 : Pas d'intersection entre la surface visible et la route")
        arcpy.SpatialJoin_analysis(road_param, sur_vis, cas3,"","","","CLOSEST","","dist") #la jointure spatiale trouve l'entité la plus proche de chaque couche
        ##Intersection de type 3
        arcpy.Statistics_analysis(cas3, stat, [["dist","MIN"]]) #on récupère la distance minimale
        summary = arcpy.SearchCursor(stat)

        for row in summary: #trop moche mais c pr récup le min
            surminc3 = row.getValue("MIN_dist")
##        surminc3 = 7126.43613 #a virer!!!
        c3_buff = surminc3 + 0.001
        arcpy.Buffer_analysis(sur_vis,cas3_buff,c3_buff)
        arcpy.Intersect_analysis([road_param,cas3_buff],cas3_inter)
        arcpy.MultipartToSinglepart_management(cas3_inter, cas3_split)
        liste.append([i,'','',cas3_split])
##        arcpy.DeleteFeatures_management(cas3)
##        arcpy.DeleteFeatures_management(cas3_buff)

    ##Si l'on n'est pas dansle cas3, découpage des cas1 et 2 par la surface visible, ce qui permet d'éviter d'extraire la surface visible dans postGis
    else :
        arcpy.AddMessage(u"Cas 1 : tronçons de routes intersectant la surface visible")
        arcpy.Intersect_analysis([cas1, sur_nnvis],cas1_inter)
        arcpy.MultipartToSinglepart_management(cas1_inter, cas1_split) #couche PostGis

        if buff > 0 :
            arcpy.AddMessage(u"Cas 2 : tronçons de routes intersectant SEULEMENT le buffer de la surface visible")
            arcpy.Intersect_analysis([cas2, sur_buffer],cas2_inter)
            arcpy.MultipartToSinglepart_management(cas2_inter, cas2_split) #couche PostGis
            ##Ecriture des variables à implementer
            liste.append([i,cas1_split,cas2_split])
        else :
            liste.append([i,cas1_split])

	##Suppression des fichiers temporaires
    arcpy.Delete_management(raster_sortie)
    arcpy.Delete_management(point_cdv)
    arcpy.Delete_management(polygon)
##    arcpy.DeleteFeatures_management(sur_vis)
    arcpy.Delete_management(sur_nnvis)
##    arcpy.Delete_management(sur_buffer)
    arcpy.Delete_management(cas1)


    testA.append([i,test_interA])

#---------------------------------------------------------------Sélection de données pour les points de vue (postgres) et rpéparation postgres------------------------
arcpy.AddMessage(u"\rPhase b - sélections PostGres\r")

###connexion base de données
con = psycopg2.connect(database='postgis_23_sample', user='postgres', password='geo2017')
cur = con.cursor()

arcpy.AddMessage(u"Import routes...")
###import des couches en entrées - pratiquement la meme manip que pour les couches temporaires -> voir commentaire de la fonction make_PGlayer_temp
##couche route
try :
    cur.execute("DROP TABLE IF EXISTS routes_pg")
except psycopg2.DatabaseError, e:
    arcpy.AddMessage('Error %s' % e)
try :
    cur.execute('''
        CREATE TABLE routes_pg (
            id SERIAL,
            idd INTEGER,
            longueur DOUBLE PRECISION
            )
    ''') #seule difference: pas de longueur source
except psycopg2.DatabaseError, e:
    arcpy.AddMessage('Error %s' % e)

try :
    cur.execute('''
        SELECT AddGeometryColumn('routes_pg', 'geom', %(srid)s, 'MULTILINESTRING', 2)
    ''',{'srid':srid})
except psycopg2.DatabaseError, e:
    arcpy.AddMessage('Error %s' % e)

rows= arcpy.SearchCursor(road_param)
for row in rows:
    t = row.getValue('Shape')
    idd=row.getValue('IDD')

    line = "MULTILINESTRING(("
    blop = [i for i in t ]
    for j in str(blop).split("(") :
        if ',' in j :
            cX = j.split(', ')[0]
            cY = j.split(', ')[1]
            line += str(cX)+" "+str(cY)+","

    line= line[:-1] +"))"
    cur.execute('''
INSERT INTO routes_pg (idd,geom) VALUES (%(idd)s,ST_GeomFromText(%(geo)s, %(srid)s))
    ''',{'idd':idd,'geo': line,'srid':srid})

try :
    cur.execute('''
update routes_pg SET longueur = st_length(geom);
    ''')
except psycopg2.DatabaseError, e:
    arcpy.AddMessage('Error %s' % e)
del rows
con.commit()

###Topologie
arcpy.AddMessage(u"Topologie...")
try :
    cur.execute('''
ALTER TABLE routes_pg
add column source integer;

ALTER TABLE routes_pg
add column target integer;

ALTER TABLE routes_pg
ALTER COLUMN geom TYPE geometry(MultiLineString)
using ST_Force_2D(geom);

SELECT  pgr_createTopology('routes_pg', 0.001,'geom','idd','source','target');
SELECT UpdateGeometrySRID('routes_pg_vertices_pgr','the_geom', %(srid)s);
    ''',{'srid':srid})
except psycopg2.DatabaseError, e:
    arcpy.AddMessage('Error %s' % e)
con.commit()


###Couche point de vue : sélection du noeud le plus proche du point
sources_dj = [] #variable à implémenter pour boucler dans Dijkstra

##Implémenté pour la phase D : même principe que testA
##testB = [] #liste de tronçons proches du point vente
arcpy.AddMessage(u"Recherche des noeuds sources...")
for j in range(len(nbr_entites_vue)) :
    i = int(nbr_entites_vue[j])
    arcpy.AddMessage(i)
    listePoints = []
    arcpy.AddMessage(u"vue pt"+str(i))
    #première requête : renvoie les coordonnées du point source
    cur.execute('''
select st_astext(geom) from points_de_vue where points_de_vue.gid = %(id)s
    ''', {'id':i+1})
    ver0 = cur.fetchall()
    #deuxième requête : renvoie la distance minale entre les points pour isoler le tronçon cible
    cur.execute('''
select min(st_distance(points_de_vue.geom, routes_pg.geom)) from routes_pg, points_de_vue where points_de_vue.gid = %(id)s
    ''', {'id':i+1})
    val = cur.fetchone()
    valOk = val[0]+0.0001
    #troisième requête : renvoie la géométrie du tronçon cible
    cur.execute('''
select st_astext(routes_pg.geom),routes_pg.idd as id
from points_de_vue,routes_pg
where points_de_vue.gid = %(id)s
and st_distance(routes_pg.geom, points_de_vue.geom) < %(val)s;
    ''', {'id':i+1,'val':valOk})
    ver = cur.fetchone() # ('MULTILINESTRING((657231.7 7070584.6,657271.7 7070589.3,657462.5 7070572.7,657607.4 7070571.5,657697.3 7070560.7,657827.2 7070559.7,657958.3 7070573.5,658063.2 7070572.7,658132 7070563.9,658178.1 7070556.7))',)
##    ##valeur du tronçon : inutile pour la phase C mais nécessaire à la phase D
##    idTron = ver[1]
##    testB.append([i,idTron])
    ##traitement valeur géométriques des sommets du tronçon ciblé
    points = ver[0].split("(")[2].split(")")[0].split(",")
    for p in points :
        listePoints.append([p.split(" ")[0],p.split(" ")[1]])
    id_tron = ver[1]
    ##point source
    coords = ver0[0][0].split("(")[1].split(")")[0].split(" ")
    point_src = coords
    dMin = ''
    somm=['']
    for p in listePoints : #debile:peut être calculé dans PG avec ST_distance  -- voir version plus détaille avec cas3
        a = float(point_src[0])-float(p[0])
        b = float(point_src[1])-float(p[1])
        di = math.sqrt((a*a)+(b*b))
        if di < dMin :
            somm[0] = p
            dMin = di
            ind = listePoints.index(p)
    geometries = ['LINESTRING(','LINESTRING(']
    for p in listePoints :
        if listePoints.index(p) < ind :
            geometries[0] += p[0]+" "+p[1]+','
        elif listePoints.index(p) == ind :
            geometries[0] += p[0]+" "+p[1]+','
            geometries[1] += p[0]+" "+p[1]+','
        else :
            geometries[1] += p[0]+" "+p[1]+','

    geometries[0] = geometries[0][:-1] + ")"
    geometries[1] = geometries[1][:-1] + ")"
    sommets_end = [listePoints[0],listePoints[len(listePoints)-1]]
    noeud_dist = [[i],[i]]
    #extraction du tronçon, le sommet1 avec sa distance au point d'intersection, le sommet 2 avec sa distance au point d'intersection
    for k in range(2):
        if len(geometries[k].split(",")) > 1 :
            cur.execute('''
        select ST_LENGTH(ST_GeomFromText(%(geo)s))
            ''',{'geo':geometries[k]})
            lon = cur.fetchone()
            noeud_dist[k].append(lon[0])
        else :
            noeud_dist[k].append(0)
        pointgeom = 'POINT('+str(sommets_end[k][0])+" "+str(sommets_end[k][1])+")"
        cur.execute('''
    select id from routes_pg_vertices_pgr
    where
    st_intersects(the_geom,st_geomfromtext(%(pointgeom)s,' %(srid)s'))
            ''',{'pointgeom':pointgeom,'srid':srid})
        iddd = cur.fetchone()
        noeud_dist[k].append(iddd[0])
        noeud_dist[k].append(val[0])
        noeud_dist[k].append(id_tron)
        ##test cas4b


        sources_dj.append(noeud_dist[k])

##    for a in testA :
##            if id_tron in a[1] :
##                arcpy.AddMessage(id_tron)
##                pt = a[0]


###Même chose  pour les cas1, cas2,cvas3 (cette fois ci le point le plus proche et la distance entre lui et les extrémités est connue)
arcpy.AddMessage(u"Recherche des noeuds cible...")
cibles_dj=[]
for cas in liste : #premi?re boucle
    if cas[1] != '' :
        arcpy.AddMessage(u"cas1")
        fc = cas[1]
        make_PGlayer_temp(fc)
        cur.execute('''
    select distinct routes_pg_vertices_pgr.id,temp.longueur_seg from routes_pg_vertices_pgr,temp
    where
    st_intersects(routes_pg_vertices_pgr.the_geom,temp.geom)
        ''') #renvoie le noeud, la distance jusqu'au pt le plus proche
        res = cur.fetchall()
        for nod in res :
            cibles_dj.append([cas[0],nod[0],nod[1],0,"cas1"]) #id point cible, id sommet, distance sommet-> pt le plu proche, surface_hors_route, cas

        if len(cas)>2 :
            arcpy.AddMessage(u"cas2")
            fc = cas[2]
            make_PGlayer_temp(fc)
            cur.execute('''
    select distinct routes_pg_vertices_pgr.id,temp.longueur_source,temp.longueur_seg from routes_pg_vertices_pgr,temp
    where
    st_intersects(routes_pg_vertices_pgr.the_geom,temp.geom)
            ''') #renvoie le sommet, la longueur totale du tronçon, la distance à l'intérieur du buffer
            res = cur.fetchall()
            for nod in res :
                difference = nod[1]-nod[2] #ce n'est pas la distance de la partie importée qui compte, mais son inverse sur le tronçon : en fait non, on s'en fout
                cibles_dj.append([cas[0],nod[0],nod[2],buff,"cas2"]) #id point cible, id noeud, distance noeud-> pt le plu proche, surface_hors_route, cas
    else :
        fc = cas[3]
        make_PGlayer_temp(fc)
        #~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        pt = cas[0]

        cur.execute('''
            select routes_pg_vertices_pgr.id from routes_pg_vertices_pgr, temp
            where st_intersects(routes_pg_vertices_pgr.the_geom, temp.geom)
        ''')
        tst = cur.fetchall()

        if len(tst) == 0 :
            arcpy.AddMessage('pos2')
            cur.execute('''
        select distinct st_astext(routes_pg.geom) from routes_pg, temp
        where st_intersects(temp.geom, routes_pg.geom)
            ''')

            ver = cur.fetchall()
            for i in range(len(ver)) :
                somm_ok = []
                somm_proche_di = []
                somm_proche_co = []
                listePoints = []
                cibles_temp = [[],[]]

                arcpy.AddMessage('-----------------------------------------------------------')
                points = ver[i][0].split("(")[2].split(")")[0].split(",")
                for p in points :
                    point_text = ("POINT("+p+")")

                    cur.execute('''
        select st_distance(temp.geom, st_geomfromtext(%(geom)s,' %(srid)s')) from temp
                    ''',{'geom':point_text,'srid':srid})
                    mi = cur.fetchone()
                    if mi[0] == 0 :
                        somm_ok.append([p,points.index(p),0])
                    else :
                        somm_proche_di.append(mi[0])
                        somm_proche_co.append([p,points.index(p),mi[0]])

                if len(somm_ok)==0 :
                    ind_mi = somm_proche_di.index(min(somm_proche_di))
                    somm_ok.append(somm_proche_co[ind_mi])

                for k in range(len(somm_ok)) :
                    ind = points.index(somm_ok[k][0])
                    geometries = ['LINESTRING(','LINESTRING(']
                    for p in points :
                        if points.index(p) < somm_ok[k][1] :
                            geometries[0] += p+","
                        elif points.index(p) == somm_ok[k][1] :
                            geometries[0] += p+","
                            geometries[1] += p+","
                        else :
                            geometries[1] += p+","

                    geometries[0] = geometries[0][:-1] + ")"
                    geometries[1] = geometries[1][:-1] + ")"
                    sommets_end = [points[0],points[len(points)-1]]
                    noeud_dist = [[pt],[pt]]
                    #extraction du tronçon, le noeud 1 avec sa distance au point d'intersection, le noeud 2 avec sa distance au point d'intersection


                    for l in range(2):
                        if len(geometries[l].split(",")) > 1 :
                            cur.execute('''
                        select ST_LENGTH(ST_GeomFromText(%(geo)s))
                            ''',{'geo':geometries[l]})
                            lon = cur.fetchone()
                            lenplus = lon[0]+somm_ok[k][2]
                        else :
                            lenplus = 0+somm_ok[k][2]
                        pointgeom = 'POINT('+str(sommets_end[l])+")"



                        cur.execute('''
        select id from routes_pg_vertices_pgr
        where
        st_intersects(the_geom,st_geomfromtext(%(pointgeom)s,' %(srid)s'))
                            ''',{'pointgeom':pointgeom,'srid':srid})
                        iddd = cur.fetchone()
                        arcpy.AddMessage(iddd)
                        noeud_dist[l].append(iddd[0])
                        noeud_dist[l].append(lenplus)
                        noeud_dist[l].append(c3_buff) #distance hors route
                        noeud_dist[l].append("cas3")
                        cibles_temp[l].append(noeud_dist[l])

            for tu in range(2) :
                min_d = ''
                for c in cibles_temp[tu] :
                    if c[2] < min_d:
                        min_d = c[2]
                for c in cibles_temp[tu] :
                    if c[2] == min_d:
                        cibles_dj.append(c)


        else :
            arcpy.AddMessage('pos1')
            arcpy.AddMessage(tst[0][0])
            cibles_dj.append([pt,tst[0][0],0,c3_buff,"cas3"])


        #~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
##arcpy.AddMessage(cibles_dj)
##arcpy.AddMessage('sr')
##arcpy.AddMessage(sources_dj)
#---------------------------------------------------------------Phase de calcul du plus cours chemin : distance d'accès de la route aux points de vente-------------------------
arcpy.AddMessage(u"\rPhase c - Dijkstra\r")

###d?claration des sorties pour l'?criture
paires =[] #permet de lister les paires : chaque paire est déclinée en autant de fois qu'il y a de neouds cible
total = [] #sortie détail (sert pour les tests)
final = [] #même chose trés par paire

###bouclage dans tous les couples de neouds (bcp plus nombreux que les couples de points)
for ci in cibles_dj : #première boucle(points cible)
    target = int(ci[1]) #bien préciser que c'est un entier : sinon la requête ne marche pas
    for src in sources_dj : #seconde boucle(points de vue)
        source = int(src[2]) #idem
        ind_cible = nbr_entites.index(str(ci[0])) #test du cas5 partocilier (tronçon src dans la surface visible)
        trons_inter_survis = testA[ind_cible] #idem

        ##annonce du couple de noeuds
        arcpy.AddMessage(str(ci[0])+" : "+str(target)+"   |   "+str(src[0])+" : "+str(source))

        ##création des paires
        if [ci[0],src[0]] not in paires :
            paires.append([ci[0],src[0]])
            final.append([]) #sinon out of range

        ##test de cas4 : bloque le djikstra
        if [ci[0],src[0]] in paires_spe :
            arcpy.AddMessage(u"Point de vue à l'intérieur de la surface visible : point "+str(source))
            arcpy.AddMessage("spe"+str(ci[0])+":"+str(src[0]))
            ind = paires.index([ci[0],src[0]]) #index
            final[ind].append([ci[0],src[0],0,0,[],"cas4",0])

        ##pareil pour une des aprtiuclarités du cas 5

        elif src[4] in trons_inter_survis[1] :
            arcpy.AddMessage(u"Tronçon à l'intérieur de la surface visible : point "+str(source))
            cas = "cas5" #écrase le cas de la liste mère

            i_eucli = index_eucli.index([ci[0],src[0]])
            eucli = (liste_euclidienne[i_eucli])[2]

            ind = paires.index([ci[0],src[0]]) #index
            final[ind].append([ci[0],src[0],0,0,[],"cas5",eucli])

        else :
            ##valeurs à implémenter par dijkstra
            distance_route = 0 #distance par la route qui va être implémentée
            chemin = [] #idem pour le chemin

            try:
                cur.execute('''
    SELECT pgr_dijkstra('
    SELECT idd::integer AS id, source::integer, target::integer, longueur::double precision AS cost FROM routes_pg',
    %(source)s,  %(cible)s, false, false);
                ''', {'source': source, 'cible': target}) #renvoie le chemin
                ver = cur.fetchall()

            except psycopg2.DatabaseError, e:
                arcpy.AddMessage(u'Error %s' % e)

            if source == target : #cas 5 : les mêmes noeuds sont testés
                arcpy.AddMessage(u"Même noeud : "+str(source))
                cas = "cas5" #écrase le cas de la liste mère
                distance_route_totale = 0

            elif len(ver) == 0 : #cas 6 :si dijkstra ne renvoie rien, c'est qu'il n'y pas d'acces possible par la route
                arcpy.AddMessage(u"Pas de connexion")
                cas = "cas6" #écrase le cas de la liste mère
                distance_route_totale = 0

            else :
                ##implementation du chemin global
                arcpy.AddMessage(u"Chemin")
                for i in ver : #construction du chemin (tron?ons mis bout ? bout)
                    bou = i[0].split(",")[2]
                    dist_plus = i[0].split(",")[3].split(")")[0]
                    distance_route += float(dist_plus)
                    chemin.append(bou)

                if distance_route == 0 :
                    arcpy.AddMessage(u"ERREUUUUUUUUUUUUUUUUUUUUUUUUUUUR")

            ##paramètre antérieurement définis
                if ci[4] == "cas1" or ci[4] == "cas3":
                    distance_route_totale = distance_route+ci[2]+src[1]
                else :
                    distance_route_totale = distance_route-ci[2]+src[1]
                cas = ci[4]  #cas de la liste mère
            i_eucli = index_eucli.index([ci[0],src[0]])
            eucli = liste_euclidienne[i_eucli][2]
            distance_hors_route_totale = ci[3] + src[3]
            distance_tot = distance_hors_route_totale + distance_route_totale
            ##écriture de tous les chemins possibles
            total.append([ci[0],src[0],distance_route_totale,distance_hors_route_totale,chemin,cas,eucli,distance_tot])
            ##idem triés par paire
            ind = paires.index([ci[0],src[0]]) #index
            final[ind].append([ci[0],src[0],distance_route_totale,distance_hors_route_totale,chemin,cas,eucli,distance_tot])

if con: #important! sinon ça fait planter
    con.commit()
    con.close()

#--------------------------------------------------------------Exceptions-------------------------
arcpy.AddMessage(u"\rPhase d - distance la plus proche \r")

##arcpy.AddMessage(u"testA")
##arcpy.AddMessage(utestA)
##arcpy.AddMessage(u"\rtestB")
##arcpy.AddMessage(utestB)

#test grace à testA et testB -> finalement exécuté en phase c
##for a in testA : #liste des tronçons
##    for b in testB: #liste des tronçons
##        arcpy.AddMessage(upaires)
##        ind = paires.index([a[0],b[0]])
##        if [a[0],b[0]] in paires_spe :
##            final.append([a[0],b[0],0,0,[],"cas4",0])
####            final[ind][2]=0
####            final[ind][3]=0
####            final[ind][4]= []
####            final[ind][5]= "cas4"
####            final[end]=[a[0],b[0],0,0,[],"cas4_distancenulle"]
##
####        if b[1] in a[1] :
####            arcpy.AddMessage(u"plop")
####            arcpy.AddMessage(ufinal[end][2])
####            final[end][2]=0
####            final[end][4]=[]
####            final[end][5]= "cas5_distanceroutenulle"
####            final[end]=[a[0],b[0],0,0,[],"cas5_memetroncon"]

###calcul des distances minimum pur chaque coucple
##arcpy.AddMessage(u"total")
##arcpy.AddMessage(utotal)
##arcpy.AddMessage(u"final")
##arcpy.AddMessage(ufinal)

final_select = []
for couple in final :
    mini = ''
    for i in couple :
        if i[5]=="cas4" :
            final_select.append(i)
        else :
            if i[5]=="cas5" :
                dist_tot = i[6] #on prend la distance euclidienne
            else :
                dist_tot = i[3]+i[2]
            if dist_tot :
                if dist_tot == 0 :
                    arcpy.AddMessage(u"Erreur")
                if dist_tot < mini and i[5]!="cas6":
                    mini = dist_tot
    arcpy.AddMessage("mini:")
    arcpy.AddMessage(mini)
    if mini == '':
        final_select.append([couple[0][0],couple[0][1],"Point inaccessible"])
    else :
        for i in couple :
            if i[5]=="cas5" :
                dist_tot = i[6] #on prend la distance euclidienne
            else :
                dist_tot = i[3]+i[2]
            if dist_tot == mini :
                final_select.append(i)

#--------------------------------------------------------------Ecritures - sortie-------------------------
arcpy.AddMessage("\rPhase e - écriture\r")

#[ci[0],src[0],distance_route_totale,distance_hors_route_totale,chemin,ci[4],eucli

res = file(chem+"\\detail.csv", "w") #sortie d?tail en mode csv
res.write("point_cible;point_de_vue;distance_route;distance_hors_route;chemin;cas;distance_euclidienne;distance_totale")
arcpy.AddMessage(str(len(total))+" chemin(s) pour "+str(len(final))+" couple(s) de points")
for couple in final :
    res.write("\r")
    for node in couple :
        res.write("\r")
        for s in node :
            res.write(str(s)+";")
res.close()

res2 = file(chem+"\\resultats.csv", "w") #sortie des réusltats sélectionnés (distance minimale)
res2.write("point_cible;point_de_vue;distance_route;distance_hors_route;chemin;cas;distance_euclidienne;distance_totale")
for cpl in final_select :
    res2.write("\r")
##    res2.write(str(cpl))
    for che in cpl :
        res2.write(str(che)+";")
res2.close()
