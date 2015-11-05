/**
 * Created by Amar on 27-08-2015.
 */
function draw(obj){
    var type = typeof obj;
    if (this === window) {
        return new draw(obj);
    }
    if (type  === "string"){
        this.el = document.getElementById(obj);
    }
    else if(type === "object" && obj.nodeType !== "undefined" && obj.nodeType === 1) {
        this.el = obj;
    }
    else {
        throw new Error("Invalid Argument supplied with the draw.js constructor. \n Please choose either string or a DOM object");

    }
};
/** Event Instance Method **/
draw.prototype.addEvent = function (evt, fn) {
    draw.addEvent(this.el,evt,fn);
    return this;
}
draw.prototype.removeEvent = function (evt, fn) {
    draw.removeEvent(this.el,evt,fn);
    return this;
}
/** Event prototype Methods **/
mouse = ["click","mouseout"];           // Gives us the different mouse related triggered events
    draw.prototype.on = function (event,fn) {
        var that = this;
        if (typeof event ==="string"){
            if(event == mouse[0]){
                draw.addEvent(this.el,"click", function (e) {
                    fn.call(that, e);
                });
                return this;
            }
            else if(event == mouse[1]){
                draw.addEvent(this.el,"mouseout", function (e) {
                    fn.call(that, e);
                });
                return this;
            }
        }
        else {
            return this;
        }

    };


draw.prototype.css=function(e,t){return draw.css(this.el,e,t)||this}
/** Event Static Methods **/
// Event Listeners for the new browsers
    if(typeof addEventListener !== "undefined") {       // for Standards-based browser
        draw.addEvent = function (obj, evt, fn) {
            obj.addEventListener(evt,fn,false);
        };
        draw.removeEvent = function (obj, evt, fn) {
            obj.removeEventListener(evt, fn, false);
        };
    }
    else if (typeof attachEvent !== "undefined") {      // for IE 8 or less
        draw.addEvent = function (obj, evt, fn) {
            var fnHash = "event_" + evt + fn;
            obj[fnHash] = function () {
                var type = event.type;
                relatedTarget = null;
                if (type === "mouseover" || type === "mouseout"){
                    relatedTarget = (type === "mouseoever") ? event.fromElement: event.toElement;
                }
                fn.call(obj,{
                    target : event.srcElement,
                    type : type,
                    relatedTarget : relatedTarget,
                    _event : event,
                    preventDefault : function(){
                        this._event.returnValue = false;
                },
                stopPropogation : function() {
                    this._event.cancelBubble = true;
                    }
                });
            };
            draw.attachEvent("on" + evt, obj[fnHash]);
        };

        draw.removeEvent = function (obj,evt,fn) {
            var fnHash = "event_" + evt + fn;
            if (typeof obj[fnHash] !== "undefined"){
                obj.detachEvent("on"+evt,obj[fnHash]);
                delete obj[fnHash];
            }
        };
    }
    else {                                              // Our backup .i.e. DOM Level 0 function for event handling
        draw.addEvent = function (obj, evt, fn) {
            obj["on" + evt] = fn;
        };
        draw.removeEvent = function (obj, evt, fn) {
            obj["on" + evt] = null;
        };
    }

/** Style static methods **/
draw.css = function (el,css,value) {        // CSS parser; static
    var cssType = typeof css,
        valueType = typeof value,
        elStyle = el.style;
    if(cssType !== "undefined" && valueType === "undefined"){
        if(cssType === "object"){
            for(var prop in css){
                if (css.hasOwnProperty(prop)){
                    elStyle[toCamelCase(prop)] = css[prop];
                }
            }
        } else if(cssType === "string" ){
            return getStyle(el,css);
        } else {
            throw new Error("Invalid parameters passed to css()\n details: css = "+css+"["+cssType+"] value = "+value+"[" +valueType+"]");
        }
    } else if(cssType === "string" && valueType === "string") {

        elStyle[toCamelCase(css)] = value;
    } else {
        throw new Error("Invalid parameters passed to css()\n details: css = "+css+"["+cssType+"] value = "+value+"[" +valueType+"]");
    }
};

// Instance Method for writing and appending to inneHTML of elements in the DOM
draw.prototype.html = function (html) {
    if(html === "null" || !html) {
        if(this.el.innerHTML === "null"){
           return this.el;
        }
        return this.el.innerHTML;
    } else {
        this.el.innerHTML = html;
        return this;
    }
};

draw.prototype.html_append = function (html) {
    if(typeof html.nodeType !== "undefined" && html.nodeType == 1){
        this.el.appendChild(html);
    } else if( html instanceof draw){
        this.el.appendChild(html.el);
    } else if(typeof  html == "string"){
        this.el.innerHTML = this.el.innerHTML + html;
    }
    return this;
};

/** Useful Static Methods **/
draw.about = function () {
    var about =
        "Version: 0.1a\nAuthor: 'Amar Lakshya'\nCreated: 'Fall 2015'\nUpdated: '28 August 2015'";
    alert(about);
}

draw.prototype.clear = function () {
     this.el.innerHTML = "";
     this.el.innerText = "";
     return this;
}

draw.prototype.focus = function () {
    if(typeof this.el !== "undefined"){
        this.el.focus();
    }
};
/** Animation Effects **/
draw.prototype.fadeout = function (amt) {
    var va = draw.css(this.el,"opacity");
    if(amt === "null") {
        throw new Error("Value not initialized");
        return this;
    } else {
        if(typeof va === "undefined"){
            draw.css(this.el,"opacity","1.0");
        }
        va = parseFloat(va);
        draw.css(this.el,"opacity",String(va -= amt));
        return this;
    }
};

