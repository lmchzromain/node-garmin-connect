const NO_TARGET = {
  workoutTargetTypeId: 1,
  workoutTargetTypeKey: 'no.target',
  displayOrder: 1,
};

const endConditionFor = ({ duration }) =>
  duration !== undefined
    ? { conditionTypeId: 2, conditionTypeKey: 'time', displayOrder: 2, displayable: true }
    : { conditionTypeId: 1, conditionTypeKey: 'distance', displayOrder: 1, displayable: true };

// Converts "mm:ss" per km to m/s
const paceToSpeed = (pace) => {
  const [min, sec] = pace.split(':').map(Number);
  return 1000 / (min * 60 + sec);
};

const PACE_TARGET_TYPE = {
  workoutTargetTypeId: 6,
  workoutTargetTypeKey: 'pace.zone',
  displayOrder: 6,
};

// pace can be a single string "4:30" or a range { min: "4:15", max: "4:45" }
const paceValues = (pace) => {
  const faster = typeof pace === 'string' ? pace : pace.min;
  const slower = typeof pace === 'string' ? pace : pace.max;
  return {
    targetValueOne: paceToSpeed(slower), // lower speed bound
    targetValueTwo: paceToSpeed(faster), // upper speed bound
  };
};

const executableStep = (stepTypeId, stepTypeKey, displayOrder, { duration, distance, pace }) => ({
  type: 'ExecutableStepDTO',
  stepType: { stepTypeId, stepTypeKey, displayOrder },
  endCondition: endConditionFor({ duration }),
  endConditionValue: duration ?? distance,
  targetType: pace ? PACE_TARGET_TYPE : NO_TARGET,
  ...(pace && paceValues(pace)),
});

/**
 * @param {{ duration?: number, distance?: number, pace?: string | { min: string, max: string } }} opts
 */
export const warmup = (opts) => executableStep(1, 'warmup', 1, opts);

/**
 * @param {{ duration?: number, distance?: number, pace?: string | { min: string, max: string } }} opts
 */
export const interval = (opts) => executableStep(3, 'interval', 3, opts);

/**
 * @param {{ duration?: number, distance?: number, pace?: string | { min: string, max: string } }} opts
 */
export const recovery = (opts) => executableStep(4, 'recovery', 4, opts);

/**
 * @param {{ duration: number }} opts - duration in seconds
 */
export const rest = (opts) => executableStep(5, 'rest', 5, opts);

/**
 * @param {{ duration?: number, distance?: number, pace?: string | { min: string, max: string } }} opts
 */
export const cooldown = (opts) => executableStep(2, 'cooldown', 2, opts);

/**
 * @param {{ iterations: number, steps: object[] }} opts
 */
export const repeat = ({ iterations, steps }) => ({
  type: 'RepeatGroupDTO',
  stepType: { stepTypeId: 6, stepTypeKey: 'repeat', displayOrder: 6 },
  numberOfIterations: iterations,
  workoutSteps: steps,
  endCondition: { conditionTypeId: 7, conditionTypeKey: 'iterations', displayOrder: 7, displayable: false },
  endConditionValue: iterations,
});
