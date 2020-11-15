---
templateKey: blog-post
title: Enterprise Jamstack
date: 2020-11-15T15:00:39.812Z
description: >-
  Smashing together the best of enterprise, open source and cloud to deliver
  blistering fast, resilient experiences.
featuredpost: true
featuredimage: /img/enterprisejamstack.jpeg
tags:
  - React NextJs Sitecore Uniform Jamstack Enterprise
---
At Nationwide we've created an awesome Enterprise Jamstack platform. Before I go in to how we've built it and what it looks like lets break down what I mean by those two words "Enterprise" and"Jamstack".

## Enterprise

Which in this case means "Enterprise CMS". We're talking about Content Management Systems and DXPs. I didn't get enterprise CMS systems for a long time. I couldn’t see the value: they're big, complex and costly. To top it off they need constant upgrades, niche skills and still have a preference for delivering server rendered pages which scale compute horizontally. Remarkably this is still the case in 2020.

![A diagram of the enterprise CMS](/img/enterprisecms.jpeg "The Enterprise CMS")

<!--StartFragment-->

So why would anyone pay for a system that can costs (potentially) millions when it clearly delivers content via a suboptimal mechanism? The answer is simple: they provide features like drag drop page creation, controls on publishing and as many editor customisations as you can afford. To phrase that differently: business agility. The engineers pain is the marketers gain.

The major players can be found on the top right of the Gartner magic quadrant under the DXP category: Adobe and Sitecore.

In recent years there has been some great progress with JavaScript framework support for larger CMS platforms. Sitecore's JSS SDK specifically is capable of serving rendered web pages which then become app-like by requesting only data after the initial load. This is called isomorphic. It's a hybrid best of both approach that works very well.

## Jamstack

Open source software has steadily matured over the last 10 years. Today open source technology underpins the majority of the digital services we use. In the modern world of the web, organisations like Netlify have created their own GitOps CMS systems that automatically build and deploy a developers code commit to a static hosted website in minutes. These are Jamstack sites. That's:

![Javascript, APIs and Markdown](/img/jamstackbreakdown.jpg "Javascript, APIs and Markdown")

The official Jamstack definition is:

"Jamstack is an architecture designed to make the web faster, more secure, and easier to scale. It builds on many of the tools and workflows which developers love, and which bring maximum productivity.

The core principles of pre-rendering, and decoupling, enable sites and applications to be delivered with greater confidence and resilience than ever before."

I would highly recommend reading the Jamstack website here for more detail: <https://jamstack.org/>

A sign of the maturity of Jamstack platforms is the excellent Jamstack Conf conference that runs biannually. The big players in this space are Netlify, Hugo, Gatsby, NextJs.

![The Jamstack site generation workflow](/img/jamstack.jpeg "The Jamstack site generation workflow")

## Two approaches, juxtaposed

There's a fundamental and competing difference between these two worlds:

* Enterprise CMS platforms place marketer features and experience first
* Jamstackis squarely aimed at developer experience and performance

There's a battle going on between the established enterprise marketing platforms and the world of open source Jamstack. The latterpromises to provide a better developer and user experience at the expense of the marketeers toolkit but at a fraction of the price (sometimes free).

It's easy to think that these two approaches are incompatible, but that's not the case.

## Nationwide's Enterprise Jamstack

As a large financial organisation following Enterprise Architecture principals we naturally started with an enterprise CMS approach, using Sitecore, who we have a long history with. We wanted to modernise our development approach though by making use of our in house React design system.

Nationwide began our journey with a decoupled CMS back in 2018, in line with the release of Sitecore's JSS SDK. During development one thing stood out: there was increased complexity because of the mixture of technologies. Sitecore's preferred deployment is Azure App Service but Nationwide's microservices all run in Kubernetes, on Linux. This created a natural solution boundary for us: Sitecore, run as a service, is built and deployed separately from the front end React application and associated business microservices. So more pipelines, more automation and more complexity.

