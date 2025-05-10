// "use client";
// import { useRouter } from 'next/navigation';

// export default function Home() {
//     const router = useRouter();
//     router.push("/login");
//     return null;
//   }
import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/login');
}