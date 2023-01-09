Youtube Playlist Analyzer

(MODULES used --> puppeteer , pdfkit , fs , path)

This Project enables any user to provide a link to any playlist present on Youtube(of any length) and creates a corresponding PDf file containing the information of each and every video posted in the playlist along with its duration.


I have achieved the above listed functionality by using puppeteer module for browser Automation. 
    When the project is run it automatically opens up  Google's chromium browser.
    Log's on to the provided URL.
    Scrapes the website to retrieve information such as Title of the playList, Total Number of views on the playlist and the total number of videos upload in the playlist.
    Then it goes onto  scrolls down(Through browser Automation) till we reach the end of the  playlist and scrapes the data such as title of individual video and duration of the video for each and every video.
    Then a PDf is generated using 'PDFkit' module. Generated PDF containes all the data scraped and saved in the source folder.

    The project also depicts correct usage of Javascripts Async await functionality rather than using callbacks or promises which has resulted in a much cleaner code.