import sys
import requests
from requests.auth import HTTPProxyAuth

from bs4 import BeautifulSoup

import re

proxies = {
			"http":"http://abc123:abc123@172.16.115.89:3128",
			"https":"https://abc123:abc123@172.16.115.89:3128"
          }


searchstring = ""

for i in range(1, len(sys.argv)):
     searchstring += str(sys.argv[i]) + "+"

name = []

print(searchstring)
r = requests.get('http://www.google.com/search?q=' + searchstring + 'google+scholar&btnI=10')#,proxies=proxies)
pre = "http://duckduckgo.com/?q=!ducky+"
soup = BeautifulSoup(r.content, "html5lib")

print(soup.title)

# find all data and strip spaces
for div in soup.find_all("a",{"class":"gsc_a_at"}):
        name.append(div.string.strip())

print("\n", name)

with open("./data/papers.txt", "w") as f:
        for string in name:
            f.write(string + "****")
            string = re.sub(r'[^a-z A-Z ]', "", string)
            string=string.replace(' ','+')
            string=pre+string
            f.write(string + "\n")
