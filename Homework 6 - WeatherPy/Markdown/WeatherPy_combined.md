

```python
from IPython.display import Image
Image(filename = 'lights_at_night.jpg', width = 2000, height = 2000)
```




![jpeg](output_0_0.jpeg)



<h1><center> WeatherPy - Homework 6 - API</center></h1>

#### 3 Observations

* Latitude affects temperature: It is common sense that as you get closer to the equator the temperature will rise.  This is clearly shown in the Latitude vs. Temperature graph with the curvlinear relationship demonstrating the change in temperature for cities with high and low latitudes.

* It appears that Latitude and Cloudiness are independent of each other.  There is no discernable relationship between Latitude and Cloudiness shown in Plot 3, with cities of varying Latitude showing varying values of Cloudiness.

* 72% of the randomly selected cities are in the northern hemisphere. 


#### Environment Setup


```python
# Dependencies and Setup
import matplotlib.pyplot as plt
import pandas as pd
import numpy as np
import json
from requests import get
from time import sleep
from pprint import pprint
from config import api_key
from datetime import datetime
```

#### Generate 500+ Random City Names


```python
#
# This code cell was provided as starter code
#

# Incorporated citipy to determine city based on latitude and longitude
from citipy import citipy

# Range of latitudes and longitudes
lat_range = (-90, 90)
lng_range = (-180, 180)

# List for holding lat_lngs and cities
lat_lngs = []
cities = []

# Create a set of random lat and lng combinations
lats = np.random.uniform(low = -90.000, high = 90.000, size = 1500) # Adjust the size for more cities
lngs = np.random.uniform(low = -180.000, high = 180.000, size = 1500) # Must match above N size

lat_lngs = zip(lats, lngs)

# Identify nearest city for each lat, lng combination
for lat_lng in lat_lngs:
    
    city = citipy.nearest_city(lat_lng[0], lat_lng[1]).city_name
    
    # If the city is unique, then add it to a our cities list
    if city not in cities:
        
        cities.append(city)
```

#### Initalize needed objects for API calls


```python
# Setup the cities iterator
city_list = [str(i) for i in cities]

# Initialize needed objects
city_count = 0
city_data = pd.DataFrame()
```

#### API Call
###### Note: This takes a few minutes ...


