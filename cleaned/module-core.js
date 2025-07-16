(function(){
    'use strict';
    const {sleep, downloadFile, fileNameFromUrl} = window.utils;
    const {showToast, createButton} = window.ui;

    function processMedia(el){
        if(el.dataset.downloaderAttached) return;
        el.dataset.downloaderAttached = 'true';
        const btn = createButton('Download');
        btn.addEventListener('click', () => {
            const src = el.currentSrc || el.src;
            if(!src) return;
            const name = fileNameFromUrl(src);
            downloadFile(src, name);
            showToast('Downloading ' + name);
        });
        // position button relative to parent
        const parent = el.parentElement;
        if(parent && getComputedStyle(parent).position === 'static'){
            parent.style.position = 'relative';
        }
        parent.appendChild(btn);
    }

    function scan(){
        document.querySelectorAll('video, img').forEach(processMedia);
    }

    window.initDownloader = function(){
        scan();
        // Rescan periodically for dynamically loaded media
        setInterval(scan, 3000);
    };
})();
