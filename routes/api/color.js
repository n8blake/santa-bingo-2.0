const { getAverageColor } = require('fast-average-color-node');
const router = require("express").Router();

// provided a url in a post request
// return a color based on the image url
// colors: 'red', 'orange', 'yellow', 'cyan', 'green', 'blue', 'purple', 'brown'

const COLORS = {
    red : '#F7525F',
    orange : '#EF8E25',
    yellow : '#F4C653',
    green : '#80C941',
    cyan : '#53CEF4',
    blue  : '#5385F4',
    purple : '#A54187',
    brown : '#998675'
}

// convert hex value to rgb
function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
}

// return a weighted color distance value
function colorDistanceRGB(r1, r2, g1, g2, b1, b2){
    return (((r2-r1)*0.3) ** 2 + ((g2-g1)*0.59) ** 2 + ((b2-b1)*0.11) ** 2);
}

router.post("/", (request, response) => {
    if(request.body.url){
        //console.log(request.body.url);
        getAverageColor(request.body.url).then(avgImgColor => {
            //console.log(color);
            let closestColor = 'red';
            let closestColorDistance = -1;
            for(color in COLORS){
                const c1 = hexToRgb(COLORS[color]);
                const c2 = avgImgColor.value;
                const d = colorDistanceRGB(c1.r, c2[0], c1.g, c2[1], c1.b, c2[2]);
                if(closestColorDistance == -1){
                    closestColorDistance = d;
                    closestColor = color;
                } else {
                    if(d < closestColorDistance){
                        closestColorDistance = d;
                        closestColor = color;
                    }
                }
            }
            response.json(closestColor);
        });
    } else {
        response.status(400).json("no url provided");
    }
});

module.exports = router;