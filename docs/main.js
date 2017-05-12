/* Rainbow v2.1.3 rainbowco.de | included languages: css, generic, html, javascript */
!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):e.Rainbow=t()}(this,function(){"use strict";function e(){return"undefined"!=typeof module&&"object"==typeof module.exports}function t(){return"undefined"==typeof document&&"undefined"!=typeof self}function n(e){var t=e.getAttribute("data-language")||e.parentNode.getAttribute("data-language");if(!t){var n=/\blang(?:uage)?-(\w+)/,r=e.className.match(n)||e.parentNode.className.match(n);r&&(t=r[1])}return t?t.toLowerCase():null}function r(e,t,n,r){return(n!==e||r!==t)&&(n<=e&&r>=t)}function a(e){return e.replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/&(?![\w\#]+;)/g,"&amp;")}function o(e,t){for(var n=0,r=1;r<t;++r)e[r]&&(n+=e[r].length);return n}function i(e,t,n,r){return n>=e&&n<t||r>e&&r<t}function u(e){var t=[];for(var n in e)e.hasOwnProperty(n)&&t.push(n);return t.sort(function(e,t){return t-e})}function s(e,t,n,r){var a=r.substr(e);return r.substr(0,e)+a.replace(t,n)}function c(t,Prism){if(e())return global.Worker=require("webworker-threads").Worker,new Worker(__filename);var n=Prism.toString(),c=u.toString();c+=a.toString(),c+=r.toString(),c+=i.toString(),c+=s.toString(),c+=o.toString(),c+=n;var f=c+"\tthis.onmessage="+t.toString(),l=new Blob([f],{type:"text/javascript"});return new Worker((window.URL||window.webkitURL).createObjectURL(l))}function f(e){function t(){self.postMessage({id:n.id,lang:n.lang,result:a})}var n=e.data,r=new Prism(n.options),a=r.refract(n.code,n.lang);return n.isNode?(t(),void self.close()):void setTimeout(function(){t()},1e3*n.options.delay)}function l(){return(R||null===j)&&(j=c(f,Prism)),j}function d(e,t){function n(a){a.data.id===e.id&&(t(a.data),r.removeEventListener("message",n))}var r=l();r.addEventListener("message",n),r.postMessage(e)}function g(e,t,n){return function(r){e.innerHTML=r.result,e.classList.remove("loading"),"PRE"===e.parentNode.tagName&&e.parentNode.classList.remove("loading"),M&&M(e,r.lang),0===--t.c&&n()}}function m(e){return{patterns:C,inheritenceMap:S,aliases:T,globalClass:e.globalClass,delay:isNaN(e.delay)?0:e.delay}}function v(e,t){var n={};"object"==typeof t&&(n=t,t=n.language),t=T[t]||t;var r={id:A++,code:e,lang:t,options:m(n),isNode:R};return r}function p(e,t){for(var r={c:0},a=0,o=e;a<o.length;a+=1){var i=o[a],u=n(i);if(!i.classList.contains("rainbow")&&u){i.classList.add("loading"),i.classList.add("rainbow"),"PRE"===i.parentNode.tagName&&i.parentNode.classList.add("loading");var s=i.getAttribute("data-global-class"),c=parseInt(i.getAttribute("data-delay"),10);++r.c,d(v(i.innerHTML,{language:u,globalClass:s,delay:c}),g(i,r,t))}}0===r.c&&t()}function h(e){var t=document.createElement("div");t.className="preloader";for(var n=0;n<7;n++)t.appendChild(document.createElement("div"));e.appendChild(t)}function b(e,t){t=t||function(){},e=e&&"function"==typeof e.getElementsByTagName?e:document;for(var n=e.getElementsByTagName("pre"),r=e.getElementsByTagName("code"),a=[],o=[],i=0,u=n;i<u.length;i+=1){var s=u[i];h(s),s.getElementsByTagName("code").length?s.getAttribute("data-trimmed")||(s.setAttribute("data-trimmed",!0),s.innerHTML=s.innerHTML.trim()):a.push(s)}for(var c=0,f=r;c<f.length;c+=1){var l=f[c];o.push(l)}p(o.concat(a),t)}function y(e){M=e}function w(e,t,n){S[e]||(S[e]=n),C[e]=t.concat(C[e]||[])}function N(e){delete S[e],delete C[e]}function L(){for(var e=[],t=arguments.length;t--;)e[t]=arguments[t];if("string"==typeof e[0]){var n=v(e[0],e[1]);return void d(n,function(e){return function(t){e&&e(t.result,t.lang)}}(e[2]))}return"function"==typeof e[0]?void b(0,e[0]):void b(e[0],e[1])}function E(e,t){T[e]=t}var M,Prism=function Prism(e){function t(e,t){for(var n in h)if(n=parseInt(n,10),r(n,h[n],e,t)&&(delete h[n],delete p[n]),i(n,h[n],e,t))return!0;return!1}function n(t,n){var r=t.replace(/\./g," "),a=e.globalClass;return a&&(r+=" "+a),'<span class="'+r+'">'+n+"</span>"}function c(e){for(var t=u(p),n=0,r=t;n<r.length;n+=1){var a=r[n],o=p[a];e=s(a,o.replace,o["with"],e)}return e}function f(e){var t="";return e.ignoreCase&&(t+="i"),e.multiline&&(t+="m"),new RegExp(e.source,t)}function l(r,a,i){function c(e){return r.name&&(e=n(r.name,e)),p[y]={replace:m[0],"with":e},h[y]=w,!g&&{remaining:a.substr(w-i),offset:w}}function l(t){var a=m[t];if(a){var i=r.matches[t],u=i.language,c=i.name&&i.matches?i.matches:i,f=function(e,r,a){b=s(o(m,t),e,a?n(a,r):r,b)};if("string"==typeof i)return void f(a,a,i);var l,d=new Prism(e);if(u)return l=d.refract(a,u),void f(a,l);l=d.refract(a,v,c.length?c:[c]),f(a,l,i.matches?i.name:0)}}void 0===i&&(i=0);var d=r.pattern;if(!d)return!1;var g=!d.global;d=f(d);var m=d.exec(a);if(!m)return!1;!r.name&&r.matches&&"string"==typeof r.matches[0]&&(r.name=r.matches[0],delete r.matches[0]);var b=m[0],y=m.index+i,w=m[0].length+y;if(y===w)return!1;if(t(y,w))return{remaining:a.substr(w-i),offset:w};for(var N=u(r.matches),L=0,E=N;L<E.length;L+=1){var M=E[L];l(M)}return c(b)}function d(e,t){for(var n=0,r=t;n<r.length;n+=1)for(var a=r[n],o=l(a,e);o;)o=l(a,o.remaining,o.offset);return c(e)}function g(t){for(var n=e.patterns[t]||[];e.inheritenceMap[t];)t=e.inheritenceMap[t],n=n.concat(e.patterns[t]||[]);return n}function m(e,t,n){return v=t,n=n||g(t),d(a(e),n)}var v,p={},h={};this.refract=m},C={},S={},T={},x={},A=0,R=e(),k=t(),j=null;x={extend:w,remove:N,onHighlight:y,addAlias:E,color:L},R&&(x.colorSync=function(e,t){var n=v(e,t),r=new Prism(n.options);return r.refract(n.code,n.lang)}),R||k||document.addEventListener("DOMContentLoaded",function(e){x.defer||x.color(e)},!1),k&&(self.onmessage=f);var B=x;return B});
Rainbow.extend("css",[{name:"comment",pattern:/\/\*[\s\S]*?\*\//gm},{name:"constant.hex-color",pattern:/#([a-f0-9]{3}|[a-f0-9]{6})(?=;|\s|,|\))/gi},{matches:{1:"constant.numeric",2:"keyword.unit"},pattern:/(\d+)(px|em|cm|s|%)?/g},{name:"string",pattern:/('|")(.*?)\1/g},{name:"support.css-property",matches:{1:"support.vendor-prefix"},pattern:/(-o-|-moz-|-webkit-|-ms-)?[\w-]+(?=\s?:)(?!.*\{)/g},{matches:{1:[{name:"entity.name.sass",pattern:/&amp;/g},{name:"direct-descendant",pattern:/&gt;/g},{name:"entity.name.class",pattern:/\.[\w\-_]+/g},{name:"entity.name.id",pattern:/\#[\w\-_]+/g},{name:"entity.name.pseudo",pattern:/:[\w\-_]+/g},{name:"entity.name.tag",pattern:/\w+/g}]},pattern:/([\w\ ,\n:\.\#\&\;\-_]+)(?=.*\{)/g},{matches:{2:"support.vendor-prefix",3:"support.css-value"},pattern:/(:|,)\s*(-o-|-moz-|-webkit-|-ms-)?([a-zA-Z-]*)(?=\b)(?!.*\{)/g}]),Rainbow.addAlias("scss","css"),Rainbow.extend("generic",[{matches:{1:[{name:"keyword.operator",pattern:/\=|\+/g},{name:"keyword.dot",pattern:/\./g}],2:{name:"string",matches:{name:"constant.character.escape",pattern:/\\('|"){1}/g}}},pattern:/(\(|\s|\[|\=|:|\+|\.|\{|,)(('|")([^\\\1]|\\.)*?(\3))/gm},{name:"comment",pattern:/\/\*[\s\S]*?\*\/|(\/\/|\#)(?!.*('|").*?[^:](\/\/|\#)).*?$/gm},{name:"constant.numeric",pattern:/\b(\d+(\.\d+)?(e(\+|\-)?\d+)?(f|d)?|0x[\da-f]+)\b/gi},{matches:{1:"keyword"},pattern:/\b(and|array|as|b(ool(ean)?|reak)|c(ase|atch|har|lass|on(st|tinue))|d(ef|elete|o(uble)?)|e(cho|lse(if)?|xit|xtends|xcept)|f(inally|loat|or(each)?|unction)|global|if|import|int(eger)?|long|new|object|or|pr(int|ivate|otected)|public|return|self|st(ring|ruct|atic)|switch|th(en|is|row)|try|(un)?signed|var|void|while)(?=\b)/gi},{name:"constant.language",pattern:/true|false|null/g},{name:"keyword.operator",pattern:/\+|\!|\-|&(gt|lt|amp);|\||\*|\=/g},{matches:{1:"function.call"},pattern:/(\w+?)(?=\()/g},{matches:{1:"storage.function",2:"entity.name.function"},pattern:/(function)\s(.*?)(?=\()/g}]),Rainbow.extend("html",[{name:"source.php.embedded",matches:{1:"variable.language.php-tag",2:{language:"php"},3:"variable.language.php-tag"},pattern:/(&lt;\?php|&lt;\?=?(?!xml))([\s\S]*?)(\?&gt;)/gm},{name:"source.css.embedded",matches:{1:{matches:{1:"support.tag.style",2:[{name:"entity.tag.style",pattern:/^style/g},{name:"string",pattern:/('|")(.*?)(\1)/g},{name:"entity.tag.style.attribute",pattern:/(\w+)/g}],3:"support.tag.style"},pattern:/(&lt;\/?)(style.*?)(&gt;)/g},2:{language:"css"},3:"support.tag.style",4:"entity.tag.style",5:"support.tag.style"},pattern:/(&lt;style.*?&gt;)([\s\S]*?)(&lt;\/)(style)(&gt;)/gm},{name:"source.js.embedded",matches:{1:{matches:{1:"support.tag.script",2:[{name:"entity.tag.script",pattern:/^script/g},{name:"string",pattern:/('|")(.*?)(\1)/g},{name:"entity.tag.script.attribute",pattern:/(\w+)/g}],3:"support.tag.script"},pattern:/(&lt;\/?)(script.*?)(&gt;)/g},2:{language:"javascript"},3:"support.tag.script",4:"entity.tag.script",5:"support.tag.script"},pattern:/(&lt;script(?! src).*?&gt;)([\s\S]*?)(&lt;\/)(script)(&gt;)/gm},{name:"comment.html",pattern:/&lt;\!--[\S\s]*?--&gt;/g},{matches:{1:"support.tag.open",2:"support.tag.close"},pattern:/(&lt;)|(\/?\??&gt;)/g},{name:"support.tag",matches:{1:"support.tag",2:"support.tag.special",3:"support.tag-name"},pattern:/(&lt;\??)(\/|\!?)(\w+)/g},{matches:{1:"support.attribute"},pattern:/([a-z-]+)(?=\=)/gi},{matches:{1:"support.operator",2:"string.quote",3:"string.value",4:"string.quote"},pattern:/(=)('|")(.*?)(\2)/g},{matches:{1:"support.operator",2:"support.value"},pattern:/(=)([a-zA-Z\-0-9]*)\b/g},{matches:{1:"support.attribute"},pattern:/\s([\w-]+)(?=\s|&gt;)(?![\s\S]*&lt;)/g}]),Rainbow.addAlias("xml","html"),Rainbow.extend("javascript",[{name:"selector",pattern:/\$(?=\.|\()/g},{name:"support",pattern:/\b(window|document)\b/g},{name:"keyword",pattern:/\b(export|default|from)\b/g},{name:"function.call",pattern:/\b(then)(?=\()/g},{name:"variable.language.this",pattern:/\bthis\b/g},{name:"variable.language.super",pattern:/super(?=\.|\()/g},{name:"storage.type",pattern:/\b(const|let|var)(?=\s)/g},{matches:{1:"support.property"},pattern:/\.(length|node(Name|Value))\b/g},{matches:{1:"support.function"},pattern:/(setTimeout|setInterval)(?=\()/g},{matches:{1:"support.method"},pattern:/\.(getAttribute|replace|push|getElementById|getElementsByClassName|setTimeout|setInterval)(?=\()/g},{name:"string.regexp",matches:{1:"string.regexp.open",2:{name:"constant.regexp.escape",pattern:/\\(.){1}/g},3:"string.regexp.close",4:"string.regexp.modifier"},pattern:/(\/)((?![*+?])(?:[^\r\n\[\/\\]|\\.|\[(?:[^\r\n\]\\]|\\.)*\])+)(\/)(?!\/)([igm]{0,3})/g},{matches:{1:"storage.type",3:"entity.function"},pattern:/(var)?(\s|^)(\S+)(?=\s?=\s?function\()/g},{matches:{1:"keyword",2:"variable.type"},pattern:/(new)\s+(?!Promise)([^\(]*)(?=\()/g},{name:"entity.function",pattern:/(\w+)(?=:\s{0,}function)/g},{name:"constant.other",pattern:/\*(?= as)/g},{matches:{1:"keyword",2:"constant.other"},pattern:/(export)\s+(\*)/g},{matches:{1:"storage.type.accessor",2:"entity.name.function"},pattern:/(get|set)\s+(\w+)(?=\()/g},{matches:{2:"entity.name.function"},pattern:/(^\s*)(\w+)(?=\([^\)]*?\)\s*\{)/gm},{matches:{1:"storage.type.class",2:"entity.name.class",3:"storage.modifier.extends",4:"entity.other.inherited-class"},pattern:/(class)\s+(\w+)(?:\s+(extends)\s+(\w+))?(?=\s*\{)/g},{name:"storage.type.function.arrow",pattern:/=&gt;/g},{name:"support.class.promise",pattern:/\bPromise(?=(\(|\.))/g}],"generic"),Rainbow.addAlias("js","javascript");

(function() {

    'use strict';

    var toasty = Toasty.config({

        classname: 'toast', // STRING: main class name used to styling each toast message with CSS.

        animation: true, // STRING|BOOLEAN: Defines whether toasts will be displayed or hidden with animation:
                              // .... String: Name of the CSS animation that will be used to shown or hide the toast.
                              // .... If it set to BOOLEAN TRUE  - the toast will be shown or hide with CSS default animation.
                              // .... If it set to BOOLEAN FALSE - the toast will be shown or hide without CSS animation.

        duration: 0, // INTEGER: Duration that the toast will be displayed in milliseconds:
                        // .... Default value is set to 4000 (4 seconds). 
                        // .... If it set to 0, the duration for each toast is calculated by message length.

        enableSounds: true, // BOOLEAN: enable or disable toast sounds:
                             // .... Set to BOOLEAN TRUE  - to enable toast sounds.
                             // .... Set to BOOLEAN FALSE - otherwise.

        autoClose: true, // BOOLEAN: enable or disable auto hiding on toast messages:
                         // .... Set to BOOLEAN TRUE  - to enable auto hiding.
                         // .... Set to BOOLEAN FALSE - disable auto hiding. Instead the user must click on toast message to close it.

        progressBar: true, // BOOLEAN: enable or disable the progressbar:
                            // .... Set to BOOLEAN TRUE  - enable the progressbar only if the autoClose option value is set to BOOLEAN TRUE.
                            // .... Set to BOOLEAN FALSE - disable the progressbar. 

        // Yep, support custom sounds for each toast message when are shown
        // if the enableSounds option value is set to BOOLEAN TRUE:
        // NOTE: The paths must point from the project's root folder.
        sounds: {
            info: '//cdn.rawgit.com/egalink/Toasty.js/master/src/sounds/success,\ warning/1.mp3', // path to sound for informational message.
            success: '//cdn.rawgit.com/egalink/Toasty.js/master/src/sounds/success,\ warning/2.mp3', // path to sound for successfull message.
            warning: '//cdn.rawgit.com/egalink/Toasty.js/master/src/sounds/success,\ warning/3.mp3', // path to sound for warn message.
            error: '//cdn.rawgit.com/egalink/Toasty.js/master/src/sounds/errors/1.mp3' // path to sound for error message.
        }

    });
    

    // configure the toasts:
    var successBtn = document.querySelector('#success');
    var infoBtn = document.querySelector('#info');
    var warningBtn = document.querySelector('#warning');
    var errorBtn = document.querySelector('#error');

    infoBtn.addEventListener('click', function(e)
    {
        toasty.info('Here is some information!');
    });

    successBtn.addEventListener('click', function(e)
    {
        toasty.success('You did something good!');
    });

    warningBtn.addEventListener('click', function(e)
    {
        toasty.warning('Warning! Do not proceed any further!');
    });

    errorBtn.addEventListener('click', function(e)
    {
        toasty.error('Something terrible happened!');
    });

})();
