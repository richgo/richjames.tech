---
templateKey: blog-post
title: Deploying a microfront-end app to kubernetes
date: 2021-04-02T07:07:50.333Z
description: >-
  How to deploy an opionionated NextJs and federated Apollo GraphQL
  implementation to kubernetes.
featuredpost: true
featuredimage: /img/architecture.png
tags:
  - skaffold
  - helm
  - docker
  - devops
  - kubernetes
---


This is a follow on from a previous post on microfront-ends and federated GraphQL which you can find here:

# [Decoupling digital with micro-frontends and micro-services](https://richjames.tech/blog/2020-12-21-decoupled-digital-supporting-a-modern-business-with-micro-frontends-and-micro-services/)

For the last couple of years we have been working with mono-repos and kubernetes. We strived to have a reproducible, fast build system that could deploy to kubernetes locally or cloud, whilst giving a great developer experience. 

The last point is pertient - we wanted a (mostly) bash-less system that avoided scripts galore that always become unwieldy as they're copy/pasted/modified - and then not documented. 

After trying a few quirky things like the nix package manager, and deciding to avoid Bazel or Buck's complexity, we settled on the super simple Google Skaffold. 

It has a simple yaml config and a plugable architecture:

![architecture](https://skaffold.dev/images/architecture.png)[](https://richjames.tech/blog/2020-12-21-decoupled-digital-supporting-a-modern-business-with-micro-frontends-and-micro-services/)\
I would highly recommend reading the docs here: <https://skaffold.dev/docs/quickstart/>

We started with a single file 'skaffold.yaml' and used it to configure the build paths for docker and deploy paths for helm charts. It started out as very simple enabling our developers to get all of our microservices running with a single command:

```
skaffold dev
```

Our CI also uses Skaffold:

```
skaffold build
```

As does our CD:

```
skaffold deploy
```

What could be simpler? 

Then we added production configuration via the [profiles](https://skaffold.dev/docs/environment/profiles/) feature. It soon became a giant yaml file that was dificult to read. 

**We also fell into a trap with profiles: they use a regex**. If you read the docs it does say that, but we learned the hard way. A profile named 'prod' and a profile named 'nonprod' could catch you out - they both fire when you run:

```
skaffold dev -p prod
```

The way to solve the giant yaml problem is to use the new modules feature. It allows you to have a *requires* section like so:

```
requires:
 - path: accounts-app
 - path: products-app
 - path: home-app
```

Skaffold then checks those respective paths for another skaffold.yaml. This means individual teams can maintain their own skaffold.yaml files.

See the full feature documentation here: [Skaffold Mulitple Config Support](https://docs.google.com/document/d/1dA1549Rj9xfAt5sHh-wHng1MQT1A9SOylLt4xEjctGk/edit#)

I have created a working monorepo which deploys 8 pods to kubernetes here: 

<https://github.com/richgo/microfrontends-k8s>

I havent used the *base* feature but it is something to be aware of (see the google design doc for an example). It will allow the re-use of common config, which will almost certainly be of use in a productionised skaffold config.

## [](https://github.com/richgo/microfrontends-k8s)The *new* three amigos

It used to be bash + docker-compose + make. I would propose the new 3 amigos is skaffold + docker-buildkit + helm3. The 3 work brilliantly together.
