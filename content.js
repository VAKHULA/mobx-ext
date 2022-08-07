

var button = document.createElement("button");
button.innerHTML = 'click me';
button.style='position: fixed;top: 0;right: 0;z-index: -1;'
button.setAttribute("onClick", `
  (function(){
    const toString = Object.prototype.toString;function isString(val) {return typeof val === 'string';};function isNumber(val) {return typeof val === 'number';};function isBoolean(val) {return typeof val === 'boolean';};function isUndefined(val) {return typeof val === 'undefined';};function isArray(val) {return toString.call(val) === '[object Array]';};function isObject(val) {return toString.call(val) === '[object Object]';};function isNull(val) {return toString.call(val) === '[object Null]';};

    function JsonViewer(options) {
        const defaults = {
            theme: 'light',
            container: null,
            data: '{}',
            expand: false,
        };
        this.options = Object.assign(defaults, options);
        if (isNull(options.container)) {
            throw new Error('Container: dom element is required');
        }
        this.render();
    }

    JsonViewer.prototype.renderRight = function(theme, right, val) {
        if (isNumber(val)) {
            right.setAttribute('class', theme + 'rightNumber');
        } else if (isBoolean(val)) {
            right.setAttribute('class', theme + 'rightBoolean');
        } else if (val === 'null') {
            right.setAttribute('class', theme + 'rightNull');
        } else {
            right.setAttribute('class', theme + 'rightString');
        }
        right.innerText = val;
    }

    JsonViewer.prototype.renderChildren = function(theme, key, val, right, indent, left) {
        let self = this;
        let folder = this.createElement('span');
        let rotate90 = this.options.expand ? 'rotate90' : '';
        let addHeight = this.options.expand ? 'add-height' : '';
        folder.setAttribute('class', theme + 'folder ' + rotate90);
        folder.onclick = function (e) {
            let nextSibling = e.target.parentNode.nextSibling;
            self.toggleItem(nextSibling, e.target);
        }
        let len = 0;
        let isObj = false;
        if (isObject(val)) {
            len = Object.keys(val).length;
            isObj = true;
        } else {
            len = val.length;
        }
        left.innerHTML = isObj ? key + '&nbsp;&nbsp{' + len + '}' : key + '&nbsp;&nbsp[' + len + ']';
        left.prepend(folder);
        right.setAttribute('class', theme + 'rightObj ' + addHeight);
        self.parse(val, right, indent + 0, theme);
    }

    JsonViewer.prototype.parse = function(dataObj, parent, indent, theme) {
        const self = this;
        this.forEach(dataObj, function (val, key) {
            const { left, right } = self.createItem(indent, theme, parent, key, typeof val !== 'object');
            if (typeof val !== 'object') {
                self.renderRight(theme, right, val);
            } else {
                self.renderChildren(theme, key, val, right, indent, left);
            }
        });
    }

    JsonViewer.prototype.createItem = function(indent, theme, parent, key, basicType) {
        let self = this;
        let current = this.createElement('div');
        let left = this.createElement('div');
        let right = this.createElement('div');
        let wrap = this.createElement('div');

        current.style.marginLeft = indent * 2 + 'px';
        left.innerHTML = key + '<span class="jv-' + theme + '-symbol">&nbsp;:&nbsp;</span>';
        if (basicType) {
            current.appendChild(wrap);
            wrap.appendChild(left);
            wrap.appendChild(right);
            parent.appendChild(current);
            current.setAttribute('class', theme + 'current');
            wrap.setAttribute('class', 'jv-wrap');
            left.setAttribute('class', theme + 'left');
        } else {
            current.appendChild(left);
            current.appendChild(right);
            parent.appendChild(current);
            current.setAttribute('class', theme + 'current');
            left.setAttribute('class', theme + 'left jv-folder');
            left.onclick = function (e) {
                let nextSibling = e.target.nextSibling;
                self.toggleItem(nextSibling, e.target.querySelector('span'));
            }
        }
        return {
            left,
            right,
            current,
        };
    }

    JsonViewer.prototype.render = function () {
        let data = this.options.data;
        let theme = 'jv-' + this.options.theme + '-';
        let indent = 0;
        let parent = this.options.container;
        let key = 'object';
        let dataObj;

        parent.setAttribute('class', theme + 'con');
        try {
            dataObj = JSON.parse(data);
        } catch (error) {
            throw new Error('It is not a json format');
        }
        if (isArray(dataObj)) {
            key = 'array';
        }
        const { left, right } = this.createItem(indent, theme, parent, key);
        this.renderChildren(theme, key, dataObj, right, indent, left);
    }

    JsonViewer.prototype.toggleItem = function (ele, target) {
        ele.classList.toggle('add-height');
        target.classList.toggle('rotate90');
    }

    JsonViewer.prototype.createElement = function (type) {
        return document.createElement(type);
    }

    JsonViewer.prototype.forEach = function (obj, fn) {
        if (isUndefined(obj) || isNull(obj)) {
            return;
        }
        if (typeof obj === 'object' && isArray(obj)) {
            for (let i = 0, l = obj.length; i < l; i++) {
                fn.call(null, obj[i], i, obj);
            }
        } else {
            for (let key in obj) {
                if (obj.hasOwnProperty(key)) {
                    fn.call(null, obj[key] ?? 'null', key, obj);
                }
            }
        }
    }

    window.JsonViewer=JsonViewer

    var viewerCss = '.add-height{height:auto!important}.rotate90{transform:rotate(0)!important}.jv-wrap{display:flex}.jv-folder{cursor:pointer}.jv-light-symbol{color:#000;font-weight:700}.jv-light-con{background:#fff;color:#000;font-family:monospace;overflow:auto;height:100%;width:100%}.jv-dark-current,.jv-light-current{line-height:30px;padding-left:20px;position:relative}.jv-dark-folder,.jv-light-folder{margin-left:-15px;text-align:center;cursor:pointer;position:absolute;top:11px}.jv-dark-left,.jv-light-left{display:inline-block}.jv-light-rightString{display:inline-block;color:#7a3e9d}.jv-light-rightBoolean{display:inline-block;color:#448c27}.jv-light-rightNumber{display:inline-block;color:#f53232}.jv-light-rightNull{display:inline-block;color:#9c5d27}.jv-dark-rightObj,.jv-light-rightObj{display:block!important;overflow:hidden;height:0}.jv-light-folder{width:0;display:inline-block;height:0;border:4px solid transparent;border-top:8px solid #484d50;transform-origin:50% 25%;transform:rotate(-90deg)}.jv-dark-con{color:#fff;font-family:monospace;overflow:auto;height:100%;width:100%}.jv-dark-symbol{color:#fff;font-weight:700}.jv-dark-rightString{display:inline-block;color:#66d9ef}.jv-dark-rightBoolean{display:inline-block;color:#a6e22e}.jv-dark-rightNumber{display:inline-block;color:#f92672}.jv-dark-rightNull{display:inline-block;color:#e6db74}.jv-dark-folder{width:0;display:inline-block;height:0;border:4px solid transparent;border-top:8px solid #fff;transform:rotate(-90deg);transform-origin:50% 25%}';
    var dropdownCss = '.dropdown{position: relative;display: block;}.dropdown-content{border-top:1px solid red;display: none;position: absolute;background: rgba(39, 40, 34,0.9);min-width: 100%;max-height: 90vh;overflow: auto;box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);padding: 12px 16px;z-index: 999999999;}.dropdown input, .dropdown label {margin:0 10px;cursor: pointer;}#expander:checked+.dropdown-content {display: block;}';
    var head = document.head || document.getElementsByTagName('head')[0];
    var style = document.createElement('style');
    head.appendChild(style);
    style.type = 'text/css';

    if (style.styleSheet){
      style.styleSheet.cssText = viewerCss + dropdownCss;
    } else {
      style.appendChild(document.createTextNode(viewerCss + dropdownCss));
    }

    window.__STORE__ = {}
    window.__STORE__.stores = {}

    if (window.__mobxGlobals) {
      window.__mobxGlobals.spyListeners.push((e) => {
        if(e?.object?.storeName) {
          window.__STORE__.stores[e.object.storeName] = e.object
        }

      })
    }
  })()
`);
document.body.appendChild(button);
button.click()


var div = document.createElement("div");

div.style='position: fixed;top: 0;right: 0;z-index: 999999999; width: 500px; background: rgba(39, 40, 34,0.9); color: #fff;'
div.innerHTML = '<div class="dropdown"><label for="expander">collapse/expand</label><input type="checkbox" id="expander" name="vehicle1" value="collapse"><div class="dropdown-content"><p id="json-renderer">please click "refresh"</p></div></div>'

document.body.appendChild(div);

var button2 = document.createElement("button");
button2.setAttribute("id", "refresh")
button2.innerHTML = 'refresh';
button2.style='position: fixed;top: 3px;right: 3px;z-index: 9999999999;border: 1px solid #fff;border-radius: 16px;font-size: 10px;color: #fff;background: rgba(39, 40, 34,0.7);'

button2.setAttribute("onClick", `(function(){
  document.getElementById('json-renderer').innerHTML = ''
  new  window.JsonViewer({
    container: document.getElementById('json-renderer'),
    data: JSON.stringify(window.__STORE__.stores),
    theme: 'dark',
    expand: false,
  });
  document.querySelector('.jv-folder').click()
})()`)

document.body.appendChild(button2);

