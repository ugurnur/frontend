define([], function () {
    return function () {
        this.id = 'NativeVideo';
        this.start = '2017-03-09';
        this.expiry = '2017-04-01';
        this.author = 'Akash Askoolum';
        this.description = 'Test if removing videojs impacts video consumption';
        this.showForSensitive = true;
        this.audience = 1;
        this.audienceOffset = 0;

        this.canRun = function () {
            return document.getElementsByClassName('gu-media-wrapper--video').length > 0;
        };

        this.variants = [{
            id: 'control',
            test: function () {}
        }, {
            id: 'variant',
            test: function () {}
        }];
    }
});
