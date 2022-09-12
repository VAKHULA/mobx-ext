

var button = document.createElement("button");
button.innerHTML = 'click me';
button.style='position: fixed;top: 0;right: 0;z-index: -1;'

button.setAttribute("onClick", `
  (function(){
    const toString=Object.prototype.toString;function isString(a){return"string"==typeof a}function isNumber(a){return"number"==typeof a}function isBoolean(a){return"boolean"==typeof a}function isUndefined(a){return void 0===a}function isArray(a){return"[object Array]"===toString.call(a)}function isObject(a){return"[object Object]"===toString.call(a)}function isNull(a){return"[object Null]"===toString.call(a)}function JsonViewer(a){if(this.options=Object.assign({theme:"light",container:null,data:"{}",expand:!1},a),isNull(a.container))throw new Error("Container: dom element is required");this.render()}JsonViewer.prototype.renderRight=function(b,a,c){isNumber(c)?a.setAttribute("class",b+"rightNumber"):isBoolean(c)?a.setAttribute("class",b+"rightBoolean"):"null"===c?a.setAttribute("class",b+"rightNull"):a.setAttribute("class",b+"rightString"),a.innerText=c},JsonViewer.prototype.renderChildren=function(c,e,a,f,i,g){let j=this,d=this.createElement("span"),k=this.options.expand?"rotate90":"",l=this.options.expand?"add-height":"";d.setAttribute("class",c+"folder "+k),d.onclick=function(a){let b=a.target.parentNode.nextSibling;j.toggleItem(b,a.target)};let b=0,h=!1;isObject(a)?(b=Object.keys(a).length,h=!0):b=a.length,g.innerHTML=h?e+"&nbsp;&nbsp{"+b+"}":e+"&nbsp;&nbsp["+b+"]",g.prepend(d),f.setAttribute("class",c+"rightObj "+l),j.parse(a,f,i+0,c)},JsonViewer.prototype.parse=function(a,b,c,d){let e=this;this.forEach(a,function(a,f){let{left:h,right:g}=e.createItem(c,d,b,f,"object"!=typeof a);"object"!=typeof a?e.renderRight(d,g,a):e.renderChildren(d,f,a,g,c,h)})},JsonViewer.prototype.createItem=function(g,c,f,h,i){let j=this,a=this.createElement("div"),b=this.createElement("div"),e=this.createElement("div"),d=this.createElement("div");return a.style.marginLeft=2*g+"px",b.innerHTML=h+'<span class="jv-'+c+'-symbol">&nbsp;:&nbsp;</span>',i?(a.appendChild(d),d.appendChild(b),d.appendChild(e),f.appendChild(a),a.setAttribute("class",c+"current"),d.setAttribute("class","jv-wrap"),b.setAttribute("class",c+"left")):(a.appendChild(b),a.appendChild(e),f.appendChild(a),a.setAttribute("class",c+"current"),b.setAttribute("class",c+"left jv-folder"),b.onclick=function(a){let b=a.target.nextSibling;j.toggleItem(b,a.target.querySelector("span"))}),{left:b,right:e,current:a}},JsonViewer.prototype.render=function(){let e=this.options.data,a="jv-"+this.options.theme+"-",d=this.options.container,b="object",c;d.setAttribute("class",a+"con");try{c=JSON.parse(e)}catch(h){throw new Error("It is not a json format")}isArray(c)&&(b="array");let{left:f,right:g}=this.createItem(0,a,d,b);this.renderChildren(a,b,c,g,0,f)},JsonViewer.prototype.toggleItem=function(a,b){a.classList.toggle("add-height"),b.classList.toggle("rotate90")},JsonViewer.prototype.createElement=function(a){return document.createElement(a)},JsonViewer.prototype.forEach=function(a,d){if(!(isUndefined(a)||isNull(a))){if("object"==typeof a&&isArray(a))for(let b=0,e=a.length;b<e;b++)d.call(null,a[b],b,a);else for(let c in a)a.hasOwnProperty(c)&&d.call(null,a[c]??"null",c,a)}}
    window.JsonViewer=JsonViewer

    var JsonViewerCss = '.add-height{height:auto!important}.rotate90{transform:rotate(0)!important}.jv-wrap{display:flex}.jv-folder{cursor:pointer}.jv-light-symbol{color:#000;font-weight:700}.jv-light-con{background:#fff;color:#000;font-family:monospace;overflow:auto;height:100%;width:100%}.jv-dark-current,.jv-light-current{line-height:30px;padding-left:20px;position:relative}.jv-dark-folder,.jv-light-folder{margin-left:-15px;text-align:center;cursor:pointer;position:absolute;top:11px}.jv-dark-left,.jv-light-left{display:inline-block}.jv-light-rightString{display:inline-block;color:#7a3e9d}.jv-light-rightBoolean{display:inline-block;color:#448c27}.jv-light-rightNumber{display:inline-block;color:#f53232}.jv-light-rightNull{display:inline-block;color:#9c5d27}.jv-dark-rightObj,.jv-light-rightObj{display:block!important;overflow:hidden;height:0}.jv-light-folder{width:0;display:inline-block;height:0;border:4px solid transparent;border-top:8px solid #484d50;transform-origin:50% 25%;transform:rotate(-90deg)}.jv-dark-con{color:#fff;font-family:monospace;overflow:auto;height:100%;width:100%}.jv-dark-symbol{color:#fff;font-weight:700}.jv-dark-rightString{display:inline-block;color:#66d9ef}.jv-dark-rightBoolean{display:inline-block;color:#a6e22e}.jv-dark-rightNumber{display:inline-block;color:#f92672}.jv-dark-rightNull{display:inline-block;color:#e6db74}.jv-dark-folder{width:0;display:inline-block;height:0;border:4px solid transparent;border-top:8px solid #fff;transform:rotate(-90deg);transform-origin:50% 25%}';
    var dropdownCss = '.dropdown{position: relative;display: block;}.dropdown-content{border-top:1px solid red;display: none;position: absolute;background: rgba(39, 40, 34,0.9);min-width: 100%;max-height: 90vh;overflow: auto;box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);padding: 12px 16px;z-index: 999999999;}.dropdown input, .dropdown label {margin:0 10px;cursor: pointer;}#expander:checked+.dropdown-content {display: block;}';
    var addCss = '#json-renderer > .jv-dark-current > .add-height > .jv-dark-current > .jv-folder {color: #ffb000;}'

    var head = document.head || document.getElementsByTagName('head')[0];
    var style = document.createElement('style');
    head.appendChild(style);
    style.type = 'text/css';

    if (style.styleSheet){
      style.styleSheet.cssText = JsonViewerCss + dropdownCss + addCss;
    } else {
      style.appendChild(document.createTextNode(JsonViewerCss + dropdownCss + addCss));
    }

    window.__STORE__ = {}
    window.__STORE__.stores = {}

    if (window.__mobxGlobals) {

      window.__mobxGlobals.spyListeners.push((a) => {
        if(a?.object?.storeName) {

          window.__STORE__.stores[a.object.storeName] = a.object
        }
      })
    }
  })()
`);

