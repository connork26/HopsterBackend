DROP SCHEMA IF EXISTS hopster;

CREATE SCHEMA hopster;

USE hopster;

CREATE TABLE Users (
	userID INT PRIMARY KEY AUTO_INCREMENT,
	username varchar (100) unique,
	fName varchar(25) not null,
	lName varchar(25) not null,
	email varchar(200) not null,
	password varchar(25) not null,
	zipcode INT not null,
	accountType varchar(25) not null
);

CREATE TABLE Breweries (
	breweryID int primary key auto_increment,
	name varchar(50) not null,
	streetAddress varchar (200) not null,
	city varchar(25),
	stateAbrv varchar(2),
	zipcode int not null
);

CREATE TABLE Styles (
	styleID int primary key auto_increment,
	name varchar(100) not null,
	description varchar(500)
);

CREATE TABLE Beers (
	beerID int primary key auto_increment,
	name varchar(150),
	breweryID int not null,
	styleID int not null,
	description varchar(500),
	abv float,
	foreign key (breweryID) 
		references Breweries(breweryID) 
		on delete cascade,
	foreign key (styleID)
		references Styles(styleID)
		on delete cascade
);

CREATE TABLE Pubs (
	pubID int primary key auto_increment,
	name varchar(100) not null,
	description varchar(250),
	streetAddress varchar (200) not null,
	city varchar(25) not null,
	stateAbrv varchar(2) not null,
	zipcode int not null
);

CREATE TABLE TapList (
	beerID int,
	pubID int,
	postedAt timestamp default current_timestamp,
	primary key (beerID, pubID),
	foreign key (beerID)
		references Beers(beerID)
		on delete cascade,
	foreign key (pubID)
		references Pubs(pubID)
		on delete cascade
);


CREATE TABLE Posts (
	postID int primary key auto_increment,
	beerID int,
	pubID int,
	userID int,
	comment varchar(250),
	picURL varchar(250),
	foreign key (beerID)
		references Beers(beerID)
		on delete cascade,
	foreign key (pubID)
		references Pubs(pubID)
		on delete cascade,
	foreign key (userID)
		references Users(userID)
		on delete cascade
);

CREATE TABLE Tags (
	tagID int primary key auto_increment,
	beerID int unique,
	pubID int unique,
	foreign key (beerID)
		references Beers(beerID)
		on delete cascade,
	foreign key (pubID)
		references Pubs(pubID)
		on delete cascade
);

CREATE TABLE PostTags (
	tagID int,
	postID int,
	primary key (tagID, postID),
	foreign key (tagID)
		references Tags(tagID)
		on delete cascade,
	foreign key (postID)
		references Posts(postID)
		on delete cascade
);

CREATE TABLE UserFollowsTag (
	tagID int,
	userID int,
	primary key (tagID, userID),
	foreign key (tagID)
		references Tags(tagID)
		on delete cascade,
	foreign key (userId)
		references Users(userID)
		on delete cascade
);

INSERT INTO Users (username, fName, lName, email, password, zipcode, accountType) values (
	'connork26',
	'Connor',
	'Kuehnle',
	'connor@email.com',
	'password',
	'94928',
	'U'
);

INSERT INTO Styles (name, description) values (
	'American IPA',
	'The American IPA is a different soul from the reincarnated IPA style. More flavorful than the withering English IPA, color can range from very pale golden to reddish amber. Hops are typically American with a big herbal and / or citric character, bitterness is high as well. Moderate to medium bodied with a balancing malt backbone.'
);

INSERT INTO Styles (name, description) values (
	'American Pale Ale',
	'Of British origin, this style is now popular worldwide and the use of local ingredients, or imported, produces variances in character from region to region. Generally, expect a good balance of malt and hops. Fruity esters and diacetyl can vary from none to moderate, and bitterness can range from lightly floral to pungent.'
);

INSERT INTO Styles (name, description) values (
	'American Stout',
	'Inspired from English & Irish Stouts, the American Stout is the ingenuous creation from that. Thankfully with lots of innovation and originality American brewers have taken this style to a new level. Whether it is highly hopping the brew or adding coffee or chocolate to complement the roasted flavors associated with this style. '
);

INSERT INTO Breweries (name, streetAddress, city, stateAbrv, zipcode) values (
	'Lagunitas',
	'1280 N McDowell Blvd',
	'Petaluma',
	'CA',
	94954	
);

INSERT INTO Breweries (name, streetAddress, city, stateAbrv, zipcode) values (
	'Ballast Point',
	'9045 Carroll Way',
	'San Diego',
	'CA',
	92121	
);

INSERT INTO Breweries (name, streetAddress, city, stateAbrv, zipcode) values (
	'Sierra Navada',
	'1075 East 20th Street',
	'Chico', 
	'CA',
	95928
);

INSERT INTO Beers (name, breweryID, styleID, description, abv) values (
	'Lagunitas IPA',
	1,
	1,
	'Lagunitas IPA was our first seasonal way back in 1995. The recipe was formulated with malt and hops working together to balance it all out on your ‘buds so you can knock back more than one without wearing yourself out. Big on the aroma with a hoppy-sweet finish that’ll leave you wantin’ another sip.',
	6.2
); 

INSERT INTO Beers (name, breweryID, styleID, description, abv) values (
	'Pale Ale',
	2,
	2,
	'Our original Pale Ale is a rich golden brew, crafted with aromatic German hops and rounded out with a blend of American and Munich malts. While it’s hopped like a lager, we ferment it like an ale to create a smooth, bright taste that has just a hint of fruit and spice. It’s extremely drinkable, like a Kolsch should be, yet complex, like a good craft beer demands.',
	5.2
);

INSERT INTO Beers (name, breweryID, styleID, description, abv) values (
	'Stout',
	3,
	3,
	'Before Sierra Nevada was a reality, our founders brewed beer at home and dreamed of building a brewery one day. Back then, they brewed the beers they wanted to drink—bold and full of flavor. Stouts had always been a favorite, so when we needed a big and rich beer to test out the brewing system at our fledgling brewery, stout was the obvious choice. Thirty years later, not much has changed. We’re still brewing the beers we want to drink and our classic Stout is the same as it’s ever been—big, rich, bold, black as night and filled with the wild-eyed passion of which dreams are made.',
	5.8
); 

INSERT INTO Pubs (name, description, streetAddress, city, stateAbrv, zipcode) values (
	'Twin Oaks Tavern',
	'Small, local tavern with a lot of history',
	'5745 Old Redwood Hwy', 
	'Penngrove', 
	'CA',
	94951
);

INSERT INTO Pubs (name, description, streetAddress, city, stateAbrv, zipcode) values (
	'Beer Craft',
	'Bottle shop with 12 taps in the back',
	'5704 Commerce Blvd', 
	'Rohnert Park', 
	'CA',
	94928 
);

INSERT INTO Pubs (name, description, streetAddress, city, stateAbrv, zipcode) values (
	'Friar Tucks Pub',
	'Irish bar popular with the local college scene',
	'8201 Old Redwood Hwy', 
	'Cotati', 
	'CA',
	94931 
);

INSERT INTO Pubs (name, description, streetAddress, city, stateAbrv, zipcode) values (
	'Lagunitas Tasting Room',
	'Tasting room on brewery premis with live music and awesome food',
	'1280 N McDowell Blvd',
	'Petaluma',
	'CA',
	94954 
);

INSERT INTO TapList (beerID, pubID) values (
	1,
	1
);

INSERT INTO TapList (beerID, pubID) values (
	2,
	2
);

INSERT INTO TapList (beerID, pubID) values (
	3,
	3
);


