interface StepIndicatorProps {
    current: number;
  }
  
  export function StepIndicator({
    current,
  }: StepIndicatorProps) {
    const steps = [
      "Verify eligibility",
      "Submit application",
      "Confirmation",
    ];
  
    return (
      <div className="mb-10 flex items-center justify-center gap-3">
        {steps.map((step, index) => {
          const number = index + 1;
          const active = number <= current;
  
          return (
            <div
              key={step}
              className="flex items-center gap-3"
            >
              <div
                className={[
                  "flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold",
                  active
                    ? "bg-indigo-500 text-white"
                    : "bg-slate-800 text-slate-500",
                ].join(" ")}
              >
                {number}
              </div>
  
              <span
                className={
                  active
                    ? "hidden text-sm text-white sm:block"
                    : "hidden text-sm text-slate-500 sm:block"
                }
              >
                {step}
              </span>
  
              {number < steps.length && (
                <div className="h-px w-8 bg-slate-700" />
              )}
            </div>
          );
        })}
      </div>
    );
  }