Taking a new architecture into production is always going to be a bit nerve wracking. Moving to a DevOps model (Site Reliability Engineering) where you are also responsible for running that system makes it even more so.

The operational beauty of Jamstack is twofold:

* Shift left
* Hyper resilience

Shifting left in Jamstack terms means catching 500 server errors at generation time - whilst you export your static website. This means you can catch those errors earlier so your users should never see them.

Hyper resilience comes from the ability to distribute your static assets to multiple cloud storage accounts in multiple regions and even across multiple cloud service providers. The use of a global CDN then makes sure your assets are efficiently compressed and delivered to your users from the closest possible location. Its beautifully simple and can easily return upwards of five nines of availability.

**There's no compute.**

With modern websites comprising more functionality delivered by 3rd party Javascript libraries, the need to have compute server side is significantly reduced. Without compute you have significant air cover.What are the chances of cloud storage failures across multiple regions and clouds? Slim to none. Your blast radius is drastically reduced. This means your on call engineers can fix any broken compute issues in the morning as your users will likely not be impacted.Disaster Recovery (DR) is built in.

The other aspect of hyper resilience is protection from Distributed Denial of Service (DDoS) attacks. DDoS attacks generally attempt to overwhelm a website with huge numbers of requests. Now that you're backed by a global CDN with cheap and replicable storage you can add a rudimentary layer of DDoS protection. By simply specifying enough storage IOPS the sheer number of requests per second required to overwhelm your system becomes an unassailable numbers game. To be clear, this mechanism is not a replacement for proper DDoS protection, but complimentary.

## Transitioning

About halfway through development we had a rethink. We wanted the benefits of both an enterprise CMS and a Jamstack architecture. NextJs was maturing and [Uniform](https://uniform.dev) (founded by the Sitecore JSS developers) provided another option. By combining these technologies and approaches we eventually settled on a new approach: Enterprise Jamstack

![Nationwide's Enterprise Jamstack](/img/enterprisejamstack.jpeg "Nationwide's Enterprise Jamstack")

We had to transition to this architecture as it was not what we originally envisioned. There were 4 main steps:

1. Terraform the new storage accounts and CDN configuration
2. Convert the React SSR Node application to use NextJs
3. Install and configure the Uniform Sitecore plugin (used to trigger export)
4. Build the automation pipeline to a blob deploy

Other than the use of an Enterprise CMS there are some subtle differences that make up our stack:

## JAM = TGS

The JAM in Jamstack for us is TGS: TypeScript, GraphQL and Sitecore.

## Blue/Green blobs & buckets

That's now a thing. We've had blue/green deploys in the world of DevOps for some time but generally that was a technique used for compute. We use the same technique with storage accounts which means we can test the generated site with our test automation suite before switching the blobs or buckets.

## Isomorphic

Sitecore's isomorphic React is what gives you the best of both with server side rendering and app-like behaviour after the initial page load. We wanted to keep that functionality whilst not being reliant on the content delivery servers compute. This is where Uniform helps. A publish now consists of:

1. Export all media assets to a storage
2. Export all layout service JSON to a storage (this contains everything required to render each route e.g. content, layout configuration)
3. Run the SSR site exporter against the layout JSON in the blob then copy the rendered assets into storage
4. If the above succeeds (this is where we could fail on 500 errors) we copy to either the blue or green storage
5. Run smoketests
6. Switch storage

## vNext

If I were a betting man I suspect the future of the enterprise CMS is for there not to be one. Content hubs provide the missing collaboration features that no WCMS has ever managed to achieve. With the addition of content as a service features I can see a world where Enterprise Jamstack is indistinguishable from Jamstack. As a developer, you would simply choose the SaaS service that aligns with your business needs and meets your SLA requirements. For some websites, Sitecore's Content Hub would be perfect, for others Gather Content or Contentful might be the right choice.

Jamstack has enabled an incredibly diverse technology stack for web developers. There's never been more choice.
