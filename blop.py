import qgis
from qgis.core import *
from qgis.gui import *
from qgis.analysis import  *
import processing
import os
import shutil
import string

##Raster distance version 13=name

#  ##data=file
#  ##emprise=vector

data="\\gpsrv1.univ-lille1.fr\Dossier_Utilisateurs_2\GEOGRAPHIE\DOCTORANTS\cabarry\Bureau\eric_masson\clc_44\catalogue.csv"
emprise="//gpsrv1.univ-lille1.fr/Dossier_Utilisateurs_2/GEOGRAPHIE/DOCTORANTS/cabarry/Bureau/eric_masson/emprise/nord.shp"
##sortie=string

##size=number 100.0
##tolerance=number 0.6
##result=output raster
##result_contmax=output raster
##result_nodata=output raster
##result_tolerance=output raster

##out1=output file
##out2=output file
##out3=output file

#Creation du repertoire de fichier temporaire (necessaire pour une boucle)
rep_data= os.path.split(data)[0]
rep_temp= rep_data+"/temp"+sortie
var = "temp"+sortie

if var not in os.listdir(rep_data) :
    print("Creation du dossier \'temp\'")
    os.mkdir(rep_temp)
else :
    print("Dossier \'temp\' existant")


#Emprise : preparation de la couche (rasterisation)
layer_emprise = QgsVectorLayer(emprise, "salut", "ogr")

temp_emprise0=rep_temp+"/emprise_t0.shp" #faut pas les appeler pareil au cas ou l'une des donnees s'appelerait comme ca
temp_emprise1=rep_temp+"/emprise_t1.shp"
raster_emprise=rep_temp+"/emprise_raster.tif"

extent = layer_emprise.extent()
xmin = extent.xMinimum()
xmax = extent.xMaximum()
ymin = extent.yMinimum()
ymax = extent.yMaximum()

processing.runalg('qgis:addfieldtoattributestable', emprise, 'CHAMPI', 2, 20, 0, temp_emprise0)
processing.runalg('qgis:fieldcalculator', temp_emprise0, 'CHAMPI', 2, 20, 0, False,"1", temp_emprise1)

processing.runalg("gdalogr:rasterize",
               {"INPUT": temp_emprise1,
               "FIELD":'CHAMPI',
               "WIDTH":size,
               "HEIGHT":size,
               "RAST_EXT":"%f,%f,%f,%f"% (xmin, xmax, ymin, ymax),
               "TFW":1,
               "RTYPE":4,
               "NO_DATA":0,
               "COMPRESS":0,
               "ZLEVEL":1,
               "PREDICTOR":1,
               "TILED":False,
               "BIGTIFF":2,
               "EXTRA": '',
               "OUTPUT":raster_emprise})

#Boucle dans les entites cibles
#Variables
ls_layers=[]
type56=[]
facteurs=[]

total = 0.0
alpha = string.ascii_lowercase
ind = -1
formule = ""
content  = open(data,"r")

