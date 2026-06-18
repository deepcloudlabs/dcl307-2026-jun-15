import { useOptimistic, useState, useTransition } from "react";
import { saveLike } from "./service.js";

export default function LikeButton() {
    const [liked, setLiked] = useState(false);
    const [error, setError] = useState(null);
    const [isPending, startTransition] = useTransition();

    const [optimisticLiked, setOptimisticLiked] = useOptimistic(liked);

    function handleClick() {
        const nextLiked = !optimisticLiked;

        setError(null);

        startTransition(async () => {
            setOptimisticLiked(nextLiked);

            try {
                console.log("Sending the request to the backend...");

                const savedLiked = await saveLike(nextLiked);

                startTransition(() => {
                    setLiked(savedLiked);
                });
            } catch (err) {
                console.error("Failed to save like:", err);

                startTransition(() => {
                    setError("Could not save your like. Please try again.");
                });
            }
        });
    }

    return (
        <div>
            <button
                type="button"
                onClick={handleClick}
                disabled={isPending}
                aria-pressed={optimisticLiked}
            >
                {optimisticLiked ? "❤️ Liked" : "🤍 Like"}
            </button>

            {isPending && <span> Saving...</span>}

            {error && (
                <p role="alert">
                    {error}
                </p>
            )}
        </div>
    );
}