```python
# For loop through the cities iterator, pulling needed data from the JSON request object
for city in city_list:
    
    # Get JSON response file for each city
    response = get('http://api.openweathermap.org/data/2.5/weather?q='
                   + city
                   + '&APPID='
                   + api_key 
                   + '&units=metric').json()
    
    # Pause for 1.175 seconds (70.5 seconds for 60 requests) 
    # to ensure compliance with request rate of 60 calls per minute
    sleep(1.175)
    
    try:
        
        # Test response code of JSON file for cities not found
        if response['cod'] == 200:
            
            # Pull needed data from JSON response object and insert into a dictionary
            city_dict = {
                'city_id': response['id'],
                'name': response['name'],
                'country': response['sys']['country'],
                'longitude': response['coord']['lon'],
                'latitude': response['coord']['lat'],
                'cloudiness': response['clouds']['all'],
                'humidity': response['main']['humidity'],
                'temperature': response['main']['temp'],
                'wind_speed': response['wind']['speed'],
                'time': response['dt']
            }
        
            # Create a temporary single row dataframe with the current cities data
            temp_df = pd.DataFrame(city_dict, index = ['city']).set_index('city_id')  
        
            # Add the temporary dataframe row to the pre-intialized city_data DataFrame
            city_data = pd.concat([city_data, temp_df])
        
            # Add 1 for each city iteration to the city counter
            city_count += 1
        
            # Collect the current cities name
            city_name = city_dict['name']    
            
            # Re-intialise the city dictionary to be empty for the next interation
            city_dict = {}
            
        else:
            
            print('City not found ... skipping.')
    
    # Raise a KeyError if a cities JSON response does not include all of the needed data
    except KeyError as e:
        
        print(f'Skipping city ... : KeyError: {e} not found.') 
    
    print(f'Accessing city # {city_count} | {city_name}')

```

    Accessing city # 1 | Auki
    Accessing city # 2 | Georgetown
    Accessing city # 3 | Avarua
    Accessing city # 4 | Peniche
    Accessing city # 5 | East London
    Accessing city # 6 | Karema
    Accessing city # 7 | Ancud
    Accessing city # 8 | Hobart
    Accessing city # 9 | Narsaq
    Accessing city # 10 | Fairbanks
    Accessing city # 11 | Dzilam Gonzalez
    Accessing city # 12 | Kruisfontein
    Accessing city # 13 | Luwuk
    Accessing city # 14 | Yellowknife
    Accessing city # 15 | Zilair
    Accessing city # 16 | Ribeira Grande
    Accessing city # 17 | Rikitea
    Accessing city # 18 | Vaini
    Accessing city # 19 | Mahebourg
    Accessing city # 20 | Provideniya
    Accessing city # 21 | Bathsheba
    City not found ... skipping.
    Accessing city # 21 | Bathsheba
    Accessing city # 22 | Brewster
    Accessing city # 23 | Atuona
    Accessing city # 24 | Punta Arenas
    City not found ... skipping.
    Accessing city # 24 | Punta Arenas
    Accessing city # 25 | Dikson
    Accessing city # 26 | Nuevitas
    Accessing city # 27 | Port Alfred
    Accessing city # 28 | Brigantine
    Accessing city # 29 | Bredasdorp
    Accessing city # 30 | New Norfolk
    Accessing city # 31 | Constitucion
    Accessing city # 32 | Saint-Philippe
    Accessing city # 33 | Phuthaditjhaba
    Accessing city # 34 | Severodvinsk
    Accessing city # 35 | Hermanus
    Accessing city # 36 | Pangai
    Accessing city # 37 | Codrington
    Accessing city # 38 | Albany
    Accessing city # 39 | Juba
    Accessing city # 40 | Batagay
    City not found ... skipping.
    Accessing city # 40 | Batagay
    Accessing city # 41 | Gazanjyk
    Accessing city # 42 | Ismailia
    City not found ... skipping.
    Accessing city # 42 | Ismailia
    Accessing city # 43 | Poya
    Accessing city # 44 | Vanavara
    City not found ... skipping.
    Accessing city # 44 | Vanavara
    Accessing city # 45 | Jamestown
    Accessing city # 46 | Arlit
    Accessing city # 47 | Puerto Leguizamo
    Accessing city # 48 | Bluff
    Accessing city # 49 | Pontianak
    Accessing city # 50 | Uyuni
    Accessing city # 51 | Bonthe
    Accessing city # 52 | Cluses
    Accessing city # 53 | Mataura
    City not found ... skipping.
    Accessing city # 53 | Mataura
    Accessing city # 54 | San Vicente
    Accessing city # 55 | Hovd
    Accessing city # 56 | Ushuaia
    Accessing city # 57 | Padang
    Accessing city # 58 | Arraial do Cabo
    Accessing city # 59 | Cervo
    Accessing city # 60 | Mahanoro
    Accessing city # 61 | Reo
    Accessing city # 62 | Khandbari
    Accessing city # 63 | Katsuura
    Accessing city # 64 | Bambous Virieux
    Accessing city # 65 | High Level
    City not found ... skipping.
    Accessing city # 65 | High Level
    Accessing city # 66 | Borazjan
    Accessing city # 67 | Aklavik
    Accessing city # 68 | Airai
    Accessing city # 69 | Chuy
    Accessing city # 70 | Cape Town
    Accessing city # 71 | Teya
    Accessing city # 72 | Kapaa
    Accessing city # 73 | Erzin
    Accessing city # 74 | Mayna
    Accessing city # 75 | Saint George
    Accessing city # 76 | Shu
    Accessing city # 77 | Chapais
    Accessing city # 78 | Saint-Joseph
    Accessing city # 79 | Udachnyy
    Accessing city # 80 | Tuatapere
    Accessing city # 81 | Zeljezno Polje
    Accessing city # 82 | Sarab
    Accessing city # 83 | Barrow
    Accessing city # 84 | San Felipe
    Accessing city # 85 | Bethel
    Accessing city # 86 | Baglan
    Accessing city # 87 | Fortuna
    Accessing city # 88 | Meulaboh
    Accessing city # 89 | Hilo
    Accessing city # 90 | Christchurch
    Accessing city # 91 | Itarema
    Accessing city # 92 | Carutapera
    Accessing city # 93 | Yerofey Pavlovich
    City not found ... skipping.
    Accessing city # 93 | Yerofey Pavlovich
    Accessing city # 94 | Portland
    City not found ... skipping.
    Accessing city # 94 | Portland
    Accessing city # 95 | Umm Lajj
    Accessing city # 96 | Qaanaaq
    Accessing city # 97 | Venice
    City not found ... skipping.
    Accessing city # 97 | Venice
    Accessing city # 98 | Sandakan
    Accessing city # 99 | Lexington Park
    City not found ... skipping.
    Accessing city # 99 | Lexington Park
    Accessing city # 100 | Verkhovazhye
    Accessing city # 101 | Nuuk
    Accessing city # 102 | Longyearbyen
    Accessing city # 103 | Luganville
    Accessing city # 104 | Arkhangelsk
    Accessing city # 105 | Kaitangata
    Accessing city # 106 | Vardo
    Accessing city # 107 | Skorodnoye
    City not found ... skipping.
    Accessing city # 107 | Skorodnoye
    Accessing city # 108 | Guerrero Negro
    Accessing city # 109 | Upernavik
    Accessing city # 110 | Busselton
    City not found ... skipping.
    Accessing city # 110 | Busselton
    City not found ... skipping.
    Accessing city # 110 | Busselton
    Accessing city # 111 | Ayan
    Accessing city # 112 | Luau
    Accessing city # 113 | Kargasok
    Accessing city # 114 | Adrar
    Accessing city # 115 | Ouesso
    Accessing city # 116 | Golden
    Accessing city # 117 | Torbay
    Accessing city # 118 | Ostrovskoye
    City not found ... skipping.
    Accessing city # 118 | Ostrovskoye
    Accessing city # 119 | San Quintin
    City not found ... skipping.
    Accessing city # 119 | San Quintin
    Accessing city # 120 | Pangkalanbuun
    Accessing city # 121 | Itacoatiara
    Accessing city # 122 | Vao
    Accessing city # 123 | Klin
    Accessing city # 124 | Qasigiannguit
    Accessing city # 125 | Bereda
    Accessing city # 126 | Rio Brilhante
    Accessing city # 127 | Umm Kaddadah
    Accessing city # 128 | Lebanon
    Accessing city # 129 | Tuktoyaktuk
    Accessing city # 130 | Leningradskiy
    Accessing city # 131 | Victoria
    Accessing city # 132 | Souillac
    Accessing city # 133 | Thompson
    Accessing city # 134 | Pangnirtung
    Accessing city # 135 | Nikolskoye
    City not found ... skipping.
    Accessing city # 135 | Nikolskoye
    Accessing city # 136 | Divo
    Accessing city # 137 | Port Lincoln
    Accessing city # 138 | Nagybajom
    Accessing city # 139 | Verkhoyansk
    Accessing city # 140 | Cranbrook
    Accessing city # 141 | Husavik
    Accessing city # 142 | Ostrovnoy
    Accessing city # 143 | Tasiilaq
    Accessing city # 144 | Chokurdakh
    Accessing city # 145 | Batman
    Accessing city # 146 | Dolores
    Accessing city # 147 | Amarante do Maranhao
    Accessing city # 148 | Sitborice
    Accessing city # 149 | Buzmeyin
    Accessing city # 150 | Khatanga
    Accessing city # 151 | Carnarvon
    Accessing city # 152 | Vanimo
    Accessing city # 153 | Belaya Gora
    Accessing city # 154 | High Prairie
    Accessing city # 155 | Barcelos
    Accessing city # 156 | Chumikan
    Accessing city # 157 | Ahipara
    City not found ... skipping.
    Accessing city # 157 | Ahipara
    Accessing city # 158 | Kalmunai
    Accessing city # 159 | Mount Gambier
    Accessing city # 160 | Leshukonskoye
    Accessing city # 161 | Yulara
    Accessing city # 162 | Nishihara
    Accessing city # 163 | Ewa Beach
    Accessing city # 164 | Talnakh
    Accessing city # 165 | Sibolga
    City not found ... skipping.
    Accessing city # 165 | Sibolga
    City not found ... skipping.
    Accessing city # 165 | Sibolga
    Accessing city # 166 | Tura
    Accessing city # 167 | Muros
    Accessing city # 168 | Port Elizabeth
    Accessing city # 169 | Deputatskiy
    Accessing city # 170 | Coquimbo
    Accessing city # 171 | Llangefni
    Accessing city # 172 | Faanui
    Accessing city # 173 | Wenling
    Accessing city # 174 | Muret
    Accessing city # 175 | Maniitsoq
    City not found ... skipping.
    Accessing city # 175 | Maniitsoq
    Accessing city # 176 | Morant Bay
    Accessing city # 177 | Walvis Bay
    Accessing city # 178 | Hirado
    City not found ... skipping.
    Accessing city # 178 | Hirado
    Accessing city # 179 | Roald
    Accessing city # 180 | Klaksvik
    Accessing city # 181 | Biltine
    Accessing city # 182 | Ypsonas
    Accessing city # 183 | Hami
    City not found ... skipping.
    Accessing city # 183 | Hami
    Accessing city # 184 | Tchibanga
    Accessing city # 185 | Ouallam
    Accessing city # 186 | Puerto Ayora
    City not found ... skipping.
    Accessing city # 186 | Puerto Ayora
    Accessing city # 187 | Kuryk
    Accessing city # 188 | Mar del Plata
    Accessing city # 189 | Zarubino
    Accessing city # 190 | Taoudenni
    Accessing city # 191 | Zhigansk
    Accessing city # 192 | Geraldton
    Accessing city # 193 | Lata
    Accessing city # 194 | Conceicao da Barra
    Accessing city # 195 | Cherskiy
    Accessing city # 196 | Ponta do Sol
    Accessing city # 197 | Iqaluit
    Accessing city # 198 | Tautira
    Accessing city # 199 | Noumea
    Accessing city # 200 | Osoyoos
    Accessing city # 201 | Vostok
    Accessing city # 202 | Rosarito
    Accessing city # 203 | Tezu
    Accessing city # 204 | Shirokiy
    Accessing city # 205 | Clyde River
    Accessing city # 206 | Somoto
    Accessing city # 207 | Lerwick
    Accessing city # 208 | Pokhara
    Accessing city # 209 | Caravelas
    Accessing city # 210 | Sartell
    Accessing city # 211 | Norman Wells
    Accessing city # 212 | Pandamatenga
    Accessing city # 213 | Kerema
    Accessing city # 214 | Chunhuhub
    City not found ... skipping.
    Accessing city # 214 | Chunhuhub
    Accessing city # 215 | Deming
    Accessing city # 216 | Hualmay
    City not found ... skipping.
    Accessing city # 216 | Hualmay
    Accessing city # 217 | Jiaocheng
    Accessing city # 218 | Dogondoutchi
    City not found ... skipping.
    Accessing city # 218 | Dogondoutchi
    Accessing city # 219 | Hithadhoo
    Accessing city # 220 | Safranbolu
    Accessing city # 221 | Kenai
    Accessing city # 222 | Saskylakh
    Accessing city # 223 | Don Benito
    City not found ... skipping.
    Accessing city # 223 | Don Benito
    Accessing city # 224 | Villarrica
    Accessing city # 225 | Butaritari
    Accessing city # 226 | Tongren
    Accessing city # 227 | Mangai
    Accessing city # 228 | Lockhart
    Accessing city # 229 | Saint-Pierre
    City not found ... skipping.
    Accessing city # 229 | Saint-Pierre
    Accessing city # 230 | Lashio
    Accessing city # 231 | Ayagoz
    Accessing city # 232 | Petropavlovsk-Kamchatskiy
    Accessing city # 233 | Hastings
    Accessing city # 234 | Vikulovo
    Accessing city # 235 | Lavrentiya
    City not found ... skipping.
    Accessing city # 235 | Lavrentiya
    Accessing city # 236 | Wakkanai
    Accessing city # 237 | Eyl
    Accessing city # 238 | Huarmey
    Accessing city # 239 | Tuy Hoa
    Accessing city # 240 | Havelock
    Accessing city # 241 | Vilhena
    Accessing city # 242 | Yarensk
    Accessing city # 243 | Tagusao
    Accessing city # 244 | Epe
    Accessing city # 245 | Hasaki
    City not found ... skipping.
    Accessing city # 245 | Hasaki
    Accessing city # 246 | Esperance
    Accessing city # 247 | Yankton
    Accessing city # 248 | Gabane
    Accessing city # 249 | Bossangoa
    Accessing city # 250 | Westport
    Accessing city # 251 | Bandarbeyla
    Accessing city # 252 | Soyo
    Accessing city # 253 | Grand Gaube
    Accessing city # 254 | Urengoy
    Accessing city # 255 | Dakar
    Accessing city # 256 | Khandyga
    Accessing city # 257 | Castro
    Accessing city # 258 | Skibbereen
    Accessing city # 259 | Mahibadhoo
    Accessing city # 260 | Slave Lake
    Accessing city # 261 | Nichinan
    Accessing city # 262 | Mier
    Accessing city # 263 | Ilulissat
    Accessing city # 264 | North Platte
    Accessing city # 265 | Tiksi
    Accessing city # 266 | Severo-Kurilsk
    Accessing city # 267 | Pevek
    Accessing city # 268 | Swift Current
    Accessing city # 269 | Honggang
    Accessing city # 270 | Kieta
    Accessing city # 271 | Grindavik
    Accessing city # 272 | Pucallpa
    Accessing city # 273 | Ryde
    Accessing city # 274 | Hofn
    Accessing city # 275 | Isangel
    Accessing city # 276 | Rakiv Lis
    Accessing city # 277 | Tres Arroyos
    Accessing city # 278 | Henderson
    Accessing city # 279 | Namatanai
    Accessing city # 280 | Faya
    Accessing city # 281 | Burhar
    Accessing city # 282 | Cap-aux-Meules
    Accessing city # 283 | Touros
    Accessing city # 284 | Kununurra
    Accessing city # 285 | Fukue
    Accessing city # 286 | Englehart
    Accessing city # 287 | Juybar
    Accessing city # 288 | Haines Junction
    Accessing city # 289 | Hobyo
    Accessing city # 290 | Port Moresby
    Accessing city # 291 | Rio Tercero
    Accessing city # 292 | Usinsk
    Accessing city # 293 | Sola
    Accessing city # 294 | Charters Towers
    Accessing city # 295 | Grand-Santi
    Accessing city # 296 | Lebu
    Accessing city # 297 | West Fargo
    City not found ... skipping.
    Accessing city # 297 | West Fargo
    Accessing city # 298 | Sitka
    Accessing city # 299 | Kodiak
    Accessing city # 300 | Nanortalik
    Accessing city # 301 | Katobu
    Accessing city # 302 | Solnechnyy
    Accessing city # 303 | Oranjestad
    City not found ... skipping.
    Accessing city # 303 | Oranjestad
    Accessing city # 304 | Thoen
    Accessing city # 305 | Pierre
    Accessing city # 306 | Yarada
    Accessing city # 307 | Veraval
    Accessing city # 308 | Omsukchan
    Accessing city # 309 | Marzuq
    City not found ... skipping.
    Accessing city # 309 | Marzuq
    Accessing city # 310 | Tevaitoa
    City not found ... skipping.
    Accessing city # 310 | Tevaitoa
    Accessing city # 311 | Baloda Bazar
    Accessing city # 312 | Yumen
    Accessing city # 313 | Baturaja
    Accessing city # 314 | Vila Velha
    Accessing city # 315 | San Rafael
    Accessing city # 316 | Karacabey
    Accessing city # 317 | Ballina
    Accessing city # 318 | Tadine
    Accessing city # 319 | Sampit
    Accessing city # 320 | Port Hedland
    Accessing city # 321 | Port Blair
    Accessing city # 322 | Carballo
    Accessing city # 323 | Kalghatgi
    Accessing city # 324 | Asyut
    Accessing city # 325 | Maxixe
    Accessing city # 326 | Mitu
    Accessing city # 327 | Vengerovo
    Accessing city # 328 | Oleksandrivka
    Accessing city # 329 | Kulhudhuffushi
    Accessing city # 330 | Amapa
    City not found ... skipping.
    Accessing city # 330 | Amapa
    City not found ... skipping.
    Accessing city # 330 | Amapa
    Accessing city # 331 | Manavalakurichi
    Accessing city # 332 | Kabwe
    Accessing city # 333 | Gornopravdinsk
    Accessing city # 334 | Florence
    Accessing city # 335 | Shagonar
    Accessing city # 336 | Birpur
    Accessing city # 337 | Sioux Lookout
    Accessing city # 338 | Shonguy
    Accessing city # 339 | Shache
    Accessing city # 340 | Bontang
    Accessing city # 341 | Traralgon
    Accessing city # 342 | Mizan Teferi
    Accessing city # 343 | North Bend
    Accessing city # 344 | Bandar-e Lengeh
    Accessing city # 345 | Cidreira
    Accessing city # 346 | Takoradi
    Accessing city # 347 | Sao Filipe
    Accessing city # 348 | Wanaka
    Accessing city # 349 | Chateauroux
    Accessing city # 350 | Quincy
    City not found ... skipping.
    Accessing city # 350 | Quincy
    City not found ... skipping.
    Accessing city # 350 | Quincy
    Accessing city # 351 | Rio Grande
    Accessing city # 352 | Burkburnett
    Accessing city # 353 | Atar
    Accessing city # 354 | Pareora
    Accessing city # 355 | Toropets
    Accessing city # 356 | Macenta
    Accessing city # 357 | Saint Lawrence
    Accessing city # 358 | Port Hardy
    City not found ... skipping.
    Accessing city # 358 | Port Hardy
    Accessing city # 359 | Severobaykalsk
    Accessing city # 360 | Alofi
    Accessing city # 361 | Nome
    Accessing city # 362 | Valparaiso
    Accessing city # 363 | Aden
    Accessing city # 364 | Nhulunbuy
    Accessing city # 365 | Karabash
    Accessing city # 366 | Axim
    Accessing city # 367 | Ekhabi
    Accessing city # 368 | Dingle
    Accessing city # 369 | Denizli
    Accessing city # 370 | Palmer
    Accessing city # 371 | Vila Franca do Campo
    Accessing city # 372 | Rybnaya Sloboda
    Accessing city # 373 | Tulsipur
    Accessing city # 374 | Nikolsk
    City not found ... skipping.
    Accessing city # 374 | Nikolsk
    City not found ... skipping.
    Accessing city # 374 | Nikolsk
    Accessing city # 375 | Daan
    Accessing city # 376 | Pakxan
    Accessing city # 377 | Myskhako
    Accessing city # 378 | Tripoli
    Accessing city # 379 | Plouzane
    Accessing city # 380 | Waingapu
    Accessing city # 381 | College
    Accessing city # 382 | Ust-Tsilma
    Accessing city # 383 | Margate
    City not found ... skipping.
    Accessing city # 383 | Margate
    Accessing city # 384 | Contamana
    Accessing city # 385 | Kavaratti
    City not found ... skipping.
    Accessing city # 385 | Kavaratti
    Accessing city # 386 | Seoul
    Accessing city # 387 | Inuvik
    Accessing city # 388 | Tricase
    City not found ... skipping.
    Accessing city # 388 | Tricase
    Accessing city # 389 | Canandaigua
    Accessing city # 390 | The Valley
    Accessing city # 391 | Luderitz
    Accessing city # 392 | Carros
    Accessing city # 393 | Gijon
    City not found ... skipping.
    Accessing city # 393 | Gijon
    Accessing city # 394 | Gondanglegi
    Accessing city # 395 | Lima
    Accessing city # 396 | Los Llanos de Aridane
    City not found ... skipping.
    Accessing city # 396 | Los Llanos de Aridane
    Accessing city # 397 | Tanout
    Accessing city # 398 | Deskati
    Accessing city # 399 | Patiya
    City not found ... skipping.
    Accessing city # 399 | Patiya
    Accessing city # 400 | Hohhot
    Accessing city # 401 | Zolochiv
    Accessing city # 402 | Emba
    Accessing city # 403 | Aliaga
    Accessing city # 404 | Kingsville
    Accessing city # 405 | Springfield
    Accessing city # 406 | Hirara
    Accessing city # 407 | Placerville
    Accessing city # 408 | Romita
    Accessing city # 409 | Truth or Consequences
    Accessing city # 410 | Vestmannaeyjar
    Accessing city # 411 | Pilane
    Accessing city # 412 | Tual
    Accessing city # 413 | Araguari
    Accessing city # 414 | Cayenne
    Accessing city # 415 | Kavieng
    Accessing city # 416 | Dawei
    Accessing city # 417 | Ishigaki
    Accessing city # 418 | Abu Samrah
    Accessing city # 419 | Kamaishi
    Accessing city # 420 | Kholodnyy
    Accessing city # 421 | Wadi Musa
    Accessing city # 422 | Gillette
    Accessing city # 423 | Cockburn Town
    Accessing city # 424 | Moussoro
    Accessing city # 425 | Khanapur
    Accessing city # 426 | Mehamn
    Accessing city # 427 | Dicabisagan
    Accessing city # 428 | Lahaina
    Accessing city # 429 | Karwar
    Accessing city # 430 | Tilichiki
    Accessing city # 431 | Seminole
    Accessing city # 432 | Yarmouth
    Accessing city # 433 | Stuttgart
    Accessing city # 434 | Ixtapa
    Accessing city # 435 | Creston
    City not found ... skipping.
    Accessing city # 435 | Creston
    Accessing city # 436 | Kontagora
    Accessing city # 437 | Saldanha
    Accessing city # 438 | Shiyan
    Accessing city # 439 | La Ronge
    Accessing city # 440 | Porto Novo
    Accessing city # 441 | Matara
    City not found ... skipping.
    Accessing city # 441 | Matara
    Accessing city # 442 | Ripky
    Accessing city # 443 | Krefeld
    Accessing city # 444 | Pervomayskiy
    Accessing city # 445 | San Pedro
    Accessing city # 446 | Ponnani
    Accessing city # 447 | Ninotsminda
    Accessing city # 448 | Bud
    Accessing city # 449 | Chuchkovo
    Accessing city # 450 | Sao Gabriel da Cachoeira
    Accessing city # 451 | Okhotsk
    Accessing city # 452 | Nouadhibou
    Accessing city # 453 | Popondetta
    Accessing city # 454 | Puerto Carreno
    Accessing city # 455 | Puno
    Accessing city # 456 | Maine-Soroa
    Accessing city # 457 | Rio Gallegos
    Accessing city # 458 | Baykit
    Accessing city # 459 | Bulgan
    City not found ... skipping.
    Accessing city # 459 | Bulgan
    Accessing city # 460 | Kuybyshevskiy Zaton
    Accessing city # 461 | Talcahuano
    Accessing city # 462 | Aswan
    Accessing city # 463 | Metlika
    Accessing city # 464 | Camopi
    Accessing city # 465 | Natchitoches
    Accessing city # 466 | Banda Aceh
    Accessing city # 467 | Zyryanka
    Accessing city # 468 | Izhmorskiy
    City not found ... skipping.
    Accessing city # 468 | Izhmorskiy
    Accessing city # 469 | Resistencia
    Accessing city # 470 | Kashan
    Accessing city # 471 | Muncar
    Accessing city # 472 | Flinders
    Accessing city # 473 | Salinopolis
    Accessing city # 474 | Rocha
    City not found ... skipping.
    Accessing city # 474 | Rocha
    Accessing city # 475 | Quanzhou
    City not found ... skipping.
    Accessing city # 475 | Quanzhou
    Accessing city # 476 | Avera
    Accessing city # 477 | General Roca
    Accessing city # 478 | Saint-Augustin
    City not found ... skipping.
    Accessing city # 478 | Saint-Augustin
    Accessing city # 479 | Itoman
    Accessing city # 480 | Palanpur
    Accessing city # 481 | Samarai
    Accessing city # 482 | Marfino
    City not found ... skipping.
    Accessing city # 482 | Marfino
    Accessing city # 483 | Waddan
    Accessing city # 484 | Mantamados
    City not found ... skipping.
    Accessing city # 484 | Mantamados
    Accessing city # 485 | Destin
    City not found ... skipping.
    Accessing city # 485 | Destin
    Accessing city # 486 | Rochelle
    Accessing city # 487 | Khoy
    City not found ... skipping.
    Accessing city # 487 | Khoy
    Accessing city # 488 | Maceio
    Accessing city # 489 | Miraflores
    Accessing city # 490 | Santa Cruz del Sur
    Accessing city # 491 | Komsomolskiy
    Accessing city # 492 | Salta
    Accessing city # 493 | Tyukhtet
    Accessing city # 494 | Poum
    Accessing city # 495 | Novoagansk
    Accessing city # 496 | Santa Cruz
    Accessing city # 497 | Kaeo
    Accessing city # 498 | Yuzhnouralsk
    Accessing city # 499 | Urrutia
    Accessing city # 500 | San Jose
    Accessing city # 501 | Juazeiro
    Accessing city # 502 | Shelburne
    Accessing city # 503 | Cabot
    Accessing city # 504 | Oranjemund
    Accessing city # 505 | Ankazoabo
    Accessing city # 506 | San Cristobal
    Accessing city # 507 | Merauke
    Accessing city # 508 | Saurimo
    Accessing city # 509 | Sinjar
    Accessing city # 510 | Pingliang
    Accessing city # 511 | Selje
    City not found ... skipping.
    Accessing city # 511 | Selje
    Accessing city # 512 | Erechim
    Accessing city # 513 | Bissora
    Accessing city # 514 | Lamu
    Accessing city # 515 | Nenjiang
    Accessing city # 516 | Biak
    City not found ... skipping.
    Accessing city # 516 | Biak
    Accessing city # 517 | Atbasar
    Accessing city # 518 | San Clemente
    Accessing city # 519 | Ploemeur
    Accessing city # 520 | Bafoulabe
    Accessing city # 521 | Vila do Maio
    Accessing city # 522 | Wasilla
    Accessing city # 523 | Gat
    Accessing city # 524 | Zabol
    Accessing city # 525 | Pandan
    Accessing city # 526 | Reyes
    Accessing city # 527 | Ulladulla
    Accessing city # 528 | Trinidad
    Accessing city # 529 | Bani
    Accessing city # 530 | Makakilo City
    Accessing city # 531 | Daru
    Accessing city # 532 | Mirabad
    Accessing city # 533 | Viedma
    Accessing city # 534 | Les Escoumins
    Accessing city # 535 | Goderich
    Accessing city # 536 | Harper
    Accessing city # 537 | Isiro
    Accessing city # 538 | Ayorou
    Accessing city # 539 | Ullal
    Accessing city # 540 | Shubarshi
    Accessing city # 541 | Paka
    Accessing city # 542 | Shingu
    Accessing city # 543 | Sabha
    Accessing city # 544 | Kommunar
    Accessing city # 545 | Mount Isa
    Accessing city # 546 | Namibe
    Accessing city # 547 | Kalabo
    Accessing city # 548 | Cam Ranh
    Accessing city # 549 | Fetsund
    Accessing city # 550 | Senador Jose Porfirio
    Accessing city # 551 | Balabac
    Accessing city # 552 | Khasan
    Accessing city # 553 | Bellevue
    Accessing city # 554 | Ambon
    Accessing city # 555 | Necochea
    Accessing city # 556 | Jedburgh
    Accessing city # 557 | Tuensang
    Accessing city # 558 | Payyannur
    Accessing city # 559 | Gunjur
    Accessing city # 560 | Montalto Uffugo
    Accessing city # 561 | Dongsheng
    Accessing city # 562 | Opopeo
    Accessing city # 563 | Amberley
    Accessing city # 564 | Tiarei
    Accessing city # 565 | Yichang
    Accessing city # 566 | Rio Branco
    Accessing city # 567 | Labuhan
    Accessing city # 568 | Lorengau
    Accessing city # 569 | Moose Factory
    Accessing city # 570 | Rome
    Accessing city # 571 | Lompoc
    Accessing city # 572 | Boulder
    Accessing city # 573 | Broome
    Accessing city # 574 | Manggar
    Accessing city # 575 | Okha
    Accessing city # 576 | Kisesa
    Accessing city # 577 | Byron Bay
    Accessing city # 578 | Japura
    Accessing city # 579 | Dickinson
    Accessing city # 580 | Basar
    Accessing city # 581 | Comodoro Rivadavia
    Accessing city # 582 | Pampa
    Accessing city # 583 | Torbat-e Jam
    Accessing city # 584 | Gizo
    Accessing city # 585 | Linjiang
    Accessing city # 586 | Dukat
    Accessing city # 587 | Tongliao
    Accessing city # 588 | Eureka
    Accessing city # 589 | Russell
    Accessing city # 590 | Atambua
    Accessing city # 591 | Saiha
    Accessing city # 592 | Havoysund
    Accessing city # 593 | Zhob
    Accessing city # 594 | Bubaque
    Accessing city # 595 | Provost
    

