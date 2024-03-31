import '../index.css';

export const metadata = {
    title: 'React App',
    description: 'Web site created with Next.js',
}

export default function RootLayout({ children }) {
    return (
        <html lang="en">
        <head>
            <meta name="theme-color" content="#000000" />

            {/* <!-- @csstools/Normalize CSS --> */}
            <link href="https://unpkg.com/@csstools/normalize.css" rel="stylesheet" />
            {/* <!-- Bootstrap CSS --> */}
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css" integrity="sha384-xOolHFLEh07PJGoPkLv1IbcEPTNtaed2xpHsD9ESMhqIYd0nLMwNLD69Npy4HI+N" crossOrigin="anonymous" />
        </head>
        <body>
            <noscript>You need to enable JavaScript to run this app.</noscript>
            <div id="root">{children}</div>

            <script src="https://cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.slim.min.js" integrity="sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj" crossOrigin="anonymous"></script>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-Fy6S3B9q64WdZWQUiU+q4/2Lc9npb8tCaSX9FK7E8HnRr0Jz8D6OP9dO5Vg3Q9ct" crossOrigin="anonymous"></script>
        </body>
        </html>
    )
  }
