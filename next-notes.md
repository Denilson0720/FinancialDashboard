# NEXT JS NOTES 📝

### BENEFITS OF OPTIMIZING FONTS
In normal web dev there is a thing called <a>cumulative layout shift</a>..  what is this?
When a project has an external font from say google such as "Imperial", it has to fetch this font and then apply it after the web app has been built.
Meanwhile it fethces for this font there is a little gray area/time where another font/default font is seen, once "imperial" is applied the web app gets its desired font...
however there is a chance that certain elements may shift such as images, headers, titles because of this small change.
#### WHERE DOES NEXT JS COME IN?
Becuase next js allows us to optimize fonts in a way that the font is fetched and applied all the same time during build time, the user does not have to experience
this grey area of waiting for the font to be fethced and applied and so it rejects the possibility of __cumulative layout shift__.
 - next/font built in allows this to happen easily.

### BENEFITS OF OPTIMZING IMAGES 
With regular images the developer has to make sure of many things:
- Ensure your image is responsive on different screen sizes.
- Specify image sizes for different devices.
- Prevent layout shift as the images load.
- Lazy load images that are outside the user's viewport.

#### WITH NEXTJS _\<Image/>_ component:
- Preventing layout shift automatically when images are loading.
- Resizing images to avoid shipping large images to devices with a smaller viewport.
- Lazy loading images by default (images load as they enter the viewport).
- Serving images in modern formats, like WebP and AVIF, when the browser supports it.

#### 🧐SIDENOTE: What is lazy loading of images?
load images as they come within the viewport, outisde of nextjs, devs have to figure this out on their own, whilst nextjs has it as default behavior.

### PARTIAL RENDERING IN NEXT JS
Next js supports layout components for nested routes where partial re-renders occur meaning on navigation inside a nested route only the nested components/pages will re-render while the layout will not re-render
#### Possible through the _\<Link/>_ components in NestJS _\<Link/>_  component
Through the use of the link component the users experience feels similar to that of a react single page application where visiting other routes happen instantly without any page refresh, this is becuase of CODE-SPLITTING and PRETFETCHING done by NextJS.
- With code-splitting with routes means the if a route experiences an error the whoel app will not break.
- when a <Link/> component comes within the browsers viewport next js prefetches the code for that route and by the time the user clicks it, the transition happens near instant...
...making it seem just like a react single page application.

### HOW TO FETCH DATA
#### APIs
You can use api endpoints through route handlers in nextjs, which run on the server
this helps avoid fetching data directly from the client as we are not exposing our api/databse keys to the clients browser which can lead to a lot of negatives.

#### RSC REACT SERVER COMPONENTS

- supports asynchronous javascript, you dont have to use hooks and states
- runs in the server,
        <ul>
        <li> avoid sending critical key information to the browser</li>
        <li> avoid sending high computational fetches to the client and keep in server and only send results to client</li>
        </ul>
- since server components run on the server you can query a databse directly meaning you dont need an api layer.

### ORM vs SQL
Both are great at doing CRUD operations to a database however __ORMs__ write __SQL__ under the hood.

![alt text](image.png)

### REQUEST WATERFALLS
request waterfalls refers to a sequence of network requence where each sequential request depends on the previous.
this is something like this:

    const user = await fetchUserData();
    const bankAccountInfo = await fetchBankAccountInfo();
    const debt = await fetchDebt();
_user data --> get bank account details for 'user' --> get debt data from 'bank acount info'_

Where each of the request depend on the data returned by the previous request.

### PARALLEL DATA FETCHING
In some cases we dont want to use patterns thatll produce request waterfalls as this can be less efficient especially if no data relies on another request.
An alternative would be parallel data fetching, in JavaScript this is dnoe through the _Promise.all()_ or _Promise.allSettled()_ functions which can call all prmises at the same time(in parallel).

        const data = await Promise.all([
                invoiceCountPromise,
                customerCountPromise,
                invoiceStatusPromise,
        ]);

### NOTE: ISSUES WITH SUPABASE
Supabase does not yet seem to support the sql shorthand as:

        import {sql} from '@vercel/postgres';
        const data = await sql<Revenue>`SELECT * FROM revenue`;
In order to by pass this we can either 
- switch and revert to another database solution offered in vercel (neon)
- make a db connection first and then proceed to query

In order to make a db connection first we do:

        import { db } from '@vercel/postgres';
        const client = await db.connect(); 
        const data = await client.sql<Revenue>`SELECT * FROM revenue`;
💡Solution thanks to lovely guy on <a href='https://screen.studio/share/dg7ZYizd'>reddit</a>.