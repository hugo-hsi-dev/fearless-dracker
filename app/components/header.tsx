import { Link } from '@tanstack/react-router';
import { Divide } from 'lucide-react';
import type { PropsWithChildren } from 'react';
import { Button } from './ui/button';

export default function Header() {
	return (
		<header className="flex justify-between p-4">
			<div className="text-xl font-bold">Fearless Dracker</div>
			<Button asChild>
				<Link to="/sign-in">Sign In</Link>
			</Button>
		</header>
	);
}
