---
templateKey: 'blog-post'
title: 'Sitecore JSS @ Scale | The transition to headless'
date: 2019-06-22T15:04:10.000Z
featuredpost: true
featuredimage: /img/headless.png
description: How we started our journey towards Sitecore JSS and React
tags:
  - Sitecore
  - JSS
  - Digital Transformation
---
![headless](/img/headless.png)
# Sitecore JSS @ Scale

The transition to headless

Whilst digital transformation journeys are always challenging, with the right mix of people, technology and some lucky timing they can also be a lot of fun. In late 2018, Nationwide Building Society set about transforming our web estate using Sitecore JSS. We’ve learned a lot on the way, not only about technology, but also team transformation. This is our story so far.

### Summer 2018

When I arrived at Nationwide I quickly learned that there was a huge transformation underway — £4.1Bn in spending… on tech! ([press release here](https://www.nationwide.co.uk/about/media-centre-and-specialist-areas/media-centre/press-releases/archive/2018/9/14-technology-investment)). That is an epic scale of investment that is both exciting and daunting. We had an agile initiative that broadly followed the SAFe framework, piloting modern ways of working and building software which was to become the new norm.

Coincidentally, we had just been through a discovery phase to work out what to do with our nationwide.co.uk website. It had organically grown to thousands of pages and was in need of rationalisation and modernisation.

If we were going to rebuild our website, we would have to work out how to align to the new technology stacks and practices. We had some significant challenges ahead. The following image shows just how far apart from modern software building we were:

![](https://cdn-images-1.medium.com/max/800/1*-XU_0xZFqNVrl7_zFpNV5g.png)

As you can see, we had a very long way to go. Years of stagnation in both tech, practice and siloed working had us building interfaces with WebForms — technology from 2002 — in 2018. This was nobody's fault per se, just an unfortunate timing issue that I have seen many Sitecore solutions fall victim to over the years:

1.  MVC was too immature at the time of building, and/or
2.  Technologists were unable to articulate the business value of switching to MVC.

The latter has a major knock on which essentially means you fall into the 5 year full-rebuild cycle as upgrades become more and more costly. The result is spikes in spending and risk, which are never welcome. We fell victim to both of the above.

Factor in that MVC is now, in the world of tech, getting long in the tooth. If we adopted it now, we would surely perpetuate that cycle.

We faced a significant challenge: how do we work with an Enterprise CMS, a modern containerised micro-service architecture & modern JavaScript frameworks, whilst not falling into the expensive upgrade/rebuild cycle loop?

On top of that, as the resident CMS experts, we were challenged with how could we serve editable content to dozens of separate applications (web & mobile) that are being created by other teams.

### Enter Sitecore JSS

Sitecore 9.1 saw the release of JSS, an SDK for modern JavaScript frameworks (Angular/React/Vue). This is a serious attempt by Sitecore to modernise Enterprise CMS development. Pretty much every CMS offers content by APIs, but Sitecore JSS brings Enterprise features like a full page editing experience and real-time personalisation to the headless CMS market. This is achieved by decoupling the delivery and presentation of content, which fundamentally changes both the architecture and development workflow.

Lets look at architecture first. Whilst the Sitecore Helix architecture prescribes a componetised framework for feature driven development, it is very much a monolithic, large solution software architecture. Whilst you can build in the same guise with JSS, you can also completely decouple your client side application code from the CMS backend. By decoupling, you gain the ability to deploy your front end application independently — **gone are the days where a CSS tweak requires a full deployment of backend code to multiple virtual machines**. This fits well with a microservice architecture, essentially adding another component-the CMS APIs.

_I will follow up with a posts dedicated to DevOps and Architecture respectively._

### Developer workflow

There are some interesting changes to the way you develop with JSS. Given that much of the traditional development with Sitecore is building components for the web, it is only natural that there is a shift away from C# and towards client side JavaScript.

![there’s a switch in the roughly 80/20 divide between C# & JS](https://cdn-images-1.medium.com/max/800/1*BVN5SZQl_N6bx9LClwsqRA.png)
there’s a switch in the roughly 80/20 divide between C# & JS

That doesn’t mean to say that your C# skills are no longer of use, they can be put to good use building out that microservice backend and working on the helix solution you will still need.

With JSS there’s two prescribed workflows you can follow:

1.  Code first
2.  Sitecore first

Code first essentially means front end developers can build applications completely stand alone which are then imported into Sitecore with a manifest file. This is how we’re working, though there are some challenges to this approach which we’ve had to overcome — specifically re-importing an app many times so as to keep the front end code in the front end.

Sitecore first is similar to MVC development, only you use the Json rendering template instead of View renderings. This causes the new layout service to emit JSON.

_more on workflow in another post when we delve into JSS in more depth._

If you want to learn more about JSS see here: [https://www.sitecore.com/en-gb/products/sitecore-experience-platform/wcm/headless-cms/developers](https://www.sitecore.com/en-gb/products/sitecore-experience-platform/wcm/headless-cms/developers) or for the developer documentation, see here: [https://jss.sitecore.com/](https://jss.sitecore.com/)

### The Team

There’s a very large elephant in the room: that shift to client side JavaScript means you need different shaped developers from the usual Sitecore + C# full stacker. In fact, you need developers that are both Sitecore + Angular or React or Vue specialists. This is a shape of person that you may struggle to find, as was the case at Nationwide. We quickly realised there was only one option: to grow this skillset from the existing team.

I would recommend tackling this from every conceivable angle in order to increase your chances of success. This is how we are doing it:

1.  React JS boot camp for all C# web developers (ours was run by reactjs.academy)
2.  Online courses like pluralsight
3.  Hiring specialist front-enders to coach/mentor & to cross train with Sitecore JSS
4.  Make lots of space in delivery schedules for PoCs/experimentation — it takes time

We’re still close to the beginning of our journey with JSS and looking forward to new additions to the SDK that will be arriving with 9.2 in the coming weeks.

More to come as our journey progresses.

@[richgojames](https://twitter.com/RichgoJames)

By [Rich James](https://medium.com/@richg0) on [June 22, 2019](https://medium.com/p/f9ab524d27c2).

[Canonical link](https://medium.com/@richg0/sitecore-jss-scale-f9ab524d27c2)

Exported from [Medium](https://medium.com) on January 28, 2020.