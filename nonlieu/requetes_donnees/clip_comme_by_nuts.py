# -*- coding: utf-8  -*-

#-------------------------------------------------------------------------------
# Name:        module1
# Purpose:
#
# Author:      Sarah
#
# Created:     20/04/2018
# Copyright:   (c) Sarah 2018
# Licence:     <your licence>
#-------------------------------------------------------------------------------

##----------------------- Paramètre globaux
##---- Définis
srid=4326

##----------------------- Modules
import psycopg2

##----------------------- Connexion à la base
con = psycopg2.connect(database='postgis_24_sample', user='postgres', password="postgres", port="5433")
cur = con.cursor()

##----------------------- Liste des pays
cur.execute('''
    select  distinct(cntr_code) from communes_eurostat
''')

ls_count = []
for i in cur.fetchall() :
    ls_count.append(i[0].lower())

print ls_count



for l in ls_count :
    if l :
        req0 = "DROP TABLE IF EXISTS comm_bynuts." + l
        cur.execute(req0)

        req1 = 'CREATE TABLE comm_bynuts.'+l + ''' (
            gid SERIAL,
            comm_id TEXT,
            comm_name TEXT,
            cntr_code TEXT,
            nuts_id TEXT,
            nuts_name TEXT)
        '''
        cur.execute(req1)

        req2 = "SELECT AddGeometryColumn('comm_bynuts','"+l+"', 'geom',  %(srid)s, 'MULTIPOLYGON', 2, false)"
        cur.execute(req2,{'srid':srid})

        req3 = "INSERT INTO comm_bynuts."+l+" (comm_id,comm_name,cntr_code,nuts_id,geom) (select comm_id,comm_name,cntr_code,nuts_code,geom from communes_eurostat where communes_eurostat.cntr_code LIKE '"+l.upper()+"')"
        cur.execute(req3)

##----------------------- Liste des nuts
cur.execute('''
    select  distinct(nuts_code) from communes_eurostat
''')

ls_nuts = []
for i in cur.fetchall() :
    ls_nuts.append(i[0])

for l in ls_nuts :
    if l :
        req4 = "update comm_bynuts."+l[:2].lower()+" set nuts_name = (select nuts_name from nuts_eurostat where nuts_eurostat.nuts_id LIKE '"+l+"') where nuts_id LIKE '"+l+"'"
        cur.execute(req4)

con.commit()
con.close()