// ==UserScript==
// @name Project Nozo Single
// @namespace nozo.single
// @version 0.1.0
// @description Single-file rewrite scaffold
// @match *://*.moomoo.io/*
// @run-at document-idle
// @grant unsafeWindow
// @license MIT
// ==/UserScript==
!(function () {
    "use strict";
    const e = "undefined" != typeof unsafeWindow ? unsafeWindow : window;
    function t(e) {
        return document.getElementById(e);
    }
    const n = {
            serverUpdateRate: 9,
            clientSendRate: 5,
            mapScale: 14400,
            playerScale: 35,
            playerSpeed: 0.0016,
            playerDecel: 0.993,
            gatherAngle: 1.208304866765305,
            gatherWiggle: 10,
            hitReturnRatio: 0.25,
            hitAngle: 1.5707963267948966,
            riverWidth: 724,
            riverPadding: 114,
            snowBiomeTop: 2400,
            maxNameLength: 15,
        },
        o = {
            showDir: !1,
            attackDir: !1,
            autoPush: !0,
            spikeCones: !1,
            tracerGhost: !0,
            debug: !1,
            renderOverlay: !0,
            movementAssist: !1,
        };
    function s() {
        const t = e.config;
        if (!t || "object" != typeof t) return n;
        const o = Object.keys(n);
        for (let e = 0; e < o.length; e++) {
            const s = o[e];
            void 0 !== t[s] && (n[s] = t[s]);
        }
        return n;
    }
    function i(e) {
        if (!e || "object" != typeof e) return o;
        const t = Object.keys(e);
        for (let n = 0; n < t.length; n++) {
            const s = t[n];
            o[s] = e[s];
        }
        return o;
    }
    function r() {
        return o;
    }
    class a {
        static get br() {
            return new a("br");
        }
        constructor(e, t) {
            this.element =
                e && e.constructor && e.constructor.name.includes("HTML")
                    ? e
                    : (function (e, t) {
                          const n = document.createElement(e),
                              o = t || {};
                          for (const e in o) n.setAttribute(e, o[e]);
                          return n;
                      })(e, t);
        }
        style(e) {
            for (const t in e) this.element.style[t] = e[t];
            return this;
        }
        append(e, ...t) {
            this.element.append((e && e.element) || e);
            for (let e = 0; e < t.length; e++) {
                const n = t[e];
                this.element.append((n && n.element) || n);
            }
            return this;
        }
        appendTo(e) {
            return (
                (e && e.element
                    ? e.element
                    : "string" == typeof e
                      ? document.querySelector(e)
                      : e
                ).append(this.element),
                this
            );
        }
        on(e, t) {
            return (this.element["on" + e] = t), this;
        }
        set(e, t) {
            return (this.element[e] = t), this;
        }
        remove() {
            return this.element.remove(), this;
        }
        get(e) {
            return this.element[e];
        }
        get children() {
            return new (class {
                constructor(e) {
                    for (let t = 0; t < e.length; t += 1) this[t] = e[t];
                    Object.defineProperty(this, "length", { get: () => e.length }),
                        Object.freeze(this);
                }
                item(e) {
                    return null != this[e] ? this[e] : null;
                }
                namedItem(e) {
                    for (let t = 0; t < this.length; t += 1)
                        if (this[t].id === e || this[t].name === e) return this[t];
                    return null;
                }
                get toArray() {
                    return [...this];
                }
            })([...this.element.children]);
        }
    }
    class l {
        constructor(e) {
            this.element = e;
        }
        add(e) {
            this.element && (this.element.innerHTML += e);
        }
        newLine(e) {
            let t = "<br>";
            if (e > 0) {
                t = "";
                for (let n = 0; n < e; n++) t += "<br>";
            }
            this.add(t);
        }
        checkBox(e) {
            let t = '<input type="checkbox"';
            e.id && (t += ` id="${e.id}"`),
                e.style && (t += ` style="${String(e.style).replaceAll('"', "&quot;")}"`),
                e.class && (t += ` class="${e.class}"`),
                e.checked && (t += " checked"),
                (t += ">"),
                this.add(t);
        }
        text(e) {
            let t = '<input type="text"';
            e.id && (t += ` id="${e.id}"`),
                e.style && (t += ` style="${String(e.style).replaceAll('"', "&quot;")}"`),
                e.class && (t += ` class="${e.class}"`),
                e.size && (t += ` size="${e.size}"`),
                e.maxLength && (t += ` maxLength="${e.maxLength}"`),
                e.value && (t += ` value="${e.value}"`),
                e.placeHolder && (t += ` placeHolder="${e.placeHolder}"`),
                (t += ">"),
                this.add(t);
        }
        select(e) {
            let t = "<select";
            e.id && (t += ` id="${e.id}"`),
                e.style && (t += ` style="${String(e.style).replaceAll('"', "&quot;")}"`),
                e.class && (t += ` class="${e.class}"`),
                (t += ">");
            for (const n in e.option) {
                const o = e.option[n];
                t += `<option value="${o.id}"${o.selected ? " selected" : ""}>${n}</option>`;
            }
            (t += "</select>"), this.add(t);
        }
        button(e) {
            let t = "<button";
            e.id && (t += ` id="${e.id}"`),
                e.style && (t += ` style="${String(e.style).replaceAll('"', "&quot;")}"`),
                e.class && (t += ` class="${e.class}"`),
                (t += ">"),
                e.innerHTML && (t += e.innerHTML),
                (t += "</button>"),
                this.add(t);
        }
    }
    class d {
        constructor() {
            (this.element = null),
                (this.action = null),
                (this.divElement = null),
                (this.startDiv = function (e, t) {
                    const n = document.createElement("div");
                    e.id && (n.id = e.id),
                        e.style && (n.style = e.style),
                        e.class && (n.className = e.class),
                        this.element.appendChild(n),
                        (this.divElement = n);
                    const o = new l(n);
                    "function" == typeof t && t(o);
                }),
                (this.addDiv = function (e, n) {
                    const o = document.createElement("div");
                    e.id && (o.id = e.id),
                        e.style && (o.style = e.style),
                        e.class && (o.className = e.class),
                        e.appendID && t(e.appendID).appendChild(o),
                        (this.divElement = o);
                    const s = new l(o);
                    "function" == typeof n && n(s);
                });
        }
        set(e) {
            (this.element = t(e)), (this.action = new l(this.element));
        }
        resetHTML() {
            this.element.innerHTML = "";
        }
        setStyle(e) {
            this.element.style = e;
        }
        setCSS(e) {
            this.action.add("<style>" + e + "</style>");
        }
    }
    class c {
        constructor(e, t) {
            (this.name = e || "Entity"),
                (this.root = t || window),
                (this.state = {}),
                (this.modules = {}),
                (this.flags = { initialized: !1, running: !1 }),
                (this.events = {});
        }
        setState(e, t) {
            return (this.state[e] = t), t;
        }
        getState(e, t) {
            return void 0 !== this.state[e] ? this.state[e] : t;
        }
        registerModule(e, t) {
            return e ? ((this.modules[e] = t), t) : null;
        }
        getModule(e) {
            return this.modules[e] || null;
        }
        on(e, t) {
            return e && "function" == typeof t
                ? (this.events[e] || (this.events[e] = []),
                  this.events[e].push(t),
                  () => {
                      this.events[e] = (this.events[e] || []).filter((e) => e !== t);
                  })
                : () => {};
        }
        emit(e, t) {
            const n = this.events[e] || [];
            for (let o = 0; o < n.length; o++)
                try {
                    n[o](t, this);
                } catch (t) {
                    console.error(`[${this.name}] emit error:`, e, t);
                }
        }
        init() {
            (this.flags.initialized = !0), this.emit("init", { at: Date.now() });
        }
        start() {
            this.flags.initialized || this.init(),
                (this.flags.running = !0),
                this.emit("start", { at: Date.now() });
        }
        stop() {
            (this.flags.running = !1), this.emit("stop", { at: Date.now() });
        }
    }
    class h {
        constructor(e) {
            (this.sid = null == e ? null : e),
                (this.id = null),
                (this.name = null),
                (this.team = null),
                (this.skinColor = 0),
                (this.skinIndex = 0),
                (this.tailIndex = 0),
                (this.iconIndex = 0),
                (this.weaponIndex = 0),
                (this.weaponVariant = 0),
                (this.buildIndex = -1),
                (this.zIndex = 0),
                (this.x = 0),
                (this.y = 0),
                (this.x2 = 0),
                (this.y2 = 0),
                (this.dir = 0),
                (this.scale = 35),
                (this.health = 100),
                (this.oldHealth = 100),
                (this.maxHealth = 100),
                (this.alive = !0),
                (this.active = !0),
                (this.visible = !1),
                (this.items = []),
                (this.weapons = [0, 0]),
                (this.primaryIndex = 0),
                (this.secondaryIndex = 0),
                (this.itemCounts = { 0: 0, 1: 0, 2: 0, 3: 0 }),
                (this.reloads = {
                    0: 0,
                    1: 0,
                    2: 0,
                    3: 0,
                    4: 0,
                    5: 0,
                    6: 0,
                    7: 0,
                    8: 0,
                    9: 0,
                    10: 0,
                    11: 0,
                    12: 0,
                    13: 0,
                    14: 0,
                    15: 0,
                    53: 0,
                }),
                (this.lastSeenAt = 0),
                (this.shameActive = !1),
                (this.shameTransitions = 0),
                (this.lastShameAt = 0),
                (this.lastShameClearAt = 0);
        }
        updateShame(e, t) {
            45 !== e && 45 === t
                ? ((this.shameActive = !0),
                  (this.shameTransitions += 1),
                  (this.lastShameAt = Date.now()))
                : 45 === e &&
                  45 !== t &&
                  ((this.shameActive = !1), (this.lastShameClearAt = Date.now()));
        }
        applyTuple(e, t) {
            const n = t || 0,
                o = this.skinIndex;
            (this.sid = e[n + 0]),
                (this.x = e[n + 1]),
                (this.y = e[n + 2]),
                (this.x2 = e[n + 1]),
                (this.y2 = e[n + 2]),
                (this.dir = e[n + 3]),
                (this.buildIndex = e[n + 4]),
                (this.weaponIndex = e[n + 5]),
                (this.weaponVariant = e[n + 6]),
                (this.team = e[n + 7]),
                (this.isLeader = e[n + 8]),
                (this.skinIndex = e[n + 9]),
                (this.tailIndex = e[n + 10]),
                (this.iconIndex = e[n + 11]),
                (this.zIndex = e[n + 12]),
                (this.visible = !0),
                (this.active = !0),
                (this.alive = !0),
                (this.lastSeenAt = Date.now()),
                this.updateShame(o, this.skinIndex);
        }
        applyHealth(e) {
            "number" == typeof e && ((this.oldHealth = this.health), (this.health = e));
        }
        setReload(e, t) {
            null != e && (this.reloads[e] = "number" == typeof t ? t : 0);
        }
    }
    class u {
        constructor(e, t) {
            (this.root = e || window),
                (this.game = t || null),
                (this.mySid = null),
                (this.wsHooked = !1),
                (this.boundSockets = new WeakSet()),
                (this.boundKnownPoll = null),
                (this.spawnUiApplied = !1),
                (this.weaponNames = {
                    0: "tool-hands",
                    1: "hand_axe",
                    2: "great_axe",
                    3: "short_sword",
                    4: "katana",
                    5: "polearm",
                    6: "bat",
                    7: "daggers",
                    8: "stick",
                    9: "hunting_bow",
                    10: "great_hammer",
                    11: "wooden_shield",
                    12: "crossbow",
                    13: "repeater_crossbow",
                    14: "mc_grabby",
                    15: "musket",
                    53: "turret",
                });
        }
        getWeaponName(e) {
            return this.weaponNames[e] || "weapon_" + String(e);
        }
        logReloadUpdate(e, t, n) {
            const o = Number(e),
                s = this.getWeaponName(o);
            console.log("[ReloadUpdate]", { source: n || "N", id: o, name: s, reload: t });
        }
        applySpawnUiOnce() {
            if (this.spawnUiApplied) return;
            const e = this.game && this.game.modules ? this.game.modules.ui : null;
            e &&
                "function" == typeof e.styleGameUI_NoBars &&
                (e.styleGameUI_NoBars(),
                (this.spawnUiApplied = !0),
                console.log("[NozoSingle] applied game UI styles on first spawn"));
        }
        ensurePlayer(e) {
            if (!this.game) return null;
            let t = this.game.getState("player", null);
            return (
                t instanceof h ||
                    ((t = new h(e)), this.game.setState("player", t), (this.game.player = t)),
                null != e && null == t.sid && (t.sid = e),
                t
            );
        }
        handlePacket(e, t) {
            const n = this.ensurePlayer(this.mySid);
            if (!n) return;
            const o = this[e];
            if ("function" == typeof o)
                return (
                    console.log(`[Packet] Handled type: ${e}`, { data: t }), void o.call(this, n, t)
                );
            console.log(`[Packet] Missing type: ${e}`, { data: t });
        }
        _norm(e, t) {
            const n = Array.isArray(e) ? e : [e];
            return t ? n : 1 === n.length && Array.isArray(n[0]) ? n[0] : n;
        }
        C(e, t) {
            const n = this._norm(t, !1)[0];
            null != n && ((this.mySid = n), (e.sid = n));
        }
        a(e, t) {
            const n = this._norm(t, !0),
                o = Array.isArray(n[0]) ? n[0] : n;
            for (let t = 0; t + 13 <= o.length; t += 13) {
                const n = o[t];
                if (null != this.mySid && n === this.mySid) {
                    e.applyTuple(o, t), this.applySpawnUiOnce();
                    break;
                }
            }
        }
        O(e, t) {
            const n = this._norm(t, !1),
                o = n[0],
                s = n[1];
            null != this.mySid && o === this.mySid && e.applyHealth(s);
        }
        N(e, t) {
            const n = this._norm(t, !1),
                o = n[0],
                s = n[1],
                i =
                    "number" == typeof o
                        ? o
                        : "string" != typeof o || "" === o.trim() || Number.isNaN(Number(o))
                          ? null
                          : Number(o);
            if (null != i)
                return (
                    e.setReload(i, s),
                    void this.logReloadUpdate(
                        i,
                        s,
                        "number" == typeof o ? "N:number" : "N:numeric-string",
                    )
                );
            if (o && "__proto__" !== o && "constructor" !== o && "prototype" !== o)
                if ("reloads" === o && s && "object" == typeof s) {
                    e.reloads = Object.assign({}, e.reloads, s);
                    const t = Object.keys(s);
                    for (let e = 0; e < t.length; e++) {
                        const n = t[e];
                        this.logReloadUpdate(n, s[n], "N:reloads");
                    }
                } else
                    (e[o] = s),
                        console.log("[N:updatePlayerValue:non-reload]", {
                            key: o,
                            value: s,
                            all: n,
                        });
        }
        V(e, t) {
            const n = this._norm(t, !1),
                o = n[0],
                s = !!n[1];
            Array.isArray(o) &&
                (s
                    ? ((e.weapons = o.slice()),
                      (e.primaryIndex = e.weapons[0] || 0),
                      (e.secondaryIndex = e.weapons[1] || 0))
                    : (e.items = o.slice()));
        }
        S(e, t) {
            const n = this._norm(t, !1);
            2 === n.length && "number" == typeof n[0]
                ? (e.itemCounts[n[0]] = n[1])
                : (e.itemCounts = n);
        }
        getMsgpack() {
            const e = this.root || window,
                t = "undefined" != typeof unsafeWindow ? unsafeWindow : null,
                n = [
                    e && e.msgpack,
                    t && t.msgpack,
                    "undefined" != typeof window ? window.msgpack : null,
                    "undefined" != typeof document ? document.msgpack : null,
                    e && e.NozoSingle && e.NozoSingle.msgpack,
                ];
            for (let t = 0; t < n.length; t++) {
                const o = n[t];
                if (o && "function" == typeof o.decode && "function" == typeof o.encode)
                    return e && !e.msgpack && (e.msgpack = o), o;
            }
            return null;
        }
        decodePacket(e) {
            const t = this.getMsgpack();
            if (!t || "function" != typeof t.decode) return null;
            if (!e) return null;
            try {
                const n = t.decode(new Uint8Array(e));
                if (!Array.isArray(n) || n.length < 2) return null;
                const o = n[0],
                    s = n[1];
                return { type: o, data: s, args: Array.isArray(s) ? s : [s] };
            } catch (e) {
                return null;
            }
            return null;
        }
        dispatchRawMessage(e) {
            const t = this.decodePacket(e);
            return (
                !(!t || null == t.type) &&
                ("io-init" === t.type || this.handlePacket(t.type, t.data), !0)
            );
        }
        bindSocket(e) {
            if (!e || this.boundSockets.has(e)) return;
            this.boundSockets.add(e);
            try {
                e.binaryType = "arraybuffer";
            } catch (e) {}
            const t = this;
            e.addEventListener("message", async function (e) {
                if (t.dispatchRawMessage(e && e.data)) return;
                const n = e && e.data;
                if (n && "function" == typeof n.arrayBuffer)
                    try {
                        const e = await n.arrayBuffer();
                        t.dispatchRawMessage(e);
                    } catch (e) {}
            });
        }
        bindKnownSockets() {
            const e = this;
            if (this.boundKnownPoll) return;
            let t = 0;
            this.boundKnownPoll = setInterval(function () {
                t++;
                const n = [e.root && e.root.WS, e.root && e.root.ws];
                for (let t = 0; t < n.length; t++) {
                    const o = n[t];
                    o && "function" == typeof o.addEventListener && e.bindSocket(o);
                }
                t >= 240 && (clearInterval(e.boundKnownPoll), (e.boundKnownPoll = null));
            }, 250);
        }
        bindWsHook() {
            if (this.wsHooked) return;
            const e = this.root.WebSocket;
            if (!e) return;
            const t = this;
            function n(n, o) {
                const s = void 0 !== o ? new e(n, o) : new e(n);
                return t.bindSocket(s), s;
            }
            (n.prototype = e.prototype),
                Object.setPrototypeOf(n, e),
                (this.root.WebSocket = n),
                (this.wsHooked = !0);
        }
        init() {
            this.ensurePlayer(null), this.bindWsHook(), this.bindKnownSockets();
        }
    }
    class p {
        constructor(e) {
            (this.root = e || window),
                (this.items2 = {
                    1: "8",
                    2: "17",
                    3: "31",
                    4: "23",
                    5: "10",
                    6: "38",
                    7: "28",
                    8: "25",
                }),
                (this.selects = []),
                (this.info2 = {}),
                (this.refs = {}),
                (this.ids = {
                    hand_axe: 1,
                    great_axe: 2,
                    short_sword: 3,
                    katana: 4,
                    polearm: 5,
                    bat: 6,
                    daggers: 7,
                    stick: 8,
                    hunting_bow: 9,
                    great_hammer: 10,
                    wooden_shield: 11,
                    crossbow: 12,
                    repeater_crossbow: 13,
                    mc_grabby: 14,
                    musket: 15,
                    cookie: 17,
                    cheese: 18,
                    stonewall: 20,
                    castle_wall: 21,
                    greater_spike: 23,
                    poison_spike: 24,
                    spining_spike: 25,
                    fast_mill: 28,
                    power_mill: 28,
                    mine: 29,
                    sapling: 30,
                    trap: 31,
                    boost: 32,
                    turret: 33,
                    platform: 34,
                    healing_pad: 35,
                    spawnpad: 36,
                    blocker: 37,
                    teleport: 38,
                }),
                (this.ranged = [
                    this.ids.crossbow,
                    this.ids.repeater_crossbow,
                    this.ids.musket,
                    this.ids.hunting_bow,
                ]),
                (this.ageMap = {
                    1: { hand_axe: 1, short_sword: 3, polearm: 5, daggers: 7, stick: 8, bat: 6 },
                    2: { cookie: 17, stonewall: 20 },
                    3: { trap: 31, boost: 32 },
                    4: { greater_spike: 23, mine: 29, sapling: 30, fast_mill: 27 },
                    5: { hunting_bow: 9, great_hammer: 10, mc_grabby: 14, wooden_shield: 11 },
                    6: {
                        cheese: 18,
                        castle_wall: 21,
                        turret: 33,
                        platform: 34,
                        healing_pad: 35,
                        blocker: 37,
                        teleport: 38,
                    },
                    7: { great_axe: 2, crossbow: 12, katana: 4, power_mill: 28 },
                    8: {
                        repeater_crossbow: 13,
                        musket: 15,
                        poison_spike: 24,
                        spining_spike: 25,
                        spawnpad: 36,
                    },
                });
        }
        get currentWeapons() {
            return Array.isArray(this.root.weapons) ? this.root.weapons : [];
        }
        save() {
            try {
                return (localStorage.items2 = JSON.stringify(this.items2)), !0;
            } catch (e) {
                return console.warn("[LoadoutManager] save failed", e), !1;
            }
        }
        load() {
            try {
                if (!localStorage.items2) return !1;
                const e = JSON.parse(localStorage.items2);
                return !(!e || "object" != typeof e) && ((this.items2 = e), !0);
            } catch (e) {
                return console.warn("[LoadoutManager] load failed", e), !1;
            }
        }
        validatePath(e, n) {
            const o = String(e);
            if (this.ranged.includes(n)) {
                if (String(this.items2[5]) !== String(this.ids.hunting_bow)) {
                    this.items2[5] = String(this.ids.hunting_bow);
                    const e = t("sel5");
                    e && (e.value = String(this.ids.hunting_bow));
                }
                if (String(this.items2[7]) !== String(this.ids.crossbow)) {
                    this.items2[7] = String(this.ids.crossbow);
                    const e = t("sel7");
                    e && (e.value = String(this.ids.crossbow));
                }
            }
            if (n === this.ids.katana && String(this.items2[1]) !== String(this.ids.short_sword)) {
                this.items2[1] = String(this.ids.short_sword);
                const e = t("sel1");
                e && (e.value = String(this.ids.short_sword));
            }
            if (n === this.ids.great_axe && String(this.items2[1]) !== String(this.ids.hand_axe)) {
                this.items2[1] = String(this.ids.hand_axe);
                const e = t("sel1");
                e && (e.value = String(this.ids.hand_axe));
            }
            return this.save(), o;
        }
        hydrateFromWeaponsList() {
            const e = this.currentWeapons;
            if (e.length)
                for (let t = 0; t < e.length; t++) {
                    const n = e[t];
                    if (!n || !n.age || !n.name) continue;
                    const o = Number(n.age) - 1,
                        s = String(n.name).split(" ").join("_");
                    this.ageMap[o] || (this.ageMap[o] = {}), (this.ageMap[o][s] = n.id);
                }
        }
        buildLoadoutUI(e) {
            if (!e || t("nozoLoadouts")) return;
            const n = document.createElement("div");
            (n.id = "nozoLoadouts"),
                (n.style.cssText =
                    "margin-top:8px;padding:8px;border:1px solid rgba(255,255,255,.14);border-radius:8px;background:rgba(0,0,0,.18);");
            const o = document.createElement("div");
            (o.textContent = "Loadouts"),
                (o.style.cssText = "font-weight:700;margin-bottom:6px;"),
                n.appendChild(o);
            for (const e of Object.keys(this.ageMap)) {
                const t = document.createElement("div");
                t.style.cssText = "display:flex;gap:8px;align-items:center;margin:4px 0;";
                const o = document.createElement("span");
                (o.textContent = `Age ${e}:`), (o.style.cssText = "min-width:52px;font-size:12px;");
                const s = document.createElement("select");
                (s.id = "sel" + e),
                    (s.dataset.age = String(e)),
                    (s.style.cssText =
                        "flex:1;background:rgba(255,255,255,.08);color:#fff;border:1px solid rgba(255,255,255,.18);border-radius:6px;");
                const i = this.ageMap[e] || {};
                for (const e of Object.keys(i)) {
                    const t = document.createElement("option");
                    (t.value = String(i[e])),
                        (t.textContent = e),
                        (t.style.color = "#fff"),
                        (t.style.backgroundColor = "#1b2230"),
                        s.appendChild(t);
                }
                (s.style.color = "#fff"),
                    (s.style.background = "rgba(20,24,32,.95)"),
                    (s.style.border = "1px solid rgba(255,255,255,.18)"),
                    null != this.items2[e] && (s.value = String(this.items2[e])),
                    !s.value && s.options.length && (s.selectedIndex = 0),
                    (this.items2[e] = s.value),
                    this.selects.push([e, s]),
                    s.addEventListener("change", (e) => {
                        const t = e.target.dataset.age,
                            n = Number(e.target.value);
                        (this.items2[t] = String(e.target.value)), this.validatePath(t, n);
                    }),
                    t.appendChild(o),
                    t.appendChild(s),
                    n.appendChild(t);
            }
            e.appendChild(n), this.save();
        }
        getCurrentRegionBrowser() {
            const e = this.root.serverBrowser;
            return e && e.children && e.children[0] ? e.children[0] : null;
        }
        getCurrentServerInfo(e) {
            if (!e || !e.selectedOptions || !e.selectedOptions[0]) return null;
            const t = e.selectedOptions[0],
                n = String(t.innerText || "").split(" ");
            return { name: n[0] || "", id: t.value || "", index: n[1] || "" };
        }
        NewServer() {
            const e = this.getCurrentRegionBrowser();
            if (!e) return null;
            const t = this.getCurrentServerInfo(e);
            if (!t || !t.id) return null;
            const n = [];
            if (
                ([...e.children].forEach((e) => {
                    const o = String(e.innerText || ""),
                        s = o.includes("[") ? o.split("[").pop().split("]")[0] : "",
                        i = Number(s.split("/")[0] || "0"),
                        r = e.value;
                    String(r || "").split(":")[0] === String(t.id).split(":")[0] &&
                        n.push({ a: i, b: r, e: e });
                }),
                !n.length)
            )
                return null;
            const o = n.sort((e, t) => t.a - e.a).find((e) => Number(e.a) < 40);
            if (!o) return null;
            const s = String(o.b).split(":");
            s[1] = String(Number(s[1]) + 1);
            const i = s.join(":"),
                r = new URL(location.href);
            return r.searchParams.set("server", i), (location.href = r.toString()), i;
        }
        buildGuideButtons(e) {
            if (!e || t("nozoGuideBtns")) return;
            const n = document.createElement("div");
            (n.id = "nozoGuideBtns"),
                (n.style.cssText = "margin-top:8px;display:flex;flex-wrap:wrap;gap:6px;");
            const o = (e, t) => {
                const o = document.createElement("button");
                (o.textContent = e),
                    (o.style.cssText =
                        "padding:6px 9px;border-radius:7px;border:1px solid rgba(255,255,255,.16);background:rgba(255,255,255,.08);color:#fff;cursor:pointer;"),
                    o.addEventListener("click", t),
                    n.appendChild(o);
            };
            o("New Server", () => this.NewServer()),
                o("Load Layout", () => {
                    this.load(),
                        this.selects.forEach(([e, t]) => {
                            null != this.items2[e] && (t.value = String(this.items2[e]));
                        });
                }),
                o("Save Layout", () => this.save()),
                e.appendChild(n);
        }
        exposeGlobals() {
            (this.root.selects = this.selects),
                (this.root.items2 = this.items2),
                (this.root.info2 = this.info2),
                (this.root.spikes = [25, 23, 24, 6, 7, 9]),
                (this.root.NewServer = this.NewServer.bind(this)),
                (this.info2.ageitems = this.ageMap),
                (this.info2.ageitems[0] = { wood_wall: 19, spike: 6, windmill: 10 });
        }
        mount() {
            const e = this.root.setupCard || t("setupCard"),
                n = this.root.guideCard || t("guideCard");
            return (
                !(!e && !n) &&
                (this.load(),
                this.hydrateFromWeaponsList(),
                this.injectLoadoutSelectCSS(),
                e && this.buildLoadoutUI(e),
                n && this.buildGuideButtons(n),
                this.exposeGlobals(),
                !0)
            );
        }
        injectLoadoutSelectCSS() {
            if (document.getElementById("nozoLoadoutSelectCSS")) return;
            const e = document.createElement("style");
            (e.id = "nozoLoadoutSelectCSS"),
                (e.textContent =
                    "\n      #nozoLoadouts select { color:#fff; background:#1b2230; border:1px solid rgba(255,255,255,.18); }\n      #nozoLoadouts select option { color:#fff; background:#1b2230; }\n    "),
                document.head.appendChild(e);
        }
    }
    class m {
        constructor(e, t) {
            (this.root = e || window),
                (this.game = t || null),
                (this.boundTokenFlow = !1),
                (this.token = null),
                (this.server = null);
        }
        getApiBase() {
            const e = (this.root.location && this.root.location.hostname) || "";
            return "sandbox-dev.moomoo.io" === e || "sandbox.moomoo.io" === e
                ? "https://api-sandbox.moomoo.io"
                : "dev.moomoo.io" === e || "dev2.moomoo.io" === e
                  ? "https://api-dev.moomoo.io"
                  : "https://api.moomoo.io";
        }
        getServerParam() {
            const e = new URLSearchParams(
                (this.root.location && this.root.location.search) || "",
            ).get("server");
            if (!e || -1 === e.indexOf(":")) return null;
            const t = e.split(":");
            return t.length < 2 ? null : { raw: e, region: t[0], name: t[1] };
        }
        refreshServerContext() {
            const e = this.getServerParam();
            return e
                ? ((this.server = e),
                  this.game &&
                      (this.game.setState("serverParam", e.raw),
                      this.game.setState("region", e.region),
                      this.game.setState("name", e.name),
                      this.game.setState("In", e.raw)),
                  e)
                : null;
        }
        setToken(e, t) {
            return (
                !!e &&
                ((this.token = e),
                (this.root.token = e),
                this.game &&
                    (this.game.setState("token", e),
                    this.game.emit("token", { token: e, source: t || "unknown" })),
                !0)
            );
        }
        bindTokenFlow() {
            if (this.boundTokenFlow) return;
            (this.boundTokenFlow = !0), this.refreshServerContext();
            const e = this.root.document.getElementById("altcha");
            e &&
                e.addEventListener &&
                e.addEventListener("statechange", (e) => {
                    const t = e && e.detail ? e.detail : {};
                    if ("verified" !== t.state) return;
                    this.refreshServerContext(), this.setToken(t.payload, "altcha:verified");
                    const n = this.root.document.getElementById("wideAdCard");
                    n && ((n.style.maxWidth = "1056.95px"), (n.style.height = "300px"));
                    const o = this.root.document.getElementById("enterGame");
                    setTimeout(() => {
                        if (o && o.classList && o.classList.contains("disabled"))
                            this.root.location.reload();
                        else if (
                            0 === (this.root.name || "").indexOf("authWindow-") &&
                            this.root.opener &&
                            this.root.opener.postMessage
                        ) {
                            const e = (this.root.name || "").replace("authWindow-", "");
                            this.root.opener.postMessage(
                                { type: "TOKEN", id: e, token: t.payload },
                                "*",
                            ),
                                this.root.close();
                        }
                    }, 500);
                });
            const t = this.root.document.getElementById("altcha_checkbox");
            t &&
                !t.checked &&
                t.click &&
                setTimeout(() => {
                    t.checked || t.click();
                }, 1e3);
        }
        async getToken() {
            for (this.bindTokenFlow(); !this.token && !this.root.token; )
                await new Promise((e) => setTimeout(e, 50));
            return (
                this.refreshServerContext(),
                { token: this.token || this.root.token, In: this.server ? this.server.raw : null }
            );
        }
        async findServer(e) {
            if (!e) return null;
            const t = this.getApiBase(),
                n = await fetch(t + "/servers?v=1.26");
            if (!n.ok) return null;
            const o = await n.json();
            return (
                (Array.isArray(o) &&
                    o.find((t) => t && t.region === e.region && t.name === e.name)) ||
                null
            );
        }
        async run() {
            try {
                const e = this.getServerParam(),
                    t = await this.getToken(),
                    n = await this.findServer(e);
                return (
                    this.game &&
                        (this.game.setState("bootstrap", {
                            server: n,
                            token: t.token,
                            In: t.In,
                            at: Date.now(),
                        }),
                        this.game.emit("bootstrap:ready", { server: n, token: t.token, In: t.In })),
                    { server: n, token: t.token, In: t.In }
                );
            } catch (e) {
                return (
                    console.error("[BootstrapManager] run failed:", e),
                    this.game && this.game.emit("bootstrap:error", e),
                    null
                );
            }
        }
    }
    function g() {
        if (t("nozoDummyMenu")) return;
        const n = document.createElement("div");
        (n.id = "nozoDummyMenu"),
            (n.style.cssText = [
                "position:fixed",
                "top:16px",
                "left:16px",
                "z-index:99999",
                "width:220px",
                "padding:10px",
                "border-radius:8px",
                "background:rgba(0,0,0,.72)",
                "color:#fff",
                "font:12px monospace",
                "box-shadow:0 2px 10px rgba(0,0,0,.45)",
            ].join(";")),
            (n.innerHTML = [
                '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">',
                "<b>Nozo Dummy</b>",
                '<button id="nozoDummyClose" style="background:none;border:none;color:#fff;cursor:pointer;">x</button>',
                "</div>",
                '<label style="display:flex;gap:6px;align-items:center;margin-bottom:6px;"><input id="nozoDummyRender" type="checkbox" checked>Render</label>',
                '<label style="display:flex;gap:6px;align-items:center;margin-bottom:6px;"><input id="nozoDummyCombat" type="checkbox">Combat</label>',
                '<label style="display:flex;gap:6px;align-items:center;"><input id="nozoDummyMove" type="checkbox">Movement</label>',
                '<div id="nozoShameInfo" style="margin-top:8px;padding-top:6px;border-top:1px solid rgba(255,255,255,.14);font-size:11px;line-height:1.35;">Shame: --</div>',
            ].join("")),
            document.body.appendChild(n);
        const o = t("nozoDummyClose");
        o &&
            o.addEventListener("click", function () {
                const e = Number(n.dataset.shameTimer || 0);
                e && clearInterval(e), n.remove();
            });
        const s = function () {
            const n = t("nozoShameInfo");
            if (!n) return;
            const o = e.NozoSingle && e.NozoSingle.game ? e.NozoSingle.game.player : null;
            if (!o) return void (n.textContent = "Shame: --");
            const s = o.shameActive ? "ON" : "OFF",
                i = Number(o.shameTransitions || 0);
            n.textContent = `Shame: ${s} | count: ${i}`;
        };
        s();
        const i = setInterval(s, 200);
        n.dataset.shameTimer = String(i);
    }
    function f(e, t) {
        const n = document.querySelector(e);
        return !!n && (Object.assign(n.style, t), !0);
    }
    function b(e, t) {
        const n = document.querySelectorAll(e);
        return n.length ? (n.forEach((e) => Object.assign(e.style, t)), n.length) : 0;
    }
    function y(e, t) {
        const n = document.querySelector(e);
        return !!n && ((n.textContent = t), !0);
    }
    function x(e, t, n) {
        const o = document.querySelectorAll(e);
        let s = 0;
        return (
            o.forEach((e) => {
                (e.textContent || "").includes(t) &&
                    ((e.textContent = (e.textContent || "").replace(t, n)), s++);
            }),
            s
        );
    }
    function w() {
        const e = document.querySelector("#mainMenu"),
            t = document.querySelector("#menuContainer");
        if (!e || !t) return !1;
        const n = {
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
            width: "100%",
            background: "linear-gradient(180deg, rgba(8,12,18,.50), rgba(8,12,18,.35))",
        };
        return (
            "none" !== getComputedStyle(e).display && (n.display = "flex"),
            f("#mainMenu", n),
            f("#menuContainer", { width: "min(1120px, 96vw)", margin: "0 auto", padding: "14px" }),
            f("#menuCardHolder", {
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: "12px",
                alignItems: "start",
            }),
            b("#menuCardHolder .menuCard", {
                background: "rgba(15,22,32,.82)",
                border: "1px solid rgba(255,255,255,.08)",
                borderRadius: "10px",
                boxShadow: "0 6px 24px rgba(0,0,0,.28)",
                color: "#e8edf7",
            }),
            f("#adCard", { display: "", overflow: "hidden" }),
            f("#wideAdCard", {
                display: "",
                marginTop: "12px",
                background: "rgba(15,22,32,.82)",
                border: "1px solid rgba(255,255,255,.08)",
                borderRadius: "10px",
                boxShadow: "0 6px 24px rgba(0,0,0,.28)",
            }),
            f("#nameInput", {
                background: "rgba(255,255,255,.08)",
                border: "1px solid rgba(255,255,255,.18)",
                color: "#fff",
                borderRadius: "8px",
                outline: "none",
            }),
            f("#enterGame", {
                borderRadius: "9px",
                border: "1px solid rgba(0,0,0,.22)",
                boxShadow: "0 4px 14px rgba(0,0,0,.24)",
                fontWeight: "700",
            }),
            b(".menuHeader", { color: "#f2f6ff" }),
            b(".menuText", { color: "rgba(230,236,248,.92)" }),
            console.log("[themeMainMenuCentered] applied"),
            !0
        );
    }
    function S() {
        f("#bottomContainer", { background: "transparent", border: "none", boxShadow: "none" }),
            f("#actionBar", { background: "transparent", border: "none", boxShadow: "none" }),
            f("#topInfoHolder", { background: "transparent", border: "none", boxShadow: "none" }),
            f("#leaderboard", { background: "transparent", border: "none", boxShadow: "none" }),
            f("#resDisplay", { background: "transparent", border: "none", boxShadow: "none" }),
            b(".resourceDisplay", {
                background: "rgba(10,14,22,.58)",
                border: "1px solid rgba(255,255,255,.10)",
                borderRadius: "8px",
                color: "#eaf1ff",
                padding: "4px 8px",
            }),
            b(".actionBarItem", {
                borderRadius: "6px",
                border: "1px solid rgba(255,255,255,.12)",
                boxShadow: "inset 0 0 0 1px rgba(0,0,0,.18)",
            }),
            f("#chatBox", {
                background: "rgba(0,0,0,.45)",
                border: "1px solid rgba(255,255,255,.16)",
                borderRadius: "8px",
                color: "#fff",
                padding: "6px 10px",
            }),
            b("#allianceButton, #leaderboardButton, #storeButton, #chatButton", {
                background: "rgba(10,14,22,.72)",
                border: "1px solid rgba(255,255,255,.12)",
                borderRadius: "10px",
                color: "#eaf1ff",
            }),
            f("#ageBarContainer", {
                background: "rgba(0,0,0,.28)",
                border: "1px solid rgba(255,255,255,.10)",
                borderRadius: "8px",
            }),
            f("#ageBarBody", { background: "linear-gradient(90deg,#80d24d,#b9f170)" }),
            b(".leaderboardItem", { color: "#dfe8ff" }),
            b(".leaderScore", { color: "#9ec2ff" });
    }
    y("#gameName", "NOZO NEXT"),
        y("#loadingText", "Loading modules..."),
        y("#enterGame", "Play"),
        document.getElementById("leaderboard").append("Nozo-Mod"),
        x(".menuHeader", "SETTINGS", "Preferences"),
        (function () {
            let e = 0;
            const t = setInterval(function () {
                e++, w();
                const n = document.getElementById("enterGame");
                (!(!n || (n.classList && n.classList.contains("disabled"))) || e >= 240) &&
                    clearInterval(t);
            }, 500);
        })();
    const k = new c("NozoSingleGame", e);
    k.registerModule("dom", {
        getEl: t,
        styleOne: f,
        styleAll: b,
        setText: y,
        setHTML: function (e, t) {
            const n = document.querySelector(e);
            return !!n && ((n.innerHTML = t), !0);
        },
        replaceTextContains: x,
    }),
        k.registerModule("ui", {
            element: a,
            HtmlAction: l,
            Html: d,
            mountDummyMenu: g,
            themeMainMenuCentered: w,
            styleGameUI_NoBars: S,
        });
    const v = new p(e),
        C = new m(e, k),
        _ = new u(e, k);
    k.registerModule("loadouts", v),
        k.registerModule("bootstrap", C),
        k.registerModule("player", _),
        k.registerModule("config", { get: () => s(), sync: () => s(), raw: n }),
        k.registerModule("configs", {
            get: () => r(),
            set: (e) => {
                const t = i(e);
                return k.setState("configs", t), t;
            },
            raw: o,
        }),
        k.setState("readyAt", Date.now()),
        k.setState("config", s()),
        k.setState("configs", r()),
        k.start(),
        _.init(),
        (function (e) {
            let t = 0;
            const n = setInterval(() => {
                t++, (e.mount() || t >= 120) && clearInterval(n);
            }, 500);
        })(v),
        C.bindTokenFlow(),
        (e.NozoSingle = {
            Entity: c,
            Player: h,
            PlayerRuntime: u,
            game: k,
            LoadoutManager: p,
            BootstrapManager: m,
            element: a,
            HtmlAction: l,
            Html: d,
            mountDummyMenu: g,
            themeMainMenuCentered: w,
            styleGameUI_NoBars: S,
            loadouts: v,
            bootstrap: C,
            player: _,
            setConfigs: i,
            getConfigs: r,
        }),
        Object.defineProperty(e.NozoSingle, "config", {
            configurable: !0,
            enumerable: !0,
            get: function () {
                return s();
            },
        }),
        Object.defineProperty(e.NozoSingle, "configs", {
            configurable: !0,
            enumerable: !0,
            get: function () {
                return r();
            },
        }),
        (e.configs && "object" == typeof e.configs) || (e.configs = r()),
        g();
})();
