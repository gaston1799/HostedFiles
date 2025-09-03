// ==UserScript==
// @name         Roblox Presence Dashboard + Fit Cloner (USD Packs + Last Seen) — finished
// @namespace    gaston.presence
// @version      1.3.1
// @description  Track multiple users; show last seen; join; show/clone fit; USD-optimal Robux combo; dynamic add/remove
// @match        *://*.roblox.com/*
// @run-at       document-idle
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @connect      localhost
// @connect      127.0.0.1
// @connect      users.roblox.com
// @connect      avatar.roblox.com
// @connect      inventory.roblox.com
// @connect      economy.roblox.com
// @connect      catalog.roblox.com
// ==/UserScript==

(function () {
    "use strict";

    // -----------------------------
    // tiny DOM helper (kept from you; cleaned)
    // -----------------------------
    class element {
        static get br() { return new element("br"); }
        constructor(name, obj) {
            this.element = (typeof name === "object" && name && String(name.constructor && name.constructor.name).indexOf("HTML") > -1)
                ? name
            : (function () {
                var el = document.createElement(name);
                if (obj) for (var k in obj) el.setAttribute(k, obj[k]);
                return el;
            })();
        }
        style(obj) { if (obj) for (var k in obj) this.element.style[k] = obj[k]; return this; }
        append(target /* , ...targets */) {
            this.element.append(target && target.element ? target.element : target);
            for (var i = 1; i < arguments.length; i++) {
                var a = arguments[i];
                this.element.append(a && a.element ? a.element : a);
            }
            return this;
        }
        appendTo(target) {
            try {
                var t = target && target.element ? target.element : (typeof target === "string" ? document.querySelector(target) : target);
                t.append(this.element);
            } catch (e) {
                console.warn("Failed to append", e);
            }
            return this;
        }
        on(event, fn) { this.element["on" + event] = fn; return this; }
        set(prop, val) { this.element[prop] = val; return this; }
        remove() { this.element.remove(); return this; }
        get() { return this.element[arguments[0]]; }
        get children() {
            var arr = Array.prototype.slice.call(this.element.children);
            return new (function (A) {
                for (var i = 0; i < A.length; i++) this[i] = A[i];
                Object.defineProperty(this, "length", { get: function() { return A.length; } });
                this.item = function(i){ return this[i] != null ? this[i] : null; };
                this.namedItem = function(name){ for (var i=0;i<A.length;i++) { var n=A[i]; if (n.id===name || n.name===name) return n; } return null; };
                Object.freeze(this);
            })(arr);
        }
    }
    function sleep(ms){ return new Promise(function(r){ setTimeout(r,ms); }); }
    function waitForEl(sel, timeout) {
        timeout = timeout || 10000;
        var el = document.querySelector(sel);
        if (el) return Promise.resolve(el);
        return new Promise(function(res, rej){
            var obs = new MutationObserver(function(){
                var el2 = document.querySelector(sel);
                if (el2) { obs.disconnect(); res(el2); }
            });
            obs.observe(document.documentElement, { childList: true, subtree: true });
            setTimeout(function(){ obs.disconnect(); rej(new Error("Timeout: "+sel)); }, timeout);
        });
    }

    // -----------------------------
    // storage helpers (GM -> fallback localStorage)
    // -----------------------------
    function getJSONStore(key, dflt) {
        try {
            var raw = typeof GM_getValue === "function" ? GM_getValue(key, "") : localStorage.getItem(key) || "";
            if (!raw) return dflt;
            return JSON.parse(raw);
        } catch(e) { return dflt; }
    }
    function setJSONStore(key, val) {
        var raw = JSON.stringify(val || {});
        try {
            if (typeof GM_setValue === "function") GM_setValue(key, raw);
            else localStorage.setItem(key, raw);
        } catch(e) {}
    }
    function getArrStore(key) {
        try {
            var raw = typeof GM_getValue === "function" ? GM_getValue(key, "") : localStorage.getItem(key) || "";
            if (!raw) return [];
            var a = JSON.parse(raw);
            return Array.isArray(a) ? a : [];
        } catch(e){ return []; }
    }
    function setArrStore(key, arr) {
        try {
            var raw = JSON.stringify(arr || []);
            if (typeof GM_setValue === "function") GM_setValue(key, raw);
            else localStorage.setItem(key, raw);
        } catch(e){}
    }

    // -----------------------------
    // route util (for profile add/remove button)
    // -----------------------------
    function routeKey() {
        // e.g. https://www.roblox.com/users/9348877261/profile
        var parts = location.href.split("/");
        var tail = [];
        for (var i=3;i<parts.length;i++) tail.push(parts[i].replace(/[0-9]/g,""));
        return tail.join(":");
    }

    // -----------------------------
    // CONFIG
    // -----------------------------
    var SERVER = "http://localhost:3000";
    var REFRESH_MS = 15000;
    var SHOW_USERNAME = true;

    // initial watch list
    var bonusUsers = []; // any defaults you want hardcoded
    var watchUsers = getArrStore("presence_watch_users");
    var TARGET_USERS = uniq(bonusUsers.concat(watchUsers));

    // USD-priced Robux packs
    var ROBUX_PACKS_USD = [
        { r$: 80,    usd: 0.99  },
        { r$: 400,   usd: 4.99  },
        { r$: 800,   usd: 9.99  },
        { r$: 1700,  usd: 19.99 },
        { r$: 4500,  usd: 49.99 },
        { r$: 10000, usd: 99.99 }
    ];

    // -----------------------------
    // logger
    // -----------------------------
    class CustomLogging {
        constructor(title) {
            this.title = { body: title || "---", color: "darkgrey", size: "1rem" };
            this.body  = { color: "#008f68",    size: "1rem" };
        }
        #fmt(level){
            var lvl = String(level).toUpperCase();
            return ["%c"+this.title.body+" ["+lvl+'] | %c',
                    "color:"+this.title.color+";font-weight:bold;font-size:"+this.title.size+";",
                    "color:"+this.body.color+";font-weight:bold;font-size:"+this.body.size+";text-shadow:0 0 5px rgba(0,0,0,.2);"];
        }
        log(m){ var f=this.#fmt("log"); console.log(f[0]+m,f[1],f[2]); }
        warn(m){ var f=this.#fmt("warn"); console.warn(f[0]+m,f[1],f[2]); }
        error(m){ var f=this.#fmt("error"); console.error(f[0]+m,f[1],f[2]); }
    }
    var clog = new CustomLogging("PresenceHUD");

    // -----------------------------
    // XHR helpers
    // -----------------------------
    function xhrJSON(opts) {
        var method = opts && opts.method ? opts.method : "GET";
        var url = opts && opts.url ? opts.url : "";
        var headers = opts && opts.headers ? opts.headers : {};
        var data = opts && opts.data ? opts.data : null;
        var timeout = opts && opts.timeout ? opts.timeout : 15000;

        return new Promise(function(resolve, reject){
            GM_xmlhttpRequest({
                method: method, url: url, headers: headers, data: data, timeout: timeout,
                onload: function(r){
                    var ok = r.status >= 200 && r.status < 300;
                    if (!ok) return reject(new Error("HTTP "+r.status+" "+(r.responseText ? r.responseText.slice(0,160) : "")));
                    try { resolve(JSON.parse(r.responseText || "{}")); }
                    catch(e){ reject(e); }
                },
                onerror: function(){ reject(new Error("Network error")); },
                ontimeout: function(){ reject(new Error("Timeout")); }
            });
        });
    }

    // same-site fetch with cookies
    async function fetchJSON(url, bodyObj) {
        var opts = bodyObj ? {
            method: "POST",
            mode: "cors",
            credentials: "include",
            headers: { "content-type":"application/json", "accept":"application/json" },
            body: JSON.stringify(bodyObj)
        } : {
            method: "GET",
            mode: "cors",
            credentials: "include",
            headers: { "accept":"application/json" }
        };
        var res = await fetch(url, opts);
        if (!res.ok) throw new Error("HTTP "+res.status);
        return res.json();
    }

    // APIs
    var api = {
        presenceUsers: function(ids){ return xhrJSON({ url: SERVER + "/presence-users?userIds=" + ids.join(",") }); },
        usernames: function(ids){
            return xhrJSON({
                method: "POST",
                url: "https://users.roblox.com/v1/users",
                headers: { "content-type":"application/json","accept":"application/json" },
                data: JSON.stringify({ userIds: ids.map(Number), excludeBannedUsers:false })
            });
        },
        me: function(){ return fetchJSON("https://users.roblox.com/v1/users/authenticated"); },
        avatar: function(userId){ return fetchJSON("https://avatar.roblox.com/v1/users/"+userId+"/avatar"); },
        ownsAsset: function(myUserId, assetId){
            return fetchJSON("https://inventory.roblox.com/v1/users/"+myUserId+"/items/Asset/"+assetId+"/is-owned").then(function(x){ return !!x; });
        },
        assetDetails: function(assetId){ return xhrJSON({ url: "https://economy.roblox.com/v2/assets/"+assetId+"/details" }); },
        assetToBundle: function(assetId){
            return xhrJSON({ url: "https://catalog.roblox.com/v1/assets/"+assetId+"/bundles" }).then(function(r){ return r && r.data ? r.data : []; }).catch(function(){ return []; });
        },
        bundleDetails: function(bundleId){ return xhrJSON({ url: "https://catalog.roblox.com/v1/bundles/"+bundleId+"/details" }); }
    };

    // -----------------------------
    // utilities
    // -----------------------------
    function uniq(arr) {
        var m = {}; var out = [];
        for (var i=0;i<arr.length;i++) { var v = Number(arr[i]); if (v && !m[v]) { m[v]=1; out.push(v); } }
        return out;
    }
    function bestUsdPackCombo(targetR$) {
        if (targetR$ <= 0) return { usd: 0, leftover: 0, packs: [], totalR$: 0 };
        var maxPackR$ = 0; for (var i=0;i<ROBUX_PACKS_USD.length;i++) if (ROBUX_PACKS_USD[i].r$ > maxPackR$) maxPackR$ = ROBUX_PACKS_USD[i].r$;
        var goal = targetR$ + maxPackR$;
        var dp = new Array(goal+1);
        dp[0] = { usd: 0, prev: null };
        var i,j,p,pack,candUsd;
        for (i=0;i<=goal;i++){
            if (!dp[i]) continue;
            for (p=0;p<ROBUX_PACKS_USD.length;p++){
                pack = ROBUX_PACKS_USD[p];
                j = i + pack.r$; if (j > goal) j = goal;
                candUsd = dp[i].usd + pack.usd;
                if (!dp[j] || candUsd < dp[j].usd - 1e-9) dp[j] = { usd: candUsd, prev: { i: i, packIndex: p } };
            }
        }
        var best=null, bestJ=-1;
        for (j=targetR$; j<=goal; j++){
            if (!dp[j]) continue;
            var cand = { j: j, usd: dp[j].usd, leftover: j - targetR$ };
            if (!best || cand.usd < best.usd - 1e-9 || (Math.abs(cand.usd - best.usd) < 1e-9 && cand.leftover < best.leftover)) { best=cand; bestJ=j; }
        }
        if (!best) return null;
        var counts = new Map();
        var cur = bestJ;
        while (cur > 0) {
            var prev = dp[cur].prev;
            if (!prev) break;
            pack = ROBUX_PACKS_USD[prev.packIndex];
            counts.set(pack, (counts.get(pack) || 0) + 1);
            cur = prev.i;
        }
        var packs = [];
        counts.forEach(function(count, pack){ packs.push({ r$: pack.r$, usd: pack.usd, count: count }); });
        packs.sort(function(a,b){ return b.r$ - a.r$; });
        return { usd: Number(best.usd.toFixed(2)), leftover: best.leftover, packs: packs, totalR$: bestJ };
    }
    function getLocalLastSeen(id) {
        var map = getJSONStore("lastSeenInGame", {});
        return map[id] || null;
    }
    function setLocalLastSeen(id, whenMs) {
        var map = getJSONStore("lastSeenInGame", {});
        map[id] = whenMs;
        setJSONStore("lastSeenInGame", map);
    }
    function timeAgo(ms) {
        if (!ms) return "—";
        var s = Math.max(1, Math.floor((Date.now() - ms)/1000));
        var units = [["d",86400],["h",3600],["m",60],["s",1]];
        for (var i=0;i<units.length;i++){
            var label=units[i][0], sec=units[i][1];
            if (s >= sec) return String(Math.floor(s/sec)) + label + " ago";
        }
        return "just now";
    }

    // -----------------------------
    // HUD
    // -----------------------------
    function waitForBody(){
        return new Promise(function(res){
            if (document.body) return res();
            var obs = new MutationObserver(function(){
                if (document.body) { obs.disconnect(); res(); }
            });
            obs.observe(document.documentElement, { childList:true, subtree:true });
        });
    }

    function makeHUD() {
        var box = document.createElement("div");
        box.id = "presence-hud";
        box.style.cssText = "position:fixed;top:72px;right:20px;z-index:2147483647;background:#0e0e12;color:#eee;padding:10px 10px 8px;width:400px;border-radius:12px;box-shadow:0 10px 24px rgba(0,0,0,.4);font:14px/1.35 ui-sans-serif,system-ui,Segoe UI,Roboto;";
        box.innerHTML =
            '<div style="display:flex;align-items:center;gap:8px;cursor:move" id="phud-title">' +
            '<div style="font-weight:700;">Presence Dashboard</div>' +
            '<div id="phud-status" style="margin-left:auto;font-size:12px;opacity:.8;">—</div>' +
            '<button id="phud-close" style="background:#222;border:none;color:#aaa;padding:2px 8px;border-radius:6px;cursor:pointer;">×</button>' +
            '</div>' +
            '<div style="margin:8px 0 6px;display:flex;gap:8px;align-items:center;">' +
            '<button id="phud-refresh" style="flex:0 0 auto;background:#2b2f3a;border:none;color:#fff;padding:6px 10px;border-radius:8px;cursor:pointer;">Refresh</button>' +
            '<div style="font-size:12px;opacity:.7;">Polling every '+Math.floor(REFRESH_MS/1000)+'s</div>' +
            '</div>' +
            '<div style="display:flex;gap:6px;margin-bottom:8px;">' +
            '<input id="phud-add-input" type="text" placeholder="Add userId" style="flex:1;background:#14141b;border:1px solid #242432;color:#fff;padding:6px 8px;border-radius:8px;outline:none;" />' +
            '<button id="phud-add-btn" style="background:#3b82f6;border:none;color:#fff;padding:6px 10px;border-radius:8px;cursor:pointer;">Add</button>' +
            '</div>' +
            '<div id="phud-list" style="max-height:480px;overflow:auto;border-top:1px solid #1e1e24;"></div>';

        document.body.appendChild(box);

        // drag
        (function drag(el, handle){
            var sx=0, sy=0, ox=0, oy=0, down=false;
            handle.addEventListener("mousedown", function(e){ down=true; sx=e.clientX; sy=e.clientY; var r=el.getBoundingClientRect(); ox=r.left; oy=r.top; e.preventDefault(); });
            window.addEventListener("mousemove", function(e){ if(!down) return; var dx=e.clientX-sx, dy=e.clientY-sy; el.style.left=(ox+dx)+"px"; el.style.top=(oy+dy)+"px"; el.style.right="auto"; el.style.bottom="auto"; el.style.position="fixed"; });
            window.addEventListener("mouseup", function(){ down=false; });
        })(box, box.querySelector("#phud-title"));

        box.querySelector("#phud-close").onclick = function(){ box.remove(); };

        // add user handling
        box.querySelector("#phud-add-btn").onclick = function(){
            var input = box.querySelector("#phud-add-input");
            var v = Number((input.value || "").trim());
            if (!v) return;
            watchUsers = uniq(watchUsers.concat([v]));
            setArrStore("presence_watch_users", watchUsers);
            TARGET_USERS = uniq(bonusUsers.concat(watchUsers));
            input.value = "";
            refreshOnce(box);
        };

        return box;
    }

    function renderRows(listEl, users, nameMap, lastSeenServer) {
        listEl.innerHTML = "";
        for (var i=0;i<users.length;i++){
            var u = users[i];
            var name = (nameMap[u.userId] ? nameMap[u.userId] : u.userId);
            var inGame = Number(u.userPresenceType) === 2;
            var statusText = inGame
            ? "🎮 In Game " + (u.lastLocation ? "– " + u.lastLocation : "")
            : (u.userPresenceType === 1 ? "🌐 Online" : "❌ Offline");
            var joinLink = (inGame && u.placeId && (u.gameId || u.serverId))
            ? ("roblox://placeId="+u.placeId+"&gameInstanceId="+(u.gameId || u.serverId)) : null;

            var seenSrv = lastSeenServer && lastSeenServer[u.userId] ? lastSeenServer[u.userId] : null;
            if (inGame) setLocalLastSeen(u.userId, Date.now());
            else if (seenSrv) setLocalLastSeen(u.userId, seenSrv);
            var seen = getLocalLastSeen(u.userId);
            var seenTxt = seen ? timeAgo(seen) : "—";

            var row = document.createElement("div");
            row.style.cssText = "padding:8px 4px;border-bottom:1px solid #1e1e24;display:flex;align-items:center;gap:8px;";
            row.innerHTML =
                '<div style="flex:1;min-width:0;">' +
                '<div style="font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">'+name+'</div>' +
                '<div style="font-size:12px;opacity:.85;">'+statusText+'</div>' +
                '<div style="font-size:12px;opacity:.65;">Last seen in game: '+(inGame ? "now" : seenTxt)+'</div>' +
                '</div>' +
                '<div style="display:flex;gap:6px;align-items:center;">' +
                '<button class="phud-showfit" data-user="'+u.userId+'" style="background:#5865f2;border:none;color:#fff;padding:6px 10px;border-radius:8px;cursor:pointer;">Show Fit</button>' +
                (joinLink
                 ? '<button class="phud-join" data-link="'+joinLink+'" style="background:#28a745;border:none;color:#fff;padding:6px 10px;border-radius:8px;cursor:pointer;">Join Now</button>'
                 : '<button disabled style="background:#3a3a45;border:none;color:#888;padding:6px 10px;border-radius:8px;">Join Now</button>') +
                '<button class="phud-remove" data-user="'+u.userId+'" title="Remove" style="background:#2b2f3a;border:none;color:#ff9aa2;padding:6px 10px;border-radius:8px;cursor:pointer;">🗑</button>' +
                '</div>';
            listEl.appendChild(row);
        }

        var joins = listEl.querySelectorAll(".phud-join");
        for (var j=0;j<joins.length;j++) joins[j].onclick = function(){ window.location.href = this.getAttribute("data-link"); };

        var fits = listEl.querySelectorAll(".phud-showfit");
        for (var k=0;k<fits.length;k++) fits[k].onclick = function(){ openFitPopup(Number(this.getAttribute("data-user"))); };

        var rems = listEl.querySelectorAll(".phud-remove");
        for (var r=0;r<rems.length;r++) rems[r].onclick = function(){
            var uid = Number(this.getAttribute("data-user"));
            watchUsers = watchUsers.filter(function(x){ return x !== uid; });
            setArrStore("presence_watch_users", watchUsers);
            TARGET_USERS = uniq(bonusUsers.concat(watchUsers));
            refreshOnce(document.getElementById("presence-hud"));
        };
    }

    function fitPopupHTML() {
        var wrap = document.createElement("div");
        wrap.style.cssText = "position:fixed;top:100px;right:420px;z-index:2147483647;background:#0f1116;color:#eee;width:460px;max-height:80vh;overflow:auto;border-radius:12px;box-shadow:0 10px 24px rgba(0,0,0,.4);padding:12px;";
        wrap.innerHTML =
            '<div style="display:flex;align-items:center;gap:8px;">' +
            '<div id="fp-title" style="font-weight:700;">Fit</div>' +
            '<div id="fp-sub" style="margin-left:auto;font-size:12px;opacity:.8;">loading…</div>' +
            '<button id="fp-close" style="background:#222;border:none;color:#aaa;padding:2px 8px;border-radius:6px;cursor:pointer;">×</button>' +
            '</div>' +
            '<div id="fp-preview" style="margin:8px 0;"></div>' +
            '<div id="fp-cost" style="margin:6px 0;font-weight:600;"></div>' +
            '<div id="fp-pack" style="margin:4px 0 10px;font-size:13px;opacity:.9;"></div>' +
            '<div id="fp-list" style="border-top:1px solid #1e1e24;"></div>' +
            '<div style="margin-top:10px;display:flex;gap:8px;flex-wrap:wrap;">' +
            '<button id="fp-clone" style="background:#28a745;border:none;color:#fff;padding:8px 12px;border-radius:8px;cursor:pointer;">Clone Fit (wear owned)</button>' +
            '<button id="fp-buy"   style="background:#f2994a;border:none;color:#fff;padding:8px 12px;border-radius:8px;cursor:pointer;">Buy Missing (open tabs)</button>' +
            '</div>';
        document.body.appendChild(wrap);
        wrap.querySelector("#fp-close").onclick = function(){ wrap.remove(); };
        return wrap;
    }

    async function openFitPopup(userId) {
        var pop = fitPopupHTML();
        var title = pop.querySelector("#fp-title");
        var sub   = pop.querySelector("#fp-sub");
        var list  = pop.querySelector("#fp-list");
        var pview = pop.querySelector("#fp-preview");
        var pcost = pop.querySelector("#fp-cost");
        var ppack = pop.querySelector("#fp-pack");

        try {
            var nameResp = await api.usernames([userId]);
            var uname = (nameResp && nameResp.data && nameResp.data[0] && nameResp.data[0].name) ? nameResp.data[0].name : userId;
            title.textContent = "Fit: " + uname;

            var me = null;
            try { me = await api.me(); } catch(e){}

            var av = await api.avatar(userId);
            var assetsArr = av && av.assets ? av.assets : [];
            var wornAssets = [];
            for (var i=0;i<assetsArr.length;i++){
                var a = assetsArr[i];
                if (a && a.id && a.name) {
                    wornAssets.push({
                        assetId: a.id,
                        name: a.name,
                        typeId: a.assetType && a.assetType.id ? a.assetType.id : null,
                        isPackageAsset: !!a.isPackageAsset
                    });
                }
            }

            pview.innerHTML = '<div style="font-size:13px;opacity:.85;">Items worn: '+wornAssets.length+'</div>';

            var results = [];
            for (i=0;i<wornAssets.length;i++){
                var it = wornAssets[i];
                var owned = false, price = null, productId = null, bundle = null, bundleOnly = false, purchaseUrl = null;

                if (me && me.id) {
                    try { owned = await api.ownsAsset(me.id, it.assetId); } catch(e){}
                }

                try {
                    var det = await api.assetDetails(it.assetId);
                    if (det) {
                        price = det.PriceInRobux != null ? det.PriceInRobux : null;
                        productId = det.ProductId != null ? det.ProductId : null;
                        if (productId) purchaseUrl = "https://www.roblox.com/catalog/" + it.assetId;
                    }
                } catch(e){}

                if (price == null) {
                    try {
                        var bundles = await api.assetToBundle(it.assetId);
                        if (bundles && bundles.length) {
                            bundleOnly = true;
                            try {
                                var b = await api.bundleDetails(bundles[0].bundleId);
                                if (b && b.id) {
                                    bundle = { id: b.id, name: b.name, price: (b.product && b.product.priceInRobux != null ? b.product.priceInRobux : null) };
                                    purchaseUrl = "https://www.roblox.com/bundles/" + bundle.id + "/" + encodeURIComponent(bundle.name || "bundle");
                                }
                            } catch (e2) {
                                console.warn("Bundle lookup failed for", it.assetId, String(e2 && e2.message ? e2.message : e2));
                            }
                        }
                    } catch(e){}
                }

                results.push({ assetId: it.assetId, name: it.name, typeId: it.typeId, isPackageAsset: it.isPackageAsset, owned: owned, price: price, productId: productId, bundle: bundle, bundleOnly: bundleOnly, purchaseUrl: purchaseUrl });
            }

            var missing = 0;
            var missingAssets = [];
            for (i=0;i<results.length;i++){
                var r = results[i];
                if (!r.owned && !r.bundleOnly && r.price != null) missingAssets.push(r);
            }
            for (i=0;i<missingAssets.length;i++) missing += (missingAssets[i].price || 0);

            var missingBundlesMap = {};
            for (i=0;i<results.length;i++){
                r = results[i];
                if (!r.owned && r.bundleOnly && r.bundle && r.bundle.id && r.bundle.price != null) {
                    if (!missingBundlesMap[r.bundle.id]) {
                        missingBundlesMap[r.bundle.id] = r.bundle;
                        missing += r.bundle.price;
                    }
                }
            }

            var html = "";
            for (i=0;i<results.length;i++){
                r = results[i];
                var ownBadge = r.owned ? '<span style="color:#7ee787;">owned</span>' : '<span style="color:#ffb3b3;">missing</span>';
                var priceTxt = (r.price != null) ? (r.price + " R$") : (r.bundleOnly ? "bundle-only" : "offsale");
                var buyBtn = (!r.owned && r.purchaseUrl) ? (' <a target="_blank" href="'+r.purchaseUrl+'" style="margin-left:6px;text-decoration:none;background:#f2994a;color:#fff;padding:3px 6px;border-radius:6px;">Buy</a>') : '';
                html += '<div style="padding:8px;border-bottom:1px solid #1e1e24;">' +
                    '<div style="font-weight:600;">'+r.name+' <span style="opacity:.7">(#'+r.assetId+')</span></div>' +
                    '<div style="font-size:12px;opacity:.9;">'+ownBadge+' • '+(r.bundleOnly && r.bundle ? ('via Bundle: '+r.bundle.name) : ('price: '+priceTxt))+buyBtn+'</div>' +
                    '</div>';
            }
            list.innerHTML = html;

            pcost.textContent = "Missing total: " + missing + " R$";
            var plan = bestUsdPackCombo(missing);
            if (plan) {
                var packsStrArr = [];
                for (i=0;i<plan.packs.length;i++) packsStrArr.push(plan.packs[i].count + "× " + plan.packs[i].r$ + "R$ ($" + plan.packs[i].usd + ")");
                var packsStr = packsStrArr.join(" + ");
                ppack.textContent = "Buy Robux (~$" + plan.usd.toFixed(2) + "): " + packsStr + " = " + plan.totalR$ + "R$ (leftover " + plan.leftover + "R$)";
            } else {
                ppack.textContent = "You already own everything.";
            }

            pop.querySelector("#fp-buy").onclick = function(){
                for (var i2=0;i2<results.length;i2++) {
                    var rr = results[i2];
                    if (!rr.owned && rr.purchaseUrl) window.open(rr.purchaseUrl, "_blank");
                }
            };
            pop.querySelector("#fp-clone").onclick = function(){
                for (var i3=0;i3<results.length;i3++) {
                    var rr2 = results[i3];
                    if (rr2.owned && rr2.purchaseUrl) window.open(rr2.purchaseUrl, "_blank");
                }
            };

            sub.textContent = "ready";
        } catch (e) {
            sub.textContent = "error";
            clog.error("Fit popup failed: " + e.message);
        }
    }

    // -----------------------------
    // refresh
    // -----------------------------
    async function refreshOnce(hudEl) {
        var statusEl = hudEl.querySelector("#phud-status");
        var listEl   = hudEl.querySelector("#phud-list");
        try {
            statusEl.textContent = "checking…";
            if (!TARGET_USERS.length) {
                listEl.innerHTML = '<div style="padding:10px;opacity:.8;">No users yet. Add a userId above.</div>';
                statusEl.textContent = "OK";
                attachProfileButton(); // still attach on profile
                return;
            }

            var presData = await api.presenceUsers(TARGET_USERS);
            var pres = presData && presData.userPresences ? presData.userPresences : [];
            var lastSeenServer = presData && presData.lastSeenInGame ? presData.lastSeenInGame : {};
            var namesResp = await api.usernames(TARGET_USERS);
            var nameMap = {};
            if (namesResp && namesResp.data) for (var i=0;i<namesResp.data.length;i++) nameMap[namesResp.data[i].id] = namesResp.data[i].name;

            renderRows(listEl, pres, nameMap, lastSeenServer);
            statusEl.textContent = "OK";
        } catch (e) {
            statusEl.textContent = "error";
            listEl.innerHTML = '<div style="padding:10px;color:#ff8a8a;">'+e.message+'</div>';
            clog.error("Refresh failed: " + e.message);
        }
        if(paths[parsed])paths[parsed]()
        else clog.warn(`${parsed} - doesn't exist yet or wasnted instea to have dom actions!`)
    }

    // -----------------------------
    // profile page Add/Remove button
    // -----------------------------
    async function attachProfileButton() {
        var key = routeKey();
        if (key !== "users::profile") return;
        if (document.getElementById("PresenceHUD_AddBtn")) return;

        var userId = Number(location.href.split("/")[4]) || 0;
        var targetSel = ["#unfriend-button", "#friend-button", 'button[data-testid="profile-action"]'];
        var foundSel = null;
        for (var i=0;i<targetSel.length;i++){ if (document.querySelector(targetSel[i])) { foundSel = targetSel[i]; break; } }
        if (!foundSel) return;

        var base = null;
        try { base = await waitForEl(foundSel); } catch(e){ return; }
        if (!base) return;

        var btn = new element("button", { id: "PresenceHUD_AddBtn", class: base.className });
        var isInList = TARGET_USERS.indexOf(userId) > -1;
        btn.set("textContent", isInList ? "Remove User" : "Add User");
        base.insertAdjacentElement("beforebegin", btn.element);

        btn.on("click", function(){
            var currentlyIn = TARGET_USERS.indexOf(userId) > -1;
            if (currentlyIn) {
                watchUsers = watchUsers.filter(function(x){ return x !== userId; });
            } else {
                if (userId) watchUsers = uniq(watchUsers.concat([userId]));
            }
            setArrStore("presence_watch_users", watchUsers);
            TARGET_USERS = uniq(bonusUsers.concat(watchUsers));
            btn.set("textContent", TARGET_USERS.indexOf(userId) > -1 ? "Remove User" : "Add User");
            var hud = document.getElementById("presence-hud");
            if (hud) refreshOnce(hud);
        });
    }

    const paths = {
        'users::profile': async function(){
            await attachProfileButton()
            return true;
        }
    };

    // route parser
    let parsed = location.href.split('/').map(e => e.replace(/[0-9]/g,'')).slice(3).join(':');
    // -----------------------------
    // boot
    // -----------------------------
    (async function boot(){
        await waitForBody();
        var hud = makeHUD();
        hud.querySelector("#phud-refresh").onclick = function(){
            TARGET_USERS = uniq(bonusUsers.concat(watchUsers));
            refreshOnce(hud);
        };
        refreshOnce(hud);
        setInterval(function(){ TARGET_USERS = uniq(bonusUsers.concat(watchUsers)); refreshOnce(hud); }, REFRESH_MS);

        // toggle HUD (Ctrl+Shift+F)
        window.addEventListener("keydown", function(e){
            if (e.ctrlKey && e.shiftKey && String(e.key).toLowerCase() === "f") {
                var el = document.getElementById("presence-hud");
                if (!el) return;
                el.style.display = (el.style.display === "none" ? "block" : "none");
            }
        });
    })();
})();
