const fs = require('fs');
let s = "ÃƒÂ°Ã…Â¸Ã¢â‚¬Â Ã‚Â¥ Apply Heat";

// try reversing one layer
try {
    let s1 = Buffer.from(s, 'latin1').toString('utf8');
    console.log("1 layer reverse:", s1);
    let s2 = Buffer.from(s1, 'latin1').toString('utf8');
    console.log("2 layer reverse:", s2);
    let s3 = Buffer.from(s2, 'latin1').toString('utf8');
    console.log("3 layer reverse:", s3);
} catch (e) {
    console.error(e);
}
