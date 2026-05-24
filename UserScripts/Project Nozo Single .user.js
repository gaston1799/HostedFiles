// ==UserScript==
// @name         Project Nozo Single
// @namespace    nozo.single
// @version      0.1.0
// @description  Single-file rewrite scaffold
// @match        *://*.moomoo.io/*
// @run-at       document-idle
// @grant        unsafeWindow
// @require      https://cdn.jsdelivr.net/gh/gaston1799/project-nozo-externals/dist/msgpack.js
// ==/UserScript==


"use strict";

const root = typeof unsafeWindow !== "undefined" ? unsafeWindow : window;

function getEl(id) {
    return document.getElementById(id);
}

// Local config bridge: starts with safe defaults and syncs from game's window.config.
const _config = {
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
    maxNameLength: 15
};

const _configs = {
    showDir: false,
    attackDir: false,
    autoPush: true,
    spikeCones: false,
    tracerGhost: true,
    debug: false,
    renderOverlay: true,
    movementAssist: false
};

function syncConfigFromWindowConfig() {
    const live = root.config;
    if (!live || typeof live !== "object") return _config;
    const keys = Object.keys(_config);
    for (let i = 0; i < keys.length; i++) {
        const k = keys[i];
        if (live[k] !== undefined) _config[k] = live[k];
    }
    return _config;
}

function setConfigs(next) {
    if (!next || typeof next !== "object") return _configs;
    const keys = Object.keys(next);
    for (let i = 0; i < keys.length; i++) {
        const k = keys[i];
        _configs[k] = next[k];
    }
    return _configs;
}

function getConfigs() {
    return _configs;
}

class element {
    static get br() {
        return new element("br");
    }
    constructor(name, obj) {
        this.element = name && name.constructor && name.constructor.name.includes("HTML")
            ? name
        : (function (tag, attrs) {
            const el = document.createElement(tag);
            const a = attrs || {};
            for (const k in a) el.setAttribute(k, a[k]);
            return el;
        })(name, obj);
    }
    style(obj) {
        for (const i in obj) this.element.style[i] = obj[i];
        return this;
    }
    append(target, ...targets) {
        this.element.append((target && target.element) || target);
        for (let i = 0; i < targets.length; i++) {
            const a = targets[i];
            this.element.append((a && a.element) || a);
        }
        return this;
    }
    appendTo(target) {
        (target && target.element
         ? target.element
         : typeof target === "string"
         ? document.querySelector(target)
         : target
        ).append(this.element);
        return this;
    }
    on(event, a) {
        this.element["on" + event] = a;
        return this;
    }
    set(prop, value) {
        this.element[prop] = value;
        return this;
    }
    remove() {
        this.element.remove();
        return this;
    }
    get(prop) {
        return this.element[prop];
    }
    get children() {
        return new (class {
            constructor(arr) {
                for (let i = 0; i < arr.length; i += 1) this[i] = arr[i];
                Object.defineProperty(this, "length", { get: () => arr.length });
                Object.freeze(this);
            }
            item(i) {
                return this[i] != null ? this[i] : null;
            }
            namedItem(name) {
                for (let i = 0; i < this.length; i += 1) {
                    if (this[i].id === name || this[i].name === name) return this[i];
                }
                return null;
            }
            get toArray() {
                return [...this];
            }
        })([...this.element.children]);
    }
}

class HtmlAction {
    constructor(elementRef) {
        this.element = elementRef;
    }
    add(code) {
        if (!this.element) return;
        this.element.innerHTML += code;
    }
    newLine(amount) {
        let result = "<br>";
        if (amount > 0) {
            result = "";
            for (let i = 0; i < amount; i++) result += "<br>";
        }
        this.add(result);
    }
    checkBox(setting) {
        let s = '<input type="checkbox"';
        setting.id && (s += ` id="${setting.id}"`);
        setting.style && (s += ` style="${String(setting.style).replaceAll('"', "&quot;")}"`);
        setting.class && (s += ` class="${setting.class}"`);
        setting.checked && (s += " checked");
        s += ">";
        this.add(s);
    }
    text(setting) {
        let s = '<input type="text"';
        setting.id && (s += ` id="${setting.id}"`);
        setting.style && (s += ` style="${String(setting.style).replaceAll('"', "&quot;")}"`);
        setting.class && (s += ` class="${setting.class}"`);
        setting.size && (s += ` size="${setting.size}"`);
        setting.maxLength && (s += ` maxLength="${setting.maxLength}"`);
        setting.value && (s += ` value="${setting.value}"`);
        setting.placeHolder && (s += ` placeHolder="${setting.placeHolder}"`);
        s += ">";
        this.add(s);
    }
    select(setting) {
        let s = "<select";
        setting.id && (s += ` id="${setting.id}"`);
        setting.style && (s += ` style="${String(setting.style).replaceAll('"', "&quot;")}"`);
        setting.class && (s += ` class="${setting.class}"`);
        s += ">";
        for (const label in setting.option) {
            const opt = setting.option[label];
            s += `<option value="${opt.id}"${opt.selected ? " selected" : ""}>${label}</option>`;
        }
        s += "</select>";
        this.add(s);
    }
    button(setting) {
        let s = "<button";
        setting.id && (s += ` id="${setting.id}"`);
        setting.style && (s += ` style="${String(setting.style).replaceAll('"', "&quot;")}"`);
        setting.class && (s += ` class="${setting.class}"`);
        s += ">";
        setting.innerHTML && (s += setting.innerHTML);
        s += "</button>";
        this.add(s);
    }
}

