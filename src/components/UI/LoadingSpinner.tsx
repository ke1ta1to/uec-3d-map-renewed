'use client'

export default function LoadingSpinner() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-100 z-10">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="text-gray-600 font-medium">3Dモデルを読み込み中...</p>
      </div>
    </div>
  )
}