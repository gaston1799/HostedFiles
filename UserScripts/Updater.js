setTimeout(() => {
    // Get script update URL from GM_info
    const fileURL = GM_info.script.fileURL;
    // Request the latest version of the script from fileURL
    GM_xmlhttpRequest({
        method: 'GET',
        url: fileURL,
        onload: function(response) {
            // Extract version from fetched script
            const match = response.responseText.match(/\/\/ @version\s+(\S+)/);
            if (match) {
                const newVersion = match[1];
                const currentVersion = GM_info.script.version;
                // If new version is greater than current
                if (newVersion > currentVersion) {
                    const msg =
                        "A newer version (" + newVersion +
                        ') of the script "' + GM_info.script.name +
                        '" by ' + GM_info.script.author +
                        " is available.\nDo you want to download it?";
                    if (confirm(msg)) {
                        var win = window.open(fileURL, "_blank");
                        setTimeout(() => win.close(), 100);
                    }
                }
            }
        },
        onerror: function(error) {
            console.error('Error fetching script content:', error);
        }
    });
});