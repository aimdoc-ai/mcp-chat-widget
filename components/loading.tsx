import { AIIndicator } from "@/components/indicator"

export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl py-24 flex justify-center">
      <AIIndicator loading={true} />
    </div>
  )
}