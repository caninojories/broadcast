// Muaz Khan         - www.MuazKhan.com
// MIT License       - www.WebRTC-Experiment.com/licence
// Experiments       - github.com/muaz-khan/WebRTC-Experiment

var config = {
    openSocket: function(config) {

        var channel = config.channel || location.href.replace( /\/|:|#|%|\.|\[|\]/g , '');
        var socket = io.connect('192.168.0.102:32769');
        socket.channel = channel;
        socket.on('message', function(data) {
          config.onmessage(data);
        });
        /* Get the url id */
        querystring = window.location.search;
        querystring = querystring.substring(1).split('=')[1];

        socket.emit('initiate', {
          uniqueAddressToken: querystring
        });

        socket.send = function(data) {
          socket.emit('message', data);
        };

        config.onopen && setTimeout(config.onopen, 1);
        return socket;
    },
    onRemoteStream: function(media) {
        var video = media.video;
        video.setAttribute('controls', true);

        if (querystring) {
          participants.insertBefore(video, participants.firstChild);
        }

        video.play();
        rotateVideo(video);
    },
    onRoomFound: function(room) {
        var alreadyExist = document.getElementById(room.broadcaster);
        if (alreadyExist) return;

            captureUserMedia(function() {
                broadcastUI.joinRoom({
                  uniqueAddressToken: room.uniqueAddressToken,
                    roomToken: room.roomToken,
                    joinUser: room.broadcaster
                });
            });
            hideUnnecessaryStuff();
    }
};

function createButtonClickHandler() {
var uniqueAddressToken = uniqueToken();

    captureUserMedia(function() {
        broadcastUI.createRoom({
            roomName: (document.getElementById('conference-name') || { }).value || 'Anonymous',
            uniqueAddressToken : uniqueAddressToken
        });
    });
    hideUnnecessaryStuff();
}

function captureUserMedia(callback) {
  // var video = document.createElement('video');
  // video.setAttribute('autoplay', true);
  // video.setAttribute('controls', true);
  // var constraints = {};
  // participants.insertBefore(video, participants.firstChild);
  // if (!querystring) {
  //   constraints = {
  //     video: video
  //   }
  //   getUserMedia({
  //       video: video,
  //       constraints: {
  //         video: true,
  //         audio: false
  //       },
  //       onsuccess: function(stream) {
  //           config.attachStream = stream;
  //           callback && callback();
  //
  //           video.setAttribute('muted', true);
  //           rotateVideo(video);
  //       },
  //       onerror: function() {
  //           alert('unable to get access to your webcam.');
  //           callback && callback();
  //       }
  //   });
  // } else {
  //   constraints = {
  //     video: false,
  //     audio: true
  //   }
  //
  //   getUserMedia({
  //     video: video,
  //     constraints: {
  //       video: false,
  //       audio: true
  //     },
  //       onsuccess: function(stream) {
  //           config.attachStream = stream;
  //           // stream.stop();
  //           callback && callback();
  //
  //           video.setAttribute('muted', true);
  //           rotateVideo(video);
  //       },
  //       onerror: function() {
  //           alert('unable to get access to your webcam.');
  //           callback && callback();
  //       }
  //   });
  // }
    var video = document.createElement('video');
    video.setAttribute('autoplay', true);
    video.setAttribute('controls', true);
    var constraints = {};

    if (!querystring) {
      constraints = {
        video: true,
        audio: false
      }
      participants.insertBefore(video, participants.firstChild);
    } else {
      constraints = {
        video: true,
        audio: false
      }
    }

    getUserMedia({
        video: video,
        constraints: constraints,
        onsuccess: function(stream) {
            config.attachStream = stream;
            callback && callback();
            if (querystring) {
              stream.stop();
            }

            video.setAttribute('muted', true);
            rotateVideo(video);
        },
        onerror: function() {
            alert('unable to get access to your webcam.');
            callback && callback();
        }
    });
}

/* on page load: get public rooms */
var broadcastUI = broadcast(config);

/* UI specific */
var participants = document.getElementById("participants") || document.body;
var startConferencing = document.getElementById('start-conferencing');
var roomsList = document.getElementById('rooms-list');

if (startConferencing) startConferencing.onclick = createButtonClickHandler;

function hideUnnecessaryStuff() {
    var visibleElements = document.getElementsByClassName('visible'),
        length = visibleElements.length;
    for (var i = 0; i < length; i++) {
        visibleElements[i].style.display = 'none';
    }
}

function rotateVideo(video) {
    video.style[navigator.mozGetUserMedia ? 'transform' : '-webkit-transform'] = 'rotate(0deg)';
    setTimeout(function() {
        video.style[navigator.mozGetUserMedia ? 'transform' : '-webkit-transform'] = 'rotate(360deg)';
    }, 1000);
}

function uniqueToken() {
    var s4 = function() {
        return Math.floor(Math.random() * 0x10000).toString(16);
    };
    return s4() + s4() + "-" + s4() + "-" + s4() + "-" + s4() + "-" + s4() + s4() + s4();
}

(function() {
    var uniqueToken = document.getElementById('unique-token');
    if (uniqueToken)
        if (location.hash.length > 2) uniqueToken.parentNode.parentNode.parentNode.innerHTML = '<h2 style="text-align:center;"><a href="' + location.href + '" target="_blank">Share this link</a></h2>';
        else uniqueToken.innerHTML = uniqueToken.parentNode.parentNode.href = '#' + (Math.random() * new Date().getTime()).toString(36).toUpperCase().replace( /\./g , '-');
})();