class Html {
    constructor() {
        this.element = null;
        this.action = null;
        this.divElement = null;
        this.startDiv = function (setting, func) {
            const newDiv = document.createElement("div");
            setting.id && (newDiv.id = setting.id);
            setting.style && (newDiv.style = setting.style);
            setting.class && (newDiv.className = setting.class);
            this.element.appendChild(newDiv);
            this.divElement = newDiv;
            const addRes = new HtmlAction(newDiv);
            typeof func === "function" && func(addRes);
        };
        this.addDiv = function (setting, func) {
            const newDiv = document.createElement("div");
            setting.id && (newDiv.id = setting.id);
            setting.style && (newDiv.style = setting.style);
            setting.class && (newDiv.className = setting.class);
            setting.appendID && getEl(setting.appendID).appendChild(newDiv);
            this.divElement = newDiv;
            const addRes = new HtmlAction(newDiv);
            typeof func === "function" && func(addRes);
        };
    }
    set(id) {
        this.element = getEl(id);
        this.action = new HtmlAction(this.element);
    }
    resetHTML() {
        this.element.innerHTML = "";
    }
    setStyle(style) {
        this.element.style = style;
    }
    setCSS(style) {
        this.action.add("<style>" + style + "</style>");
    }
}

class Entity {
    constructor(name, rootRef) {
        this.name = name || "Entity";
        this.root = rootRef || window;
        this.state = {};
        this.modules = {};
        this.flags = {
            initialized: false,
            running: false
        };
        this.events = {};
    }

    setState(key, value) {
        this.state[key] = value;
        return value;
    }

    getState(key, fallback) {
        return this.state[key] !== undefined ? this.state[key] : fallback;
    }

    registerModule(name, moduleRef) {
        if (!name) return null;
        this.modules[name] = moduleRef;
        return moduleRef;
    }

    getModule(name) {
        return this.modules[name] || null;
    }

    on(event, fn) {
        if (!event || typeof fn !== "function") return () => {};
        if (!this.events[event]) this.events[event] = [];
        this.events[event].push(fn);
        return () => {
            this.events[event] = (this.events[event] || []).filter((cb) => cb !== fn);
        };
    }

    emit(event, payload) {
        const list = this.events[event] || [];
        for (let i = 0; i < list.length; i++) {
            try {
                list[i](payload, this);
            } catch (err) {
                console.error(`[${this.name}] emit error:`, event, err);
            }
        }
    }

    init() {
        this.flags.initialized = true;
        this.emit("init", { at: Date.now() });
    }

    start() {
        if (!this.flags.initialized) this.init();
        this.flags.running = true;
        this.emit("start", { at: Date.now() });
    }

    stop() {
        this.flags.running = false;
        this.emit("stop", { at: Date.now() });
    }
}

class Player {
    constructor(sid) {
        this.sid = sid == null ? null : sid;
        this.id = null;
        this.name = null;
        this.team = null;
        this.skinColor = 0;
        this.skinIndex = 0;
        this.tailIndex = 0;
        this.iconIndex = 0;
        this.weaponIndex = 0;
        this.weaponVariant = 0;
        this.buildIndex = -1;
        this.zIndex = 0;
        this.x = 0;
        this.y = 0;
        this.x2 = 0;
        this.y2 = 0;
        this.dir = 0;
        this.scale = 35;
        this.health = 100;
        this.oldHealth = 100;
        this.maxHealth = 100;
        this.alive = true;
        this.active = true;
        this.visible = false;
        this.items = [];
        this.weapons = [0, 0];
        this.primaryIndex = 0;
        this.secondaryIndex = 0;
        this.itemCounts = { 0: 0, 1: 0, 2: 0, 3: 0 };
        this.reloads = {
            0: 0, 1: 0, 2: 0, 3: 0,
            4: 0, 5: 0, 6: 0, 7: 0,
            8: 0, 9: 0, 10: 0, 11: 0,
            12: 0, 13: 0, 14: 0, 15: 0,
            53: 0
        };
        this.lastSeenAt = 0;

        // Derived from live skin transition (45), not timer assumptions.
        this.shameActive = false;
        this.shameTransitions = 0;
        this.lastShameAt = 0;
        this.lastShameClearAt = 0;
    }

    updateShame(prevSkin, nextSkin) {
        if (prevSkin !== 45 && nextSkin === 45) {
            this.shameActive = true;
            this.shameTransitions += 1;
            this.lastShameAt = Date.now();
        } else if (prevSkin === 45 && nextSkin !== 45) {
            this.shameActive = false;
            this.lastShameClearAt = Date.now();
        }
    }

    applyTuple(tuple, offset) {
        const i = offset || 0;
        const prevSkin = this.skinIndex;
        this.sid = tuple[i + 0];
        this.x = tuple[i + 1];
        this.y = tuple[i + 2];
        this.x2 = tuple[i + 1];
        this.y2 = tuple[i + 2];
        this.dir = tuple[i + 3];
        this.buildIndex = tuple[i + 4];
        this.weaponIndex = tuple[i + 5];
        this.weaponVariant = tuple[i + 6];
        this.team = tuple[i + 7];
        this.isLeader = tuple[i + 8];
        this.skinIndex = tuple[i + 9];
        this.tailIndex = tuple[i + 10];
        this.iconIndex = tuple[i + 11];
        this.zIndex = tuple[i + 12];
        this.visible = true;
        this.active = true;
        this.alive = true;
        this.lastSeenAt = Date.now();
        this.updateShame(prevSkin, this.skinIndex);
    }

    applyHealth(v) {
        if (typeof v !== "number") return;
        this.oldHealth = this.health;
        this.health = v;
    }

