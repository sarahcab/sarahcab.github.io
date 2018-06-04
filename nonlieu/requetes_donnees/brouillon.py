#-------------------------------------------------------------------------------
# Name:        module1
# Purpose:
#
# Author:      Sarah
#
# Created:     12/04/2018
# Copyright:   (c) Sarah 2018
# Licence:     <your licence>
#-------------------------------------------------------------------------------

import psycopg2

con = psycopg2.connect(database='postgis_24_sample', user='postgres', password="postgres", port="5433")
cur = con.cursor()

comm = 'FR3159570090'

cur.execute('''
select cheminee.gid,cheminee.gidsit,communes_eurostat.comm_name from cheminee,communes_eurostat
where st_intersects((select communes_eurostat.geom where communes_eurostat.comm_id LIKE %(comm_id)s),cheminee.geom)
''',{'comm_id':comm})

b = cur.fetchall()

print b

con.close()