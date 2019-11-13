(() => {

    let start = document.getElementById("start");
    let input = document.getElementById("you-url");
    let button = document.getElementById("load-button");
    let main = document.getElementById("main");
    let videoHolder = document.getElementById("video");
    let shot = document.getElementById("shot");
    let captures = document.getElementById("captures");

    button.addEventListener('click', (e) => {
        e.preventDefault();
        if (input.value) {
            let urlParts = input.value.split('/');
            let vid = urlParts[urlParts.length - 1];
            new YoutubeVideo(vid, (video) => {
                if (video && video.source) {
                    let firstQuality = Object.keys(video.source)[0];
                    let srcUrl = video.source[firstQuality].original_url;
                    
                    let source = document.createElement('source');
                    source.setAttribute('src', srcUrl);

                    start.remove();

                    main.style.display = null;
                    videoHolder.appendChild(source);
                    videoHolder.play();
                } else {
                    alert("Не удается загрузить видео!");
                }
            });
        }
    });

    shot.addEventListener('click', (e) => {
        e.preventDefault();
        captures.appendChild(captureScreen(videoHolder));
    });

})();

function captureScreen(video) {
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');

    // Change the size here
    canvas.width = parseInt(video.offsetWidth);
    canvas.height =  parseInt(video.offsetHeight);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    return canvas;
}