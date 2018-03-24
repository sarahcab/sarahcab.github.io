# coding: utf-8

#-------------------------------------------------------------------------------
# Name:        module1
# Purpose:     Récup les données de ça et faire un tableau : https://www.passportindex.org/comparebyPassport.php?p1=ps&fl=&s=yes
#
# Author:      Sarah
#
# Created:     21/03/2018
# Copyright:   (c) Sarah 2018
# Licence:     <your licence>
#-------------------------------------------------------------------------------
import requests
r = requests.post("https://www.passportindex.org/comparebyPassport.php?p1=af&p2=al&p3=ad&fl=&s=yes")

ls_code=[]
ls_data=[]

for row in (r.text).split("\n") :
    print(row)
##    print("----------------------")
    if '<tr class="all_row row_' in row :
        code = row.split('<tr class="all_row row_')[1].split(" ")[0]
        ls_code.append(code)
##        for row2 in (r.text).split("\n") :
##            print(row2)
##            if u'class="col1 col1_'+code in row2 :
##                ty = row2##.split(">")[1]##.split("<")[0]
##        ls_data.append([code,ty])


print ls_code
print ls_data

##On répète pour tous
##for co in ls_code :
##    r = requests.get("https://www.passportindex.org/comparebyPassport.php?p1=fr&fl=&s=yes")
##    for row in (r.text).split("\n") :
##        if '<tr class="all_row row_' in row :
##            code = row.split('<tr class="all_row row_')[1].split(" ")[0]
##            ty =