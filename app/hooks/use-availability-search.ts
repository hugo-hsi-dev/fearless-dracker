import { notFound, useNavigate, useSearch } from '@tanstack/react-router';
import { z } from 'zod';

export const availabilitySearchSchema = z.object({
	availabilitySearch: z.string().catch(''),
});

type AvailabilitySearchSchema = z.infer<typeof availabilitySearchSchema>;

export default function useAvailabilitySearch() {
	const appSearch = useSearch({
		from: '/_auth/app/$runCode/',
		shouldThrow: false,
	});
	const publicSearch = useSearch({
		from: '/_public/$runCode/',
		shouldThrow: false,
	});

	const navigate = useNavigate();

	if (appSearch) {
		// return {
		// 	name: appSearch.availabilitySearch,
		// 	setName: (search: AvailabilitySearchSchema) =>
		// 		navigate({
		// 			from: '/app/$runCode',
		// 			search: (prev) => ({ ...prev, ...search }),
		// 		}),
		// };
		return [
			appSearch.availabilitySearch,
			(search: AvailabilitySearchSchema['availabilitySearch']) =>
				navigate({
					from: '/app/$runCode',
					search: (prev) => ({ ...prev, availabilitySearch: search }),
				}),
		] as const;
	}
	if (publicSearch) {
		return [
			publicSearch.availabilitySearch,
			(search: AvailabilitySearchSchema['availabilitySearch']) =>
				navigate({
					from: '/$runCode',
					search: (prev) => ({ ...prev, availabilitySearch: search }),
				}),
		] as const;
	}
	throw notFound();
}
