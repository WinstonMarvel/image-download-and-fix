const cheerio = require('cheerio');
const download = require('image-downloader');
const fs = require('fs');
const path = require('path');
const request = require('request');
const chalk = require('chalk');

var outputFolder = "./images/";
var reWritePath = "/design/images/blog/";

var fileContents = fs.readFileSync(path.resolve("./input.txt"), 'utf8');
var $ = cheerio.load(fileContents, { decodeEntities: false });

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
		$(elem).attr("src", `${reWritePath}${newUrl}`);
    	console.log( chalk.green(`Saved: ${newUrl}`) );
    	if( $(elem).parent('a').attr('href').match(/(?!.*\/).+.(jpg|jpeg|png|svg|gif)/gi) ){ //Replace parent if also an image
			$(elem).parent('a').attr('href', `${reWritePath}${newUrl}`);
    		console.log( chalk.cyan(`Replaced parent anchor ${src}`) );
    	}
	}
	catch(err){
    	console.log( chalk.bgRed(`Error for: ${newUrl}`), chalk.red(`${err}`) );
	}
}).then( () => {
	fs.writeFileSync('output.txt', $.html());
	console.log( chalk.bgGreen("Done") );
});




