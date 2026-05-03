// src/directives/lazyLoad.js
export const lazyLoad = {
  mounted(el, binding) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = el.querySelector('img')
          if (img && img.dataset.src) {
            img.src = img.dataset.src
            observer.unobserve(el)
          }
        }
      })
    })

    observer.observe(el)
  }
}