gsap.registerPlugin(ScrollTrigger)

const deferredBlocks = [...document.querySelectorAll('.defer')]

if (deferredBlocks.length) {
  window.addEventListener('load', () => {

    deferredBlocks.forEach(block => {
      gsap.to(block.children[0], {
        scrollTrigger: {
          trigger: block,
          start: "top 75%"
        },
        y: 0,
        opacity: 1,
        duration: .48
      })
    })

  })
}