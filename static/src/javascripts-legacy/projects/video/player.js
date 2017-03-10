define([
    'lib/add-event-listener',
    'raw-loader!video/toolbar.html'
], function (addEventListener, toolbarHtml) {
    var requestFullscreen = (function () {
        var video = document.createElement('video');
        return 'requestFullscreen' in video ?
        'requestFullscreen' :
        'webkitRequestFullscreen' in video ?
        'webkitRequestFullscreen' :
        'mozRequestFullScreen' in video ?
        'mozRequestFullScreen' :
        'msRequestFullscreen';
    }());

    var stubToolbar;

    return initVideo;

    function initVideo(container) {

        var toolbar = initToolbar(container);

        var video = Video(container);

        addEventListener(video.play, 'click', function () {
            if( video.media.paused ) {
                video.media.play();
                container.classList.add('is-playing');
            } else {
                video.media.pause();
                container.classList.remove('is-playing');
            }
        });

        addEventListener(video.mute, 'click', function () {
            if( video.media.volume ) {
                video.sound.value = video.media.volume = 0;
                container.classList.add('is-muted');
                container.classList.remove('is-fsound');
            } else {
                video.sound.value = video.media.volume = 1;
                container.classList.add('is-fsound');
                container.classList.remove('is-muted');
            }
        });

        addEventListener(video.fscreen, 'click', function () {
            video.media.parentNode[requestFullscreen]();
        });

        addEventListener(video.sound, 'input', function () {
            video.media.volume = video.sound.value;
            if( video.media.volume === 0 ) {
                container.classList.add('is-muted');
                container.classList.remove('is-fsound');
            } else if( video.media.volume === 1 ) {
                container.classList.remove('is-muted');
                container.classList.add('is-fsound');
            } else {
                container.classList.remove('is-muted');
                container.classList.remove('is-fsound');
            }
        });

        addEventListener(video.media, 'timeupdate', function () {
            video.progress.value = video.media.currentTime / video.media.duration;
            video.elapsed.textContent = formatTime(video.media.currentTime);
        });

        addEventListener(video.media, 'loadedmetadata', function () {
            let duration = controls.querySelector('.vcontrols__time__duration');
            duration.textContent = formatTime(video.media.duration);
        }, { once: true });
    }

    function Video(container) {
        return Object.freeze({
            controls : container.querySelector('.gvideo__controls');
            media    : container.querySelector('.gvideo__video'),
            play     : controls.querySelector('.vcontrols__play'),
            progress : controls.querySelector('.vcontrols__progress'),
            mute     : controls.querySelector('.vcontrols__mute'),
            sound    : controls.querySelector('.vcontrols__sound'),
            fscreen  : controls.querySelector('.vcontrols__fullscreen'),
            elapsed  : controls.querySelector('.vcontrols__time__elapsed')
        });
    }

    function formatTime(seconds) {
        return 'm:s'
            .replace('m', (seconds / 60).toFixed(0).padStart(2, '0'))
            .replace('s', (seconds % 60).toFixed(0).padStart(2, '0'));
    }

    function initToolbar(container) {
        if (!stubToolbar) {
            stubToolbar = document.createElement('div');
            stubToolbar.className = 'gvideo__controls vcontrols';
            stubToolbar.innerHtml = toolbarHtml;
        }

        container.appendChild(stubToolbar.cloneNode(true));
    }
});
