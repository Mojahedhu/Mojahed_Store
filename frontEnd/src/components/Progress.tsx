import clsx from "clsx";
import { useLocation } from "react-router-dom";
type ProgressStepsProps = {
  currentStep: 1 | 2 | 3;
};

const steps = ["Login", "Shipping", "Summary"] as const;

const Progress = ({ currentStep }: ProgressStepsProps) => {
  return (
    <div className="flex justify-center mx-auto">
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const isCompleted = stepNumber < currentStep;
        const isActive = stepNumber === currentStep;
        return (
          <div key={step} className="flex items-center">
            <div className="place-items-center">
              {/* Step Circle */}
              <div
                className={clsx(
                  "w-10 h-10 rounded-full flex items-center justify-center",
                  isCompleted && "bg-green-500 text-white",
                  isActive && "bg-pink-500 text-white",
                  !isCompleted && !isActive && "bg-gray-300 text-gray-600",
                )}
              >
                {isCompleted ? "✓" : stepNumber}
              </div>
              {/* Step Label */}
              <div className="w-14 text-center">
                <p
                  className={clsx(
                    isCompleted && "text-green-600",
                    isActive && "text-pink-600",
                    !isCompleted && !isActive && "text-gray-400",
                  )}
                >
                  {step}
                </p>
              </div>
            </div>

            {/* Divider */}
            {stepNumber !== steps.length && (
              <div
                className={clsx(
                  "flex-1 h-1 mx-1 rounded mb-5 w-40",
                  isCompleted && "bg-green-500",
                  stepNumber > currentStep && "bg-pink-500",
                  !isCompleted && stepNumber > currentStep && "bg-gray-300",
                )}
              ></div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export { Progress };

const stepMap: Record<string, 1 | 2 | 3> = {
  "/login": 1,
  "/shipping": 2,
  "/place-order": 3,
};

export const SmartProgress = () => {
  const { pathname } = useLocation();
  return <Progress currentStep={stepMap[pathname] ?? 1} />;
};
