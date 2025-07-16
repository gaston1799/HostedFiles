// ==UserScript==
// @name         Gaston's - Video/Image Downloader
// @namespace    http://tampermonkey.net
// @version      10.3
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
// @match         *://www.twitch.tv/*
// @match         *://www.socialplug.io/*
// @match         *://snapinst.app/*
// @match         *://loader.to/*
// @match         *://onlymp3.app/*
// @match         *://qdownloader.cc/*
// @match         *://tubemp4.is/*
// @match         *://snapsave.io/*
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
// @grant   GM_info
// @grant   GM_xmlhttpRequest
// @grant   GM_getValue
// @grant   GM_setValue
// @grant   GM_addStyle
// @grant   GM_registerMenuCommand
// @grant   GM_xmlhttpRequest
// @grant   GM_deleteValue
// @require https://update.greasyfork.org/scripts/439099/1203718/MonkeyConfig%20Modern%20Reloaded.js
// @require      https://cdn.jsdelivr.net/gh/naquangaston/HostedFiles@main/UserScripts/Updater.js
// @grant   GM_addValueChangeListener
// @grant   GM_removeValueChangeListener
// @run-at document-start
// ==/UserScript==
/**
 * Call callback when element matching `selector` is added.
 *
 * @param {string} selector
 * @param {(el: Element) => void} callback
 */
function onElementReady(selector, callback) {
    const obs = new MutationObserver((_, o) => {
        document.querySelectorAll(selector).forEach(el => {
            callback(el);
            o.disconnect();
        });
    });
    obs.observe(document.body, { childList: true, subtree: true });
}


class videoPlayer{
    #isF=function(){
        return this.isFullScreen
    }
    #isT=function(){
        return this.isTheater
    }
    #isM=function(){
        return this.isMini
    }
    set isMini(a){
        if(a&&!this.#isM()){
            document.querySelector('[title="Miniplayer (i)"]').click()
        }
        else if(!a&&this.#isM()){
            document.querySelector('[title="Expand (i)"]').click()
        }
    }
    get isMini(){
        return !document.querySelector('[title="Miniplayer (i)"]')
    }
    set isTheater(a){
        if(!a&&this.#isT()){
            document.querySelector('[title="Default view (t)"]').click()
        }else if(a&&!this.#isT()){
            document.querySelector('[title="Theater mode (t)"]').click()
        }
    }
    get isTheater(){
        return !document.querySelector('[title="Theater mode (t)"]')
    }
    set isFullScreen(a=this.#isF()){
        if(a&&!this.#isF()){
            document.querySelector('[title="Full screen (f)"]').click()
        }else if(!a&&this.#isF()){
            document.querySelector('[title="Exit full screen (f)"]').click()
        }
    }
    get isFullScreen(){return !document.querySelector('[title="Full screen (f)"]')}
}
class element {
    static get br() {
        return new element("br");
    }
    constructor(tag, props = {}) {
        // If tag is already an HTML element, use it directly.
        if (tag instanceof HTMLElement) {
            this.element = tag;
        } else {
            this.element = document.createElement(tag);
            for (let key in props) {
                if (key === "className") {
                    // Set the class properly.
                    this.element.className = props[key];
                } else {
                    this.element.setAttribute(key, props[key]);
                }
            }
        }
    }
    style(styles) {
        for (let prop in styles) {
            this.element.style[prop] = styles[prop];
        }
        return this;
    }
    append(target, ...targets) {
        this.element.append(target.element || target);
        for (let i = 0; i < targets.length; i++) {
            this.element.append(targets[i].element || targets[i]);
        }
        return this;
    }
    appendTo(target) {
        (target.element || (typeof target === 'string' ? document.querySelector(target) : target)).append(this.element);
        return this;
    }
    on(event, callback) {
        this.element.addEventListener(event, callback);
        return this;
    }
    set(prop, value) {
        if (prop === "className") {
            // Remove a leading period if it's there.
            if (typeof value === "string" && value.startsWith('.')) {
                value = value.substring(1);
            }
            this.element.className = value;
        } else {
            this.element[prop] = value;
        }
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
        return Array.from(this.element.children);
    }
}

_element=_e=element;
function dispatchAllInputEvents(target, value) {
    const inputEvents = ['focus', 'input', 'change', 'blur'];

    inputEvents.forEach(eventName => {
        let ev=new Event(eventName, { bubbles: true, isTrusted: true })
        if(target[`on${eventName}`])target[`on${eventName}`](ev)

        if (eventName === 'input') {
            target.value = value;
        }
        target.dispatchEvent(ev);
    });
};
(function() {
    return "no more askinf for feed back";
    'use strict';

    // Interval between prompts in milliseconds (2 weeks)
    const promptInterval = ((((14 * 24) * 60) * 60) * 1000);

    // Key to store the last prompt date
    const lastPromptKey = 'feedbackPromptLastDate';
    const isFirstTimeKey = 'isFirstTimeKey';

    // Function to extract script ID from scriptUpdateURL
    function getScriptId() {
        if (typeof GM_info !== 'undefined' && GM_info.scriptUpdateURL) {
            const updateURL = GM_info.scriptUpdateURL;
            const scriptIdMatch = updateURL.match(/\/scripts\/(\d+)\//);
            if (scriptIdMatch && scriptIdMatch[1]) {
                return scriptIdMatch[1];
            }
        }
        console.error('Script ID not found in the update URL.');
        return null;
    }

    // Function to show the feedback prompt
    async function showFeedbackPrompt() {
        const scriptId = getScriptId();
        if (scriptId) {
            const feedbackUrl = `https://greasyfork.org/en/scripts/${scriptId}/feedback`;
            if (confirm('Are you enjoying this script? Would you like to provide feedback?')) {
                window.open(feedbackUrl, '_blank');
            }
            // Update the last prompt date
            await GM.setValue(lastPromptKey, Date.now());
        }
    }

    // Main function to check and prompt
    (async function() {
        const isFirstTime = await GM.getValue(isFirstTimeKey, !0);
        const lastPromptDate = await GM.getValue(lastPromptKey, Date.now());
        if ((Date.now() - lastPromptDate) > promptInterval) {
            showFeedbackPrompt();
            isFirstTime&&GM.setValue(isFirstTimeKey, false);
        }
        console.log('FirstTime:',isFirstTime)
    })();
})();
;(function(){
    class CustomLogging {
        constructor(title) {
            this.title = {
                body: title || "---",
                color: "darkgrey",
                size: "1rem"
            }
            this.body = {
                color: "#008f68",
                size: "1rem"
            };
        }

        setTitleBody(title) {
            this.title.body = title;
            return this;
        }

        setTitleStyle({ color, size }) {
            if (color !== undefined) this.title.color = color;
            if (size !== undefined) this.title.size = size;
            return this;
        }

        setBodyStyle({ color, size }) {
            if (color !== undefined) this.body.color = color;
            if (size !== undefined) this.body.size = size;
            return this;
        }

        log(body = "") {
            console.log(
                `%c${this.title.body} | %c${body}`,
                `color: ${this.title.color}; font-weight: bold; font-size: ${this.title.size};`,
                `color: ${this.body.color}; font-weight: bold; font-size: ${this.body.size}; text-shadow: 0 0 5px rgba(0,0,0,0.2);`
            );
        }
    }
    Object.assign(this || arguments[0], { CustomLog: CustomLogging })
})(top);


function downloadFileAsTitle(url, filename) {
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
}
console.log('ok')
var CurrentPlayingSymbol='▶'
function getV(a,v){return GM_getValue(a)||(GM_setValue(a,v),v)}
function setV(a,v){GM_setValue(a,v)}

async function getFinalUrlFromServer(url) {
    try {
        const response = await fetch('http://localhost:3000/get-final-url', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ url })
        });

        if (!response.ok) {
            throw new Error('Failed to fetch final URL');
        }

        const data = await response.json();
        return data.finalUrl;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

