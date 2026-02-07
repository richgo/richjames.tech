---
templateKey: 'blog-post'
title: 'Sitecore JSS @ Scale | Architecture'
date: 2019-07-15T15:04:10.000Z
featuredpost: true
featuredimage: /img/architecture.jpg
description: Building for multi-site with decoupled front-ends and a microservice architecture
tags:
  - Sitecore
  - JSS
  - Architecture
---
![architecture](/img/architecture.jpg)
# Sitecore JSS @ Scale

2\. Building for multi-site with decoupled front-ends and a microservice architecture

**Scenario**

My team found ourselves in an uncomfortable situation — our organisations tech strategy pointed towards container platforms and microservice architectures, yet much of the estate we were responsible for was powered by a traditional virtual machine based, monolithic architecture.

When you’re working with an enterprise CMS like Sitecore, it is very difficult to do anything other than follow the prescribed reference architectures to the T. In order to remain within the realms of an enterprise support agreement this is necessary, but it could be suboptimal for your bespoke system components. It can easily leave you with a cookie cutter architecture that neither leverages the full potential of the latest platform or new technology.

### Sitecore through the ages

Before we start to look at the art of the possible with current tech, lets take a look at what a lot of (CM only) on-prem architectures look like.

![](https://cdn-images-1.medium.com/max/800/1*7sIhFlMdo_7SmmIh7VKDvw.png)

This should be familiar to anyone that worked with Sitecore pre version 8. A VM based architecture that encourages a single deployable code base. It has many problems, specifically monolithic scaling and can be (often was in my experience) configured manually because of a lack of investment in or understanding of DevOps practices.

Other than adding DMS, then mongo DB and Solr, Sitecore architecture didn’t really change for a while. At least until 8.2, when Sitecore went cloud native. The move to Azure meant VMs were replace by autoscaling App Services, Solr by Azure Search, SQL Server by SQL Azure and Azure Redis was used for session storage.

![](https://cdn-images-1.medium.com/max/800/0*1jqTpUUweNWDC91h.PNG)

A major infrastructure improvement, I’m sure you'll agree. However, it does not encourage you to change anything about your software architecture.

Throughout the past decade, the rest of the tech industry had moved to open source software, microservices in docker containers and kubernetes for orchestration.

### Decoupling the front-end in 9.1

Sitecore JSS not only presented us with the long-desired ability to use SPA frameworks (React/Angular/Vue) but it also changes the default Sitecore developer approach of building MVC components — discouraging partial postbacks to the content delivery servers, and encouraging a modern microservice architecture. Content Delivery servers now have a single use: delivering content, via APIs — 3 in fact (layout, graphql & dictionary).

This was a lightbulb moment. We have many instances of Sitecore, some different versions, and different teams looking after each one. Architecturally, Sitecore was baked in to the stack, as .NET is, leaving us with tightly coupled systems upgraded only when necessary because of cost/risk/complexity.

This got us thinking, could we simplify our CMS estate by having a single core CMS, delivered as a service to multiple consuming applications, using multiple UI technologies, whilst still providing an enterprise grade experience editor?

Answer: yes, with Sitecore 9.1, that is possible. We wanted to be able to deploy front ends independently of Sitecore, with backends that contain absolutely no reference to Sitecore. In our scenario, we build one front-end, and compose 2 packages for it: one container image for the web, working in connected mode, and one node app (same code), deployed to the content management server in integrated mode.

Whilst that works, the astute among you will have noticed that there is now a dependency on the front-end deploying code to a system it should be decoupled from. After some geeking out with dotpeek, one of the team realised Sitecore could easily remove this dependency and even went so far as to explain what needed to change:

[**Containerised SSR rendering for CM · Issue #112 · Sitecore/jss**  
_Is your feature request related to a problem? Please describe. The "problem" is that I'm looking for a way to treat…_github.com](https://github.com/Sitecore/jss/issues/112 "https://github.com/Sitecore/jss/issues/112")[](https://github.com/Sitecore/jss/issues/112)

This feature (or architectural change) was demoed at SUGCON 2019 and is key to a decoupled, containerised architecture. It also makes a SaaS hosted variant of Sitecore a possibility in future — Contentful on steroids!

### Sitecore 9.2 JSS architecture

Working for a financial services organisation, I can’t talk in detail about the specifics of our architecture, but I can show you what it broadly looks like. Which is this:

![](https://cdn-images-1.medium.com/max/800/1*Seqkic-awxA6HoMtQ458AQ.png)

Some commentary behind this architecture:

1.  Front-ends can be deployed independently.
2.  Back-ends can be deployed at a granular, microservice level using the Back-end For Front-end pattern.
3.  Sitecore CM and CD can be deployed independently to the front-ends.
4.  Sitecore has many dotnet core components which can run in a Kubernetes cluster now.
5.  We’re opting to standardise on open source technology so we could go multi cloud for hyper resilience.
6.  This is an XM configuration as we’re client-side personalising.
7.  Everything scales independently.
8.  This is a hybrid architecture reflecting the mixture of dotnet versions and their operating system requirements. It will evolve and more of the system will migrate into the K8s cluster.

The last point is prominent. It would be possible to stand up some windows nodes in a K8s cluster to run Windows containers now. Whilst it is an option, Sitecore CD & CM are untested and unsupported in that configuration. It would be wise to wait for the migrated dotnet core variants to arrive in future releases.

_This architecture requires some advanced DevOps techniques to really do it justice — which I will talk about in the next post._

There is no reference architecture for a containerised Sitecore right now. And it would really help if there was. If we had terraform scripts and K8s manifests, helm charts or operators as a starter for 10 it would make deployment and operation far simpler. As would some reference DevOps pipelines (hint hint).

### Whats Next?

9.2 brings a plethora of nice features for JSS, specifically SXA support (config in the DB), forms and the aforementioned decoupling of the CM app. And 9.3? Hopefully more migration to dotnet core — and more containerisation.

By [Rich James](https://medium.com/@richg0) on [July 15, 2019](https://medium.com/p/21d7b551674f).

[Canonical link](https://medium.com/@richg0/sitecore-jss-scale-21d7b551674f)

Exported from [Medium](https://medium.com) on January 28, 2020.