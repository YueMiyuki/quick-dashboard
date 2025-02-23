"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { jsPDF } from "jspdf";

ChartJS.register(
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function GraphTab() {
  const [showTrendline, setShowTrendline] = useState(false);
  const [trendlineColor, setTrendlineColor] = useState("#FF0000");
  const [xTitle, setXTitle] = useState("X Axis");
  const [yTitle, setYTitle] = useState("Y Axis");
  const [graphTitle, setGraphTitle] = useState("Real-time Data Plot");
  const [dataPointName, setDataPointName] = useState("Data Points");
  const [newX, setNewX] = useState("");
  const [newY, setNewY] = useState("");
  const [dataPoints, setDataPoints] = useState<{ x: number; y: number }[]>([]);

  const calculateTrendline = () => {
    if (dataPoints.length < 2) return [];

    const n = dataPoints.length;
    const xValues = dataPoints.map((point) => point.x);
    const yValues = dataPoints.map((point) => point.y);

    const xMean = xValues.reduce((a, b) => a + b, 0) / n;
    const yMean = yValues.reduce((a, b) => a + b, 0) / n;

    let numerator = 0;
    let denominator = 0;
    for (let i = 0; i < n; i++) {
      numerator += (xValues[i] - xMean) * (yValues[i] - yMean);
      denominator += Math.pow(xValues[i] - xMean, 2);
    }

    const slope = numerator / denominator;
    const intercept = yMean - slope * xMean;

    return xValues.map((x) => slope * x + intercept);
  };

  const chartData = {
    datasets: [
      {
        label: dataPointName,
        data: dataPoints,
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.5)",
      },
      ...(showTrendline && dataPoints.length >= 2
        ? [
            {
              label: "Trend Line",
              data: dataPoints.map((point, index) => ({
                x: point.x,
                y: calculateTrendline()[index],
              })),
              borderColor: trendlineColor,
              borderDash: [5, 5],
              fill: false,
              pointRadius: 0,
            },
          ]
        : []),
    ],
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: graphTitle,
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const x = context.parsed.x;
            const y = context.parsed.y;
            const formatNumber = (value: number) =>
              Number.isInteger(value) ? value.toString() : value.toFixed(2);
            return `${context.dataset.label}: (${formatNumber(
              x
            )}, ${formatNumber(y)})`;
          },
        },
      },
    },
    scales: {
      x: {
        type: "linear",
        title: {
          display: true,
          text: xTitle,
        },
        min: 0,
        max: Math.max(0, ...dataPoints.map((p) => p.x)) + 1,
      },
      y: {
        type: "linear",
        title: {
          display: true,
          text: yTitle,
        },
        min: 0,
        max: Math.max(0, ...dataPoints.map((p) => p.y)) + 1,
      },
    },
  };

  const addDataPoint = () => {
    const x = Number.parseFloat(newX);
    const y = Number.parseFloat(newY);
    if (!isNaN(x) && !isNaN(y)) {
      setDataPoints([...dataPoints, { x, y }]);
      setNewX("");
      setNewY("");
    }
  };

  const deleteDataPoint = (index: number) => {
    const newPoints = [...dataPoints];
    newPoints.splice(index, 1);
    setDataPoints(newPoints);
  };

  const generatePDF = () => {
    const canvas = document.querySelector("canvas") as HTMLCanvasElement;
    const pdf = new jsPDF();
    pdf.addImage(canvas.toDataURL("image/png"), "PNG", 10, 10, 190, 100);
    pdf.save("graph.pdf");
  };

  return (
    <div className="grid grid-cols-2 gap-6">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Graph Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>X Axis Title</Label>
                <Input
                  value={xTitle}
                  onChange={(e) => setXTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Y Axis Title</Label>
                <Input
                  value={yTitle}
                  onChange={(e) => setYTitle(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Graph Title</Label>
              <Input
                value={graphTitle}
                onChange={(e) => setGraphTitle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Data Point Name</Label>
              <Input
                value={dataPointName}
                onChange={(e) => setDataPointName(e.target.value)}
              />
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={showTrendline}
                  onCheckedChange={setShowTrendline}
                  id="trendline"
                />
                <Label htmlFor="trendline">Show Trend Line</Label>
              </div>
              {showTrendline && (
                <div className="flex items-center space-x-2">
                  <Label>Color</Label>
                  <Input
                    type="color"
                    value={trendlineColor}
                    onChange={(e) => setTrendlineColor(e.target.value)}
                    className="w-20 h-8"
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                type="number"
                value={newX}
                onChange={(e) => setNewX(e.target.value)}
                placeholder="X Value"
              />
              <Input
                type="number"
                value={newY}
                onChange={(e) => setNewY(e.target.value)}
                placeholder="Y Value"
              />
            </div>

            <Button onClick={addDataPoint}>Add Data Point</Button>

            <div className="space-y-2">
              <Label>Data Points</Label>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {dataPoints.map((point, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 border rounded"
                  >
                    <div className="flex items-center gap-2">
                      <span className="bg-gray-100 rounded-full px-2 py-1 text-xs font-medium text-black">
                        {index + 1}
                      </span>
                      <span className="text-sm">
                        ({point.x}, {point.y})
                      </span>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteDataPoint(index)}
                    >
                      Delete
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="h-full">
            <Line data={chartData} options={options} />
            <div className="mt-4 flex justify-end">
              <Button onClick={generatePDF}>Export PDF</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