_getV=getV
_setV=setV
//wip for soundcload
/*
async function wfs(s,t){

    return await new Promise(async (a,b)=>{
        var d=!1
        var c=()=>(d=0,b())
        let _=setTimeout(c,t)
        while(!document.querySelector(s)){
            await sleep()
            if(d){b();break}
        }
        return a()
    }).then(e=>true,e=>false)
}
if(location.pathname=='/download-sound-track'){
    document.querySelector('.btn.sc-btn').click()
        close()
}
else{
var input1='#urlInput'
var button1='#submitBtn'
await wfs(input1,2000)
if(await wfs(input1,2000)){
    document.querySelector(input1).value=url
    document.querySelector(button1).click()
}
}*/
Number.prototype.decimal=function(places){
    return Number(this.toFixed(places))
}
getSoundCloudUrl=()=>{
    try{return findhref2(document.querySelector("#app > div.playControls.g-z-index-control-bar.m-visible > section > div > div.playControls__elements > div.playControls__soundBadge.sc-ml-3x > div"))[0].href}catch{return void 0}
}
function getCurrentVideoID(){
    var id
    [...document.getElementsByClassName('ytp-video-menu-item ytp-button')].forEach((e,t)=>{
        e.innerText.startsWith(CurrentPlayingSymbol)&&(
            id=new URL(e.href).searchParams.get('v')
        )
    })
    if(!id&&document.getElementsByClassName('ytp-playlist-menu-button ytp-button')[0]){
        console.log('Opening')
        document.getElementsByClassName('ytp-playlist-menu-button ytp-button')[0].click();
        return getCurrentVideoID()

    }else return id?(console.log('Closiung'),document.getElementsByClassName('ytp-playlist-menu-button ytp-button')[0].click(),id):console.warn('Not Found!')
}
var adev,set_
downloadSC=function(){
    GM_setValue('SCinfo',null)
    GM_setValue('sc',getSoundCloudUrl())
    !set_?(set_=1,GM_addValueChangeListener('SCinfo',function(a,b,c,d){
        console.log({a,b,c,d})
        if(c&&c.name){
            _downloadFileAsTitle(c.href,c.name)
        }
    })):null
    open('https://sclouddownloader.net/')
}
const sleep=ms=>new Promise(a=>setTimeout(a,ms))
window.sleep=sleep;
GM_setValue_=GM_setValue
GM_getValue_=GM_getValue
GM_info_=GM_info
var UnmutePath='M3.15,3.85l4.17,4.17L6.16,9H3v6h3.16L12,19.93v-7.22l2.45,2.45c-0.15,0.07-0.3,0.13-0.45,0.18v1.04 c0.43-0.1,0.83-0.27,1.2-0.48l1.81,1.81c-0.88,0.62-1.9,1.04-3.01,1.2v1.01c1.39-0.17,2.66-0.71,3.73-1.49l2.42,2.42l0.71-0.71 l-17-17L3.15,3.85z M11,11.71v6.07L6.52,14H4v-4h2.52l1.5-1.27L11,11.71z M10.33,6.79L9.62,6.08L12,4.07v4.39l-1-1V6.22L10.33,6.79 z M14,8.66V7.62c2,0.46,3.5,2.24,3.5,4.38c0,0.58-0.13,1.13-0.33,1.64l-0.79-0.79c0.07-0.27,0.12-0.55,0.12-0.85 C16.5,10.42,15.44,9.1,14,8.66z M14,5.08V4.07c3.95,0.49,7,3.85,7,7.93c0,1.56-0.46,3.01-1.23,4.24l-0.73-0.73 C19.65,14.48,20,13.28,20,12C20,8.48,17.39,5.57,14,5.08z'
var mutePath='M17.5,12c0,2.14-1.5,3.92-3.5,4.38v-1.04c1.44-0.43,2.5-1.76,2.5-3.34c0-1.58-1.06-2.9-2.5-3.34V7.62 C16,8.08,17.5,9.86,17.5,12z M12,4.07v15.86L6.16,15H3V9h3.16L12,4.07z M11,6.22L6.52,10H4v4h2.52L11,17.78V6.22z M21,12 c0,4.08-3.05,7.44-7,7.93v-1.01c3.39-0.49,6-3.4,6-6.92s-2.61-6.43-6-6.92V4.07C17.95,4.56,21,7.92,21,12z'
_downloadFileAsTitle=async function (url, title,win,cb) {
    // Create a hidden anchor element
    const anchor = document.createElement('a');
    anchor.style.display = 'none';
    document.body.appendChild(anchor);

    // Fetch the file data
    return fetch(url)
        .then(response => response.blob())
        .then(blob => {
        // Create an object URL from the blob
        const objectUrl = URL.createObjectURL(blob);

        // Set anchor attributes
        anchor.href = objectUrl;
        anchor.download = title;
        anchor.target = '_blank';
        // Programmatically click the anchor element to trigger download
        anchor.click();

        // Clean up the object URL
        URL.revokeObjectURL(objectUrl);

        ;(win||opener||window).postMessage({url,title,s:true},'*');
        (typeof cb).includes('function')&&(cb());
    })
        .catch(error => {

        console.error('Error downloading file:', error);
        ;(win||opener||window).postMessage({url,title,s:false},'*')

    });
}
function downloadFile_(url, name) {
    // Create an 'a' element
    const a = document.createElement('a');

    // Set the 'href' attribute to the provided URL
    a.href = url;

    // Set the 'download' attribute to the provided name
    a.download = name;

    // Append the 'a' element to the document body
    document.body.appendChild(a);

    // Programmatically click the 'a' element to trigger the download
    a.click();

    // Remove the 'a' element from the document body
    document.body.removeChild(a);
}
_downloadFile_=downloadFile_
const query=function(a,d){
    try{
        let c=typeof $!='undefined'?$:document.querySelectorAll
        return !d?((b)=>Object.keys(b).length?b:null)(c(a)?c(a).length?c(a)[0]:c(a):null):[...document.querySelectorAll(a)].filter(e=>!(el.offsetParent === null))[0]
    }catch{}
}
getElementByAttribute=function getElementByAttribute(label,item='aria-label',doc=document.body){
    var res=[];
    function part2(e){
        if(e.getAttribute(item)==label){
            res.push(e);
        }else{
            if(e.children.length){
                e=e.children;
                e.forEach=[].forEach;
                e.forEach(e2=>{
                    part2(e2);
                })
            }
        }
    };
    part2(doc);
    return res.length==1?res[0]:res||false;
}
get_aria_label=function(label,doc=document.body){
    var res=[];
    function part2(e){
        if(e.getAttribute('aria-label')==label){
            res.push(e);
        }else{
            if(e.children.length){
                e=e.children;
                e.forEach=[].forEach;
                e.forEach(e2=>{
                    part2(e2);
                })
            }
        }
    };
    part2(doc);
    return res[0]||false;
}
getClass=function(name_){
    return document.getElementsByClassName("ehlq8k34")[0]
}
async function downloadVideo(url,title) {
    try {
        // Fetch the URL, allowing fetch to follow redirects
        const response = await fetch(url);

        // Check if the response is okay (status 200-299)
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Get the final URL after following redirects
        const finalUrl = response.url;

        // Create a blob from the response
        const blob = await response.blob();

        // Create a URL for the blob
        const blobUrl = window.URL.createObjectURL(blob);

        // Create a link element and set its href to the blob URL
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download =title; // Set the desired file name

        // Append the link to the document body and click it to start download
        document.body.appendChild(link);
        link.click();

        // Clean up and revoke the object URL
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);

        console.log(`Video downloaded from: ${finalUrl}`);
    } catch (error) {
        console.error('Failed to download video:', error);
    }
}
!async function(){
    async function wfs(s,tm=30000){
        var b
        sleep(tm).then(e=>b=true)
        while(!document.querySelector(s)){
            await sleep(0)
            if(b)break;
        }
        return document.querySelector(s)
    }
    if(location.href.includes('/embed/')){
        console.log('Attaching to embeder >:]')
        return wfs('.ytp-right-controls').then(async e=>{
            let a=new _e('button',{id:"embedMP3"}).appendTo(e).set('innerText','MP3').on('click',function(){
                let id=getCurrentVideoID()||setElement(location.href)
                downloadT(id,false,true,false,true)
            }).style({
                position:'fixed',
                right:'50%',
                top:'80%'
            })
            while(!document.getElementById('embedMP3')&&document.querySelector('.ytp-right-controls')){
                console.log('Appended')
                a.appendTo('.ytp-right-controls')
            }
        })
    }
    document.querySelector('.ytp-right-controls')
    return await wfs('.playbackSoundBadge__actions',5000).then(async e=>{
        let a=new _e('button',{id:"GetAudio"}).appendTo(e).set('innerText','Download MP3').on('click',function(){
            downloadSC()
        },e=>e)
        while(true){
            if(!document.getElementById('GetAudio') && await wfs('.playbackSoundBadge__actions',5000)){
                await wfs('.playbackSoundBadge__actions',5000).then( e=>{
                    a.appendTo(e)
                    console.log('Added Button')
                })
            }
            await sleep(0)
        }
    })
}().then(console.log,console.warn)
;(function() {
    const actions = [
        {
            test: (url) => url.includes('onlymp3.app') || url.includes('onlymp3.to'),
            action: async () => {
                // Onlymp3-specific async code here
                console.log("Executing onlymp3 action!");
                console.log('onlymp3.app')
                let callback=function(){};
                function b_(){
                    var [id,shorts]=name.split(',')
                    txtUrl.value=`https://www.youtube.com/${shorts=="1"?"shorts/":"watch?v="}${id}`
                    getListFormats();
                }
                function a_(){
                    var a=videoTitle.innerText.split('\n'),
                        l=a.map(e=>e.match(/[:\d]+/gi)).filter(e=>!!e).pop().pop(),
                        t=a[0].split('Title: ')[1],
                        h=findhref2(videoTitle.parentNode)[0].href,
                        f={
                            id:setElement(location.href),
                            href:h,
                            title:t
                            ,length:l
                        };
                    (opener||window).postMessage(f,'*')
                    console.log('Poasted')
                }
                setInterval(()=>{
                    if(document.getElementById('error-text').innerText.length>5)location.reload();
                },20000)
                console.log('Getting MP3')
                tF(function(f=function(){}){
                    b_()
                    tF(function(f=function(){}){
                        a_()
                    },{callback:close})
                },{callback:function(){}})
                return

            }
        },
        {
            test(url){
                return(new URL(url)).host.includes('tiktok')
            },
            action() {
                console.log("OK, let's go2");
                addEventListener("load", function() {
                    console.log("OK, let's go");

                    // Polling function that checks for the fallback element and appends buttons if missing
                    function pollAndAppendButtons() {
                        // Get the fallback target element
                        const targetEl = (abc_('browse-copy', 'data-e2e') || abc_('browse-user-avatar', 'data-e2e'))?(abc_('browse-copy', 'data-e2e') || abc_('browse-user-avatar', 'data-e2e')).parentNode:null;
                        if (!targetEl) {
                            console.log("Target element not found, fam.");
                            return;
                        }
                        // If button with class .tt1 isn't found, append the buttons
                        if (!targetEl.querySelector('.tt1')) {
                            console.log("Buttons not found, appending now.");
                            targetEl.append(tiktokButton.element);
                            targetEl.append(tiktokButton2.element);
                        } else {
                            console.log("Buttons already exist, chillin'.");
                        }
                    }

                    // Run the polling function right away
                    pollAndAppendButtons();
                    // Set up an indefinite loop that checks every 4 seconds
                    setInterval(pollAndAppendButtons, 4000);
                });
            },
            action2(){
                console.log('OK lets go2')
                addEventListener("load", function () {
                    console.log('OK lets go');
                    // Initialize the function
                    return
                    tF(function () {
                        if (document.getElementById("tt1")) throw "Cant Append";

                        console.log('Posted Buttons');

                        // Function to get visible elements without a child `#tt1`
                        function _ex() {
                            try {
                                // Select elements by class or fallback
                                const elements = [...document.querySelectorAll('.eqrezik18, .e1mecfx011, .ees02z00'),abc_('browse-copy', 'data-e2e')?abc_('browse-copy', 'data-e2e').parentNode:null,abc_('browse-user-avatar', 'data-e2e')?abc_('browse-user-avatar', 'data-e2e').parentNode:null]
                                /*document.querySelectorAll('.eqrezik18, .e1mecfx011, .ees02z00').length
                                ? document.querySelectorAll('.eqrezik18, .e1mecfx011, .ees02z00')
                                : [abc_('browse-copy', 'data-e2e').parentNode];*/

                                // Filter visible elements and exclude those with a child `#tt1`
                                const visibleElements = getVisiable(elements).filter(el => el&&!el.querySelector(".tt1"));

                                // Return visible elements or false
                                if (visibleElements.length) return visibleElements;
                                else return false;
                            } catch (err) {
                                return false;
                            }
                        }

                        var exist = false;

                        // Polling mechanism to detect changes
                        setInterval(() => {
                            const currentVisible = _ex();
                            if (exist != currentVisible && currentVisible) {
                                console.log({currentVisible,exist})
                                console.log("Added playlist buttons");

                                // Append buttons to all new visible elements
                                currentVisible.forEach(a => {
                                    a.append(tiktokButton.element);
                                    a.append(tiktokButton2.element);
                                });
                            } else if (exist != currentVisible && !currentVisible) {
                                console.log("buttons are gone?!?!");
                            }

                            exist = currentVisible;
                        }, 4000);
                    }, { callback: function () { } });
                });
            }
        },
        {
            test(url){return(new URL(url)).host.includes('youtube')},
            action(){
                tF((function() {
                    _ex_();
                    if (!_ex_()) throw "Cant append buttons yet";
                    return console.log("Posting"), appendButtons()
                }), {
                    callback: function() {}
                })
            }
        },
        {
            test(url){return(new URL(url)).host.includes('music')},
            action(){
                console.log('Added MiniPlayer Toggle with I')
                addEventListener('keypress',function({isTrusted,ctrlKey,shiftKey,code,target,target:{tagName}}){
                    if(!['INPUT','TEXTAREA'].includes(tagName)&&!ctrlKey&&!shiftKey&&isTrusted&&code=='KeyI'){
                        (abc_('Close player page')||abc_('Open player page')[1]).click()
                    }
                })
            }
        },
        {
            test(url){return(new URL(url)).host.includes('laoder.to')&&location.href.includes('/api/')},
            action(){
                console.warn('using loader.to api')
            }
        },
    ];

    const domainActions = {

        //works with all
        "qdownloader.cc":async()=>{
            // Helper function: Wait for a selector with timeout
            async function wfs(selector, ms = 20000) {
                let timeoutOccurred = false;
                setTimeout(() => {
                    console.log('TimeOut for', selector);
                    timeoutOccurred = true;
                }, ms);

                while (!document.querySelector(selector)) {
                    console.log('_', selector, timeoutOccurred);
                    await sleep(500);
                    if (timeoutOccurred) break;
                }

                console.log(selector, timeoutOccurred);
                if (timeoutOccurred) throw 'NotFound';
                return document.querySelector(selector);
            }

            // Helper function: Dispatch input events on a target element
            function dispatchAllInputEvents(target, value) {
                const inputEvents = ['focus', 'input', 'change', 'blur'];
                inputEvents.forEach(eventName => {
                    const ev = new Event(eventName, { bubbles: true, isTrusted: true });
                    if (target[`on${eventName}`]) target[`on${eventName}`](ev);
                    if (eventName === 'input') {
                        target.value = value;
                    }
                    target.dispatchEvent(ev);
                });
            }

            // Helper function: Override document.createElement with custom behavior
            function overrideCreateElement() {
                const originalCreateElement = document.createElement;
                document._createElement = function(tagName, options) {
                    const el = originalCreateElement.call(document, tagName, options);
                    el._click = el.click;
                    el.click = function() {
                        console.log(el, 'was clicked', el.tagName);
                        if (el.tagName === 'A') {
                            console.log('Caught', el);
                            const title = el.download;
                            const href = el.href;
                            // f is defined globally or elsewhere
                            f = {
                                id: new URL(location.href).searchParams.get('v'),
                                href,
                                title
                            };
                        } else {
                            el._click.apply(el);
                        }
                        console.log(el, 'was created', el.tagName);
                        return el;
                    };
                    console.log(el, 'was created', el.tagName);
                    return el;
                };
            }

            // Separate async function for the main downloader actions
            async function handleQDownloaderCC() {

                if (location.href.includes('vidbutton')) throw 'vidbutton';
                var started=false
                GM_setValue('dlbutton', '');
                GM_addValueChangeListener('dlbutton', async function(a, b, c, d) {
                    console.log({ a, b, c, d });
                    if (c.includes('video download successful\ncheck downloads folder')) {
                        await sleep(1000);
                        close();
                    }
                });

                const urlElem = await wfs('#url');
                const button = await wfs('#downloadBtn');
                const id_ = new URL(location.href).searchParams.get('v');
                const v = `https://www.youtube.com/watch?v=${id_}`;
                dispatchAllInputEvents(urlElem, v);
                let id=`started_${id_}`
                GM_addValueChangeListener(id, async function(a, b, c, d) {
                    console.log('Started',{ a, b, c, d });
                    started=c
                });
                GM_setValue(id, false);
                alert(id+' not start')
                button.click();
                while(!started){
                    await sleep(5000);
                    button.click();
                }
                GM_deleteValue(id)
            }

            // Separate async function for error handling when 'vidbutton' is thrown
            async function handleVidbuttonError() {
                console.log('Best Quality Video');
                const id_ = new URL(new URL(location.href).searchParams.get('url')).searchParams.get('v');
                //ispatchAllInputEvents(urlElem, v);
                let id=`started_${id_}`
                //alert(id+' did start')

                GM_setValue(id, true);
                await wfs('#height').then(el => {
                    GM_setValue(id, true);
                    height.selectedIndex = height.options.length - 1;
                    dlbutton.click();
                    window.open = function(a, b, c) {
                        console.log({ a, b, c });
                    };
                    wfs('#dlbutton').then(dlButton => {
                        let text = '';
                        setInterval(() => {
                            if (text !== dlButton.innerText) {
                                text = dlButton.innerText;
                                GM_setValue('dlbutton', text);
                            }
                        }, 100);
                    });
                });
            }
            overrideCreateElement();
            try {
                await handleQDownloaderCC();
            } catch (error) {
                if (error === 'vidbutton') {
                    await handleVidbuttonError();
                } else {
                    console.error(error);
                }
            }
        },
        "snapsave.io":async ()=>{

            async function wfs(a, ms = 20000) {
                let o = false;
                setTimeout(() => {
                    console.log('TimeOut for', a);
                    o = true;
                }, ms);

                while (!document.querySelector(a)) {
                    console.log('_', a, o);
                    await sleep(500);
                    if (o) break;
                };

                console.log(a, o);
                if (o) throw 'NotFound';
                return document.querySelector(a);
            }
            _wfs=wfs
            var input=await wfs('#s_input',30000)
            if(input){
                console.log('Converting')
                id_=new URL(location.href).searchParams.get('v')
                input.value=`https://www.youtube.com/watch?v=${id_}`
                ksearchvideo()
                setTimeout(ksearchvideo(),1000)
                var formatSelect=await wfs('#formatSelect')
                var btn_action=await wfs('#btn-action')
                formatSelect.selectedIndex=0
                formatSelect.options[0].selected=true
                var asuccess=await wfs('#asuccess')
                while(!(asuccess=await wfs('#asuccess')))await sleep(0)
                convertFile(0)
                while(asuccess.getAttribute('href')=='#')(await sleep(0),asuccess=await wfs('#asuccess'))
                console.log(asuccess.href)
                var title=(await _wfs('.clearfix')).querySelector('h3').innerText
                var f = { id: id_, href:asuccess.href, title, length: {} };
                console.log('Posted',f);
                (opener || window).postMessage(f, '*');
                //close()
            }else{
                alert('Input was not Found')
                console.warn('?!!')
            }
            return

        },

        //sound cload
        "soundcloud.com":async()=>{
            getSoundCloadI=function(){
                _setV('SC',getSoundCloudUrl())
                var b_=open('https://sclouddownloader.net/','SC')
                b_.onclose=function(r){
                    console.log('Win closed')
                }

            }
            return
        },
        "sclouddownloader.net":async function(){
            var url=_getV('sc')
            async function wfs(s,t){

                return await new Promise(async (a,b)=>{
                    var d=!1
                    var c=()=>(d=0,b())
                    let _=setTimeout(c,t)
                    while(!document.querySelector(s)){
                        await sleep()
                        if(d){b();break}
                    }
                    return a(document.querySelector(s))
                }).then(e=>true,e=>false)
            }
            if(location.pathname=='/download-sound-track'){
                await wfs('#trackTitle')
                while(!trackTitle.innerText.length)await sleep(0)
                await wfs('#trackLink')
                while(!trackLink.href.length)await sleep(0)
                var info={
                    name:trackTitle.innerText,
                    href:trackLink.href
                }
                console.log(info)
                _setV('SCinfo',info)
                close()
            }
            else{

                if(!_getV('SC'))throw "Bruv"
                var input1='#urlInput'
                var button1='#submitBtn'
                await wfs(input1,2000)
                if(await wfs(input1,2000)){
                    document.querySelector(input1).value=url
                    console.log('EZ url',!!window.formSubmit)
                    while(typeof formSubmit=='undefined'){
                        document.querySelector(input1).value=url
                        try{await sleep(0),console.log('EZ url',formSubmit);formSubmit()}catch{}
                    }
                    console.log('EZ url',formSubmit)
                    formSubmit()
                    console.warn('Got')
                    setInterval(()=>{
                        document.querySelector(input1).value=url
                        formSubmit()
                    },1000)
                }
            }

        },
        //youtube stuff
        "studio.youtube.com":async()=>{
            var item
            var list
            var forB
            var __;
            var loop=setInterval(()=>{
                var l
                try{
                    var item = [...document.querySelectorAll('#video-list')].map(e=>[e, [...e.classList]]).filter(e=>e[1].includes("ytcp-video-section"))[0][0];
                    var list = [...item.children[1].children].map(e=>[e, [...e.classList], e.tagName]).filter(e=>e[2] == 'YTCP-VIDEO-ROW')


                    list.filter(e=>{
                        return e[0].children[0].querySelectorAll('.cell-body.tablecell-visibility.style-scope.ytcp-video-row')[0].innerText=='Public'
                    }).map(e=>e[0].children[0].querySelectorAll('.cell-body.tablecell-visibility.style-scope.ytcp-video-row')[0]).forEach(e=>{
                        console.log(e)
                        e.append(new _e('br').element)
                        var b=new _e('button').set('innerText','MP3').on('click',function(e){
                            let url=e.target.parentElement.parentElement.querySelector('#hover-items').children[3]
                            console.log(url)
                            //alert('Doesnt work yet')
                            const {id,href,short}={href:url.href,short:url.href.includes('/short'),id:setElement(url.href)}
                            console.log({id,href,short})
                            downloadT(id,false,true,false,false,new URL(href))
                        })
                        var bb=new _e('button').set('innerText','MP4').on('click',function(e){
                            let url=e.target.parentElement.parentElement.querySelector('#hover-items').children[3]
                            console.log(url)
                            //alert('Doesnt work yet')
                            const {id,href,short}={href:url.href,short:url.href.includes('/short'),id:setElement(url.href)}
                            console.log({id,href,short})
                            downloadT(id,false,true,true,false,new URL(href))
                        })
                        e.prepend(bb.element)
                        //e.append(bb.element)
                    })
                    l=true
                }catch{l=false}
                if(__!=l)__=l,console.log('Change?',l?"Found":"Not FOund")
            },0)
            //forB[0].innerText.incluides('Public')
            },
        "www.socialplug.io":async()=>{

            location.pathname.split('/')[1]!=GM_getValue(document.domain)&&(GM_setValue(document.domain,location.pathname.split('/')[1]),console.warn('updated'))

            async function wfs(a, ms = 5000) {
                let o = false;
                setTimeout(() => {
                    console.log('TimeOut for', a);
                    o = true;
                }, ms);

                while (!document.querySelector(a)) {
                    console.log('_', a, o);
                    await sleep(500);
                    if (o) break;
                };

                console.log(a, o);
                if (o) throw 'NotFound';
                return document.querySelector(a);
            }

            let [id,shorts]=name.split(',')
            if(id.length&&shorts.length){}else return console.warn('No info Preset')
            var YTurl=`https://www.youtube.com/${shorts=="1"?"shorts/":"watch?v="}${id}`
            await wfs('#video-url')
            console.log('Input Loaded')
            document.querySelector('#video-url').value=YTurl
            //dispatchAllInputEvents(document.querySelector('#id_url'),YTurl)
            await wfs('#get-video-button')
            console.log('GEtting res')
            await sleep(100)
            document.querySelector('#get-video-button').click()
            await wfs('#quality-options',20000)
            while(!document.getElementById('quality-options').children.length){
                await sleep(100)
            }
            document.getElementById('quality-options').children[document.getElementById('quality-options').children.length-1].click()
            console.log('Stating Download')
            while(Number(document.querySelector('.indicator').style.width.replace('%',''))<100){
                await sleep(10)
                if(error.innerText=='An error occurred while starting the download'){
                    document.getElementById('quality-options').children[document.getElementById('quality-options').children.length-1].click()
                    console.warn('Stating Download again')
                    error.innerText=''
                    await sleep(1000)
                }
            }
            console.log('Done Loading')
            console.log('Unloading video')
            while(!!Number(document.querySelector('.indicator').style.width.replace('%',''))){
                await sleep(10)
            }
            close()
            return;
            ;(opener||window).postMessage(e,'*')
            location.href=e.href

        },
        "y2mate.nu":async()=>{
            location.pathname.split('/')[1]!=GM_getValue('y2mate.nu')&&(GM_setValue('y2mate.nu',location.pathname.split('/')[1]),console.warn('updated'),close())
            let id_ = new URL(location.href).searchParams.get('v');
            let IsShort = new URL(location.href).searchParams.get('s') == 1;
            let mp4 = new URL(location.href).searchParams.get('mp4')
            let useT = new URL(location.href).searchParams.get('useT')
            let _=id_+mp4 + useT//,gB=String.fromCharCode(109, 110, 117, 117, 46, 110, 117)
            if(!id_){
                [id_,IsShort,mp4,useT]=name.split(',').map(e=>{
                    try{
                        return !!eval(e)
                    }catch{return String(e)}
                })
            }
            while(typeof gB==typeof nonexistent)await sleep(1);
            async function wfs(a, ms = 5000) {
                let o = false;
                setTimeout(() => {
                    console.log('TimeOut for', a);
                    o = true;
                }, ms);

                while (!document.querySelector(a)) {
                    console.log('_', a, o);
                    await sleep(500);
                    if (o) break;
                };

                console.log(a, o);
                if (o) throw 'NotFound';
                return document.querySelector(a);
            }
            let cr = document.createElement;
            window.openN=window.open
            window.open=function(...a){
                console.log(document.domain,'wants to open',a)
            }
            document.createElement = function(tagName, options) {
                let r = cr.call(document, tagName, options); // Ensure correct context
                r._click = r.click;
                r.click = function() {

                    console.log(r, 'was clicked', r.tagName);
                    if('A'==r.tagName){
                        console.log('Caught',r)
                        let title=r.download
                        let href=r.href
                        f={
                            id:id_,
                            href,
                            title
                        };
                        (opener||window).postMessage(f,'*');
                        //close()
                    }
                    else r._click.apply(r); // Ensure correct context
                };
                console.log(r, 'was created', r.tagName);
                return r;
            };
            while (document.readyState != 'complete') await sleep(0);
            // 1️⃣ Init conversion & grab the convertURL
            var initRes = await fetch(
                `https://d.${gB}/api/v1/init?a=${authorization()}&_=${Math.random()}`
            );
            var { convertURL } = await initRes.json();

            // 2️⃣ Hit the convert endpoint for MP3 & grab downloadURL
            console.log({id_,mp4,useT,IsShort})
            let _title
            let post = async (a,b) => {
                console.log('a', a);
                var href = a
                var title = b
                var f = {_, id: id_, href, title, length: {} };
                console.log('Posted',f);
                (opener || window.parent).postMessage(f, '*');
                close()
            }
            async function getInfo(r){
                var convRes = await fetch(
                    r||`${convertURL}&v=${id_}&f=mp3&_=${Math.random()}`
                ).then(e=>e.json())
                var { downloadURL,redirectURL,redirect,title,error } = await convRes
                let obj={ downloadURL,redirectURL,redirect,title,error }
                //alert(Object.keys(obj).map(e=>`${e}:${obj[e]}`).join('\n'))
                if(title&&title.length)_title=title;
                if(redirect)return (await sleep(1000),console.log('Got redirected'),await getInfo(redirectURL))
                if(error)return(await sleep(1000),console.log('retrying again'),await getInfo())
                if(downloadURL&&downloadURL.length){
                    return {_title,downloadURL}
                }
            }
            let s=await getInfo()
            console.log(s)
            await post(s.downloadURL,s._title)
            return;
            if (id_) {
                let post = async (a) => {
                    console.log('a', a);
                    var href = findhref2(document.forms[0])[0].href;
                    var title = findhref2(document.forms[0], 'div')[0].innerText;
                    var f = {_, id: id_, href, title, length: {} };
                    console.log('Posted',f);
                    (opener || window.parent).postMessage(f, '*');
                    close()
                }
                try {
                    await wfs('#v').then(e => {
                        console.log('e', e);
                        e.value = IsShort ? `https://www.youtube.com/watch?v=${id_}` : `https://www.youtube.com/shorts/${id_}`;
                        document.querySelector('[type="submit"]').click();
                    }).catch(post);

                    console.log('after url');
                    dl=download;

                    download=async function(e){
                        dl(e)
                    }

                    console.log('b');
                } catch (error) {
                    console.warn('Error:', error);
                }
            } else {
                console.warn('No id Found');
            }
            return;

        },
        "tubemp4.is":async()=>{

            console.log('ok')

            async function wfs(s,tm=30000){
                var b
                sleep(tm).then(e=>b=true)
                while(!document.querySelector(s)){
                    await sleep(0)
                    if(b)break;
                }
                return document.querySelector(s)
            }
            wfs('#u').then(async u=>{
                u.value=`https://www.youtube.com/watch?v=${new URL(location.href).searchParams.get('v')}`;
                convert.click()
                await sleep(200)
                ;(await wfs('#convert')).click();
                ;(await wfs('.process-button')).click()
                wfs('.download-button').then(e=>{
                    let a=null
                    let cr = document.createElement;
                    document.createElement = function(tagName, options) {
                        let r = cr.call(document, tagName, options); // Ensure correct context
                        r._click = r.click;
                        r.click = function() {

                            console.log(r, 'was clicked', r.tagName);
                            if('A'==r.tagName){
                                console.log('Caught',r)
                                let title=r.download
                                let href=r.href
                                f={
                                    id:new URL(location.href).searchParams.get('v'),
                                    href,
                                    title
                                };
                                (opener||window).postMessage(f,'*');
                                close()
                            }
                            else r._click.apply(r); // Ensure correct context
                        };
                        console.log(r, 'was created', r.tagName);
                        return r;
                    };
                    e.click()
                    console.log('clicked')
                    setTimeout(()=>e.click(),1000)
                })
            }).then(console.log,console.warn)
        },
        "www.yt2conv.com":async()=>{
            console.log('Getting MP4')
            let [id,shorts]=name.split(',')
            tF(function(f=function(){}){
                var input=document.getElementById('search_txt')
                input.value=`https://www.youtube.com/${shorts=="1"?"shorts/":"watch?v="}${id}`
                document.getElementById('btn-submit').click()
                console.log(id,shorts)
            },{callback:function(){}})
            tF(function(f=function(){}){
                console.log(result.children.length)
                if(!result.children.length){document.getElementById('btn-submit').click();throw "no there"}
            },{int:1000,callback:function(){}})
            tF(function(){
                document.getElementById('btn-download').click()
            },{callback:function(){}})
            tF(function(){
                var title=$('.media-heading')[0].innerText
                var href=downloadbtn.href
                var f={id,href,title,length:{}};
                console.log('Posted')
                ;(opener||window).postMessage(f,'*')
            },{callback:close})

        },
        "yt5s.biz":async()=>{
            async function wfs(s){
                while(!document.querySelector(s)){
                    await sleep(0)
                }
                return true
            }
            let [id,shorts]=name.split(',')
            if(id.length&&shorts.length){}else return console.warn('No info Preset')
            var YTurl=`https://www.youtube.com/${shorts=="1"?"shorts/":"watch?v="}${id}`
            await wfs('#txt-url')
            console.log('Input Loaded')
            document.querySelector('#txt-url').value=YTurl
            await wfs('#btn-submit')
            console.log('GEtting res')
            await sleep(100)
            document.querySelector('#btn-submit').click()
            await wfs('#video_title')
            console.log('Got Res')
            var title=document.querySelector('#video_title').innerText
            var maxres=[0]
            ;[...document.querySelector('#result').querySelector('table').querySelectorAll('tr')].forEach(e=>{
                var res=e.innerText.match(/(?<res>\d+)(p|P)/i)||{}
                if(res.groups){
                    res=Number(res.groups.res)
                    if(maxres[0]<res)maxres[0]=res,maxres[1]=findhref2(e)[0].href,maxres[2]=e
                }
            })
            let e= {id,title,href:maxres[1],mp4:true,res:maxres[0]}
            ;(opener||window).postMessage(e,'*')
            location.href=e.href

        },
        "en3.onlinevideoconverter.pro":async()=>{
            let [id,shorts]=name.split(',')
            if(id.length&&shorts.length){}else return console.Warn('NO info Preset')
            var YTurl=`https://www.youtube.com/${shorts=="1"?"shorts/":"watch?v="}${id}`
            let callback=function(){};
            tF(function(f=function(){}){
                var input=document.getElementById('texturl')
                input.value=`https://www.youtube.com/${shorts=="1"?"shorts/":"watch?v="}${id}`
                document.getElementById('convert1').click()
                console.log('Searched')
            },{callback})
            tF(function(){
                if(stepProcess.style.display=='none'){
                    document.getElementById('convert1').click()
                    throw "this"
                }
                console.log('Searching')
            },{callback})
            tF(function(){
                if(document.getElementById('form-app-root').children.length==0)throw ""
                console.log('loaded')
                var{title,href}=$('#download-720-MP4')?$('#download-720-MP4')[0]?$('#download-720-MP4')[0]:$('#download-720-MP4'):$('#download-720-MP4')
                var f={id,href,title,length:{}};
                console.log('Posted')
                ;(opener||window).postMessage(f,'*')
            },{callback:close})


        },

        //twitch stuff
        "production.assets.clips.twitchcdn.net":async()=>{
            let a=new element('a',{href:document.querySelector('[type="video/mp4"]').src,download:document.querySelector('[type="video/mp4"]').src.split('/')[5]+'.mp4'})
            document.body.append(a.element)
            a.element.click()
            sleep(500).then(e=>{
                a.element.remove()
                sleep(500).then(e=>{
                    close()
                })
            })
            return
        },
        "clips.twitch.tv": async () => {
            // Only run if the pathname's second segment is NOT "create"
            if (location.pathname.split('/')[1] === 'create') return;

            let auto = 0;
            const sleep = ms => new Promise(a => setTimeout(a, ms));

            async function wfs(a, ms = 20000) {
                let o = false;
                setTimeout(() => {
                    console.log('TimeOut for', a);
                    o = true;
                }, ms);

                while (!document.querySelector(a)) {
                    console.log('_', a, o);
                    await sleep(500);
                    if (o) break;
                };

                console.log(a, o);
                if (o) throw 'NotFound';
                return document.querySelector(a);
            }
            _wfs = wfs;

            function copyElm(element) {
                if (!(element instanceof Element)) {
                    throw new Error("Provided argument is not a DOM element.");
                }

                // Create a new element of the same type
                const newElement = document.createElement(element.tagName);

                // Copy all attributes
                for (let attr of element.attributes) {
                    newElement.setAttribute(attr.name, attr.value);
                }

                // Copy all styles
                newElement.style.cssText = element.style.cssText;

                // Copy class list
                newElement.className = element.className;

                // Copy inner HTML content
                newElement.innerHTML = element.innerHTML;

                return newElement;
            }
            _copyElm = copyElm;

            let l = location.href;
            let qs='.ScCoreButtonLabel-sc-s7h2b7-0'
            let origin = (await _wfs('.ScCoreButtonLabel-sc-s7h2b7-0'))
            .parentElement.parentElement.parentElement.parentElement;

            // Function to embed an iframe with the provided URL and log label
            async function embedIframe(url, label) {
                return await fetch(url).then(e=>true,b=>false)?(
                    new _e('iframe', {
                        src: url,
                        width: '100%',
                        height: '600px',
                        frameborder: '0'
                    }).appendTo(document.body),
                    console.log(`Embedded ${label} iframe: `, url)):(
                    console.warn('Embed failed'),open(url,label)
                )
            }

            /*// Create buttons with the updated click behavior to embed an iframe
            new _e(_copyElm(origin))
                .on('click', function(){
                let url = (o => o.href)(
                    (o => (o.host = 'clipr.xyz', o))(new URL(location.href))
                );
                embedIframe(url, '1080P');
            })
                .appendTo(origin.parentNode)
                .element.querySelector('.ScCoreButtonLabel-sc-s7h2b7-0').innerText = '1080P';

            new _e(_copyElm(origin))
                .on('click', function(){
                let url = (o => o.href)(
                    (o => (o.host = 'clipr.xyz', o))(new URL(location.href))
                );
                embedIframe(url, '720P');
            })
                .appendTo(origin.parentNode)
                .element.querySelector('.ScCoreButtonLabel-sc-s7h2b7-0').innerText = '720P';

            new _e(_copyElm(origin))
                .on('click', function(){
                let url = (o => o.href)(
                    (o => (o.host = 'clipr.xyz', o))(new URL(location.href))
                );
                embedIframe(url, '480P');
            })
                .appendTo(origin.parentNode)
                .element.querySelector('.ScCoreButtonLabel-sc-s7h2b7-0').innerText = '480P';

            new _e(_copyElm(origin))
                .on('click', function(){
                let url = (o => o.href)(
                    (o => (o.host = 'clipr.xyz', o))(new URL(location.href))
                );
                embedIframe(url, '360P');
            })
                .appendTo(origin.parentNode)
                .element.querySelector('.ScCoreButtonLabel-sc-s7h2b7-0').innerText = '360P';

            new _e(_copyElm(origin))
                .on('click', function(){
                let url = (o => o.href)(
                    (o => (o.host = 'clipr.xyz', o))(new URL(location.href))
                );
                embedIframe(url, 'VOD');
            })
                .appendTo(origin.parentNode)
                .element.querySelector('.ScCoreButtonLabel-sc-s7h2b7-0').innerText = 'VOD';
                */

            // Array of resolutions to loop through
            const resolutions = [
                { label: '1080P', resolution: '1080' },
                { label: '720P', resolution: '720' },
                { label: '480P', resolution: '480' },
                { label: '360P', resolution: '360' },
                { label: 'VOD', resolution: 'VOD' }
            ];

            // Loop through the resolutions array to create elements dynamically
            resolutions.forEach(({ label, resolution }) => {
                let elem = new _e(_copyElm(origin)).on('click', function(){
                    let txt=elem.element.querySelector(qs).innerText
                    elem.element.querySelector(qs).innerText='Please wait...';
                    //[, user, clip, clipID] = location.pathname.split('/');
                    let url = (o => o.href)((o => (o.host = 'clipr.xyz', o))(new URL(location.href)));
                    embedIframe(url, resolution).then(e=>elem.element.querySelector(qs).innerText=label)
                }).appendTo(origin.parentNode);

                // Change the inner text for VOD or the regular resolution
                if (resolution === 'VOD') {
                    elem.element.querySelector(qs).innerText = label;
                } else {
                    elem.element.querySelector(qs).innerText = label;
                }
            });


            if (auto) {
                setTimeout(() => { close(); }, 200);
                let url = (o => o.href)(
                    (o => (o.host = 'clipr.xyz', o))(new URL(location.href))
                );
                embedIframe(url, '1080P');
            }
        },
        "www.twitch.tv":async ()=>{
            let autopoints=true
            async function startAutopoints(){
                let mutedVideoPlayer=false
                if(!autopoints)return;
                while(true){
                    try{
                        if(document.querySelector('[aria-label="Claim Bonus"]'))(console.log('Bonus claimed'),document.querySelector('[aria-label="Claim Bonus"]').click());a
                        if(get_aria_label('Leave feedback for this Ad')){
                            console.log('AdFound')
                            if(!document.querySelector('video').muted&&!mutedVideoPlayer){
                                document.querySelector('video').muted=true
                                mutedVideoPlayer=true
                            }
                        }else if(get_aria_label('Ad')&&mutedVideoPlayer)document.querySelector('video').muted=false;
                        await sleep(100)
                    }catch{}
                }
            }

            async function wfs(s,tm=30000){
                const sleep=ms=>new Promise(a=>setTimeout(a,ms))
                var b
                sleep(tm).then(e=>b=true)
                while(!document.querySelector(s)){
                    await sleep(0)
                    if(b)break;
                }
                return document.querySelector(s)
            }
            async function getrewardselm() {
                const el = await wfs('.rewards-list', 3000);
                if (!el) {
                    get_aria_label('Bits and Points Balances')&&get_aria_label('Bits and Points Balances').click();
                    return getrewardselm();        // ← return the recursive call
                }
                return el;                       // ← return the found element
            }
            let rewards={}
            setRwards=async function(){
                rewards={bitItems:{},rewardItems:{}}
                let rewardsThing = await getrewardselm()
                let bitItems=rewardsThing.querySelectorAll('.bitsRewardListItem--yx4rk')
                ;[...bitItems].forEach(e=>{
                    let cost=e.children[0].children[1].children[1].innerText
                    let button=e.children[0]
                    let name=e.children[0].children[1].children[0].innerText
                    let stuff= {cost,name,button}
                    let function_=()=>{
                        button.click()
                    }
                    function_.name=name
                    function_.cost=cost
                    function_.button=button
                    rewards.bitItems[name]=function_
                });

                [...document.querySelectorAll('.reward-list-item')].forEach(e=>{
                    let button=e.querySelector('button')
                    let [cost,name]=[...e.querySelectorAll('.CoreText-sc-1txzju1-0')].map(e=>e.innerText)
                    let stuff= {cost,name,button}
                    let function_=()=>{
                        button.click()
                    }
                    console.log(cost,name)
                    function_.name=name
                    function_.cost=cost
                    function_.button=button
                    rewards.rewardItems[name]=function_
                });
            }
            unlockALLRNG=async function(){
                while(typeof await unlockRNG()!=typeof ""){}
                console.log('Done')
            }
            unlockRNG=async function(){
                const sleep=ms=>new Promise(a=>setTimeout(a,ms))
                await setRwards()
                let totalBits=document.querySelector('[data-test-selector="bits-balance-string"]')?document.querySelector('[data-test-selector="bits-balance-string"]').innerText:0
                let totalPoints=document.querySelector('[data-test-selector="copo-balance-string"')?document.querySelector('[data-test-selector="copo-balance-string"').innerText:0
                console.log({totalPoints,totalBits})
                if(rewards.rewardItems['Unlock a Random Sub Emote']){
                    if(rewards.rewardItems['Unlock a Random Sub Emote'].cost<=totalPoints){
                        rewards.rewardItems['Unlock a Random Sub Emote']()
                    }else return 'Broke'
                }else return "Doesnt exist"
                while(!document.getElementById('channel-points-reward-center-body').querySelector('.ScCoreButton-sc-ocjdkq-0'))await sleep(1000);
                if(document.getElementById('channel-points-reward-center-body').querySelector('.ScCoreButton-sc-ocjdkq-0').disabled)return (get_aria_label('Back')&&(get_aria_label('Back').click()),"disabled");
                while(document.getElementById('channel-points-reward-center-body').querySelector('.ScCoreButton-sc-ocjdkq-0')){
                    document.getElementById('channel-points-reward-center-body').querySelector('.ScCoreButton-sc-ocjdkq-0').click()
                    await sleep(1000)
                }
            }
            console.log('running points')
            startAutopoints()
            async function go(){
                let [ ,user, clip, clipID] = location.pathname.split('/');
                if (clip !== 'clip') return console.warn('User isnt wathcing a clip');
                console.log('User is Watching a CLip');

                const sleep = ms => new Promise(a => setTimeout(a, ms));
                async function wfs(a, ms = 20000) {
                    let o = false;
                    setTimeout(() => {
                        console.log('TimeOut for', a);
                        o = true;
                    }, ms);

                    while (!document.querySelector(a)) {
                        console.log('_', a, o);
                        await sleep(500);
                        if (o) break;
                    }

                    console.log(a, o);
                    if (o) throw 'NotFound';
                    return document.querySelector(a);
                }
                _wfs = wfs;
                _wfs_ = wfs;

                function copyElm(element) {
                    if (!(element instanceof Element)) {
                        throw new Error("Provided argument is not a DOM element.");
                    }

                    // Create a new element of the same type
                    const newElement = document.createElement(element.tagName);

                    // Copy all attributes
                    for (let attr of element.attributes) {
                        newElement.setAttribute(attr.name, attr.value);
                    }

                    // Copy all styles
                    newElement.style.cssText = element.style.cssText;

                    // Copy class list
                    newElement.className = element.className;

                    // Copy inner HTML content
                    newElement.innerHTML = element.innerHTML;

                    return newElement;
                }
                _copyElm = copyElm;

                // New embedIframe function to create and inject an iframe
                async function embedIframe(url, res,elm,label) {
                    return await fetch(url).then(e=>true,b=>false)?(
                        new _e('iframe', {
                            src: url,
                            width: '100%',
                            height: '600px',
                            frameborder: '0'
                        }).appendTo(document.body),
                        console.log(`Embedded ${res} iframe: `, url)):(
                        console.warn('Embed failed'),open(url,res)
                    )
                }

                await (async function(){
                    let l = location.href;
                    await _wfs('.Layout-sc-1xcs6mc-0.bMOhzu');
                    let origin = [...document.querySelectorAll('.Layout-sc-1xcs6mc-0 .bMOhzu')]
                    .filter(e => e.querySelector('button') && !e.querySelector('button').disabled)[0];
                    let qs = '.bFxzAY';

                    // Array of resolutions to loop through
                    const resolutions = [
                        { label: '1080P', resolution: '1080' },
                        { label: '720P', resolution: '720' },
                        { label: '480P', resolution: '480' },
                        { label: '360P', resolution: '360' },
                        { label: 'VOD', resolution: 'VOD' }
                    ];

                    // Loop through the resolutions array to create elements dynamically
                    resolutions.forEach(({ label, resolution }) => {
                        let elem = new _e(_copyElm(origin)).on('click', function(){
                            let txt=elem.element.querySelector(qs).innerText
                            elem.element.querySelector(qs).innerText='Please wait...';
                            [, user, clip, clipID] = location.pathname.split('/');
                            let url = (o => o.href)((o => (o.host = 'clipr.xyz', o))(new URL(location.href)));
                            embedIframe(url, resolution,elem).then(e=>elem.element.querySelector(qs).innerText=label)
                        }).appendTo(document.querySelector('.Layout-sc-1xcs6mc-0.hZUoPp'));

                        // Change the inner text for VOD or the regular resolution
                        if (resolution === 'VOD') {
                            elem.element.querySelector('.ScCoreButtonLabel-sc-s7h2b7-0').innerText = label;
                        } else {
                            elem.element.querySelector(qs).innerText = label;
                        }
                    });

                })().catch(console.warn);
            }
            var c;
            setInterval(() => {
                if (c != location.href) go();
                c = location.href;
            }, 100);

            return;

        },
        "clipr.xyz":async()=>{
            async function wfs(a, ms = 20000) {
                let o = false;
                setTimeout(() => {
                    logger.log(`TimeOut for ${a}`);
                    o = true;
                }, ms);

                while (!document.querySelector(a)) {
                    logger.log(`_ ${a} ${o}`);
                    await sleep(500);
                    if (o) break;
                }

                logger.log(`${a} ${o}`);
                if (o) throw 'NotFound';
                return document.querySelector(a);
            }

            async function wfl(){
                while(document.readyState != 'complete'){
                    await sleep(0)
                }
                return true;
            }

            const _wfs = wfs;

            let p = name;
            await wfl();
            logger.log('Loaded');
            let href = (((r={})=>{
                [...document.querySelectorAll('.flex.items-center.space-x-4')].filter(e=>findhref2(e)[0]).filter(e=>findhref2(e)[0].href.includes('clips.twitchcdn.net')).forEach(e=>{
                    r[e.querySelector('.space-x-1').innerText.replace('p','')]=findhref2(e)[0].href
                });return r
            })()
                       )[p];

            logger.log(1);
            let user = document.querySelector("body > div.relative.overflow-hidden > main > div > div.px-4.mx-auto.max-w-7xl.sm\\:px-6.lg\\:px-8 > div.mb-6.space-y-3.lg\\:flex.lg\\:items-center.lg\\:justify-between.lg\\:space-y-0 > div.lg\\:flex.lg\\:items-center > p > span:nth-child(1)").innerText;
            logger.log(2);
            let title = document.querySelector("body > div.relative.overflow-hidden > main > div > div.px-4.mx-auto.max-w-7xl.sm\\:px-6.lg\\:px-8 > div.mb-6.space-y-3.lg\\:flex.lg\\:items-center.lg\\:justify-between.lg\\:space-y-0 > div.lg\\:flex.lg\\:items-center > h2").innerText;
            logger.log(3);
            let filename = `@${user} on Twitch | ${title} - ${p}P.mp4`;

            logger.log(`Downloading file as: ${filename}`);
            open(href)

            logger.log(4);
            await sleep(4000)
            close();
            return

        },

        //insta gramm
        "snapinst.app":async function(){


            async function wfs(a, ms = 20000) {
                let o = false;
                setTimeout(() => {
                    console.log('TimeOut for', a);
                    o = true;
                }, ms);

                while (!document.querySelector(a)) {
                    console.log('_', a, o);
                    await sleep(500);
                    if (o) break;
                };

                console.log(a, o);
                if (o) throw 'NotFound';
                return document.querySelector(a);
            }
            async function createBlackOverlayCanvas() {
                await wfs('body')
                // Create the canvas element
                const canvas = document.createElement('canvas');
                canvas.id = 'blackCanvas';

                // Style the canvas to cover the entire page
                Object.assign(canvas.style, {
                    position: 'fixed',
                    top: '0',
                    left: '0',
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'black', // Black background for the canvas
                    zIndex: '9999', // Ensure it's on top of all other elements
                    pointerEvents: 'none', // Allow clicks to pass through to underlying elements
                });

                // Append the canvas to the document body
                document.body.appendChild(canvas);

                // Set the canvas dimensions to match the viewport
                const resizeCanvas = () => {
                    canvas.width = window.innerWidth;
                    canvas.height = window.innerHeight;
                };
                resizeCanvas(); // Call once initially

                // Redraw canvas size on window resize
                window.addEventListener('resize', resizeCanvas);

                // Fill the canvas with black
                const ctx = canvas.getContext('2d');
                ctx.fillStyle = 'black';
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                console.log("Black overlay canvas created.");
            }

            // Call the function to create the canvas
            createBlackOverlayCanvas();

            let[type,id]=name.split('\n')
            if(!type||!id){console.warn('no');return;}
            console.warn('Test2')
            wfs('#url').then(e=>{
                console.warn('Test3')
                e.value=`https://www.instagram.com/${type}/${id}/`
                wfs('#btn-submit').then(e=>{
                    e.click()
                    wfs('.download-bottom').then(async ()=>{
                        await sleep(1000)
                        let list=[...document.querySelectorAll('[class="download-bottom"]')].map(e=>findhref2(e)[0]).map(({href,download,target})=>({href,download,target}));
                        (opener||window).postMessage(list,'*');
                        close()

                    })
                })
            })

        },
        "fastdl.app":async ()=>{
            onload=async function(){
                async function wfs(a){
                    while(!document.querySelector(a))await sleep(0);
                    return document.querySelector(a)
                }
                function DAIE(target, value) {
                    const inputEvents = ['focus', 'input', 'change', 'blur'];

                    inputEvents.forEach(eventName => {
                        let ev=new Event(eventName, { bubbles: true, isTrusted: true })
                        if(target[`on${eventName}`])target[`on${eventName}`](ev)

                        if (eventName === 'input') {
                            target.value = value;
                        }
                        target.dispatchEvent(ev);
                    });
                }
                const info={
                    url:name,
                    input:null
                }
                var cancel=false
                var timeOut=setTimeout(()=>{
                    cancel=true
                },20000)
                while(!document.querySelector('#search-form-input')){
                    await sleep(0)
                    if(cancel)throw "Cant find input"
                }
                info.input=document.querySelector('#search-form-input')
                console.log('Found a')
                DAIE(info.input,info.url);
                document.querySelector('.search-form__button').click()
                GM_setValue('instaURL',await wfs('.button--filled').then(e=>e.href))
            }

        },
        "www.instagram.com":async ()=>{
            function parseInstagramURL(url) {
                // Regular expression to handle optional username, type (p/reels/reel), and ID
                const regex = /https?:\/\/(?:www\.)?instagram\.com\/(?:([^\/]+)\/)?(p|reels|reel)\/([^\/?]+)/;
                const match = url.match(regex);

                if (match) {
                    return {
                        username: match[1] || null, // The username, or null if not present
                        a: match[2],               // 'p', 'reels', or 'reel'
                        id: match[3]               // The post or reel ID
                    };
                }

                return null; // Return null if the URL doesn't match
            }



            var l
            let doIt=()=>(l=parseInstagramURL(location.href),open('https://snapinst.app/',`${l.a}\n${l.id}`));
            onmessage=async function(e){
                if(e.origin!='https://snapinst.app'){
                    console.log('UNhandled',e)
                    return
                }
                let list=e.data
                for(let i=0;i<list.length;i++){
                    let{href,download,target}=list[i]
                    console.log('Got',{href,download,target})
                    let a=new element('a',{href,download,target})
                    document.body.append(a.element)
                    a.element.click()
                    await sleep(500)
                    a.element.remove()
                }
            }
            var int;
            async function wfs(s,t){

                return await new Promise(async (a,b)=>{
                    var d=!1
                    var c=()=>(d=0,b())
                    let _=setTimeout(c,t)
                    while(!document.querySelector(s)){
                        await sleep()
                        if(d){b();break}
                    }
                    return a(document.querySelector(s))
                }).then(e=>e,e=>false)
            }
            if(location.pathname=='/call/'){
                /**
 * Lightly Obfuscated Custom Logger
 * (IIFE that assigns a custom logging class into the global scope)
 */
                (function(){
                    class _0x2d2753 {
                        constructor(_0x321bbe) {
                            this._0x2dcc16 = {
                                body: _0x321bbe || '---',
                                color: 'darkgrey',
                                size: '1rem'
                            };
                            this._0x2603ce = {
                                color: '#008f68',
                                size: '1rem'
                            };
                        }

                        _0x54181c(_0x4ebcf7) {
                            this._0x2dcc16.body = _0x4ebcf7;
                            return this;
                        }

                        _0x40a387({ _0x4e4744, _0x2fbd8f }) {
                            if (_0x4e4744 !== undefined) this._0x2dcc16.color = _0x4e4744;
                            if (_0x2fbd8f !== undefined) this._0x2dcc16.size = _0x2fbd8f;
                            return this;
                        }

                        _0x235d03({ _0x14e09d, _0x506311 }) {
                            if (_0x14e09d !== undefined) this._0x2603ce.color = _0x14e09d;
                            if (_0x506311 !== undefined) this._0x2603ce.size = _0x506311;
                            return this;
                        }

                        /**
         * @param {String} _0x23c5b9 the text body of the log
         */
                        _0x52dfbf(_0x23c5b9 = '') {
                            console.log(
                                `%c${this._0x2dcc16.body} | %c${_0x23c5b9}`,
                                `color:${this._0x2dcc16.color}; font-weight:bold; font-size:${this._0x2dcc16.size};`,
                                `color:${this._0x2603ce.color}; font-weight:bold; font-size:${this._0x2603ce.size}; text-shadow: 0 0 5px rgba(0,0,0,0.2);`
                            );
                        }
                    }

                    Object.assign(this || arguments[0], { _0x2c68c3: _0x2d2753 });
                })(globalThis);

                /**
 * Example usage: Infinite loop
 * Assuming wfs(selector, timeout) is defined somewhere else in your code
 */
                const _0xlogger = new _0x2c68c3('InfiniteLoop');
                _0xlogger._0x52dfbf('Starting infinite loop...');

                (async function infLoop() {
                    await sleep(1000)
                    wfs('.x6s0dn4 .x78zum5 .x5yr21d .xl56j7k.xh8yej3', 100000)
                        .then(() => {
                        [...document.querySelectorAll('.x6s0dn4 .x78zum5 .x5yr21d .xl56j7k.xh8yej3')]
                            .forEach(e => e.style.backgroundColor = 'green');
                        _0xlogger._0x52dfbf('Iteration complete. Next iteration...');
                        infLoop();
                    })
                        .catch(err => {
                        _0xlogger._0x52dfbf(`Error: ${err.message}`);
                        // Decide if you want to retry, log, etc.
                        infLoop();
                    });
                })();

            }
            function setButtons(){
                console.log('Appended buttons man')
                var container=new element(document.querySelectorAll('.xh8yej3.x1iyjqo2')[0])
                var button=new element('button',{id:"MediaButton"}).set('innerText','Get Media').on('click',doIt)
                container.append(button)
            }
            function setButtons2(){
                var container=new element(document.querySelector('._aaqy'))
                var button=new element('button',{id:"MediaButton"}).set('innerText','Get Media').on('click',doIt)
                container.append(button)
            }
            function checkArc(){
                const articles = document.getElementsByTagName('article');
                var button=new element('button',{id:"MediaButton"}).set('innerText','Get Media').on('click',doIt)
                for (const article of articles) {
                    if (article.querySelector('#MediaButton')) {continue;}
                    article.prepend(button.element)
                }
            }
            tF(function(){
                document.querySelectorAll('.xh8yej3.x1iyjqo2')[0].children
            },{callback:function(){
                setButtons();
                setInterval(()=>{
                    checkArc()
                    if(!document.querySelector('#MediaButton'))setButtons()
                    if(document.querySelector('._aaqy')&&!document.querySelector('._aaqy').querySelector('#MediaButton'))setButtons2();
                })
            }})
            console.log('Insta ballz')
            return

        },
        "sss.instasaverpro.com":async()=>{
            async function wfs(s){
                while(!document.querySelector(s)){
                    await sleep(0)
                }
                return true
            }
            await wfs('#A_downloadUrl')
            while(!document.querySelector('#A_downloadUrl').href.length)(await sleep(0));
            console.log('Done')
            var title=document.querySelector('#myModalLabel').innerText
            var e={href:document.querySelector('#A_downloadUrl').href,title}
            ;(opener||window).postMessage(e,'*')
        },

        //tiktok
        "savetik.co":async()=>{
            if(location.pathname.split('/')[1]!=GM_getValue("savetik.co")){
                GM_setValue("savetik.co",location.pathname.split('/')[1])
            }
            var [id,mp4]=name.split(",")
            addEventListener("load",function(){
                tF(function(){
                    s_input.value=id
                    ksearchvideo()
                    setTimeout(ksearchvideo,1000)
                },{callback(){}})
            })
            function Fin(){
                console.log("Found")
                let title=document.getElementsByClassName("clearfix")[0].innerText
                let links=findhref2(document.getElementsByClassName("tik-video")[0]).map(e=>e.href)
                let f={id,title,links,mp4:mp4==1,info:setElement2(id)}
                let Porigin='https://www.tiktok.com'
                onmessage=function(e){
                    if(e.origin==Porigin){
                        var {data:{s,url,title}}=e
                        console.log('Handled',{s,url,title},e)
                        if(!s){
                            downloadFileAsTitle(url,title,null,close)
                        }else setTimeout(close,100)
                        //info[id].close()
                    }else console.log('Unhandled Post',e)
                }
                ;(opener||window).postMessage(f,'*')
                //setTimeout(close,100)
            }
            GM_addValueChangeListener(id, async function(a, b, c, d) {
                console.log({ a, b, c, d });
                if (c!=b&&c){
                    GM_deleteValue(id)
                    await sleep(5000)
                    close()
                }
            });
            tF(function(){document.getElementsByClassName("clearfix")[0].innerText;Fin()},{callback(){}})

        },
    }
    //'use strict';
    function getTikTokTittle(){
        try{
            return document.querySelector("#app > div.css-14dcx2q-DivBodyContainer.e1irlpdw0 > div:nth-child(4) > div > div.css-1qjw4dg-DivContentContainer.e1mecfx00 > div.css-1stfops-DivCommentContainer.ekjxngi0 > div > div.css-1xlna7p-DivProfileWrapper.ekjxngi4 > div.css-1u3jkat-DivDescriptionContentWrapper.e1mecfx011 > div.css-1nst91u-DivMainContent.e1mecfx01 > div.css-bs495z-DivWrapper.e1mzilcj0 > div > div.css-1d7krfw-DivOverflowContainer.e1mzilcj5 > h1").innerText.replace('Replying to ','')
        }catch{
            try{
                return document.querySelector("#app > div.css-14dcx2q-DivBodyContainer.e1irlpdw0 > div:nth-child(4) > div > div.css-1qjw4dg-DivContentContainer.e1mecfx00 > div.css-1stfops-DivCommentContainer.ekjxngi0 > div > div.css-1xlna7p-DivProfileWrapper.ekjxngi4 > div.css-1u3jkat-DivDescriptionContentWrapper.e1mecfx011 > div.css-1nst91u-DivMainContent.e1mecfx01 > div.css-bs495z-DivWrapper.e1mzilcj0").innerText.replace('Replying to ','')
            }catch(err){
                return abc('browse-video-desc','data-e2e')?abc('browse-video-desc','data-e2e').innerText:document.querySelector("#main-content-video_detail > div > div.css-12kupwv-DivContentContainer.ege8lhx2 > div.css-1senhbu-DivLeftContainer.ege8lhx3 > div.css-1sb4dwc-DivPlayerContainer.eqrezik4 > div.css-3lfoqn-DivDescriptionContentWrapper-StyledDetailContentWrapper.eqrezik15 > div.css-r4nwrj-DivVideoInfoContainer.eqrezik3 > div.css-bs495z-DivWrapper.e1mzilcj0 > div > h1").innerText.replace('Replying to ','')
            }
        }
    }
    function sk(){
        get_aria_label('Why this ad?').click();
        setTimeout(()=>{
            document.querySelector("#yDmH0d > c-wiz > div > div > div:nth-child(2) > div.LLEp8b > div > div.rTq3hb > div:nth-child(1) > div > div.ofmULb > div:nth-child(2) > div > button").click();
            setTimeout(()=>{document.querySelector("#VGHGFf > div > div.Eddif > div:nth-child(2) > button > div.VfPpkd-RLmnJb").click();},1000)
        },1000)
    }
    setElement2=function (string){return string.match(/(?<host>https?\:\/\/www\.tiktok\.com)\/(?<username>@[^\/]+)\/video\/(?<videoID>\d+)/i).groups}
    var Porigin='https://onlymp3.app'
    var Ppath='/watch?='
    function ad(listener,f,autoDelete=false){
        var _=addEventListener(listener,(...__)=>{f(...__);if(autoDelete)removeEventListener(_)},true)
        return _
    }
    function isElementInViewport(el) {

        // Special bonus for those using jQuery
        if (typeof jQuery === "function" && el instanceof jQuery) {
            el = el[0];
        }

        var rect = el.getBoundingClientRect();

        return (
            rect.top >= 0 - (((window.innerHeight || document.documentElement.clientHeight) / 2)) &&
            rect.left >= 0 &&
            rect.bottom <= ((window.innerHeight || document.documentElement.clientHeight) + ((window.innerHeight || document.documentElement.clientHeight) / 2)) && /* or $(window).height() */
            rect.right <= (window.innerWidth || document.documentElement.clientWidth) /* or $(window).width() */
        );
    }
    function tF(f,{callback,int}){
        !callback&&(callback=function(){});!int&&(int=100)
        console.log({f,callback,int})
        try{f();callback();return}catch(err){}
        var _=setInterval(()=>{try{f();callback();clearInterval(_);}catch(err){}},int||100)
        return _
    }
    function isHidden(el) {
        return (el.offsetParent === null)
    }
    setElement = function(url) {
        return (String(url).match(/^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?)|(shorts\/))\??v?=?([^#\&\?]*).*/)&&String(url).match(/^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?)|(shorts\/))\??v?=?([^#\&\?]*).*/)[8].length==11)? String(url).match(/^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?)|(shorts\/))\??v?=?([^#\&\?]*).*/)[8]: false;
    };
    findhref2=function (a,b){
        var res=[];

        function part2(e){
            if(e.tagName.toLowerCase()==(b||'a')){
                res.push(e);
                if(e.children.length){
                    e=e.children;
                    e.forEach=[].forEach;
                    e.forEach(e2=>{
                        part2(e2);
                    })
                }
            }else{
                if(e.children.length){
                    e=e.children;
                    e.forEach=[].forEach;
                    e.forEach(e2=>{
                        part2(e2);
                    })
                }
            }
        };
        part2(a);
        return res
    }
    function parent(node){return node.parentNode}
    getInstalImages=function(){
        return document.querySelectorAll('._acaz')
    }
    getInstaVideo=function(){
        return document.querySelector('video.x1lliihq')
    }
    function GP(){
        return get_aria_label('Go back')?get_aria_label('Go back').click?get_aria_label('Go back'):document.querySelector('._afxv'):document.querySelector('._afxv')
    }
    function GN(){
        return get_aria_label('Next')?get_aria_label('Next').click?get_aria_label('Next'):document.querySelector('._afxw'):document.querySelector('._afxw')
    }
    function getTitle(){
        try{return document.querySelector("div.x78zum5.xdt5ytf.x1iyjqo2.xs83m0k.x2lwn1j.x1odjw0f.x1n2onr6.x9ek82g.x6ikm8r.xdj266r.x11i5rnm.x4ii5y1.x1mh8g0r.xexx8yu.x1pi30zi.x18d9i69.x1swvt13 > ul > div:nth-child(3) > div > div").children[0].innerText.split('\n')[1]}catch{
            return [...document.querySelectorAll('.xt0psk2.xvs91rp.xo1l8bm.x5n08af.x18hxmgj')].pop().innerText.split('\n')[0]
        }
    }
    downloadVideoFromBlob=function (videoElement,title) {
        if (videoElement && videoElement.src && videoElement.src.startsWith('blob:')) {
            // Create a MediaStream from the video element
            const stream = videoElement.captureStream();
            const mediaRecorder = new MediaRecorder(stream);
            const chunks = [];

            // Capture data when available
            mediaRecorder.ondataavailable = event => {
                if (event.data.size > 0) {
                    chunks.push(event.data);
                    console.log(event.data)
                }
            };

            // When the recording stops, create a download link
            mediaRecorder.onstop = () => {
                const blob = new Blob(chunks, { type: 'video/mp4' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                a.download = title+'.mp4';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            };

            // Start recording
            mediaRecorder.start();

            // Stop recording after the video duration
            setTimeout(() => {
                mediaRecorder.stop();
            }, videoElement.duration * 1000);
        } else {
            console.error('Invalid video element or source.');
        }
    }
    function DIV(){
        if(location.href.includes('reel')){
            let _=open('https://fastdl.app/en',location.href,`width=400,height=500`)
            var listener=GM_addValueChangeListener('instaURL',function(a,b,c,d){
                if(!!c){
                    console.log('Got',{a,b,c,d})
                    _.close()
                    GM_removeValueChangeListener(listener)
                    downloadFile_(c,document.title+'.mp4')
                    GM_setValue('instaURL',null)
                }
            })
            }
        //downloadVideoFromBlob(getInstaVideo(),getTitle())
    }
    async function DII_(){
        var sleep=(a)=>new Promise(b=>setTimeout(b,a))
        var srcs=new Set(),obj={}
        while(GP()){
            await sleep(100)
            if(GP())GP().click()
            else {
                await sleep(1000)
                break;
            };
        }
        var length=[...srcs].length
        ;[...getInstalImages()].forEach(e=>{
            let a=findhref2(e,'img')[0]
            srcs.add([a.src,a.getAttribute('alt')])
        })
        GN().click()
        try{GN().click()}catch(err){}

        while(GN()){
            await sleep(300)
            ;;[...getInstalImages()].forEach(e=>{
                let a=findhref2(e,'img')[0]
                srcs.add([a.src,a.getAttribute('alt')])
            })
            try{GN().click()}catch(err){}
            length=[...srcs].length
        }
        while(true){
            await sleep(100)
            if(GP())GP().click()
            else break;
        }
        ;[...srcs].forEach(e=>{
            obj[e[0]]=e[1]
        });
        srcs=Object.keys(obj).map(e=>({src:e,name:obj[e]}));
        srcs.forEach(e=>{
            var ext=new URL(e.src).pathname.split('.').pop()
            downloadFileAsTitle(e.src,`${e.name}.${ext}`)
        })
        console.log('done',srcs)
    }
    function DII(){
        DII_().then(console.log,console.warn)
    }
    function getIds(){
        if(document.domain.includes("music")){alert('These button dont work on youtube music yet');throw "."}
        var list=[...document.getElementsByTagName('ytd-playlist-panel-renderer')].filter(isElementInViewport).filter(e=>!isHidden(e))[0]
        var ids=findhref2(list,'span').filter(e=>!isHidden(e)).filter(isElementInViewport).filter(e=>e.id=='video-title').map(parent).map(parent).map(e=>({id:setElement(findhref2(parent(e))[0].href),e}))
        return ids
    }
    _getIds=getIds
    info={}
    function downloadFileAsTitle(url, filename) {
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = filename;
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
    }
    var ev
    downloadT=function(id,force=false,useT=true,mp4=false,manual=false,urlOBJ=''){
        let _=id+(mp4?"mp4":"mp3") + useT
        !((a)=>a&&a.remove())(document.getElementById(_))
        if((localStorage[_])&&!force&&(manual?!confirm(`You have already download this video as .${mp4?"mp4":"mp3"}\nStill download?`):true))return;
        let l_=(urlOBJ||location)
        var o=new URL(l_.href)
        o.host=o.host.replace('.com','mz.com');
        console.log('o',o)
        let altUrl=['https://y2mate.nu/'+(GM_getValue('y2mate.nu')||'en1')+'/','?v=',id,'&s=',o.pathname.startsWith('/shorts/')?1:0,'&mp4=',mp4?"mp4":"mp3",'&useT=',useT]
        console.log(_,altUrl)
        var video={}
        var hash=`#url=https://www.youtube.com/watch?v=${id}`
        ad('unload',function(){info[id].close()},true)
        onmessage=function(e){
            if(e.origin==Porigin||e.origin.match(/https?:\/{2}onlymp3\.to/)||e.origin.match(/https?:\/{2}en\.onlymp3\.to/)||e.origin.match(/https?:\/{2}en(\d)\.onlinevideoconverter\.pro/)||e.origin=='https://sss.instasaverpro.com'||e.origin=="https://y2mate.nu"||e.origin=="https://snapsave.io"||e.origin=="https://www.socialplug.io"||e.origin=='https://tubemp4.is'){
                const {data:{href,title,length,id,_}}=e
                let n=(title)+(mp4?".mp4":".mp3")
                !((a)=>a&&a.remove())(document.getElementById(_))
                console.log('Handled',{href,title,length,id,_},e,document.getElementById(_),document.getElementById(_)&&document.getElementById(_).remove())
                //info[id].close()
                button.set("innerText","Get MP3")
                button.set("disabled",false)
                if(useT){
                    //downloadFileAsTitle(href,(title)+(mp4?".mp4":".mp3"))
                    console.log('Getting video')
                    downloadFileAsTitle(href,n)

                }
                else open(href);
                localStorage[_]=href
            }else console.log('Unhandled Post',e)
        }
        //`https://downvideo.quora-wiki.com/tiktok-video-downloader#url=https://www.youtube.com/watch?v=${id}`
        //open([o.protocol,'//',o.host,o.pathname,'?v=',setElement(location.href)].join(''))
        let alturl2=(l_).pathname.startsWith('/shorts/')?"https://www.socialplug.io/free-tools/youtube-video-downloader":`https://qdownloader.cc/youtube-video-downloader.html?v=${id}`
        return info[id]=mp4?
            open(alturl2,[id,l_.pathname.startsWith('/shorts/')?1:0,mp4+false],`width=400,height=500`)
        :!async function(){
            if(info[id]=mp4){
                let canFrame2=await fetch(alturl2.join('')).then(a=>true,a=>false)
                if(canFrame2){
                    var frame = new _e('iframe', {
                        src: alturl2.join(''),
                        id: _,
                        useT,
                        loading: "lazy",
                        referrerpolicy: "no-referrer",
                        allowfullscreen: true,
                        sandbox: "allow-same-origin allow-scripts allow-popups allow-forms",
                        allow: "autoplay; fullscreen; geolocation; microphone; camera"
                    }).style({
                        border: 0,
                        position: 'absolute',
                        // Optional: width and height set to 0 to make the iframe visually disappear but still load content
                        width: 1920,
                        height: 1080,
                        // Optional: move the iframe offscreen if you don't want to set width and height to 0
                        // top: '-9999px',
                        // left: '-9999px',
                        // Ensure the iframe does not capture pointer events
                        'pointer-events': 'none',
                        // Set maximum opacity
                        opacity: 1
                    });
                    frame.appendTo(document.body);
                    frame.closed=false;
                    return frame
                }else{
                    return open(alturl2,[id,l_.pathname.startsWith('/shorts/')?1:0,mp4+false],`width=400,height=500`)
                }
                return
            }
            let canFrame=await fetch(altUrl.join('')).then(a=>true,a=>false)
            if(!canFrame){
                console.warn('Cant Frame')
                return open(altUrl.join(''),[id,l_.pathname.startsWith('/shorts/')?1:0,mp4+false,useT+false],`width=400,height=500`)
            }
            var frame = new _e('iframe', {
                src: altUrl.join(''),
                id: _,
                useT,
                loading: "lazy",
                referrerpolicy: "no-referrer",
                allowfullscreen: true,
                sandbox: "allow-same-origin allow-scripts allow-popups allow-forms",
                allow: "autoplay; fullscreen; geolocation; microphone; camera"
            }).style({
                border: 0,
                position: 'absolute',
                // Optional: width and height set to 0 to make the iframe visually disappear but still load content
                width: 1920,
                height: 1080,
                // Optional: move the iframe offscreen if you don't want to set width and height to 0
                // top: '-9999px',
                // left: '-9999px',
                // Ensure the iframe does not capture pointer events
                'pointer-events': 'none',
                // Set maximum opacity
                opacity: 1
            });
            ev=GM_addValueChangeListener('y2mate.nu',function(a,b,c,d){
                altUrl=['https://y2mate.nu/'+(GM_getValue('y2mate.nu')||'0HzX')+'/','?v=',id,'&s=',o.pathname.startsWith('/shorts/')?1:0,'&mp4=',mp4?"mp4":"mp3",'&useT=',useT]
                frame.set('src',altUrl.join(''))
            })
            frame.appendTo(document.body);
            frame.closed=false;
            return frame
        }()
    }
    var tiktikWin
    async function waitTT(){
        while(tiktikWin&&!tiktikWin.closed)await sleep(0);
        return 1
    }

    downloadTikTok=function(a,b){
        (async function(mp4,info){
            let base=`https://savetik.co/${GM_getValue("savetik.co")}`
            await waitTT()
            console.log('ez')
            let id=info.videoID
            let user=info.username
            let title_=getTikTokTittle()
            onmessage=function(e){
                if(e.origin==Porigin||e.origin.match(/https?:\/{2}savetik\.csavetik.coo/)||e.origin.match(/https?:\/{2}en\.onlymp3\.to/)||e.origin.match(/https?:\/{2}en(\d)\.onlinevideoconverter\.pro/)||e.origin=="https://savetik.co"){
                    var {data:{href,links,title,length,id,mp4,info:{username}}}=e
                    console.log('Handled',{href,title,length,id,links,mp4},e)
                    GM_setValue(id,true)
                    //info[id].close()
                    if(e.origin=="https://savetik.co"){
                        title=title_
                        downloadFileAsTitle(mp4?links[0]:links.pop(),username+" - "+title+(mp4?'.mp4':".mp3"),tiktikWin)
                    }else{
                        if(useT){
                            let a=document.createElement('a')
                            a.download=title+'.mp3'
                            a.href=href
                            document.body.appendChild(a)
                            a.click()
                            a.remove();
                        }
                        else open(href);
                        localStorage[_]=href
                    }
                }else console.log('Unhandled Post',e)
            }
            if(await fetch(base).then(e=>true,t=>false)){
                var frame
                GM_addValueChangeListener('savetik.co', async function(a, b, c, d) {
                    console.log({ a, b, c, d });
                    if (c!=b&&c){
                        base=`https://savetik.co/${c}`
                        frame.set('src',`${base}?user=${user}&id=${id}`)
                    }
                });
                frame = new _e('iframe', {
                    src: `${base}?user=${user}&id=${id}`,
                    id: id,
                    useT,
                    loading: "lazy",
                    referrerpolicy: "no-referrer",
                    allowfullscreen: true,
                    sandbox: "allow-same-origin allow-scripts allow-popups allow-forms",
                    allow: "autoplay; fullscreen; geolocation; microphone; camera"
                }).style({
                    border: 0,
                    position: 'absolute',
                    // Optional: width and height set to 0 to make the iframe visually disappear but still load content
                    width: 1920,
                    height: 1080,
                    // Optional: move the iframe offscreen if you don't want to set width and height to 0
                    // top: '-9999px',
                    // left: '-9999px',
                    // Ensure the iframe does not capture pointer events
                    'pointer-events': 'none',
                    // Set maximum opacity
                    opacity: 1
                });
                return
            }
            GM_addValueChangeListener('savetik.co', async function(a, b, c, d) {
                console.log('savetik.co',{ a, b, c, d });
                if (c!=b&&c){
                    tiktikWin&&tiktikWin.close()
                    base=`https://savetik.co/${c}`
                    console.log('Updaed stuff')
                    tiktikWin=open(base,[`https://www.tiktok.com/${user}/video/${id}`,mp4+false],`width=400,height=500`)
                }
            });
            tiktikWin=open(base,[`https://www.tiktok.com/${user}/video/${id}`,mp4+false],`width=400,height=500`)
        })(a,b).then(console.log,console.warn)
    }
    function abc(label, item = 'aria-label', doc = document.body) {
        var res = [];
        function part2(e) {
            var found=false
            if (!item) {
                [...e.attributes].map(e => {
                    const { name, value } = e;
                    return { name, value }
                }).filter(e => e.value == label).length ? (res.push(e),found=1) : null
            } else if (e.getAttribute(item) == label) {
                res.push(e);found=1;
            }
            if (e.children.length&&!found) {
                e = e.children;
                e.forEach = [].forEach;
                e.forEach(e2 => {
                    part2(e2);
                })
            }
        };
        part2(doc);
        return res.length?res.length == 1 ? res[0] : res || false :null
    }
    abc_=abc
    function getElementByAttribute(label,item='aria-label',doc=document.body){
        var res=[];
        function part2(e){
            if(e.getAttribute(item)==label){
                res.push(e);
            }else{
                if(e.children.length){
                    e=e.children;
                    e.forEach=[].forEach;
                    e.forEach(e2=>{
                        part2(e2);
                    })
                }
            }
        };
        part2(doc);
        return res.length==1?res[0]:res||false;
    }
    function mtoggle(){document.querySelector('.ytp-volume-area > .ytp-mute-button').click()}
    function Mute(){
        (abc('Mute','title')&&(abc('Mute','title')[0])||abc('Mute (m)','title')).click()
    }
    function Unmute(){
        ((query('#right-controls')&&query('#right-controls').querySelectorAll('path')[0].getAttribute('d')==UnmutePath&&(abc('Mute','title')[0]))||abc('Unmute','title')||abc('Unmute (m)','title')).click()
    }
    M=Mute
    Um=Unmute
    var didmute=0
    function ch3(i){
        if(!i){
            return false
        }else{
            if(!i.closed){
                return true
            }else{
                return false
            }
        }
    }
    window.ch3=ch3;
    async function getWin(list=[
        ['w1','win1'],
        ['w2','win2'],
        ['w3','win3'],
        ['w4','win4']
    ])
    {
        var e=false;
        var f
        await new Promise((g,h)=>{
            var i=setInterval(j=>{
                list.forEach(k=>{
                    this[k[0]]=ch3(window[k[1]])
                    if(!window[k[1]]&&!e){e=true;f=k[1];console.log(k)}
                })
                if(f){
                    g(f);
                    clearInterval(i)
                }
            },500);
        });
        return f
    };
    window.getWin=getWin
    function WIP(hmpd,mp4,force){
        if(!mp4)return alert('This button is corrently broken')
        if(!hmpd);
        var ids=_getIds()
        var list=[]
        for(let i=0;i<hmpd;i++){
            list.push(['w'+i,'win'+i])
        }
        ids.forEach(({id},index)=>{
            getWin(
                list
            ).then(b=>{
                if((info[id]||localStorage[id])&&!force)return;
                console.log('download',id,index)
                window[b]=downloadT(id,force,true,!!mp4)
                window.addEventListener('unload',function(e){window[b].close()})
                var rr=setInterval(e=>{
                    if(!window[b] || window[b].closed){window[b]=null;clearInterval(rr);console.log(b,'isclosed')}
                },300);
            })
        })
    }
    WIP_=WIP
    var button = (new element('button')).set("innerText","Get MP3").on('click',function(e){
        button.set("innerText","Wait...")
        button.set("disabled",true)
        downloadT(setElement(location.href),true,true,false,true)})
    function getVisiable(elements) {
        // Filter the elements to find those visible in the viewport
        const visibleElements = [];
        elements.forEach(el => {
            if (isElementInViewport(el)) {
                visibleElements.push(el);
            }
        });
        return visibleElements;
    }

    var button2 = (new element('button')).set("innerText","Get MP4").on('click',function(e){downloadT(setElement(location.href),true,true,true,true)})
    var button3 = (new element('button')).set("innerText","PlayList MP3").on('click',function(e){WIP_(2,false,false)})
    var button4 = (new element('button')).set("innerText","PlayList MP4").on('click',function(e){WIP_(2,true,false)})
    var tiktokButton=(new element('button',{className:"tt1"})).set("innerText","Get MP4").on('click',function(e){downloadTikTok(true,setElement2(getClass("ehlq8k34")?getClass("ehlq8k34").innerText:location.href))}).style({color:'blue'}).set('className','.tt1')
    var tiktokButton3=(new element('button',{className:"tt3"})).set("innerText","Get MP4").on('click',function(e){downloadTikTok(true,setElement2(getClass("ehlq8k34")?getClass("ehlq8k34").innerText:location.href))}).style({color:'blue'})
    var tiktokButton2=(new element('button',{className:"tt2"})).set("innerText","Get MP3").on('click',function(e){
        downloadTikTok(false,setElement2(getClass("ehlq8k34")?getClass("ehlq8k34").innerText:location.href))
    }).style({color:'blue'})
    function _ex_(){
        return document.querySelector('#end')||document.querySelector('#right-content')
    }
    console.log('bruh')
    function appendButtons(){
        const MainButtonContainer=_ex_()
        console.log(MainButtonContainer)
        button.appendTo(MainButtonContainer)
        button2.appendTo(MainButtonContainer)
        console.log('Posted Buttons')
        function _ex(){
            try{

                if([...document.querySelectorAll('#header-description')].filter(isElementInViewport).filter(e=>!isHidden(e))[0]||query('.autoplay'))//.children[0].children[0].children[0].children[1].children[0].children[0].children[0].children[0]
                    return [...document.querySelectorAll('#header-description')].filter(isElementInViewport).filter(e=>!isHidden(e))[0]||query('.autoplay')
                else return false
            }
            catch(err){
                return false
            }
        }
        var exist=false
        setInterval(()=>{
            if(exist!=_ex() && _ex()){
                console.log("Added playlist buttons")
                setTimeout(()=>{
                    _ex().append(element.br.element);
                    _ex().append(button3.element);
                    _ex().append(button4.element)
                },100)
            }else
                if(exist!=_ex() && !_ex()){
                    console.log("buttons are gone?!?!")
                }
            exist=_ex()
        },100)
    }
    /*a1=[
        ["youtube",function(){tF(function(){
            let b=_ex_()
            if(!_ex_()) throw "Cant append buttons yet";
            return (console.log('Posting'),true,appendButtons())
        },{callback:function(){}})}],
        ["tiktok",function(){
            console.log('OK lets go2')
            addEventListener("load", function () {
                console.log('OK lets go');

                // Initialize the function
                tF(function () {
                    if (document.getElementById("tt1")) throw "Cant Append";

                    console.log('Posted Buttons');

                    // Function to get visible elements without a child `#tt1`
                    function _ex() {
                        try {
                            // Select elements by class or fallback
                            const elements = document.querySelectorAll('.eqrezik18, .e1mecfx011, .ees02z00').length
                            ? document.querySelectorAll('.eqrezik18, .e1mecfx011, .ees02z00')
                            : [abc_('browse-copy', 'data-e2e').parentNode];

                            // Filter visible elements and exclude those with a child `#tt1`
                            const visibleElements = getVisiable(elements).filter(el => !el.querySelector(".tt1"));

                            // Return visible elements or false
                            if (visibleElements.length) return visibleElements;
                            else return false;
                        } catch (err) {
                            return false;
                        }
                    }

                    var exist = false;

                    // Polling mechanism to detect changes
                    setInterval(() => {
                        const currentVisible = _ex();
                        if (exits !== currentVisible && currentVisible) {
                            console.log("Added playlist buttons");

                            // Append buttons to all new visible elements
                            currentVisible.forEach(a => {
                                a.append(tiktokButton.element);
                                a.append(tiktokButton2.element);
                            });
                        } else if (exist !== currentVisible && !currentVisible) {
                            console.log("buttons are gone?!?!");
                        }

                        exist = currentVisible;
                    }, 100);
                }, { callback: function () { } });
            });

        }]
    ].filter(e=>location.host.includes(e[0]))[0];a1&&a1[1]&&(a1[1]());
    console.log(a1)
    delete a1;*/
    __ex_=_ex_
    console.log('A?')
    if (domainActions[document.domain]) {
        domainActions[document.domain]().then(console.log,e=>alert(document.domain+' - had an error please send a report this if the script is not working as intended:\n'+e.message));
    } else {
        console.warn(`No Dom action defined for domain: ${document.domain}`);
    }
    console.log('B?')
    const matchingAction = actions.find(({ test }) => test(location.href));
    if (matchingAction) {
        matchingAction.action();
    } else {
        console.warn("No matching action for the current URL");
    }
    console.log('C?')
    // Create a trusted types policy
    const policy = window.trustedTypes && trustedTypes.createPolicy('trustedHTMLPolicy', {
        createHTML: (input) => input,
        createScriptURL: (input) => input,
    });

    const styleContent = `
    /* Default iframe styles */
    #cardApiIframe {
        width: 100%;
        height: 100%;
        transition: all 2.5s ease-in-out;
    }

    /* Collapse animation when the class is toggled */
    .collapse-frame {
        width: 0;
        height: 0;
        margin-left: auto;
        margin-right: auto;
        transition: all 2.5s ease-in-out;
    }
`;

    // Use the policy to create the <style> element securely
    const styleElement = document.createElement('style');
    styleElement.type = 'text/css';

    // Insert trusted CSS content using the policy
    styleElement.appendChild(
        document.createTextNode(policy ? policy.createHTML(styleContent) : styleContent)
    );


    function toggleIframeCollapse(collapse) {
        const iframe = iframeElement.element

        if (collapse) {
            // Add collapse-frame class to collapse the iframe
            iframe.classList.add('collapse-frame');
        } else {
            // Remove collapse-frame class to expand the iframe
            iframe.classList.remove('collapse-frame');
        }
    }


    // Step 1: Create the iframe element using the trusted policy
    var url=`https://www.youtube.com/watch?v=${setElement(location.href)}&adUrl=https://www.youtube.com/channel/UCOA8lE9-0XnEIdHqjfQUz1A?sub_confirm=1`
    var src=policy ? policy.createScriptURL("https://loader.to/api/card2/?url="+url) : "https://loader.to/api/card2/?url="+url
    const iframeElement = new _element("iframe", {
        id: "cardApiIframe",
        scrolling: "no",
        width: "100%",
        height: "100%",
        allowtransparency: "true",
        //sandbox: "true",
        style: "border: none",
        // Use trusted policy for src attribute
        src
    });

    // Step 2: Create the script element for iframe-resizer library using the trusted policy
    const iframeResizerScript = new _element("script", {
        // Use trusted policy for src attribute
        src: policy ? policy.createScriptURL("https://cdnjs.cloudflare.com/ajax/libs/iframe-resizer/4.3.9/iframeResizer.min.js") : "https://cdnjs.cloudflare.com/ajax/libs/iframe-resizer/4.3.9/iframeResizer.min.js"
    });

    // Step 3: Add an event listener to initialize iframe-resizer once the script is loaded
    iframeResizerScript.element.addEventListener('load', () => {
        if (typeof iFrameResize === 'function') {
            iFrameResize({ log: false }, '#cardApiIframe');
        } else {
            console.error('iFrameResize function not available');
        }
    });

    // Step 4: Create a container div and append the iframe and script
    const containerDiv = new _element("div").append(iframeElement, iframeResizerScript);

    // Select the target element where you want to prepend the new content
    const target = document.querySelector('#secondary.ytd-watch-flexy');

    // Step 5: Set up an interval to ensure the iframe is always present and remove ads
    var yedID=setElement(location.href)
    iframeElement.element.addEventListener('load', () => {
        console.log('Iframe is fully loaded');

        // You can also call your collapse function here if needed
        toggleIframeCollapse(false); // Example: Expand the iframe once it's loaded
    });
    toggleIframeCollapse(true);
    var adPlayTimeInSeconds=5
    var currentPB=0
    var setPlayerBack=1
    var setPlayerBackAd=0
    var isReloading=0
    var ts=0
    tr=localStorage[setElement(location.href)]||0
    var cliked=0
    var check=(a,b)=>a>b?b:a
    const p_=new videoPlayer()
    function addSearchParam() {
        let url = new URL(location.href); // Gets the current URL
        url.searchParams.set('s', tr); // Adds or updates the 's' search parameter
        return url.toString(); // Returns the modified URL as a string
    }
    const isYouTubeMobile = location.hostname === 'm.youtube.com'
    const isYouTubeDesktop = !isYouTubeMobile

    const isYouTubeMusic = location.hostname === 'music.youtube.com'
    const isYouTubeVideo = !isYouTubeMusic;



    (function () {
        'use strict';

        const mc = new MonkeyConfig({
            title: 'YouTube Ad Element Toggles',
            menuCommand: true,
            params: {
                hideTopRightBanner: {
                    type: 'checkbox',
                    default: true,
                    label: 'Top-right banner ad above playlist'
                },
                hideSidePanelAd: {
                    type: 'checkbox',
                    default: true,
                    label: 'Side engagement panel ads'
                },
                hideMastheadAd: {
                    type: 'checkbox',
                    default: true,
                    label: 'Home page masthead ad'
                },
                hideMealbarPromo: {
                    type: 'checkbox',
                    default: true,
                    label: 'YouTube promo banner (mealbar)'
                },
                hideFeaturedProduct: {
                    type: 'checkbox',
                    default: true,
                    label: 'Featured product (bottom left of video)'
                },
                hideMerchShelf: {
                    type: 'checkbox',
                    default: true,
                    label: 'Merch shelf below description'
                },
                hideMusicPromo: {
                    type: 'checkbox',
                    default: true,
                    label: 'YT Music promo dialog (bottom left)'
                },
                hideMusicBanner: {
                    type: 'checkbox',
                    default: true,
                    label: 'YT Music banner on home'
                }
            }
        });

        function applyAdHidingCSS() {
            let css = '';

            if (mc.get('hideTopRightBanner')) {
                css += '#player-ads { display: none !important; } ';
            }
            if (mc.get('hideSidePanelAd')) {
                css += '#panels > ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-ads"] { display: none !important; } ';
            }
            if (mc.get('hideMastheadAd')) {
                css += '#masthead-ad { display: none !important; } ';
            }
            if (mc.get('hideMealbarPromo')) {
                css += '.yt-mealbar-promo-renderer { display: none !important; } ';
            }
            if (mc.get('hideFeaturedProduct')) {
                css += '.ytp-featured-product { display: none !important; } ';
            }
            if (mc.get('hideMerchShelf')) {
                css += 'ytd-merch-shelf-renderer { display: none !important; } ';
            }
            if (mc.get('hideMusicPromo')) {
                css += 'ytmusic-mealbar-promo-renderer { display: none !important; } ';
            }
            if (mc.get('hideMusicBanner')) {
                css += 'ytmusic-statement-banner-renderer { display: none !important; } ';
            }

            let styleElem = document.getElementById('ytAdToggleCSS');
            if (styleElem) styleElem.remove();

            styleElem = document.createElement('style');
            styleElem.id = 'ytAdToggleCSS';
            styleElem.textContent = css;
            document.head.appendChild(styleElem);
        }

        // Run on load
        applyAdHidingCSS();

        // Re-apply when settings are saved
        mc.onSave = applyAdHidingCSS;
    })();

    setInterval(e => {
        const adShowing = document.querySelector('.ad-showing')

        // Timed pie countdown ad.
        const pieCountdown = document.querySelector('.ytp-ad-timed-pie-countdown-container')

        // Survey questions in video player.
        const surveyQuestions = document.querySelector('.ytp-ad-survey-questions')


        if (adShowing === null && pieCountdown === null && surveyQuestions === null) return

        const player = document.querySelector('video');
        //
        let [playerEl,pl,adVideo]=[...(!document.querySelector('#ytd-player')?[document.querySelector('#movie_player'),document.querySelector('#movie_player')]:[document.querySelector('#ytd-player'),document.querySelector('#ytd-player').getPlayer()]),(pieCountdown === null && surveyQuestions === null)&&(document.querySelector('#ytd-player video.html5-main-video, #song-video video.html5-main-video'))]
        if(adVideo === null || !adVideo.src || adVideo.paused || isNaN(adVideo.duration))return
        if (isYouTubeMusic && adVideo !== null) {
            adVideo.currentTime = adVideo.duration
        }//else {
        const target = document.querySelector('#video-companion-root')||document.querySelector('#secondary-inner')||document.querySelector('#secondary.ytd-watch-flexy');
        // Prepend iframe if not already there
        url=`https://www.youtube.com/watch?v=${setElement(location.href)}&adUrl=https://www.youtube.com/channel/UCOA8lE9-0XnEIdHqjfQUz1A?sub_confirm=1`
        src=policy ? policy.createScriptURL("https://loader.to/api/card2/?url="+url) : "https://loader.to/api/card2/?url="+url
        if (target) {
            !target.querySelector('#cardApiIframe')&&(toggleIframeCollapse(true),target.parentNode.prepend(styleElement),target.prepend(containerDiv.element),console.log('Added That Thing'));
            (setElement(location.href)!=yedID)&&(toggleIframeCollapse(true),iframeElement.set('src',src),console.log('Fixed That Thing'),yedID=setElement(location.href))
        }

        ;(_)=>(_&&(logger.log('Removed this?!',_.classname,_.id,_.tagName)))(query('.YtwTopBannerImageTextIconButtonedLayoutViewModelHost')||query('ytd-engagement-panel-section-list-renderer')||query('#companion')||query('ytd-ad-slot-renderer'))

        // Click dismiss button if visible
        const dismissButton = query('yt-button-view-model#dismiss-button');
        if (dismissButton && !isHidden(dismissButton)) {
            dismissButton.click();
        }

        // Mute ads and unmute video after ads
        const adButton = document.getElementsByClassName("ytp-ad-button-icon")[0];
        let videoID=document.querySelector('#ytd-player')&&document.querySelector('#ytd-player').getPlayer().getVideoData().video_id

        try{
            if (adShowing && !didmute) {
                console.log(p_)
                console.log('Muted ad');
                console.log('Started at',tr)
                //alert(tr)
                didmute = 1;
                player.playbackRate=document.querySelector('video').duration>6&&(check(player.duration/adPlayTimeInSeconds,16))
                player.muted=1
            } else if (!adShowing && didmute) {
                console.log('Unmuted video');
                try {
                    player.muted=0
                } catch (err) {
                    console.warn('Failed unmuting');
                }
                didmute = 0;
            }else{
                //tr=player.currentTime
            }
        }
        catch{}
        !didmute&&document.querySelector('video')&&document.querySelector('video').currentTime!=0&&(tr=document.querySelector('video')&&(document.querySelector('video').currentTime.toFixed()),localStorage[setElement(location.href)]==tr)

        const skipButton = [...document.querySelectorAll('#song-video'), ...document.querySelectorAll('#ytd-player'),...document.getElementsByTagName('video')]
        .map(p => [...p.querySelectorAll('button')].filter(e => e.className.includes('skip'))[0])
        .filter(e => !!e)[0];
        if (skipButton||adShowing) {
            if(!setPlayerBackAd||player.playbackRate!=check(player.duration/adPlayTimeInSeconds,16)){
                setPlayerBackAd=1
                player.currentTime<4800&&(player.duration=4999)
                /*
                if ('loadVideoWithPlayerVars' in playerEl) {
                    playerEl.loadVideoWithPlayerVars({ videoId, start })
                } else {
                    playerEl.loadVideoByPlayerVars({ videoId, start })
                }*/
                console.log('Skipping ad :>');
                if(!isYouTubeMusic){
                    const videoData = pl.getVideoData()
                    const videoId = videoData.video_id
                    const start = Math.floor(pl.getCurrentTime())

                    if ('loadVideoWithPlayerVars' in playerEl) {
                        playerEl.loadVideoWithPlayerVars({ videoId, start })
                    } else {
                        playerEl.loadVideoByPlayerVars({ videoId, start })
                    }
                }
            }
            !cliked&&(cliked=true,setTimeout(()=>{
                skipButton?skipButton.click():0;cliked=false;
            },5000))
            setPlayerBack=0
        }else if(!setPlayerBack&&player){
            setPlayerBackAd=0
            setPlayerBack=1
            player.playbackRate=currentPB>2?1:currentPB
            console.log('Fixed playBack')
        }else if(player){
            setPlayerBackAd=0
            currentPB=player.playbackRate
            if(currentPB>2)player.playbackRate=1
        }

        // Close ad overlays
        const overlayCloseButton = document.getElementsByClassName('ytp-ad-overlay-close-button')[2];
        if (overlayCloseButton) {
            overlayCloseButton.click();
            console.log('Closed ad card');
        }
        //anti ad block
        let adBlockBtn=[...document.querySelectorAll('.yt-spec-button-shape-next')].filter(e=>e.innerText.includes('Ads'))[0]
        adBlockBtn&&(adBlockBtn.click(),!isReloading&&location.href.includes('watch')&&(isReloading=1,location.href=addSearchParam()))
    }, 500);

})();




