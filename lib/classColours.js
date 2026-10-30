// Written out in full so Tailwind can find the class names
export const classColours = {
  green: {
    dot: 'bg-green-500',
    soft: 'bg-green-50',
    text: 'text-green-700',
    border: 'border-green-500',
  },
  orange: {
    dot: 'bg-orange-500',
    soft: 'bg-orange-50',
    text: 'text-orange-700',
    border: 'border-orange-500',
  },
  blue: {
    dot: 'bg-blue-500',
    soft: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-500',
  },
  purple: {
    dot: 'bg-purple-500',
    soft: 'bg-purple-50',
    text: 'text-purple-700',
    border: 'border-purple-500',
  },
}

export function coloursFor(classType) {
  return classColours[classType?.colour] ?? classColours.blue
}
