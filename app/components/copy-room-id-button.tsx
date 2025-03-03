import { useParams } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "./ui/button";

export default function CopyRoomIdButton() {
	const { roomId } = useParams({ from: "/$roomId/" });

	const handleCopyRoomId = () => {
		navigator.clipboard
			.writeText(roomId)
			.then(() => {
				toast.success("Room ID copied to clipboard", {
					id: "copy-room-id-toast",
				});
			})
			.catch((err) => {
				toast.error("Unable to copy Room ID", { id: "copy-room-id-toast" });
			});
	};

	return <Button onClick={handleCopyRoomId}>Copy Room Id</Button>;
}
