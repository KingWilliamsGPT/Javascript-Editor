"using strict";

// this is the logic for the editor app

//first I need a way to represent each log
//elem.replacewith

const ERROR_IMG = "images/error.gif";
const WARNING_IMG = "images/warning.gif";
ERROR_SIZE = WARNING_SIZE = "width:20px; heigth:20px";


function setAttribs(elem, attribs = []) {
    //attribs = [[a, b], [d, e]] --> 2d array
    for (var i = 0; i < attribs.length; i++) {
        var [attrib, value] = attribs[i];
        elem.setAttribute(attrib, value);
    }
}
realConsole = {
	log: console.log,
	error: console.error,
	warn: console.warn,
}
function resetConsole() {
    // override console methods
    var makeString = function(array){
    	var str = "";
    	for(var i = 0; i < array.length; i++){
    		str += array[i] + " ";
    	}
    	return str;
    }
    console.log = function(...args) {
        // take what user want's to log make a tag and put
        // it in there.
        if(!args.length){
        	return;
        }
        var logString = makeString(args);
        logTag = loggers.log(logString); // get a log tag that will take text
        document.querySelector(".ide").appendChild(logTag);
    }
    console.error = function(...args){
    	if(!args.length){
        	return;
        }
    	errText = makeString(args);
    	errTag = loggers.error(errText);
    	document.querySelector(".ide").appendChild(errTag);
    }
    console.warn = function(...args){
    	if(!args.length){
        	return;
        }
        warnText = makeString(args);
        warnTag = loggers.warning(warnText);
        document.querySelector(".ide").appendChild(warnTag);
    }

}
function exeCode(code){
	// this runs the code
	resetConsole();
	try{
		jsreturn = eval(code);
		return jsreturn;
	}catch (err){
		// console.error(err)
		console.error(err);
		return null;
	}
}
function runCode(event, inputElem) {
    // TODO
    // take keyboard event filter "enter key"
    // deactivate input field -> check
    
    if (event.key.toLowerCase() === "enter") {
        //run code
        var
            code = inputElem.value,
            newElem,
            ide = document.querySelector(".ide");
        if(code === ""){
        	return;
        }
        (function editInput() {
            // replace the active input to an inactive one with content
            newElem = loggers.codeInput(false, code); //see here no need for putting classname and stuff
            inputElem.parentElement.replaceWith(newElem);
        }());
        // need js return tag
        result = exeCode(code);
        if(result !== null){ //get js return if code exec is successfull
			jsReturn = loggers.jsReturn(result);
        	ide.appendChild(jsReturn);
        }
        
        ide.appendChild(loggers.codeInput());
        // and to execute code
    }else{
    	realConsole.log(event);
    }
}

