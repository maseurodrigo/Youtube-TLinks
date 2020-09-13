// to save tradelinks txt file
function saveTLinksFile(title, text) {
    var textFileAsBlob = new Blob([text], {type:'text/plain'});
    var downloadLink = document.createElement("a");
    downloadLink.download = title;
    if (window.webkitURL != null) {
        downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob); // chrome
    } else {
        // firefox
        downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
        downloadLink.onclick = destroyClickedElement;
        downloadLink.style.display = "none";
        document.body.appendChild(downloadLink);
    } downloadLink.click();
};
/* --------------------------------------------------------------------------- */
// main listener function
browser.storage.onChanged.addListener((changes, area) => {
    if(area == 'local' && 'getTLinks' in changes) {
        getTradeLinks(changes.getTLinks.newValue.status);
    }
});
// store tradelinks on file
function getTradeLinks(status) {
    if(status) {
        var video = window.location.href.split("?v=")[1], 
            apiKey = "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX", 
            mResults = 100,
            tlExpression = /(https?:\/\/[^\s]+)/g,
            mURLs = "";
        let apiUrl = 'https://www.googleapis.com/youtube/v3/commentThreads?key=' + apiKey 
            + '&textFormat=plainText&part=snippet&videoId=' + video 
            + '&maxResults=' + mResults;
        fetch(apiUrl).then(res => res.json()) .then((outJSON) => {
            for (var i=0; i < outJSON.items.length; i++) {
                var actlObj = outJSON.items[i],
                    tmpCommURL = actlObj.snippet.topLevelComment.snippet.textOriginal.match(tlExpression);
                for (comm in tmpCommURL) {
                    if(tmpCommURL[comm].startsWith("https://steamcommunity.com/tradeoffer/new/?partner=")) {
                        mURLs+=(tmpCommURL[comm]+"\n");
                    }
                }
            } saveTLinksFile("tlinks.txt",mURLs.substring(0, mURLs.length-1));
        }).catch(err => { console.log(err); });
        browser.storage.local.remove({ getTLinks });
    }
}