#### Clean DataFrame


```python
city_data = city_data.reset_index()

city = city_data.rename(columns={
    'name': 'City',
    'country': 'Country',
    'longitude': 'Lon',
    'latitude': 'Lat',
    'temperature': 'Temp',
    'wind_speed': 'Wind Speed',
    'humidity': 'Humidity',
    'cloudiness': 'Cloudiness (%)',
    'time': 'Time'
})


city['Time'] = pd.to_datetime(city['Time'], unit = 's')

request_time = city['Time'][0]
n_cities = len(city)
```

#### Preview DataFrame


```python
city.head()
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>city_id</th>
      <th>City</th>
      <th>Country</th>
      <th>Lon</th>
      <th>Lat</th>
      <th>Cloudiness (%)</th>
      <th>Humidity</th>
      <th>Temp</th>
      <th>Wind Speed</th>
      <th>Time</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>2339937</td>
      <td>Auki</td>
      <td>NG</td>
      <td>6.51</td>
      <td>12.18</td>
      <td>85</td>
      <td>73</td>
      <td>25.44</td>
      <td>4.91</td>
      <td>2019-07-12 19:40:01</td>
    </tr>
    <tr>
      <th>1</th>
      <td>3378644</td>
      <td>Georgetown</td>
      <td>GY</td>
      <td>-58.16</td>
      <td>6.80</td>
      <td>40</td>
      <td>74</td>
      <td>28.93</td>
      <td>4.10</td>
      <td>2019-07-12 19:40:02</td>
    </tr>
    <tr>
      <th>2</th>
      <td>4035715</td>
      <td>Avarua</td>
      <td>CK</td>
      <td>-159.78</td>
      <td>-21.21</td>
      <td>40</td>
      <td>88</td>
      <td>22.00</td>
      <td>1.00</td>
      <td>2019-07-12 19:40:04</td>
    </tr>
    <tr>
      <th>3</th>
      <td>2264923</td>
      <td>Peniche</td>
      <td>PT</td>
      <td>-9.38</td>
      <td>39.36</td>
      <td>40</td>
      <td>94</td>
      <td>21.30</td>
      <td>2.10</td>
      <td>2019-07-12 19:40:05</td>
    </tr>
    <tr>
      <th>4</th>
      <td>1006984</td>
      <td>East London</td>
      <td>ZA</td>
      <td>27.91</td>
      <td>-33.02</td>
      <td>76</td>
      <td>91</td>
      <td>13.34</td>
      <td>3.81</td>
      <td>2019-07-12 19:40:07</td>
    </tr>
  </tbody>
</table>
</div>




```python
city.info()
```

    <class 'pandas.core.frame.DataFrame'>
    RangeIndex: 595 entries, 0 to 594
    Data columns (total 10 columns):
    city_id           595 non-null int64
    City              595 non-null object
    Country           595 non-null object
    Lon               595 non-null float64
    Lat               595 non-null float64
    Cloudiness (%)    595 non-null int64
    Humidity          595 non-null int64
    Temp              595 non-null float64
    Wind Speed        595 non-null float64
    Time              595 non-null datetime64[ns]
    dtypes: datetime64[ns](1), float64(4), int64(3), object(2)
    memory usage: 46.6+ KB
    

#### Save CSV


```python
city.to_csv('city_data.csv')
```


```python
request_time = city['Time'][0]
n_cities = len(city)
```

#### Global parameter for plot font size


```python
# Set the global plot parameter for font size
plt.rcParams.update({'font.size': 16})

