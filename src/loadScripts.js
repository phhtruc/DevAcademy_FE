// loadScripts.js

export function loadExternalScripts() {
    const scripts = [
      '/src/assets/js/jquery.min.js',
      '/src/assets/js/popper.min.js',
      '/src/assets/js/bootstrap.min.js',
      '/src/assets/js/jquery.appear.js',
      '/src/assets/js/waypoints.min.js',
      '/src/assets/js/jquery.counterup.min.js',
      '/src/assets/js/wow.min.js',
      '/src/assets/js/apexcharts.js',
      '/src/assets/js/slick.min.js',
      '/src/assets/js/select2.min.js',
      '/src/assets/js/owl.carousel.min.js',
      '/src/assets/js/jquery.magnific-popup.min.js',
      '/src/assets/js/smooth-scrollbar.js',
      '/src/assets/js/lottie.js',
      '/src/assets/js/chart-custom.js',
      '/src/assets/js/custom.js',
      '/src/assets/js/countdown.min.js'
    ]
  
    scripts.forEach(src => {
      const script = document.createElement('script')
      script.src = src
      script.async = false
      document.body.appendChild(script)
    })
  }
  