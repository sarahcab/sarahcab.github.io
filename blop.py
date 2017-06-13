# -*- coding: utf-8  -*-

#-------------------------------------------------------------------------------
# Name:		test_params.py
# Objet:	Calculs de visibilité appliqués à un ensemble de points donné
#
# Auteur:	  Sarah Cabarry
#
# Date de création:	 01/06/2017
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
points_param = arcpy.GetParameterAsText(1)
nbr_entites = arcpy.GetParameter(2)
intersect_entree = arcpy.GetParameterAsText(3)
chem = arcpy.GetParameterAsText(4)
bool_csv = arcpy.GetParameter(5)
bool_fc = arcpy.GetParameter(6)
bool_detail = arcpy.GetParameter(7)
bool_carto = arcpy.GetParameter(8)
env_lyr = arcpy.GetParameterAsText(9)
bool_dataviz = arcpy.GetParameter(10)

points_entree = chem+"\\couche_in.shp"
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

###Nettoyage de la couche points
if  intersect_entree :
	arcpy.Intersect_analysis([points_param,intersect_entree],points_entree)
else :
	points_entree = points_param #pas de nettoyage : on teste avec le try si le point est bien dans le raster, comme c'est fait avec la grille

###Prise en compte du nombre de points si non renseigné ou si renseignement non valide
result = arcpy.GetCount_management(points_entree)
totalpoints = int(result.getOutput(0))

if nbr_entites > totalpoints or nbr_entites==0 :
	nbr_entites = int(totalpoints)
	arcpy.AddMessage("Entités de la couche : "+str(totalpoints))

else :
	arcpy.AddMessage("Entités à analyser : "+str(nbr_entites))
	arcpy.AddMessage("Entités de la couche : "+str(totalpoints))

clear_entites = nbr_entites
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
	
	##Points vides
	vide = []
	
	##Pour les points inclus dans le raster : 
	try : 
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
		if  intersect_entree :
			arcpy.Delete_management(polygon)
		arcpy.Delete_management(polygon_in)
		##Implémentation des résultats
		pourc = 100*visible/(visible+nnvisible)
		liste.append([i,pourc,visible,nnvisible])
	
	except arcpy.ExecuteError: 
		arcpy.AddMessage("Le point "+str(i+1)+" se trouve à l'extérieur de la surface analysée")
		clear_entites = clear_entites - 1
		liste.append([i,0,"none","none"])

###Nouveau nombre d'entités
arcpy.AddMessage("Entités calculées  : "+str(clear_entites))

###Ecriture
##Dans la couche
if bool_fc == 1 :
	##Création des champs
	arcpy.AddField_management(points_entree, "sur_vis", "DOUBLE","","","")
	arcpy.AddField_management(points_entree, "sur_nn", "DOUBLE","","","")
	arcpy.AddField_management(points_entree, "pourc", "DOUBLE","","","")

	##Implémentation
	rows = arcpy.UpdateCursor(points_entree)
	i=0
	for row in rows:
		if i<nbr_entites and liste[i][2] != "" :
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
	
	##Calcul de la valeur maximale
	valeur_max = 0
	for val in liste :
		if val[1] >  valeur_max :
			valeur_max = val[1]
			id_max = liste.index(val)
	
	if id_max != "": 
		arcpy.AddMessage("Surface maximale : point "+str(id_max))
		couche_max = chem +"\\detail\\detail_point"+str(id_max)+".shp"

		if intersect_entree :
			##fichiers de forme	
			lyrs = ["s_intersect","s_valMax","p_surfaceAbs","p_pourcentage"]
			##Liste des classes
			layers = [intersect_entree,couche_max,points_entree,points_entree]
		else : 
			lyrs = ["s_valMax","p_surfaceAbs","p_pourcentage"]
			layers = [couche_max,points_entree,points_entree]

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
			
		##Export de la carte
		arcpy.mapping.ExportToSVG(mxd, chem + "\\resultats")
		
		##suppressions ######################a conditionner
		it = 0 
		for layer in layers :		
			arcpy.Delete_management(lyrs[it])
			it += 1
			
		del dataframe,mxd
		
	else : 
		arcpy.AddMessage("Aucun point dans la zone à analyser")

##Cartographie des couches destinées à la visulation interactive
if bool_dataviz == 1 :
	for i in range(nbr_entites):
		##Création du document et du dataframe
		mxd = arcpy.mapping.MapDocument("CURRENT")
		dataframe = arcpy.mapping.ListDataFrames(mxd)[0]

		##Cartographie des couches contenant la surface visible
		polygon_ar = chem +"\\detail\\detail_point"+str(i)+".shp"
		arcpy.MakeFeatureLayer_management(polygon_ar, "detail"+str(i))
		if env_lyr:
			arcpy.ApplySymbologyFromLayer_management("detail"+str(i), env_lyr+"\\s_valMax.lyr")
		map_insert = arcpy.mapping.Layer("detail"+str(i))
		arcpy.mapping.AddLayer(dataframe, map_insert, "AUTO_ARRANGE")
		del map_insert
	
	##Cartographie de la couche point et intersect
	arcpy.MakeFeatureLayer_management(points_entree, "points_carto")
	map_insert = arcpy.mapping.Layer("points_carto")
	arcpy.mapping.AddLayer(dataframe, map_insert, "AUTO_ARRANGE")
	if intersect_entree : 
		arcpy.MakeFeatureLayer_management(intersect_entree, "intersection")
		inter_insert = arcpy.mapping.Layer("intersection")
		arcpy.mapping.AddLayer(dataframe, inter_insert, "AUTO_ARRANGE")
	
	##Export
	arcpy.mapping.ExportToSVG(mxd, chem + "\\detail_visuel")
	del mxd, map_insert, dataframe
	
		
###Suppression globale
if intersect_entree : 
	arcpy.Delete_management(raster_in)
	if bool_fc == 0 :
		arcpy.Delete_management(points_entree)
if bool_detail == 0 :
	for i in range(nbr_entites):
		if liste[i][2] != "none" :
			polygon_ar = chem +"\\detail\\detail_point"+str(i)+".shp"
			arcpy.Delete_management(polygon_ar)
#shutil.rmtree(chem+"\\temp")
