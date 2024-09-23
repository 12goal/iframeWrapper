"use strict";
var iframeWp;
(function (iframeWp) {
    var win = window;
    var id = Math.random().toString(36).slice(2, 7);
    var iframeContentId = 'iframe_wp_content_' + id;

    function createIframe(target, uri) {
        const heightPct = `${target.offsetHeight / target.offsetWidth * 100}%`;
        target.insertAdjacentHTML('beforeend', `<div id="${iframeContentId}" style="padding-bottom: ${heightPct}" data-fs="false"></div>`);

        var iframeUrl = new URL(uri);

        var iframe = document.createElement("iframe");
        iframe.src = iframeUrl.toString();
        iframe.setAttribute("allowfullscreen", "true");
        iframe.setAttribute("style", `
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        top: 0;
        width: 100%;
        height: 100%;
        border: 0;
        border-top-right-radius: 8px;
        border-top-left-radius: 8px;
        z-index: 5;`);

        document.getElementById(iframeContentId).appendChild(iframe);
    }

    function createControl(target) {
        target.insertAdjacentHTML('beforeend', `
            <div style="
                width: 100%;
                float: left;
                background: #1e2029;
                border-bottom-left-radius: 8px;
                border-bottom-right-radius: 8px;
                padding: 5px 10px;
                box-sizing: border-box;">
                <div>
                    <div>
                        <svg style="
                            float: left;
                            text-align: center;
                            color: #8f9bad;
                            margin: 11px 5px;
                            height: 18px;
                            width: 18px;"
                            onclick="enableFullscreen${id}()" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="expand" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="svg-inline--fa fa-expand fa-w-14 fa-7x"><path fill="currentColor" d="M0 180V56c0-13.3 10.7-24 24-24h124c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12H64v84c0 6.6-5.4 12-12 12H12c-6.6 0-12-5.4-12-12zM288 44v40c0 6.6 5.4 12 12 12h84v84c0 6.6 5.4 12 12 12h40c6.6 0 12-5.4 12-12V56c0-13.3-10.7-24-24-24H300c-6.6 0-12 5.4-12 12zm148 276h-40c-6.6 0-12 5.4-12 12v84h-84c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h124c13.3 0 24-10.7 24-24V332c0-6.6-5.4-12-12-12zM160 468v-40c0-6.6-5.4-12-12-12H64v-84c0-6.6-5.4-12-12-12H12c-6.6 0-12 5.4-12 12v124c0 13.3 10.7 24 24 24h124c6.6 0 12-5.4 12-12z" class=""></path></svg>
                    </div>
                </div>
            </div>
            `);
    }

    function enableFullscreen() {
        document.getElementById(iframeContentId).setAttribute('data-fs', true);

        var elem = document.documentElement;
        if (elem.requestFullscreen) elem.requestFullscreen();
        else if (elem.webkitRequestFullscreen) elem.webkitRequestFullscreen();
        else if (elem.msRequestFullscreen) elem.msRequestFullscreen();
    }

    function disableFullscreen() {
        document.getElementById(iframeContentId).setAttribute('data-fs', false);

        if (document.exitFullscreen) document.exitFullscreen();
        else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
        else if (document.msExitFullscreen) document.msExitFullscreen();
    }

    function exitHandler() {
        var fullscreenElement = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement;

        if (fullscreenElement == null) {
            disableFullscreen();
        }
    }

    document.addEventListener('fullscreenchange', exitHandler, false);
    document.addEventListener('mozfullscreenchange', exitHandler, false);
    document.addEventListener('MSFullscreenChange', exitHandler, false);
    document.addEventListener('webkitfullscreenchange', exitHandler, false);

    function addCss(target) {
        target.insertAdjacentHTML('beforeend', `
            <style type="text/css">
                #${iframeContentId} {
                    background: rgba(22, 23, 34, .84);
                    float: left;
                    width: 100%;
                    border-top-left-radius: 8px;
                    border-top-right-radius: 8px;
                    position: relative;
                }
                #${iframeContentId}[data-fs="true"] {
                    position: fixed;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    top: 0;
                    z-index: 9999999;
                }
            <style>
            `);
    }

    function launch(options) {
        var target = document.getElementById(options.targetElementId);
        if (!target) {
            console.error("No element with id '".concat(options.targetElementId, "' found"));
            return;
        }

        addCss(target);
        createIframe(target, options.iframeUrl);
        createControl(target, enableFullscreen);
    }

    iframeWp.launch = launch;
    iframeWp.createIframe = createIframe;
    win['enableFullscreen' + id] = enableFullscreen;

    win.iframeWp = {
        launch: launch
    };
})(iframeWp || (iframeWp = {}));