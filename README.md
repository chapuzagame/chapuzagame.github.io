# Chapuza Game

La web del estudio: https://chapuzagame.github.io

- `index.html`: la portada (How to Pour Beer y el estudio)
- `how-to-pour-beer/`: la demo de How to Pour Beer para jugar en el navegador, minificada (el juego completo está en la app;
  cada juego, en su carpeta)
- `jugar/`: redirige a `how-to-pour-beer/` (fue su primera dirección)
- `tt/` y `yt/`: las direcciones cortas que salen escritas al final de los vídeos (en TikTok y en los Shorts de YouTube
  los enlaces no se pueden pulsar). `chapuzagame.github.io/tt` lleva a la portada como si llegara con `?de=tt` (origen
  «tiktok») y `chapuzagame.github.io/yt`, a la inglesa (`/en/`) como si llegara con `?de=yt` («youtube»); lo que traigan
  detrás (`?p=…`) se queda. No cargan Umami ni `origen.js`, así que no cuentan como visita aparte. Valen con barra final y
  sin ella, y `404.html` las arregla si llegan en mayúsculas o con algo de más (`/TT`, `/yt.`)
- `privacy.html`: la política de privacidad de las apps
- `app-ads.txt`: los vendedores de anuncios autorizados (AdMob)

Se genera desde el repositorio del juego (`node scripts/build-site.mjs`, carpeta `docs/`).

© 2026 Chapuza Game. Todos los derechos reservados (ver `LICENSE`): el código y los gráficos se publican aquí solo para
que la web funcione, no para copiarlos ni reutilizarlos.
