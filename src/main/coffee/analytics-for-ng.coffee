_gaq = _gaq or []
_gaq.push [
  "_setAccount"
  "UA-44064442-1"
]

do()->
  ga = document.createElement("script")
  ga.type = "text/javascript"
  ga.async = true
  ga.src = "https://ssl.google-analytics.com/ga.js"
  s = document.getElementsByTagName("script")[0]
  s.parentNode.insertBefore ga, s