draw.prototype.fadein = function (amt) {
    var va = draw.css(this.el,"opacity");
    if(amt === "null") {
        throw new Error("Value not initialized");
        return this;
    } else {
        if(typeof va === "undefined"){
            draw.css(this.el,"opacity","0.0");
        }
        va = parseFloat(va);
        draw.css(this.el,"opacity",String(va += amt));
        return this;
    }
};

draw.prototype.rotate = function (amt) {
    if(amt == "null") {
        throw new Error("Value not initialized");
        return this;
    } else {
        if(typeof amt === "undefined"){
            draw.css(this.el,"position","relative");
            draw.css(this.el,"transform","rotateZ(0deg)");
        }
        draw.css(this.el,"position","relative");
        draw.css(this.el,"transform","rotateZ("+String(amt)+"deg)");
        return this;
    }
};

draw.prototype.box = function (x, y,color,float) {
    if(x && y && color) {
        draw.css(this.el,"height",String(y)+"px");
        draw.css(this.el,"width",String(x)+"px");
        draw.css(this.el,"float",String(float));
        draw.css(this.el,"backgroundColor",color);
        return this;
    } else {
        throw new Error("Value not initialized");
        return this;
}
};

draw.prototype.circle = function (x, rad, color) {
    if(x && color && rad) {
        draw.css(this.el,"height",String(x)+"px");
        draw.css(this.el,"width",String(x)+"px");
        draw.css(this.el,"borderRadius",String(rad)+"px");
        draw.css(this.el,"backgroundColor",color);
        return this;
    } else {
        throw new Error("Value not initialized");
        return this;
    }
};

draw.prototype.ellipse = function (x,y, rad, color) {
    if(x && y && color && rad) {
        draw.css(this.el,"height",String(y)+"px");
        draw.css(this.el,"width",String(x)+"px");
        draw.css(this.el,"borderRadius",String(rad)+"px");
        draw.css(this.el,"backgroundColor",color);
        return this;
    } else {
        throw new Error("Value not initialized");
        return this;
    }
};


draw.prototype.move = function (x, y) {
    if(x !== "null" && y!== "null" || x && y) {
        draw.css(this.el,"position","relative");
        draw.css(this.el,"transform","translate("+x+"px ,"+y+"px)");
        return this;
    } else {
        throw new Error("Value not initialized");
        return this;
    }
};

draw.prototype.grid = function (x,y,nox,noy,deg1,deg2){
    this.box(x,y,"white");
    var magicNox = x/nox, magicNoy = y/noy;
    if(typeof deg1 === "undefined" && typeof deg2 === "undefined"){
        deg1 = 0;
        deg2 = 90;;
        this.css({"backgroundImage":"repeating-linear-gradient("+deg1+"deg, black, black 1px, transparent 1px, transparent "+magicNox+"px),repeating-linear-gradient(180deg, black, black 1px, transparent 1px, transparent "+magicNox+"px),repeating-linear-gradient(90deg, black, black 1px, transparent 1px, transparent "+magicNoy+"px),repeating-linear-gradient("+deg2+"deg, black, black 1px, transparent 1px, transparent "+magicNoy+"px)"});
    }
    else {
    this.css({"backgroundImage":"repeating-linear-gradient("+deg1+"deg, black, black 1px, transparent 1px, transparent "+magicNox+"px),repeating-linear-gradient(180deg, black, black 1px, transparent 1px, transparent "+magicNox+"px),repeating-linear-gradient(90deg, black, black 1px, transparent 1px, transparent "+magicNoy+"px),repeating-linear-gradient("+deg2+"deg, black, black 1px, transparent 1px, transparent "+magicNoy+"px)"});
    }
 };


/** HELPER FUNCTION - Convertor function for camelCase for our dear IE  **/

function toCamelCase (str) {
    return str.replace(/-([a-z])/ig, function (all, letter) {
        return letter.toUpperCase();
    });
};

var getStyle = (function() {
    if(typeof getComputedStyle !== "undefined"){
        return function (el, cssProp) {
            return getComputedStyle(el, null).getPropertyValue(cssProp);
        };
    } else {
        return function (el,cssProp) {
            return el.currentStyle[toCamelCase(cssProp)];
        };
    }
}());

function isInt(value) {
    return !isNaN(value) && (function(x) { return (x | 0) === x; })(parseFloat(value))
}

draw.lag =function(fn,label) {
    var start = +new Date();  // log start timestamp
    console.time(label);
    fn;
    console.timeEnd(label);
    return true;
}

draw.create = function (obj) {
    if(!obj || !obj.tagName){
        throw new Error("Invalid arguement provided");
    }
    var el = document.createElement(obj.tagName);
    obj.id && (el.id = obj.id);
    obj.className && (el.className = obj.className);
    obj.html && (el.innerHTML = obj.html);

    if (obj.attributes !== "undefined"){
        var attr = obj.attributes,
            prop;
        for(prop in attr){
            if(attr.hasOwnProperty(prop)){
                el.setAttribute(prop,attr[prop]);
            }
        }
    }
    if (typeof obj.children!== "undefined" && obj.children instanceof Array){
        var child,
            i = 0;
        while(child = obj.children[i++]){
            el.appendChild(this.create(child));

        }
    }
    return el;
};
/** Languaage Extensions **/

if(typeof String.prototype.trim === "undefined"){
    String.prototype.trim = function () {
        return this.replace(/^\s+/,"").replace(/\s+$/,"");
    }
}