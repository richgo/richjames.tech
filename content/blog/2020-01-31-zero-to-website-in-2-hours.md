---
templateKey: blog-post
title: Zero to website in 2 hours
date: 2020-01-31T21:02:04.318Z
description: >-
  Building a personal blogsite with Gatsby and Netlify(+CMS) is crazily simple -
  here's how to do it.
featuredpost: true
featuredimage: /img/gatsby.jpg
tags:
  - React
  - Gatsby
  - JAMstack
  - Web
---
## Scenario

You decide to register a domain in your own name to create a blog, which is an odd feeling, and perhaps on the wrong end of the narcissism spectrum.  But what do you do next? Wordpress would be the go-to of old, but it is not even remotely exciting tech to tinker with.

I would like to say I agonised over which tech stack I would build this blog with, but I didn't.  It was a straight forward choice - JAMstack is where it's at, and the king is:  

### Gatsby, and it's great

![Gatsby](/img/gatsby.jpg "Gatsby")

Quite fitting that the twenties have come round again, and are roaring fast with static generated websites with five (plus) nines of uptime and near un-DDoS-able resilience.

Time to start building.

### Pre-requisites

* Your domain registered
* Template chosen.  Try <https://www.gatsbyjs.org/starters> or <https://templates.netlify.com/tags/gatsby/>, then fork the repo on GitHub.

**... GO!!!**

### **Hosting**

So, this is the easy bit

1. Sign up for a free account over at Netflify ([https://www.netlify.com](<https://www.netlify.com>)). 
2. Click "Create new site from GitHub" and hook it up to your freshly forked template.
3. Configure your domain name servers where you created your domain by pointing them to:

   * dns1.p03.nsone.net
   * dns2.p03.nsone.net
   * dns3.p03.nsone.net
   * dns4.p03.nsone.net
4. Register your domain on Netlify's domain settings by clicking "Domains->Add or Register Domain" and following the instructions
5. Wire up email forwarding with improvmx (<https://improvmx.com/>) so you can receive email from whatever@yourdomain.something.  You can also configure sending from hotmail/gmail in the settings of the afore mentioned email providers. You'll need to set the MX records like so:

![mx records](/img/Screenshot 2020-01-31 at 21.51.54.png "Email config for improvmx")



You may or may not have noticed, but Netlify built you a website from your forked repo without you doing a thing!  It will watch your repo forever more, and build+deploy with each commit. Your starter/template should now live on your domain and be happily forwarding emails in which ever way you configured them.

### Build your website

Time to clone your new GitHub repo locally and crack on with content and styling.  

#### Content

Either start writing Markdown in your your repo by editing one of the existing blog templates or, if like me, you have Medium posts you wish to re-post, try this:

<https://hackernoon.com/medium-2-md-convert-medium-posts-to-markdown-with-front-matter-c044e02c3cbb>

medium-2-md is the key component here (a node app).  It will take your exported html articles and give you gatsby compatible markdown.  you can copy this straight in to your blogname.md files.

#### Styling

You can go as mad as you like here.  Most templates are well structured and easy to modify using SASS.  Fill your creative boots!

#### Running locally

First up, you need the tools.  NPM install both the Gatsby CLI and the Netlify CLI via 

`npm install gatsby-cli -g`

`npm install netlify-cli -g`

To build it's:

`npm run build`

to run a local server it's:

`ntl dev`

There's a tonne more you can do. Further reading here:

<https://www.npmjs.com/package/gatsby-cli>

<https://www.npmjs.com/package/netlify-cli>

### Push it

Literally commit your changes and watch as Netlify does the work for you.  Voila, new website.
