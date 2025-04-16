import React from 'react'

const Page = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-background flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-gray-100 dark:bg-card p-6 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-4 text-gray-900 dark:text-foreground">
          Upload your PDF
        </h2>
        <p className="text-sm text-gray-600 dark:text-muted-foreground text-center mb-6">
          SmartSummary will read and summarize your file using AI.
        </p>
 
        <form className="space-y-4">
          <div>
            <input
              type="file"
              accept="application/pdf"
              className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4
              file:rounded-lg file:border-0
              file:text-sm file:font-semibold
              file:bg-rose-600 file:text-white
              hover:file:bg-rose-700
              dark:file:bg-primary dark:file:text-background"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-rose-600 hover:bg-rose-700 text-white font-medium py-2 px-4 rounded-lg"
          >
            Upload & Summarize
          </button>
        </form>
      </div>
    </div>
  )
}

export default Page
