import Script from 'next/script'
import '../css/normalize.css' // @csstools/Normalize CSS 12.1.1
import '../css/bootstrap.min.css' // Bootstrap CSS 4.6.2

export const metadata = {
    title: 'React App',
    description: 'Web site created with Next.js',
}

export default function RootLayout({ children }) {
    return (
        <html lang="en">
        <head>
            <meta name="theme-color" content="#000000" />
        </head>
        <body>
            <noscript>You need to enable JavaScript to run this app.</noscript>
            <div id="root">{children}</div>

            <Script src="https://cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.slim.min.js" crossOrigin="anonymous" />
            <Script src="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/js/bootstrap.bundle.min.js" crossOrigin="anonymous" />
        </body>
        </html>
    )
  }
