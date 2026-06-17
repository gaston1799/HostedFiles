(function() {
    'use strict';
    // Utility helpers shared across modules
    window.utils = {
        // Sleep helper returns a promise resolved after ms milliseconds
        sleep: ms => new Promise(r => setTimeout(r, ms)),

        // Download a file by creating a temporary anchor element
        downloadFile(url, filename) {
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        },

        // Extract the last part of a url as file name
        fileNameFromUrl(url) {
            try {
                const u = new URL(url);
                return u.pathname.split('/').pop().split('?')[0] || 'download';
            } catch (e) {
                return 'download';
            }
        }
    };
})();
