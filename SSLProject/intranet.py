import requests
from bs4 import BeautifulSoup

r = requests.get('https://www.iitg.ernet.in/cseweb/automation/people?statusCode=3c6234c6f6ff2880ec3c0c979ba87ba4')

soup = BeautifulSoup(r.content, "html5lib")

name = []
title = []
email =[]
phone = []
room = []
research = []

# find all data and strip spaces
for div in soup.find_all('em'):
    if 'Prof' in div.string:
        title.append(div.string.strip())

for div in soup.find_all('strong'):
    if 'eMail' in div.string:
        email.append(div.next_sibling.string.strip())
        continue
    if 'Phone' in div.string:
        phone.append(div.next_sibling.string.strip())
        continue
    if 'Room' in div.string:
        room.append(div.next_sibling.string.strip())
        continue
    if 'Research' in div.string:
        research.append(div.next_sibling.string.strip())
        continue

    # must be a name otherwise
    name.append(div.string.strip())

# check if we got everything
if(len(name) == len(title) == len(email) == len(phone) == len(room) == len(research)):
    print(len(name), "details extracted.")
else:
    print("Data error!")
    print(len(name), len(title), len(email), len(phone), len(room), len(research))

filelist = ['name', 'title', 'email', 'phone', 'room', 'research']
for filename in filelist:
    with open("./data/" + filename + ".txt", "w") as f:
        for string in eval(filename):
            f.write(string + "\n")