#Premiere boucle (contraintes distance et perimetre)
for i in content :

    if ind > -1 :
        row = i.split(";")

        input = row[1]
        print(i)
        print(i.split(".")[0])
        layer = QgsVectorLayer(input, "salut", "ogr")
        if not layer.isValid():
            print "Layer failed to load : "+i
        else :
            temp0=rep_temp+"/"+ i.split(".")[0]+"_temp0.shp"
            temp1=rep_temp+"/"+ i.split(".")[0]+"_temp1.shp"

            extent = layer.extent()
            xmin = extent.xMinimum()
            xmax = extent.xMaximum()
            ymin = extent.yMinimum()
            ymax = extent.yMaximum()

            processing.runalg('qgis:addfieldtoattributestable', input, 'CHAMPI', 2, 20, 0, temp0)
            processing.runalg('qgis:fieldcalculator', temp0, 'CHAMPI', 2, 20, 0, False,"1", temp1)

            if row[2]=="1" or row[2]=="2" :
                temp2=rep_temp+"/"+ i.split(".")[0]+"_temp2.tif"
                temp3=rep_temp+"/"+ i.split(".")[0]+"_r.tif"
                temp4=rep_temp+"/"+ i.split(".")[0]+"_temp4.tif"
                temp5=rep_temp+"/"+ i.split(".")[0]+"_rd.tif"

                processing.runalg("gdalogr:rasterize",
                               {"INPUT":temp1,
                               "FIELD":'CHAMPI',
                               "WIDTH":size,
                               "HEIGHT":size,
                               "RAST_EXT":"%f,%f,%f,%f"% (xmin, xmax, ymin, ymax),
                               "TFW":1,
                               "RTYPE":4,
                               "NO_DATA":0,
                               "COMPRESS":0,
                               "ZLEVEL":1,
                               "PREDICTOR":1,
                               "TILED":False,
                               "BIGTIFF":2,
                               "EXTRA": '',
                               "OUTPUT":temp2})

                processing.runalg('gdalogr:proximity', temp2,1, 0, -1, -1, -1,6, temp3)

                #emprise
                processing.runalg('saga:rastercalculator', temp3, raster_emprise, "ifelse(b=0,0/0,a)",0, 8,temp4)

                #normalisation
                blop = processing.runalg('qgis:rasterlayerstatistics',temp4 ,out1)
                max = blop['MAX']
                if row[4][:-1] !="":
                    maxmin = float(row[4][:-1])
                    if row[2]=="1" :
                        form="ifelse(a>"+str(maxmin)+",1,a/"+str(maxmin)+")"  #si maxmin>max, la couche ira de 0 azx avec x<1 (x = maxmin/max)
                    else :
                        if float(maxmin)>max :
                            form = 1
                        else :
                            form="ifelse(a<"+str(maxmin)+",0,(a-"+str(maxmin)+")/("+str(max)+"-"+str(maxmin)+"))"
                            print(form)
                else :
                    form = "a/"+str(max)
                print(form)
                processing.runalg('saga:rastercalculator', temp4, None, form ,0, 8,temp5)

                ls_layers.append(temp5)
            else :
                temp2=rep_temp+"/"+ i.split(".")[0]+"_ttemp2.shp"
                temp3=rep_temp+"/"+ i.split(".")[0]+"_ttemp3.tif"
                temp4=rep_temp+"/"+ i.split(".")[0]+"_ras.tif"

                #buffer
                if row[4][:-1] !="":
                    buff = float(row[4][:-1])
                    processing.runalg('qgis:fixeddistancebuffer', temp1, buff, 5,False, temp2)
                else :
                    temp2=temp1

                processing.runalg("gdalogr:rasterize",
                               {"INPUT":temp2,
                               "FIELD":'CHAMPI',
                               "WIDTH":size,
                               "HEIGHT":size,
                               "RAST_EXT":"%f,%f,%f,%f"% (xmin, xmax, ymin, ymax),
                               "TFW":1,
                               "RTYPE":4,
                               "NO_DATA":0,
                               "COMPRESS":0,
                               "ZLEVEL":1,
                               "PREDICTOR":1,
                               "TILED":False,
                               "BIGTIFF":2,
                               "EXTRA": '',
                               "OUTPUT":temp3})

                #emprise
                processing.runalg('saga:rastercalculator', temp3, raster_emprise, "ifelse(b=0,0/0,a)",0, 8,temp4)
                ls_layers.append(temp4)

            if row[2] != "0" and  row[2] != "5" and  row[2] != "6":
                if formule != "" :
                    formule+=" + "
                else :
                    formule +="("
                if row[2]=="1" or row[2]=="4" :
                    add= alpha[ind]+"*"+row[3]
                    formule+=add
                if row[2]=="2" or row[2]=="3" :
                    add= "(1-"+alpha[ind]+")*"+row[3]
                    formule+=add

                total += float(row[3])
            if row[2]=="5":
                type56.append(alpha[ind])
                facteurs.append("5")
            if row[2]=="6":
                type56.append(alpha[ind])
                facteurs.append("6")
    ind +=1

formule += ")/"+str(total)

#Premiere sortie
processing.runalg('saga:rastercalculator',ls_layers[0], ls_layers[1:], formule,0, 8,result)

print(formule)

if len(type56) != 0 :
    #Deuxieme boucle(contraintes reglementiaires et redibitoires)
    for i in range(len(type56)) :
        facteur=facteurs[i]
        if facteur == "5" :
            formule_contmax = "ifelse("+type56[i]+"=0,1,"+formule+")"
        else :
            formule_contmax = "ifelse("+type56[i]+"=0,"+formule+",1)"

    #Deuxieme sortie
    processing.runalg('saga:rastercalculator',ls_layers[0], ls_layers[1:], formule_contmax,0, 8,result_contmax)

    #Troiseme boucle
    for i in range(len(type56)) :
        facteur=facteurs[i]
        if facteur == "5" :
            formule_nodata = "ifelse("+type56[i]+"=0,0/0,"+formule+")"
        else :
            formule_nodata = "ifelse("+type56[i]+"=0,"+formule+",0/0)"


    #Troisieme sortie
    processing.runalg('saga:rastercalculator',ls_layers[0], ls_layers[1:], formule_nodata,0, 8,result_nodata)

#Quatrieme sortie : tolerance
processing.runalg('saga:rastercalculator',result, None, "ifelse(a<"+str(tolerance)+",a,0/0)",0, 8,result_tolerance)

print(ls_layers)
print(ls_layers[0])
print(ls_layers[1:])
stats = processing.runalg('qgis:rasterlayerstatistics',result ,out1)
print stats
#stats2 = processing.runalg('qgis:rasterlayerstatistics',result_contmax ,out2)
#print stats2
#stats3 = processing.runalg('qgis:rasterlayerstatistics',result_nodata ,out3)
#print stats3

#Suppression (echec)
try :
    shutil.rmtree(rep_temp)
except :
    print "erreur dans la suppressions des fichiers temporaires : verouillage -> veuillez supprimer le dossier \'temp\'"
