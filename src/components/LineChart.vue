<template>
    <canvas ref="canvas"></canvas>
  </template>

  <script>
  import { defineComponent, onMounted, watch } from 'vue';
  import { Chart, registerables } from 'chart.js';
  Chart.register(...registerables);

  export default defineComponent({
    props: {
      chartData: Object,
      chartOptions: Object,
    },
    setup(props) {
      let chartInstance = null;

      const createChart = (ctx) => {
        chartInstance = new Chart(ctx, {
          type: 'line',
          data: props.chartData,
          options: props.chartOptions,
        });
      };

      onMounted(() => {
        const ctx = document.querySelector('canvas').getContext('2d');
        createChart(ctx);
      });

      watch(
        () => props.chartData,
        () => {
          chartInstance.update();
        },
        { deep: true }
      );

      return {};
    },
  });
  </script>
