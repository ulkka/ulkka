import * as React from 'react'
import Head from 'next/head'

import 'setimmediate'

if (!global.setImmediate) {
  global.setImmediate = setTimeout
}

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
