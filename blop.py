# -*- coding: utf-8  -*-

#-------------------------------------------------------------------------------
# Name:        test_params.py
# Objet:        calculs de visibilité appliqué à un ensemble de points
#
# Auteur:      Sarah Cabarry
#
# Date de création:     1/06/2017
# Copyright:   (c) scabarry 2017
# Licence:
#-------------------------------------------------------------------------------

### Import des modules
import arcpy
import shutil
import os
from arcpy import env
from arcpy.sa import *

### Configuration
arcpy.env.overwriteOutput = True
arcpy.CheckOutExtension("Spatial")

### Variables gloables
# Paramètres
raster_entree = arcpy.GetParameterAsText(0)
points_entree = arcpy.GetParameterAsText(1)
nbr_entites = arcpy.GetParameter(2)
fichier_sortie = arcpy.GetParameterAsText(3)
intersect_entree = arcpy.GetParameterAsText(4)
j=0
chem = os.path.split(fichier_sortie)[0]
raster_in= chem +"\\temp\\raster_inter"


# Champs de vision
zFactor = 2
useEarthCurvature = "CURVED_EARTH"
refractivityCoefficient = 0.15

# Sortie
liste = []
resultats = open(fichier_sortie, "w")

###Dossier fichiers temporaires
arcpy.CreateFolder_management(chem, "temp")

###Identification des points et dénombrement
arcpy.AddField_management(points_entree, "ID_p", "TEXT","","","")
curs = arcpy.UpdateCursor(points_entree)
for row in curs:
    tst = row.setValue("ID_p","pt_"+str(j))
    j += 1

del curs,row

###Prise en compte du nombre de points si non renseigné ou si renseignement non valide
if nbr_entites>j or nbr_entites==0 :
   nbr_entites = j

###Etendue rectangulaire de la couche intersect...
###...intersection du raster(si renseignée)
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

### Calcul par point
for i in range(nbr_entites):

    arcpy.AddMessage("Point "+str(i))

    # Variables locales
    raster_sortie = chem +"\\temp\\visions"+str(i)
    point_cdv = chem +"\\temp\\ind"+str(i)+".shp"
    polygon =chem +"\\temp\\pol"+str(i)+".shp"
    polygon_in = chem +"\\temp\\pol_inter"+str(i)+".shp"
    polygon_ar = chem +"\\temp\\pol_area"+str(i)+".shp"
    where_clause = '"FID" = '+str(i)
    visible = 0.0
    nnvisible = 0.0
    fields = ['GRIDCODE', 'F_AREA']
    
    # Extraction du point
    arcpy.Select_analysis(points_entree, point_cdv, where_clause)

    # Champs de vision
    outViewshed = Viewshed(raster_in, point_cdv, zFactor, useEarthCurvature, refractivityCoefficient)
    outViewshed.save(raster_sortie)
   
    # Vectorisation
    arcpy.RasterToPolygon_conversion(raster_sortie, polygon, "NO_SIMPLIFY", "VALUE")

    #Intersection (si renseignée) - découper fait juste un rectangle
    if  intersect_entree :
        arcpy.Intersect_analysis([polygon,intersect_entree],polygon_in)
    else :
        polygon_in = polygon

    # Calcul des superficie
    arcpy.CalculateAreas_stats(polygon_in,polygon_ar)
    
    # Statistiques
    cursor = arcpy.SearchCursor(polygon_ar)
    for row in cursor:
        tst = row.getValue(fields[0])
        if tst == 0 :
            nnvisible = nnvisible + row.getValue(fields[1])
        else :
                visible = visible + row.getValue(fields[1])
    del cursor,row
    
    # Suppression des fichiers temporaires
##    arcpy.Delete_management(raster_sortie)
##    arcpy.Delete_management(point_cdv)
##    arcpy.Delete_management(polygon)
##    arcpy.Delete_management(polygon_in)
##    arcpy.Delete_management(raster_in)
##    arcpy.Delete_management(polygon_ar)
   

    # Implémentation des résultats
    pourc = 100*visible/(visible+nnvisible)
    liste.append([i,pourc,visible,nnvisible])

###Suppression globale
arcpy.DeleteField_management (points_entree, "ID_p")
#shutil.rmtree(chem+"\\temp")

### Ecriture
resultats.write("Identifiant numérique du point;Pourcentage de surface visible;Surface visible;Surface non visible")
for j in liste :
    resultats.write("\r"+str(j[0])+";"+str(j[1])+"%;"+str(j[2])+";"+str(j[3]))


