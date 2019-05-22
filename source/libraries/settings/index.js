
"use strict";

var fs = require ('fs');
var util = require ('../../util.js');
var board = require ('./board.js');
var debug = require ('debug')('wyliodrin:app:server:settings');
var os = require ('os');
var version = 0;
try
{
	version = require ('../../../package.json').version;
}
catch (e)
{
	version = require ('../../package.json').version;
}

console.log ('Loading settings library');

debug ('Reading name');

var boardname = os.hostname();

try
{
	var setup = null;
	let setupDate = new Date (1970, 0, 0);
	try { setup = JSON.parse (fs.readFileSync ('/boot/wyliodrin.json')); setupDate = fs.statSync ('/boot/wyliodrin.json').mtime; } catch (e) { console.log ('INFO: no /boot/wyliodrin.json'); }
	if (!setup) try { setup = JSON.parse (fs.readFileSync ('/wyliodrin.json')); setupDate = fs.statSync ('/wyliodrin.json').mtime; } catch (e) { console.log ('INFO: no /wyliodrin.json'); }

	var p = null;
	if (setup.name && setup.name.trim () !== '') boardname = setup.name.trim ();

	try
	{
		if (fs.existsSync (PATH_WIFI))
		{
			let date = fs.statSync (PATH_WIFI);
			if (date > setupDate || (boardname === os.hostname())) boardname = fs.readFileSync ('/wyliodrin/boardname').toString ();
		}
	}
	catch (e)
	{
		console.log ('ERROR: no boardname');
	}
}
catch (exception)
{
	
}


debug ('Reading board type');
var boardtype = null;

if (util.isWindows())
{
	boardtype = fs.readFileSync ('c:\\wyliodrin\\boardtype.txt').toString();
}
else
{
	boardtype = fs.readFileSync ('/etc/wyliodrin/boardtype').toString();
}

debug ('Board type '+boardtype);
if (!boardtype)
{
	console.log ('Unknown board type');
	process.exit (-10);
}

if (board[boardtype].linux || board[boardtype].windows)
{
	if (util.isWindows())
	{
		board[boardtype] = board[boardtype].windows;
	}
	else
	{
		board[boardtype] = board[boardtype].linux;
	}
}

var env = {
	HOME: (util.isWindows()?'c:\\wyliodrin':'/wyliodrin'),
	wyliodrin_board: boardtype,
	wyliodrin_version: version
};

debug ('Loading settings from /etc/wyliodrin/settings_'+boardtype+'.json');
var SETTINGS = null;

if (util.isWindows())
{
	SETTINGS = require ('c:\\wyliodrin\\settings_'+boardtype+'.json');
}
else
{
	SETTINGS = require ('/etc/wyliodrin/settings_'+boardtype+'.json');
}

var CONFIG_FILE = {};

try
{
	CONFIG_FILE = require (SETTINGS.CONFIG_FILE);
}
catch (e)
{
	debug ('wyliodrin.json missing, standard setup');
	CONFIG_FILE.jid = '';
}

module.exports.board = board[boardtype];
module.exports.boardtype = boardtype;
module.exports.env = env;
module.exports.CONFIG_FILE = CONFIG_FILE;
module.exports.SETTINGS = SETTINGS;
module.exports.boardname = boardname;
