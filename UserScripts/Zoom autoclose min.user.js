// ==UserScript==
// @name Zoom autoclose
// @namespace http://tampermonkey.net/
// @version 0.33
// @description Autoclose the zoom page when zoom in launched
// @author You
// @match *://us05web.zoom.us/*
// @match https://us05web.zoom.us/
// @grant none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/502547/Zoom%20autoclose.user.js
// @updateURL https://update.greasyfork.org/scripts/502547/Zoom%20autoclose.meta.js
// @require https://raw.githubusercontent.com/naquangaston/HostedFiles/main/UserScripts/Updater.js
// ==/UserScript==
// @license MIT
console.log("a"), document.domain.includes("zoom") && (window.onhashchange = function(o) {
    window.close(), history.back()
}), location.hash.includes("suc") && (window.close(), history.back(), console.log("Back"));