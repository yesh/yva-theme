const hero = document.querySelector('.hero'),
  heroCanvas = hero?.querySelector('.hero__canvas'),
  heroCaption = hero?.querySelector('.hero__caption'),
  heroMedia = hero?.querySelector('.hero__media'),
  heroCurtain = hero?.querySelector('.hero__curtain')

if (heroCanvas && heroCaption && heroCurtain) {
  const heroCurtainTimeline = gsap.timeline()

  heroCurtainTimeline
    .to(heroCurtain, {
      width: '70%',
      backgroundColor: '#ffffff',
      delay: 0.6,
    })
    .to(heroCaption, { color: `#212529` }, '<')

  const scrollHeroTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: hero,
      start: 'top top',
      pin: true,
      end: `+=${window.innerHeight * 2}`,
      scrub: 0.24,
      snap: {
        snapTo: [0, 1],
        delay: .12,
        duration: 1.2,
        directional: false,
      }
    },
  })

  scrollHeroTimeline
    .to(heroCanvas, {
      xPercent: -70,
    })
    .to(
      heroMedia,
      {
        width: `${100}%`,
        flex: `0 0 ${100}%`,
      },
      '<'
    )
}
