define([
    'lib/config',
    'lib/load-script',
    'commercial/modules/commercial-features'
], function (
    config,
    loadScript,
    commercialFeatures
) {
    function shouldPreroll(videoInfo) {
        // The `hasMultipleVideosInPage` flag is temporary until the # will be fixed
        var shouldPreroll = commercialFeatures.videoPreRolls &&
            !config.page.hasMultipleVideosInPage &&
            !config.page.hasYouTubeAtom &&
            !config.page.isFront &&
            !config.page.isPaidContent &&
            !config.page.sponsorshipType;

        return shouldPreroll && !videoInfo.shouldHideAdverts;
    }

    function initPreroll(videoEl, videoInfo) {
        if (!shouldPreroll(videoInfo)) {
            return;
        }

        loadScript('https://imasdk.googleapis.com/js/sdkloader/ima3.js').then(function () {

        });
    }

    return initPreroll;
});
