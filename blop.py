# -*- coding: utf-8  -*-

#-------------------------------------------------------------------------------
# Name:		test_params.py
# Objet:	Calculs de visibilité appliqués à une grille générée automatiquement
#
# Auteur:	  Sarah Cabarry
#
# Date de création:	 06/06/2017
# Copyright:   (c) scabarry 2017
# Licence:
#-------------------------------------------------------------------------------

### Import des modules
import arcpy
#import shutil
from arcpy import env
from arcpy.sa import *

### Configuration
arcpy.env.overwriteOutput = True
arcpy.CheckOutExtension("Spatial")

### Variables gloables
## Paramètres
raster_entree = arcpy.GetParameterAsText(0)
esp = arcpy.GetParameter(1)
nbr_entites = arcpy.GetParameter(2)
intersect_entree = arcpy.GetParameterAsText(3)
chem = arcpy.GetParameterAsText(4)
bool_csv = arcpy.GetParameter(5)
bool_fc = arcpy.GetParameter(6)
bool_detail = arcpy.GetParameter(7)
bool_carto = arcpy.GetParameter(8)
env_lyr = arcpy.GetParameterAsText(9)

points_entree = chem+"\\grille_in.shp"
raster_in= chem +"\\temp\\raster_inter"

## Champs de vision
zFactor = 2
useEarthCurvature = "CURVED_EARTH"
refractivityCoefficient = 0.15

## Valeurs de sortie
liste = []

###Dossier fichiers temporaires et fichiers détails
arcpy.CreateFolder_management(chem, "temp")
arcpy.CreateFolder_management(chem, "detail")

###Emprise : réduction du raster à la couche intersect et récupération des valeurs cadre
if  intersect_entree :
	dscFc = arcpy.Describe(intersect_entree)
	a = dscFc.extent.XMax
	b = dscFc.extent.XMin
	c = dscFc.extent.YMax
	d = dscFc.extent.YMin
	arcpy.Clip_management(raster_entree,str(b)+" "+str(d)+" "+str(a)+" "+str(c),raster_in, "#", "#", "NONE")
else :
	dscFc = arcpy.Describe(raster_entree)
	a = dscFc.extent.XMax
	b = dscFc.extent.XMin
	c = dscFc.extent.YMax
	d = dscFc.extent.YMin
	raster_in = raster_entree

###Creation de la grille
##Calcul des variables
itX = int(math.ceil((a-b)/esp))
itY = int(math.ceil((c-d)/esp))
##Création de la couche
arcpy.CreateFeatureclass_management(chem, "\\detail\\grille.shp", "POINT", "", "", "", intersect_entree)
arcpy.AddField_management(chem+"\\detail\\grille.shp", "coordX", "DOUBLE","","","")
arcpy.AddField_management(chem+"\\detail\\grille.shp", "coordY", "DOUBLE","","","")
arcpy.AddField_management(chem+"\\detail\\grille.shp", "itX", "DOUBLE","","","")
arcpy.AddField_management(chem+"\\detail\\grille.shp", "itY", "DOUBLE","","","")
arcpy.AddField_management(chem+"\\detail\\grille.shp", "sur_vis", "DOUBLE","","","")
arcpy.AddField_management(chem+"\\detail\\grille.shp", "sur_nn", "DOUBLE","","","")
arcpy.AddField_management(chem+"\\detail\\grille.shp", "pourc", "DOUBLE","","","")
##Itération
for ii in range(itX) :
	for jj in range(itY) :

		X = b + ii*esp
		Y = d +jj*esp
		rows = arcpy.InsertCursor(chem+"\\detail\\grille.shp")
		pointGeom = arcpy.Point(X,Y)

		newPoint = rows.newRow()
		newPoint.Shape = pointGeom
		newPoint.ID = (ii+1)*(jj+1)-1
		newPoint.coordX = X
		newPoint.coordY = Y
		newPoint.itX = ii
		newPoint.itY = jj
		rows.insertRow(newPoint)

		del rows
##Nettoyage
if  intersect_entree :
	arcpy.Intersect_analysis([chem+"\\detail\\grille.shp",intersect_entree],points_entree)
else :
	points_entree = chem+"\\detail\\grille.shp"

###Prise en compte du nombre de points si non renseigné ou si renseignement non valide
result = arcpy.GetCount_management(points_entree)
totalpoints = int(result.getOutput(0))

if nbr_entites > totalpoints or nbr_entites==0 :
	nbr_entites = int(totalpoints)
	arcpy.AddMessage("Entités de la grille : "+str(totalpoints))

else :
	arcpy.AddMessage("Entités à analyser : "+str(nbr_entites))
	arcpy.AddMessage("Entités de la grille : "+str(totalpoints))
	
