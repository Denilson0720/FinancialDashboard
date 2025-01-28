import { Metadata } from "next"
import { Suspense } from "react"
import Table from "@/app/ui/customers/table"

export const metadata : Metadata = {
    title:'Customers'
}
//pass in specific query based off current URL state
export default async function Page(
    props: {
        searchParams?: Promise<{
          query?: string;
        }>;
    }
){
        const searchParams = await props.searchParams;
        const query = searchParams?.query || '';

    return(
        <div className="w-full">
            {/* Customer Table Component has built in search */}
            <Suspense fallback={<p>Loading...</p>}>
                <Table query={query}/>
            </Suspense>
        </div>
    )
}