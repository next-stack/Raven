var Raven = Raven || {};

/**
 * Image loading
 * @param url - {string} - Requested URL
 * @param onComplete - {function} - Callback for completion handler, default undefined
 * @param onProgress - {function} - Callback for progress handler, default undefined
 */
Image.prototype.load = function(url, onComplete, onProgress){
    var _this = this;
    var xmlHTTP = new XMLHttpRequest();
    xmlHTTP.open('GET', url,true);
    xmlHTTP.responseType = 'arraybuffer';
    xmlHTTP.onload = function(e) {
        var h = xmlHTTP.getAllResponseHeaders(),
            m = h.match( /^Content-Type\:\s*(.*?)$/mi ),
            mimeType = m[ 1 ] || 'image/png';
        var blob = new Blob( [ this.response ], { type: mimeType } );
        _this.src = window.URL.createObjectURL( blob );
        if(onComplete !== undefined) onComplete(e);
    };
    xmlHTTP.onprogress = function(e) {
        if( !e.lengthComputable ) return;
        _this.loaded = e.loaded / e.total;
        if(onProgress !== undefined) onProgress( _this.loaded );
    };
    xmlHTTP.onloadstart = function() {
        _this.loaded  = 0;
    };
    xmlHTTP.onloadend = function() {
        _this.loaded  = 100;
    };
    xmlHTTP.send();
};

Image.prototype.loaded = 0;

/**
 * Audio loading
 * @param url - {string} - Requested URL
 * @param onComplete - {function} - Callback for completion handler, default undefined
 * @param onProgress - {function} - Callback for progress handler, default undefined
 */
Audio.prototype.load = function(url, onComplete, onProgress){
    var _this = this;
    var xmlHTTP = new XMLHttpRequest();
    xmlHTTP.open('GET', url,true);
    xmlHTTP.responseType = 'arraybuffer';
    xmlHTTP.onload = function(e) {
        var h = xmlHTTP.getAllResponseHeaders(),
            m = h.match( /^Content-Type\:\s*(.*?)$/mi ),
            mimeType = m[ 1 ] || 'audio/mpeg';
        var blob = new Blob( [ this.response ], { type: mimeType } );
        _this.src = window.URL.createObjectURL( blob );
        if(onComplete !== undefined) onComplete(e);
    };
    xmlHTTP.onprogress = function(e) {
        if( !e.lengthComputable ) return;
        _this.loaded = e.loaded / e.total;
        if(onProgress !== undefined) onProgress( _this.loaded );
    };
    xmlHTTP.onloadstart = function() {
        _this.loaded  = 0;
    };
    xmlHTTP.onloadend = function() {
        _this.loaded  = 100;
    };
    xmlHTTP.send();
};

Audio.prototype.loaded = 0;

/**
 * Asset loader
 */
