(function(){
    'use strict';
    // Override document.createElement to block ad iframes
    const originalCreate = document.createElement;
    document.createElement = function(tag, options){
        const el = originalCreate.call(document, tag, options);
        if(tag.toLowerCase() === 'iframe'){
            const setAttribute = el.setAttribute;
            el.setAttribute = function(name, value){
                if(name === 'src' && /ad|doubleclick|tracking/.test(value)){
                    // Block ad iframe
                    console.warn('Blocked iframe:', value);
                    return;
                }
                return setAttribute.call(this, name, value);
            };
        }
        return el;
    };
    // expose a toggle
    window.adFilterEnabled = true;
})();
