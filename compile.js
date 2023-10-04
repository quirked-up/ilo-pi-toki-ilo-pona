// for now this is just a transpiler, copied and translated from https://github.com/greybeetle213/toki_ilo_pona/blob/main/o-open.py
// probabaly in future I'll make an interpreter to ensure safety & no unintended behaviour and stuff
const WILE_PI_TOKI_ILO = `// Save a cookie
function saveCookie(cookieName, data) {
    let expirationDays = 999 * 360
    if(typeof(data) != "string"){
        throw new TypeError()
    }
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + expirationDays);
  
    const cookieValue = encodeURIComponent(data) + (expirationDays ? "; expires="+expirationDate.toUTCString() : '') + '; path=/';
    document.cookie = cookieName + "=" + cookieValue;
}


function gcd(a, b) {
    return (b) ? gcd(b, a % b) : a;
} 

function decimalToFraction(_decimal) {

    if (_decimal%1 == 0){
        return {
            top     : _decimal,
            bottom  : 1,
            display : _decimal + ':' + 1
        };
    }  else {

        var top     = _decimal.toString().replace(/\\d+[.]/, '');
        var bottom  = Math.pow(10, top.length);
        if (_decimal > 1) {
            top = +top + Math.floor(_decimal) * bottom;
        }
        var x = gcd(top, bottom);
        return {
            top     : (top / x),
            bottom  : (bottom / x),
            display : (top / x) + ':' + (bottom / x)
        };
    }
};

// Read a cookie
function readCookie(cookieName) {
    const name = cookieName + '=';
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
        let c = cookie;
        while (c.charAt(0) === ' ') {
        c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
        const decodedValue = decodeURIComponent(c.substring(name.length, c.length));
        return decodedValue;
        }
    }
    return 0
}
  

function errorDisplayer(err, isSyntaxError=false){
    console.log(err)
    testError = err // so that the error can be accesed from the js debug console if needed
    if(typeof(sike$) != "undefined"){
        clearInterval(sike$)
    }
    ctx$.fillStyle = "#000000"
    leko(0,0,200,200)
    ctx$.fillStyle = "#FF0000"
    if(!isSyntaxError){
        var stack = err.stack // unfortunately, firefox will condense this when console hasn't been opened.. and there's nothing that can be done.
        stack = stack.split("\\n")
        if(stack[stack.length-1] == ""){
            stack.pop()
        }
        var relevantStack = []
        for(i=0; i<stack.length; i++){
            stack[i] = stack[i].split(/@|:/)
            var indexOfFilePath = stack[i].length-3 
            stack[i][indexOfFilePath] = stack[i][indexOfFilePath].split(/\\/+/)
            let s = stack[i][indexOfFilePath][stack[i][indexOfFilePath].length-1]
            // console.log(stack[i], Number(stack[i][indexOfFilePath+1]) - startLineNum -1 )
            if(s.split(' ')[s.split(' ').length-1] === "Function" && Number(stack[i][indexOfFilePath+1]) - startLineNum -1 < lineNumbers$.length && Number(stack[i][indexOfFilePath+1]) - startLineNum -1 >= 0){ // if the error message is in the "main.js" file and is not on a line that is outside of the range of lines of tokiilo code contained in lineNumbers$
                relevantStack.push(stack[i])
            }
        }
        // console.log(stack, relevantStack)
    }else{
        relevantStack =['syntaxerror']
        err.name = "SyntaxError"
    }
    //console.log(relevantStack)
    var printLine = 2
    if (err.message == "KALAMAERROR"){
        sitelentoki("pakala li lon.. ken la sitelen anu kalama ni li lon ala" ,0,12)
    } else if (err.message == "CONVERSOINFLOATERROR"){
        sitelentoki("pakala li lon.. sina wile nasin toki e nanpa kipisi la o kepeken" ,0,12)
        printLine += 1
        sitelentoki("nasintokitannanpakipisi" ,0,24)
    }else {
        switch(err.name){
            case "RangeError":
                sitelentoki("pakala li lon.. suli nanpa anu lili nanpa li ike",0,12)
                break
            case "ReferenceError":
                sitelentoki("pakala li lon.. sina lukin kepeken ijo pi lon ala",0,12)
                break
            case "SyntaxError":
                sitelentoki("pakala li lon.. toki ilo pi nasin pakala li lon",0,12)
                break
            case "TypeError":
                sitelentoki("pakala li lon.. ni li ken ala kepeken ijo pi nasin ni",0,12)
                break
            case "URIError":
                sitelentoki("pakala li lon.. nasin URI ni li ike",0,12)
                break
            case "InvalidStateError":
                sitelentoki("pakala li lon.. ken la sitelen anu kalama ni li lon ala",0,12)
            default:
                sitelentoki("pakala li lon.." ,0,12)
                break
        }
    }
    // console.log(relevantStack)
    for(i=0; i<relevantStack.length; i++){
        if(!isSyntaxError){
            var line = lineNumbers$[Number(relevantStack[i][indexOfFilePath+1])-startLineNum-1]
        }else{
            var line = lineNumbers$[err.lineno-startLineNum-1]
        }
        // console.log(lineNumbers$[Number(relevantStack[i][3])-startLineNum-1])
        sitelentoki("toki ilo nanpa " + Base10ToTokiPona(line[0]+1) + ": ", 0, 12*printLine)
        printLine += 1
        splitLine = line[1].split(" ")
        lineToPrint = ""
        var word = 0
        var wordNum = splitLine.length
        while(word < wordNum){
            if(!splitLine[0] || (ctx$.measureText(lineToPrint).actualBoundingBoxRight + ctx$.measureText(splitLine[0]+" ").actualBoundingBoxRight < 180)){
                lineToPrint += " " + splitLine[0]
                splitLine = splitLine.slice(1)
                word ++
            }else{
                sitelentoki(lineToPrint, 0, printLine*12)
                printLine += 1
                lineToPrint = ""
            }
        }
        if (lineToPrint += ""){
            sitelentoki(lineToPrint, 0, printLine*12)
            printLine += 1
        }
    }
}
window.addEventListener("error", async function(event) {
    testError = event
    await new Promise(resolve => {
        document.addEventListener("DOMContentLoaded", resolve);
    });
    ctx$ = document.getElementById("canvas").getContext("2d")
    // redefine ctx
    // define the size of  pixel all sizes are based around this
    errorDisplayer(event, true)
});    

// window.onerror = function(message, source, lineno, colno, error) {
//     console.log(message, source, lineno, colno, error)
// };

sprites$ = {}
function sitelen(path, x, y){
    if(!sprites$[path]){
        var src = Object.entries(files$).filter(([src,[filename,extension]])=>path==filename+'.'+extension).map(([src])=>src)
        if (src.length) src = src[0]
        else src = path$ + path
        sprites$[path] = new Image()
        sprites$[path].src = src
        sprites$[path].onload = function() {
            ctx$.drawImage(sprites$[path], x, y)
        };
    } else {
        ctx$.drawImage(sprites$[path], x, y)
    }
}

sounds$ = {}
function kalama(path){
    if(!sounds$[path]){
        var src = Object.entries(files$).filter(([src,[filename,extension]])=>path==filename+'.'+extension).map(([src])=>src)
        if (src.length) src = src[0]
        else src = path$ + path
        sounds$[path] = new Audio(src)
        sounds$[path].addEventListener("error", function(event) {
            errorDisplayer(new DOMException("KALAMAERROR"))
        });
        sounds$[path].addEventListener("canplay", function() {
            sounds$[path].play()
        })
    } else {
        sounds$[path].play()
    }
}

function kalamalontenposama(path){
    var path = path$ + path
    if(!sounds$[path]){
        //console.log("kalama!")
        sounds$[path] = new Audio(path)
        sounds$[path].addEventListener("error", function(event) {
            errorDisplayer(new DOMException("KALAMAERROR"))
        });
        sounds$[path].addEventListener("canplay", function() {
            sounds$[path].play()
        })
    } else {
        soundClode = sounds$[path].cloneNode()
        console.log("played")
        soundClode.play()
    }
}

function checkNumber(number) { //checks if a string follows all the rules of a toki pona number
    if (number === "" || typeof(number) == "number") {
        return false;
    }
    if (number.slice(0, 4) === "weka") {
        number = number.slice(4);
    }

    if (number === "ala") {
        return true;
    }
    while (number !== "") {
        if (number.slice(0, 3) === "ali" || number.slice(0, 3) === "ale") {
            number = number.slice(3);
        } else if (number.slice(0, 4) === "mute") {
            number = number.slice(4);
        } else if (number.slice(0, 4) === "luka") {
            number = number.slice(4);
        } else if (number.slice(0, 2) === "tu") {
            number = number.slice(2);
        } else if (number.slice(0, 3) === "wan") {
            number = number.slice(3);
        } else {
            return false;
        }
    }
    return true;
}

function TokiPonaToBase10(tpnum){   
    tpnum = tpnum.replaceAll(" ", "")
    if(!checkNumber(tpnum)){
        throw new TypeError()
    }
    var baseTenNumber = 0
    var weka = false
    if(tpnum.slice(0,4) == "weka"){
        weka = true
        tpnum = tpnum.slice(4)  
    }
    if(tpnum == "ala"){
        return(0)
    }
    while(tpnum.length>0){
        switch(tpnum[0]){
            case "a":
                tpnum = tpnum.slice(3)
                baseTenNumber *= 100
                break
            case "m":
                tpnum = tpnum.slice(4)
                baseTenNumber += 20
                break
            case "l":
                tpnum = tpnum.slice(4)
                baseTenNumber += 5
                break
            case "t":
                tpnum = tpnum.slice(2)
                baseTenNumber += 2
                break
            case "w":
                tpnum = tpnum.slice(3)
                baseTenNumber += 1
                break
        }
    }
    if(weka){
        baseTenNumber *= -1
    }
    return baseTenNumber
}

function Base10ToTokiPona(base10num){
    if(isNaN(base10num)){
        return "nanpapakala"
    }
    if(base10num % 1 != 0){
        throw new Error("CONVERSOINFLOATERROR")
    }
    var tokiPonaNumber = ""
    if(base10num < 0){
        tokiPonaNumber += "weka"
        base10num *= -1
    }
    if(base10num == 0){
        return "ala"
    }
    var endOfNumber = String(base10num)
    if(String(base10num).length % 2 == 0){
        var alisNedded = (String(base10num).length/2)-1
        base10num = Number(endOfNumber.slice(0,2))
        endOfNumber = endOfNumber.slice(2)
    }else{
        var tempnum = Number(endOfNumber.slice(0,1))
        endOfNumber = String(base10num).slice(1)
        while(tempnum>0){
            if(tempnum>=20){
                tempnum -= 20
                tokiPonaNumber += "mute"
            } else if(tempnum>=5){
                tempnum -= 5
                tokiPonaNumber += "luka"
            } else if(tempnum>=2){
                tempnum -= 2
                tokiPonaNumber += "tu"
            } else if(tempnum>=1){
                tempnum -= 1
                tokiPonaNumber += "wan"
            }
        }
        if(base10num >= 100){
            tokiPonaNumber += "ali"
        }
        var alisNedded = String(base10num).slice(1).length/2-1
        base10num = Number(String(base10num).slice(1))
        if(alisNedded<0){
            alisNedded = 0
        }
        base10num = Number(endOfNumber.slice(0,2))
        endOfNumber = endOfNumber.slice(2)
    }
    while(base10num > 0 || endOfNumber.length > 0 || alisNedded > 0){
        while(base10num>0){
            if(base10num>=20){
                base10num -= 20
                tokiPonaNumber += "mute"
            } else if(base10num>=5){
                base10num -= 5
                tokiPonaNumber += "luka"
            } else if(base10num>=2){
                base10num -= 2
                tokiPonaNumber += "tu"
            } else if(base10num>=1){
                base10num -= 1
                tokiPonaNumber += "wan"
            }
        }
        if(alisNedded > 0){
            alisNedded--
            base10num = Number(endOfNumber.slice(0,2))
            endOfNumber = endOfNumber.slice(2) 
            tokiPonaNumber += "ali"
        }
    }
    return tokiPonaNumber
}

function Base10ToTokiPonaFloat(floatNum, joiner){
    if(isNaN(floatNum)){
        //console.error(base10num)
        return("nanpapakala")
    }
    decimalBit = floatNum - Math.floor(floatNum)
    decimalBit = Math.round(decimalBit*1000)/1000
    wholeBit = Math.floor(floatNum)
    fraction = decimalToFraction(decimalBit)
    //console.log(floatNum)
    //console.log(Base10ToTokiPona(wholeBit)+joiner+Base10ToTokiPona(fraction.top)+" tan kipisi "+Base10ToTokiPona(fraction.bottom))
    return(Base10ToTokiPona(wholeBit)+joiner+Base10ToTokiPona(fraction.top)+" tan kipisi "+Base10ToTokiPona(fraction.bottom))
}

function TokiPonaToBase10Float(floatNum, joiner){
    if(!floatNum.includes(joiner) || typeof(floatNum) != "string"){
        throw new TypeError()
    }
    floatNum = floatNum.split(joiner)
    if(floatNum.includes(" tan kipisi ")){
        floatNum[1] = floatNum[1].split(" tan kipisi ")
    } else {
        floatNum[1] = floatNum[1].split("tankipisi")
    }
    return(TokiPonaToBase10(floatNum[0]) + TokiPonaToBase10(floatNum[1][0]) / TokiPonaToBase10(floatNum[1][1]))
}

function sitelentoki(text, x, y){
    if (typeof(text) == "undefined"){
        throw new ReferenceError()
    }
    if (typeof(text) != "string"){
        throw new TypeError()
    }
    ctx$.fillText(text, x, y)
}

function kule(r,g,b){
    r = Math.round((r/9)*255)
    g = Math.round((g/9)*255)
    b = Math.round((b/9)*255)
    if(r > 255 || b > 255 || g > 255){
        throw new RangeError()
    }
    if(r < 0 || b < 0 || g < 0){
        throw new RangeError()
    }
    ctx$.fillStyle = 'rgb('+r+', '+g+', '+b+')'
    ctx$.strokeStyle = 'rgb('+r+', '+g+', '+b+')'
}

function leko(x, y, width, height){
    ctx$.beginPath();
    ctx$.fillRect(x, y, width, height); // rect(x, y, width, height)
    ctx$.stroke();
}

function linja(x0, y0, x1, y1, thickness){
   var dx =  Math.abs(x1-x0), sx = x0<x1 ? 1 : -1;
   var dy = -Math.abs(y1-y0), sy = y0<y1 ? 1 : -1;
   var err = dx+dy, e2;    
   dx *= thickness
   dy *= thickness
   err *= thickness                               /* error value e_xy */
   for (;;){                                                          /* loop */
      ctx$.fillRect(x0,y0, thickness,thickness);
      if (x0 == x1 && y0 == y1) break;
      e2 = 2*err;
      if (e2 >= dy) { err += dy; x0 += sx; }                        /* x step */
      if (e2 <= dx) { err += dx; y0 += sy; }                        /* y step */
   }
}

function sike( xc, yc, d) {  // NOTE: for fill only!
    r = d/2
    var x = r, y = 0, cd = 0;
  
    // middle line
    ctx$.rect(xc - x, yc, r<<1, 1);
  
    while (x > y) {
      cd -= (--x) - (++y);
      if (cd < 0) cd += x++;
      ctx$.rect(xc - y, yc - x, y<<1, 1);    // upper 1/4
      ctx$.rect(xc - x, yc - y, x<<1, 1);    // upper 2/4
      ctx$.rect(xc - x, yc + y, x<<1, 1);    // lower 3/4
      ctx$.rect(xc - y, yc + x, y<<1, 1);    // lower 4/4
    }
    ctx$.fill();
  }

function nena(button){
    switch(button){
        case "pokaopen":
            return left
        case "pokapini":
            return right
        case "anpa":
            return down
        case "sewi":
            return up
        case "nanpawan":
            return keyX
        case "nanpatu":
            return keyZ
    }
}

function safeAdd(items) { //only allows adding of variables of the same type
    if (items.length === 0) {
        return 0; // Handle empty array case
    }
    const type = typeof items[0];
    let answer = items[0];

    for (let i = 1, len = items.length; i < len; i++) {
        if (typeof items[i] === type) {
            answer += items[i];
        } else {
            throw new TypeError();
        }
    }

    return answer;
}

var left = false
var right = false
var down = false
var up = false
var keyX = false
var keyZ = false

document.addEventListener('keydown', (event) => {
    if (event.key == 'ArrowLeft') {
        left = true
    }
})
document.addEventListener('keyup', (event) => {
    if (event.key == 'ArrowLeft') {
        left = false
    }
})
document.addEventListener('keydown', (event) => {
    if (event.key == 'ArrowRight') {
        right = true
    }
})
document.addEventListener('keyup', (event) => {
    if (event.key == 'ArrowRight') {
        right = false
    }
})
document.addEventListener('keydown', (event) => {
    if (event.key == 'ArrowUp') {
        up = true
    }
})
document.addEventListener('keyup', (event) => {
    if (event.key == 'ArrowUp') {
        up = false
    }
})
document.addEventListener('keydown', (event) => {
    if (event.key == 'ArrowDown') {
        down = true
    }
})
document.addEventListener('keyup', (event) => {
    if (event.key == 'ArrowDown') {
        down = false
    }
})
document.addEventListener('keydown', (event) => {
    if (event.key == 'x') {
        keyX = true
    }
})
document.addEventListener('keyup', (event) => {
    if (event.key == 'x') {
        keyX = false
    }
})
document.addEventListener('keydown', (event) => {
    if (event.key == 'z') {
        keyZ = true
    }
})
document.addEventListener('keyup', (event) => {
    if (event.key == 'z') {
        keyZ = false
    }
})
`

