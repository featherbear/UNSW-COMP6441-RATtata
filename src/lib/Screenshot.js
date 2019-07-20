const screenshot = require('screenshot-node');
const tmp = require('tmp');
const fs = require('fs');

var tmpobj = tmp.fileSync();

module.exports.screenshot = function(callback) {
    return new Promise((resolve, reject) => {
        let filePath = tmp.tmpNameSync();
        screenshot.saveScreenshot(0, 0, 0, 0, filePath, (err) => {
            if (err) {
                try {
                    fs.unlinkSync(filePath)
                } finally {
                    reject(err);
                }
            }
        })    

        let data = fs.readFileSync(filePath);
        fs.unlinkSync(filePath)
        resolve(data);
    })
}