loggers = {
    // this returns log tags when needed

    log: function(logString) {
        //return a basic log replaces `console.log`
        /*
        <div class="push-logger log ">some code result</div>
        */
        var elem;
        elem = document.createElement("div");
        elem.className = "log push-logger";
        elem.innerHTML = logString;
        return elem;
    },

    codeInput: function(active = true, content) {
        // allow user to enter code
        /*
        	<div class="entry log">
        		<span class="entry-active-countsign">&gt;</span>
        		<input class="entry-input" autofocus placeholder="Enter code here">
        	</div>
        */
        // the content is needed only when active
        var
            elem,
            coutSign,
            input;
        elem = document.createElement("div");
        elem.className = "entry log";

        coutSign = this.entryCoutSign(active);

        if (active) {
            input = document.createElement("input");
            setAttribs(input, [
                ["autofocus", true],
                ["placeholder", "Enter code here"]
            ])
            input.addEventListener("keypress", function(ev) { runCode(ev, input) }); //err runCode not defined
        } else {
            input = document.createElement("div");
            input.innerHTML = content;
        }
        input.className = "entry-input";
        elem.append(coutSign, input);
        return elem;
    },
    entryCoutSign: function(status) {
        //this elem could be of class active or inactive
        //<span class="entry-active-countsign">&gt;</span>
        var elem;
        elem = document.createElement("span");
        elem.className = `entry-${status===true?"active":"inactive"}-count-sign`;
        // console.log(elem.className);
        elem.innerHTML = "&gt;";
        return elem;
    },
    jsReturn: function(logStr) {
        //js always returns this div is to log that return
        /*
        	<div class="js-log log">
        		<span class="js-cout-sign">&lt;&middot;</span>
        		<div class="js-log-content"></div>
        	</div>
        */
        var
	        elem = document.createElement("div"),
	        cSign = document.createElement("span"),
	        content = document.createElement("div");
	    elem.className = "js-log log"
	    cSign.className = "js-cout-sign";
	    cSign.innerHTML = "&lt;&middot;";
	    content.className = "js-log-content";
	    content.innerHTML = logStr;
	    elem.append(cSign, content);
	    return elem;
    },
    debugLog : function(which, debugContent){
    	//logs error and warning since there are both similar
    	var 
        	elem = document.createElement('div'),
        	imgContainer =  document.createElement("span"),
        	img = document.createElement('img'),
        	content = document.createElement("div");
        [elem.className, imgContainer.className, content.className, img.src, img.alt, img.style] = (which === "error")?(
        	[
	        	"error log",
	        	"err-img",
	        	"err-text",
	        	ERROR_IMG,
	        	"error",
	        	ERROR_SIZE
	        ]):(
	        [
	        	/*which === warn*/
	        	"warning log",
	        	"warn-img",
	        	'warn-text',
	        	WARNING_IMG,
	        	'warning',
	        	WARNING_SIZE
	        ]);
	    content.innerHTML = debugContent;
	    imgContainer.appendChild(img);
	    elem.append(imgContainer, content);
	    return elem;
    },
    error: function(errorText) {
        // log error
        /*
        	<div class="error log">
        		<span class="err-img"><img src="" alt="error" style="width:20px; height:20px"/></span>
        		<div class="err-text">
        			some error message
        		</div>
        	</div>
        */
        // var 
        // 	elem = document.createElement('div'),
        // 	imgcontainer =  document.createElement("span"),
        // 	img = document.createElement('img'),
        // 	content = document.createElement("div");
        // elem.className = "error log";
        // imgcontainer.className = "err-img";
        // setAttribs(img, [
        // 	["src", ERROR_IMG],
        // 	['alt', "error"],
        // 	["style", ERROR_SIZE]
        // 	]);
        // content.className = "err-text";
        // content.innerHTML = errorText;
        // imgcontainer.appendChild(img);
        // elem.append(imgcontainer, content);
        // return elem;
        return this.debugLog("error", errorText);
    },
    warning: function(warnText) {
        // log warning
        /*
        	<div class="warning log">
        		<span class="warn-img"><img src="" alt="warn" style="width:20px; height:20px"/></span>
        		<div class="warn-text"></div>
        	</div>
        */
        // var 
        // 	elem = document.createElement("div"),
        // 	imgcontainer = document.createElement("span"),
        // 	img = document.createElement("img"),
        // 	content = document.createElement("div");
        // elem.className = "warning log";
        // imgcontainer.className = "warn-img";
        // setAttribs(img, [
        // 	["src", WARNING_IMG],
        // 	['alt', "error"],
        // 	["style", WARNING_SIZE]
        // 	]);
        // content.className = "warn-text";
        // content.innerHTML = warnText;
        // imgcontainer.appendChild(img);
        // elem.append(imgcontainer, content);
        // return elem;
        return this.debugLog("warn", warnText);
    }

}

// class Toggle {
//     constructor($_0, $_1, $_2 = 1000) {
//         this.$_2 = $_2; // interval
//         this.$_3 = undefined; // timer obj
//         this.isOn = false // is Enabled ?
//         try {
//             if (typeof $_0 === "string") {
//                 let $_f = null;
//                 this.$_0 = $_0; // target
//                 $_f = document.getElementById(this.$_0);
//                 $_f.addEventListener("click", () => {
//                     this.isOn = !this.isOn;
//                     console.log(this.isOn.toString());
//                 });
//             } else {
//                 throw 1;
//             }
//             if ($_1 instanceof Function) {
//                 this.$_1 = $_1; // callback
//             } else {
//                 throw 2;
//             }
//         } catch (e) {
//             if (e == 1) {
//                 console.log("Error: TypeError Changelog(param1, param2) param1 is not of type String.");
//             }
//             if (e == 2) {
//                 console.log("Error: TypeError Changelog(param1, param2) param2 is not of type Function.");
//             }
//         }
//     }
// }