    setReload(index, value) {
        if (index == null) return;
        this.reloads[index] = typeof value === "number" ? value : 0;
    }
}

class PlayerRuntime {
    constructor(rootRef, gameEntity) {
        this.root = rootRef || window;
        this.game = gameEntity || null;
        this.mySid = null;
        this.wsHooked = false;
        this.boundSockets = new WeakSet();
        this.boundKnownPoll = null;
        this.spawnUiApplied = false;
        this.weaponNames = {
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
            53: "turret"
        };
    }

    getWeaponName(id) {
        return this.weaponNames[id] || ("weapon_" + String(id));
    }

    logReloadUpdate(id, value, sourceTag) {
        const wid = Number(id);
        const name = this.getWeaponName(wid);
        console.log("[ReloadUpdate]", { source: sourceTag || "N", id: wid, name, reload: value });
    }

    applySpawnUiOnce() {
        if (this.spawnUiApplied) return;
        const ui = this.game && this.game.modules ? this.game.modules.ui : null;
        if (!ui || typeof ui.styleGameUI_NoBars !== "function") return;
        ui.styleGameUI_NoBars();
        this.spawnUiApplied = true;
        console.log("[NozoSingle] applied game UI styles on first spawn");
    }

    ensurePlayer(sid) {
        if (!this.game) return null;
        let p = this.game.getState("player", null);
        if (!(p instanceof Player)) {
            p = new Player(sid);
            this.game.setState("player", p);
            this.game.player = p;
        }
        if (sid != null && p.sid == null) p.sid = sid;
        return p;
    }

    handlePacket(type, data) {
        const p = this.ensurePlayer(this.mySid);
        if (!p) return;
        const fn = this[type];
        if (typeof fn === "function") {
            console.log(`[Packet] Handled type: ${type}`, { data });
            fn.call(this, p, data);
            return;
        }
        console.log(`[Packet] Missing type: ${type}`, { data });
    }

    _norm(data, preserveNestedSingleArray) {
        const arr = Array.isArray(data) ? data : [data];
        if (preserveNestedSingleArray) return arr;
        return (arr.length === 1 && Array.isArray(arr[0])) ? arr[0] : arr;
    }

    C(p, data) {
        const args = this._norm(data, false);
        const sid = args[0];
        if (sid != null) {
            this.mySid = sid;
            p.sid = sid;
        }
    }

    a(p, data) {
        const args = this._norm(data, true);
        const tupleList = Array.isArray(args[0]) ? args[0] : args;
        for (let i = 0; i + 13 <= tupleList.length; i += 13) {
            const sid = tupleList[i];
            if (this.mySid != null && sid === this.mySid) {
                p.applyTuple(tupleList, i);
                this.applySpawnUiOnce();
                break;
            }
        }
    }

    O(p, data) {
        const args = this._norm(data, false);
        const sid = args[0];
        const hp = args[1];
        if (this.mySid != null && sid === this.mySid) p.applyHealth(hp);
    }

    N(p, data) {
        const args = this._norm(data, false);
        const key = args[0];
        const value = args[1];
        const numericKey = (typeof key === "number")
            ? key
            : (typeof key === "string" && key.trim() !== "" && !Number.isNaN(Number(key)) ? Number(key) : null);

        if (numericKey != null) {
            p.setReload(numericKey, value);
            this.logReloadUpdate(numericKey, value, typeof key === "number" ? "N:number" : "N:numeric-string");
            return;
        }
        if (key && key !== "__proto__" && key !== "constructor" && key !== "prototype") {
            if (key === "reloads" && value && typeof value === "object") {
                p.reloads = Object.assign({}, p.reloads, value);
                const keys = Object.keys(value);
                for (let i = 0; i < keys.length; i++) {
                    const k = keys[i];
                    this.logReloadUpdate(k, value[k], "N:reloads");
                }
            } else {
                p[key] = value;
                console.log("[N:updatePlayerValue:non-reload]", { key, value, all: args });
            }
        }
    }

    V(p, data) {
        const args = this._norm(data, false);
        const itemsOrWeapons = args[0];
        const wpn = !!args[1];
        if (!Array.isArray(itemsOrWeapons)) return;
        if (wpn) {
            p.weapons = itemsOrWeapons.slice();
            p.primaryIndex = p.weapons[0] || 0;
            p.secondaryIndex = p.weapons[1] || 0;
        } else {
            p.items = itemsOrWeapons.slice();
        }
    }

    S(p, data) {
        const args = this._norm(data, false);
        if (args.length === 2 && typeof args[0] === "number") p.itemCounts[args[0]] = args[1];
        else p.itemCounts = args;
    }

    getMsgpack() {
        const root = this.root || window;
        const uw = typeof unsafeWindow !== "undefined" ? unsafeWindow : null;
        const candidates = [
            root && root.msgpack,
            uw && uw.msgpack,
            typeof window !== "undefined" ? window.msgpack : null,
            typeof document !== "undefined" ? document.msgpack : null,
            root && root.NozoSingle && root.NozoSingle.msgpack
        ];
        for (let i = 0; i < candidates.length; i++) {
            const mp = candidates[i];
            if (mp && typeof mp.decode === "function" && typeof mp.encode === "function") {
                if (root && !root.msgpack) root.msgpack = mp;
                return mp;
            }
        }
        return null;
    }

