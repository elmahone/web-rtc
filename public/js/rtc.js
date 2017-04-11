'use strict';

const webrtc = new SimpleWebRTC({
    nick: 'Nick mane',
    url: 'https://localhost:8888',
    // the id/element dom element that will hold "our" video
    localVideoEl: 'localVideo',
    // the id/element dom element that will hold remote videos
    remoteVideosEl: '',
    // immediately ask for camera access
    autoRequestMedia: true,
});

// we have to wait until it's ready
webrtc.on('readyToCall', function () {
    // you can name it anything
    webrtc.joinRoom('the room');
});

webrtc.on('videoAdded', function (video, peer) {
    console.log('video added', peer);
    const remotes = document.getElementById('remotes');
    if (remotes) {
        const container = document.createElement('div');
        container.className = 'videoContainer';
        container.id = 'container_' + webrtc.getDomId(peer);
        container.appendChild(video);
        if (peer && peer.pc) {
            const connstate = document.createElement('div');
            const nickname = document.createElement('div');
            connstate.className = 'connectionstate';
            nickname.className = 'nickname';
            container.appendChild(connstate);
            container.appendChild(nickname);
            nickname.innerText = peer.nick;
            peer.pc.on('iceConnectionStateChange', function (event) {
                switch (peer.pc.iceConnectionState) {
                    case 'checking':
                        connstate.innerText = 'Connecting to peer...';
                        break;
                    case 'connected':
                    case 'completed': // on caller side
                        connstate.innerText = 'Connection established.';
                        break;
                    case 'disconnected':
                        connstate.innerText = 'Disconnected.';
                        break;
                    case 'failed':
                        break;
                    case 'closed':
                        connstate.innerText = 'Connection closed.';
                        break;
                }
            });
        }

        // suppress contextmenu
        video.oncontextmenu = function () { return true; };

        remotes.appendChild(container);
    }
});

// local p2p/ice failure
webrtc.on('iceFailed', function (peer) {
    const connstate = document.querySelector('#container_' + webrtc.getDomId(peer) + ' .connectionstate');
    console.log('local fail', connstate);
    if (connstate) {
        connstate.innerText = 'Connection failed.';
        fileinput.disabled = 'disabled';
    }
});

// remote p2p/ice failure
webrtc.on('connectivityError', function (peer) {
    const connstate = document.querySelector('#container_' + webrtc.getDomId(peer) + ' .connectionstate');
    console.log('remote fail', connstate);
    if (connstate) {
        connstate.innerText = 'Connection failed.';
        fileinput.disabled = 'disabled';
    }
});

// a peer video was removed
webrtc.on('videoRemoved', function (video, peer) {
    console.log('video removed ', peer);
    const remotes = document.getElementById('remotes');
    const el = document.getElementById(peer ? 'container_' + webrtc.getDomId(peer) : 'localScreenContainer');
    if (remotes && el) {
        remotes.removeChild(el);
    }
});