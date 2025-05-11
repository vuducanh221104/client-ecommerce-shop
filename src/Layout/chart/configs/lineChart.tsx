import { ApexOptions } from "apexcharts";

const getDefaultLineChart = (
  data: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0],
  categories: string[] = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
  ]
) => {
  return {
    series: [
      {
        name: "Tổng Khách hàng ",
        data: data,
        offsetY: 0,
      },
    ],

    options: {
      chart: {
        width: "100%",
        height: 350,
        type: "area" as const,
        toolbar: {
          show: false,
        },
      },

      legend: {
        show: false,
      },

      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
      },

      yaxis: {
        labels: {
          style: {
            fontSize: "14px",
            fontWeight: 600,
            colors: ["#8c8c8c"],
          },
        },
      },

      xaxis: {
        labels: {
          style: {
            fontSize: "14px",
            fontWeight: 600,
            colors: [
              "#8c8c8c",
              "#8c8c8c",
              "#8c8c8c",
              "#8c8c8c",
              "#8c8c8c",
              "#8c8c8c",
              "#8c8c8c",
              "#8c8c8c",
              "#8c8c8c",
            ],
          },
        },
        categories: categories,
      },

      tooltip: {
        y: {
          formatter: function (val: any) {
            return val;
          },
        },
      },
    },
  };
};

// Default chart with static data
const lineChart = getDefaultLineChart();

export { getDefaultLineChart };
export default lineChart;
