"use client";

import { useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { jsPDF } from "jspdf";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function GraphPlotter() {
  const [data, setData] = useState<number[]>([]);
  const [newDataPoint, setNewDataPoint] = useState("");

  const addDataPoint = () => {
    const point = Number.parseFloat(newDataPoint);
    if (!isNaN(point)) {
      setData([...data, point]);
      setNewDataPoint("");
    }
  };

  const chartData = {
    labels: data.map((_, index) => `Point ${index + 1}`),
    datasets: [
      {
        label: "Data Points",
        data: data,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  const generatePDF = () => {
    const canvas = document.querySelector("canvas") as HTMLCanvasElement;
    const pdf = new jsPDF();
    pdf.addImage(canvas.toDataURL("image/png"), "PNG", 10, 10, 190, 100);
    pdf.save("graph.pdf");
  };

  const generateImage = () => {
    const canvas = document.querySelector("canvas") as HTMLCanvasElement;
    const link = document.createElement("a");
    link.download = "graph.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Graph Plotter</h2>
      <div className="flex space-x-2">
        <Input
          type="number"
          value={newDataPoint}
          onChange={(e) => setNewDataPoint(e.target.value)}
          placeholder="Enter data point"
        />
        <Button onClick={addDataPoint}>Add Point</Button>
      </div>
      {data.length > 0 && (
        <>
          <Line data={chartData} />
          <div className="flex space-x-2">
            <Button onClick={generatePDF}>Generate PDF</Button>
            <Button onClick={generateImage}>Generate Image</Button>
          </div>
        </>
      )}
    </div>
  );
}
