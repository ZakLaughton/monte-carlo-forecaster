import { useState } from "react";
import { Button } from "@mantine/core";

export function ShareButton() {
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button
      variant="light"
      size="xs"
      className="share-button-pulse"
      onClick={handleShare}
    >
      {copied ? "Link copied!" : "Share results"}
    </Button>
  );
}
