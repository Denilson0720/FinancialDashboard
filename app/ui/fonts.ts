// import Inter from the built in next/font
// next js optimizes fonts by fetching them and applying them at build time avoding any additional fetch after build
import { Inter,Lusitana } from 'next/font/google';
 
export const inter = Inter({ subsets: ['latin'] });
export const lusitana = Lusitana({weight:["700","400"],subsets:['latin']});