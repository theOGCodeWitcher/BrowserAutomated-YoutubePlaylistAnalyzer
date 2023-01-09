const pupeeteer = require('puppeteer');
const PDFGenerator = require('pdfkit');
const fs = require('fs');
const path = require('path');

let tabInUse;

const youtubelinkInUse = 'https://youtube.com/playlist?list=PLVWqRc88TLrDAz46tiKkkmKYnTIOG1xMW';
(async function () {
    try {
        const browserOpen = pupeeteer.launch({
            headless: false,
            defaultViewport: null,
            args: ['--start-maximized']
        })
        const browserInit = await browserOpen;
        const allTabsArray = await browserInit.pages() //returns an array of all the tabs open in chromium browser 
        tabInUse = allTabsArray[0];
        await tabInUse.goto(youtubelinkInUse);
        await tabInUse.waitForSelector('.style-scope.yt-dynamic-sizing-formatted-string.yt-sans-28')
        const title = await tabInUse.evaluate(() => { return document.querySelector('.style-scope.yt-dynamic-sizing-formatted-string.yt-sans-28').textContent }) //runs a function in the currentPage(calling obj context)
        const playListInfo = await tabInUse.evaluate(getPlaylistInfo, '.byline-item.style-scope.ytd-playlist-byline-renderer')
        console.log(title, playListInfo.views, playListInfo.totalVideos);
        const splitArr = playListInfo.totalVideos.split(' ');
        const totalnumberOfVideos = splitArr[0];
        console.log(totalnumberOfVideos);
        let numberOfVideosOn1Page = await calcNoOfVidOn1PageFn();
        console.log(numberOfVideosOn1Page);
       
        while (totalnumberOfVideos - numberOfVideosOn1Page >=30) {
              await scrollToBottom();
            numberOfVideosOn1Page =  await calcNoOfVidOn1PageFn();
        }

        const videoInfoArr = await getInfoOfVideos();
        // console.log(videoInfoArr);

         createPDF(title,videoInfoArr );

        
    } catch (error) {

    }
})();






function getPlaylistInfo(elementSelector) {

    const elem = document.querySelectorAll(elementSelector);
    const totalVideos = elem[0].textContent;
    const views = elem[1].textContent;

    return {
        views,
        totalVideos
    };
}

async function calcNoOfVidOn1PageFn() {
    const noOfVidOn1Page = await tabInUse.evaluate(calcNoOfVidOn1Page, '#byline-container');
    function calcNoOfVidOn1Page(selector) {
        const array = document.querySelectorAll(selector);
        const number = array.length;
        return number;
    }
    return noOfVidOn1Page;
}

async function scrollToBottom() {
    await tabInUse.evaluate(scrollDown)
    function scrollDown() {
        window.scrollBy(0, window.innerHeight)
        console.log(window.innerHeight);
    }
}
async function getInfoOfVideos(){
        const list  =await tabInUse.evaluate(getVideoElems , 'div[id="meta" ] a[ id="video-title"]' ,'span[id="text"]');
        return list;
}

 function getVideoElems(nameSelector , durationSelector){
    const namesArr = document.querySelectorAll(nameSelector);
    const durationArr = document.querySelectorAll(durationSelector);

    let infoArray =[];
    for (let i = 0; i < namesArr.length; i++) {
        const name = namesArr[i].innerText;
        const duration = durationArr[i].innerText;
        infoArray.push({name, duration})
        
    }

    return infoArray;
}


 function createPDF(fileName ,issueArray) {
    // console.log("pdf generated");
    let theOutput = new PDFGenerator ;
    const pdfName =  fileName + '.pdf';
    const pdfPath = path.join(__dirname,pdfName)
    // console.log(pdfPath);
    theOutput.pipe(fs.createWriteStream(pdfPath));
    
    for(let i =0 ; i < issueArray.length ; i++){
       const nameString = String(issueArray[i].name)
       const durationString = String(issueArray[i].duration)
        theOutput.text(` Title : "${nameString}" , Duration : "${durationString}" \n \n`);
    }
    theOutput.end()
}
