import { notFound, useParams } from '@tanstack/react-router';

export default function useRunCode() {
	const appParams = useParams({
		from: '/_auth/app/$runCode/',
		shouldThrow: false,
	});
	const publicParams = useParams({
		from: '/_public/$runCode/',
		shouldThrow: false,
	});
	if (appParams) {
		return { code: appParams.runCode };
	}
	if (publicParams) {
		return { code: publicParams.runCode };
	}
	throw notFound();
}
