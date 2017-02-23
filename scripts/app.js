;(function(undefined) {
    'use strict';

    const result = document.getElementById('result');
    const file = document.getElementById('file');
    const canvas = document.createElement('canvas');
    // const canvas = document.querySelector('canvas');
    const ctx = canvas.getContext('2d');

    file.addEventListener('change', onChange);

    function onChange() {
        result.innerHtml = '';
        console.log(this.files[0]);
        const objUrl = window.URL.createObjectURL(this.files[0]);
        console.log(objUrl);
        // console.log(window.URL.revokeObjectURL(objUrl));
        // const reader = new FileReader()
        getImage(objUrl)
            .then(img => {
                canvas.width = img.height;
                canvas.height = img.height;
                for(let i = 1, x = 0, squares = Math.floor(img.width / img.height); i <= squares; i++) {
                    console.log(x);
                    ctx.clearRect(0, 0, img.height, img.height);
                    ctx.drawImage(img, x, 0);
                    let frame = document.createElement('img');
                    frame.src = canvas.toDataURL('image/jpeg');
                    result.appendChild(frame);
                    x -= img.height;
                }
            });
    }



    function getImage(src) {
        return new Promise(function(resolve) {
            const img = new Image();
            img.onload = function() {
                // console.log(this, this.width, this.height);
                resolve(this);
            }
            img.src = src;
        });
    }



})();
