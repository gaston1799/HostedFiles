// ==UserScript==
// @name         Gaston's - Video/Image Downloader Revamped 2
// @namespace    http://tampermonkey.net
// @version      11.9
// @supportURL   https://greasyfork.org/en/scripts/496975-gaston-s-video-image-downloader/feedback
// @homepageURL  https://greasyfork.org/en/users/689441-gaston
// @description Instagram/Twitch/YouTube/TikTok Video/Audio Downloader (frequently updated) Includes YT Ad block
// @author       gaston1799
// @match         *://www.youtube.com/*
// @match         *://yt.savetube.me/*
// @match         *://production.assets.clips.twitchcdn.net/*
// @match         *://www.instagram.com/*
// @match         *://music.youtube.com/*
// @match         *://y2mate.nu/*
// @match         *://p.savenow.to/*
// @match         *://open.spotify.com/*
// @match         *://www.twitch.tv/*
// @match         *://www.socialplug.io/*
// @match         *://snapinst.app/*
// @match         *://loader.to/*
// @match         *://onlymp3.app/*
// @match         *://qdownloader.cc/*
// @match         *://media.ytmp3.gg/*
// @match         *://tubemp4.is/*
// @match         *://snapsave.io/*
// @match         *://dashboard.twitch.tv/*
// @match         *://clips.twitch.tv/*
// @match         *://twitch.tv/*
// @match         *://onlymp3.to/*
// @match         *://fastdl.app/*
// @match         *://en.onlymp3.app/*
// @match         *://clipr.xyz/*
// @match         *://studio.youtube.com/*
// @match         *://www.yt2conv.com/*
// @match         *://soundcloud.com/*
// @match         *://sclouddownloader.net/*
// @match         *://www.tiktok.com/*
// @match         *://en3.onlinevideoconverter.pro/*
// @match         *://savetik.co/*
// @match         *://yt5s.biz/*
// @match         *://sss.instasaverpro.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_info
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        window.onurlchange
// @grant        GM_registerMenuCommand
// @grant        GM_deleteValue
// @require      https://update.greasyfork.org/scripts/439099/1203718/MonkeyConfig%20Modern%20Reloaded.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/iframe-resizer/4.3.9/iframeResizer.min.js
// @grant        GM_addValueChangeListener
// @grant        GM_removeValueChangeListener
// @run-at       document-start
// @connect      update.greasyfork.org
// ==/UserScript==

// ═══════════════════════════════════════════════════════════════
//  SECTION 1 — CORE CLASSES
// ═══════════════════════════════════════════════════════════════

info = {}

