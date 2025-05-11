// 'use client';
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});
// import ReactApexChart from 'react-apexcharts';

import { Typography } from "antd";
import { MinusOutlined } from "@ant-design/icons";
import lineChart, { getDefaultLineChart } from "./configs/lineChart";

interface LineChartProps {
  data?: number[];
  categories?: string[];
  title?: string;
  subtitle?: string;
  percentGrowth?: string;
}

function LineChart({
  data,
  categories,
  title = "Tổng Số Người Dùng Đăng ký",
  subtitle = "Tổng Số Người Dùng Đăng Ký Qua Từng Tháng",
  percentGrowth = "+30%",
}: LineChartProps) {
  const { Title, Paragraph } = Typography;
  const [chartData, setChartData] = useState(lineChart);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (data && categories) {
      setChartData(getDefaultLineChart(data, categories));
    }
  }, [data, categories]);

  return (
    <>
      <div className="linechart">
        <div>
          <Title level={5}>{title}</Title>
          <Paragraph className="lastweek">
            Nhiều hơn tháng trước
            <span className="bnb2">{percentGrowth}</span>
          </Paragraph>
          <Paragraph className="lastweek">{subtitle}</Paragraph>
        </div>
        <div className="sales">
          <ul>
            <li>{<MinusOutlined />} Traffic</li>
            <li>{<MinusOutlined />} Sales</li>
          </ul>
        </div>
      </div>

      {isClient && (
        <ReactApexChart
          className="full-width"
          options={chartData.options}
          series={chartData.series}
          type="area"
          height={350}
          width={"100%"}
        />
      )}
    </>
  );
}

export default LineChart;
