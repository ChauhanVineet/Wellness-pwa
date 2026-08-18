export type Orientation = 'standing' | 'lying'

export interface JointRange {
  from: number
  to: number
}

export interface ExercisePose {
  orientation: Orientation
  torsoRest: number
  shoulderRest: number
  elbowRest: number
  hipRest: number
  kneeRest: number
  animate: {
    torso?: JointRange
    shoulder?: JointRange
    elbow?: JointRange
    hip?: JointRange
    knee?: JointRange
  }
}

const DUR = '1.8s'

function AnimatedRotate({ range }: { range?: JointRange }) {
  if (!range) return null
  return (
    <animateTransform
      attributeName="transform"
      type="rotate"
      values={`${range.from};${range.to};${range.from}`}
      dur={DUR}
      repeatCount="indefinite"
    />
  )
}

const TORSO_LEN = 42
const HEAD_R = 10
const UPPER_ARM_LEN = 24
const FOREARM_LEN = 20
const THIGH_LEN = 30
const SHIN_LEN = 30

export function ExerciseAnimation({ pose, className = '' }: { pose: ExercisePose; className?: string }) {
  const orientationDeg = pose.orientation === 'lying' ? 90 : 0

  return (
    <svg viewBox="0 0 200 200" className={className} stroke="#0b6e4f" strokeWidth={5} strokeLinecap="round" fill="none">
      <line x1="10" y1="188" x2="190" y2="188" stroke="currentColor" strokeOpacity={0.15} strokeWidth={2} />
      <g transform={`translate(100,140) rotate(${orientationDeg})`}>
        {/* Leg: hip -> knee */}
        <g transform={`rotate(${pose.hipRest})`}>
          <AnimatedRotate range={pose.animate.hip} />
          <line x1={0} y1={0} x2={0} y2={THIGH_LEN} />
          <g transform={`translate(0, ${THIGH_LEN}) rotate(${pose.kneeRest})`}>
            <AnimatedRotate range={pose.animate.knee} />
            <line x1={0} y1={0} x2={0} y2={SHIN_LEN} />
          </g>
        </g>

        {/* Torso + head */}
        <g transform={`rotate(${pose.torsoRest})`}>
          <AnimatedRotate range={pose.animate.torso} />
          <line x1={0} y1={0} x2={0} y2={-TORSO_LEN} />
          <circle cx={0} cy={-TORSO_LEN - HEAD_R - 2} r={HEAD_R} fill="#0b6e4f" stroke="none" />

          {/* Arm: shoulder -> elbow -> dumbbell */}
          <g transform={`translate(0, ${-TORSO_LEN}) rotate(${pose.shoulderRest})`}>
            <AnimatedRotate range={pose.animate.shoulder} />
            <line x1={0} y1={0} x2={0} y2={UPPER_ARM_LEN} />
            <g transform={`translate(0, ${UPPER_ARM_LEN}) rotate(${pose.elbowRest})`}>
              <AnimatedRotate range={pose.animate.elbow} />
              <line x1={0} y1={0} x2={0} y2={FOREARM_LEN} />
              <g transform={`translate(0, ${FOREARM_LEN})`}>
                <rect x={-3} y={-9} width={6} height={18} rx={1.5} fill="#4c9a7c" stroke="none" />
                <circle cx={0} cy={-9} r={5} fill="#0b6e4f" stroke="none" />
                <circle cx={0} cy={9} r={5} fill="#0b6e4f" stroke="none" />
              </g>
            </g>
          </g>
        </g>
      </g>
    </svg>
  )
}
