const cheerio = require('cheerio');
const download = require('image-downloader');
const fs = require('fs');
const path = require('path');
const request = require('request');

var fileContents = fs.readFileSync(path.resolve("./input.txt"), 'utf8');
var $ = cheerio.load(fileContents, { decodeEntities: false });

var outputFolder = "./images/";

var asyncForEach = async function(array, callback){
	for(var i = 0; i<array.length; i++){
		await callback(array[i]);
	}
};

asyncForEach($("img"), async function(elem){
	let src = $(elem).attr("src");
	let options = {};
	options.url = encodeURI(src);
	let newUrl = options.url.match(/(?!.*\/).+.(jpg|jpeg|png|svg|gif)/gi)[0].replace( /[%'_/s<>:"\/\\|?*]+/g, '' );
	options.dest = outputFolder + newUrl;
	try{
		const { filename, image } = await download.image(options);
		$(elem).attr("src", `/design/images/blog/${filename.match(/(?!.*\/).+.(jpg|png|svg|gif)/gi)[0]}`);
    	console.log('File saved to', filename.match(/(?!.*\/).+.(jpg|png|svg|gif)/gi)[0])
	}
	catch(err){
    	console.log(`Error for: newUrl`, err)
	}
}).then( () => {
	fs.writeFileSync('output.txt', $.html());
	console.log("Done");
});