function compile(tokiilo) {
    tokiilo = tokiilo.replaceAll("	", "").split("\n")
    var js = [];
    // the numbers mean to insert the item from that posintion in the input to ther
    
    const functions = {
        "nimilipu": [["nimilipu", 'any'], ['document.title = ', 1]],
        "sitelentoki": [["sitelentoki", 'any', 'num', 'num'], ["sitelentoki(", 1, ", ", 2, ", ", 3, ")"]],
        "leko": [["leko", "num", "num", "num", "num"], ["leko(", 1, ", ", 2, ", ", 3, ", ", 4, ")"]],
        "kule": [["kule", "num", "num", "num"],["kule(", 1, ",", 2, ",", 3, ")"]],
        "nena": [["nena", "any"],["nena(", 1, ")"]],
        "nasinnanpa": [["nasinnanpa", "any"], ["TokiPonaToBase10(", 1, ")"]],
        "nasintoki": [["nasintoki", "any"], ["Base10ToTokiPona(", 1, ")"]],
        "nasintokitannanpakipisi": [["nasintokitannanpakipisi", "any", "str"], ["Base10ToTokiPonaFloat(", 1, ", ", 2, ")"]],
        "nasinnanpatannanpakipisi": [["nasinnanpatannanpakipisi", "any", "str"],["TokiPonaToBase10Float(", 1, ", ", 2, ")"]],
        "nanpapikipisiala": [["nanpapikipisiala", "num"], ["Math.round(",1,")"]],
        "nanpalilipikipisiala": [["nanpalilipikipisiala", "num"], ["Math.floor(",1,")"]],
        "nanpasulipikipisiala": [["nanpasulipikipisiala", "num"], ["Math.ceil(",1,")"]],
        "nasinOPENBRACKETsin_CLOSEBRACKET": [["nasinOPENBRACKETsin_CLOSEBRACKET", "num"], ["Math.sin(",1,")"]],
        "nasinOPENBRACKETko_CLOSEBRACKET": [["nasinOPENBRACKETko_CLOSEBRACKET", "num"], ["Math.cos(",1,")"]],
        "nasinOPENBRACKETtan_CLOSEBRACKET": [["nasinOPENBRACKETtan_CLOSEBRACKET", "num"], ["Math.tan(",1,")"]],
        "nasinwekapinasinOPENBRACKETsin_CLOSEBRACKET": [["nasinwekapinasinOPENBRACKETsin_CLOSEBRACKET", "num"], ["Math.asin(",1,")"]],
        "nasinwekapinasinOPENBRACKETko_CLOSEBRACKET": [["nasinwekapinasinOPENBRACKETko_CLOSEBRACKET", "num"], ["Math.acos(",1,")"]],
        "nasinwekapinasinOPENBRACKETtan_CLOSEBRACKET": [["nasinwekapinasinOPENBRACKETtan_CLOSEBRACKET", "num"], ["Math.atan(",1,")"]],
        "nanpasike": [["nanpasike"], ["Math.PI"]],
        "pana": [["pana", "any"], ["return(", 1, ")"]],
        "suli": [["suli", "any"], [1, ".length"]],
        "sulitawasitelen": [["sulitawasitelen", "str"], ["ctx$.measureText(", 1, ").actualBoundingBoxRight"]],
        "sitelen": [["sitelen", "str", "num", "num"],["sitelen(", 1, ", ", 2, ", ", 3, ")"]],
        "kalama": [["kalama", "str"], ["kalama(", 1, ")"]],
        "kalamalontenposama": [["kalamalontenposama", "str"], ["kalamalontenposama(", 1, ")"]],
        "sonaawen": [["sonaawen", "str"],["readCookie(", 1, ")"]],
        "sonaawensin": [["sonaawensin", "str", "str"], ["saveCookie(", 1, ", ", 2, ")"]],
        "nanpatannasa": [["nanpatannasa"],["Math.random()"]],
        "nanpasemepikulupuona": [["nanpasemepikulupuona", "num"], ["Math.sqrt(", 1, ")"]],
        "wekatankulupu": [["wekatankulupu", "any" , "num"], [1, ".splice(", 2, ", 1)"]],
        "linja": [["linja", "num", "num", "num", "num", "num"], ["linja(",1 ,", ", 2, ", ", 3, ", ", 4, ", ", 5, ")"]],
        "sike": [["sike", "num", "num", "num"], ["sike(",1 ,", ", 2, ", ", 3, ")"]],
        "tokipiwekaala": [["tokipiwekaala", "str"], [1, ".replaceAll(' ', '')"]]
    },
    reservedWords = ["tokipiwekaala", "pikulupu", "lilon", "tankipisi", "weka", "nanpasemepikulupuona", "sonaawen", "sonaawensin", "nanpatannasa", "suli", "pana", "nanpasulipikipisiala", "nanpalilipikipisiala", "nanpapikipisiala", "antela", "nasinnanpa", "nimilipu", "nanpa", "sitelentoki", "li", "lipokie", "lipokikine", "likulupue", "likulupukine", "sikela", "pokipitokiilo", "la", "pini", "anu", "lililitawa", "lisulitawa", "lisama", "lisamaala", "te", "to", "kulupu", "e", "kule", "leko"]
    var te = false,
    kulupuAmmount = 0,
    sikeExists = false,
    firstteList = false,
    firstte = false,
    teFunction = false,
    nanpa = false,
    functionToken = false,
    functionTokens = [],
    lineNumbers = [] // this varible is used to know what line to display when an error is thrown in the js

    function Base10ToTokiPona(base10num){
        if(isNaN(base10num)){
        console.error(base10num)
            return "nanpapakala"
        }
        if(base10num % 1 != 0){
            throw new Error("CONVERSOINFLOATERROR")
        }
        var tokiPonaNumber = ""
        if(base10num < 0){
            tokiPonaNumber += "weka"
            base10num *= -1
        }
        if(base10num == 0){
            return "ala"
        }
        var endOfNumber = String(base10num)
        if(String(base10num).length % 2 == 0){
            var alisNedded = (String(base10num).length/2)-1
            base10num = Number(endOfNumber.slice(0,2))
            endOfNumber = endOfNumber.slice(2)
        }else{
            var tempnum = Number(endOfNumber.slice(0,1))
            endOfNumber = String(base10num).slice(1)
            while(tempnum>0){
                if(tempnum>=20){
                    tempnum -= 20
                    tokiPonaNumber += "mute"
                } else if(tempnum>=5){
                    tempnum -= 5
                    tokiPonaNumber += "luka"
                } else if(tempnum>=2){
                    tempnum -= 2
                    tokiPonaNumber += "tu"
                } else if(tempnum>=1){
                    tempnum -= 1
                    tokiPonaNumber += "wan"
                }
            }
            if(base10num >= 100){
                tokiPonaNumber += "ali"
            }
            var alisNedded = String(base10num).slice(1).length/2-1
            base10num = Number(String(base10num).slice(1))
            if(alisNedded<0){
                alisNedded = 0
            }
            base10num = Number(endOfNumber.slice(0,2))
            endOfNumber = endOfNumber.slice(2)
        }
        while(base10num > 0 || endOfNumber.length > 0 || alisNedded > 0){
            while(base10num>0){
                if(base10num>=20){
                    base10num -= 20
                    tokiPonaNumber += "mute"
                } else if(base10num>=5){
                    base10num -= 5
                    tokiPonaNumber += "luka"
                } else if(base10num>=2){
                    base10num -= 2
                    tokiPonaNumber += "tu"
                } else if(base10num>=1){
                    base10num -= 1
                    tokiPonaNumber += "wan"
                }
            }
            if(alisNedded > 0){
                alisNedded--
                base10num = Number(endOfNumber.slice(0,2))
                endOfNumber = endOfNumber.slice(2) 
                tokiPonaNumber += "ali"
            }
        }
        return tokiPonaNumber
}

    function TokiPonaToBase10(tpnum){   
        tpnum = tpnum.replaceAll(" ", "")
        if(!checkNumber(tpnum)){
            throw new TypeError()
        }
        var baseTenNumber = 0
        var weka = false
        if(tpnum.slice(0,4) == "weka"){
            weka = true
            tpnum = tpnum.slice(4)  
        }
        if(tpnum == "ala"){
            return(0)
        }
        while(tpnum.length>0){
            switch(tpnum[0]){
                case "a":
                    tpnum = tpnum.slice(3)
                    baseTenNumber *= 100
                    break
                case "m":
                    tpnum = tpnum.slice(4)
                    baseTenNumber += 20
                    break
                case "l":
                    tpnum = tpnum.slice(4)
                    baseTenNumber += 5
                    break
                case "t":
                    tpnum = tpnum.slice(2)
                    baseTenNumber += 2
                    break
                case "w":
                    tpnum = tpnum.slice(3)
                    baseTenNumber += 1
                    break
            }
        }
        if(weka){
            baseTenNumber *= -1
        }
        return baseTenNumber
    }

    function Base10ToTokiPona(base10num){
        if(isNaN(base10num)){
        console.error(base10num)
            return "nanpapakala"
        }
        if(base10num % 1 != 0){
            throw new Error("CONVERSOINFLOATERROR")
        }
        var tokiPonaNumber = ""
        if(base10num < 0){
            tokiPonaNumber += "weka"
            base10num *= -1
        }
        if(base10num == 0){
            return "ala"
        }
        var endOfNumber = String(base10num)
        if(String(base10num).length % 2 == 0){
            var alisNedded = (String(base10num).length/2)-1
            base10num = Number(endOfNumber.slice(0,2))
            endOfNumber = endOfNumber.slice(2)
        }else{
            var tempnum = Number(endOfNumber.slice(0,1))
            endOfNumber = String(base10num).slice(1)
            while(tempnum>0){
                if(tempnum>=20){
                    tempnum -= 20
                    tokiPonaNumber += "mute"
                } else if(tempnum>=5){
                    tempnum -= 5
                    tokiPonaNumber += "luka"
                } else if(tempnum>=2){
                    tempnum -= 2
                    tokiPonaNumber += "tu"
                } else if(tempnum>=1){
                    tempnum -= 1
                    tokiPonaNumber += "wan"
                }
            }
            if(base10num >= 100){
                tokiPonaNumber += "ali"
            }
            var alisNedded = String(base10num).slice(1).length/2-1
            base10num = Number(String(base10num).slice(1))
            if(alisNedded<0){
                alisNedded = 0
            }
            base10num = Number(endOfNumber.slice(0,2))
            endOfNumber = endOfNumber.slice(2)
        }
        while(base10num > 0 || endOfNumber.length > 0 || alisNedded > 0){
            while(base10num>0){
                if(base10num>=20){
                    base10num -= 20
                    tokiPonaNumber += "mute"
                } else if(base10num>=5){
                    base10num -= 5
                    tokiPonaNumber += "luka"
                } else if(base10num>=2){
                    base10num -= 2
                    tokiPonaNumber += "tu"
                } else if(base10num>=1){
                    base10num -= 1
                    tokiPonaNumber += "wan"
                }
            }
            if(alisNedded > 0){
                alisNedded--
                base10num = Number(endOfNumber.slice(0,2))
                endOfNumber = endOfNumber.slice(2) 
                tokiPonaNumber += "ali"
            }
        }
        return tokiPonaNumber
    }
    function toki_pona_to_base_10(tpnum) {
        tpnum = tpnum.replaceAll(" ", "")
        var base_ten_number = 0
        var weka = false

        if (tpnum.slice(0,4) == "weka") {
            weka = true
            tpnum = tpnum.slice(4)
        }
        if (tpnum == "ala") {
            return 0
        }

        while (tpnum.length > 0) {
            if (tpnum.startsWith("a")) {
                tpnum = tpnum.slice(3)
                base_ten_number *= 100
            } else if (tpnum.startsWith("m")) {
                tpnum = tpnum.slice(4)
                base_ten_number += 20
            } else if (tpnum.startsWith("l")) {
                tpnum = tpnum.slice(4)
                base_ten_number += 5
            } else if (tpnum.startsWith("t")) {
                tpnum = tpnum.slice(2)
                base_ten_number += 2
            } else if (tpnum.startsWith("w")) {
                tpnum = tpnum.slice(3)
                base_ten_number += 1
            }
        }
        if (weka)
            base_ten_number *= -1

        return base_ten_number
    }
    function checkNumber(number) {
        if (number == "")
            return false
        if (number.slice(0,4) == "weka")
            number = number.slice(4);
        if (number == "ala") {
            return true
        }
        while (number != "") {
            if (number.slice(0,3) == "ali" || number.slice(0,3) == "ale") {
                number = number.slice(3)
            }
            else if (number.slice(0,4) == "mute")
                number = number.slice(4)
            else if (number.slice(0,4) == "luka")
                number = number.slice(4)
            else if (number.slice(0,2) == "tu")
                number = number.slice(2)
            else if (number.slice(0,3) == "wan")
                number = number.slice(3)
            else
                return false
        }
        return true
    }

    function checkSyntax(line_number, syntax, line) {
        if (line.length != syntax.length)
            throw Error("pakala li lon toki nanpa "+Base10ToTokiPona(line_number)+"!\n"+line.join("  ")+"\ntoki ni li wile e ijo pi mute ante. ona o kepeken nasin ni:"+syntax.join("  "))
        for (let i=0; i<line.length; i++) {
            if (syntax[i] == 'any') {
                if (reservedWords.includes(line[i]))
                    throw Error("pakala li lon toki nanpa "+Base10ToTokiPona(line_number)+"!\n"+line.join("  ")+"\npoki pi toki ilo li ken ala kepeken nimi ni: "+line[i])
            }
            else if (syntax[i] == 'num') {
                if (line[i].includes(`"`) || reservedWords.includes(line[i]))
                    throw Error("pakala li lon toki nanpa "+Base10ToTokiPona(line_number)+"!\n"+line.join("  ")+"\nni li ken nanpa taso: "+line[i])
            }
            else if (syntax [i] == "str") {
                if (checkNumber(line[i]))
                    throw Error("pakala li lon toki nanpa "+Base10ToTokiPona(line_number)+"!\n"+line.join("  ")+"\nni li ken sitelen taso"+line[i])
            }
            else if (syntax[i] == 'var' || reservedWords.includes(line[i])) {
                if (line[i].includes('"') || checkNumber(line[i]))
                    throw Error("pakala li lon toki nanpa "+Base10ToTokiPona(line_number)+"!\n"+line.join("  ")+"\nni li ken poki taso: "+line[i])
            }
            else if (syntax[i] != line[i])
                throw Error("pakala li lon toki nanpa "+Base10ToTokiPona(line_number)+"!\n"+line.join("  ")+"\ntoki ni o kepeken nasin ni:"+syntax.join("  "))
        }
    }

    function convertFunctionCallToJS(args) {
        checkSyntax(line_number, functions[args[0]][0], args)
        if (args.length == functions[args[0]][0].length) {
            var codeLine = ""
            for (const item of functions[args[0]][1]) {
                if (typeof(item) == "string")
                    codeLine += item
                else // if its an int, add the corrosponding item from the tokens list
                    codeLine += args[item]
            }
            return codeLine
        }
        throw Error("toki nanpa "+Base10ToTokiPona(line_number)+"\nla ijo li pakala")
    }

    function convertConditinal(tokens) {
        output = []
        i = 0
        while (i < tokens.length) {
            if (tokens[i] == "lisama")
                tokens[i] = "=="
            if (tokens[i] == "lisamaala")
                tokens[i] = "!="
            if (tokens[i] == "lililitawa")
                tokens[i] = "<"
            if (tokens[i] == "lisulitawa")
                tokens[i] = ">"
            if (tokens[i] == "la")
                tokens[i] = "&&"
            if (tokens[i] == "anu")
                tokens[i] = "||"
            if (tokens[i] == "lilon") {
                output[i-1] = tokens[i+1] + ".includes("+tokens[i-1]+")"
                i += 1
            }
            else {
                output.push(tokens[i])
            }
            i += 1
        }
        return(output)
    }

    // get all functions that are deffined in the code
    for (let line_number = 0; line_number < tokiilo.length; line_number++) {
        let line = tokiilo[line_number]

        line = line.split("  ")
        var tokens = []
        for (let i =0; i < line.length; i++) {
            if (line[i].replaceAll(" ", "") != "toki:")
                tokens.push(line[i].replaceAll(" ", ""))
            else
                break
        }
        if (tokens.length > 0) {
            if (tokens[0].replaceAll(" ", "") == "pokipitokiilo") {
                    if (tokens[tokens.length-1] != "la") {
                        throw Error("pakala li lon toki nanpa "+Base10ToTokiPona(line_number)+"!\nnimi 'la' o pini e toki ni:\n"+tokens.join(" "))
                    }
                    checkSyntax(line_number, ["pokipitokiilo", "var"], tokens.slice(0, 2))
                    if (tokens[1] == ":sike" ) {
                        tokens[1] = "_sike"
                        sikeExists = true
                    } else {
                        functionMethod = [tokens[1]+"("]
                        for (let i = 1; i < tokens.slice(2,-1).length+1; i++) {
                            functionMethod.push(i)
                            functionMethod.push(", ")
                        }
                        if(functionMethod[functionMethod.length-1] == ", ") {
                            functionMethod.pop()
                        }
                        functionMethod.push(")")
                        let anylist = []
                        for (let i=0;i<tokens.slice(2, -1).length;i++) anylist.push("any");
                        functions[tokens[1]] = [[tokens[1], ...anylist], functionMethod]
                        //print([tokens.slice(1, -1), functionMethod])
                    }
            }
        }
    }
    tokens = []
    line = []
    for (line_number = 0; line_number < tokiilo.length; line_number++) {
        let line = tokiilo[line_number]
        rawLine = line.replaceAll("    ", "")
        line = line.split("  ")
        firstParse = []
        wordNum = 0
        while (wordNum < line.length) {
            line[wordNum] = line[wordNum].replaceAll("[", "OPENBRACKET").replaceAll("]", "CLOSEBRACKET").replaceAll(":", "_")
            spacelessWord = line[wordNum].replaceAll(" ", "")
            if (!(/^([a-zA-z]|_|OPENBRACKET|CLOSEBRACKET)*$/).exec(spacelessWord))
                throw Error("pakala li lon toki nanpa "+Base10ToTokiPona(line_number)+"!\nsitelen ni li ken ala lon:\n"+spacelessWord+"\n"+line.join("  "))
            word = line[wordNum]
            if (spacelessWord == "toki_")
                break
            if (spacelessWord != "") {
                if (checkNumber(spacelessWord)) {
                    line[wordNum] = (toki_pona_to_base_10(spacelessWord)).toString()
                    spacelessWord = line[wordNum] 
                }
                if (spacelessWord == "nanpa") {
                    if (line[wordNum+1].replaceAll(" ", "") in functions)
                        throw Error("pakala li lon toki nanpa "+Base10ToTokiPona(line_number)+"!\npoki pi toki ilo li ken ala lon pini pi nimi 'nanpa': "+line.join("  "))
                    if (checkNumber(line[wordNum+1]))
                        line[wordNum+1] = (toki_pona_to_base_10(line[wordNum+1])).toString()
                    firstParse[firstParse.length-1] += "["+line[wordNum+1].replaceAll(" ", "")+"]"
                    wordNum += 1
                }
                else if (spacelessWord == "te") {
                    foundTo = false
                    let i
                    for (i=wordNum; i<line.length; i++) {
                        if (line[i].replaceAll(" ", "") == "to") {
                            foundTo= true
                            break
                        }
                    }
                    if (foundTo == false)
                        throw Error("pakala li lon toki nanpa "+Base10ToTokiPona(line_number)+"!\nsitelen 'to' o pini e sitelen 'te': "+line.join("  "))
                    firstParse.push('"' + line.slice(wordNum+1,i).join("  ") + '"')
                    wordNum = i
                } else {
                    firstParse.push(spacelessWord)
                }
            }
            wordNum += 1
        } 
        secondParse = []
        wordNum = 0
        while (wordNum < (firstParse).length) {
            spacelessWord = firstParse[wordNum].replaceAll(" ", "")
            if (spacelessWord == "kulupu") {
                foundPini = false
                let i
                for (i=wordNum; i<firstParse.length; i++) {
                    if (firstParse[i] == "pini") {
                        foundPini = true
                        break
                    }
                }
                if (foundPini == false)
                    throw Error("pakala li lon toki nanpa "+Base10ToTokiPona(line_number)+"!\nsitelen 'pini' o pini e sitelen 'kulupu': "+line.join("  "))
                
                // Group elements enclosed within 'kulupu' and 'pini'
                sublist = firstParse.slice(wordNum+1, i)
                secondParse.push('[' + (sublist.join(", ")) + ']')
                
                wordNum = i
            } else {
                secondParse.push(firstParse[wordNum])
            }
            wordNum += 1
        }
        tokens = []
        wordNum = 0
        while (wordNum < secondParse.length) {
                spacelessWord = secondParse[wordNum].replaceAll(" ", "")
                if (spacelessWord in functions) {
                    functionBits = secondParse.slice(wordNum, wordNum+functions[spacelessWord][0].length)
                    //checkSyntax(line_number, functions[spacelessWord][0], functionBits)
                    //print(functionBits)
                    tokens.push(convertFunctionCallToJS(functionBits))
                    wordNum += functionBits.length - 1
                } else {
                    tokens.push(secondParse[wordNum])
                }
                wordNum += 1
            } //print(tokens)
        if (kulupuAmmount != 0)
            throw Error("pakala li lon toki nanpa "+Base10ToTokiPona(line_number)+"!\nnimi 'pini' o pini e sitelen 'kulupu': "+line.join("  "))
        if (functionToken)
            throw Error("pakala li lon toki nanpa "+Base10ToTokiPona(line_number)+"!\nnimi pi mute pi lili ike li lon pini pi nimi '" + functionTokens[0] + "': "+line.join("  "))
        // None means anything. 1 means a number. 2 means variable
        if (tokens.join("").replaceAll(" ", "") != "") {
            if (tokens[0] == "pokipitokiilo") {
                if (tokens[1] == "_sike") {
                    tokens[1] = "_sike()"
                }
                js.push("function "+tokens[1]+"{")
                lineNumbers.push([line_number, rawLine])
            } else if (tokens[0] == "sikela") {
                if (tokens[tokens.length-1] != "la")
                    throw Error("pakala li lon toki nanpa "+Base10ToTokiPona(line_number)+"!\nnimi 'la' o pini e toki ni:\n"+tokens.join("  "))
                tokens = convertConditinal(tokens)
                js.push("while (" + tokens.slice(1, -1).join(" ")+"){")
                lineNumbers.push([line_number, rawLine])
            } else if (tokens[0] == "pini") {
                js.push("}")
                lineNumbers.push([line_number, rawLine])
            } else if (tokens[0] == "antela") {
                if ((tokens).length != 1) {
                    tokens = convertConditinal(tokens)
                    js.push("} else if (" + tokens.slice(1, -1).join(" ")+"){")
                    lineNumbers.push([line_number, rawLine])
                } else {
                    js.push("}else{")
                    lineNumbers.push([line_number, rawLine])
                }
            } else if (tokens[tokens.length-1] == "la") {
                tokens = convertConditinal(tokens)
                js.push("if (" + tokens.slice(0,-1).join(" ")+"){")
                lineNumbers.push([line_number, rawLine])
            } else if ((tokens).length > 2) {
                if (tokens[1] == "li") {
                    checkSyntax(line_number, ["var", "li", "any"], tokens)
                    js.push(tokens[0]+" = "+tokens[2])
                    lineNumbers.push([line_number, rawLine])
                } else if (tokens[1] == "lipokie") {
                    if (tokens[0].includes('"') || typeof(tokens[0]) == "number")
                        throw Error("pakala li lon toki nanpa "+Base10ToTokiPona(line_number)+"!\n"+line.join("  ")+"\nni li ken poki taso: "+line[0])
                    for (let i=0; i<tokens.slice(2).length; i++) {
                        if (tokens[i+2] == "e")
                            tokens[i+2] = ","
                        else if (tokens[i+2] == "pikulupu")
                            tokens[i+2] = "*"
                        else if (tokens[i+2] == "tankipisi")
                            tokens[i+2] = "/"
                    }
                    js.push(tokens[0] + " = safeAdd([" + tokens.slice(2, ).join(" ") + "])")
                    lineNumbers.push([line_number, rawLine])
                } else if (tokens[1] == "lipokikine") {
                    if (tokens[0].includes('"') || typeof(tokens[0]) == "number")
                        throw Error("pakala li lon toki nanpa "+Base10ToTokiPona(line_number)+"!\n"+line.join("  ")+"\nni li ken poki taso: "+line[0])
                    for (let i=0; i<tokens.slice(2).length; i++) {
                        if (tokens[i+2] == "e")
                            tokens[i+2] = ","
                        else if (tokens[i+2] == "pikulupu")
                            tokens[i+2] = "*"
                        else if (tokens[i+2] == "tankipisi")
                            tokens[i+2] = "/"
                    }
                    js.push(tokens[0] + " = safeAdd([" + tokens[0] + ", " + tokens.slice(2, ).join(" ")+"])")
                    lineNumbers.push([line_number, rawLine])
                } else if (tokens[1] == "likulupue") {
                    if (tokens[0].includes('"') || typeof(tokens[0]) == "number")
                        throw Error("pakala li lon toki nanpa "+Base10ToTokiPona(line_number)+"!\n"+line.join("  ")+"\nni li ken poki taso: "+line[0])
                    for (let i=0; i<tokens.slice(2).length; i++) {
                        if (tokens[i+2] == "e")
                            tokens[i+2] = ","
                        else if (tokens[i+2] == "pikulupu")
                            tokens[i+2] = "*"
                        else if (tokens[i+2] == "tankipisi")
                            tokens[i+2] = "/"
                    }
                    js.push(tokens[0] + " = [" + tokens.slice(2, ).join("  ") + "]")
                    lineNumbers.push([line_number, rawLine])
                } else if (tokens[1] == "likulupukine") {
                    if (tokens[0].includes('"') || typeof(tokens[0]) == "number")
                        throw Error("pakala li lon toki nanpa "+Base10ToTokiPona(line_number)+"!\n"+line.join("  ")+"\nni li ken poki taso: "+line[0])
                    for (let i=0; i<tokens.slice(2).length; i++) {
                        if (tokens[i+2] == "e")
                            tokens[i+2] = ","
                        else if (tokens[i+2] == "pikulupu")
                            tokens[i+2] = "*"
                        else if (tokens[i+2] == "tankipisi")
                            tokens[i+2] = "/"
                    }
                    js.push(tokens[0] + ".push(" + tokens.slice(2, ).join("  ") + ")")
                    lineNumbers.push([line_number, rawLine])
                } else {
                    js.push(tokens.join(""))
                    lineNumbers.push([line_number, rawLine])
                }
            } else {
                js.push(tokens.join(""))
                lineNumbers.push([line_number, rawLine])
            }
        }
    }

    return `
    lineNumbers$ = ${JSON.stringify(lineNumbers)}
    startLineNum = 7
    function main(){
    try{
        ${js.join('\n')}
        ${sikeExists?"\nsike$ = setInterval(function () {try {_sike()} catch (err) {errorDisplayer(err)}}, 100/30); __LOOP__$ = sike$;":""}
    } catch(err){
        errorDisplayer(err)
    }
    window.removeEventListener("error", (event) => {
        testError = event
    });
    }
    async function LoadStuff(){
        ctx$ = __CANVAS__$.getContext("2d")
        ctx$.font = "12px Sitelen_Pona"
        if(typeof(main)!="undefined"){
            main()
        }
    }
    ${WILE_PI_TOKI_ILO}
    LoadStuff()`
}

async function LoadStuff() { 
    const SitelenPona$ = new FontFace('Sitelen_Pona', 'url(../toki_ilo_pona/ilo-pi-toki-ilo/FairfaxPona.ttf)');
    await SitelenPona$.load()  
    document.fonts.add(SitelenPona$)
}
LoadStuff()