import type { ReactNode } from "react";

type Props = {
  revealed: boolean;
  skeleton: ReactNode;
  children: ReactNode;
};

/**
 * Renders skeleton and real content stacked on top of each other.
 * The skeleton provides layout height; real content overlays via absolute positioning.
 * CSS class toggles a smooth crossfade between the two layers.
 */
export function Crossfade({ revealed, skeleton, children }: Props) {
  return (
    <div className={`crossfade${revealed ? " crossfade--revealed" : ""}`}>
      <div className="crossfade__layer crossfade__skeleton">{skeleton}</div>
      <div className="crossfade__layer crossfade__content">{children}</div>
    </div>
  );
}
