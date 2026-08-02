import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-crop-600 text-white px-6 py-3 flex items-center justify-between shadow">
      <Link href="/" className="text-xl font-bold tracking-tight">
        🌾 AgriPredict
      </Link>
      <div className="flex gap-5 text-sm">
        <Link href="/" className="hover:underline">Home</Link>
        <Link href="/dashboard" className="hover:underline">Dashboard</Link>
      </div>
    </nav>
  );
}
