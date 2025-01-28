// file for server actions
// by exporting these functions we can use them in client or server components
'use server'
// import type validation library
import {z} from 'zod';
// import { sql } from '@vercel/postgres';
import { db } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export type State = {
    errors?: {
      customerId?: string[];
      amount?: string[];
      status?: string[];
    };
    message?: string | null;
};

const FormSchema = z.object({
    id: z.string(),
    // throw an error if cusomterId is not a string, plus message
    customerId: z.string({
        invalid_type_error: 'Please select a customer.',
    }),
    // amount coerces/typecasts any invalid type to number and 0 if invalid, plus message
    amount: z.coerce.number().gt(0, { message: 'Please enter an amount greater than $0.' }),
    // zod.enum allows us to decalre a schema with a fixed set of allowable string values
    // only pending or paid are allowed
    // sends a message of not have been selected
    status: z.enum(['pending', 'paid'],{
        // 
        invalid_type_error: 'Please select an invoice status.',
    }),
    date: z.string(),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });

// create db connection
const client  = await db.connect();
// prevState is a required prop because we call it from the useActionState hook, wont be using it
export async function createInvoice(prevState:State,formData: FormData) {
    // pass formData into type validation/parse
    // safeParse returns an object containing either success or errror
    const validatedFields = CreateInvoice.safeParse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
      });
     // If form validation fails, return errors early. Otherwise, continue.
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create Invoice.',
        };
    }
    // Prepare data for insertion into the database
    const { customerId, amount, status } = validatedFields.data;
    //store monetary value in cents for error prevention   
    const amountInCents = amount * 100;
    //make new date structure
    const date = new Date().toISOString().split('T')[0];
    try{
    await client.sql`
    INSERT INTO invoices (customer_id, amount, status, date)
    VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
    `;
    }
    catch(err){
        // console.log('Error creating a new invoice: ',err);
        return{
            message:`Database Error: Failed to create invoice. ${err}`
        }
        // no redirect here since throwing an error already redirects
    }
    //clear cache and request for new data as we have updated the database
    //...update UI
    revalidatePath('/dashboard/invoices');

    // redirect back to dashboard/invoices as we are in dashboard/invoices/create
    redirect('/dashboard/invoices')
  
}

// Use Zod to update the expected types
const UpdateInvoice = FormSchema.omit({ id: true, date: true });

export async function updateInvoice(id: string,prevState:State, formData: FormData) {
// try{

  const validatedFields= UpdateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });
  if (!validatedFields.success) {
    return {
        errors: validatedFields.error.flatten().fieldErrors,
        message: 'Missing Fields. Failed to Create Invoice.',
    };
  }
  const { customerId, amount, status } = validatedFields.data;
 
  const amountInCents = amount * 100;
 try{
  await client.sql`
    UPDATE invoices
    SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
    WHERE id = ${id}
  `;
}catch(err){
    console.log('Error updating invoice: ',err);
}
 //update the UI by fetching new fresh data
  revalidatePath('/dashboard/invoices');
  //redirect back to invoices after update
  redirect('/dashboard/invoices');

}

export async function deleteInvoice(id: string) {
    try{
    await client.sql`DELETE FROM invoices WHERE id = ${id}`;
    revalidatePath('/dashboard/invoices');
    // no need to redirect as this action would already be called within the invoices route
    // and UI has already been updated 
    }
    catch(err){
        console.log('Error deleting invoice: ',err);
    }
  }