    decodePacket(messageData) {
        const msgpack = this.getMsgpack();
        if (!msgpack || typeof msgpack.decode !== "function") return null;
        if (!messageData) return null;
        try {
            // 1:1 with original getMessage: new Uint8Array(message.data), then decode.
            const parsed = msgpack.decode(new Uint8Array(messageData));
            if (!Array.isArray(parsed) || parsed.length < 2) return null;
            const type = parsed[0];
            const data = parsed[1];
            const args = Array.isArray(data) ? data : [data];
            return { type, data, args };
        } catch (e) {
            return null;
        }
        return null;
    }

    dispatchRawMessage(raw) {
        const parsed = this.decodePacket(raw);
        if (parsed && parsed.type != null) {
            if (parsed.type === "io-init") return true;
            this.handlePacket(parsed.type, parsed.data);
            return true;
        }
        return false;
    }

    bindSocket(ws) {
        if (!ws || this.boundSockets.has(ws)) return;
        this.boundSockets.add(ws);
        try { ws.binaryType = "arraybuffer"; } catch (_) { }
        const self = this;
        ws.addEventListener("message", async function (evt) {
            if (self.dispatchRawMessage(evt && evt.data)) return;
            const raw = evt && evt.data;
            if (raw && typeof raw.arrayBuffer === "function") {
                try {
                    const ab = await raw.arrayBuffer();
                    self.dispatchRawMessage(ab);
                } catch (_) { }
            }
        });
    }

    bindKnownSockets() {
        const self = this;
        if (this.boundKnownPoll) return;
        let tries = 0;
        this.boundKnownPoll = setInterval(function () {
            tries++;
            const refs = [self.root && self.root.WS, self.root && self.root.ws];
            for (let i = 0; i < refs.length; i++) {
                const ws = refs[i];
                if (ws && typeof ws.addEventListener === "function") {
                    self.bindSocket(ws);
                }
            }
            if (tries >= 240) { // ~60s
                clearInterval(self.boundKnownPoll);
                self.boundKnownPoll = null;
            }
        }, 250);
    }

    bindWsHook() {
        if (this.wsHooked) return;
        const NativeWS = this.root.WebSocket;
        if (!NativeWS) return;
        const self = this;
        function HookedWebSocket(url, protocols) {
            const ws = protocols !== undefined ? new NativeWS(url, protocols) : new NativeWS(url);
            self.bindSocket(ws);
            return ws;
        }

        HookedWebSocket.prototype = NativeWS.prototype;
        Object.setPrototypeOf(HookedWebSocket, NativeWS);
        this.root.WebSocket = HookedWebSocket;
        this.wsHooked = true;
    }

    init() {
        this.ensurePlayer(null);
        this.bindWsHook();
        this.bindKnownSockets();
    }
}

class LoadoutManager {
    constructor(rootRef) {
        this.root = rootRef || window;
        this.items2 = { "1": "8", "2": "17", "3": "31", "4": "23", "5": "10", "6": "38", "7": "28", "8": "25" };
        this.selects = [];
        this.info2 = {};
        this.refs = {};
        this.ids = {
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
            teleport: 38
        };
        this.ranged = [
            this.ids.crossbow,
            this.ids.repeater_crossbow,
            this.ids.musket,
            this.ids.hunting_bow
        ];
        this.ageMap = {
            1: { hand_axe: 1, short_sword: 3, polearm: 5, daggers: 7, stick: 8, bat: 6 },
            2: { cookie: 17, stonewall: 20 },
            3: { trap: 31, boost: 32 },
            4: { greater_spike: 23, mine: 29, sapling: 30, fast_mill: 27 },
            5: { hunting_bow: 9, great_hammer: 10, mc_grabby: 14, wooden_shield: 11 },
            6: { cheese: 18, castle_wall: 21, turret: 33, platform: 34, healing_pad: 35, blocker: 37, teleport: 38 },
            7: { great_axe: 2, crossbow: 12, katana: 4, power_mill: 28 },
            8: { repeater_crossbow: 13, musket: 15, poison_spike: 24, spining_spike: 25, spawnpad: 36 }
        };
    }

    get currentWeapons() {
        return Array.isArray(this.root.weapons) ? this.root.weapons : [];
    }

    save() {
        try {
            localStorage.items2 = JSON.stringify(this.items2);
            return true;
        } catch (e) {
            console.warn("[LoadoutManager] save failed", e);
            return false;
        }
    }

    load() {
        try {
            if (!localStorage.items2) return false;
            const parsed = JSON.parse(localStorage.items2);
            if (parsed && typeof parsed === "object") {
                this.items2 = parsed;
                return true;
            }
            return false;
        } catch (e) {
            console.warn("[LoadoutManager] load failed", e);
            return false;
        }
    }

    validatePath(ageIndex, selectedId) {
        const selAge = String(ageIndex);
        if (this.ranged.includes(selectedId)) {
            if (String(this.items2[5]) !== String(this.ids.hunting_bow)) {
                this.items2[5] = String(this.ids.hunting_bow);
                const el = getEl("sel5");
                if (el) el.value = String(this.ids.hunting_bow);
            }
            if (String(this.items2[7]) !== String(this.ids.crossbow)) {
                this.items2[7] = String(this.ids.crossbow);
                const el = getEl("sel7");
                if (el) el.value = String(this.ids.crossbow);
            }
        }
        if (selectedId === this.ids.katana && String(this.items2[1]) !== String(this.ids.short_sword)) {
            this.items2[1] = String(this.ids.short_sword);
            const el = getEl("sel1");
            if (el) el.value = String(this.ids.short_sword);
        }
        if (selectedId === this.ids.great_axe && String(this.items2[1]) !== String(this.ids.hand_axe)) {
            this.items2[1] = String(this.ids.hand_axe);
            const el = getEl("sel1");
            if (el) el.value = String(this.ids.hand_axe);
        }
        this.save();
        return selAge;
    }

