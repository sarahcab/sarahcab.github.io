# coding: utf8

#-------------------------------------------------------------------------------
# Name:        module1
# Purpose:
#
# Author:      Sarah
#
# Created:     08/03/2018
# Copyright:   (c) Sarah 2018
# Licence:     <your licence>
#-------------------------------------------------------------------------------
##from __future__ import unicode_literals
##import encodings
import os
f=open(ur"C:\\Users\\Sarah\\Documents\\nonlieu\\requetes_donnees\\donnees_test_v2\\chemineurss.csv", 'r')


##f2=f.encode('utf-8')
##f2.readline()


for row in f :
    print row.decode('utf-8')
##    valeurs = row.split(";")
##    lsvals=[]
##    for v in valeurs :
##        lsvals.append(v)
##    ls_chems.append(lsvals)