class YoutubeVideo {

    constructor(video_id, callback) {
        return (async () => {
            const response = await fetch(`/utube?video_id=${video_id}`, {
                headers: { 'Content-Type' : 'text/plain'}
            });
            const video_info = await response.text();
            
            let video = this.decodeQueryString(video_info);
            if (video.status === 'fail') {
                return callback(video);
            }
            
            if (video.url_encoded_fmt_stream_map) 
                video.source = this.decodeStreamMap(video.url_encoded_fmt_stream_map);

            return callback(video);
        })();
    }

    decodeQueryString(queryString) {
        var key, keyValPair, keyValPairs, r, val, _i, _len;
        r = {};
        keyValPairs = queryString.split("&");
        for (_i = 0, _len = keyValPairs.length; _i < _len; _i++) {
            keyValPair = keyValPairs[_i];
            key = decodeURIComponent(keyValPair.split("=")[0]);
            val = decodeURIComponent(keyValPair.split("=")[1] || "");
            r[key] = val;
        }
        return r;
    }

    decodeStreamMap(url_encoded_fmt_stream_map) {
        var quality, sources, stream, type, urlEncodedStream, _i, _len, _ref;
        sources = {};
        _ref = url_encoded_fmt_stream_map.split(",");
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            urlEncodedStream = _ref[_i];
            stream = this.decodeQueryString(urlEncodedStream);
            type = stream.type.split(";")[0];
            quality = stream.quality.split(",")[0];
            stream.original_url = stream.url;
            stream.url = "" + stream.url + "&signature=" + stream.sig;
            sources["" + type + " " + quality] = stream;
        }
        return sources;
    }
}