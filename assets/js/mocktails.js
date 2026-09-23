/**
 * MOCKTAILRECEPTEN — 30 RECEPTEN + RENDERING
 *
 * Dertig alcoholvrije recepten, verdeeld over de zes smaakprofielen die de
 * filterbalk in mocktails.html aanbiedt (vijf per profiel).
 *
 * Fotografie: mocktails/<slug>.jpg — publiek domein (CC0/PDM), herkomst per
 * beeld vastgelegd in assets/img/mocktails/credits.json. Een kaart valt terug op een
 * merktegel zodra `image` leeg is, dus een ontbrekend bestand breekt niets.
 */
(function () {
	'use strict';

	var MOCKTAILS = [
		{
			slug: 'komkommer-munt-cooler',
			name: 'Komkommer & Munt Cooler',
			tagline: 'Het glas dat je hoofd koeler maakt dan de avond is.',
			category: 'Fris',
			minutes: 4,
			glass: 'Longdrink',
			image: 'assets/img/mocktails/komkommer-munt-cooler.jpg',
			ingredients: [
				'6 dunne schijfjes komkommer',
				'8 blaadjes verse munt',
				'20 ml vers limoensap',
				'10 ml agavesiroop',
				'150 ml tonic of spuitwater',
				'Veel ijs'
			],
			steps: [
				'Druk de komkommer en de munt zacht aan in het glas — kneuzen, niet fijnmalen.',
				'Voeg limoensap en agavesiroop toe en roer tot de siroop is opgelost.',
				'Vul het glas tot de rand met ijs.',
				'Schenk de tonic er langzaam overheen en roer één keer van onder naar boven.'
			]
		},
		{
			slug: 'basil-smash-nul',
			name: 'Basil Smash 0%',
			tagline: 'Zuur, zoet en kruid in één slok. Niets meer nodig.',
			category: 'Fris',
			minutes: 5,
			glass: 'Tumbler',
			image: 'assets/img/mocktails/basil-smash-nul.jpg',
			ingredients: [
				'12 blaadjes verse basilicum',
				'30 ml vers citroensap',
				'15 ml suikersiroop',
				'60 ml troebel appelsap',
				'Scheut spuitwater',
				'Crushed ice'
			],
			steps: [
				'Sla de basilicum één keer tussen je handen — zo komen de oliën vrij zonder bitter te worden.',
				'Shake basilicum, citroensap, siroop en appelsap kort met ijs.',
				'Zeef in een tumbler gevuld met crushed ice.',
				'Top af met spuitwater en steek een vers basilicumtopje erin.'
			]
		},
		{
			slug: 'pompelmoes-spritz',
			name: 'Roze Pompelmoes Spritz',
			tagline: 'Aperitief zonder de kater die erachteraan komt.',
			category: 'Fris',
			minutes: 3,
			glass: 'Wijnglas',
			image: 'assets/img/mocktails/pompelmoes-spritz.jpg',
			ingredients: [
				'100 ml verse roze pompelmoessap',
				'1 takje rozemarijn',
				'10 ml honingsiroop',
				'120 ml bruisend water',
				'Schijfje pompelmoes',
				'IJsblokjes'
			],
			steps: [
				'Rol het rozemarijntakje tussen je vingers en leg het in het wijnglas.',
				'Vul met ijs, schenk het pompelmoessap en de honingsiroop erbij.',
				'Vul aan met bruiswater en roer rustig door.',
				'Hang een schijfje pompelmoes over de rand.'
			]
		},
		{
			slug: 'appel-venkel-fizz',
			name: 'Appel & Venkel Fizz',
			tagline: 'Onverwacht. Precies daarom werkt het.',
			category: 'Fris',
			minutes: 5,
			glass: 'Longdrink',
			image: 'assets/img/mocktails/appel-venkel-fizz.jpg',
			ingredients: [
				'120 ml troebel appelsap',
				'2 dunne schijfjes verse venkel',
				'20 ml citroensap',
				'5 ml agavesiroop',
				'100 ml spuitwater',
				'Venkelgroen als garnering'
			],
			steps: [
				'Druk de venkel kort aan in een shaker met het citroensap.',
				'Voeg appelsap, siroop en ijs toe en shake 10 seconden.',
				'Dubbel zeven in een longdrinkglas met verse ijsblokjes.',
				'Aanvullen met spuitwater en het venkelgroen erop leggen.'
			]
		},
		{
			slug: 'watermeloen-agua-fresca',
			name: 'Watermeloen Agua Fresca',
			tagline: 'Drie ingrediënten. Nul ruis.',
			category: 'Fris',
			minutes: 6,
			glass: 'Longdrink',
			image: 'assets/img/mocktails/watermeloen-agua-fresca.jpg',
			ingredients: [
				'250 g watermeloen zonder pitten',
				'20 ml vers limoensap',
				'5 ml agavesiroop (optioneel)',
				'Snuifje zeezout',
				'IJsblokjes',
				'Blaadje munt'
			],
			steps: [
				'Mix de watermeloen glad en zeef door een fijne zeef.',
				'Roer limoensap, siroop en het snuifje zout erdoor — het zout maakt de meloen zoeter.',
				'Schenk over veel ijs.',
				'Werk af met een blaadje munt.'
			]
		},
		{
			slug: 'bitter-sinaas',
			name: 'Bitter Sinaas',
			tagline: 'De eerste slok is streng. De derde is een gesprek.',
			category: 'Bitter',
			minutes: 3,
			glass: 'Tumbler',
			image: 'assets/img/mocktails/bitter-sinaas.jpg',
			ingredients: [
				'45 ml alcoholvrije bitter aperitief',
				'45 ml alcoholvrije rode vermout',
				'30 ml bloedsinaasappelsap',
				'1 grote ijsklont',
				'Brede zeste van sinaasappel'
			],
			steps: [
				'Leg één grote ijsklont in de tumbler — hoe minder oppervlak, hoe trager de verdunning.',
				'Schenk alle vloeistoffen erbij en roer 20 seconden.',
				'Knijp de zeste boven het glas zodat de olie op het oppervlak landt.',
				'Leg de zeste in het glas.'
			]
		},
		{
			slug: 'koffie-tonic',
			name: 'Zwarte Koffie-Tonic',
			tagline: 'Bitter op bitter. Het klopt pas als je het geproefd hebt.',
			category: 'Bitter',
			minutes: 4,
			glass: 'Longdrink',
			image: 'assets/img/mocktails/koffie-tonic.jpg',
			ingredients: [
				'1 espresso (30 ml), afgekoeld',
				'150 ml tonic',
				'5 ml suikersiroop (optioneel)',
				'Schijfje sinaasappel',
				'IJsblokjes tot de rand'
			],
			steps: [
				'Vul het glas volledig met ijs en schenk de tonic erover.',
				'Laat de bubbels 30 seconden tot rust komen.',
				'Giet de espresso langzaam over de bolle kant van een lepel — je krijgt twee lagen.',
				'Niet roeren. Schijfje sinaasappel erbij.'
			]
		},
		{
			slug: 'rabarber-bitter',
			name: 'Rabarber Bitter',
			tagline: 'Roze in het glas, streng in de smaak.',
			category: 'Bitter',
			minutes: 5,
			glass: 'Coupe',
			image: 'assets/img/mocktails/rabarber-bitter.jpg',
			ingredients: [
				'50 ml rabarbersiroop',
				'30 ml vers citroensap',
				'20 ml alcoholvrije bitter aperitief',
				'60 ml spuitwater',
				'IJs om te shaken'
			],
			steps: [
				'Shake siroop, citroensap en bitter 12 seconden met ijs.',
				'Dubbel zeven in een gekoelde coupe.',
				'Vul voorzichtig aan met spuitwater.',
				'Serveer zonder ijs — koud, kort, klaar.'
			]
		},
		{
			slug: 'pompelmoes-rozemarijn-bitter',
			name: 'Pompelmoes & Rozemarijn',
			tagline: 'Een aperitief dat je niet hoeft uit te leggen.',
			category: 'Bitter',
			minutes: 4,
			glass: 'Wijnglas',
			image: 'assets/img/mocktails/pompelmoes-rozemarijn-bitter.jpg',
			ingredients: [
				'90 ml roze pompelmoessap',
				'20 ml rozemarijnsiroop',
				'15 ml citroensap',
				'100 ml tonic',
				'Takje rozemarijn',
				'IJsblokjes'
			],
			steps: [
				'Vul het wijnglas met ijs.',
				'Schenk pompelmoessap, siroop en citroensap erbij en roer.',
				'Vul aan met tonic.',
				'Sla het takje rozemarijn één keer in je handpalm en leg het erop.'
			]
		},
		{
			slug: 'artisjok-spritz',
			name: 'Artisjok Spritz',
			tagline: 'De spritz die zijn eigen mening heeft.',
			category: 'Bitter',
			minutes: 3,
			glass: 'Wijnglas',
			image: 'assets/img/mocktails/artisjok-spritz.jpg',
			ingredients: [
				'60 ml alcoholvrije artisjokbitter',
				'90 ml alcoholvrij mousserend wit',
				'30 ml spuitwater',
				'Halve schijf sinaasappel',
				'IJsblokjes'
			],
			steps: [
				'Vul het glas royaal met ijs.',
				'Schenk eerst de bitter, dan het mousserende — in die volgorde blijft de bubbel langer.',
				'Kort aanvullen met spuitwater.',
				'Halve schijf sinaasappel in het glas laten zakken.'
			]
		},
		{
			slug: 'gember-limoen-mule',
			name: 'Gember & Limoen Mule',
			tagline: 'Scherp genoeg om je wakker te houden tot na middernacht.',
			category: 'Kruidig',
			minutes: 4,
			glass: 'Tumbler',
			image: 'assets/img/mocktails/gember-limoen-mule.jpg',
			ingredients: [
				'25 ml vers limoensap',
				'150 ml stevige alcoholvrije gemberbier',
				'2 dunne plakjes verse gember',
				'5 ml agavesiroop',
				'Crushed ice',
				'Takje munt'
			],
			steps: [
				'Druk de gember met de limoen aan in de tumbler.',
				'Vul tot de rand met crushed ice.',
				'Schenk de gemberbier en de siroop erover.',
				'Roer kort en zet er een flinke bos munt op.'
			]
		},
		{
			slug: 'virgin-mary',
			name: 'Virgin Mary',
			tagline: 'Geen zoete troost. Wel een compleet glas.',
			category: 'Kruidig',
			minutes: 5,
			glass: 'Longdrink',
			image: 'assets/img/mocktails/virgin-mary.jpg',
			ingredients: [
				'150 ml tomatensap, goed koud',
				'15 ml citroensap',
				'3 druppels tabasco',
				'4 druppels alcoholvrije worcestersaus',
				'Snuif selderzout en zwarte peper',
				'Stengel bleekselder'
			],
			steps: [
				'Rol alle ingrediënten tussen twee glazen heen en weer — shaken maakt tomatensap schuimig.',
				'Schenk in een longdrink met ijs.',
				'Proef en corrigeer met peper of citroen.',
				'Zet de selderstengel rechtop in het glas.'
			]
		},
		{
			slug: 'kurkuma-sinaas-tonic',
			name: 'Kurkuma & Sinaas Tonic',
			tagline: 'Fel geel. Alsof het glas zelf ook nieuwsgierig is.',
			category: 'Kruidig',
			minutes: 5,
			glass: 'Longdrink',
			image: 'assets/img/mocktails/kurkuma-sinaas-tonic.jpg',
			ingredients: [
				'80 ml vers sinaasappelsap',
				'1/4 tl verse kurkuma, geraspt',
				'10 ml gembersiroop',
				'Snuifje zwarte peper',
				'120 ml tonic',
				'IJsblokjes'
			],
			steps: [
				'Roer kurkuma, peper en gembersiroop door het sinaasappelsap — de peper maakt de kurkuma beter opneembaar.',
				'Zeef in een glas met ijs.',
				'Vul aan met tonic.',
				'Roer één keer door voor de kleurstreep.'
			]
		},
		{
			slug: 'kardemom-peer-sour',
			name: 'Kardemom & Peer Sour',
			tagline: 'Zacht schuim, scherpe kern.',
			category: 'Kruidig',
			minutes: 6,
			glass: 'Coupe',
			image: 'assets/img/mocktails/kardemom-peer-sour.jpg',
			ingredients: [
				'70 ml perensap',
				'25 ml citroensap',
				'15 ml kardemomsiroop',
				'30 ml aquafaba (kikkererwtenvocht)',
				'IJs om te shaken'
			],
			steps: [
				'Shake alles eerst 15 seconden zonder ijs — zo bouwt het schuim op.',
				'Voeg ijs toe en shake nog eens 15 seconden.',
				'Dubbel zeven in een gekoelde coupe.',
				'Laat 30 seconden staan tot de schuimlaag strak is.'
			]
		},
		{
			slug: 'chai-soda',
			name: 'Chai Soda',
			tagline: 'Warme kruiden, koud glas. Het werkt.',
			category: 'Kruidig',
			minutes: 5,
			glass: 'Longdrink',
			image: 'assets/img/mocktails/chai-soda.jpg',
			ingredients: [
				'100 ml sterk gezette chai, afgekoeld',
				'15 ml honingsiroop',
				'10 ml citroensap',
				'100 ml spuitwater',
				'Kaneelstokje',
				'IJsblokjes'
			],
			steps: [
				'Roer chai, honingsiroop en citroensap door elkaar.',
				'Schenk over een glas vol ijs.',
				'Vul aan met spuitwater.',
				'Leg het kaneelstokje op de rand.'
			]
		},
		{
			slug: 'aardbei-basilicum-smash',
			name: 'Aardbei & Basilicum Smash',
			tagline: 'Juni in een glas, ook in november.',
			category: 'Fruitig',
			minutes: 5,
			glass: 'Tumbler',
			image: 'assets/img/mocktails/aardbei-basilicum-smash.jpg',
			ingredients: [
				'5 rijpe aardbeien',
				'6 blaadjes basilicum',
				'20 ml limoensap',
				'10 ml suikersiroop',
				'100 ml spuitwater',
				'Crushed ice'
			],
			steps: [
				'Pureer de aardbeien met de limoen en de siroop in het glas.',
				'Voeg de basilicum toe en druk één keer zacht aan.',
				'Vul met crushed ice tot boven de rand.',
				'Aanvullen met spuitwater en een halve aardbei erop.'
			]
		},
		{
			slug: 'perzik-tijm-ice-tea',
			name: 'Perzik & Tijm Iced Tea',
			tagline: 'De thee die zichzelf serieus neemt.',
			category: 'Fruitig',
			minutes: 6,
			glass: 'Longdrink',
			image: 'assets/img/mocktails/perzik-tijm-ice-tea.jpg',
			ingredients: [
				'150 ml sterk gezette groene thee, koud',
				'50 ml perzikpuree',
				'15 ml citroensap',
				'2 takjes tijm',
				'10 ml honingsiroop',
				'IJsblokjes'
			],
			steps: [
				'Laat de tijm 10 minuten trekken in de koude thee en vis hem eruit.',
				'Roer perzikpuree, citroen en honingsiroop erdoor.',
				'Schenk over veel ijs.',
				'Een vers takje tijm en een schijfje perzik erbij.'
			]
		},
		{
			slug: 'passievrucht-sour',
			name: 'Passievrucht Sour',
			tagline: 'Zuur dat je wakker schudt zonder te schreeuwen.',
			category: 'Fruitig',
			minutes: 6,
			glass: 'Coupe',
			image: 'assets/img/mocktails/passievrucht-sour.jpg',
			ingredients: [
				'Vruchtvlees van 2 passievruchten',
				'25 ml limoensap',
				'20 ml suikersiroop',
				'30 ml aquafaba',
				'50 ml sinaasappelsap',
				'IJs om te shaken'
			],
			steps: [
				'Shake alles 15 seconden zonder ijs.',
				'Voeg ijs toe en shake nog 15 seconden tot het glas beslaat.',
				'Dubbel zeven in een gekoelde coupe.',
				'Lepel een half passievruchtje op het schuim.'
			]
		},
		{
			slug: 'bramen-salie-fizz',
			name: 'Bramen & Salie Fizz',
			tagline: 'Donker, kruidig, en niet van plan zich te verontschuldigen.',
			category: 'Fruitig',
			minutes: 5,
			glass: 'Longdrink',
			image: 'assets/img/mocktails/bramen-salie-fizz.jpg',
			ingredients: [
				'8 bramen',
				'3 blaadjes salie',
				'25 ml citroensap',
				'15 ml suikersiroop',
				'120 ml spuitwater',
				'Crushed ice'
			],
			steps: [
				'Druk de bramen en de salie aan met citroensap en siroop.',
				'Zeef in een longdrinkglas — of laat de pitjes zitten als je dat lekker vindt.',
				'Vul met crushed ice.',
				'Aanvullen met spuitwater en twee hele bramen erop.'
			]
		},
		{
			slug: 'mango-limoen-lassi',
			name: 'Mango & Limoen Lassi',
			tagline: 'Voor als je iets wil dat blijft plakken.',
			category: 'Fruitig',
			minutes: 4,
			glass: 'Tumbler',
			image: 'assets/img/mocktails/mango-limoen-lassi.jpg',
			ingredients: [
				'150 g rijpe mango',
				'100 ml volle yoghurt',
				'15 ml limoensap',
				'10 ml honing',
				'Snuifje kardemompoeder',
				'4 ijsblokjes'
			],
			steps: [
				'Mix alles 30 seconden tot het volledig glad is.',
				'Proef: te dik? Een scheut koud water erbij.',
				'Schenk in een koude tumbler.',
				'Rasp er wat limoenzeste over.'
			]
		},
		{
			slug: 'warme-appel-kaneel',
			name: 'Warme Appel & Kaneel',
			tagline: 'Het glas waar de avond zacht in landt.',
			category: 'Warm',
			minutes: 8,
			glass: 'Tumbler',
			image: 'assets/img/mocktails/warme-appel-kaneel.jpg',
			ingredients: [
				'250 ml troebel appelsap',
				'1 kaneelstokje',
				'2 kruidnagels',
				'1 schijf sinaasappel',
				'1 stukje verse gember',
				'Klein beetje honing'
			],
			steps: [
				'Verwarm alles samen op laag vuur — laat het nooit koken.',
				'Laat 6 minuten trekken tot het huis ernaar ruikt.',
				'Zeef in een hittebestendig glas.',
				'Kaneelstokje erin laten staan.'
			]
		},
		{
			slug: 'gouden-melk',
			name: 'Gouden Melk',
			tagline: 'Geen slaapmutsje. Wel een punt achter de dag.',
			category: 'Warm',
			minutes: 7,
			glass: 'Tumbler',
			image: 'assets/img/mocktails/gouden-melk.jpg',
			ingredients: [
				'250 ml havermelk',
				'1 tl kurkumapasta',
				'1/2 tl geraspte gember',
				'Snuifje zwarte peper en kaneel',
				'1 tl ahornsiroop'
			],
			steps: [
				'Verwarm de havermelk met alle kruiden tot net onder het kookpunt.',
				'Klop stevig door tot er schuim op staat.',
				'Zoet af met ahornsiroop.',
				'Schenk in het glas en strooi er wat kaneel over.'
			]
		},
		{
			slug: 'granaatappel-punch',
			name: 'Warme Granaatappelpunch',
			tagline: 'Diep rood, en warm zonder te verdoven.',
			category: 'Warm',
			minutes: 9,
			glass: 'Tumbler',
			image: 'assets/img/mocktails/granaatappel-punch.jpg',
			ingredients: [
				'200 ml granaatappelsap',
				'50 ml sinaasappelsap',
				'1 steranijs',
				'1 kaneelstokje',
				'2 tl honing',
				'Granaatappelpitjes'
			],
			steps: [
				'Verwarm sap, steranijs en kaneel 8 minuten zachtjes.',
				'Roer de honing erdoor tot ze is opgelost.',
				'Zeef in een hittebestendig glas.',
				'Laat een handvol pitjes naar de bodem zakken.'
			]
		},
		{
			slug: 'chocolade-chili',
			name: 'Chocolade & Chili',
			tagline: 'Zoet tot het puntje van je tong, daarna niet meer.',
			category: 'Warm',
			minutes: 8,
			glass: 'Tumbler',
			image: 'assets/img/mocktails/chocolade-chili.jpg',
			ingredients: [
				'250 ml volle melk of haverdrank',
				'25 g pure chocolade (70%)',
				'1 tl cacaopoeder',
				'Klein snufje chilipoeder',
				'Snuifje zeezout'
			],
			steps: [
				'Verwarm de melk met de cacao en klop glad.',
				'Voeg de chocolade in stukjes toe en roer tot ze volledig gesmolten is.',
				'Chili en zout erdoor — proef voor je meer chili neemt.',
				'Schenk in en rasp er wat chocolade over.'
			]
		},
		{
			slug: 'verse-muntthee',
			name: 'Verse Muntthee',
			tagline: 'Het eenvoudigste recept op deze pagina. En misschien het beste.',
			category: 'Warm',
			minutes: 5,
			glass: 'Tumbler',
			image: 'assets/img/mocktails/verse-muntthee.jpg',
			ingredients: [
				'Een grote bos verse munt',
				'250 ml water van 90 °C',
				'1 tl honing',
				'Dun schijfje citroen'
			],
			steps: [
				'Duw de munt stevig in een hittebestendig glas.',
				'Overgiet met water van 90 °C — kokend water maakt de munt bitter.',
				'Laat 4 minuten trekken.',
				'Honing en citroen erbij, en drink hem langzaam.'
			]
		},
		{
			slug: 'spritz-royale',
			name: '0% Spritz Royale',
			tagline: 'Hetzelfde glas, hetzelfde geluid, hetzelfde gebaar.',
			category: 'Feest',
			minutes: 3,
			glass: 'Wijnglas',
			image: 'assets/img/mocktails/spritz-royale.jpg',
			ingredients: [
				'120 ml alcoholvrije mousserende wijn',
				'40 ml alcoholvrije bitter aperitief',
				'20 ml spuitwater',
				'Halve schijf sinaasappel',
				'IJsblokjes'
			],
			steps: [
				'Vul een groot wijnglas met ijs.',
				'Schenk de bitter, daarna de mousserende wijn.',
				'Kort aanvullen met spuitwater.',
				'Sinaasappel erin en meteen serveren.'
			]
		},
		{
			slug: 'mimosa-nul',
			name: 'Mimosa 0%',
			tagline: 'Voor het soort ochtend dat je je wil herinneren.',
			category: 'Feest',
			minutes: 2,
			glass: 'Coupe',
			image: 'assets/img/mocktails/mimosa-nul.jpg',
			ingredients: [
				'70 ml vers geperst sinaasappelsap, ijskoud',
				'80 ml alcoholvrije mousserende wijn',
				'Dun lint sinaasappelzeste'
			],
			steps: [
				'Koel beide flessen grondig — dit recept valt of staat met temperatuur.',
				'Schenk eerst het sinaasappelsap in de coupe.',
				'Vul langzaam aan met mousserende wijn, tegen de wand van het glas.',
				'Draai de zeste boven het glas en laat hem erin vallen.'
			]
		},
		{
			slug: 'granaatappel-75',
			name: 'Granaatappel 75',
			tagline: 'Een toost hoeft niet te prikken in je hoofd.',
			category: 'Feest',
			minutes: 4,
			glass: 'Coupe',
			image: 'assets/img/mocktails/granaatappel-75.jpg',
			ingredients: [
				'30 ml granaatappelsap',
				'20 ml citroensap',
				'10 ml suikersiroop',
				'90 ml alcoholvrije mousserende wijn',
				'Citroenzeste'
			],
			steps: [
				'Shake sap, citroen en siroop kort met ijs.',
				'Dubbel zeven in een ijskoude coupe.',
				'Vul rustig aan met mousserende wijn.',
				'Draai de zeste boven het glas.'
			]
		},
		{
			slug: 'vlierbloesem-fizz',
			name: 'Vlierbloesem Fizz',
			tagline: 'Bloemig, droog, en verrassend volwassen.',
			category: 'Feest',
			minutes: 3,
			glass: 'Wijnglas',
			image: 'assets/img/mocktails/vlierbloesem-fizz.jpg',
			ingredients: [
				'25 ml vlierbloesemsiroop',
				'20 ml citroensap',
				'100 ml alcoholvrije mousserende wijn',
				'50 ml spuitwater',
				'Schijfje limoen',
				'IJsblokjes'
			],
			steps: [
				'Roer siroop en citroensap in het glas.',
				'Voeg ijs toe.',
				'Schenk de mousserende wijn erbij en vul aan met spuitwater.',
				'Limoen erover en één keer zacht roeren.'
			]
		},
		{
			slug: 'zwarte-bes-bubbels',
			name: 'Zwarte Bes & Rozemarijn',
			tagline: 'De laatste van dertig. Bewaar hem voor dag 30.',
			category: 'Feest',
			minutes: 4,
			glass: 'Coupe',
			image: 'assets/img/mocktails/zwarte-bes-bubbels.jpg',
			ingredients: [
				'30 ml zwarte bessensiroop',
				'20 ml citroensap',
				'1 takje rozemarijn',
				'100 ml alcoholvrije mousserende wijn',
				'Enkele zwarte bessen'
			],
			steps: [
				'Laat het rozemarijntakje 5 minuten in de siroop liggen.',
				'Roer siroop en citroensap in een gekoelde coupe.',
				'Vul langzaam aan met mousserende wijn.',
				'Laat een paar bessen naar de bodem zakken.'
			]
		}
	];

	/** An advertiser block every 6 cards — visible, but never the main event. */
	var AD_AFTER = [5, 17];

	var filter = 'Alles';

	function escapeHtml(value) {
		return String(value)
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;');
	}

	function cardHtml(mocktail, index) {
		var media = mocktail.image
			? '<img src="' +
				escapeHtml(mocktail.image) +
				'" alt="' +
				escapeHtml(mocktail.name) +
				'" width="1000" height="750" loading="lazy" decoding="async" />'
			: '<div class="mock__placeholder" aria-hidden="true">' +
				'<span class="u-figure mock__number">' +
				String(index + 1).padStart(2, '0') +
				'</span>' +
				'<span class="mock__placeholder-note">Beeld volgt</span>' +
				'</div>';

		var ingredients = mocktail.ingredients
			.map(function (item) {
				return '<li>' + escapeHtml(item) + '</li>';
			})
			.join('');

		var steps = mocktail.steps
			.map(function (item) {
				return '<li>' + escapeHtml(item) + '</li>';
			})
			.join('');

		return (
			'<article class="mock c-card c-card--interactive">' +
			'<div class="mock__media">' +
			media +
			'<span class="c-tag mock__cat">' +
			escapeHtml(mocktail.category) +
			'</span>' +
			'</div>' +
			'<div class="mock__body">' +
			'<h3 class="t-h3 mock__name">' +
			escapeHtml(mocktail.name) +
			'</h3>' +
			'<p class="mock__tagline u-muted t-small">' +
			escapeHtml(mocktail.tagline) +
			'</p>' +
			'<ul class="mock__meta t-small u-faint">' +
			'<li>' +
			mocktail.minutes +
			' min</li>' +
			'<li>' +
			escapeHtml(mocktail.glass) +
			'</li>' +
			'<li>0% alcohol</li>' +
			'</ul>' +
			'<details class="mock__details">' +
			'<summary>Bekijk het recept</summary>' +
			'<div class="mock__recipe">' +
			'<p class="t-eyebrow">Ingrediënten</p>' +
			'<ul>' +
			ingredients +
			'</ul>' +
			'<p class="t-eyebrow">Bereiding</p>' +
			'<ol>' +
			steps +
			'</ol>' +
			'</div>' +
			'</details>' +
			'</div>' +
			'</article>'
		);
	}

	/**
	 * Advertiser slot. The content document asks for a page where advertisers
	 * "kunnen uitblinken" — so the slot is a first-class brand surface, not a
	 * banner strip. Keep it clearly labelled: the brandbook forbids anything
	 * that reads as sneaky or salesy.
	 *
	 * Wire a real partner by passing brand, claim, href and image.
	 */
	function adHtml(options) {
		var opts = options || {};
		var label = opts.label || 'Partner';
		var filled = Boolean(opts.brand);

		if (!filled) {
			return (
				'<aside class="ad ad--empty">' +
				'<p class="ad__label t-eyebrow">' +
				escapeHtml(label) +
				'</p>' +
				'<div class="ad__content ad__content--empty">' +
				'<p class="ad__brand t-h3">Advertentieruimte</p>' +
				'<p class="ad__claim t-small">Vrij blok voor een alcoholvrij merk. Geef ' +
				'<code>brand</code>, <code>claim</code>, <code>href</code> en <code>image</code> ' +
				'mee aan <code>adHtml()</code> in <code>assets/js/mocktails.js</code>.</p>' +
				'</div>' +
				'</aside>'
			);
		}

		return (
			'<aside class="ad">' +
			'<p class="ad__label t-eyebrow">' +
			escapeHtml(label) +
			'</p>' +
			'<div class="ad__content">' +
			(opts.image
				? '<img class="ad__image" src="' +
					escapeHtml(opts.image) +
					'" alt="' +
					escapeHtml(opts.brand) +
					'" loading="lazy" />'
				: '') +
			'<div>' +
			'<p class="ad__brand t-h3">' +
			escapeHtml(opts.brand) +
			'</p>' +
			(opts.claim ? '<p class="ad__claim t-small">' + escapeHtml(opts.claim) + '</p>' : '') +
			(opts.href
				? '<a class="ad__link" href="' +
					escapeHtml(opts.href) +
					'" rel="sponsored noopener" target="_blank">Ontdek meer</a>'
				: '') +
			'</div>' +
			'</div>' +
			'</aside>'
		);
	}

	function render() {
		var grid = document.querySelector('[data-mocktail-grid]');
		var count = document.querySelector('[data-mocktail-count]');
		if (!grid) return;

		var visible =
			filter === 'Alles'
				? MOCKTAILS
				: MOCKTAILS.filter(function (m) {
						return m.category === filter;
					});

		var html = '';
		visible.forEach(function (mocktail, i) {
			html += cardHtml(mocktail, MOCKTAILS.indexOf(mocktail));
			if (filter === 'Alles' && AD_AFTER.indexOf(i) !== -1) {
				html += adHtml({ label: 'In samenwerking met' });
			}
		});

		grid.innerHTML = html;

		if (count) {
			count.textContent = visible.length + ' van ' + MOCKTAILS.length + ' recepten';
		}
	}

	function init() {
		var buttons = document.querySelectorAll('[data-filter]');

		Array.prototype.forEach.call(buttons, function (button) {
			button.addEventListener('click', function () {
				filter = button.dataset.filter;

				Array.prototype.forEach.call(buttons, function (other) {
					other.classList.toggle('is-active', other === button);
					other.setAttribute('aria-pressed', String(other === button));
				});

				render();
			});
		});

		render();
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init);
	} else {
		init();
	}
})();
