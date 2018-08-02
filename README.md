# Mobile Web Specialist Certification Course

#### _Three Stage Course Material Project - Restaurant Reviews_

## Completed Stage 3

This stage is an incremental update of **Stage Two** (check [stage-two branch](https://github.com/fabritsius/restaurant-reviews-app/tree/stage-two) of this repository to learn more).

During this stage couple things were added. Now user can mark favorite restaurants, write his or her own reviews. All new functionality works offline. Also, website's performance was slightly increased (by 5 Lighthouse points).

### Lighthouse scores 

Both Pages:
- Performance: 90 (91)
- Progressive Web App: 91
- Accessibility: 94
- Best Practices: 94
- SEO: 78

### What it can do on my machine:

- Successfully fetches data from the server, when there is one running;
- Looks great with every screen size and ratio, brave disign choices were made;
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
2. Use README.md from it to find out what preparations are nesessary to launch the server;
3. Enter `node server` and check if it worked (port: `1337`);
4. Copy my code via Git or manually;
5. Open copied directory in your terminal;
6. Enter `npm install` to load necessary modules;
6. Use `node start` or `python3 -m http.server 8000` to launch another server (you will need python);
7. Go to [localhost:8000](http://localhost:8000) to see the masterpeace.

Thanks for your attension!
