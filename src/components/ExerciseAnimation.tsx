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
const NECK_LEN = 7
const HEAD_RX = 13
const HEAD_RY = 16
const UPPER_ARM_LEN = 24
const FOREARM_LEN = 20
const THIGH_LEN = 30
const SHIN_LEN = 30
const HEAD_CY = -(TORSO_LEN + NECK_LEN + HEAD_RY)

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
        {/* Leg: hip -> knee, slight quad bulge, tapered capsule shin */}
        <g transform={`rotate(${pose.hipRest})`}>
          <AnimatedRotate range={pose.animate.hip} />
          <path d={`M 0,0 Q 7,${THIGH_LEN * 0.5} 0,${THIGH_LEN}`} stroke={BODY_COLOR} strokeWidth={21} />
          <g transform={`translate(0, ${THIGH_LEN}) rotate(${pose.kneeRest})`}>
            <AnimatedRotate range={pose.animate.knee} />
            <line x1={0} y1={0} x2={0} y2={SHIN_LEN} stroke={BODY_COLOR} strokeWidth={16} />
            <ellipse cx={6} cy={SHIN_LEN} rx={11} ry={6} fill={ACCENT_COLOR} />
          </g>
        </g>

        {/* Torso: curved spine path (slight lower-back arch, forward chest curve) + neck + head */}
        <g transform={`rotate(${pose.torsoRest})`}>
          <AnimatedRotate range={pose.animate.torso} />
          <path
            d={`M 0,0 C -7,${-TORSO_LEN * 0.28} 9,${-TORSO_LEN * 0.7} 0,${-TORSO_LEN}`}
            stroke={BODY_COLOR}
            strokeWidth={30}
          />
          <line x1={0} y1={-TORSO_LEN} x2={0} y2={-TORSO_LEN - NECK_LEN} stroke={BODY_COLOR} strokeWidth={13} />
          <ellipse cx={0} cy={HEAD_CY} rx={HEAD_RX} ry={HEAD_RY} fill={BODY_COLOR} />
          <circle cx={-4.5} cy={HEAD_CY - 1} r={1.5} fill="white" />
          <circle cx={4.5} cy={HEAD_CY - 1} r={1.5} fill="white" />

          {/* Arm: shoulder -> elbow -> hand, slight bicep bulge */}
          <g transform={`translate(0, ${-TORSO_LEN}) rotate(${pose.shoulderRest})`}>
            <AnimatedRotate range={pose.animate.shoulder} />
            <path d={`M 0,0 Q 6,${UPPER_ARM_LEN * 0.5} 0,${UPPER_ARM_LEN}`} stroke={BODY_COLOR} strokeWidth={16} />
            <g transform={`translate(0, ${UPPER_ARM_LEN}) rotate(${pose.elbowRest})`}>
              <AnimatedRotate range={pose.animate.elbow} />
              <line x1={0} y1={0} x2={0} y2={FOREARM_LEN} stroke={BODY_COLOR} strokeWidth={13} />
              <g transform={`translate(0, ${FOREARM_LEN})`}>
                <ellipse cx={0} cy={3} rx={6.5} ry={9} fill={ACCENT_COLOR} />
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
