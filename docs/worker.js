!function(e){function a(s){if(t[s])return t[s].exports;var i=t[s]={i:s,l:!1,exports:{}};return e[s].call(i.exports,i,i.exports,a),i.l=!0,i.exports}var t={};return a.m=e,a.c=t,a.i=function(e){return e},a.d=function(e,a,t){Object.defineProperty(e,a,{configurable:!1,enumerable:!0,get:t})},a.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return a.d(t,"a",t),t},a.o=function(e,a){return Object.prototype.hasOwnProperty.call(e,a)},a.p="/static/",a(a.s=169)}({169:function(e,a,t){"use strict";function s(){var e=100-o;return o+=.01*e}function i(e,a,t,i){var r=new FileReader;r.readAsText(e),r.onprogress=function(e){var t=0;e.lengthComputable?t=e.loaded/e.total*100:(console.log("Faking progress"),t=s()),t/=2,a.call(r,t)},r.onload=function(e){var a=void 0;try{a=n["default"](r.result,{ignoreBots:!0})}catch(s){return void i.call(r,s)}t.call(r,a)},r.onerror=i}function r(e,a){a.forEach(function(a){return e.push(a)})}var n=t(85),o=0;onmessage=function(e){var a=e.data,t={end:new Date(0),entries:[],games:[],meta:{lines:{relevant:0,total:0}},players:{},start:new Date,summary:{damage:new n.DamageSummary,deaths:0,kills:0,losses:0,wins:0}},s=function o(e){var s=e/a.length*100;i(a[e],function(e){postMessage({progress:s+e/a.length,type:"progress"})},function(s){try{var i=!1;s.start<t.start&&(t.start=s.start,i=!0),s.end>t.end&&(e>0&&i&&console.warn("A log file was before and after the already parsed output.",a[e-1].name,"output.end",s.end,"output.start",s.start,"totalResult.end",t.end,"totalResult.start",t.start),t.end=s.end),r(t.entries,s.entries),r(t.games,s.games),t.meta.lines.relevant+=s.meta.lines.relevant,t.meta.lines.total+=s.meta.lines.total,Object.keys(s.players).forEach(function(e){var a=t.players[e];a?(a.damage=a.damage.addOtherSummary(s.players[e].damage),a.killed+=s.players[e].killed,a.died+=s.players[e].died,a.timesMet+=s.players[e].timesMet):a=s.players[e]}),t.summary.damage=t.summary.damage.addOtherSummary(s.summary.damage),t.summary.deaths+=s.summary.deaths,t.summary.kills+=s.summary.kills,t.summary.losses+=s.summary.losses,t.summary.wins+=s.summary.wins,e++,a[e]?o(e):postMessage({output:n.makeCloneable(t),type:"done"})}catch(u){postMessage({error:u.message,stack:u.stack,type:"error"})}},function(e){console.log("Posting error"),postMessage({error:e.message,stack:e.stack,type:"error"})})};s(0),postMessage({type:"started"})}},85:function(e,a,t){!function(a,t){e.exports=t()}(this,function(){return function(e){function a(s){if(t[s])return t[s].exports;var i=t[s]={i:s,l:!1,exports:{}};return e[s].call(i.exports,i,i.exports,a),i.l=!0,i.exports}var t={};return a.m=e,a.c=t,a.i=function(e){return e},a.d=function(e,a,t){Object.defineProperty(e,a,{configurable:!1,enumerable:!0,get:t})},a.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return a.d(t,"a",t),t},a.o=function(e,a){return Object.prototype.hasOwnProperty.call(e,a)},a.p="",a(a.s=6)}([function(e,a){"use strict";function t(e,a){if(!(e instanceof a))throw new TypeError("Cannot call a class as a function")}var s=function(){function e(e,a){for(var t=0;t<a.length;t++){var s=a[t];s.enumerable=s.enumerable||!1,s.configurable=!0,"value"in s&&(s.writable=!0),Object.defineProperty(e,s.key,s)}}return function(a,t,s){return t&&e(a.prototype,t),s&&e(a,s),a}}(),i=function(){function e(){t(this,e),this.amount=0,this.averageRange=0,this.count=0,this.rangeSum=0,this.backstabCount=0,this.meleeBlockCount=0,this.rangeBlockCount=0,this.rangeBlockAmount=0}return s(e,[{key:"addDamage",value:function(){var e=arguments.length<=0||void 0===arguments[0]?0:arguments[0],a=arguments[1];a.isBlocked||(this.count++,this.amount+=e),this.rangeSum+=a.range,this.count>0&&(this.averageRange=this.rangeSum/this.count),a.isBackstab&&this.backstabCount++,a.block>0&&(a.isRanged?(this.rangeBlockAmount+=e*(a.block/100),this.rangeBlockCount++):this.meleeBlockCount++)}},{key:"addOtherSubSummary",value:function(a){var t=new e;return t.amount=this.amount+a.amount,t.count=this.count+a.count,this.count>0||a.count>0?t.averageRange=(this.rangeSum+a.rangeSum)/(this.count+a.count):t.averageRange=0,t.backstabCount=this.backstabCount+a.backstabCount,t.meleeBlockCount=this.meleeBlockCount+a.meleeBlockCount,t.rangeBlockAmount=this.rangeBlockAmount+a.rangeBlockAmount,t.rangeBlockCount=this.rangeBlockCount+a.rangeBlockCount,t}}]),e}(),r=function(){function e(){t(this,e),this.summaries={afk:{dealt:new i,received:new i},melee:{dealt:new i,received:new i},ranged:{dealt:new i,received:new i}}}return s(e,[{key:"add",value:function(e){var a=this.summaries.melee;e.isRanged&&(a=e.isAFK?this.summaries.afk:this.summaries.ranged);var t=a.dealt,s=e.dealt;e.received>0&&(t=a.received,s=e.received),t.addDamage(s,e)}},{key:"addOtherSummary",value:function(a){var t=new e;return t.summaries={afk:{dealt:this.summaries.afk.dealt.addOtherSubSummary(a.summaries.afk.dealt),received:this.summaries.afk.received.addOtherSubSummary(a.summaries.afk.received)},melee:{dealt:this.summaries.melee.dealt.addOtherSubSummary(a.summaries.melee.dealt),received:this.summaries.melee.received.addOtherSubSummary(a.summaries.melee.received)},ranged:{dealt:this.summaries.ranged.dealt.addOtherSubSummary(a.summaries.ranged.dealt),received:this.summaries.ranged.received.addOtherSubSummary(a.summaries.ranged.received)}},t}},{key:"getSummary",value:function(){var e=this.summaries.melee.dealt.addOtherSubSummary(this.summaries.ranged.dealt);e=e.addOtherSubSummary(this.summaries.afk.dealt);var a=this.summaries.melee.received.addOtherSubSummary(this.summaries.ranged.received);a=a.addOtherSubSummary(this.summaries.afk.received);var t=e.count+a.count,s=e.rangeSum+a.rangeSum,i=Object.assign({},this.summaries,{averageRange:s/t},{dealt:e,received:a});return i}}]),e}();Object.defineProperty(a,"__esModule",{value:!0}),a["default"]=r},function(e,a){"use strict";function t(e){return s.indexOf(e)!==-1}var s=["eu","us-east","us-west","ocn"];a.isRegionsType=t},function(e,a,t){"use strict";function s(e){var a=arguments.length<=1||void 0===arguments[1]?{ignoreBots:!1}:arguments[1],t=[],s={end:new Date,entries:[],games:[],meta:{lines:{relevant:0,total:0}},players:{},start:new Date,summary:{damage:new i["default"],deaths:0,kills:0,losses:0,wins:0}},u=!1,l=new n["default"],m="",d=0,c=e.split("\n");return c.forEach(function(e,c){s.meta.lines.total++;var h=new r["default"](e);if(t.indexOf(h.moduleName)===-1&&t.push(h.moduleName),h.parse(a),!u&&h.date&&(u=!0,s.start=h.date),h.date&&(s.end=h.date),h.interesting){if(s.meta.lines.relevant++,0!==h.version.api)return d=h.version.api,void(o.indexOf(h.version.api)||console.warn("culling-log-parser: WARNING! This log is from a game version that has not been tested!",h.version.api));if(""===h.version.game){if(0===d&&h.isGameStart&&console.warn("culling-log-parser: WARNING! This log does not appear to have a recognized version line."),h.region&&(m=h.region),h.isKill&&s.summary.kills++,h.isDeath&&s.summary.deaths++,h.isWin&&s.summary.wins++,h.isLoss&&s.summary.losses++,h.damage.isBlocked&&h.damage.isBackstab&&console.warn("culling-log-parser: WARNING! Someone blocked a backstab?!?!?!?!"),h.damage.isBlocked&&h.damage.isAFK&&console.info("culling-log-parser: Someone blocked a damage instance from stupid range. Rare but can happen."),s.summary.damage.add(h.damage),l.addEntry(h),l.isFinished){var g=l.getResult();Object.keys(g.players).forEach(function(e){s.players[e]||(s.players[e]={damage:new i["default"],died:0,killed:0,timesMet:0}),s.players[e].damage=s.players[e].damage.addOtherSummary(l.players[e]),s.players[e].timesMet++}),s.games.push(g),l=new n["default"](m)}s.entries.push(h)}}}),l.start&&!l.isFinished&&(l.finish(s.entries[s.entries.length-1]),s.games.push(l.getResult())),s}var i=t(0),r=t(5),n=t(4),o=[];Object.defineProperty(a,"__esModule",{value:!0}),a["default"]=s},function(e,a){"use strict";function t(e){var a={entries:e.entries,games:e.games,meta:e.meta,players:{},summary:{damage:e.summary.damage.getSummary(),deaths:e.summary.deaths,kills:e.summary.kills,losses:e.summary.losses,wins:e.summary.wins}};return Object.keys(e.players).forEach(function(t){a.players[t]={damage:e.players[t].damage.getSummary(),died:e.players[t].died,killed:e.players[t].killed,timesMet:e.players[t].timesMet}}),a}Object.defineProperty(a,"__esModule",{value:!0}),a["default"]=t},function(e,a,t){"use strict";function s(e,a){if(!(e instanceof a))throw new TypeError("Cannot call a class as a function")}var i=function(){function e(e,a){for(var t=0;t<a.length;t++){var s=a[t];s.enumerable=s.enumerable||!1,s.configurable=!0,"value"in s&&(s.writable=!0),Object.defineProperty(e,s.key,s)}}return function(a,t,s){return t&&e(a.prototype,t),s&&e(a,s),a}}(),r=t(0),n=function(){function e(){var a=arguments.length<=0||void 0===arguments[0]?"":arguments[0];s(this,e),this.start=null,this.end=null,this.players={},this.damageSummary=new r["default"],this.damageInstances=[],this.isWin=!1,this.isFinished=!1,this.deathWaitingForDamage=!1,this.type="custom",this.region=a}return i(e,[{key:"addEntry",value:function(e){e.isGameStart&&(this.start=e.date||new Date),this.addDamage(e),"custom"!==e.gameType.game&&(this.type=e.gameType.game),e.region&&(this.region=e.region),this.deathWaitingForDamage&&e.damage.received?this.finish(e):e.isWin?(this.isWin=!0,this.finish(e)):e.isDeath?this.deathWaitingForDamage=!0:e.isGameEnd&&this.finish(e)}},{key:"addDamage",value:function(e){(e.damage.dealt||e.damage.received||e.damage.isBlocked)&&(this.damageSummary.add(e.damage),this.players[e.otherPlayer]||(this.players[e.otherPlayer]=new r["default"]),this.players[e.otherPlayer].add(e.damage),this.damageInstances.push(Object.assign({name:e.otherPlayer},e.damage)))}},{key:"finish",value:function(e){e.date&&(this.end=e.date),isNaN(e.score)||(this.score=e.score),this.isFinished=!0}},{key:"getResult",value:function(){var e=Object.keys(this.players),a={},t=!0,s=!1,i=void 0;try{for(var r,n=e[Symbol.iterator]();!(t=(r=n.next()).done);t=!0){var o=r.value;a[o]={damage:this.players[o].getSummary(),died:!1,killed:!1}}}catch(u){s=!0,i=u}finally{try{!t&&n["return"]&&n["return"]()}finally{if(s)throw i}}return{damageInstances:this.damageInstances,damageSummary:this.damageSummary.getSummary(),end:this.end,isWin:this.isWin,mode:this.type,players:a,region:this.region,score:this.score,start:this.start}}}]),e}();Object.defineProperty(a,"__esModule",{value:!0}),a["default"]=n},function(e,a,t){"use strict";function s(e,a){if(!(e instanceof a))throw new TypeError("Cannot call a class as a function")}var i=function(){function e(e,a){for(var t=0;t<a.length;t++){var s=a[t];s.enumerable=s.enumerable||!1,s.configurable=!0,"value"in s&&(s.writable=!0),Object.defineProperty(e,s.key,s)}}return function(a,t,s){return t&&e(a.prototype,t),s&&e(a,s),a}}(),r=t(1),n={"VictoryGameMode_Solo.VictoryGameMode_Solo_C":"solo","VictoryGameMode.VictoryGameMode_C":"team","VictoryGameMode_Lightning.VictoryGameMode_Lightning_C":"lightning","VictoryGameMode_Custom.VictoryGameMode_Custom_C":"custom","VictoryGameMode_TrialsSolo.VictoryGameMode_TrialsSolo_C":"trials"},o=function(){function e(a){s(this,e),this.fullLine=a,this.damage={block:0,dealt:0,isAFK:!1,isBackstab:!1,isBlocked:!1,isHeadshot:!1,isRanged:!1,range:0,received:0,timestamp:0},this.isGameStart=!1,this.isGameEnd=!1,this.isWin=!1,this.isLoss=!1,this.otherPlayer="",this.isKill=!1,this.isDeath=!1,this.score=0,this.region="",this.version={api:0,game:""},this.gameType={game:"custom",level:""},this.interesting=!1,this.date=this.parseDate(),this.moduleName=this.parseModuleName()}return i(e,[{key:"parse",value:function(e){this.parseVersion(),this.parseRegion(),this.parseGameState(),this.parseGameType(),this.parseDamage(e.ignoreBots),this.parseRankScoring()}},{key:"parseDate",value:function(){if(!this.fullLine.match(/^\[[\d\.\-:]+]/))return null;var e=this.fullLine.substr(1,4),a=this.fullLine.substr(6,2),t=this.fullLine.substr(9,2),s=this.fullLine.substr(12,2),i=this.fullLine.substr(15,2),r=this.fullLine.substr(18,2),n=this.fullLine.substr(21,3);return new Date(e+"-"+a+"-"+t+"T"+s+":"+i+":"+r+"."+n+"Z")}},{key:"parseModuleName",value:function(){var e=this.fullLine;this.date&&(e=e.substr(30));var a=e.match(/^[^\s]+/);if(!a)return"NoModuleFound";var t=a[0].replace(/:$/,"");return t}},{key:"parseVersion",value:function(){if("LogInit"===this.moduleName){var e=this.fullLine.substr(9);0===e.indexOf("Version:")?(this.version.game=e.substr(18),this.interesting=!0):0===e.indexOf("API Version:")&&(this.version.api=parseInt(e.substr(13),10),this.interesting=!0)}}},{key:"parseRegion",value:function(){if("FrontEnd:Display"===this.moduleName){var e=this.fullLine.substr(48),a=e.match(/appid is [\d]+, using url https?:\/\/clientweb-([^\.]+).theculling.net\/api/i);if(a){this.interesting=!0;var t=a[1];r.isRegionsType(t)?this.region=t:this.region="unknown"}}}},{key:"parseGameState",value:function(){if("LogOnline"===this.moduleName){var e=this.fullLine.substr(41);e.indexOf("GotoState: NewState: Playing")!==-1?this.isGameStart=!0:e.indexOf("GotoState: NewState: MainMenu")!==-1&&(this.isGameEnd=!0)}}},{key:"parseGameType",value:function(){if("LogNet"===this.moduleName){var e=this.fullLine.substr(38);if(e.indexOf("Welcomed by server")!==-1){var a=e.match(/\(Level: \/Game\/Maps\/([^,]+), Game: \/Game\/Blueprints\/GameMode\/([^\)]+)\)/i);if(!a)return void console.warn("culling-log-parser: WARNING! Found a server welcome that didn't match expected format",this.fullLine);this.interesting=!0;var t=n[a[2]];t||(console.warn("culling-log-parser: WARNING! Found an unknown game mode.",a[2],this.fullLine),t="unknown"),this.gameType={game:t,level:a[1]}}}}},{key:"parseDamage",value:function(){var e=!(arguments.length<=0||void 0===arguments[0])&&arguments[0];if("VictoryDamage:Display"===this.moduleName){var a=this.fullLine.substr(53),t=a.match(/You hit (.*) for (-?[\d\.]+) damage \(([\d\.]+)\ m\)/i),s=!0;if(t||(s=!1,t=a.match(/Struck by (.*) for (-?[\d\.]+) damage \(([\d\.]+)\ m\)/i)),!t)return void console.error("VictoryDamage:Display with wrong format",a);if(this.interesting=!0,this.otherPlayer=t[1],e&&this.otherPlayer.match(/<BOT>[\d]-[A-F0-9]{32}/))return void(this.interesting=!1);this.date&&(this.damage.timestamp=this.date.getTime());var i=parseInt(t[2],10);s?this.damage.dealt=i:this.damage.received=i,this.damage.range=parseInt(t[3],10),this.damage.range>3&&(this.damage.isRanged=!0,this.damage.range>300&&(this.damage.isAFK=!0));var r=a.match(/BLOCKED ([\d]+)%/i);r&&(this.damage.isBlocked=!0,this.damage.block=parseInt(r[1],10),50===this.damage.block?this.damage.isRanged=!0:100!==this.damage.block&&25!==this.damage.block&&console.info("culling-log-parser: Found abnormal block value!",r[1],this.fullLine)),a.match("BACKSTAB!")&&(this.damage.isBackstab=!0),a.match("HEADSHOT!")&&(this.damage.isHeadshot=!0)}}},{key:"parseRankScoring",value:function(){if("LogOnline:Warning"===this.moduleName){var e=this.fullLine.substr(49),a=e.match(/RankScoring (win|loss|kill|death): (-?[\d]+)/i);if(a)switch(this.interesting=!0,this.score=parseInt(a[2],10),a[1]){case"win":this.isWin=!0;break;case"loss":this.isLoss=!0;break;case"kill":this.isKill=!0;break;case"death":this.isDeath=!0;break;default:console.error("Found unknown RankScoring value:"+e)}}}}]),e}();Object.defineProperty(a,"__esModule",{value:!0}),a["default"]=o},function(e,a,t){"use strict";var s=t(2),i=t(0);a.DamageSummary=i["default"];var r=t(3);a.makeCloneable=r["default"];var n=t(1);a.ICullingParser=n,Object.defineProperty(a,"__esModule",{value:!0}),a["default"]=s["default"]}])})}});
//# sourceMappingURL=worker.js.map