<template>
    <div>
      <h3>Real-Time Data Visualization</h3>

      <!-- Conditional rendering to ensure data is ready -->
      <div v-if="dataLoaded">
        <Line :data="chartData" :options="chartOptions" />
      </div>
      <div v-else>
        <p>Waiting for data...</p>
      </div>

      <div>
        <p>Margin: {{ currentMargin }}%</p>
        <input type="number" v-model.number="newMargin" min="0" max="100" />
        <button @click="updateMargin">Save</button>
      </div>

      <div>
        <p>Status: {{ connectionStatus }}</p>
        <p>Last Refreshed: {{ lastRefreshed }}</p>
      </div>
    </div>
  </template>

  <script lang="ts">
  import { defineComponent, ref, onMounted } from 'vue';
  import { Chart as ChartJS, registerables } from 'chart.js';
  import { Line } from 'vue-chartjs';
  import axios from 'axios';

  ChartJS.register(...registerables);

  export default defineComponent({
    name: 'RealTimeChart',
    components: { Line },
    setup() {
      const chartData = ref({
        labels: [], // Ensure labels are always defined
        datasets: [
          {
            label: 'Random Numbers',
            data: [], // Ensure data is always defined
            borderColor: 'rgba(75,192,192,1)',
            backgroundColor: 'rgba(75,192,192,0.2)',
          },
        ],
      });

      const dataLoaded = ref(false);
      const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            title: {
              display: true,
              text: 'Timestamp',
            },
          },
          y: {
            title: {
              display: true,
              text: 'Random Number',
            },
            min: 0,
            max: 100,
          },
        },
      };

      const currentMargin = ref(30);
      const newMargin = ref(30);
      const connectionStatus = ref('Disconnected');
      const lastRefreshed = ref('');
      let ws: WebSocket;

      const connectWebSocket = () => {
        ws = new WebSocket('ws://localhost:3000');

        ws.onopen = () => {
          connectionStatus.value = 'Connected';
        };

        ws.onmessage = (event) => {
          const message = JSON.parse(event.data);

          if (message.type === 'newNumber') {
            const { number, timestamp } = message.data;

            // Update labels and data reactively
            const newLabels = [...chartData.value.labels, timestamp];
            const newData = [...chartData.value.datasets[0].data, number];

            // Keep only the latest 15 data points
            if (newLabels.length > 15) {
              newLabels.shift();
              newData.shift();
            }

            // Update chartData with new instances
            chartData.value = {
              ...chartData.value,
              labels: newLabels,
              datasets: [
                {
                  ...chartData.value.datasets[0],
                  data: newData,
                },
              ],
            };

            lastRefreshed.value = new Date().toLocaleString();

            if (!dataLoaded.value) {
              dataLoaded.value = true;
            }
          } else if (message.type === 'margin') {
            currentMargin.value = message.value;
          }
        };

        ws.onclose = () => {
          connectionStatus.value = 'Disconnected';
          setTimeout(connectWebSocket, 1000); // Auto-reconnect
        };
      };

      const updateMargin = async () => {
        try {
          const token = localStorage.getItem('token');
          await axios.post(
            'http://localhost:3000/margin',
            { margin: newMargin.value },
            { headers: { Authorization: `Bearer ${token}` } }
          );
        } catch (error) {
          console.error('Error updating margin:', error);
        }
      };

      onMounted(() => {
        connectWebSocket();
      });

      return {
        chartData,
        dataLoaded,
        chartOptions,
        currentMargin,
        newMargin,
        connectionStatus,
        lastRefreshed,
        updateMargin,
      };
    },
  });
  </script>
