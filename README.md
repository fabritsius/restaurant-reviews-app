# Mobile Web Specialist Certification Course

#### _Three Stage Course Material Project - Restaurant Reviews_

This Udacity Nanodegree was sponsored by Google. After 3 months of selection process I was chosen to continue education for another 6 months. For more [information about the Nanodegree Program](https://www.udacity.com/course/mobile-web-specialist-nanodegree--nd024) head out to Udacity page.

## Course Completed

I successfully graduated and you can [see the certificate](https://graduation.udacity.com/confirm/K46CGJGE) hosted by Udacity. During the course we were tasked to convert horrible unresponsive website to a professional offline-ready one. I am planning to improve this project further. If you want to see this repo the way it was right after my graduation you can visit [stage-three branch](https://github.com/fabritsius/restaurant-reviews-app/tree/stage-three).

### Lighthouse scores 

Both Pages:
- Performance: 90 (91)
- Progressive Web App: 91
- Accessibility: 94
- Best Practices: 94
- SEO: 78

### What it can do on my machine:

- Successfully fetches data from the server, when there is one running;
- Looks great with every screen size and ratio, brave design choices were made;
- It Works Offline! Well... Kind of. Only pages that were visited, which is still great for a website though;
- You can mark a restaurant as favorite (works offline);
- You can submit a review for a restaurant (works offline);
- Images are responsive and are supposed to be responsive everywhere;
- Can be TAB-ed with ease. Sometimes not in order (I moved some parts to the end);
- I checked usability with ChromeVox and it seems to me it is reasonable, although I prefer the other way;
- You can use a Map for multiple purposes.

### Usage

There is no reason to use it apart from Maps (there is no backend currently), but just in case:

1. Clone [stage-two-server branch](https://github.com/fabritsius/restaurant-reviews-app/tree/stage-three-server) of this repository;
2. Use README.md from it to find out what preparations are necessary to launch the server;
3. Enter `node server` and check if it worked (port: `1337`);
4. Copy my code via Git or manually;
5. Open copied directory in your terminal;
6. Enter `npm install` to load necessary modules;
6. Use `node start` or `python3 -m http.server 8000` to launch another server (you will need python);
7. Go to [localhost:8000](http://localhost:8000) to see the masterpiece.

### Future plans

Although I passed all stages and got a certificate, this project isn't truly finished. There are still a few things that can be added. A good example is a lack of any user feedback (right now I print lines to the console which is normally hidden). I would like to change that. Another thing that has to be changed is the fact that this website project isn't hosted anywhere.

#### TODO

- [x] Finish the course and get a certificate
- [ ] Change color palette to the one currently used in the icon
- [ ] Add user feedback (like when request failed or connection restored)
- [ ] Write a Go server for this project (also host it somewhere)
- [ ] Use GitHub Pages to host this project 

Thanks for your attention!