# Place all plot objects in front of plot grids
plt.rcParams['axes.axisbelow'] = True
```

<center><h2>Plot 1 - Temperature</h2></center>


```python
fig, ax = plt.subplots(1, figsize = [12.5, 7])

ax.scatter(
    city['Lat'], 
    city['Temp'],
    c = '#002147', 
    alpha = 0.5, 
    edgecolors = 'black', 
    linewidths = 1,
    s = 150
)

ax.set_ylabel('Temperature')
ax.set_xlabel('Latitude')
ax.set_title(f'City Latitude vs. Temperature ({request_time} GMT | {n_cities} n Cities)')

plt.grid(b = True, which = 'major', color = '#666666', linestyle = '-')
plt.minorticks_on()
plt.grid(b = True, which = 'minor', color = '#666666', linestyle = '-', alpha = 0.2)

plt.savefig('WeatherPy - Temperature.png')

plt.show()
```


![png](output_20_0.png)


<center><h2>Plot 2 - Humidity</h2></center>


```python
fig, ax = plt.subplots(1, figsize = [12.5, 7])

ax.scatter(
    city['Lat'], 
    city['Humidity'], 
    c = '#002147', 
    alpha = 0.5, 
    edgecolors = 'black', 
    linewidths = 1,
    s = 150
)

