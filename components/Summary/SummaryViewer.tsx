"use client"

import { useState, useMemo } from "react"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

const SummaryViewer = ({ text }: { text: string }) => {
  const [currentPage, setCurrentPage] = useState(0)

  const sections = useMemo(() => {
    const lines = text.split("\n")
    const parsed: string[][] = []
    let curr: string[] = []

    for (let line of lines) {
      if (line === "" && curr.length) {
        parsed.push(curr)
        curr = []
      } else if (line !== "") {
        curr.push(line)
      }
    }
    if (curr.length) parsed.push(curr)
    return parsed
  }, [text])

  const totalPages = sections.length
  const progress = totalPages
    ? Math.round(((currentPage + 1) / totalPages) * 100)
    : 0

  const goNext = () =>
    currentPage < totalPages - 1 && setCurrentPage(currentPage + 1)
  const goPrev = () =>
    currentPage > 0 && setCurrentPage(currentPage - 1)

  const { title, content } =
    sections.length && sections[currentPage]
      ? {
          title: sections[currentPage][0].trim().replace(/\*\*/g, ""),
          content: sections[currentPage].slice(1),
        }
      : { title: "", content: [] as string[] }

  return (
    <Card className="w-full max-w-xl sm:max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{title}</span>
          <span className="text-sm text-muted-foreground">
            {currentPage + 1} / {totalPages}
          </span>
        </CardTitle>

        <div className="w-full bg-gray-200 rounded-full h-2 my-2">
          <div
            className="bg-rose-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-gray-500 mb-4">
          {progress}% complete
        </p>
      </CardHeader>

      <CardContent className="min-h-[200px]">
        {content.map((line, i) => (
          <p key={i} className="mb-2">
            {line}
          </p>
        ))}
      </CardContent>

      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={goPrev} disabled={currentPage === 0}>
          <ChevronLeft className="h-4 w-4 mr-2" /> Previous
        </Button>
        <Button
          variant="outline"
          onClick={goNext}
          disabled={currentPage === totalPages - 1}
        >
          Next <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </CardFooter>
    </Card>
  )
}

export default SummaryViewer
