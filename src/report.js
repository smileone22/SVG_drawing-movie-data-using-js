// Add code here
//node report.js /Users/heewon/Documents/GitHub/smileone22-homework02/src/disney_movies.json
//const path = require('path');



const fs = require('fs');
const disney = require('./disney.js');

const GenericElement = require('./drawing.js').GenericElement;
const RootElement = require('./drawing.js').RootElement;
const RectangleElement= require('./drawing.js').RectangleElement;
const TextElement=require('./drawing.js').TextElement

const filepath = process.argv[2];

const data = JSON.parse(fs.readFileSync(filepath, 'utf8'));


const bml= disney.bestMovie(data);
let bestMov; 
if (bml.length===1){
    bestMov=bml[0]['title'];
} else {
    bestMov=bml.map(function(a) {return a.title;}); 
}

const avgt = disney.getAverageLength(data);
const topcriticals= disney.listCriticallyAcclaimedMovies(data); //need to print out only 5 
const actorMov=disney.getMoviesByActor(data,'Johnny Depp');



//output 
console.log('* The best movie by IMDB rating is:', bestMov);
console.log('* Top 5 Critically acclaimed movies:', topcriticals);
console.log('* Movies starring Johnny Depp:',actorMov );
console.log('* Average running time:', avgt);

// output for creating 'chart.svg'
const root = new RootElement();
root.addAttrs({width: 800, height: 900});


//circle
const c = new GenericElement('circle');
c.addAttr('r', 75);
c.addAttr('fill', 'black');
c.addAttrs({'cx': 220, 'cy': 220});
root.addChild(c);

const c2 = new GenericElement('circle');
c2.addAttr('r', 35);
c2.addAttr('fill', 'black');
c2.addAttrs({'cx': 150, 'cy': 150});
root.addChild(c2);

const c3 = new GenericElement('circle');
c3.addAttr('r', 35);
c3.addAttr('fill', 'black');
c3.addAttrs({'cx': 290, 'cy': 150});
root.addChild(c3);

// create rectangle, add to root svg element
const r = new RectangleElement(90, 90, 500,5, 'purple');
root.addChild(r);

// create text, add to root svg element
const t = new TextElement(75, 75, 50, 'blue', 'Do you like Disney?🤪');
root.addChild(t);
const t2 = new TextElement(100, 350, 40, 'red', 'YES! We ❤️ DISNEY!');
root.addChild(t2);

// show string version, starting at root element
// write string version to file, starting at root element
root.write('test.svg', () => console.log('done writing!'));