ax.set_ylabel('Humidity')
ax.set_xlabel('Latitude')
ax.set_title(f'City Latitude vs. Humidity ({request_time} GMT | {n_cities} - N Cities)')

plt.grid(b = True, which = 'major', color = '#666666', linestyle = '-')
plt.minorticks_on()
plt.grid(b = True, which = 'minor', color = '#666666', linestyle = '-', alpha = 0.2)

plt.savefig('WeatherPy - Humidity.png')

plt.show()
```


![png](output_22_0.png)


<center><h2>Plot 3 - Cloudiness</h2></center>


```python
fig, ax = plt.subplots(1, figsize = [12.5, 7])

ax.scatter(
    city['Lat'], 
    city['Cloudiness (%)'], 
    c = '#002147', 
    alpha = 0.5, 
    edgecolors = 'black', 
    linewidths = 1,
    s = 150
)

ax.set_ylabel('Cloudiness (%)')
ax.set_xlabel('Latitude')
ax.set_title(f'City Latitude vs. Cloudiness ({request_time} GMT | {n_cities} - N Cities )')

plt.grid(b = True, which = 'major', color = '#666666', linestyle = '-')
plt.minorticks_on()
plt.grid(b = True, which = 'minor', color = '#666666', linestyle = '-', alpha = 0.2)

