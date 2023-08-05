function distance(positionA, positionB) {
    return Math.sqrt(
        Math.pow(positionA.x - positionB.x, 2) +
        Math.pow(positionA.y - positionB.y, 2)
    )
}

function getAngle(positionA, positionB) {
    let dy = positionA.y - positionB.y;
    let dx = positionA.x - positionB.x;
    let theta = Math.atan2(dy, dx); // range (-PI, PI]
    // theta *= 180 / Math.PI; // rads to degs, range (-180, 180]
    if (theta < 0) {
        theta = Math.PI * 2 + theta;
    } // range [0, 360)

    if (theta < Math.PI * 3 / 2) {
        return (theta + theta * 0.005) >= Math.PI * 3 / 2 ? theta : (theta + theta * 0.005);
    } else {
        return (theta - theta * 0.005) <= Math.PI * 3 / 2 ? theta : (theta - theta * 0.005);
    }
    // return theta;
}