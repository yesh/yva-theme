const accordions = [...document.querySelectorAll('.accordion')]

if (accordions.length) {
  accordions.forEach(_a => {
    const items = [..._a.querySelectorAll('.accordion-item')]
    items.forEach(_i => {
      const head = _i.querySelector('.accordion-item__head'),
            content = _i.querySelector('.accordion-item__content')

      head.addEventListener('click', () => {
        if (_i.classList.contains('is-open')) {
          _i.classList.remove('is-open')
          gsap.to(content, { height: 0 })
        } else {
          items.forEach(_i => {
            _i.classList.remove('is-open')
            gsap.to(_i.querySelector('.accordion-item__content'), { height: 0 })
          })
          gsap.to(content, { height: 'auto' })
          _i.classList.add('is-open')
        }
      })
    })
  })
}