plt.savefig('WeatherPy - Cloudiness.png')

plt.show()
```


![png](output_24_0.png)


<center><h2>Plot 4 - Wind Speed</h2></center>


```python
fig, ax = plt.subplots(1, figsize = [12.5, 7])

ax.scatter(
    city['Lat'], 
    city['Wind Speed'], 
    c = '#002147', 
    alpha = 0.5, 
    edgecolors = 'black', 
    linewidths = 1,
    s = 150
)

ax.set_ylabel('Wind Speed (m/s)')
ax.set_xlabel('Latitude')
ax.set_title(f'City Latitude vs. Wind Speed ({request_time} GMT | {n_cities} - N Cities)')

plt.grid(b = True, which = 'major', color = '#666666', linestyle = '-')
plt.minorticks_on()
plt.grid(b = True, which = 'minor', color = '#666666', linestyle = '-', alpha = 0.2)

plt.savefig('WeatherPy - Wind Speed.png')

plt.show()
```


![png](output_26_0.png)


<center><h2>Global City Temperatures</h2></center>


```python
fig, ax = plt.subplots(1, figsize = [12.5*1.5, 7*1.5])

ax.scatter(
    city['Lon'], 
    city['Lat'], 
    c = city['Temp'], 
    alpha = 0.5, 
    edgecolors = 'black', 
    linewidths = 1,
    s = 125
)

