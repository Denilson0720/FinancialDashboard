// file for server actions
// by exporting these functions we can use them in client or server components
'use server'
// import type validation library
import {z} from 'zod';
// import { sql } from '@vercel/postgres';
import { db } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const FormSchema = z.object({
    id: z.string(),
    customerId: z.string(),
    amount: z.coerce.number(),
    status: z.enum(['pending', 'paid']),
    date: z.string(),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });

// create db connection
const client  = await db.connect();

export async function createInvoice(formData: FormData) {
    // const rawFormData = {
    // pass formDaya into type validation/parse
    const { customerId, amount, status } = CreateInvoice.parse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
      });
    //store monetary value in cents for error prevention   
    const amountInCents = amount * 100;
    //make new date
    const date = new Date().toISOString().split('T')[0];
      // Test it out:
    //   console.log(typeof rawFormData.amount);
    // insert new data into database
    // await sql`
    await client.sql`
    INSERT INTO invoices (customer_id, amount, status, date)
    VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
    `;
    //clear cache and request for new data as we have updated the database
    //simpler terms: update UI
    revalidatePath('/dashboard/invoices');

    // redirect back to dashboard/invoices as we are in dashboard/invoices/create
    redirect('/dashboard/invoices')


}
