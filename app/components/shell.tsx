import { Divide } from 'lucide-react';
import type { PropsWithChildren } from 'react';
import Footer from './footer';
import Header from './header';

export default function Shell({ children }: PropsWithChildren) {
	return (
		<div className="min-h-screen flex flex-col">
			<Header />
			<main className="flex-1">{children}</main>
			<Footer />
		</div>
	);
}