Raven.Loader = {
    'images': {},
    'audio':    {},
    'percentage': 0,
    //
    'fileID': function(path) {
        var name = path.split("/");
        name = name[name.length-1];
        name = name.split(".");
        name.pop();
        name = name.join("");
        return name;
    },
    //
    'loadJSON': function(url, onComplete, onError) {
        var _error  = onError !== undefined ? onError : function() {};
        var request = new XMLHttpRequest();
        request.onreadystatechange = function() {
            if( request.readyState === request.DONE ) {
                if( request.status === 200 || request.status === 0 ) {
                    var json = JSON.parse( request.responseText );
                    if(onComplete !== undefined) onComplete( json );
                } else {
                    if( onError !== undefined ) onError();
                }
            }
        }
        request.open( 'GET', url, true );
        request.send( null );
    },
    //
    'loadXML': function(url, onComplete, onError) {
        var _error  = onError !== undefined ? onError : function() {};
        var request = new XMLHttpRequest();
        request.onreadystatechange = function() {
            if( request.readyState === request.DONE ) {
                if( request.status === 200 || request.status === 0 ) {
                    if(onComplete !== undefined) onComplete( request.responseText );
                } else {
                    if( onError !== undefined ) onError();
                }
            }
        }
        request.open( 'GET', url, true );
        request.send( null );
    },
    'loadAssets': function(json, onComplete, onProgress, onError) {
        var _this         = this;
        var totalImages   = json.images.length-1;
        var totalAudio    = json.audio.length-1;
        var totalAssets   = totalImages + totalAudio;
        var loadedImages  = 0;
        var loadedAudio   = 0;
        var loadingIMGs   = false;
        var loadingAudios = false;
        var weightIMGs    = totalImages / totalAssets;
        var weightAudios  = totalAudio / totalAssets;
        function loadProgress(per) {
            if(loadingIMGs) {
                _this.percentage = per * weightIMGs;
            } else if(loadingAudios) {
                _this.percentage = per * weightAudios + weightIMGs;
            }
            if(onProgress !== undefined) onProgress(_this.percentage);
        }
        function loadImages() {
            loadingIMGs = true;
            Raven.Loader.loadImages( json.images, imagesLoaded, loadProgress, imageLoaded );
        }
        function imageLoaded(total) { loadedImages = total; }
        function imagesLoaded() {
            loadedImages = totalImages;
            loadingIMGs  = false;
            loadAudio();
        }

        function loadAudio() {
            loadingAudios = true;
            Raven.Loader.loadAudios( json.audio, audiosLoaded, loadProgress, audioLoaded );
        }
        function audioLoaded(total) { loadedAudio = total; }
        function audiosLoaded() {
            loadedAudio   = totalAudio;
            loadingAudios = false;
            if(onComplete !== undefined) onComplete(json);
        }
        //
        loadImages();
    },
    //
    'loadImage': function(url, imgID, onProgress, onComplete, onError) {
        var img = new Image();
        if(onError    !== undefined) {
            img.onerror = function(evt) {
                onError(evt);
            };
        }
        img.load(url, function(evt) {
            Raven.Loader.images[imgID] = {
                'id':   imgID,
                'file': img,
                'url':  url
            };
            onComplete( img );
        }, function(progress) {
            if(onProgress !== undefined) onProgress(progress);
        } );
        return img;
    },
    'loadImages': function(images, imgsComplete, imgsProgress, imgComplete) {
        var index  = 0, total = images.length, iTotal = total-1;
        var loaded = 0;

        function _onComplete(img) {
            ++index;
            loaded = index / (total-1);
            if(imgComplete !== undefined) imgComplete(index);
            if(index < total) {
                loadNext();
            } else {
                loadComplete();
            }
        }

        function _onProgress(per) {
            if(imgsProgress !== undefined) {
                var item     = index / total;
                var delim    = 1 / total;
                var progress = per * delim + item;
                imgsProgress(progress);
            }
        }

        function _onError(evt) {
            console.log("Couldn't load image!", evt);
        }

        function loadNext() {
            if(index >= total) return;
            var name = Raven.Loader.fileID(images[index]);
            Raven.Loader.loadImage( images[index], name, function(progress) {
                _onProgress(progress);
            }, _onComplete, _onError );
        }

        function loadComplete() {
            console.log("Images all done! Time to move on.");
            if(imgsComplete !== undefined) imgsComplete();
        }

        if(total > 0) loadNext();
        else loadComplete();
    },
    'loadAudio': function(url, mediaID, onProgress, onComplete, onError) {
        var media = new Audio();
        if(onError    !== undefined) {
            media.onerror = function(evt) {
                onError(evt);
            };
        }
        media.load(url, function(evt) {
            Raven.Loader.audio[mediaID] = {
                'id':   mediaID,
                'file': media,
                'url':  url
            };
            onComplete( media );
        }, function(progress) {
            if(onProgress !== undefined) onProgress(progress);
        });
        return media;
    },
    'loadAudios': function(audio, audiosComplete, audioProgress, audioComplete) {
        var index  = 0, total = audio.length, iTotal = total-1;
        var loaded = 0;

        function _onComplete(img) {
            ++index;
            loaded = index / (total-1);
            if(audioComplete !== undefined) audioComplete(index);
            if(index < total) {
                loadNext();
            } else {
                loadComplete();
            }
        }

        function _onProgress(per) {
            if(audioProgress !== undefined) {
                var item     = index / total;
                var delim    = 1 / total;
                var progress = per * delim + item;
                audioProgress(progress);
            }
        }

        function _onError(evt) {
            console.log("Couldn't load audio!", evt);
        }

        function loadNext() {
            if(index >= total) return;
            var name = Raven.Loader.fileID(audio[index]);
            Raven.Loader.loadAudio( audio[index], name, function(progress) {
                _onProgress(progress);
            }, _onComplete, _onError );
        }

        function loadComplete() {
            console.log("Audio all done! Time to move on.");
            if(audiosComplete !== undefined) audiosComplete();
        }

        if(total > 0) loadNext();
        else loadComplete();
    }
};
