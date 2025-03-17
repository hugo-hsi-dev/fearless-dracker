import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { championMutations } from '@/features/champion/lib/mutations';
import { zodResolver } from '@hookform/resolvers/zod';
import { type PropsWithChildren, useState } from 'react';
import { useForm } from 'react-hook-form';
import { runMutations } from '../lib/mutations';
import { type CreateRunSchema, createRunSchema } from '../schemas/schemas';

type CreateRunModalProps = PropsWithChildren<{ asChild?: boolean }>;

export default function CreateRunModal({
	children,
	asChild,
}: CreateRunModalProps) {
	const [open, setOpen] = useState(false);
	const form = useForm({
		resolver: zodResolver(createRunSchema),
		defaultValues: {
			name: '',
		},
	});
	const createRun = runMutations.useCreate();
	const syncChampions = championMutations.useSync();

	function onSubmit(values: CreateRunSchema) {
		createRun.mutate(values);
		syncChampions.mutate();
		form.reset();
		setOpen(false);
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild={asChild}>{children}</DialogTrigger>
			<DialogContent>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
						<DialogHeader>
							<DialogTitle>Create run</DialogTitle>
							<DialogDescription>
								Give your run a unique name.
							</DialogDescription>
						</DialogHeader>
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Run name</FormLabel>
									<FormControl>
										<Input placeholder="My Awesome Run" {...field} />
									</FormControl>
									<FormDescription>
										Use this name to keep track of your runs.
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<DialogFooter>
							<DialogClose asChild>
								<Button type="button" variant="secondary">
									Close
								</Button>
							</DialogClose>

							<Button type="submit">Create</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
