# Mobile Web Specialist Certification Course

#### _Three Stage Course Material Project - Restaurant Reviews_

## Completed Stage 2

This stage is an incremental update of **Stage One** (check [stage-one branch](https://github.com/fabritsius/restaurant-reviews-app/tree/stage-one) of this repository to learn more).

At first I thought this stage is very easy and there isn't mush stuff to do. The reason behind is I forgot about IndexedDB implementation at all. I used cache for everything. Thankfully I realized my mistake before submitting.

I successfully added IndexedDB to this app with tiny [idb library](https://github.com/jakearchibald/idb). The most interesting part is that [version without IDB](https://github.com/fabritsius/restaurant-reviews-app/tree/stage-two-no-idb) has higher performance in Lighthouse test. Of course, my implementation may be the reason behind.

### Lighthouse scores

Home Page:
- Performance: 86
- Progressive Web App: 91
- Accessibility: 94
- Best Practices: 94
- SEO: 78

Restaurant Page:
- Performance: 83
- Progressive Web App: 91
- Accessibility: 89 (low)
- Best Practices: 94
- SEO: 78

### What it can do on my machine:

- Successfully fetches data from the server, when there is one running;
- Looks great with every screen size and ratio, brave disign choices were made;
- It Works Offline! Well... Kind of. Only pages that were visited, which is still great for a website though;
- Images are responsive and are supposed to be responsive everywhere;
- Can be TAB-ed with ease. Sometimes not in order (I moved some parts to the end);
- I checked usability with ChromeVox and it seems to me it is reasonable, although I prefer the other way;
- You can use a Map for multiple purposes.

### Usage

There is no reason to use it apart from Maps (there is no backend currently), but just in case:

1. Clone [stage-two-server branch](https://github.com/fabritsius/restaurant-reviews-app/tree/stage-two-server) of this repository;
2. Use README.md from it to find out what preparations are nesessary to launch the server;
3. Enter `node server` and check if it worked (port: `1337`);
4. Copy my code via Git or manually;
5. Open copied directory in your terminal;
6. Enter `npm install` to load necessary modules;
6. Use `node start` or `python3 -m http.server 8000` to launch another server (you will need python);
7. Go to [localhost:8000](http://localhost:8000) to see the masterpeace.

Thanks for your attension!