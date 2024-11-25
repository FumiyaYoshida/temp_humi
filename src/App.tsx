import { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function App() {
  const [loading, setLoading] = useState(true);
  const [dtList, setDtList] = useState<string[]>([]);
  const [tempList, setTempList] = useState<number[]>([]);
  const [humiList, setHumiList] = useState<number[]>([]);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch('https://qgpc32qkwc.execute-api.ap-northeast-1.amazonaws.com/prod/get_display_temp_humi');
      const datas = await response.json();

      console.log(datas)
      setDtList(datas.body.map((data: any) => data.datetime));
      setTempList(datas.body.map((data: any) => data.temperature));
      setHumiList(datas.body.map((data: any) => data.humidity));
    }
    fetchData();
    setLoading(false);
  }, []);

  const temp_humi_options = {
    responsive: true,
    scales: {
      /** x軸 */
      x: {
        stacked: false,
        ticks: {
          color: 'white', // X軸の数値の色を白に設定
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.3)', // X軸の補助線の色を白に設定（透明度あり）
        },
      },
      /** yleft (y軸・左): Y軸が、複数あるので yleft と yright のように軸にIDを付ける */
      yleft: {
        type: 'linear', // 軸のタイプを指定
        position: 'left',
        stacked: false,
        ticks: {
          color: 'white', // X軸の数値の色を白に設定
        },
        // grid: {
        //   color: 'rgba(255, 99, 132, 0.3)', // 左Y軸の補助線の色（赤系の透明色）
        // },
        title: {
          display: true, // タイトルを表示する
          text: '温度（℃）', // 左Y軸のタイトル
          color: 'rgb(255, 99, 132)', // タイトルの色（オプション）
          font: {
            size: 18, // フォントサイズ（オプション）
          },
        },
      },
      /** yright (y軸・右): Y軸が、複数あるので yleft と yright のように軸にIDを付ける */
      yright: {
        type: 'linear', // 軸のタイプを指定
      position: 'right',
      stacked: false,
      ticks: {
        color: 'white', // X軸の数値の色を白に設定
      },
      // grid: {
      //   color: 'rgba(53, 162, 235, 0.3)', // 左Y軸の補助線の色（赤系の透明色）
      // },
      title: {
        display: true, // タイトルを表示する
        text: '湿度（％）', // 右Y軸のタイトル
        color: 'rgb(53, 162, 235)', // タイトルの色（オプション）
        font: {
          size: 18, // フォントサイズ（オプション）
        },
      },
      },
    },
    plugins: {
      legend: {
        labels: {
          color : 'white',
          font: {
            size: 14, // フォントサイズの変更（オプション）
          },
        },
      },
    },
  } as any;
  
  const labels = dtList;
  const temp_humi_data = {
    labels,
    datasets: [
      {
        label: '温度',
        data: tempList,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        yAxisID: "yleft"
      },
      {
        label: '湿度',
        data: humiList,
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        yAxisID: "yright"
      }
    ],
  };

  return (
    <main className="mx-auto w-full h-screen">
      <header className="flex justify-between py-5 bg-slate-950 w-full">
      {/* <header className="flex justify-between py-5 bg-slate-100 w-full"> */}
        <h1 className="ml-10 text-3xl text-white">温度・湿度</h1>
      </header>
      <div className="h-20 bg-gradient-to-t from-slate-950 to-slate-300"></div>
      <div className="flex p-10 place-content-center w-full h-[calc(100vh-156px)] text-white text-2xl bg-slate-950">
        {
          loading ? (
            <h3 className="text-center text-xl">Loading</h3>
          ) : <>
            <Line options={temp_humi_options} data={temp_humi_data} />
          </>
        }
      </div>
    </main>
  )
}

export default App
