
function getURL() {
    var imageURLS = [
        "../img/escalatorF2.JPG"
    ];
    var randomIndex = Math.floor(Math.random() * imageURLs.length + 1);
    document.getElementById("random").style.background=imageURLS[randomIndex];
}