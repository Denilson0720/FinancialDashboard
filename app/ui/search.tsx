'use client';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useSearchParams,useRouter,usePathname } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';


export default function Search({ placeholder }: { placeholder: string }) {
  const searchParams = useSearchParams();
  // get current pathname ex: dashboard/invoices
  const pathname = usePathname();
  const {replace} = useRouter();

  // function handleSearch(term:string){
  // wrap handleSearch contents in useDebounce to only run code after 300ms after the user has stopped typing
  const handleSearch = useDebouncedCallback((term)=>{
    // create an instance of URLSearchParams using searchParams
    // allows us to make the URL query param
    // if term ='Lee' , params is set to ?query=lee
    console.log(`Searching ${term}`);
    const params = new URLSearchParams(searchParams);
    // when user types, reset page to 1
    params.set('page', '1');
    if(term){
      // if term exists, make new url query param
      params.set('query',term);
    }
    else{
      // if term does not exist, delete and query param, is blank
      params.delete('query')
    }
    // url is updated without page reload, client side navigation
    // replace url with new pathname and params
    // dashboard/invoices --> dashboard/invoices?query=lee
    replace(`${pathname}?${params.toString()}`);
    console.log(term)
  
  },300);

  return (
    <div className="relative flex flex-1 flex-shrink-0">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <input
        onChange={(e)=>handleSearch(e.target.value)}
        className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
        placeholder={placeholder}
        // using defaultValue instead of value because we are not using React to control/keep track of the input value
        defaultValue={searchParams.get('query')?.toString()}
      />
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
    </div>
  );
}
