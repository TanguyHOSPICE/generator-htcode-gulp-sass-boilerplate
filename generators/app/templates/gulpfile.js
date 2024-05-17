/* browsersync is a powerful tool that makes it easy to test your website while you're building it 
it works by spinning up a local server and syncing it up to your browser
then anytime you make changes in your code editor it'll reload the browser automatically to update it in real
time you won't have to keep manually reloading every 10 seconds anymore */

// Gulp CLI (Command Line Interface) is a tool that allows you to run Gulp tasks from the command line
// install it globally by running the following command in your terminal: npm i -g gulp-cli

/* Need to install gulp again just in that local project to run the gulp file and things like that so it's ind of a two-part process for gulp */

// npm init -y

/* the packages we want to install are : npm install gulp gulp-sass gulp-postcss cssnano gulp-terser browser-sync
- gulp since we're using gulp obviously
- gulp-sass: to compile our sass files to css
- gulp-postcss: because we're installing 
- cssnano (which is a post css plugin) :to minify our css files
- gulp-terser: to minify our javascript files 
- browser-sync */

// ! To run use cmd: gulp
// ! To close the server use ctrl + c

// gulpfile.js where we're going to add all of our gulp configuration :

// import the necessary modules as JS constants
const { src, dest, watch, series } = require('gulp'); // gulp functions
const sass = require('gulp-sass')(require('sass')); // sass compiler
const postcss = require('gulp-postcss'); // postcss
const cssnano = require('cssnano'); // cssnano plugin for postcss
const terser = require('gulp-terser'); // terser for minifying js files
const browsersync =
	require('browser-sync').create(); /*  it's importing the package the the browser sync package but we're also going to run the create function and this is going to kind of initialize the browser sync server that we're going to be using */

// Sass Task
const scssTask = () => {
	return src('app/scss/style.scss', {
		sourcemaps: true,
	}) //read from the app/scss/style.scss file so that's the source file we're going to get our sass styles from, we also want to turn on source maps so we'll set source maps to true this is something that's kind of built in now with gulp which is nice we don't have to install a separate package anymore
		.pipe(sass()) //then we're going to pipe on the sass function itself and then once we have our sass compiled we're going to minify
		.pipe(postcss([cssnano()])) //it so we're going to use that post css plugin that we installed so post css and then in the parameters we're going to run css   nano there we go and lastly with our  minified css file
		.pipe(dest('dist', { sourcemaps: '.' })); //we're going to save it using the dest function and we want to save it in a new folder so we're going to call this dist and we're also going to save our source maps there so source maps and this sort of dot will tell gulp to save it in the same location so in the disk folder
};

// JavaScript Task
const jsTask = () => {
	return src('app/js/script.js', { sourcemaps: true }) //return a node stream using source and this is coming from where our script file is so app.js script.js and again we're turning on source maps
		.pipe(terser()) //for javascript the only thing we're doing is minifying our javascript file on running terser
		.pipe(dest('dist', { sourcemaps: '.' })); //save it i'm using the dest function again in our disk folder and again saving our source maps in the same location
};

// Browsersync Tasks
//this is going to initialize a local server and just sort of start running it so we're going to create a new function browser sync serve if i can type and we do need to use a callback function as the parameter because the browser sync function is not a gulp plugin like some of the other plugins that we've used so we're not returning anything so in order to tell the asynchronous function that is complete we need to manually explicitly end it by using that callback function so in this function i'm going to say browser sync init this starts up the server and we need to also tell it where the server is going to be based out of so using the server option we're setting base dir dot to be the the root directory that we're running the gulp file from which is our project root and that's where we want our server to be based off of because that's where the index.html file is located so that's our browsersync function and then at the end we'll run our callback function to again signify that it is complete

const browsersyncServe = (cb) => {
	browsersync.init({
		server: {
			baseDir: '.',
		},
	});
	cb();
};

//we also want to reload the server whenever we make code changes so we need to create a new function for that we're going to call this browser sync reload and again with a callback and this one is pretty simple it's just running browser sync reload and then the callback okay so now that we have our browsersync tasks all set up as well as our sass and javascript tasks let's add it into our gulp workflow so
const browsersyncReload = (cb) => {
	browsersync.reload();
	cb();
};

// Watch Task
// need to create our watch tasks so we're just going to add that here for now this is going to be our default gulp task this is what's going to run when you type gulpin on the command line from the very beginning now let's create our watch task just create a task here actually let's create it above our default gulp task so watch task and this is a gulp thing so it's going to watch now let's think about this so we want to watch our our file so we have index.html and we have sas and javascript files if i make a change to my index.html file i don't necessarily want to rerun my sas and javascript tasks all i want to do really is to reload the website because i've made some changes in the markup so we're going to create two different watch functions in this task so the first one is going to be watching any html files of course we only have that one file but we'll just add a wild card there just for the heck of it and if it detects if the watch function detects any changes in the html files we want to run the reload browsersync reload function that we just created so browser sync reload and that's it for when we make changes in html now if we make any changes in our sas or javascript files we want to run our sas and javascript tasks and then also run the reload function so we'll add another one here this is going to watch um someone watch two sets of files first is going to be app scss um style.scss and if you have more subfolders in your sas folder what you can actually do is a css and then add the double asterisks wildcard scss files so after that we also want to watch our javascript files so app and then we can do the same thing js uh wild card or that's a glob rather so that can mean that if you have any subfolders in the javascript folder or no folders at all which which which is what we have since we only have that one javascript file and then wildcard js so the first parameter in the watch function is the files that we're watching then there's another parameter that's going to be what we're going to run when any changes are detected so since we want to run our sas in javascript tasks we're going to use a series thing again scss task js task and then we're going to run browser sync reload now we have all of our tasks we have our sas task javascript task our two browsersync tasks to both start and reload our browsersync server and we have our watch task that's going to watch our files and run browser sync reload anytime changes are detected
const watchTask = () => {
	watch('*.html', browsersyncReload);
	watch(['app/scss/**/*.scss', 'app/js/**/*.js'], series(scssTask, jsTask, browsersyncReload));
};

// Default Gulp task
exports.default = series(scssTask, jsTask, browsersyncServe, watchTask);
