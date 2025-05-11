import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});
// import ReactApexChart from 'react-apexcharts';
import { Typography } from "antd";
import eChart, { getDefaultEChart } from "./configs/eChart";

interface EChartProps {
  data?: number[];
  categories?: string[];
  title?: string;
  subtitle?: string;
  percentGrowth?: string;
}

function EChart({
  data,
  categories,
  title = "Tổng Sản Phẩm Đã Bán",
  subtitle = "Biểu Đồ Tổng Lượng Sản Phẩm Đã Bán Qua Từng Tháng",
  percentGrowth = "+30%",
}: EChartProps) {
  const { Title, Paragraph } = Typography;
  const [chartData, setChartData] = useState(eChart);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (data && categories) {
      setChartData(getDefaultEChart(data, categories));
    }
  }, [data, categories]);

  return (
    <>
      <Title level={5}>{title}</Title>
      <Paragraph className="lastweek">
        Nhiều hơn tháng trước<span className="bnb2">{percentGrowth}</span>
      </Paragraph>
      <Paragraph className="lastweek">{subtitle}</Paragraph>
      <div id="chart" style={{ marginTop: "30px" }}>
        {isClient && (
          <ReactApexChart
            className="bar-chart"
            options={chartData.options}
            series={chartData.series}
            type="bar"
            height={220}
            width={"100%"}
          />
        )}
      </div>
    </>
  );
}

export default EChart;
