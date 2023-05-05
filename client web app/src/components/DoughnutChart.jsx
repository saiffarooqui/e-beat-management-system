import React, {useState, useEffect} from 'react'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export const DoughnutChart = () => {

  const arr=[]
  const [chartData, setChartData] = useState({
    datasets:[]
  })

  useEffect(() =>{
    setChartData({
        labels: ['Red','Green', 'Yellow'],
      
      datasets:[
        {
          label: 'Beat Areas',
          data: [12, 19, 3],
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(255, 206, 86, 0.2)',,
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(255, 206, 86, 1)',
          ],
          borderWidth: 1,
        }
      ]
    }
    )
  }, arr)

  return (
    <div>
      <div className='w-full md:col-span-2 relative lg:h-[70vh] h-[50vh] m-auto p-4 border rounded-lg bg-white'>
          <Doughnut data={chartData}/>
      </div>
    </div>
  )
}