ax.set_ylabel('Longitude')
ax.set_xlabel('Latitude')
ax.set_title(f'Global Temperatures in ($^\circ$C)')

plt.text(-230, -80, f'Note: \nCity count of {n_cities} randomly drawn cities on {request_time} GMT from openweathermap.org.')

plt.grid(b = True, which = 'major', color = '#666666', linestyle = '-')
plt.minorticks_on()
plt.grid(b = True, which = 'minor', color = '#666666', linestyle = '-', alpha = 0.2)

plt.tight_layout()
plt.savefig('WeatherPy - Global Temperature.png')

plt.show()
```


![png](output_28_0.png)


<center><h2>Histogram of City Temperatures</h2></center>


```python
temp_bins = int(round(abs(city['Temp'].min()) + city['Temp'].max(), 0))

fig, ax = plt.subplots(1, figsize=[14, 7])

ax.hist(
    city['Temp'],
    bins = temp_bins,
    color = '#002147',
    alpha = .9
)
ax.hist(
    city['Temp'], 
    bins = temp_bins, 
    color = '#5F90B2', 
    histtype = 'step'
)

ax.set_xlabel('Temperature ($^\circ$C)')
ax.set_ylabel('Count')
ax.set_title('Histogram of City Temperatures')

plt.text(-10, -10, f'Note: \n- City count of {n_cities} randomly drawn cities on {request_time} GMT from openweathermap.org. \
                    \n- 1 bin per degree celsius for 42 bins.')