    hydrateFromWeaponsList() {
        const weapons = this.currentWeapons;
        if (!weapons.length) return;
        for (let i = 0; i < weapons.length; i++) {
            const e = weapons[i];
            if (!e || !e.age || !e.name) continue;
            const a = Number(e.age) - 1;
            const key = String(e.name).split(" ").join("_");
            if (!this.ageMap[a]) this.ageMap[a] = {};
            this.ageMap[a][key] = e.id;
        }
    }

    buildLoadoutUI(setupCardEl) {
        if (!setupCardEl || getEl("nozoLoadouts")) return;
        const box = document.createElement("div");
        box.id = "nozoLoadouts";
        box.style.cssText = "margin-top:8px;padding:8px;border:1px solid rgba(255,255,255,.14);border-radius:8px;background:rgba(0,0,0,.18);";

        const title = document.createElement("div");
        title.textContent = "Loadouts";
        title.style.cssText = "font-weight:700;margin-bottom:6px;";
        box.appendChild(title);

        for (const ageKey of Object.keys(this.ageMap)) {
            const row = document.createElement("div");
            row.style.cssText = "display:flex;gap:8px;align-items:center;margin:4px 0;";

            const label = document.createElement("span");
            label.textContent = `Age ${ageKey}:`;
            label.style.cssText = "min-width:52px;font-size:12px;";

            const sel = document.createElement("select");
            sel.id = "sel" + ageKey;
            sel.dataset.age = String(ageKey);
            sel.style.cssText = "flex:1;background:rgba(255,255,255,.08);color:#fff;border:1px solid rgba(255,255,255,.18);border-radius:6px;";

            const options = this.ageMap[ageKey] || {};
            for (const name of Object.keys(options)) {
                const opt = document.createElement("option");
                opt.value = String(options[name]);
                opt.textContent = name;
                opt.style.color = "#fff";
                opt.style.backgroundColor = "#1b2230";
                sel.appendChild(opt);
            }

            sel.style.color = "#fff";
            sel.style.background = "rgba(20,24,32,.95)";
            sel.style.border = "1px solid rgba(255,255,255,.18)";

            if (this.items2[ageKey] != null) sel.value = String(this.items2[ageKey]);
            if (!sel.value && sel.options.length) sel.selectedIndex = 0;
            this.items2[ageKey] = sel.value;
            this.selects.push([ageKey, sel]);

            sel.addEventListener("change", (e) => {
                const ageIndex = e.target.dataset.age;
                const value = Number(e.target.value);
                this.items2[ageIndex] = String(e.target.value);
                this.validatePath(ageIndex, value);
            });

            row.appendChild(label);
            row.appendChild(sel);
            box.appendChild(row);
        }

        setupCardEl.appendChild(box);
        this.save();
    }

    getCurrentRegionBrowser() {
        const sb = this.root.serverBrowser;
        if (!sb || !sb.children || !sb.children[0]) return null;
        return sb.children[0];
    }

    getCurrentServerInfo(serverBrowser) {
        if (!serverBrowser || !serverBrowser.selectedOptions || !serverBrowser.selectedOptions[0]) return null;
        const o = serverBrowser.selectedOptions[0];
        const parts = String(o.innerText || "").split(" ");
        return {
            name: parts[0] || "",
            id: o.value || "",
            index: parts[1] || ""
        };
    }

    NewServer() {
        const serverBrowser = this.getCurrentRegionBrowser();
        if (!serverBrowser) return null;
        const cur = this.getCurrentServerInfo(serverBrowser);
        if (!cur || !cur.id) return null;

        const servers = [];
        [...serverBrowser.children].forEach((e) => {
            const txt = String(e.innerText || "");
            const inBrackets = txt.includes("[") ? txt.split("[").pop().split("]")[0] : "";
            const a = Number((inBrackets.split("/")[0] || "0"));
            const b = e.value;
            const r = String(b || "").split(":")[0];
            if (r === String(cur.id).split(":")[0]) servers.push({ a, b, e });
        });
        if (!servers.length) return null;

        const candidate = servers
        .sort((x, y) => y.a - x.a)
        .find((s) => Number(s.a) < 40);
        if (!candidate) return null;

        const nsi = String(candidate.b).split(":");
        nsi[1] = String(Number(nsi[1]) + 1);
        const nextServerId = nsi.join(":");

        const u = new URL(location.href);
        u.searchParams.set("server", nextServerId);
        location.href = u.toString();
        return nextServerId;
    }

    buildGuideButtons(guideCardEl) {
        if (!guideCardEl || getEl("nozoGuideBtns")) return;
        const wrap = document.createElement("div");
        wrap.id = "nozoGuideBtns";
        wrap.style.cssText = "margin-top:8px;display:flex;flex-wrap:wrap;gap:6px;";

        const mk = (label, onClick) => {
            const b = document.createElement("button");
            b.textContent = label;
            b.style.cssText = "padding:6px 9px;border-radius:7px;border:1px solid rgba(255,255,255,.16);background:rgba(255,255,255,.08);color:#fff;cursor:pointer;";
            b.addEventListener("click", onClick);
            wrap.appendChild(b);
        };

        mk("New Server", () => this.NewServer());
        mk("Load Layout", () => {
            this.load();
            this.selects.forEach(([a, s]) => {
                if (this.items2[a] != null) s.value = String(this.items2[a]);
            });
        });
        mk("Save Layout", () => this.save());

        guideCardEl.appendChild(wrap);
    }

