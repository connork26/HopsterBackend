DROP SCHEMA IF EXISTS hopster;

CREATE SCHEMA hopster;

USE hopster;

CREATE TABLE Users (
	userID INT PRIMARY KEY AUTO_INCREMENT,
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
	description varchar(100)
);

CREATE TABLE Beers (
	beerID int primary key auto_increment,
	breweryID int not null,
	styleID int not null,
	description varchar(250),
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
	postedAt timestamp,
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

-- INSERT INTO Users (username, password, email, zipcode, birthyear) values (
-- 	'connork',
-- 	'password',
-- 	'connor@email.com',
-- 	'92078',
-- 	'1993'
-- );


