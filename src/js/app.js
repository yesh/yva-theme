gsap.defaults({
  ease: Power2.easeInOut, 
  duration: .24
})

const main = document.querySelector('main')

window.addEventListener('load', () => {
  gsap.to(main, { autoAlpha: 1, duration: .12 })
})
