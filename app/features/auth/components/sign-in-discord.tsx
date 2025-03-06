import { Button } from "@/components/ui/button";
import { authClient } from "../lib/auth-client";

export default function SignInDiscord() {
	async function signIn() {
		const data = await authClient.signIn.social({
			provider: "discord",
		});
	}
	return <Button onClick={() => signIn()}>Sign in with Discord</Button>;
}
