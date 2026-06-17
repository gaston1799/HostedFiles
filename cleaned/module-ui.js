(function(){
    'use strict';
    const styles = `
        .downloader-btn {
            position: absolute;
            right: 0;
            bottom: 0;
            z-index: 9999;
            padding: 2px 6px;
            background: rgba(0,0,0,0.6);
            color: #fff;
            font-size: 12px;
            border: none;
            cursor: pointer;
        }
        .downloader-toast {
            position: fixed;
            bottom: 10px;
            left: 10px;
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 6px 10px;
            border-radius: 4px;
            z-index: 10000;
        }
    `;
    GM_addStyle(styles);

    const toastContainer = document.createElement('div');
    document.addEventListener('DOMContentLoaded',()=>{
        document.body.appendChild(toastContainer);
    });

    window.ui = {
        showToast(msg, timeout=3000){
            const div = document.createElement('div');
            div.className = 'downloader-toast';
            div.textContent = msg;
            toastContainer.appendChild(div);
            setTimeout(()=>div.remove(), timeout);
        },
        createButton(label){
            const btn = document.createElement('button');
            btn.textContent = label;
            btn.className = 'downloader-btn';
            return btn;
        }
    };
})();
