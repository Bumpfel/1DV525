## LNU IT
In this assignment you are supposed to build a script that will change the background color and text color of all links (a-elements) in the HTML-document (client/index.html).

The page is a copy of the first web page ever created so the HTML-code might look a little different than you are used to. This will not matter at all though. If you like to study the orignal page you will find it at [http://info.cern.ch/hypertext/WWW/TheProject.html](http://info.cern.ch/hypertext/WWW/TheProject.html).

You are free to write your own css code (in a separate file of course) and using javascript make sure the link-element you will need to load the css-file is injected into the head-element.

* All links should have yellow background color and black foreground color
* You are not allowed to change anything in client/index.html whithout writing javascript to change it for you.
* We have already added the scriptelement last in the index.html

### Bonus task
Webpack is beeing used to "compile" our javascript code and making sure that dependencies are managed. However, webpack can also be used to bundle and dynamicly load our stylesheets. Insteed of dynamicly adding a style-element using the DOM-api you could simply write:
`require('../css/style.css')` 
in your app.js and you are finnished.  

|  |  |
| ------------- | ------------- |
|  Repo | [exercise-lnu-it](https://github.com/CS-LNU-Learning-Objects/exercise-lnu-it) |
| Level  | A  |
| Lectures| [Browser](https://github.com/CS-LNU-Learning-Objects/client-side-javascript/tree/master/lectures/01-browser), [DOM & Event](https://github.com/CS-LNU-Learning-Objects/client-side-javascript/tree/master/lectures/02-domevent)|
| Keywords| Getting started, DOM, Style manipulation|
|Solutions| [Code](https://github.com/CS-LNU-Learning-Objects/exercise-lnu-it/tree/solution)|

