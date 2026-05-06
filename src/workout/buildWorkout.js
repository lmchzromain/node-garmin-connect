const RUNNING_SPORT_TYPE = { sportTypeId: 1, sportTypeKey: 'running', displayOrder: 1 };

const assignStepOrders = (steps, startOrder = 1) =>
  steps.map((step, i) => {
    const stepOrder = startOrder + i;
    if (step.type === 'RepeatGroupDTO') {
      return { ...step, stepOrder, workoutSteps: assignStepOrders(step.workoutSteps) };
    }
    return { ...step, stepOrder };
  });

/**
 * Builds a Garmin Connect running workout payload ready for upload.
 * @param {{ name: string, description?: string, steps: object[] }} opts
 * @returns {object}
 */
export const buildRunningWorkout = ({ name, description, steps }) => ({
  workoutName: name,
  ...(description && { description }),
  sportType: RUNNING_SPORT_TYPE,
  estimatedDurationInSecs: 0,
  workoutSegments: [
    {
      segmentOrder: 1,
      sportType: RUNNING_SPORT_TYPE,
      workoutSteps: assignStepOrders(steps),
    },
  ],
});
