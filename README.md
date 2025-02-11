# NEXT JS NOTES 📝

💡Note:For this specific project tutorial, if user is using Supabase as the Database for Vercel Postgres the user will have to first set up a database connection to use the sql shorthand method provided by the '@vercel/postgres' library.  This is because the SQL shorthand method defaults to using SQL over HTTP which is not fully supported by supabase just yet. '@vercel/postgres' has also now moved onto using Neon, see [this](#note-issues-with-supabase) for application.
        
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
```ts
const user = await fetchUserData();
const bankAccountInfo = await fetchBankAccountInfo();
const debt = await fetchDebt();
```
_user data --> get bank account details for 'user' --> get debt data from 'bank acount info'_

Where each of the request depend on the data returned by the previous request.

### PARALLEL DATA FETCHING
In some cases we dont want to use patterns thatll produce request waterfalls as this can be less efficient especially if no data relies on another request.
An alternative would be parallel data fetching, in JavaScript this is dnoe through the _Promise.all()_ or _Promise.allSettled()_ functions which can call all prmises at the same time(in parallel).
```ts
const data = await Promise.all([
        invoiceCountPromise,
        customerCountPromise,
        invoiceStatusPromise,
]);
```

# NOTE: ISSUES WITH SUPABASE
Supabase does not yet seem to support the sql shorthand as:
```ts
import {sql} from '@vercel/postgres';

const data = await sql<Revenue>`SELECT * FROM revenue`;
```
In order to by pass this we can either 
- switch and revert to another database solution offered in vercel (neon)
- make a db connection first and then proceed to query

In order to make a db connection first we do:
```ts
import { db } from '@vercel/postgres';

const client = await db.connect(); 
const data = await client.sql<Revenue>`SELECT * FROM revenue`;
```
💡Solution thanks to lovely guy on <a href='https://screen.studio/share/dg7ZYizd'>reddit</a>.

### STATIC RENDERING
With static rendering, data fetching and rendering happens on the server at build time (when you deploy) or when revalidating data.

When a user visits your application the cached results are served from the CDN(Content Delivery Network).

#### 💡What are cached results?
Caching done by the CDN works by serving as a intermediary between the user and the server where instead of having the user request for data located all the way in ther server(which may be located far, adding to request fetch time), the user is served prebuilt and prefetched data from the CDN for faster and more efficient load/fetch times.
However given that some data is bound to change the cache which can be stored in different geographical locations; clear themselves and request new updated data from the server every so often(whenever theyre scheduled to).

__caches becomes even more useful when the user wants to go into other nested routes or comes back at a later date to visit the same site as they are returned cached results in quick time__

__The cache/CDN has all prefetched data for your application allowing for quick near instant accesibility time of routes__

        /customers
        /customers/id
__\*if for some reason it does not have the data needed to build the /customer/id route it will go back and fetch for it from the server and keep it for future requests*__


In this aspect caching works well in _static rendering_ of blogs, personal portfolios, marketing pages because these applications dont have data updating as often.

### DYNAMIC RENDERING
With dynamic rendering, content is rendered on the server for each user at request time (when the user visits the page). There are a couple of benefits of dynamic rendering:

- Real-Time Data - Dynamic rendering allows your application to display real-time or frequently updated data. This is ideal for applications where data changes often.
- User-Specific Content - It's easier to serve personalized content, such as dashboards or user profiles, and update the data based on user interaction.
- Request Time Information - Dynamic rendering allows you to access information that can only be known at request time, such as cookies or the URL search parameters.

### Streaming Data
Streaming is a data transfer technique that can be used as a solution to _slow data request_ from blocking the whole page being loaded and usable.

Streaming allows an application to be broken down into smaller _chunks_ (in react these cna be thought of as the components themselves) and as chunk data is fetched they will be loaded.

Streaming allows for the application to be viewed even if all components/chunks are not yet available or interactable.

__Streaming helps reduce the overall load time of an application__

![alt text](image-1.png)

"By streaming, you can prevent slow data requests from blocking your whole page. This allows the user to see and interact with parts of the page without waiting for all the data to load before any UI can be shown to the user."

![alt text](image-2.png)

Implementation of Streaming in NextJS:
- loading.tsx file, for entire pages.
- \<Suspense> component,going a more 'granular' approach with specific components.

#### loading.tsx
loading.tsx is a builtin NextJS file that serves as the fallback component before being replaced by dynamic data after fetching is complete.

Since static components can be shown in conjunction with loading skeletons(Streaming), the user does not have to wait till the loading skeletons from loading.tsx is loaded to be able to interact with the static components.

. ex: user can use navbar(static) to navigate away before dashboard(dynamic) is finished loading, this is called __interuptable navigation__.

### Route Groups
Route groups can be used to seperate files into logical groups.  If we only want skeletons/loading components to apply to specific page we can can nest these files in a folder '(overview)'

![alt text](image-3.png)

_Our loading.tsx will only apply to page.tsx in this instance_

_( ) does not affect the URL path so in this instance the url is still /dashboard_

### Component Grouping
Sometimes certain components may make a popping pattern when data fetching is done and it is time to render which can offput the user. (ex: card components in an eccomerce store displaing multiple products in the same format).

__To avoid this__ we can group components by surrounding them in a wrapper component, and have the wrapper component be surrounded by a __Suspense__ component, where the user will see a skeleton until the wrapper containing all components is ready to render. _As so:_
![alt text](image-6.png)

#### Parallel Data fetching using Promise.all([])
If we wish to have a specific group of requests to be executed at the same time in parallel we can use Javascripts method Promise.all().

Promise.all works by receiving an iteratable group of requests, when all requests are done it finally returns a single Promise. It returns an array of the returned values.
![alt text](image-7.png)

### Deciding when to use \<Suspense/> boundaries can improve user experience
Where you place your Suspense boundaries will depend on a few things:
- How you want the user to experience the page as it streams.
- What content you want to prioritize.
- If the components rely on data fetching. By moving data fetching down from the parent component to the component itself you are able to use Suspense and provide a more granular rendering pattern and further prevent UI blockage.

"Where you place your suspense boundaries will vary depending on your application. In general, it's good practice to move your data fetches down to the components that need it, and then wrap those components in Suspense. But there is nothing wrong with streaming the sections or the whole page if that's what your application needs."

### Search and Pagination
### Mangaging Search State with URLs
- Bookmarkable and Shareable URLs: Since the search parameters are in the URL, users can bookmark the current state of the application, including their search queries and filters, for future reference or sharing.  
_more info_: Since React has limitations in search managing, users cannot directly share a webpages specific settings incuding filters, querys through URLs since react doest not manage search using URL by default(you would have to use a combination of hooks useQueryParamsState).
- Server-Side Rendering and Initial Load: URL parameters can be directly consumed on the server to render the initial state, making it easier to handle server rendering.
- Analytics and Tracking: Having search queries and filters directly in the URL makes it easier to track user behavior without requiring additional client-side logic.
- NextJS allows URL update without full page reload, thanks to client side navigation capabilities.

_Next JS facilitates the capabilities of sharing or bookmarking specific settings in a webpage_

#### How do we Mangage State with URLS:
- Capture the user's input. Using an input field
- Update the URL with the search params.
- Keep the URL in sync with the input field.
- Update the table to reflect the search query.

_visit /app/ui/search.tsx for implementation_

### Debouncing
Debouncing is a programming practice that puts limits on the rate on which a function can fire.

If we have a Search box which updates some components based off the query inputted by the user on every keystroke, this action can become very demanding as the application grows and the number of users grows alongside.  More users sending hundred-thousands of requests to the database at every single keystoke will become inneficient and costly.

To solve this Debouncing applies limits on how oftern the search function executes queries to the database.

#### Using <span style="color:pink">use-debounce</span> package
```ts
import { useDebouncedCallback } from 'use-debounce';
 
const handleSearch = useDebouncedCallback((term) => {
        console.log(`Searching... ${term}`);
        
        const params = new URLSearchParams(searchParams);
        if (term) {
                params.set('query', term);
        }else {
                params.delete('query');
        }
        replace(`${pathname}?${params.toString()}`);
}, 300);
```
Where the handleSearch is executed 300ms after the user has stopped typing.

### NextJS Server Actions
Server actions are asynchornous functions that handle server-side operations such as mutating data or logging a user in/out.

When you invoke a <span style="color:pink">server action</span> inside a server component you facilitate <span style="color:pink">progressive enhancement</span> which allows forms to function even if a users internet is slow or javascript is disabled on thier browser.  This ensures that users with slow internet can still interact with the application.

"Additionally, Next.js integrates Server Actions with its caching mechanisms. When a form is submitted through a Server Action, you can mutate data on the server and revalidate the associated cache using APIs like revalidatePath and revalidateTag. This ensures that any stale data is updated, providing users with the most current information <span style="color:pink">without requiring a full page reload.</span>"  This ensures any changes made through form submission are seen in the UI.
### Dynamic Route Segments
Dynamic route segments allow you to render the same component with dynamic url paths and with that be able to fetch specific data depending on the url params.

        www.mydash.com/dashboard/invoices/[id]/edit
where a unique [id] can be passed to make the application render a specific ui pertaining to the data available to that id.
![alt text](image-4.png)

#### How do we retrieve these specific URL params:
We can have our child components receive the params prop,

<span style="color:pink">params: </span> A promise that resolves to an object containing the dynamic route parameters from the root segment down to that page.

![alt text](image-5.png)

### Error Handling
When it comes to error handling NextJS provides two popular solutions:
<span style="color:pink">error.tsx</span> and <span style="color:pink">not-found.tsx</span>
#### error.tsx
error.tsx can be used as a simple catch-all fallback.  It will not provide any specifics as to why the error is seen(because it is meant to be generic) but it will provide the user with a more graceful error handling event.
![alt text](image-8.png)
#### notFound from <span style="color:pink">next/navigation</span>
For more specifics notFound() will take precendence over error.tsx where we can make a specific not-found.tsx component to handle the specific error.
![alt text](image-9.png)

### Form Validation
When it comes to Database data mutation it is important to make sure that all data that is going to be inserted or updated within the database is existent and of the correct format.

<span style="color:pink">Client vs Server Validation</span>
#### Client Side Validation
Client side validation is the simplest way to add a small defensive line , through the use of the <span style="color:pink">required</span> attribute we can prevent the user from submitting a form with empty values where they are required.
However users with malitious intent can easily bypass this as this form of validation is mainly to enhance the UI and provide instant user feedback.
#### Server Side Validation
By validating form data on the server we can:
 - ensure our data is in the expected format before it is submitted to the database.(<span style='color:pink'>zod</span> is used in this project)
 - reduce risk of malitious users who bypass cllient side validation.
 - having a source of truth for valid data.
 
 #### How to use _Zod_
 Zod is a validation library which allows its users to create schemas to which they can compare form values to, to determine validity of values provided.
```ts
const FormSchema = z.object({

        id: z.string(),
        customerId: z.string({
                invalid_type_error: 'Please select a customer.',}),
        amount: z.coerce.number().gt(0, { 
                message: 'Please enter an amount greater than $0.' }),
        status: z.enum(['pending', 'paid'], {
                invalid_type_error: 'Please select an invoice status.',}),
        date: z.string(),
});
```

where:
- customerId: is expected to be a string, if no string is selected, it returns an error message
- amount: is typecasted into a number, since it comes in as a string in the input, if amount is elss than 0, message is sent
- status: using .enum is given an array of valid strings, if none are chosen it returns an error message.
- data: expected to be a string, user cannot physically tamper with this, so we leave it as is. 

#### Validity parsing
We can use .safeParse() to parse over the formData submitted into a server action function to check validity of data inputs <span style="color:pink">before</span> trying to submit a database query.
```js
function updateInvoice(id:string, prevState:State, formData:FormData){
        const validatedFields= FormSchema.safeParse({
                customerId: formData.get('customerId'),
                amount: formData.get('amount'),
                status: formData.get('status'),
        });
        if!(validatedFields.success){
                return {
                        errors: validatedFields.error.flatten().fieldErrors,
                        message: 'Missing Fields. Failed to Create Invoice.',
                }
        }
        const {customerId, amount, status} = validatedFields.data;

        ...proceed with database query
...
```


#### Using Reacts useActionState()
We can use the useActionState hook to provide the user with message feedback if the inputs they have submitted into the form are wrong based off the form validations on the server(done through zod).
The useActionState is a hook that allows you to update state based on the result of a form action.
```js
const [state, formAction] = useActionState(function, initialState)
```

- state, can be used to keep track of any error messages(from null to 'error creating such and such...')
- formAction, call the hook 
- function, function to take place(createInvoice, updateInvoice, deleteInvoice)
- initialState, the initial state before submitting form

#### Combination of useActionState hook and Zod validation
After submitting the form through the formAction we validate the submitted data via Zod, based off Zod validation results we update our _state_ (containing error and message) and can display any errors in validation as a message in the UI.

```html
<div id='amount-error' aria-live='polite' aria-atomic='true'>   
        {state.errors?.amount &&
        <p className='mt-1 text-sm text-red-500'>
                {state.errors.amount}
        </p>
        }
</div>
```
![alt text](image-11.png)

