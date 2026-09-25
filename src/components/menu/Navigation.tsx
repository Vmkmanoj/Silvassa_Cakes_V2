import { ArrowLeft, ArrowRight } from "lucide-react";
import type { ReactNode } from "react";

export function ControlButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string;
  disabled: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      className="page-control"
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export function Navigation({
  onPrevious,
  onNext,
  previousDisabled,
  nextDisabled,
  statusLabel,
  hintLabel,
}: {
  onPrevious: () => void;
  onNext: () => void;
  previousDisabled: boolean;
  nextDisabled: boolean;
  statusLabel: string;
  hintLabel: string;
}) {
  return (
    <nav className="menu-controls" aria-label="Menu page controls">
      <ControlButton label="Previous page" disabled={previousDisabled} onClick={onPrevious}>
        <ArrowLeft />
      </ControlButton>
      <div className="page-status">
        <span>{statusLabel}</span>
        <small>{hintLabel}</small>
      </div>
      <ControlButton label="Next page" disabled={nextDisabled} onClick={onNext}>
        <ArrowRight />
      </ControlButton>
    </nav>
  );
}
