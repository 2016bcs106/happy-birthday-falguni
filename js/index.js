function start() {
    const canvas = document.getElementById("theCanvas");
    const ctx = canvas.getContext("2d");
    ctx.canvas.width = window.innerWidth * 1.5;
    ctx.canvas.height = window.innerHeight * 1.5;
    ctx.fillStyle = 'rgba(255, 255, 255, 255)';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    ctx.canvas.style.width = (window.innerWidth) + 'px';
    ctx.canvas.style.height = (window.innerHeight) + 'px';

    const image = new Image();
    image.src = "./image/hdb2.png";

    const coordinates = [];

    image.onload = () => {
        const y = (ctx.canvas.height - image.height) / 2;
        const x = (ctx.canvas.width - image.width) / 2;
        ctx.drawImage(image, x, y);

        const imageData = ctx.getImageData(
            0, 0, ctx.canvas.width, ctx.canvas.height
        );

        // console.log(imageData);

        ctx.fillStyle = 'red';
        let lastX = 0, lastY = 0;
        const rectSize = 6;

        for (let i = 0; i < imageData.data.length; i += 4) {
            if (imageData.data[i] < 100) {
                let { x, y } = getCoordinates(i);

                if ((!lastX && !lastY) || (x - lastX >= rectSize || y - lastY >= rectSize)) {
                    lastX = x;
                    lastY = y;
                    coordinates.push({ x, y, visible: false, radius: rectSize / 2 - 2, color: 'red' });
                }
            }
        }

        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        console.log(coordinates.length);

        // ctx.putImageData(
        //     imageData,
        //     0, 0
        // );
    };

    // let font = new FontFaceObserver('kinkie', {
    //     weight: 400
    // });
    //
    // font.load().then(function () {
    //     const happyDimensions = fitTextOnCanvas("Happy", "kinkie", 0.35);
    //     const birthdayDimensions = fitTextOnCanvas("Birthday", "kinkie", 0.5);
    //     const nameDimensions = fitTextOnCanvas("Falguni", "kinkie", 0.4);
    //
    //     const topPadding = ctx.canvas.height - 3 *  happyDimensions.width / 2.5;
    //
    //     ctx.textBaseline = "top";
    //     ctx.font = happyDimensions.fontSize + "px kinkie";
    //     ctx.fillStyle = 'rgba(0, 0, 0, 255)';
    //     ctx.fillText("Happy", (ctx.canvas.width - happyDimensions.width) / 2, topPadding / 2);
    //     ctx.font = birthdayDimensions.fontSize + "px kinkie";
    //     ctx.fillText("Birthday", (ctx.canvas.width - birthdayDimensions.width) / 2, topPadding / 2 + happyDimensions.width / 2.5);
    //     ctx.font = nameDimensions.fontSize + "px kinkie";
    //     ctx.fillText("Falguni", (ctx.canvas.width - nameDimensions.width) / 2, topPadding / 2 + 2 * happyDimensions.width / 2.5);
    //
    //     console.log("happyDimensions", happyDimensions)
    //     console.log("birthdayDimensions", birthdayDimensions)
    //     console.log("nameDimensions", nameDimensions)
    //
    //     setTimeout(() => {
    //         const imageData = ctx.getImageData(
    //             (ctx.canvas.width - birthdayDimensions.width) / 2,
    //             topPadding / 2,
    //             (ctx.canvas.width - birthdayDimensions.width) / 2 + birthdayDimensions.width,
    //             topPadding / 2 + 3 * happyDimensions.width / 2.5
    //         );
    //
    //         console.log(imageData);
    //
    //         for (let i = 0; i < imageData.data.length; i += 4) {
    //
    //             if (imageData.data[i] === 0) {
    //                 // console.log(i, imageData.data[i]);
    //             }
    //         }
    //
    //         ctx.putImageData(
    //             imageData,
    //             (ctx.canvas.width - birthdayDimensions.width) / 2,
    //             topPadding / 2
    //         );
    //     }, 3000);
    //
    //     // ctx.font = '68px kinkie';
    //     // ctx.fillStyle = 'orangered';
    //     // ctx.fillText('Keyboard Cat', 0, 270);
    //
    // }, function () {
    //     console.log('Font is not available');
    // });

    function fitTextOnCanvas(text, fontFace, ratio) {

        // start with a large font size
        let fontSize = 2000;

        // lower the font size until the text fits the canvas
        do {
            fontSize--;
            ctx.font = fontSize + "px " + fontFace;
        } while (ctx.measureText(text).width > ctx.canvas.width * ratio)

        return {
            width: ctx.measureText(text).width,
            height: ctx.measureText(text).height,
            fontSize: fontSize
        }

    }

    function getCoordinates(index) {
        let x = (index / 4) % ctx.canvas.width;
        let y = Math.floor((index / 4) / ctx.canvas.width);
        return { x, y };
    }

    // return;

    const activeFireworks = [];
    const blownFireworks = [];

    activeFireworks.push(
        new Firework(ctx, ctx.canvas.width, ctx.canvas.height, {
            x: Math.floor(Math.random() * (ctx.canvas.width - 200)) + 100,
            y: Math.floor(Math.random() * (ctx.canvas.height - 200)) + 100
        })
    );

    requestAnimationFrame(() => loop(ctx));

    let pendingTimeout = false;

    function loop(ctx) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);


        activeFireworks.forEach((firework, index) => {
            firework.draw(coordinates);
        });

        blownFireworks.forEach((firework, index) => {
            firework.draw(coordinates);
        });

        for (let coordinate of coordinates) {
            if (coordinate.visible) {
                ctx.beginPath();
                ctx.fillStyle = coordinate.color;
                ctx.arc(coordinate.x, coordinate.y, coordinate.radius, 0, 2 * Math.PI, false);
                ctx.fill();
                ctx.closePath();
            }
        }


        if (activeFireworks.length > 0 && activeFireworks[0].isBlown && !pendingTimeout) {
            pendingTimeout = true;
            blownFireworks.push(activeFireworks.shift());
            setTimeout(() => {
                pendingTimeout = false;
                activeFireworks.push(
                    new Firework(ctx, ctx.canvas.width, ctx.canvas.height, {
                        x: Math.floor(Math.random() * (ctx.canvas.width - 200)) + 100,
                        y: Math.floor(Math.random() * (ctx.canvas.height / 2))
                    })
                )
            }, 500);
        }

        while (blownFireworks.length > 0 && blownFireworks[0].isDead) {
            blownFireworks.shift();
        }

        requestAnimationFrame(() => loop(ctx));
    }
}

window.onload = start;