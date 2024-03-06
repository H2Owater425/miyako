"use strict";const e=require("util"),t=require("http"),s=require("url"),r=Symbol("all"),o=Symbol("parameter"),n=Symbol("name"),i=Symbol("route"),a=new Map([[400,"Bad Request"],[401,"Unauthorized"],[403,"Forbidden"],[404,"Not Found"],[405,"Method Not Allowed"],[409,"Conflict"],[415,"Unsupported Media Type"],[418,"I'm a teapot"],[429,"Too Many Requests"],[500,"Internal Server Error"],[501,"Not Implemented"]]);class u extends Error{constructor(e,t){super(e+" must "+t)}}class c extends Error{statusCode;constructor(e,t){super(t),this.statusCode=e,this.name=a.get(e)}}class d extends c{constructor(e){super(400,e)}}class h extends c{constructor(e){super(404,e)}}class f extends c{constructor(e){super(405,e)}}class l extends c{constructor(e){super(415,e)}}class m{static instance=new m;static#e(t,s){let r,o=32;switch(t){case"ERROR":case"FATAL":r=process.stderr.write.bind(process.stderr),o--;break;case"WARN":o++;default:r=process.stdout.write.bind(process.stdout)}for(let t=0;t<s.length;t++)"object"==typeof s[t]&&(s[t]=e.inspect(s[t],!1,null,!0));r("[[36m"+(new Date).toTimeString().slice(0,8)+"[37m][["+o+"m"+t+"[37m]"+" ".repeat(6-t.length)+s.join(" ")+"\n")}fatal(...e){m.#e("FATAL",e)}error(...e){m.#e("ERROR",e)}warn(...e){m.#e("WARN",e)}info(...e){m.#e("INFO",e)}debug(...e){m.#e("DEBUG",e)}trace(...e){m.#e("TRACE",e)}}class p{#t=new Map;#s=new Map;setRoute(e,t){if("/"===e[0]){let s=this.#s,a=!0;if(1!==e.length){if("/"===e[e.length-1])throw new Error("Path must not ends with /");{let t,i,u=1,c=(e+="/").indexOf("/",1);for(;-1!==c;){if(t=e.slice(u,c),i=s.get(t),"object"!=typeof i)if(":"===t[0]){if(i=s.get(o),"object"!=typeof i)i=new Map([[n,t]]),s.set(o,i),a&&(a=!1);else if(i.get(n)!==t)throw new Error("Parameter name must match")}else if("*"===t){if(e.length!==c+1)throw new Error("All must be end of the path");i=s.get(r),"object"!=typeof i&&(i=new Map,s.set(r,i),a&&(a=!1))}else i=new Map,s.set(t,i);s=i,u=c+1,c=e.indexOf("/",u)}}}if(s.has(i))throw new Error("Path must be unique");return s.set(i,t),void(a&&this.#t.set(e,t))}throw new Error("Path must starts with /")}getRoute(e,t={}){if("/"===e[0]){const s=this.#t.get(e);if("object"!=typeof s){let s=this.#s;if(1!==e.length){if("/"===e[e.length-1])return;{let a,u,c,d=1,h=(e+="/").indexOf("/",1);for(;-1!==h;)if(a=e.slice(d,h),u=s.get(a),"object"!=typeof c&&(c=s.get(r),void 0===c||s.has(i)||(c=void 0)),"object"!=typeof u)if(u=s.get(o),"object"!=typeof u){if(u=s.get(r),"object"!=typeof u){if(void 0!==c){s=c;break}return}c=u}else t[u.get(n)]=a}}const a=s.get(i);return void 0!==a?[a,t]:void 0}return[s,t]}throw new Error("Path must starts with /")}}function w(e,t,s="",r=!1){switch(e.type){case 0:if((r=!0===r&&void 0!==t)&&(t=Number(t)),"number"==typeof t){if(Number.isNaN(t))throw new u(s,"be number");if(Array.isArray(e.enum)){if(!e.enum.includes(t))throw new u(s,"be one of "+JSON.stringify(e.enum))}else{if(!0===e.isInteger&&!Number.isInteger(t))throw new u(s,"be integer");if("number"==typeof e.maximum&&t>e.maximum)throw new u(s,"be smaller than "+e.maximum);if("number"==typeof e.minimum&&t<e.minimum)throw new u(s,"be bigger than "+e.minimum)}return r?t:void 0}if(void 0===t){if(!0===e.isOptional)return e.default;throw new u(s,"exist")}throw new u(s,"be number");case 1:if((r=!0===r&&void 0!==t)&&(t=String(t)),"string"==typeof t){if(Array.isArray(e.enum)){if(!e.enum.includes(t))throw new u(s,"be one of "+JSON.stringify(e.enum))}else if(void 0===e.pattern){if("number"==typeof e.maximum&&t.length>e.maximum)throw new u(s,"be shorter than "+e.maximum);if("number"==typeof e.minimum&&t.length<e.minimum)throw new u(s,"be longer than "+e.minimum)}else if(!e.pattern.test(t))throw new u(s,"match "+e.pattern);return r?t:void 0}if(void 0===t){if(!0===e.isOptional)return e.default;throw new u(s,"exist")}throw new u(s,"be string");case 2:if(!0===r)switch(t){case"true":case"1":return!0;case"false":case"0":return!1;case"":t=void 0}if("boolean"==typeof t)return;if(void 0===t){if(!0===e.isOptional)return e.default;throw new u(s,"exist")}throw new u(s,"be boolean");case 3:if(!0===r&&"null"===t)return null;if(null===t)return;if(void 0===t){if(!0===e.isOptional)return e.default;throw new u(s,"exist")}throw new u(s,"be null");case 4:if("object"==typeof t&&null!==t){for(const o in e.properties){const n=w(e.properties[o],t[o],s+'["'+o.replace(/"/g,'\\"')+'"]',r);void 0!==n&&(t[o]=n)}if(!0!==e.allowAdditionalProperties)for(const r in t)if(void 0===e.properties[r])throw new u(s,"not have additional property");return}if(void 0===t){if(!0===e.isOptional)return e.default;throw new u(s,"exist")}throw new u(s,"be object");case 5:if(Array.isArray(t)){if("number"==typeof e.maximum&&t.length>e.maximum)throw new u(s,"be shorter than "+e.maximum);if("number"==typeof e.minimum&&t.length<e.minimum)throw new u(s,"be longer than "+e.minimum);if(Array.isArray(e.items))for(let o=0;o<t.length;o++){const n=w(e.items[o],t[o],s+"["+o+"]",r);void 0!==n&&(t[o]=n)}else for(let o=0;o<t.length;o++){const n=w(e.items,t[o],s+"["+o+"]",r);void 0!==n&&(t[o]=n)}return}if(void 0===t){if(!0===e.isOptional)return e.default;throw new u(s,"exist")}throw new u(s,"be array");case 6:if(e.schemas.length>1){if(void 0!==t){let o=!0===r;for(let r=0;r<e.schemas.length;r++){const n=w(e.schemas[r],t,s,o);void 0!==n&&(t=n,o=!1)}if(!0===r)return t}else if(!0!==e.isOptional)throw new u(s,"exist");return}throw new u(s,"be all of schemas");case 7:if(e.schemas.length>1){if(void 0===t){if(!0!==e.isOptional)throw new u(s,"exist");return}for(let o=0;o<e.schemas.length;o++)try{const n=w(e.schemas[o],t,s,r);return void 0!==n?n:void 0}catch{}}throw new u(s,"be one of schemas");case 8:if(void 0===t){try{w(e.schema,t,s)}catch{return}throw new u(s,"not be schema")}if(!0!==e.isOptional)throw new u(s,"exist");return;default:throw new Error("Schema must be valid")}}class g extends t.Server{#r;#o=new Map([["POST",new p],["GET",new p],["PATCH",new p],["DELETE",new p]]);#n=m.instance;#i=new Map([["application/json",function(e){return new Promise((function(t,s){try{const r=[];e.on("data",(function(e){r.push(e)})).once("end",(function(){t(JSON.parse(String(Buffer.concat(r))))})).once("error",s)}catch(e){s(e)}}))}]]);static#a(e,t){if(this.writableEnded)this.server.logger.warn("Send must not be called after end");else{let s=!1;switch(typeof e){case"object":if("string"!=typeof t&&(t="application/json"),e instanceof Error){this.statusCode="number"==typeof e.statusCode?e.statusCode:e instanceof u?400:500;const t=this.statusCode<500;if(!t&&"string"==typeof e.stack){e.stack+="\n";let t=0,s=e.stack.indexOf("\n");for(;-1!==s;)this.server.logger.warn(e.stack.slice(t,s)),t=s+1,s=e.stack.indexOf("\n",t)}e='{"status":"'+(t?'fail","data":{"title":"'+e.message.replace(/"/g,'\\"')+'"}':'error","code":'+this.statusCode+',"message":"'+e.message.replace(/"/g,'\\"')+'"')+"}"}else e='{"status":"success","data":'+JSON.stringify(e)+"}";break;case"undefined":s=!0;break;default:"string"!=typeof t&&(t="text/plain"),e=String(e)}s||(this.setHeader("Content-Type",t+";charset=utf-8"),this.setHeader("Content-Length",Buffer.byteLength(e)),this.write(e)),this.end(),this.server.logger.info(this.request.ip+' "'+this.request.method+" "+decodeURIComponent(this.request.url)+" HTTP/"+this.request.httpVersion+'" '+this.statusCode+' "'+this.request.headers["user-agent"]+'" ('+(Date.now()-this.request.startTime)+"ms)")}}static#u(e){this.statusCode=e}static#c(e,t=307){this.statusCode=t,this.setHeader("location",e),this.end()}static#d(e,t,s){return e.slice(1).reduce((function(e,r){return e.then((function(){return Promise.resolve(r(t,s))}))}),Promise.resolve(e[0](t,s)))}constructor(e={}){super((function(e,t){try{if(Object.assign(e,{server:this,startTime:Date.now()}),this.#r.isProxied&&"string"==typeof e.headers["x-forwarded-for"]){const t=e.headers["x-forwarded-for"].indexOf(",");e.ip=e.headers["x-forwarded-for"].slice(0,-1!==t?t:void 0)}else e.ip=":"!==e.socket.remoteAddress[0]?e.socket.remoteAddress:"127.0.0.1";delete t.req,Object.assign(t,{server:this,request:e,setStatus:g.#u,send:g.#a,redirect:g.#c});const r=this.#o.get(e.method);if(void 0===r)throw new f("Method must be one of GET, POST, PATCH, DELETE");{const o=s.parse(e.url,!0),n=r.getRoute(o.pathname);if(void 0===n)throw new h("Path must be exist");Object.assign(e,{query:o.query,parameter:n[1]});for(const t in n[0].schema)if("body"!==t){for(const s in e[t])"string"==typeof e[t][s]&&(e[t][s]=decodeURIComponent(e[t][s]));if(void 0!==n[0].schema[t]){const s=w(n[0].schema[t],e[t],t[0].toUpperCase()+t.slice(1),!0);void 0!==s&&(e[t]=s)}}if("string"==typeof e.headers["content-type"])switch(e.method){case"POST":case"PATCH":{const s=e.headers["content-type"].indexOf(";"),r=e.headers["content-type"].slice(0,-1!==s?s:void 0),o=this.#i.get(r);if("function"!=typeof o)throw new l("BodyParser must be exist");Promise.resolve(o(e)).then((function(s){if(e.body=s,void 0!==n[0].schema&&void 0!==n[0].schema.body){const t=w(n[0].schema.body,e.body,"Body",!1);void 0!==t&&(e.body=t)}return g.#d(n[0].handlers,e,t)})).catch(t.send.bind(t));break}default:throw new d("Body must be empty")}else{if(void 0!==n[0].schema&&void 0!==n[0].schema.body){const t=w(n[0].schema.body,e.body,"Body",!1);void 0!==t&&(e.body=t)}g.#d(n[0].handlers,e,t)}}}catch(e){t.send(e)}})),"boolean"!=typeof e.isProxied&&(e.isProxied=!1),this.#r=e}get logger(){return this.#n}setRoute(e,t,s){const r=this.#o.get(e);if(void 0!==r)return r.setRoute(t,s),this;throw new f("Method must be one of GET, POST, PATCH, DELETE")}setBodyParser(e,t){return this.#i.set(e,t),this}}exports.BadRequest=d,exports.Conflict=class extends c{constructor(e){super(409,e)}},exports.Forbidden=class extends c{constructor(e){super(403,e)}},exports.ImAteapot=class extends c{constructor(e){super(418,e)}},exports.InternalServerError=class extends c{constructor(e){super(500,e)}},exports.Logger=m,exports.MethodNotAllowed=f,exports.NotFound=h,exports.NotImplemented=class extends c{constructor(e){super(501,e)}},exports.Router=p,exports.SCHEMA_TYPES={NUMBER:0,STRING:1,BOOLEAN:2,NULL:3,OBJECT:4,ARRAY:5,AND:6,OR:7,NOT:8},exports.Server=g,exports.TooManyRequests=class extends c{constructor(e){super(429,e)}},exports.Unauthorized=class extends c{constructor(e){super(401,e)}},exports.UnsupportedMediaType=l,exports.ValidationError=u,exports.validate=w;
