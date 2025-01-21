// dynamic route segment
// each render of this route will be of the same strucute 
// but unique to whatever id value has been provided in the URL
import Form from '@/app/ui/invoices/edit-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchCustomers,fetchInvoiceById} from '@/app/lib/data';

 
// page accepts prop called params
//params: A promise that resolves to an object containing the dynamic route parameters from the root segment down to that page.
// will be used to access id
export default async function Page(props:{params:Promise<{id:string}>}) {
    const params = await props.params;
    const id = params.id
    // fetch invoice using id pulled from dynamic URL params
    // const invoice = await fetchInvoiceById(id);
    // const customers = await fetchCustomers();
    const [invoice,customers] = await Promise.all([
        fetchInvoiceById(id),
        fetchCustomers()
    ])
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Invoices', href: '/dashboard/invoices' },
          {
            label: 'Edit Invoice',
            href: `/dashboard/invoices/${id}/edit`,
            active: true,
          },
        ]}
      />
      {/* pass in invoice data to prepopulate form before editing*/}
      <Form invoice={invoice} customers={customers} />
    </main>
  );
}