    exposeGlobals() {
        this.root.selects = this.selects;
        this.root.items2 = this.items2;
        this.root.info2 = this.info2;
        this.root.spikes = [25, 23, 24, 6, 7, 9];
        this.root.NewServer = this.NewServer.bind(this);
        this.info2.ageitems = this.ageMap;
        this.info2.ageitems["0"] = { wood_wall: 19, spike: 6, windmill: 10 };
    }

    mount() {
        const setupCard = this.root.setupCard || getEl("setupCard");
        const guideCard = this.root.guideCard || getEl("guideCard");
        if (!setupCard && !guideCard) return false;

        this.load();
        this.hydrateFromWeaponsList();
        this.injectLoadoutSelectCSS();
        if (setupCard) this.buildLoadoutUI(setupCard);
        if (guideCard) this.buildGuideButtons(guideCard);
        this.exposeGlobals();
        return true;
    }

    injectLoadoutSelectCSS() {
        if (document.getElementById("nozoLoadoutSelectCSS")) return;
        const st = document.createElement("style");
        st.id = "nozoLoadoutSelectCSS";
        st.textContent = `
      #nozoLoadouts select { color:#fff; background:#1b2230; border:1px solid rgba(255,255,255,.18); }
      #nozoLoadouts select option { color:#fff; background:#1b2230; }
    `;
        document.head.appendChild(st);
    }
}

class BootstrapManager {
    constructor(rootRef, gameEntity) {
        this.root = rootRef || window;
        this.game = gameEntity || null;
        this.boundTokenFlow = false;
        this.token = null;
        this.server = null;
    }

    getApiBase() {
        const host = (this.root.location && this.root.location.hostname) || "";
        const isSandbox = host === "sandbox-dev.moomoo.io" || host === "sandbox.moomoo.io";
        const isDev = host === "dev.moomoo.io" || host === "dev2.moomoo.io";
        if (isSandbox) return "https://api-sandbox.moomoo.io";
        if (isDev) return "https://api-dev.moomoo.io";
        return "https://api.moomoo.io";
    }

    getServerParam() {
        const raw = new URLSearchParams((this.root.location && this.root.location.search) || "").get("server");
        if (!raw || raw.indexOf(":") === -1) return null;
        const parts = raw.split(":");
        if (parts.length < 2) return null;
        return { raw, region: parts[0], name: parts[1] };
    }

    refreshServerContext() {
        const sp = this.getServerParam();
        if (!sp) return null;
        this.server = sp;
        if (this.game) {
            this.game.setState("serverParam", sp.raw);
            this.game.setState("region", sp.region);
            this.game.setState("name", sp.name);
            this.game.setState("In", sp.raw);
        }
        return sp;
    }

    setToken(tokenValue, source) {
        if (!tokenValue) return false;
        this.token = tokenValue;
        this.root.token = tokenValue;
        if (this.game) {
            this.game.setState("token", tokenValue);
            this.game.emit("token", { token: tokenValue, source: source || "unknown" });
        }
        return true;
    }

    bindTokenFlow() {
        if (this.boundTokenFlow) return;
        this.boundTokenFlow = true;
        this.refreshServerContext();

        const altchaEl = this.root.document.getElementById("altcha");
        if (altchaEl && altchaEl.addEventListener) {
            altchaEl.addEventListener("statechange", (e) => {
                const detail = e && e.detail ? e.detail : {};
                if (detail.state !== "verified") return;

                this.refreshServerContext();
                this.setToken(detail.payload, "altcha:verified");

                const visualizer = this.root.document.getElementById("wideAdCard");
                if (visualizer) {
                    visualizer.style.maxWidth = "1056.95px";
                    visualizer.style.height = "300px";
                }

                const enterGame = this.root.document.getElementById("enterGame");
                setTimeout(() => {
                    if (enterGame && enterGame.classList && enterGame.classList.contains("disabled")) {
                        this.root.location.reload();
                        return;
                    }
                    if ((this.root.name || "").indexOf("authWindow-") === 0 && this.root.opener && this.root.opener.postMessage) {
                        const id = (this.root.name || "").replace("authWindow-", "");
                        this.root.opener.postMessage(
                            { type: "TOKEN", id, token: detail.payload },
                            "*"
                        );
                        this.root.close();
                    }
                }, 500);
            });
        }

        const altchaCheckbox = this.root.document.getElementById("altcha_checkbox");
        if (altchaCheckbox && !altchaCheckbox.checked && altchaCheckbox.click) {
            setTimeout(() => {
                if (!altchaCheckbox.checked) altchaCheckbox.click();
            }, 1000);
        }
    }

    async getToken() {
        this.bindTokenFlow();
        while (!this.token && !this.root.token) {
            await new Promise((resolve) => setTimeout(resolve, 50));
        }
        this.refreshServerContext();
        return {
            token: this.token || this.root.token,
            In: this.server ? this.server.raw : null
        };
    }

    async findServer(serverParam) {
        if (!serverParam) return null;
        const dn = this.getApiBase();
        const res = await fetch(dn + "/servers?v=1.26");
        if (!res.ok) return null;
        const servers = await res.json();
        if (!Array.isArray(servers)) return null;
        return servers.find((e) => e && e.region === serverParam.region && e.name === serverParam.name) || null;
    }

    async run() {
        try {
            const serverParam = this.getServerParam();
            const auth = await this.getToken();
            const server = await this.findServer(serverParam);
            if (this.game) {
                this.game.setState("bootstrap", {
                    server,
                    token: auth.token,
                    In: auth.In,
                    at: Date.now()
                });
                this.game.emit("bootstrap:ready", { server, token: auth.token, In: auth.In });
            }
            return { server, token: auth.token, In: auth.In };
        } catch (err) {
            console.error("[BootstrapManager] run failed:", err);
            if (this.game) this.game.emit("bootstrap:error", err);
            return null;
        }
    }
}

