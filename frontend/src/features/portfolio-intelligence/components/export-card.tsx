"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import type { PortfolioIntelligenceReport, ExportFormat } from "../types";
import { exportPortfolioReport } from "../analysis/export";
import { downloadFile } from "@/features/ai/services/export";

interface ExportCardProps {
  report: PortfolioIntelligenceReport;
}

export function ExportCard({ report }: ExportCardProps) {
  const [exporting, setExporting] = useState(false);

  const handleExport = (format: ExportFormat) => {
    setExporting(true);
    try {
      const result = exportPortfolioReport(report, format);
      downloadFile(result.content, result.filename, result.mimeType);
    } finally {
      setExporting(false);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Export Report
        </CardTitle>
        <Download className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleExport("markdown")}
            disabled={exporting}
            className="text-xs"
          >
            Markdown
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleExport("json")}
            disabled={exporting}
            className="text-xs"
          >
            JSON
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleExport("csv")}
            disabled={exporting}
            className="text-xs"
          >
            CSV
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
