import type { Equipment } from '../data/workoutProgram'

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
const BODY_COLOR = '#1d4ed8'
const ACCENT_COLOR = '#93c5fd'
const EQUIPMENT_COLOR = '#94a3b8'

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

const TORSO_LEN = 44
const HEAD_R = 15
const UPPER_ARM_LEN = 24
const FOREARM_LEN = 20
const THIGH_LEN = 30
const SHIN_LEN = 30

function EquipmentProp({ equipment, orientation }: { equipment: Equipment; orientation: Orientation }) {
  switch (equipment) {
    case 'bench':
      return orientation === 'lying' ? (
        <rect x={15} y={168} width={170} height={16} rx={6} fill={EQUIPMENT_COLOR} />
      ) : (
        <>
          <rect x={86} y={150} width={28} height={38} rx={5} fill={EQUIPMENT_COLOR} />
          <rect x={86} y={95} width={10} height={55} rx={4} fill={EQUIPMENT_COLOR} />
        </>
      )
    case 'cable':
      return (
        <>
          <rect x={168} y={40} width={14} height={140} rx={4} fill={EQUIPMENT_COLOR} />
          <circle cx={175} cy={95} r={6} fill="#64748b" />
          <line x1={175} y1={95} x2={140} y2={110} stroke="#64748b" strokeWidth={2} strokeDasharray="3 3" />
        </>
      )
    case 'lat_pulldown':
      return (
        <>
          <rect x={40} y={20} width={120} height={10} rx={4} fill={EQUIPMENT_COLOR} />
          <rect x={95} y={20} width={10} height={130} rx={3} fill={EQUIPMENT_COLOR} />
          <circle cx={100} cy={25} r={6} fill="#64748b" />
        </>
      )
    case 'leg_press':
      return (
        <>
          <rect x={110} y={150} width={70} height={14} rx={5} fill={EQUIPMENT_COLOR} transform="rotate(-20 110 150)" />
          <rect x={60} y={180} width={120} height={12} rx={4} fill={EQUIPMENT_COLOR} />
        </>
      )
    case 'smith_machine':
      return (
        <>
          <rect x={40} y={15} width={8} height={175} rx={3} fill={EQUIPMENT_COLOR} />
          <rect x={152} y={15} width={8} height={175} rx={3} fill={EQUIPMENT_COLOR} />
          <rect x={40} y={15} width={120} height={8} rx={3} fill={EQUIPMENT_COLOR} />
        </>
      )
    default:
      return null
  }
}

export function ExerciseAnimation({
  pose,
  equipment = 'dumbbell',
  className = '',
}: {
  pose: ExercisePose
  equipment?: Equipment
  className?: string
}) {
  const orientationDeg = pose.orientation === 'lying' ? 90 : 0

  return (
    <svg viewBox="0 0 200 200" className={className}>
      <line x1="10" y1="188" x2="190" y2="188" stroke="currentColor" strokeOpacity={0.12} strokeWidth={2} />
      <EquipmentProp equipment={equipment} orientation={pose.orientation} />

      <g transform={`translate(100,140) rotate(${orientationDeg})`} strokeLinecap="round" fill="none">
        {/* Leg: hip -> knee, thick tapering capsule limbs */}
        <g transform={`rotate(${pose.hipRest})`}>
          <AnimatedRotate range={pose.animate.hip} />
          <line x1={0} y1={0} x2={0} y2={THIGH_LEN} stroke={BODY_COLOR} strokeWidth={22} />
          <g transform={`translate(0, ${THIGH_LEN}) rotate(${pose.kneeRest})`}>
            <AnimatedRotate range={pose.animate.knee} />
            <line x1={0} y1={0} x2={0} y2={SHIN_LEN} stroke={BODY_COLOR} strokeWidth={18} />
            <circle cx={0} cy={SHIN_LEN} r={8} fill={ACCENT_COLOR} />
          </g>
        </g>

        {/* Torso + head */}
        <g transform={`rotate(${pose.torsoRest})`}>
          <AnimatedRotate range={pose.animate.torso} />
          <line x1={0} y1={0} x2={0} y2={-TORSO_LEN} stroke={BODY_COLOR} strokeWidth={32} />
          <circle cx={0} cy={-TORSO_LEN - HEAD_R - 4} r={HEAD_R} fill={BODY_COLOR} />
          <circle cx={-5} cy={-TORSO_LEN - HEAD_R - 4} r={1.6} fill="white" />
          <circle cx={5} cy={-TORSO_LEN - HEAD_R - 4} r={1.6} fill="white" />

          {/* Arm: shoulder -> elbow -> dumbbell */}
          <g transform={`translate(0, ${-TORSO_LEN}) rotate(${pose.shoulderRest})`}>
            <AnimatedRotate range={pose.animate.shoulder} />
            <line x1={0} y1={0} x2={0} y2={UPPER_ARM_LEN} stroke={BODY_COLOR} strokeWidth={17} />
            <g transform={`translate(0, ${UPPER_ARM_LEN}) rotate(${pose.elbowRest})`}>
              <AnimatedRotate range={pose.animate.elbow} />
              <line x1={0} y1={0} x2={0} y2={FOREARM_LEN} stroke={BODY_COLOR} strokeWidth={14} />
              <g transform={`translate(0, ${FOREARM_LEN})`}>
                <circle cx={0} cy={0} r={7} fill={ACCENT_COLOR} />
                {equipment === 'dumbbell' && (
                  <>
                    <rect x={-4} y={-11} width={8} height={22} rx={2} fill="#334155" />
                    <circle cx={0} cy={-11} r={6} fill={BODY_COLOR} />
                    <circle cx={0} cy={11} r={6} fill={BODY_COLOR} />
                  </>
                )}
              </g>
            </g>
          </g>
        </g>
      </g>
    </svg>
  )
}
