/* eslint-disable no-console */
/* global google */

define([
    'lib/$',
    'lib/config',
    'lib/detect',
    'lib/fastdom-promise',
    'lib/defer-to-analytics',
    'lib/add-event-listener',
    'lib/load-script',
    'common/modules/component',
    'common/modules/video/events',
    'common/modules/video/metadata',
    'common/modules/video/onward-container',
    'common/modules/video/more-in-series-container',
    'commercial/modules/commercial-features'
], function (
    $,
    config,
    detect,
    fastdomPromise,
    deferToAnalytics,
    addEventListener,
    loadScript,
    Component,
    mediaEvents,
    mediaMetadata,
    onwardContainer,
    moreInSeriesContainer,
    commercialFeatures
) {
    function getMediaElements() {
        return fastdomPromise.read(function () {
            return $('.js-gu-media--enhance');
        });
    }

    function getGAEventLabel(el) {
        var embedPath = el.getAttribute('data-embed-path');
        var canonicalUrl = el.getAttribute('data-canonical-url') || embedPath;
        return canonicalUrl || window.location.pathname;
    }

    function initEventHandlers(el) {
        var mediaType = el.tagName.toLowerCase();
        var mediaId = el.getAttribute('data-media-id');
        var gaEventLabel = getGAEventLabel(el);

        deferToAnalytics(function () {
            mediaEvents.addContentEvents(el, mediaId, mediaType);
            mediaEvents.bindGlobalEvents(el);
            mediaEvents.initOphanTracking(el, mediaId);
            mediaEvents.bindGoogleAnalyticsEvents(el, gaEventLabel);
            mediaEvents.bindContentEvents(el);
        });
    }

    function getMediaType() {
        return config.page.contentType.toLowerCase();
    }

    function initOnwardContainer() {
        if (!config.isMedia) {
            return;
        }

        var mediaType = getMediaType();
        var els = $(mediaType === 'video' ? '.js-video-components-container' : '.js-media-popular');

        els.each(function(el) {
            onwardContainer.init(el, mediaType);
        });
    }

    function initMoreInSeriesContainer() {
        if (!config.isMedia || !config.page.showRelatedContent || !config.page.section) {
            return;
        }

        var el  = $('.js-more-in-section')[0];
        moreInSeriesContainer.init(
            el, getMediaType(),
            config.page.section,
            config.page.shortUrl,
            config.page.seriesId
        );
    }

    function initExtraPageFurniture() {
        initOnwardContainer();
        initMoreInSeriesContainer();
    }

    function initEndSlate(el) {
        //end-slate url follows the patten /video/end-slate/section/<section>.json?shortUrl=
        //only show end-slate if page has a section i.e. not on the `/global` path
        //e.g https://www.theguardian.com/global/video/2016/nov/01/what-happened-at-the-battle-of-orgreave-video-explainer
        var showEndSlate = el.getAttribute('data-show-end-slate') === 'true' && !!config.page.section;

        if (showEndSlate && detect.isBreakpoint({ min: 'desktop' })) {
            var endStateClass = 'vjs-has-ended';
            var endSlatePath = el.getAttribute('data-end-slate');

            var endSlate = new Component();
            endSlate.endpoint = endSlatePath;

            addEventListener(el, mediaEvents.constructEventName('content:play', el), function () {
                endSlate.fetch(el.parentNode, 'html');

                addEventListener(el, 'ended', function () {
                    el.parentNode.classList.add(endStateClass);
                });
            });

            addEventListener(el, 'playing', function () {
                el.parentNode.classList.remove(endStateClass);
            });
        }
    }

    function initPreroll(el, mediaInfo) {
        // The `hasMultipleVideosInPage` flag is temporary until the # will be fixed
        var shouldPreroll = commercialFeatures.videoPreRolls &&
            !config.page.hasMultipleVideosInPage &&
            !config.page.hasYouTubeAtom &&
            !config.page.isFront &&
            !config.page.isPaidContent &&
            !config.page.sponsorshipType;

        var withPreroll = shouldPreroll && !mediaInfo.shouldHideAdverts;

        // https://developers.google.com/interactive-media-ads/docs/sdks/html5/quickstart
        if (withPreroll) {

            var height = el.getBoundingClientRect().height;
            var width = el.getBoundingClientRect().width;

            loadScript('https://imasdk.googleapis.com/js/sdkloader/ima3.js').then(function () {
                var adsManager;
                var adsContainer = $('.gu-media__ads-container')[0];

                var adDisplayContainer = new google.ima.AdDisplayContainer(
                    adsContainer,
                    el
                );

                adDisplayContainer.initialize();

                var adsLoader = new google.ima.AdsLoader(adDisplayContainer);

                // Add event listeners
                adsLoader.addEventListener(
                    google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED,
                    onAdsManagerLoaded,
                    false);
                adsLoader.addEventListener(
                    google.ima.AdErrorEvent.Type.AD_ERROR,
                    onAdError,
                    false);

                function onAdError(adErrorEvent) {
                    // Handle the error logging and destroy the AdsManager
                    console.log(adErrorEvent.getError());
                    adsManager.destroy();
                }

                // An event listener to tell the SDK that our content video
                // is completed so the SDK can play any post-roll ads.
                var contentEndedListener = function() {adsLoader.contentComplete();};
                el.onended = contentEndedListener;

                // Request video ads.
                var adsRequest = new google.ima.AdsRequest();
                adsRequest.adTagUrl = 'https://pubads.g.doubleclick.net/gampad/ads?' +
                    'sz='+640+'x'+480+'&iu=/124319096/external/single_ad_samples&ciu_szs=300x250&' +
                    'impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&' +
                    'cust_params=deployment%3Ddevsite%26sample_ct%3Dlinear&correlator=';

                // Specify the linear and nonlinear slot sizes. This helps the SDK to
                // select the correct creative if multiple are returned.
                adsRequest.linearAdSlotWidth = width;
                adsRequest.linearAdSlotHeight = height;
                adsRequest.nonLinearAdSlotWidth = width;
                adsRequest.nonLinearAdSlotHeight = 150;

                el.addEventListener('play', requestAds);

                function requestAds() {
                    adsLoader.requestAds(adsRequest);
                }

                function onAdsManagerLoaded(adsManagerLoadedEvent) {
                    // Get the ads manager.
                    adsManager = adsManagerLoadedEvent.getAdsManager(el);  // See API reference for contentPlayback

                    // Add listeners to the required events.
                    adsManager.addEventListener(
                        google.ima.AdErrorEvent.Type.AD_ERROR,
                        onAdError);
                    adsManager.addEventListener(
                        google.ima.AdEvent.Type.CONTENT_PAUSE_REQUESTED,
                        onContentPauseRequested);
                    adsManager.addEventListener(
                        google.ima.AdEvent.Type.CONTENT_RESUME_REQUESTED,
                        onContentResumeRequested);

                    try {
                        // Initialize the ads manager. Ad rules playlist will start at this time.
                        adsManager.init(640, 360, google.ima.ViewMode.NORMAL);
                        // Call start to show ads. Single video and overlay ads will
                        // start at this time; this call will be ignored for ad rules, as ad rules
                        // ads start when the adsManager is initialized.
                        adsManager.start();
                    } catch (adError) {
                        // An error may be thrown if there was a problem with the VAST response.
                    }
                }

                function onContentPauseRequested() {
                    // This function is where you should setup UI for showing ads (e.g.
                    // display ad timer countdown, disable seeking, etc.)
                    el.removeEventListener('ended', contentEndedListener);
                    el.pause();
                }

                function onContentResumeRequested() {
                    // This function is where you should ensure that your UI is ready
                    // to play content.
                    el.addEventListener('ended', contentEndedListener);
                    el.play();

                    // HACK to get video controls back
                    adsContainer.parentNode.removeChild(adsContainer);
                }
            });
        }
    }

    function initMediaElement(el, mediaInfo) {
        initPreroll(el, mediaInfo);

        // style element

        initEndSlate(el);
    }

    function init() {
        getMediaElements().then(function (els) {
            els.each(function (el) {
               initEventHandlers(el);
           });
           return els;
        }).then(function (els) {
            els.each(function(el) {
                mediaMetadata.getVideoInfo($(el)).then(function (mediaInfo) {
                    if (mediaInfo.expired) {
                        console.log('media has expired');
                    } else {
                        mediaMetadata.isGeoBlocked(el).then(function (isMediaGeoBlocked) {
                            if (isMediaGeoBlocked) {
                                console.log('media is geo-blocked');
                            } else {
                                initMediaElement(el, mediaInfo);
                            }
                        });
                    }
                });
            });
            initExtraPageFurniture();
        });
    }

    return {
        init: init
    }
});