function mountDummyMenu() {
    if (getEl("nozoDummyMenu")) return;

    const menu = document.createElement("div");
    menu.id = "nozoDummyMenu";
    menu.style.cssText = [
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
        "box-shadow:0 2px 10px rgba(0,0,0,.45)"
    ].join(";");

    menu.innerHTML = [
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">',
        '<b>Nozo Dummy</b>',
        '<button id="nozoDummyClose" style="background:none;border:none;color:#fff;cursor:pointer;">x</button>',
        "</div>",
        '<label style="display:flex;gap:6px;align-items:center;margin-bottom:6px;"><input id="nozoDummyRender" type="checkbox" checked>Render</label>',
        '<label style="display:flex;gap:6px;align-items:center;margin-bottom:6px;"><input id="nozoDummyCombat" type="checkbox">Combat</label>',
        '<label style="display:flex;gap:6px;align-items:center;"><input id="nozoDummyMove" type="checkbox">Movement</label>',
        '<div id="nozoShameInfo" style="margin-top:8px;padding-top:6px;border-top:1px solid rgba(255,255,255,.14);font-size:11px;line-height:1.35;">Shame: --</div>'
    ].join("");

    document.body.appendChild(menu);

    const closeBtn = getEl("nozoDummyClose");
    closeBtn && closeBtn.addEventListener("click", function () {
        const tid = Number(menu.dataset.shameTimer || 0);
        if (tid) clearInterval(tid);
        menu.remove();
    });

    const updateShameInfo = function () {
        const out = getEl("nozoShameInfo");
        if (!out) return;
        const p = root.NozoSingle && root.NozoSingle.game ? root.NozoSingle.game.player : null;
        if (!p) {
            out.textContent = "Shame: --";
            return;
        }
        const active = p.shameActive ? "ON" : "OFF";
        const count = Number(p.shameTransitions || 0);
        out.textContent = `Shame: ${active} | count: ${count}`;
    };
    updateShameInfo();
    const t = setInterval(updateShameInfo, 200);
    menu.dataset.shameTimer = String(t);
}
function styleOne(selector, styles) {
    const el = document.querySelector(selector);
    if (!el) return false;
    Object.assign(el.style, styles);
    return true;
}

function styleAll(selector, styles) {
    const els = document.querySelectorAll(selector);
    if (!els.length) return 0;
    els.forEach((el) => Object.assign(el.style, styles));
    return els.length;
}
function setText(selector, text) {
    const el = document.querySelector(selector);
    if (!el) return false;
    el.textContent = text;
    return true;
}

function setHTML(selector, html) {
    const el = document.querySelector(selector);
    if (!el) return false;
    el.innerHTML = html;
    return true;
}

function replaceTextContains(selector, findText, newText) {
    const els = document.querySelectorAll(selector);
    let count = 0;
    els.forEach((el) => {
        if ((el.textContent || "").includes(findText)) {
            el.textContent = (el.textContent || "").replace(findText, newText);
            count++;
        }
    });
    return count;
}
function themeMainMenuCentered() {
    const mainMenu = document.querySelector("#mainMenu");
    const menuContainer = document.querySelector("#menuContainer");
    if (!mainMenu || !menuContainer) return false;

    // Keep main menu centered
    const mainMenuStyle = {
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        width: "100%",
        background: "linear-gradient(180deg, rgba(8,12,18,.50), rgba(8,12,18,.35))"
    };
    // Do not force display:flex if game already hid menu (display:none).
    if (getComputedStyle(mainMenu).display !== "none") {
        mainMenuStyle.display = "flex";
    }
    styleOne("#mainMenu", mainMenuStyle);

    // Main container
    styleOne("#menuContainer", {
        width: "min(1120px, 96vw)",
        margin: "0 auto",
        padding: "14px"
    });

    // Top 3-card area
    styleOne("#menuCardHolder", {
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr",
        gap: "12px",
        alignItems: "start"
    });

    // General card style (includes setupCard, guideCard, adCard/music card)
    styleAll("#menuCardHolder .menuCard", {
        background: "rgba(15,22,32,.82)",
        border: "1px solid rgba(255,255,255,.08)",
        borderRadius: "10px",
        boxShadow: "0 6px 24px rgba(0,0,0,.28)",
        color: "#e8edf7"
    });

    // Keep adCard visible (music player host)
    styleOne("#adCard", {
        display: "",
        overflow: "hidden"
    });

    // Keep wideAdCard visible (audio visualizer under cards)
    styleOne("#wideAdCard", {
        display: "",
        marginTop: "12px",
        background: "rgba(15,22,32,.82)",
        border: "1px solid rgba(255,255,255,.08)",
        borderRadius: "10px",
        boxShadow: "0 6px 24px rgba(0,0,0,.28)"
    });

    // Inputs + button polish
    styleOne("#nameInput", {
        background: "rgba(255,255,255,.08)",
        border: "1px solid rgba(255,255,255,.18)",
        color: "#fff",
        borderRadius: "8px",
        outline: "none"
    });

    styleOne("#enterGame", {
        borderRadius: "9px",
        border: "1px solid rgba(0,0,0,.22)",
        boxShadow: "0 4px 14px rgba(0,0,0,.24)",
        fontWeight: "700"
    });

    styleAll(".menuHeader", { color: "#f2f6ff" });
    styleAll(".menuText", { color: "rgba(230,236,248,.92)" });

    console.log("[themeMainMenuCentered] applied");
    return true;
}