temp_mean = city['Temp'].mean()
ax.axvline(
    x = temp_mean, 
    color = '#5F90B2', 
    lw = 5
)

temp_median = city['Temp'].median()
ax.axvline(
    x = temp_median, 
    color = '#5F90B2', 
    lw = 5, 
    ls = '--'
)

temp_std = round(city['Temp'].std(), 2)

ax.axvline(
    x = temp_std + temp_mean,
    color = '#5F90B2', 
    lw = 5, 
    ls = '-.'
)

ax.axvline(
    x = temp_std + temp_std + temp_mean,
    color = '#5F90B2', 
    lw = 5, 
    ls = '-.'
)

ax.axvline(
    x = temp_mean - temp_std, 
    color = '#5F90B2', 
    lw = 5, 
    ls = '-.'
)

ax.axvline(
    x = temp_mean - temp_std - temp_std, 
    color = '#5F90B2', 
    lw = 5, 
    ls = '-.'
)

plt.grid(
    b = True, 
    which = 'major', 
    color = '#666666', 
    linestyle = '-',
    alpha = 0.75
)

plt.minorticks_on()
plt.grid(
    b = True, 
    which = 'minor', 
    color = '#666666', 
    linestyle = '-', 
    alpha = 0.2
)

plt.tight_layout()
plt.savefig('Histogram of City Temperatures')

plt.show()
```


![png](output_30_0.png)


<center><h2>Scatterplot of Northern Hemisphere Cities vs. Temperature</h2></center>


```python
northern_hemi = city[city['Lat'] >= 0]

fig, ax = plt.subplots(1, figsize = [12.5, 7])

ax.scatter(
    northern_hemi['Lat'], 
    northern_hemi['Temp'], 
    c = '#002147', 
    alpha = 0.5, 
    edgecolors = 'black', 
    linewidths = 1,
    s = 150
)

ax.set_ylabel('Temperature ($^\circ$C)')
ax.set_xlabel('Northern Hemisphere Cities (Lat >= 0)')
ax.set_title(f'Scatterplot of Northern Hemisphere Cities vs. Temperature ({request_time} GMT)')

plt.grid(b = True, which = 'major', color = '#666666', linestyle = '-')
plt.minorticks_on()
plt.grid(b = True, which = 'minor', color = '#666666', linestyle = '-', alpha = 0.2)

plt.tight_layout()
plt.savefig('WeatherPy - Wind Speed ({request_time}).png')

plt.show()
```


![png](output_32_0.png)


<center><h2>Histogram of City Latitudes</h2></center>


```python
fig, ax = plt.subplots(1, figsize=[15, 7])

lat_bins = int(round(abs(city['Lat'].min()) + city['Lat'].max(), 0))

ax.hist(
    city['Lat'],
    bins = lat_bins,
    color = '#002147'
)
ax.hist(
    city['Lat'], 
    bins = lat_bins, 
    color = '#A3C1AD', 
    histtype = 'step'
)

ax.set_xlabel('Latitude')
ax.set_ylabel('Count')
ax.set_title('Histogram of City Latitudes')

plt.text(-60, -4,
         f'Note: \n- City count of {n_cities} randomly drawn cities on {request_time} GMT from openweathermap.org. \
         \n- 1 bin per degree of latitude for 133 bins. ')

plt.grid(
    b = True, 
    which = 'major', 
    color = '#666666', 
    linestyle = '-',
    alpha = 0.75
)

plt.minorticks_on()
plt.grid(
    b = True, 
    which = 'minor', 
    color = '#666666', 
    linestyle = '-', 
    alpha = 0.2
)

plt.tight_layout()
plt.savefig('Histogram of City Latitudes.png')

plt.show()
```


![png](output_34_0.png)



```python
city.head()
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>city_id</th>
      <th>City</th>
      <th>Country</th>
      <th>Lon</th>
      <th>Lat</th>
      <th>Cloudiness (%)</th>
      <th>Humidity</th>
      <th>Temp</th>
      <th>Wind Speed</th>
      <th>Time</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>2339937</td>
      <td>Auki</td>
      <td>NG</td>
      <td>6.51</td>
      <td>12.18</td>
      <td>85</td>
      <td>73</td>
      <td>25.44</td>
      <td>4.91</td>
      <td>2019-07-12 19:40:01</td>
    </tr>
    <tr>
      <th>1</th>
      <td>3378644</td>
      <td>Georgetown</td>
      <td>GY</td>
      <td>-58.16</td>
      <td>6.80</td>
      <td>40</td>
      <td>74</td>
      <td>28.93</td>
      <td>4.10</td>
      <td>2019-07-12 19:40:02</td>
    </tr>
    <tr>
      <th>2</th>
      <td>4035715</td>
      <td>Avarua</td>
      <td>CK</td>
      <td>-159.78</td>
      <td>-21.21</td>
      <td>40</td>
      <td>88</td>
      <td>22.00</td>
      <td>1.00</td>
      <td>2019-07-12 19:40:04</td>
    </tr>
    <tr>
      <th>3</th>
      <td>2264923</td>
      <td>Peniche</td>
      <td>PT</td>
      <td>-9.38</td>
      <td>39.36</td>
      <td>40</td>
      <td>94</td>
      <td>21.30</td>
      <td>2.10</td>
      <td>2019-07-12 19:40:05</td>
    </tr>
    <tr>
      <th>4</th>
      <td>1006984</td>
      <td>East London</td>
      <td>ZA</td>
      <td>27.91</td>
      <td>-33.02</td>
      <td>76</td>
      <td>91</td>
      <td>13.34</td>
      <td>3.81</td>
      <td>2019-07-12 19:40:07</td>
    </tr>
  </tbody>
</table>
</div>



#### Northen Hemisphere City Percentage


```python
northern = city[city['Lat'] >= 0]
round(northern['city_id'].nunique()/city['city_id'].nunique(), 2)
```




    0.72


