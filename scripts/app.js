;(function(Promise, undefined) {
    'use strict';

    const file = document.getElementById('file');
    const resultTmbs = document.querySelector('.result-tmbs');
    const resultFull = document.querySelector('.result-full');

    /**
     * Загружаем картинку
     * @param  {String} src
     * @return {Promise}
     */
    function getImage(src) {
        return new Promise(function(resolve) {
            const img = new Image();
            img.onload = function() {
                resolve(this);
            }
            img.src = src;
        });
    }

    /**
     * Разбиваем картинку на квадраты
     * @param  {Number} w Ширина картинки
     * @param  {Number} h Высота картинки
     * @return {fullParts, partSide, partTop}
     */
    function getFullParts(w, h) {
        let remainder = w % h; // Полностью ли вписываются части
        let fullParts = Math.floor(w / h); // Сколько полных частей
        let partSide = h; // Сторона квадрата
        let partTop = 0; // Отступ сверху

        // Не разбивается полностью
        if(remainder) {
            fullParts++;
            partSide = Math.floor(w / fullParts); // Новый размер квадрата
            partTop = (h - partSide) / 2; // Новый отступ сверху
        }

        return {
            fullParts,
            partSide,
            partTop,
        };
    }

    function squareCropper(img, side, top) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        let x = 0;

        canvas.width = side;
        canvas.height = side;

        return function() {
            console.log(x);
            ctx.clearRect(0, 0, side, side);
            ctx.drawImage(img, x, top, side, side, 0, 0, side, side);
            x += side;
            return canvas.toDataURL('image/jpeg');
        };
    }

    function processingCrop(img) {
        let {fullParts, partSide, partTop} = getFullParts(img.width, img.height);

        const tmbSide = Math.floor((resultTmbs.offsetWidth - 2 * (fullParts - 1)) / fullParts);
        const cropper = squareCropper(img, partSide, partTop);

        for(let i = 0; i < fullParts; i++) {
            let tmb = document.createElement('img');
            tmb.src = cropper();
            let fullSize = tmb.cloneNode();

            tmb.className = 'result-tmbs__img';
            tmb.style.width = `${tmbSide}px`;
            resultTmbs.appendChild(tmb);

            fullSize.className = 'result-full__img';
            // resultFull.appendChild(fullSize);
            if(i) {
                resultFull.insertBefore(fullSize, resultFull.childNodes[0]);
            }
            else {
                resultFull.appendChild(fullSize);
            }
        }
    }

    function onChange() {
        const file = this.files[0];

        removeNodes(resultTmbs);
        removeNodes(resultFull);
        pleaseWaitVisibility.show();
        resultVisibility.hide();
        uploadVisibility.hide();
        introVisibility.hide();
        getImage(window.URL.createObjectURL(file))
            .then(processingCrop)
            .then(() => window.URL.revokeObjectURL(file))
            .then(pleaseWaitVisibility.hide)
            .then(resultVisibility.show)
            .then(uploadVisibility.show);
    }

    function removeNodes(el) {
        while(el.firstChild) {
            el.removeChild(el.firstChild);
        }
    }

    function visibility(el) {
        /*function transitionendHandler(e) {
            const el = e.target;
            el.removeEventListener('transitionend', transitionendHandler);
            el.style.display = 'none';
        }*/

        return {
            show() {
                el.style.display = '';
                // el.style.opacity = 1;
            },
            hide() {
                el.style.display = 'none';
                // el.addEventListener('transitionend', transitionendHandler);
                // el.style.opacity = 0;
            }
        };
    }

    var spinner = new Spinner({
        color: '#fff',
        corners: 1,
        lines: 8,
    }).spin(document.querySelector('.please-wait'));

    const uploadVisibility = visibility(document.querySelector('.upload'))
    const resultVisibility = visibility(document.querySelector('.result-screen'))
    const pleaseWaitVisibility = visibility(document.querySelector('.please-wait'))
    const introVisibility = visibility(document.querySelector('.start-screen__intro'))

    file.addEventListener('change', onChange);


    /*getImage(document.getElementById('source').src)
        .then(processingCrop);*/

})(Promise);
