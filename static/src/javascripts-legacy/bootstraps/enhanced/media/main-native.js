/* eslint-disable no-console */

define([
    'lib/$',
    'lib/config',
    'lib/detect',
    'lib/fastdom-promise',
    'lib/defer-to-analytics',
    'lib/add-event-listener',
    'common/modules/component',
    'common/modules/video/events',
    'common/modules/video/metadata',
    'common/modules/video/onward-container',
    'common/modules/video/more-in-series-container',
    'projects/video/player'
], function (
    $,
    config,
    detect,
    fastdomPromise,
    deferToAnalytics,
    addEventListener,
    Component,
    mediaEvents,
    mediaMetadata,
    onwardContainer,
    moreInSeriesContainer,
    videoPlayer
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

    function initClientSidePageFurniture() {
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

    function initMediaElement(el) {
        // style element
        videoPlayer(el);
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
                                initMediaElement(el);
                            }
                        });
                    }
                });
            });
            initClientSidePageFurniture();
        });
    }

    return {
        init: init
    }
});
