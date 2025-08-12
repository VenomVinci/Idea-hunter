type StepperProps = {
  steps: string[];
  current: number; // 0-based
};

export default function Stepper({ steps, current }: StepperProps) {
  return (
    <ol className="flex w-full items-center text-xs">
      {steps.map((label, index) => {
        const active = index === current;
        const complete = index < current;
        return (
          <li key={label} className="flex items-center">
            <div
              className={
                'flex items-center gap-2 rounded-full px-3 py-1 ' +
                (active
                  ? 'bg-brand-500/20 text-white ring-1 ring-brand-400/40'
                  : complete
                  ? 'text-brand-200'
                  : 'text-white/50')
              }
            >
              <span
                className={
                  'flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ' +
                  (complete ? 'bg-brand-600 text-white' : 'bg-white/10 text-white/70')
                }
              >
                {index + 1}
              </span>
              <span className="hidden sm:inline">{label}</span>
            </div>
            {index < steps.length - 1 && (
              <div className="mx-2 h-px w-6 bg-white/10 sm:w-10" />
            )}
          </li>
        );
      })}
    </ol>
  );
}