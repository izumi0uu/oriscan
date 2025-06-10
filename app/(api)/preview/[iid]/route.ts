import { API_URL, CDN } from '@/utils/constants'
import { InscriptionResponse } from '@/utils/types'

export async function GET(request: Request, { params }: { params: { iid: string } }) {
  try {
    const id = params.iid
    const data = await getInscription(id)
    // todo: errors

    return new Response(await page(data), {
      status: 200,

      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
      },
    })
  } catch (e) {
    return new Response(await pageEmpty(), {
      status: 500,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
      },
    })
  }
}

// todo: potentially render these pages directly from the api (faster db access)
// todo: remove css loading from this route group
async function page(data: InscriptionResponse): Promise<string> {
  // todo: add error handling and 404 etc.

  if (data.mime_type.startsWith('image/')) {
    return html(bodyWithImage(data))
  } else if (data.mime_type.startsWith('video/')) {
    return html(bodyWithVideo(data))
  } else if (data.mime_type.startsWith('audio/')) {
    return html(bodyWithAudio(data))
  } else if (data.mime_type.startsWith('text/')) {
    // todo: don't fetch content if big?
    const content = await getContent(data.id)

    if (data.mime_type.startsWith('text/html')) {
      return content
    }

    return htmlWithFont(data.content_length < 32 ? bodyWithTextShort(data, content) : bodyWithText(data, content))
  } else if (data.mime_type.startsWith('application/json')) {
    // todo: don't fetch content if big?
    const content = await getContent(data.id)

    return htmlWithFont(bodyWithText(data, content))
  }

  // todo: more types
  return html(bodyWithFile(data))
}

function html(children: string) {
  return `
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="format-detection" content="telephone=no" />
        <style>
          * {
            margin: 0;
            box-sizing: border-box;
          }
          html,
          body {
            min-height: 100vh;
            image-rendering: pixelated;
          }
          html {
            height: 100%;
          }
          body {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            background-color: #F2F0ED;
          }
        </style>
      </head>
      ${children}
    </html>`
}

function htmlWithFont(children: string) {
  return `
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="format-detection" content="telephone=no" />
        <style>
          @font-face {
            font-family: "Aeonik Fono";
            src: url('../../../../public/images/font/ebrima.ttf') format("woff2");
            font-weight: normal;
            font-style: normal;
            font-display: block;
          }
          * {
            margin: 0;
            box-sizing: border-box;
          }
          html,
          body {
            min-height: 100vh;
            image-rendering: pixelated;
            /*font-family: "Aeonik Fono", sans-serif;*/
          }
          html {
            height: 100%;
          }
          body {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            background-color: #F2F0ED;
          }
        </style>
      </head>
      ${children}
    </html>`
}

function bodyWithImage(data: InscriptionResponse) {
  return `
    <body style="background-image: url(${CDN}/content/${data.id}); background-position: center; background-repeat: no-repeat; background-size: contain; height: 100%; image-rendering: pixelated;>
      <img src="${CDN}/content/${data.id}" alt="Inscription image" style="image-rendering: pixelated; opacity: 0;"
        width="100%"
        height="100%"
      />
    </body>`
}

function bodyWithVideo(data: InscriptionResponse) {
  // todo: add bg color? for non square videos
  return `<body style="align-items: center; display: flex; height: 100%;">
      <video
        autoPlay
        loop
        muted
        style="width: 100%; height: 100%";"
      >
        <source src="${CDN}/content/${data.id}" />
      </video>
    </body>`
}

function bodyWithAudio(data: InscriptionResponse) {
  return `<body
      style={{
        align-items: center,
        justify-content: "space-around",
        display: "flex",
        height: "100%",
        margin: 0,
      }}
    >
      <audio controls style={{ width: "100%" }}>
        <source src="${CDN}/content/${data.id}" />
      </audio>
    </body>`
}

function bodyWithText(data: InscriptionResponse, text: string) {
  return `
  <body style="display: flex; align-items: center; width: 100%; aspect-atio: 1/1; position: relative; overflow: hidden; padding: 3px; text-rendering: geometricPrecision;">
    <p style="display: inline-block; width: 100%; padding: 4px; word-break: break-all; white-space: pre-wrap; font-size: ${getFontSize(
      data.content_length,
    )}">${text}</p>
    <div style="background: linear-gradient(rgba(242, 240, 237, 0),rgba(242, 240, 237, 0),rgba(242, 240, 237, 1)); position: absolute; top: 0; left: 0; width: 100%; height: 100%;"></div>
  </body>`
}

function bodyWithTextShort(data: InscriptionResponse, text: string) {
  return `
    <body style="display: flex; align-items: center; justify-content: space-around; width: 100%; height: 100%; padding: 3px; text-rendering: geometricPrecision;">
      <p style="display: inline-block; width: 100%; padding: 4px; word-break: break-all; text-align: center; font-size: 24px;">${text}</p>
    </body>`
}

function pageEmpty() {
  return `<html><body style="width: 100%; height: 100%; background: #CFC9C2;"></body></html>`
}

function bodyWithFile(data: InscriptionResponse) {
  return `
    <body style="display: flex; align-items: center; justify-content: space-around; width: 100%; height: 100%;">
      <div style="width: 48px">
        ${iconFile()}
      </div>
    </body>`
}

// helper
function getFontSize(contentLength: number) {
  if (contentLength < 10) return 22
  if (contentLength < 50) return 20
  return 14
}

// fetch
async function getInscription(iid: string) {
  const response = await fetch(`${API_URL}/inscriptions/${iid.toLowerCase()}`)
  return await response.json()
}

async function getContent(iid: string) {
  const response = await fetch(`${CDN}/content/${iid}`)
  return await response.text()
}

// icons

function iconFile() {
  return `<svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 30"
    >
      <path
        stroke="#AEA8A0"
        stroke-linecap="square"
        stroke-linejoin="bevel"
        d="M22.308 28.97H1.692a1.145 1.145 0 0 1-1.146-1.146V2.625A1.145 1.145 0 0 1 1.692 1.48h13.744l8.018 8.018v18.326a1.145 1.145 0 0 1-1.146 1.145Z"
      />
      <path
        fill="#AEA8A0"
        d="M5.06 18.623v-2.234h2.117v-.584H5.06v-1.708h2.504v-.584h-3.14v5.11h.636ZM11.352 13.513H8.476v.526H9.6v4.058H8.476v.526h2.876v-.526h-1.117V14.04h1.117v-.526ZM15.56 18.623v-.584h-2.293v-4.526h-.634v5.11h2.927ZM19.82 18.623v-.584h-2.605v-1.723h2.109v-.584h-2.11v-1.635h2.512v-.584H16.58v5.11h3.24Z"
      />
      <path
        stroke="#AEA8A0"
        stroke-width=".44"
        d="M5.06 18.623v-2.234h2.117v-.584H5.06v-1.708h2.504v-.584h-3.14v5.11h.636ZM11.352 13.513H8.476v.526H9.6v4.058H8.476v.526h2.876v-.526h-1.117V14.04h1.117v-.526ZM15.56 18.623v-.584h-2.293v-4.526h-.634v5.11h2.927ZM19.82 18.623v-.584h-2.605v-1.723h2.109v-.584h-2.11v-1.635h2.512v-.584H16.58v5.11h3.24Z"
      />
      <path
        stroke="#AEA8A0"
        stroke-linecap="square"
        stroke-linejoin="bevel"
        d="M15.436 1.871v7.626h7.606"
      />
    </svg>`
}