document.body.appendChild(button);
button.click()

var dropdown = document.createElement("div");
dropdown.style='position: fixed;top: 0;right: 0;z-index: 999999999; width: 500px; background: rgba(39, 40, 34,0.9); color: #fff;'
dropdown.innerHTML = '<div class="dropdown"><label for="expander">collapse/expand</label><input type="checkbox" id="expander" name="vehicle1" value="collapse"><div class="dropdown-content"><p id="json-renderer">please click "refresh"</p></div></div>'
document.body.appendChild(dropdown);

var refreshButton = document.createElement("button");
refreshButton.setAttribute("id", "refresh")
refreshButton.innerHTML = 'refresh';
refreshButton.style='position: fixed;top: 3px;right: 3px;z-index: 9999999999;border: 1px solid #fff;border-radius: 16px;font-size: 10px;color: #fff;background: rgba(39, 40, 34,0.7);'

refreshButton.setAttribute("onClick", `(function(){
  document.getElementById('json-renderer').innerHTML = ''
  new  window.JsonViewer({
    container: document.getElementById('json-renderer'),
    data: JSON.stringify(window.__STORE__.stores),
    theme: 'dark',
    expand: false,
  });
  document.querySelector('.jv-folder').click()
})()`)

document.body.appendChild(refreshButton);