### Calcul par point
for i in range(nbr_entites):
	arcpy.AddMessage("Point "+str(i+1)+"/"+str(nbr_entites))

	##Variables locales
	raster_sortie = chem +"\\temp\\visions"+str(i)
	point_cdv = chem +"\\temp\\ind"+str(i)+".shp"
	polygon =chem +"\\temp\\pol"+str(i)+".shp"
	polygon_in = chem +"\\temp\\pol_inter"+str(i)+".shp"
	polygon_ar = chem +"\\detail\\detail_point"+str(i)+".shp"
	where_clause = '"FID" = '+str(i)
	visible = 0.0
	nnvisible = 0.0
	fields = ['GRIDCODE', 'F_AREA']

	##Extraction du point
	arcpy.Select_analysis(points_entree, point_cdv, where_clause)

	##Champs de vision
	outViewshed = Viewshed(raster_in, point_cdv, zFactor, useEarthCurvature, refractivityCoefficient)
	outViewshed.save(raster_sortie)

	##Vectorisation
	arcpy.RasterToPolygon_conversion(raster_sortie, polygon, "NO_SIMPLIFY", "VALUE")

	##Intersection (si renseignée) - découper fait juste un rectangle
	if  intersect_entree :
		arcpy.Intersect_analysis([polygon,intersect_entree],polygon_in)
	else :
		polygon_in = polygon

	##Calcul des superficie
	arcpy.CalculateAreas_stats(polygon_in,polygon_ar) #disparition des paramètre (????)

	##Statistiques
	cursor = arcpy.SearchCursor(polygon_ar)
	for row in cursor:
		tst = row.getValue(fields[0])
		if tst == 0 :
			nnvisible = nnvisible + row.getValue(fields[1])
		else :
				visible = visible + row.getValue(fields[1])
	del cursor,row

	##Suppression des fichiers temporaires
	arcpy.Delete_management(raster_sortie)
	arcpy.Delete_management(point_cdv)
	arcpy.Delete_management(polygon)
	arcpy.Delete_management(polygon_in)
	##Implémentation des résultats
	pourc = 100*visible/(visible+nnvisible)
	liste.append([i,pourc,visible,nnvisible])



###Ecriture
##Dans la couche
if bool_fc == 1 :
	rows = arcpy.UpdateCursor(points_entree)
	i=0
	for row in rows:
		if i<nbr_entites :
			row.setValue("sur_vis", liste[i][2])
			row.setValue("sur_nn", liste[i][3])
			row.setValue("pourc", liste[i][1])
			rows.updateRow(row)
		i +=1

	del row,rows

##Dans le csv - obligatoire
if bool_csv == 1 :
	resultats = file(chem+"\\resultats.csv", "w")
	resultats.write("Identifiant numérique du point;Pourcentage de surface visible;Surface visible;Surface non visible")
	for j in liste :
		resultats.write("\r"+str(j[0])+";"+str(j[1])+"%;"+str(j[2])+";"+str(j[3]))


##Cartographie
if bool_carto == 1 :
	##fichiers de forme
	lyrs = ["s_intersect","s_valMax","p_surfaceAbs","p_pourcentage"]

	##Calcul de la valeur maximale
	valeur_max = 0
	for val in liste :
		if val[1] >  valeur_max :
			valeur_max = val[1]
			id_max = liste.index(val)
	arcpy.AddMessage("Surface maximale : point "+str(id_max))
	couche_max = chem +"\\detail\\detail_point"+str(id_max)+".shp"

	##Liste des couches
	layers = [intersect_entree,couche_max,points_entree,points_entree]

	##Création du document et du dataframe
	mxd = arcpy.mapping.MapDocument("CURRENT")
	dataframe = arcpy.mapping.ListDataFrames(mxd)[0]

	##Cartographie du raster
	arcpy.MakeRasterLayer_management(raster_in, "rast")
	arcpy.ApplySymbologyFromLayer_management("rast", env_lyr+"\\r_mnt.lyr")
	map_insert = arcpy.mapping.Layer("rast")
	arcpy.mapping.AddLayer(dataframe, map_insert, "AUTO_ARRANGE")

	##Cartographie des couches vectorielles
	it = 0 
	for layer in layers :		
		arcpy.MakeFeatureLayer_management(layer, lyrs[it])
		arcpy.ApplySymbologyFromLayer_management(lyrs[it], env_lyr+"\\"+lyrs[it]+".lyr")
		map_insert = arcpy.mapping.Layer(lyrs[it])
		arcpy.mapping.AddLayer(dataframe, map_insert, "AUTO_ARRANGE")
		del map_insert
		it += 1

	##export de la carte
	arcpy.mapping.ExportToSVG(mxd, chem + "\\resultats")
	del mxd

###Suppression globale
arcpy.Delete_management(raster_in)
arcpy.Delete_management(chem+"\\detail\\grille.shp")
if bool_fc == 0 :
	arcpy.Delete_management(points_entree)
if bool_detail == 0 :
	for i in range(nbr_entites):
		polygon_ar = chem +"\\detail\\detail_point"+str(i)+".shp"
		arcpy.Delete_management(polygon_ar)
#shutil.rmtree(chem+"\\temp")