class videoPlayer {
    #isF = function() { return this.isFullScreen }
    #isT = function() { return this.isTheater }
    #isM = function() { return this.isMini }
    set isMini(a) {
        if (a && !this.#isM()) document.querySelector('[title="Miniplayer (i)"]').click()
        else if (!a && this.#isM()) document.querySelector('[title="Expand (i)"]').click()
    }
    get isMini() { return !!document.querySelector('[title="Expand (i)"]') }
    set isTheater(a) {
        if (!a && this.#isT()) document.querySelector('[title="Default view (t)"]').click()
        else if (a && !this.#isT()) document.querySelector('[title="Theater mode (t)"]').click()
    }
    get isTheater() { return !document.querySelector('[title="Theater mode (t)"]') }
    set isFullScreen(a = this.#isF()) {
        if (a && !this.#isF()) document.querySelector('[title="Full screen (f)"]').click()
        else if (!a && this.#isF()) document.querySelector('[title="Exit full screen (f)"]').click()
    }
    get isFullScreen() { return !document.querySelector('[title="Full screen (f)"]') }
}

class element {
    static get br() { return new element("br") }
    constructor(tag, props = {}) {
        if (tag instanceof HTMLElement) {
            this.element = tag
        } else {
            this.element = document.createElement(tag)
            for (let key in props) {
                if (key === "className") this.element.className = props[key]
                else this.element.setAttribute(key, props[key])
            }
        }
    }
    style(styles) { for (let prop in styles) this.element.style[prop] = styles[prop]; return this }
    append(target, ...targets) {
        this.element.append(target.element || target)
        targets.forEach(t => this.element.append(t.element || t))
        return this
    }
    appendTo(target) {
        ;(target.element || (typeof target === 'string' ? document.querySelector(target) : target)).append(this.element)
        return this
    }
    on(event, cb) { this.element.addEventListener(event, cb); return this }
    set(prop, value) {
        if (prop === "className") {
            if (typeof value === "string" && value.startsWith('.')) value = value.substring(1)
            this.element.className = value
        } else {
            this.element[prop] = value
        }
        return this
    }
    remove() { this.element.remove(); return this }
    get(prop) { return this.element[prop] }
    get children() { return Array.from(this.element.children) }
}
const _e = element
const _element = element

// ═══════════════════════════════════════════════════════════════
//  SECTION 2 — LOGGING
// ═══════════════════════════════════════════════════════════════

class CustomLogging {
    constructor(title) {
        this.title = { body: title || "---", color: "darkgrey", size: "1rem" }
        this.body = { color: "#008f68", size: "1rem" }
    }
    setTitleBody(title) { this.title.body = title; return this }
    setTitleStyle({ color, size }) { if (color !== undefined) this.title.color = color; if (size !== undefined) this.title.size = size; return this }
    setBodyStyle({ color, size }) { if (color !== undefined) this.body.color = color; if (size !== undefined) this.body.size = size; return this }
    log(body = "") {
        console.log(`%c${this.title.body} | %c${body}`,
            `color:${this.title.color};font-weight:bold;font-size:${this.title.size};`,
            `color:${this.body.color};font-weight:bold;font-size:${this.body.size};text-shadow:0 0 5px rgba(0,0,0,0.2);`)
    }
    warn(body = "") {
        console.warn(`%c${this.title.body} | %c${body}`,
            `color:orange;font-weight:bold;font-size:${this.title.size};`,
            `color:orange;font-weight:bold;font-size:${this.body.size};`)
    }
    error(body = "") {
        console.error(`%c${this.title.body} | %c${body}`,
            `color:red;font-weight:bold;font-size:${this.title.size};`,
            `color:red;font-weight:bold;font-size:${this.body.size};`)
    }
}

const _origConsole = { ...console }
const logProxy   = new CustomLogging("Console")
const logger_    = new CustomLogging('Base')
const logger     = logger_
const log_   = function(e) { (new CustomLogging(getCallerName())).log(e) }
const error_ = function(e) { (new CustomLogging(getCallerName())).error(e) }
const warn_  = function(e) { (new CustomLogging(getCallerName())).warn(e) }

// ═══════════════════════════════════════════════════════════════
//  SECTION 3 — CONSTANTS & GLOBAL STATE
// ═══════════════════════════════════════════════════════════════

const YouTubeStyleButtonClass = 'yt-spec-button-shape-next yt-spec-button-shape-next--tonal yt-spec-button-shape-next--overlay yt-spec-button-shape-next--size-m yt-spec-button-shape-next--icon-leading yt-spec-button-shape-next--enable-backdrop-filter-experiment'
const UnmutePath       = 'M3.15,3.85l4.17,4.17L6.16,9H3v6h3.16L12,19.93v-7.22l2.45,2.45c-0.15,0.07-0.3,0.13-0.45,0.18v1.04 c0.43-0.1,0.83-0.27,1.2-0.48l1.81,1.81c-0.88,0.62-1.9,1.04-3.01,1.2v1.01c1.39-0.17,2.66-0.71,3.73-1.49l2.42,2.42l0.71-0.71 l-17-17L3.15,3.85z M11,11.71v6.07L6.52,14H4v-4h2.52l1.5-1.27L11,11.71z M10.33,6.79L9.62,6.08L12,4.07v4.39l-1-1V6.22L10.33,6.79 z M14,8.66V7.62c2,0.46,3.5,2.24,3.5,4.38c0,0.58-0.13,1.13-0.33,1.64l-0.79-0.79c0.07-0.27,0.12-0.55,0.12-0.85 C16.5,10.42,15.44,9.1,14,8.66z M14,5.08V4.07c3.95,0.49,7,3.85,7,7.93c0,1.56-0.46,3.01-1.23,4.24l-0.73-0.73 C19.65,14.48,20,13.28,20,12C20,8.48,17.39,5.57,14,5.08z'
const mutePath         = 'M17.5,12c0,2.14-1.5,3.92-3.5,4.38v-1.04c1.44-0.43,2.5-1.76,2.5-3.34c0-1.58-1.06-2.9-2.5-3.34V7.62 C16,8.08,17.5,9.86,17.5,12z M12,4.07v15.86L6.16,15H3V9h3.16L12,4.07z M11,6.22L6.52,10H4v4h2.52L11,17.78V6.22z M21,12 c0,4.08-3.05,7.44-7,7.93v-1.01c3.39-0.49,6-3.4,6-6.92s-2.61-6.43-6-6.92V4.07C17.95,4.56,21,7.92,21,12z'
const CurrentPlayingSymbol = '▶'

var sleep              = ms => new Promise(a => setTimeout(a, ms))
var Porigin            = 'https://onlymp3.app'
var Ppath              = '/watch?='
var lastUrl            = location.href
var lastAdId           = null
var didMute            = false
var wasMutedBeforeAd   = false
var playerReady        = false
var didmute            = 0
var tiktikWin, ev, adev, set_
var _wfs, _wfs_, _copyElm
var _getV = GM_getValue
var _setV = GM_setValue

// ═══════════════════════════════════════════════════════════════
//  SECTION 4 — SHARED UTILITIES
// ═══════════════════════════════════════════════════════════════

// Shared wait-for-selector used by domain handlers
async function wfs(selector, ms = 20000) {
    let timedOut = false
    const t = setTimeout(() => { console.log('TimeOut for', selector); timedOut = true }, ms)
    while (!document.querySelector(selector)) {
        await sleep(500)
        if (timedOut) break
    }
    clearTimeout(t)
    if (timedOut) throw 'NotFound'
    return document.querySelector(selector)
}

// Retry a function in a setInterval until it stops throwing
function tF(f, { callback, int } = {}) {
    !callback && (callback = function() {}); !int && (int = 100)
    console.log({ f, callback, int })
    try { f(); callback(); return } catch {}
    var _ = setInterval(() => { try { f(); callback(); clearInterval(_) } catch {} }, int || 100)
    return _
}

function ad(listener, f, autoDelete = false) {
    var _ = addEventListener(listener, (...__) => { f(...__); if (autoDelete) removeEventListener(_) }, true)
    return _
}

function getCallerName() {
    try {
        const stack = new Error().stack?.split("\n")
        const callerLine = stack?.[3] || stack?.[2] || ""
        const match = callerLine.match(/at\s+([^(]+)\s*\(/)
        return match ? match[1].trim() : "anonymous"
    } catch { return "unknown" }
}

function getV(a, v) { return GM_getValue(a) || (GM_setValue(a, v), v) }
function setV(a, v) { GM_setValue(a, v) }

// ═══════════════════════════════════════════════════════════════
//  SECTION 5 — DOM UTILITIES
// ═══════════════════════════════════════════════════════════════

function setElement(url) {
    var m = String(url).match(/^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?)|(shorts\/))\??v?=?([^#&?]*).*/)
    return (m && m[8].length == 11) ? m[8] : false
}

function setElement2(string) {
    return string.match(/(?<host>https?:\/\/www\.tiktok\.com)\/(?<username>@[^\/]+)\/video\/(?<videoID>\d+)/i).groups
}

function findhref2(a, b) {
    var res = []
    function part2(e) {
        if (e.tagName.toLowerCase() == (b || 'a')) {
            res.push(e)
            if (e.children.length) { e = e.children; e.forEach = [].forEach; e.forEach(e2 => part2(e2)) }
        } else if (e.children.length) {
            e = e.children; e.forEach = [].forEach; e.forEach(e2 => part2(e2))
        }
    }
    part2(a); return res
}

function get_aria_label(label, doc = document.body) {
    var res = []
    function part2(e) {
        if (e.getAttribute('aria-label') == label) res.push(e)
        else if (e.children.length) { e = e.children; e.forEach = [].forEach; e.forEach(e2 => part2(e2)) }
    }
    part2(doc); return res[0] || false
}

function getElementByAttribute(label, item = 'aria-label', doc = document.body) {
    var res = []
    function part2(e) {
        if (e.getAttribute(item) == label) res.push(e)
        else if (e.children.length) { e = e.children; e.forEach = [].forEach; e.forEach(e2 => part2(e2)) }
    }
    part2(doc); return res.length == 1 ? res[0] : res || false
}

function abc(label, item = 'aria-label', doc = document.body) {
    var res = []
    function part2(e) {
        var found = false
        if (!item) {
            ;[...e.attributes].map(e => ({ name: e.name, value: e.value })).filter(e => e.value == label).length ? (res.push(e), found = 1) : null
        } else if (e.getAttribute(item) == label) { res.push(e); found = 1 }
        if (e.children.length && !found) { e = e.children; e.forEach = [].forEach; e.forEach(e2 => part2(e2)) }
    }
    part2(doc)
    return res.length ? (res.length == 1 ? res[0] : res || false) : null
}
const abc_ = abc

function dispatchAllInputEvents(target, value) {
    ;['focus', 'input', 'change', 'blur'].forEach(eventName => {
        let ev = new Event(eventName, { bubbles: true, isTrusted: true })
        if (target[`on${eventName}`]) target[`on${eventName}`](ev)
        if (eventName === 'input') target.value = value
        target.dispatchEvent(ev)
    })
}

function query(a, d) {
    try {
        let c = typeof $ != 'undefined' ? $ : document.querySelectorAll
        return !d
            ? ((b) => Object.keys(b).length ? b : null)(c(a) ? c(a).length ? c(a)[0] : c(a) : null)
            : [...document.querySelectorAll(a)].filter(e => !(el.offsetParent === null))[0]
    } catch {}
}

function isElementInViewport(el) {
    if (typeof jQuery === "function" && el instanceof jQuery) el = el[0]
    var rect = el.getBoundingClientRect()
    var h = window.innerHeight || document.documentElement.clientHeight
    var w = window.innerWidth  || document.documentElement.clientWidth
    return rect.top >= 0 - (h / 2) && rect.left >= 0 && rect.bottom <= h + (h / 2) && rect.right <= w
}

function isHidden(el)           { return el.offsetParent === null }
function parent(node)           { return node.parentNode }
function getVisiable(elements)  { return elements.filter(el => el && isElementInViewport(el)) }
function ch3(i)                 { return !!(i && !i.closed) }
function getClass(name_)        { return document.getElementsByClassName("ehlq8k34")[0] }

async function getWin(list = [['w1','win1'],['w2','win2'],['w3','win3'],['w4','win4']]) {
    var f
    await new Promise((g) => {
        var i = setInterval(() => {
            list.forEach(k => {
                this[k[0]] = ch3(window[k[1]])
                if (!window[k[1]] && !f) { f = k[1]; console.log(k) }
            })
            if (f) { g(f); clearInterval(i) }
        }, 500)
    })
    return f
}

// ═══════════════════════════════════════════════════════════════
//  SECTION 6 — DOWNLOAD HELPERS
// ═══════════════════════════════════════════════════════════════

async function toDataURI(url) {
    const res = await fetch(url)
    if (!res.ok) throw new Error(`Fetch failed: ${res.status}`)
    const blob = await res.blob()
    return await new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result)
        reader.onerror   = reject
        reader.readAsDataURL(blob)
    })
}

function downloadFileAsTitle(url, filename) {
    const a = document.createElement('a')
    a.href = url; a.download = filename
    document.body.appendChild(a); a.click(); document.body.removeChild(a)
}

function downloadFile_(url, name) {
    const a = document.createElement('a')
    a.href = url; a.download = name
    document.body.appendChild(a); a.click(); document.body.removeChild(a)
}

async function _downloadFileAsTitle(url, title, win, cb) {
    const anchor = document.createElement('a')
    anchor.style.display = 'none'
    document.body.appendChild(anchor)
    return fetch(url)
        .then(r => r.blob())
        .then(blob => {
            const objectUrl = URL.createObjectURL(blob)
            anchor.href = objectUrl; anchor.download = title; anchor.target = '_blank'
            anchor.click()
            URL.revokeObjectURL(objectUrl)
            ;(win || opener || window).postMessage({ url, title, s: true }, '*')
            if (typeof cb === 'function') cb()
        })
        .catch(error => {
            console.error('Error downloading file:', error)
            ;(win || opener || window).postMessage({ url, title, s: false }, '*')
        })
}

async function downloadVideo(url, title) {
    try {
        const response = await fetch(url)
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`)
        const blob    = await response.blob()
        const blobUrl = window.URL.createObjectURL(blob)
        const link    = document.createElement('a')
        link.href = blobUrl; link.download = title
        document.body.appendChild(link); link.click()
        document.body.removeChild(link); window.URL.revokeObjectURL(blobUrl)
        console.log(`Video downloaded from: ${response.url}`)
    } catch (error) { console.error('Failed to download video:', error) }
}

function downloadVideoFromBlob(videoElement, title) {
    if (!videoElement?.src?.startsWith('blob:')) { console.error('Invalid video element or source.'); return }
    const stream        = videoElement.captureStream()
    const mediaRecorder = new MediaRecorder(stream)
    const chunks        = []
    mediaRecorder.ondataavailable = event => { if (event.data.size > 0) { chunks.push(event.data); console.log(event.data) } }
    mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/mp4' })
        const url  = URL.createObjectURL(blob)
        const a    = document.createElement('a')
        a.style.display = 'none'; a.href = url; a.download = title + '.mp4'
        document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url)
    }
    mediaRecorder.start()
    setTimeout(() => mediaRecorder.stop(), videoElement.duration * 1000)
}

async function getFinalUrlFromServer(url) {
    try {
        const response = await fetch('http://localhost:3000/get-final-url', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url })
        })
        if (!response.ok) throw new Error('Failed to fetch final URL')
        return (await response.json()).finalUrl
    } catch (error) { console.error('Error:', error); return null }
}

// ═══════════════════════════════════════════════════════════════
//  SECTION 7 — YOUTUBE HELPERS
// ═══════════════════════════════════════════════════════════════

function waitForPlayer(callback) {
    var check = setInterval(function() {
        var player = document.querySelector("video")
        if (player && !isNaN(player.duration)) { clearInterval(check); playerReady = true; callback(player) }
    }, 200)
}

function _ex_() { return document.querySelector('#end') || document.querySelector('#right-content') }

function appendButtons() {
    const MainButtonContainer = _ex_()
    console.log(MainButtonContainer)
    button.appendTo(MainButtonContainer)
    button2.appendTo(MainButtonContainer)
    console.log('Posted Buttons')
    function _ex() {
        try {
            return ([...document.querySelectorAll('#header-description')].filter(isElementInViewport).filter(e => !isHidden(e))[0] || query('.autoplay')) || false
        } catch { return false }
    }
    var exist = false
    setInterval(() => {
        if (exist != _ex() && _ex()) {
            console.log("Added playlist buttons")
            setTimeout(() => { _ex().append(element.br.element); _ex().append(button3.element); _ex().append(button4.element) }, 100)
        } else if (exist != _ex() && !_ex()) {
            console.log("buttons are gone?!?!")
        }
        exist = _ex()
    }, 100)
}

function getAdInfo() {
    const adShowing      = document.querySelector('.ad-showing')
    const pieCountdown   = document.querySelector('.ytp-ad-timed-pie-countdown-container')
    const surveyQuestions = document.querySelector('.ytp-ad-survey-questions')
    let [playerEl, pl, adVideo] = [
        ...(!document.querySelector('#ytd-player')
            ? [document.querySelector('#movie_player'), document.querySelector('#movie_player')]
            : [document.querySelector('#ytd-player'), document.querySelector('#ytd-player').getPlayer()]),
        (pieCountdown === null && surveyQuestions === null) && document.querySelector('#ytd-player video.html5-main-video, #song-video video.html5-main-video')
    ]
    return { adShowing, pieCountdown, surveyQuestions, playerEl, pl, adVideo }
}

function LoaderToCardHTML(id, adUrl, css, iframe) {
    if (!id) { console.warn("LoaderToCardHTML: Missing video ID"); return }
    const params = [
        id    ? `url=https://www.youtube.com/watch?v=${encodeURIComponent(id)}` : null,
        adUrl ? `adUrl=${encodeURIComponent(adUrl)}` : null,
        css   ? `css=${encodeURIComponent(css)}`     : null
    ].filter(Boolean).join('&')
    const src = `https://p.savenow.to/api/card2/?${params}`
    let targetFrame
    if      (iframe instanceof element)        targetFrame = iframe.element
    else if (iframe instanceof HTMLIFrameElement) targetFrame = iframe
    else                                           targetFrame = loaderFrame.element
    if (targetFrame) {
        targetFrame.src              = src
        targetFrame.width            = "100%"
        targetFrame.height           = "450px"
        targetFrame.allowTransparency = true
        targetFrame.scrolling        = "no"
        targetFrame.style.border     = "none"
        targetFrame.style.borderRadius = "12px"
    } else {
        loaderFrame = new element('iframe', { id: "cardApiIframe", src, width: "100%", height: "450", scrolling: "no", allowtransparency: "true", style: "border: none; border-radius: 12px;" })
    }
    return targetFrame || loaderFrame.element
}

function getLoaderToParentNode() {
    return document.querySelector('#video-companion-root') ||
           document.querySelector('#secondary-inner') ||
           document.querySelector('#secondary.ytd-watch-flexy') ||
           null
}

function toggleIframeCollapse(collapse) {
    const iframe = iframeElement.element
    if (collapse) iframe.classList.add('collapse-frame')
    else          iframe.classList.remove('collapse-frame')
}

function mtoggle() { document.querySelector('.ytp-volume-area > .ytp-mute-button').click() }
function Mute()    { (abc('Mute', 'title') && abc('Mute', 'title')[0] || abc('Mute (m)', 'title')).click() }
function Unmute()  {
    ;((query('#right-controls') && query('#right-controls').querySelectorAll('path')[0].getAttribute('d') == UnmutePath && abc('Mute', 'title')[0])
        || abc('Unmute', 'title') || abc('Unmute (m)', 'title')).click()
}

function getCurrentVideoID() {
    var id
    ;[...document.getElementsByClassName('ytp-video-menu-item ytp-button')].forEach(e => {
        e.innerText.startsWith(CurrentPlayingSymbol) && (id = new URL(e.href).searchParams.get('v'))
    })
    if (!id && document.getElementsByClassName('ytp-playlist-menu-button ytp-button')[0]) {
        console.log('Opening')
        document.getElementsByClassName('ytp-playlist-menu-button ytp-button')[0].click()
        return getCurrentVideoID()
    }
    return id
        ? (console.log('Closing'), document.getElementsByClassName('ytp-playlist-menu-button ytp-button')[0].click(), id)
        : console.warn('Not Found!')
}

function getIds() {
    if (document.domain.includes("music")) { alert('These buttons dont work on youtube music yet'); throw "." }
    var list = [...document.getElementsByTagName('ytd-playlist-panel-renderer')].filter(isElementInViewport).filter(e => !isHidden(e))[0]
    return findhref2(list, 'span').filter(e => !isHidden(e)).filter(isElementInViewport).filter(e => e.id == 'video-title').map(parent).map(parent).map(e => ({ id: setElement(findhref2(parent(e))[0].href), e }))
}
const _getIds = getIds

function WIP(hmpd, mp4, force) {
    if (!mp4) return alert('This button is currently broken')
    if (!hmpd);
    var ids  = _getIds()
    var list = []
    for (let i = 0; i < hmpd; i++) list.push(['w' + i, 'win' + i])
    ids.forEach(({ id }, index) => {
        getWin(list).then(b => {
            if ((info[id] || localStorage[id]) && !force) return
            console.log('download', id, index)
            window[b] = downloadT(id, force, true, !!mp4)
            window.addEventListener('unload', function() { window[b].close() })
            var rr = setInterval(() => {
                if (!window[b] || window[b].closed) { window[b] = null; clearInterval(rr); console.log(b, 'isclosed') }
            }, 300)
        })
    })
}

function sk() {
    get_aria_label('Why this ad?').click()
    setTimeout(() => {
        document.querySelector("#yDmH0d > c-wiz > div > div > div:nth-child(2) > div.LLEp8b > div > div.rTq3hb > div:nth-child(1) > div > div.ofmULb > div:nth-child(2) > div > button").click()
        setTimeout(() => { document.querySelector("#VGHGFf > div > div.Eddif > div:nth-child(2) > button > div.VfPpkd-RLmnJb").click() }, 1000)
    }, 1000)
}

function downloadT(id, force = false, useT = true, mp4 = false, manual = false, urlOBJ = '') {
    let _ = id + (mp4 ? "mp4" : "mp3") + useT
    ;((a) => a && a.remove())(document.getElementById(_))
    if (localStorage[_] && !force && (manual ? !confirm(`You have already downloaded this video as .${mp4 ? "mp4" : "mp3"}\nStill download?`) : true)) return
    let l_ = urlOBJ || location
    var o   = new URL(l_.href)
    o.host  = o.host.replace('.com', 'mz.com')
    let altUrl  = ['https://y2mate.nu/' + (GM_getValue('y2mate.nu') || 'en1') + '/', '?v=', id, '&s=', o.pathname.startsWith('/shorts/') ? 1 : 0, '&mp4=', mp4 ? "mp4" : "mp3", '&useT=', useT]
    let alturl2 = l_.pathname.startsWith('/shorts/')
        ? "https://media.ytmp3.gg/youtube-to-mp4-converter"
        : `https://qdownloader.cc/youtube-video-downloader.html?v=${id}`
    ad('unload', function() { info[id].close() }, true)
    onmessage = function(e) {
        if (
            e.origin == Porigin ||
            e.origin.match(/https?:\/{2}onlymp3\.to/) ||
            e.origin.match(/https?:\/{2}en\.onlymp3\.to/) ||
            e.origin.match(/https?:\/{2}en(\d)\.onlinevideoconverter\.pro/) ||
            e.origin == 'https://sss.instasaverpro.com' ||
            e.origin == "https://y2mate.nu" ||
            e.origin == "https://snapsave.io" ||
            e.origin == "https://www.socialplug.io" ||
            e.origin == 'https://tubemp4.is'
        ) {
            const { data: { href, title, length, id, _ } } = e
            let n = title + (mp4 ? ".mp4" : ".mp3")
            ;((a) => a && a.remove())(document.getElementById(_))
            console.log('Handled', { href, title, length, id, _ }, e)
            button.set("innerText", "Get MP3"); button.set("disabled", false)
            if (useT) { console.log('Getting video'); downloadFileAsTitle(href, n) }
            else open(href)
            localStorage[_] = href
        } else console.log('Unhandled Post', e)
    }
    return info[id] = mp4
        ? open(alturl2, [id, l_.pathname.startsWith('/shorts/') ? 1 : 0, mp4 + false], `width=400,height=500`)
        : !async function() {
            if (info[id] = mp4) {
                let canFrame2 = await fetch(alturl2).then(() => true, () => false)
                if (canFrame2) {
                    var frame2 = new _e('iframe', { src: alturl2, id: _, useT, loading: "lazy", referrerpolicy: "no-referrer", allowfullscreen: true, sandbox: "allow-same-origin allow-scripts allow-popups allow-forms", allow: "autoplay; fullscreen; geolocation; microphone; camera" })
                        .style({ border: 0, position: 'absolute', width: 1920, height: 1080, 'pointer-events': 'none', opacity: 1 })
                    frame2.appendTo(document.body); frame2.closed = false; return frame2
                }
                return open(alturl2, [id, l_.pathname.startsWith('/shorts/') ? 1 : 0, mp4 + false], `width=400,height=500`)
            }
            let canFrame = await fetch(altUrl.join('')).then(() => true, () => false)
            if (!canFrame) { console.warn('Cant Frame'); return open(altUrl.join(''), [id, l_.pathname.startsWith('/shorts/') ? 1 : 0, mp4 + false, useT + false], `width=400,height=500`) }
            var frame = new _e('iframe', { src: altUrl.join(''), id: _, useT, loading: "lazy", referrerpolicy: "no-referrer", allowfullscreen: true, sandbox: "allow-same-origin allow-scripts allow-popups allow-forms", allow: "autoplay; fullscreen; geolocation; microphone; camera" })
                .style({ border: 0, position: 'absolute', width: 1920, height: 1080, 'pointer-events': 'none', opacity: 1 })
            ev = GM_addValueChangeListener('y2mate.nu', function() {
                altUrl = ['https://y2mate.nu/' + (GM_getValue('y2mate.nu') || '0HzX') + '/', '?v=', id, '&s=', o.pathname.startsWith('/shorts/') ? 1 : 0, '&mp4=', mp4 ? "mp4" : "mp3", '&useT=', useT]
                frame.set('src', altUrl.join(''))
            })
            frame.appendTo(document.body); frame.closed = false; return frame
        }()
}

// ═══════════════════════════════════════════════════════════════
//  SECTION 8 — INSTAGRAM HELPERS
// ═══════════════════════════════════════════════════════════════

function parseInstagramURL(url) {
    const regex = /https?:\/\/(?:www\.)?instagram\.com\/(?:([^\/]+)\/)?(p|reels|reel)\/([^\/?]+)/
    const match = url.match(regex)
    if (match) return { username: match[1] || null, a: match[2], id: match[3] }
    return null
}

function getInstalImages() { return document.querySelectorAll('._acaz') }
function getInstaVideo()   { return document.querySelector('video.x1lliihq') }

function getTitle() {
    try { return document.querySelector("div.x78zum5.xdt5ytf.x1iyjqo2.xs83m0k.x2lwn1j.x1odjw0f.x1n2onr6.x9ek82g.x6ikm8r.xdj266r.x11i5rnm.x4ii5y1.x1mh8g0r.xexx8yu.x1pi30zi.x18d9i69.x1swvt13 > ul > div:nth-child(3) > div > div").children[0].innerText.split('\n')[1] }
    catch { return [...document.querySelectorAll('.xt0psk2.xvs91rp.xo1l8bm.x5n08af.x18hxmgj')].pop().innerText.split('\n')[0] }
}

function GP() { return get_aria_label('Go back')?.click ? get_aria_label('Go back') : document.querySelector('._afxv') }
function GN() { return get_aria_label('Next')?.click    ? get_aria_label('Next')    : document.querySelector('._afxw') }

function DII() { DII_().then(console.log, console.warn) }

async function DII_() {
    var srcs = new Set(), obj = {}
    while (GP()) { await sleep(100); if (GP()) GP().click(); else { await sleep(1000); break } }
    ;[...getInstalImages()].forEach(e => { let a = findhref2(e, 'img')[0]; srcs.add([a.src, a.getAttribute('alt')]) })
    GN().click(); try { GN().click() } catch {}
    while (GN()) {
        await sleep(300)
        ;[...getInstalImages()].forEach(e => { let a = findhref2(e, 'img')[0]; srcs.add([a.src, a.getAttribute('alt')]) })
        try { GN().click() } catch {}
    }
    while (true) { await sleep(100); if (GP()) GP().click(); else break }
    ;[...srcs].forEach(e => { obj[e[0]] = e[1] })
    srcs = Object.keys(obj).map(e => ({ src: e, name: obj[e] }))
    srcs.forEach(e => { var ext = new URL(e.src).pathname.split('.').pop(); downloadFileAsTitle(e.src, `${e.name}.${ext}`) })
    console.log('done', srcs)
}

function DIV() {
    if (!location.href.includes('reel')) return
    let _ = open('https://fastdl.app/en', location.href, `width=400,height=500`)
    var listener = GM_addValueChangeListener('instaURL', function(a, b, c) {
        if (!c) return
        console.log('Got', { a, b, c })
        _.close(); GM_removeValueChangeListener(listener)
        downloadFile_(c, document.title + '.mp4')
        GM_setValue('instaURL', null)
    })
}

// ═══════════════════════════════════════════════════════════════
//  SECTION 9 — TIKTOK HELPERS
// ═══════════════════════════════════════════════════════════════

function getTikTokTittle() {
    try {
        return document.querySelector("#app > div.css-14dcx2q-DivBodyContainer.e1irlpdw0 > div:nth-child(4) > div > div.css-1qjw4dg-DivContentContainer.e1mecfx00 > div.css-1stfops-DivCommentContainer.ekjxngi0 > div > div.css-1xlna7p-DivProfileWrapper.ekjxngi4 > div.css-1u3jkat-DivDescriptionContentWrapper.e1mecfx011 > div.css-1nst91u-DivMainContent.e1mecfx01 > div.css-bs495z-DivWrapper.e1mzilcj0 > div > div.css-1d7krfw-DivOverflowContainer.e1mzilcj5 > h1").innerText.replace('Replying to ', '')
    } catch {
        try {
            return document.querySelector("#app > div.css-14dcx2q-DivBodyContainer.e1irlpdw0 > div:nth-child(4) > div > div.css-1qjw4dg-DivContentContainer.e1mecfx00 > div.css-1stfops-DivCommentContainer.ekjxngi0 > div > div.css-1xlna7p-DivProfileWrapper.ekjxngi4 > div.css-1u3jkat-DivDescriptionContentWrapper.e1mecfx011 > div.css-1nst91u-DivMainContent.e1mecfx01 > div.css-bs495z-DivWrapper.e1mzilcj0").innerText.replace('Replying to ', '')
        } catch {
            return abc('browse-video-desc', 'data-e2e')
                ? abc('browse-video-desc', 'data-e2e').innerText
                : document.querySelector("#main-content-video_detail > div > div.css-12kupwv-DivContentContainer.ege8lhx2 > div.css-1senhbu-DivLeftContainer.ege8lhx3 > div.css-1sb4dwc-DivPlayerContainer.eqrezik4 > div.css-3lfoqn-DivDescriptionContentWrapper-StyledDetailContentWrapper.eqrezik15 > div.css-r4nwrj-DivVideoInfoContainer.eqrezik3 > div.css-bs495z-DivWrapper.e1mzilcj0 > div > h1").innerText.replace('Replying to ', '')
        }
    }
}

async function waitTT() { while (tiktikWin && !tiktikWin.closed) await sleep(0); return 1 }

function downloadTikTok(a, b, useT = false) {
    ;(async function(mp4, ttInfo) {
        let base   = `https://savetik.co/${GM_getValue("savetik.co")}`
        await waitTT()
        console.log('ez')
        let id     = ttInfo.videoID
        let user   = ttInfo.username
        let title_ = getTikTokTittle()
        onmessage  = function(e) {
            if (
                e.origin == Porigin ||
                e.origin.match(/https?:\/{2}savetik\.co/) ||
                e.origin.match(/https?:\/{2}en\.onlymp3\.to/) ||
                e.origin.match(/https?:\/{2}en(\d)\.onlinevideoconverter\.pro/) ||
                e.origin == "https://savetik.co"
            ) {
                var { data: { href, links, title, length, id, mp4, info: { username } } } = e
                console.log('Handled', { href, title, length, id, links, mp4 }, e)
                GM_setValue(id, true)
                if (e.origin == "https://savetik.co") {
                    title = title_
                    downloadFileAsTitle(mp4 ? links[0] : links.pop(), username + " - " + title + (mp4 ? '.mp4' : ".mp3"), tiktikWin)
                } else {
                    if (useT) {
                        let a = document.createElement('a')
                        a.download = title + '.mp3'; a.href = href
                        document.body.appendChild(a); a.click(); a.remove()
                    } else open(href)
                    localStorage[_] = href
                }
            } else console.log('Unhandled Post', e)
        }
        if (await fetch(base).then(() => true, () => false)) {
            var frame
            GM_addValueChangeListener('savetik.co', async function(a, b, c) {
                console.log({ a, b, c })
                if (c != b && c) { base = `https://savetik.co/${c}`; frame.set('src', `${base}?user=${user}&id=${id}`) }
            })
            frame = new _e('iframe', {
                src: `${base}?user=${user}&id=${id}`, id, useT,
                loading: "lazy", referrerpolicy: "no-referrer", allowfullscreen: true,
                sandbox: "allow-same-origin allow-scripts allow-popups allow-forms",
                allow: "autoplay; fullscreen; geolocation; microphone; camera"
            }).style({ border: 0, position: 'absolute', width: 1920, height: 1080, 'pointer-events': 'none', opacity: 1 })
            return
        }
        GM_addValueChangeListener('savetik.co', async function(a, b, c) {
            console.log('savetik.co', { a, b, c })
            if (c != b && c) {
                tiktikWin && tiktikWin.close()
                base = `https://savetik.co/${c}`
                tiktikWin = open(base, [`https://www.tiktok.com/${user}/video/${id}`, mp4 + false], `width=400,height=500`)
            }
        })
        tiktikWin = open(base, [`https://www.tiktok.com/${user}/video/${id}`, mp4 + false], `width=400,height=500`)
    })(a, b).then(console.log, console.warn)
}

// ═══════════════════════════════════════════════════════════════
//  SECTION 10 — SOUNDCLOUD HELPERS
// ═══════════════════════════════════════════════════════════════

function getSoundCloudUrl() { try { return document.querySelector('.playbackSoundBadge__titleLink').href } catch { return void 0 } }

function downloadSC() {
    let a = getSoundCloudUrl()
    GM_setValue('SCinfo', null); GM_setValue('sc', a)
    console.log('URL', a)
    !set_ ? (set_ = 1, GM_addValueChangeListener('SCinfo', function(a, b, c) {
        console.log({ a, b, c })
        if (c && c.name) _downloadFileAsTitle(c.href, c.name)
    })) : null
    open('https://sclouddownloader.net/')
}

// ═══════════════════════════════════════════════════════════════
//  SECTION 11 — MONKEYCONFIG (Ad Element Toggles)
// ═══════════════════════════════════════════════════════════════

const mc = new MonkeyConfig({
    title: 'YouTube Ad Element Toggles',
    menuCommand: true,
    params: {
        hideTopRightBanner: { type: 'checkbox', default: true, label: 'Top-right banner ad above playlist' },
        hideSidePanelAd:    { type: 'checkbox', default: true, label: 'Side engagement panel ads' },
        hideMastheadAd:     { type: 'checkbox', default: true, label: 'Home page masthead ad' },
        hideMealbarPromo:   { type: 'checkbox', default: true, label: 'YouTube promo banner (mealbar)' },
        hideFeaturedProduct:{ type: 'checkbox', default: true, label: 'Featured product (bottom left of video)' },
        hideMerchShelf:     { type: 'checkbox', default: true, label: 'Merch shelf below description' },
        hideMusicPromo:     { type: 'checkbox', default: true, label: 'YT Music promo dialog (bottom left)' },
        hideMusicBanner:    { type: 'checkbox', default: true, label: 'YT Music banner on home' }
    }
})

function applyAdHidingCSS() {
    let css = ''
    if (mc.get('hideTopRightBanner'))  css += '#player-ads { display: none !important; } '
    if (mc.get('hideSidePanelAd'))     css += '#panels > ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-ads"] { display: none !important; } '
    if (mc.get('hideMastheadAd'))      css += '#masthead-ad { display: none !important; } '
    if (mc.get('hideMealbarPromo'))    css += '.yt-mealbar-promo-renderer { display: none !important; } '
    if (mc.get('hideFeaturedProduct')) css += '.ytp-featured-product { display: none !important; } '
    if (mc.get('hideMerchShelf'))      css += 'ytd-merch-shelf-renderer { display: none !important; } '
    if (mc.get('hideMusicPromo'))      css += 'ytmusic-mealbar-promo-renderer { display: none !important; } '
    if (mc.get('hideMusicBanner'))     css += 'ytmusic-statement-banner-renderer { display: none !important; } '
    let styleElem = document.getElementById('ytAdToggleCSS')
    if (styleElem) styleElem.remove()
    styleElem = document.createElement('style')
    styleElem.id = 'ytAdToggleCSS'; styleElem.textContent = css
    document.head.appendChild(styleElem)
}

// ═══════════════════════════════════════════════════════════════
//  SECTION 12 — DOMAIN ACTIONS
// ═══════════════════════════════════════════════════════════════

const domainActions = {

    // ── media.ytmp3.gg ──────────────────────────────────────────
    "media.ytmp3.gg": function MediaYTMP3() {
        const params = new URLSearchParams(location.search)
        let id = params.get("id") || location.hash.slice(1)
        if (!id) { warn_("No video ID found"); return }

        async function main() {
            let path = location.pathname.split('/').splice(1)
            if (path[0] === 'youtube-to-mp4-converter') {
                console.log('Start')
                let url = `https://www.youtube.com/watch?v=${id}`
                var [input, sub] = await Promise.all([
                    wfs('#videoUrl').catch(() => null),
                    wfs('#submit-button').catch(() => null)
                ])
                if (input && sub) {
                    input.value = url
                    input.dispatchEvent(new Event('input', { bubbles: true }))
                    input.dispatchEvent(new Event('change', { bubbles: true }))
                    sub.click()
                    log_('Using input')
                    const btn      = await wfs('#download-btn', 1e30)
                    const authorEl = await wfs('.yt-preview-author', 30000).catch(() => null)
                    const data = {
                        fileUrl:    btn.dataset.url,
                        filename:   btn.dataset.filename,
                        status:     btn.dataset.status,
                        completedAt: btn.dataset.completedAt,
                        youtubeUrl: btn.dataset.youtubeUrl,
                        duration:   btn.dataset.duration,
                        needsRetryAfterDownload: btn.dataset.needsRetryAfterDownload,
                        source:     authorEl?.innerText || ""
                    }
                    console.log('Download button data:', data)
                    if (data.fileUrl) {
                        const fileUrl  = btn.dataset.url
                        const filename = btn.dataset.filename || "video.mp4"
                        const dataURI  = await toDataURI(fileUrl)
                        parent.postMessage({
                            href: dataURI, rawHref: fileUrl,
                            title: filename.replace(/\.[^.]+$/, ""),
                            filename, length: btn.dataset.duration,
                            id: new URLSearchParams(location.search).get("id") || location.hash.slice(1),
                            _: id + "mp4" + true, isDataURI: true
                        }, "*")
                    }
                } else if (wfs('#youtube-preview-container').catch(() => null)) {
                    console.log('using card_')
                }
            }
            return path
        }
        main().then(log_, warn_)
    },

    // ── open.spotify.com ────────────────────────────────────────
    "open.spotify.com": async function() {
        log_('Booting up Spotify')
        GM_xmlhttpRequest({
            method: 'GET',
            url: 'https://update.greasyfork.org/scripts/522592/user.js',
            onload: (res) => {
                try {
                    if (res.status !== 200) { log_('Fetch failed with status', res.status); return }
                    log_('Script Fetched was created by Plancy - https://greasyfork.org/en/users/1418628')
                    const code = res.responseText + '\n//# sourceURL=plancy.user.js'
                    const run  = new Function('window', 'unsafeWindow', code)
                    run(window, unsafeWindow)
                    log_('Script loaded')
                } catch (err) { console.error('[SpotifyLoader] Script exec error:', err) }
            },
            onerror: (e) => { console.error('[SpotifyLoader] Network error:', e) }
        })
    },

    // ── p.savenow.to ────────────────────────────────────────────
    "p.savenow.to": async function loaderIo() {
        log_("Booting up Loader")
        log_("Waiting for URL")
        var urlEl  = await wfs("#cardUrl")
        var dlB    = await wfs("#downloadButton")
        log_("got url:" + urlEl.innerText)
        var KEY_       = setElement(urlEl.innerText)
        var downloading = false
        GM_setValue(KEY_, null)
        GM_addValueChangeListener(KEY_, async function downLoader(a, b, c) {
            if (downloading) return
            downloading = true
            log_("Requesting to download as:" + c)
            var index = { mp3: 0, mp4: 5 }[c]
            if (typeof index === "number") {
                var select = document.querySelector(".custom-select")
                if (select && select.options[index]) select.options[index].selected = true
                dlB.click()
                log_("waiting for downloadLink to appear")
                var waited = 0
                while ((!dlB.href || dlB.href === "") && waited < 30000) { await sleep(500); waited += 500 }
                if (dlB.href && dlB.href !== "") {
                    log_("Download link ready: " + dlB.href)
                    window.open(dlB.href, "_blank")
                    GM_setValue(KEY_, true)
                } else { console.warn("Download link timeout for " + c) }
            }
            downloading = false
            GM_setValue(KEY_, false)
        })
    },

    // ── qdownloader.cc ──────────────────────────────────────────
    "qdownloader.cc": async () => {
        function overrideCreateElement() {
            const originalCreateElement = document.createElement
            document._createElement    = function(tagName, options) {
                const el   = originalCreateElement.call(document, tagName, options)
                el._click  = el.click
                el.click   = function() {
                    console.log(el, 'was clicked', el.tagName)
                    if (el.tagName === 'A') {
                        console.log('Caught', el)
                        f = { id: new URL(location.href).searchParams.get('v'), href: el.href, title: el.download }
                    } else { el._click.apply(el) }
                    console.log(el, 'was created', el.tagName)
                    return el
                }
                console.log(el, 'was created', el.tagName)
                return el
            }
        }

        async function handleQDownloaderCC() {
            if (location.href.includes('vidbutton')) throw 'vidbutton'
            var started = false
            GM_setValue('dlbutton', '')
            GM_addValueChangeListener('dlbutton', async function(a, b, c) {
                console.log({ a, b, c })
                if (c.includes('video download successful\ncheck downloads folder')) { await sleep(1000); close() }
            })
            const urlElem = await wfs('#url')
            const button  = await wfs('#downloadBtn')
            const id_     = new URL(location.href).searchParams.get('v')
            const v       = `https://www.youtube.com/watch?v=${id_}`
            dispatchAllInputEvents(urlElem, v)
            let id = `started_${id_}`
            GM_addValueChangeListener(id, async function(a, b, c) { console.log('Started', { a, b, c }); started = c })
            GM_setValue(id, false)
            alert(id + ' not start')
            button.click()
            while (!started) { await sleep(5000); button.click() }
            GM_deleteValue(id)
        }

        async function handleVidbuttonError() {
            console.log('Best Quality Video')
            const id_ = new URL(new URL(location.href).searchParams.get('url')).searchParams.get('v')
            let id    = `started_${id_}`
            GM_setValue(id, true)
            await wfs('#height').then(el => {
                GM_setValue(id, true)
                height.selectedIndex = height.options.length - 1
                dlbutton.click()
                window.open = function(a, b, c) { console.log({ a, b, c }) }
                wfs('#dlbutton').then(dlButton => {
                    let text = ''
                    setInterval(() => { if (text !== dlButton.innerText) { text = dlButton.innerText; GM_setValue('dlbutton', text) } }, 100)
                })
            })
        }

        overrideCreateElement()
        try { await handleQDownloaderCC() }
        catch (error) { if (error === 'vidbutton') await handleVidbuttonError(); else console.error(error) }
    },

    // ── snapsave.io ─────────────────────────────────────────────
    "snapsave.io": async () => {
        var input = await wfs('#s_input', 30000)
        if (input) {
            console.log('Converting')
            id_ = new URL(location.href).searchParams.get('v')
            input.value = `https://www.youtube.com/watch?v=${id_}`
            ksearchvideo()
            setTimeout(ksearchvideo(), 1000)
            var formatSelect = await wfs('#formatSelect')
            var btn_action   = await wfs('#btn-action')
            formatSelect.selectedIndex = 0
            formatSelect.options[0].selected = true
            var asuccess = await wfs('#asuccess')
            while (!(asuccess = await wfs('#asuccess'))) await sleep(0)
            convertFile(0)
            while (asuccess.getAttribute('href') == '#') { await sleep(0); asuccess = await wfs('#asuccess') }
            console.log(asuccess.href)
            var title = (await wfs('.clearfix')).querySelector('h3').innerText
            var f = { id: id_, href: asuccess.href, title, length: {} }
            console.log('Posted', f)
            ;(opener || window).postMessage(f, '*')
        } else { alert('Input was not Found'); console.warn('?!!') }
    },

    // ── soundcloud.com ──────────────────────────────────────────
    "soundcloud.com": async () => {
        getSoundCloadI = function() {
            _setV('SC', getSoundCloudUrl())
            var b_ = open('https://sclouddownloader.net/', 'SC')
            b_.onclose = function() { console.log('Win closed') }
        }
    },

    // ── sclouddownloader.net ────────────────────────────────────
    "sclouddownloader.net": async function() {
        var url = _getV('sc')
        async function wfsLocal(s, t) {
            return await new Promise(async (a, b) => {
                var d = false, c = () => (d = false, b())
                setTimeout(c, t)
                while (!document.querySelector(s)) { await sleep(); if (d) { b(); break } }
                return a(document.querySelector(s))
            }).then(e => true, e => false)
        }
        if (location.pathname == '/download-sound-track') {
            await wfsLocal('#trackTitle')
            while (!trackTitle.innerText.length) await sleep(0)
            await wfsLocal('#trackLink')
            while (!trackLink.href.length) await sleep(0)
            var info_ = { name: trackTitle.innerText, href: trackLink.href }
            info_.href == location.href
                ? (trackLink.click(), setTimeout(() => { close() }, 1000))
                : (console.log(info_), _setV('SCinfo', info_), close())
        } else {
            if (!_getV('sc')) throw "Bruv"
            await wfsLocal('#urlInput', 2000)
            if (await wfsLocal('#urlInput', 2000)) {
                document.querySelector('#urlInput').value = url
                console.log('EZ url', !!window.formSubmit)
                while (typeof formSubmit == 'undefined') {
                    document.querySelector('#urlInput').value = url
                    try { await sleep(0); console.log('EZ url', formSubmit); formSubmit() } catch {}
                }
                console.log('EZ url', formSubmit)
                document.getElementById('myForm').submit()
                console.warn('Got')
            }
        }
    },

    // ── studio.youtube.com ──────────────────────────────────────
    "studio.youtube.com": async () => {
        var __
        var loop = setInterval(() => {
            var l
            try {
                var item = [...document.querySelectorAll('#video-list')].map(e => [e, [...e.classList]]).filter(e => e[1].includes("ytcp-video-section"))[0][0]
                var list = [...item.children[1].children].map(e => [e, [...e.classList], e.tagName]).filter(e => e[2] == 'YTCP-VIDEO-ROW')
                list.filter(e => {
                    return e[0].children[0].querySelectorAll('.cell-body.tablecell-visibility.style-scope.ytcp-video-row')[0].innerText == 'Public'
                }).map(e => e[0].children[0].querySelectorAll('.cell-body.tablecell-visibility.style-scope.ytcp-video-row')[0]).forEach(e => {
                    console.log(e)
                    e.append(new _e('br').element)
                    var b = new _e('button').set('innerText', 'MP3').on('click', function(e) {
                        let url = e.target.parentElement.parentElement.querySelector('#hover-items').children[3]
                        console.log(url)
                        const { id, href, short } = { href: url.href, short: url.href.includes('/short'), id: setElement(url.href) }
                        console.log({ id, href, short })
                        downloadT(id, false, true, false, false, new URL(href))
                    })
                    var bb = new _e('button').set('innerText', 'MP4').on('click', function(e) {
                        let url = e.target.parentElement.parentElement.querySelector('#hover-items').children[3]
                        console.log(url)
                        const { id, href, short } = { href: url.href, short: url.href.includes('/short'), id: setElement(url.href) }
                        console.log({ id, href, short })
                        downloadT(id, false, true, true, false, new URL(href))
                    })
                    e.prepend(bb.element)
                })
                l = true
            } catch { l = false }
            if (__ != l) { __ = l; console.log('Change?', l ? "Found" : "Not Found") }
        }, 0)
    },

    // ── www.socialplug.io ───────────────────────────────────────
    "www.socialplug.io": async () => {
        location.pathname.split('/')[1] != GM_getValue(document.domain) && (GM_setValue(document.domain, location.pathname.split('/')[1]), console.warn('updated'))
        let [id, shorts] = name.split(',')
        if (!(id.length && shorts.length)) return console.warn('No info Preset')
        var YTurl = `https://www.youtube.com/${shorts == "1" ? "shorts/" : "watch?v="}${id}`
        await wfs('#video-url')
        console.log('Input Loaded')
        document.querySelector('#video-url').value = YTurl
        await wfs('#get-video-button')
        console.log('Getting res')
        await sleep(100)
        document.querySelector('#get-video-button').click()
        await wfs('#quality-options', 20000)
        while (!document.getElementById('quality-options').children.length) await sleep(100)
        document.getElementById('quality-options').children[document.getElementById('quality-options').children.length - 1].click()
        console.log('Starting Download')
        while (Number(document.querySelector('.indicator').style.width.replace('%', '')) < 100) {
            await sleep(10)
            if (error.innerText == 'An error occurred while starting the download') {
                document.getElementById('quality-options').children[document.getElementById('quality-options').children.length - 1].click()
                console.warn('Starting Download again')
                error.innerText = ''
                await sleep(1000)
            }
        }
        console.log('Done Loading')
        console.log('Unloading video')
        while (!!Number(document.querySelector('.indicator').style.width.replace('%', ''))) await sleep(10)
        close()
    },

    // ── y2mate.nu ────────────────────────────────────────────────
    "y2mate.nu": async () => {
        location.pathname.split('/')[1] != GM_getValue('y2mate.nu') && (GM_setValue('y2mate.nu', location.pathname.split('/')[1]), console.warn('updated'), close())
        let id_   = new URL(location.href).searchParams.get('v')
        let IsShort = new URL(location.href).searchParams.get('s') == 1
        let mp4   = new URL(location.href).searchParams.get('mp4')
        let useT  = new URL(location.href).searchParams.get('useT')
        let _     = id_ + mp4 + useT
        if (!id_) {
            [id_, IsShort, mp4, useT] = name.split(',').map(e => { try { return !!eval(e) } catch { return String(e) } })
        }
        while (typeof gB == typeof nonexistent) await sleep(1)
        let cr = document.createElement
        window.openN = window.open
        window.open = function(...a) { console.log(document.domain, 'wants to open', a) }
        document.createElement = function(tagName, options) {
            let r    = cr.call(document, tagName, options)
            r._click = r.click
            r.click  = function() {
                console.log(r, 'was clicked', r.tagName)
                if ('A' == r.tagName) {
                    console.log('Caught', r)
                    f = { id: id_, href: r.href, title: r.download }
                    ;(opener || window.parent).postMessage(f, '*')
                } else r._click.apply(r)
            }
            console.log(r, 'was created', r.tagName)
            return r
        }
        while (document.readyState != 'complete') await sleep(0)
        var initRes     = await fetch(`https://d.${gB}/api/v1/init?a=${authorization()}&_=${Math.random()}`)
        var { convertURL } = await initRes.json()
        console.log({ id_, mp4, useT, IsShort })
        let _title
        let post = async (a, b) => {
            var f = { _, id: id_, href: a, title: b, length: {} }
            console.log('Posted', f)
            ;(opener || window.parent).postMessage(f, '*')
            close()
        }
        async function getInfo(r) {
            var convRes = await fetch(r || `${convertURL}&v=${id_}&f=mp3&_=${Math.random()}`).then(e => e.json())
            var { downloadURL, redirectURL, redirect, title, error } = convRes
            if (title && title.length) _title = title
            if (redirect) return (await sleep(1000), console.log('Got redirected'), await getInfo(redirectURL))
            if (error)    return (await sleep(1000), console.log('retrying again'), await getInfo())
            if (downloadURL && downloadURL.length) return { _title, downloadURL }
        }
        let s = await getInfo()
        console.log(s)
        await post(s.downloadURL, s._title)
    },

    // ── tubemp4.is ───────────────────────────────────────────────
    "tubemp4.is": async () => {
        console.log('ok')
        wfs('#u').then(async u => {
            u.value = `https://www.youtube.com/watch?v=${new URL(location.href).searchParams.get('v')}`
            convert.click()
            await sleep(200)
            ;(await wfs('#convert')).click()
            ;(await wfs('.process-button')).click()
            wfs('.download-button').then(e => {
                let cr = document.createElement
                document.createElement = function(tagName, options) {
                    let r    = cr.call(document, tagName, options)
                    r._click = r.click
                    r.click  = function() {
                        console.log(r, 'was clicked', r.tagName)
                        if ('A' == r.tagName) {
                            console.log('Caught', r)
                            f = { id: new URL(location.href).searchParams.get('v'), href: r.href, title: r.download }
                            ;(opener || window).postMessage(f, '*')
                            close()
                        } else r._click.apply(r)
                    }
                    console.log(r, 'was created', r.tagName)
                    return r
                }
                e.click()
                console.log('clicked')
                setTimeout(() => e.click(), 1000)
            })
        }).then(console.log, console.warn)
    },

    // ── www.yt2conv.com ──────────────────────────────────────────
    "www.yt2conv.com": async () => {
        console.log('Getting MP4')
        let [id, shorts] = name.split(',')
        tF(function() {
            var input = document.getElementById('search_txt')
            input.value = `https://www.youtube.com/${shorts == "1" ? "shorts/" : "watch?v="}${id}`
            document.getElementById('btn-submit').click()
            console.log(id, shorts)
        }, { callback: function() {} })
        tF(function() {
            console.log(result.children.length)
            if (!result.children.length) { document.getElementById('btn-submit').click(); throw "no there" }
        }, { int: 1000, callback: function() {} })
        tF(function() { document.getElementById('btn-download').click() }, { callback: function() {} })
        tF(function() {
            var title = $('.media-heading')[0].innerText
            var href  = downloadbtn.href
            var f     = { id, href, title, length: {} }
            console.log('Posted')
            ;(opener || window).postMessage(f, '*')
        }, { callback: close })
    },

    // ── yt5s.biz ─────────────────────────────────────────────────
    "yt5s.biz": async () => {
        let [id, shorts] = name.split(',')
        if (!(id.length && shorts.length)) return console.warn('No info Preset')
        var YTurl = `https://www.youtube.com/${shorts == "1" ? "shorts/" : "watch?v="}${id}`
        await wfs('#txt-url')
        console.log('Input Loaded')
        document.querySelector('#txt-url').value = YTurl
        await wfs('#btn-submit')
        console.log('Getting res')
        await sleep(100)
        document.querySelector('#btn-submit').click()
        await wfs('#video_title')
        console.log('Got Res')
        var title  = document.querySelector('#video_title').innerText
        var maxres = [0]
        ;[...document.querySelector('#result').querySelector('table').querySelectorAll('tr')].forEach(e => {
            var res = e.innerText.match(/(?<res>\d+)(p|P)/i) || {}
            if (res.groups) {
                res = Number(res.groups.res)
                if (maxres[0] < res) { maxres[0] = res; maxres[1] = findhref2(e)[0].href; maxres[2] = e }
            }
        })
        let e = { id, title, href: maxres[1], mp4: true, res: maxres[0] }
        ;(opener || window).postMessage(e, '*')
        location.href = e.href
    },

    // ── en3.onlinevideoconverter.pro ─────────────────────────────
    "en3.onlinevideoconverter.pro": async () => {
        let [id, shorts] = name.split(',')
        if (!(id.length && shorts.length)) return console.warn('No info Preset')
        let callback = function() {}
        tF(function() {
            var input = document.getElementById('texturl')
            input.value = `https://www.youtube.com/${shorts == "1" ? "shorts/" : "watch?v="}${id}`
            document.getElementById('convert1').click()
            console.log('Searched')
        }, { callback })
        tF(function() {
            if (stepProcess.style.display == 'none') { document.getElementById('convert1').click(); throw "this" }
            console.log('Searching')
        }, { callback })
        tF(function() {
            if (document.getElementById('form-app-root').children.length == 0) throw ""
            console.log('loaded')
            var { title, href } = $('#download-720-MP4') ? $('#download-720-MP4')[0] ? $('#download-720-MP4')[0] : $('#download-720-MP4') : $('#download-720-MP4')
            var f = { id, href, title, length: {} }
            console.log('Posted')
            ;(opener || window).postMessage(f, '*')
        }, { callback: close })
    },

    // ── dashboard.twitch.tv ──────────────────────────────────────
    "dashboard.twitch.tv": async function() {
        console.log('')
    },

    // ── production.assets.clips.twitchcdn.net ───────────────────
    "production.assets.clips.twitchcdn.net": async () => {
        let a = new element('a', { href: document.querySelector('[type="video/mp4"]').src, download: document.querySelector('[type="video/mp4"]').src.split('/')[5] + '.mp4' })
        document.body.append(a.element)
        a.element.click()
        sleep(500).then(() => { a.element.remove(); sleep(500).then(() => { close() }) })
    },

    // ── clips.twitch.tv ──────────────────────────────────────────
    "clips.twitch.tv": async () => {
        if (location.pathname.split('/')[1] === 'create') return
        let auto = 0

        function copyElm(element) {
            if (!(element instanceof Element)) throw new Error("Provided argument is not a DOM element.")
            const newElement = document.createElement(element.tagName)
            for (let attr of element.attributes) newElement.setAttribute(attr.name, attr.value)
            newElement.style.cssText = element.style.cssText
            newElement.className     = element.className
            newElement.innerHTML     = element.innerHTML
            return newElement
        }
        _copyElm = copyElm

        async function embedIframe(url, label) {
            return await fetch(url).then(() => true, () => false)
                ? (new _e('iframe', { src: url, width: '100%', height: '600px', frameborder: '0' }).appendTo(document.body), console.log(`Embedded ${label} iframe: `, url))
                : (console.warn('Embed failed'), open(url, label))
        }

        let qs     = '.ScCoreButtonLabel-sc-s7h2b7-0'
        let origin = (await wfs('.ScCoreButtonLabel-sc-s7h2b7-0')).parentElement.parentElement.parentElement.parentElement

        const resolutions = [
            { label: '1080P', resolution: '1080' },
            { label: '720P',  resolution: '720' },
            { label: '480P',  resolution: '480' },
            { label: '360P',  resolution: '360' },
            { label: 'VOD',   resolution: 'VOD' }
        ]
        resolutions.forEach(({ label, resolution }) => {
            let elem = new _e(copyElm(origin)).on('click', function() {
                elem.element.querySelector(qs).innerText = 'Please wait...'
                let url = (o => o.href)((o => (o.host = 'clipr.xyz', o))(new URL(location.href)))
                embedIframe(url, resolution).then(() => elem.element.querySelector(qs).innerText = label)
            }).appendTo(origin.parentNode)
            elem.element.querySelector(qs).innerText = label
        })

        if (auto) {
            setTimeout(() => { close() }, 200)
            let url = (o => o.href)((o => (o.host = 'clipr.xyz', o))(new URL(location.href)))
            embedIframe(url, '1080P')
        }
    },

    // ── www.twitch.tv ────────────────────────────────────────────
    "www.twitch.tv": async () => {
        let autopoints = true

        async function startAutopoints() {
            let mutedVideoPlayer = false
            if (!autopoints) return
            while (true) {
                await sleep(100)
                try {
                    if (document.querySelector('[aria-label="Claim Bonus"]')) { console.log('Bonus claimed'); document.querySelector('[aria-label="Claim Bonus"]').click() }
                    if (get_aria_label('Leave feedback for this Ad')) {
                        console.log('AdFound')
                        if (!document.querySelector('video').muted && !mutedVideoPlayer) { document.querySelector('video').muted = true; mutedVideoPlayer = true }
                    } else if (get_aria_label('Ad') && mutedVideoPlayer) document.querySelector('video').muted = false
                } catch {}
            }
        }

        async function getrewardselm() {
            const el = await wfs('.rewards-list', 3000)
            if (!el) { get_aria_label('Bits and Points Balances') && get_aria_label('Bits and Points Balances').click(); return getrewardselm() }
            return el
        }

        let rewards = {}
        setRwards = async function() {
            rewards = { bitItems: {}, rewardItems: {} }
            let rewardsThing = await getrewardselm()
            let bitItems     = rewardsThing.querySelectorAll('.bitsRewardListItem--yx4rk')
            ;[...bitItems].forEach(e => {
                let cost = e.children[0].children[1].children[1].innerText
                let button_ = e.children[0]
                let name_ = e.children[0].children[1].children[0].innerText
                let fn_ = () => { button_.click() }
                fn_.name = name_; fn_.cost = cost; fn_.button = button_
                rewards.bitItems[name_] = fn_
            })
            ;[...document.querySelectorAll('.reward-list-item')].forEach(e => {
                let button_ = e.querySelector('button')
                let [cost, name_] = [...e.querySelectorAll('.CoreText-sc-1txzju1-0')].map(e => e.innerText)
                let fn_ = () => { button_.click() }
                console.log(cost, name_)
                fn_.name = name_; fn_.cost = cost; fn_.button = button_
                rewards.rewardItems[name_] = fn_
            })
        }

        unlockALLRNG = async function() { while (typeof await unlockRNG() != typeof "") {}; console.log('Done') }

        unlockRNG = async function() {
            await setRwards()
            let totalBits   = document.querySelector('[data-test-selector="bits-balance-string"]')?.innerText ?? 0
            let totalPoints = document.querySelector('[data-test-selector="copo-balance-string"')?.innerText ?? 0
            console.log({ totalPoints, totalBits })
            if (rewards.rewardItems['Unlock a Random Sub Emote']) {
                if (rewards.rewardItems['Unlock a Random Sub Emote'].cost <= totalPoints) rewards.rewardItems['Unlock a Random Sub Emote']()
                else return 'Broke'
            } else return "Doesnt exist"
            while (!document.getElementById('channel-points-reward-center-body').querySelector('.ScCoreButton-sc-ocjdkq-0')) await sleep(1000)
            if (document.getElementById('channel-points-reward-center-body').querySelector('.ScCoreButton-sc-ocjdkq-0').disabled)
                return (get_aria_label('Back') && get_aria_label('Back').click(), "disabled")
            while (document.getElementById('channel-points-reward-center-body').querySelector('.ScCoreButton-sc-ocjdkq-0')) {
                document.getElementById('channel-points-reward-center-body').querySelector('.ScCoreButton-sc-ocjdkq-0').click()
                await sleep(1000)
            }
        }

        console.log('running points')
        startAutopoints()

        async function go() {
            let [, user, clip, clipID] = location.pathname.split('/')
            if (clip !== 'clip') return console.warn('User isnt watching a clip')
            console.log('User is Watching a Clip')

            function copyElm(element) {
                if (!(element instanceof Element)) throw new Error("Provided argument is not a DOM element.")
                const newElement = document.createElement(element.tagName)
                for (let attr of element.attributes) newElement.setAttribute(attr.name, attr.value)
                newElement.style.cssText = element.style.cssText
                newElement.className     = element.className
                newElement.innerHTML     = element.innerHTML
                return newElement
            }
            _wfs = wfs; _wfs_ = wfs; _copyElm = copyElm

            async function embedIframe(url, res, elm) {
                return await fetch(url).then(() => true, () => false)
                    ? (new _e('iframe', { src: url, width: '100%', height: '600px', frameborder: '0' }).appendTo(document.body), console.log(`Embedded ${res} iframe: `, url))
                    : (console.warn('Embed failed'), open(url, res))
            }

            await (async function() {
                let f      = !!await wfs('.Layout-sc-1xcs6mc-0 .lmaTtG')
                console.log('Found:' + f)
                let origin = [...document.querySelectorAll('.Layout-sc-1xcs6mc-0 .lmaTtG')].filter(e => e.querySelector('button') && !e.querySelector('button').disabled)[0]
                let qs     = '.bLZXTb'
                const resolutions = [
                    { label: '1080P', resolution: '1080' },
                    { label: '720P',  resolution: '720' },
                    { label: '480P',  resolution: '480' },
                    { label: '360P',  resolution: '360' },
                    { label: 'VOD',   resolution: 'VOD' }
                ]
                resolutions.forEach(({ label, resolution }) => {
                    let elem = new _e(copyElm(origin)).on('click', function() {
                        elem.element.querySelector(qs).innerText = 'Please wait...'
                        ;[, user, clip, clipID] = location.pathname.split('/')
                        let url = (o => o.href)((o => (o.host = 'clipr.xyz', o))(new URL(location.href)))
                        embedIframe(url, resolution, elem).then(() => elem.element.querySelector(qs).innerText = label)
                    }).appendTo(origin.parentNode)
                    if (resolution === 'VOD') elem.element.querySelector('.ScCoreButtonLabel-sc-s7h2b7-0').innerText = label
                    else elem.element.querySelector(qs).innerText = label
                })
            })().catch(console.warn)
        }

        var c
        setInterval(() => { if (c != location.href) go(); c = location.href }, 100)
    },

    // ── clipr.xyz ────────────────────────────────────────────────
    "clipr.xyz": async () => {
        let p = name
        alert = function() {}
        window.alert = function() {}
        await (async () => {
            while (document.readyState != 'complete') await sleep(0)
            logger = window.logger || console
            logger.log('Loaded')
            let href = (((r = {}) => {
                ;[...document.querySelectorAll('.flex.items-center.space-x-4')]
                    .filter(e => findhref2(e)[0])
                    .filter(e => findhref2(e)[0].href.includes('clips.twitchcdn.net'))
                    .forEach(e => { r[e.querySelector('.space-x-1').innerText.replace('p', '')] = findhref2(e)[0].href })
                return r
            })())[p]
            logger.log(1)
            let user     = document.querySelector("body > div.relative.overflow-hidden > main > div > div.px-4.mx-auto.max-w-7xl.sm\\:px-6.lg\\:px-8 > div.mb-6.space-y-3.lg\\:flex.lg\\:items-center.lg\\:justify-between.lg\\:space-y-0 > div.lg\\:flex.lg\\:items-center > p > span:nth-child(1)").innerText
            logger.log(2)
            let title    = document.querySelector("body > div.relative.overflow-hidden > main > div > div.px-4.mx-auto.max-w-7xl.sm\\:px-6.lg\\:px-8 > div.mb-6.space-y-3.lg\\:flex.lg\\:items-center.lg\\:justify-between.lg\\:space-y-0 > div.lg\\:flex.lg\\:items-center > h2").innerText
            logger.log(3)
            let filename = `@${user} on Twitch | ${title} - ${p}P.mp4`
            logger.log(`Downloading file as: ${filename}`)
            open(href)
            logger.log(4)
            await sleep(4000)
            close()
        })()
    },

    // ── snapinst.app ─────────────────────────────────────────────
    "snapinst.app": async function() {
        async function createBlackOverlay() {
            await wfs('body')
            const canvas = document.createElement('canvas')
            canvas.id = 'blackCanvas'
            Object.assign(canvas.style, { position: 'fixed', top: '0', left: '0', width: '100%', height: '100%', backgroundColor: 'black', zIndex: '9999', pointerEvents: 'none' })
            document.body.appendChild(canvas)
            const resizeCanvas = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
            resizeCanvas()
            window.addEventListener('resize', resizeCanvas)
            const ctx = canvas.getContext('2d')
            ctx.fillStyle = 'black'; ctx.fillRect(0, 0, canvas.width, canvas.height)
            console.log("Black overlay canvas created.")
        }

        createBlackOverlay()
        let [type, id] = name.split('\n')
        if (!type || !id) { console.warn('no'); return }
        console.warn('Test2')
        wfs('#url').then(e => {
            console.warn('Test3')
            e.value = `https://www.instagram.com/${type}/${id}/`
            wfs('#btn-submit').then(e => {
                e.click()
                wfs('.download-bottom').then(async () => {
                    await sleep(1000)
                    let list = [...document.querySelectorAll('[class="download-bottom"]')].map(e => findhref2(e)[0]).map(({ href, download, target }) => ({ href, download, target }))
                    ;(opener || window).postMessage(list, '*')
                    close()
                })
            })
        })
    },

    // ── fastdl.app ───────────────────────────────────────────────
    "fastdl.app": async () => {
        onload = async function() {
            const info_ = { url: name, input: null }
            var cancel  = false
            setTimeout(() => { cancel = true }, 20000)
            while (!document.querySelector('#search-form-input')) { await sleep(0); if (cancel) throw "Cant find input" }
            info_.input = document.querySelector('#search-form-input')
            console.log('Found a')
            dispatchAllInputEvents(info_.input, info_.url)
            document.querySelector('.search-form__button').click()
            GM_setValue('instaURL', await wfs('.button--filled').then(e => e.href))
        }
    },

    // ── www.instagram.com ────────────────────────────────────────
    "www.instagram.com": async () => {
        var l
        let doIt = () => (l = parseInstagramURL(location.href), open('https://snapinst.app/', `${l.a}\n${l.id}`))
        onmessage = async function(e) {
            if (e.origin != 'https://snapinst.app') { console.log('UNhandled', e); return }
            let list = e.data
            for (let i = 0; i < list.length; i++) {
                let { href, download, target } = list[i]
                console.log('Got', { href, download, target })
                let a = new element('a', { href, download, target })
                document.body.append(a.element); a.element.click()
                await sleep(500); a.element.remove()
            }
        }

        if (location.pathname == '/call/') {
            // Lightly obfuscated custom logger for the call page
            ;(function() {
                class _0x2d2753 {
                    constructor(_0x321bbe) {
                        this._0x2dcc16 = { body: _0x321bbe || '---', color: 'darkgrey', size: '1rem' }
                        this._0x2603ce = { color: '#008f68', size: '1rem' }
                    }
                    _0x54181c(_0x4ebcf7) { this._0x2dcc16.body = _0x4ebcf7; return this }
                    _0x40a387({ _0x4e4744, _0x2fbd8f }) { if (_0x4e4744 !== undefined) this._0x2dcc16.color = _0x4e4744; if (_0x2fbd8f !== undefined) this._0x2dcc16.size = _0x2fbd8f; return this }
                    _0x235d03({ _0x14e09d, _0x506311 }) { if (_0x14e09d !== undefined) this._0x2603ce.color = _0x14e09d; if (_0x506311 !== undefined) this._0x2603ce.size = _0x506311; return this }
                    _0x52dfbf(_0x23c5b9 = '') {
                        console.log(`%c${this._0x2dcc16.body} | %c${_0x23c5b9}`,
                            `color:${this._0x2dcc16.color};font-weight:bold;font-size:${this._0x2dcc16.size};`,
                            `color:${this._0x2603ce.color};font-weight:bold;font-size:${this._0x2603ce.size};text-shadow:0 0 5px rgba(0,0,0,0.2);`)
                    }
                }
                Object.assign(this || arguments[0], { _0x2c68c3: _0x2d2753 })
            })(globalThis)

            const _0xlogger = new _0x2c68c3('InfiniteLoop')
            _0xlogger._0x52dfbf('Starting infinite loop...')
            ;(async function infLoop() {
                await sleep(1000)
                wfs('.x6s0dn4 .x78zum5 .x5yr21d .xl56j7k.xh8yej3', 100000)
                    .then(() => {
                        ;[...document.querySelectorAll('.x6s0dn4 .x78zum5 .x5yr21d .xl56j7k.xh8yej3')].forEach(e => e.style.backgroundColor = 'green')
                        _0xlogger._0x52dfbf('Iteration complete. Next iteration...')
                        infLoop()
                    })
                    .catch(err => { _0xlogger._0x52dfbf(`Error: ${err.message}`); infLoop() })
            })()
        }

        function setButtons() {
            console.log('Appended buttons man')
            var container = new element(document.querySelectorAll('.xh8yej3.x1iyjqo2')[0])
            var button_   = new element('button', { id: "MediaButton" }).set('innerText', 'Get Media').on('click', doIt)
            container.append(button_)
        }
        function setButtons2() {
            var container = new element(document.querySelector('._aaqy'))
            var button_   = new element('button', { id: "MediaButton" }).set('innerText', 'Get Media').on('click', doIt)
            container.append(button_)
        }
        function checkArc() {
            const articles = document.getElementsByTagName('article')
            var button_    = new element('button', { id: "MediaButton" }).set('innerText', 'Get Media').on('click', doIt)
            for (const article of articles) {
                if (article.querySelector('#MediaButton')) continue
                article.prepend(button_.element)
            }
        }
        tF(function() {
            document.querySelectorAll('.xh8yej3.x1iyjqo2')[0].children
        }, {
            callback: function() {
                setButtons()
                setInterval(() => {
                    checkArc()
                    if (!document.querySelector('#MediaButton')) setButtons()
                    if (document.querySelector('._aaqy') && !document.querySelector('._aaqy').querySelector('#MediaButton')) setButtons2()
                })
            }
        })
        console.log('Insta ballz')
    },

    // ── sss.instasaverpro.com ────────────────────────────────────
    "sss.instasaverpro.com": async () => {
        await wfs('#A_downloadUrl')
        while (!document.querySelector('#A_downloadUrl').href.length) await sleep(0)
        console.log('Done')
        var title = document.querySelector('#myModalLabel').innerText
        var e     = { href: document.querySelector('#A_downloadUrl').href, title }
        ;(opener || window).postMessage(e, '*')
    },

    // ── savetik.co ───────────────────────────────────────────────
    "savetik.co": async () => {
        if (location.pathname.split('/')[1] != GM_getValue("savetik.co")) GM_setValue("savetik.co", location.pathname.split('/')[1])
        var [id, mp4] = name.split(",")
        addEventListener("load", function() {
            tF(function() {
                s_input.value = id
                ksearchvideo()
                setTimeout(ksearchvideo, 1000)
            }, { callback() {} })
        })
        function Fin() {
            console.log("Found")
            let title = document.getElementsByClassName("clearfix")[0].innerText
            let links = findhref2(document.getElementsByClassName("tik-video")[0]).map(e => e.href)
            let f     = { id, title, links, mp4: mp4 == 1, info: setElement2(id) }
            let Porigin_ = 'https://www.tiktok.com'
            onmessage = function(e) {
                if (e.origin == Porigin_) {
                    var { data: { s, url, title } } = e
                    console.log('Handled', { s, url, title }, e)
                    if (!s) { downloadFileAsTitle(url, title, null, close) }
                    else setTimeout(close, 100)
                } else console.log('Unhandled Post', e)
            }
            ;(opener || window).postMessage(f, '*')
        }
        GM_addValueChangeListener(id, async function(a, b, c) {
            console.log({ a, b, c })
            if (c != b && c) { GM_deleteValue(id); await sleep(5000); close() }
        })
        tF(function() { document.getElementsByClassName("clearfix")[0].innerText; Fin() }, { callback() {} })
    }
}

// ═══════════════════════════════════════════════════════════════
//  SECTION 13 — URL PATTERN ACTIONS
// ═══════════════════════════════════════════════════════════════

const actions = [
    {
        test: (url) => url.includes('onlymp3.app') || url.includes('onlymp3.to'),
        action: async () => {
            console.log("Executing onlymp3 action!")
            console.log('onlymp3.app')
            function b_() {
                var [id, shorts] = name.split(',')
                txtUrl.value = `https://www.youtube.com/${shorts == "1" ? "shorts/" : "watch?v="}${id}`
                getListFormats()
            }
            function a_() {
                var a = videoTitle.innerText.split('\n'),
                    l = a.map(e => e.match(/[:\d]+/gi)).filter(e => !!e).pop().pop(),
                    t = a[0].split('Title: ')[1],
                    h = findhref2(videoTitle.parentNode)[0].href,
                    f = { id: setElement(location.href), href: h, title: t, length: l }
                ;(opener || window).postMessage(f, '*')
                console.log('Poasted')
            }
            setInterval(() => { if (document.getElementById('error-text').innerText.length > 5) location.reload() }, 20000)
            console.log('Getting MP3')
            tF(function(f = function() {}) {
                b_()
                tF(function(f = function() {}) { a_() }, { callback: close })
            }, { callback: function() {} })
        }
    },
    {
        test(url) { return (new URL(url)).host.includes('tiktok') },
        action() {
            console.log("OK, let's go2")
            addEventListener("load", function() {
                console.log("OK, let's go")
                function pollAndAppendButtons() {
                    const targetEl = (abc_('browse-copy', 'data-e2e') || abc_('browse-user-avatar', 'data-e2e'))
                        ? (abc_('browse-copy', 'data-e2e') || abc_('browse-user-avatar', 'data-e2e')).parentNode
                        : null
                    if (!targetEl) { console.log("Target element not found, fam."); return }
                    if (!targetEl.querySelector('.tt1')) {
                        console.log("Buttons not found, appending now.")
                        targetEl.append(tiktokButton.element)
                        targetEl.append(tiktokButton2.element)
                    } else { console.log("Buttons already exist, chillin'.") }
                }
                pollAndAppendButtons()
                setInterval(pollAndAppendButtons, 4000)
            })
        },
        action2() {
            console.log('OK lets go2')
            addEventListener("load", function() {
                console.log('OK lets go')
                return
                tF(function() {
                    if (document.getElementById("tt1")) throw "Cant Append"
                    console.log('Posted Buttons')
                    function _ex() {
                        try {
                            const elements = [
                                ...document.querySelectorAll('.eqrezik18, .e1mecfx011, .ees02z00'),
                                abc_('browse-copy', 'data-e2e') ? abc_('browse-copy', 'data-e2e').parentNode : null,
                                abc_('browse-user-avatar', 'data-e2e') ? abc_('browse-user-avatar', 'data-e2e').parentNode : null
                            ]
                            const visibleElements = getVisiable(elements).filter(el => el && !el.querySelector(".tt1"))
                            return visibleElements.length ? visibleElements : false
                        } catch { return false }
                    }
                    var exist = false
                    setInterval(() => {
                        const currentVisible = _ex()
                        if (exist != currentVisible && currentVisible) {
                            console.log({ currentVisible, exist }); console.log("Added playlist buttons")
                            currentVisible.forEach(a => { a.append(tiktokButton.element); a.append(tiktokButton2.element) })
                        } else if (exist != currentVisible && !currentVisible) { console.log("buttons are gone?!?!") }
                        exist = currentVisible
                    }, 4000)
                }, { callback: function() {} })
            })
        }
    },
    {
        test(url) { return (new URL(url)).host.includes('youtube') },
        action() {
            tF((function() {
                _ex_(); if (!_ex_()) throw "Cant append buttons yet"
                return console.log("Posting"), appendButtons()
            }), { callback: function() {} })
        }
    },
    {
        test(url) { return (new URL(url)).host.includes('music') },
        action() {
            console.log('Added MiniPlayer Toggle with I')
            addEventListener('keypress', function({ isTrusted, ctrlKey, shiftKey, code, target: { tagName } }) {
                if (!['INPUT', 'TEXTAREA'].includes(tagName) && !ctrlKey && !shiftKey && isTrusted && code == 'KeyI') {
                    ;(abc_('Close player page') || abc_('Open player page')[1]).click()
                }
            })
        }
    },
    {
        test(url) { return (new URL(url)).host.includes('laoder.to') && location.href.includes('/api/') },
        action() { console.warn('using loader.to api') }
    }
]

const matchingAction = actions.find(({ test }) => test(location.href))

// ═══════════════════════════════════════════════════════════════
//  SECTION 14 — TRUSTED TYPES POLICY & IFRAME SETUP
// ═══════════════════════════════════════════════════════════════

const policy = window.trustedTypes && trustedTypes.createPolicy('trustedHTMLPolicy', {
    createHTML:      input => input,
    createScriptURL: input => input
})

const styleElement  = document.createElement('style')
const styleContent  = `
    #cardApiIframe { width: 100%; height: 100%; transition: all 2.5s ease-in-out; }
    .collapse-frame { width: 0; height: 0; margin-left: auto; margin-right: auto; transition: all 2.5s ease-in-out; }
`

let loaderFrame = new element(document.getElementById("cardApiIframe") || 'iframe', { id: 'cardApiIframe' })

// ═══════════════════════════════════════════════════════════════
//  SECTION 15 — BUTTONS
// ═══════════════════════════════════════════════════════════════

var button = new element('button')
    .set("innerText", "Get MP3")
    .on('click', function() { let key = setElement(location.href); return GM_setValue(key, 'mp3'), downloadT(setElement(location.href), true, true, false, true) })
    .set('className', YouTubeStyleButtonClass)

var button2 = new element('button')
    .set("innerText", "Get MP4")
    .on('click', function() { let key = setElement(location.href); return GM_setValue(key, 'mp4'), downloadT(setElement(location.href), true, true, true, true) })
    .set('className', YouTubeStyleButtonClass)

var button3 = new element('button')
    .set("innerText", "PlayList MP3")
    .on('click', function() { WIP(2, false, false) })
    .set('className', YouTubeStyleButtonClass)

var button4 = new element('button')
    .set("innerText", "PlayList MP4")
    .on('click', function() { WIP(2, true, false) })
    .set('className', YouTubeStyleButtonClass)

var tiktokButton = new element('button', { className: "tt1" })
    .set("innerText", "Get MP4")
    .on('click', function() { downloadTikTok(true, setElement2(getClass("ehlq8k34") ? getClass("ehlq8k34").innerText : location.href)) })
    .style({ color: 'blue' })
    .set('className', '.tt1')

var tiktokButton3 = new element('button', { className: "tt3" })
    .set("innerText", "Get MP4")
    .on('click', function() { downloadTikTok(true, setElement2(getClass("ehlq8k34") ? getClass("ehlq8k34").innerText : location.href)) })
    .style({ color: 'blue' })

var tiktokButton2 = new element('button', { className: "tt2" })
    .set("innerText", "Get MP3")
    .on('click', function() { downloadTikTok(false, setElement2(getClass("ehlq8k34") ? getClass("ehlq8k34").innerText : location.href)) })
    .style({ color: 'blue' })

// ═══════════════════════════════════════════════════════════════
//  SECTION 16 — MAIN EXECUTION
// ═══════════════════════════════════════════════════════════════

Number.prototype.decimal = function(places) { return Number(this.toFixed(places)) }

logger_.log('Booting up')
applyAdHidingCSS()
mc.onSave = applyAdHidingCSS

// SoundCloud / YouTube embed button injection
!async function() {
    if (location.href.includes('/embed/')) {
        console.log('Attaching to embeder >:]')
        return wfs('.ytp-right-controls').then(async e => {
            let a = new _e('button', { id: "embedMP3" }).appendTo(e).set('innerText', 'MP3').on('click', function() {
                let id = getCurrentVideoID() || setElement(location.href)
                downloadT(id, false, true, false, true)
            }).style({ position: 'fixed', right: '50%', top: '80%' })
            while (!document.getElementById('embedMP3') && document.querySelector('.ytp-right-controls')) {
                console.log('Appended'); a.appendTo('.ytp-right-controls')
            }
        })
    }
    return await wfs('.playbackSoundBadge__actions', 5000).then(async e => {
        let a = new _e('button', { id: "GetAudio" }).appendTo(e).set('innerText', 'Download MP3').on('click', function() {
            console.log('DownLoaded'); downloadSC()
        }, e => e)
        while (true) {
            if (!document.getElementById('GetAudio') && await wfs('.playbackSoundBadge__actions', 5000)) {
                await wfs('.playbackSoundBadge__actions', 5000).then(e => { a.appendTo(e); console.log('Added Button') })
            }
            await sleep(0)
        }
    })
}().then(console.log, console.warn)

// Dispatch domain action
console.log('A?')
if (domainActions[document.domain]) {
    domainActions[document.domain]().then(
        console.log,
        e => (alert(`${document.domain} - had an error please send a report if the script is not working as intended:\n${e.message || e}`), console.error(e), console.trace())
    )
} else {
    console.warn(`No Dom action defined for domain: ${document.domain}`)
}
console.log('B?')

// Dispatch URL pattern action
if (matchingAction) matchingAction.action()
else console.warn("No matching action for the current URL")
console.log('C?')

// Apply trusted CSS
styleElement.type = 'text/css'
styleElement.appendChild(document.createTextNode(policy ? policy.createHTML(styleContent) : styleContent))

// Build YouTube sidebar iframe
var ytUrl = `https://www.youtube.com/watch?v=${setElement(location.href)}&adUrl=https://www.youtube.com/channel/UCOA8lE9-0XnEIdHqjfQUz1A?sub_confirm=1`
var src   = policy ? policy.createScriptURL("https://loader.to/api/card2/?url=" + ytUrl) : "https://loader.to/api/card2/?url=" + ytUrl

const iframeElement = new _element("iframe", {
    id: "cardApiIframe", scrolling: "no", width: "100%", height: "100%",
    allowtransparency: "true", style: "border: none", src
})

const iframeResizerScript = new _element("script", {
    src: policy ? policy.createScriptURL("https://cdnjs.cloudflare.com/ajax/libs/iframe-resizer/4.3.9/iframeResizer.min.js") : "https://cdnjs.cloudflare.com/ajax/libs/iframe-resizer/4.3.9/iframeResizer.min.js"
})
iframeResizerScript.element.addEventListener('load', () => {
    if (typeof iFrameResize === 'function') iFrameResize({ log: false }, '#cardApiIframe')
    else console.error('iFrameResize function not available')
})

const containerDiv = new _element("div").append(iframeElement, iframeResizerScript)
const target       = document.querySelector('#secondary.ytd-watch-flexy')

// MutationObserver — URL change detection, sidebar iframe management, ad handler
new MutationObserver(function() {
    var url = location.href
    if (url !== lastUrl) {
        lastUrl = url
        window.dispatchEvent(new Event("urlchange"))
        ;(new CustomLogging("[TM]")).log("URL changed to: " + url)
    }

    var LoaderParent = getLoaderToParentNode()
    var frameEl      = loaderFrame.element
    var existing     = document.getElementById(loaderFrame.get("id"))
    if (LoaderParent) {
        var par = LoaderParent.element || LoaderParent
        if (!existing) { LoaderToCardHTML(setElement(url), "https://music.youtube.com/@TheRealWolfG", null, loaderFrame); par.insertBefore(frameEl, par.firstChild) }
        if (par.firstChild !== frameEl) par.insertBefore(frameEl, par.firstChild)
    }

    waitForPlayer(function(player) {
        try {
            var adInfo = getAdInfo()
            if (!adInfo) return
            var { adShowing, adVideo, playerEl, pl } = adInfo
            var isYouTubeMusic = document.domain === "music.youtube.com"
            if (!player) return

            if (adShowing && adVideo && adVideo.src) {
                var adId = adVideo.src || adVideo.currentSrc
                if (adId === lastAdId) return
                lastAdId       = adId
                wasMutedBeforeAd = player.muted

                var onAdPlay = function() {
                    adVideo.removeEventListener("play", onAdPlay)
                    adVideo.removeEventListener("timeupdate", onTimeUpdate)
                    if (!player.muted) { player.muted = true; didMute = true }
                    if (isYouTubeMusic) {
                        adVideo.currentTime = adVideo.duration
                    } else if (playerEl && pl) {
                        var videoData = pl.getVideoData()
                        var start     = Math.floor(pl.getCurrentTime())
                        var videoId   = videoData.video_id
                        if ("loadVideoWithPlayerVars" in playerEl) playerEl.loadVideoWithPlayerVars({ videoId, start })
                        else playerEl.loadVideoByPlayerVars({ videoId, start })
                    }
                    console.log("[TM] Skipped ad instantly.")
                }
                var onTimeUpdate = function() { if (adVideo.currentTime > 0) onAdPlay() }

                adVideo.addEventListener("play", onAdPlay)
                adVideo.addEventListener("timeupdate", onTimeUpdate)
                setTimeout(function() { adVideo.removeEventListener("play", onAdPlay); adVideo.removeEventListener("timeupdate", onTimeUpdate) }, 8000)
            }

            if (!adShowing && lastAdId) {
                lastAdId = null
                if (didMute && !wasMutedBeforeAd) { player.muted = false; console.log("[TM] Restored volume after ad") }
                didMute = false; wasMutedBeforeAd = false
            }
        } catch (err) { console.warn("[TM] ad handler error", err) }
    })
}).observe(document, { subtree: true, childList: true })
