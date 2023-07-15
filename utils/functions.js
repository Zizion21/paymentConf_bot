const date = new Date();
const path = require('path');
const fs = require('fs');
const year = ""+ date.getFullYear();
const month = String(date.getMonth() + 1);
const day = String(date.getDate());

function getTime(){
    const hour = String(date.getHours()).padStart(2, '0')
    const min = String(date.getMinutes()).padStart(2, '0')
    const sec = String(date.getSeconds()).padStart(2, '0')
    const currentTime = `${hour}:${min}:${sec}`
    return currentTime;
}
function photoNameGenerator(){
    const photoName = `${year}-${month}-${day}.jpg`
    return photoName
}

function createUploadPath(){
    const uploadPath = path.join(__dirname, '..', 'public', year, month, day);
    fs.mkdirSync(uploadPath, {recursive: true});
    return path.join('public', year, month, day)
}

module.exports = {
    getTime,
    createUploadPath,
    photoNameGenerator,
}