function ensureMainMenuCentered() {
    let tries = 0;
    const maxTries = 240; // ~120s at 500ms
    const timer = setInterval(function () {
        tries++;
        themeMainMenuCentered();

        const enterGame = document.getElementById("enterGame");
        const ready =
              !!enterGame &&
              (!enterGame.classList || !enterGame.classList.contains("disabled"));

        // Stop re-applying once Enter Game is ready, or on timeout.
        if (ready || tries >= maxTries) {
            clearInterval(timer);
        }
    }, 500);
}

function mountLoadoutsWhenReady(manager) {
    let tries = 0;
    const t = setInterval(() => {
        tries++;
        if (manager.mount()) {
            clearInterval(t);
            return;
        }
        if (tries >= 120) clearInterval(t);
    }, 500);
}

function styleGameUI_NoBars() {
    // IMPORTANT: reset wrappers so no giant bars
    styleOne("#bottomContainer", { background: "transparent", border: "none", boxShadow: "none" });
    styleOne("#actionBar", { background: "transparent", border: "none", boxShadow: "none" });
    styleOne("#topInfoHolder", { background: "transparent", border: "none", boxShadow: "none" });
    styleOne("#leaderboard", { background: "transparent", border: "none", boxShadow: "none" });
    styleOne("#resDisplay", { background: "transparent", border: "none", boxShadow: "none" });

    // Leaf UI polish only
    styleAll(".resourceDisplay", {
        background: "rgba(10,14,22,.58)",
        border: "1px solid rgba(255,255,255,.10)",
        borderRadius: "8px",
        color: "#eaf1ff",
        padding: "4px 8px"
    });

    styleAll(".actionBarItem", {
        borderRadius: "6px",
        border: "1px solid rgba(255,255,255,.12)",
        boxShadow: "inset 0 0 0 1px rgba(0,0,0,.18)"
    });

    styleOne("#chatBox", {
        background: "rgba(0,0,0,.45)",
        border: "1px solid rgba(255,255,255,.16)",
        borderRadius: "8px",
        color: "#fff",
        padding: "6px 10px"
    });

    styleAll("#allianceButton, #leaderboardButton, #storeButton, #chatButton", {
        background: "rgba(10,14,22,.72)",
        border: "1px solid rgba(255,255,255,.12)",
        borderRadius: "10px",
        color: "#eaf1ff"
    });

    styleOne("#ageBarContainer", {
        background: "rgba(0,0,0,.28)",
        border: "1px solid rgba(255,255,255,.10)",
        borderRadius: "8px"
    });

    styleOne("#ageBarBody", {
        background: "linear-gradient(90deg,#80d24d,#b9f170)"
    });

    styleAll(".leaderboardItem", { color: "#dfe8ff" });
    styleAll(".leaderScore", { color: "#9ec2ff" });
}
setText("#gameName", "NOZO NEXT");
setText("#loadingText", "Loading modules...");
setText("#enterGame", "Play");
document.getElementById("leaderboard").append("Nozo-Mod");
replaceTextContains(".menuHeader", "SETTINGS", "Preferences");
ensureMainMenuCentered();

const GameEntity = new Entity("NozoSingleGame", root);
GameEntity.registerModule("dom", { getEl, styleOne, styleAll, setText, setHTML, replaceTextContains });
GameEntity.registerModule("ui", {
    element,
    HtmlAction,
    Html,
    mountDummyMenu,
    themeMainMenuCentered,
    styleGameUI_NoBars
});
const loadoutManager = new LoadoutManager(root);
const bootstrapManager = new BootstrapManager(root, GameEntity);
const playerRuntime = new PlayerRuntime(root, GameEntity);
GameEntity.registerModule("loadouts", loadoutManager);
GameEntity.registerModule("bootstrap", bootstrapManager);
GameEntity.registerModule("player", playerRuntime);
GameEntity.registerModule("config", {
    get: () => syncConfigFromWindowConfig(),
    sync: () => syncConfigFromWindowConfig(),
    raw: _config
});
GameEntity.registerModule("configs", {
    get: () => getConfigs(),
    set: (next) => {
        const v = setConfigs(next);
        GameEntity.setState("configs", v);
        return v;
    },
    raw: _configs
});
GameEntity.setState("readyAt", Date.now());
GameEntity.setState("config", syncConfigFromWindowConfig());
GameEntity.setState("configs", getConfigs());
GameEntity.start();
playerRuntime.init();
mountLoadoutsWhenReady(loadoutManager);
bootstrapManager.bindTokenFlow();

root.NozoSingle = {
    Entity,
    Player,
    PlayerRuntime,
    game: GameEntity,
    LoadoutManager,
    BootstrapManager,
    element,
    HtmlAction,
    Html,
    mountDummyMenu,
    themeMainMenuCentered,
    styleGameUI_NoBars,
    loadouts: loadoutManager,
    bootstrap: bootstrapManager,
    player: playerRuntime,
    setConfigs,
    getConfigs
};

Object.defineProperty(root.NozoSingle, "config", {
    configurable: true,
    enumerable: true,
    get: function () {
        return syncConfigFromWindowConfig();
    }
});

Object.defineProperty(root.NozoSingle, "configs", {
    configurable: true,
    enumerable: true,
    get: function () {
        return getConfigs();
    }
});

// Legacy-style alias expected by old code paths.
if (!root.configs || typeof root.configs !== "object") {
    root.configs = getConfigs();
}

mountDummyMenu();
