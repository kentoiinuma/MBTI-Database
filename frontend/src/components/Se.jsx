import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';

// Chart.jsの設定を登録
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

function Se() {
  // グラフのデータを管理するステート
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: '音楽アーティスト',
        data: [],
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: '#2EA9DF',
        borderWidth: 1,
      },
    ],
  });

  // APIのURLを環境に応じて設定
  let API_URL;
  if (window.location.origin === 'http://localhost:3001') {
    API_URL = 'http://localhost:3000';
  } else if (
    window.location.origin ===
    'https://favorite-database-16type-f-5f78fa224595.herokuapp.com'
  ) {
    API_URL = 'https://favorite-database-16type-5020d6339517.herokuapp.com';
  } else {
    // デフォルトのURL
    API_URL = 'http://localhost:3000';
  }

  // ボタンの状態を管理するためのステート
  const [selectedTypes, setSelectedTypes] = useState([
    'ESFP',
    'ESTP',
    'ISFP',
    'ISTP',
  ]);
  const [selectedStatus, setSelectedStatus] = useState(['公式', '非公式']);

  // データをフェッチするための副作用
  useEffect(() => {
    const fetchData = async () => {
      // クエリパラメータを設定
      const queryParams = new URLSearchParams({
        mbti_types: selectedTypes,
        diagnosis_methods: selectedStatus.map((status) =>
          status === '公式' ? 'official_assessment' : 'self_assessment',
        ),
      });

      // データをフェッチしてグラフを更新
      const response = await fetch(
        `${API_URL}/api/v1/media_works/statistics?${queryParams}`,
      );
      const data = await response.json();
      const sortedData = Object.entries(data).sort((a, b) => b[1] - a[1]);
      setChartData({
        labels: sortedData.map((item) => item[0]),
        datasets: [
          {
            ...chartData.datasets[0],
            data: sortedData.map((item) => item[1]),
          },
        ],
      });
    };

    fetchData();
  }, [selectedTypes, selectedStatus]); // 依存配列にselectedTypesとselectedStatusを追加

  // グラフのオプション設定
  const options = {
    indexAxis: 'y',
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  // ボタンの選択状態を切り替える関数
  const toggleType = (type) => {
    setSelectedTypes((prev) => {
      if (prev.includes(type)) {
        return prev.filter((t) => t !== type);
      } else {
        return [...prev, type];
      }
    });
  };

  const toggleStatus = (status) => {
    setSelectedStatus((prev) => {
      if (prev.includes(status)) {
        return prev.filter((s) => s !== status);
      } else {
        return [...prev, status];
      }
    });
  };

  // ボタンのスタイルを定義
  const buttonStyle = (selected) => ({
    backgroundColor: selected ? '#2EA9DF' : '#fff', // 選択されているかによって背景色を変更
    borderColor: '#2EA9DF',
    color: selected ? '#fff' : '#2EA9DF', // 選択されているかによって文字色を変更
    '&:hover': {
      backgroundColor: selected ? '#2387c1' : '#fff', // 選択されているかによってホバー時の背景色を変更
      borderColor: '#2387c1',
    },
    '&.MuiButton-outlined': {
      color: '#2EA9DF',
      borderColor: '#2EA9DF',
    },
  });

  return (
    <>
      {/* ボタンを追加 */}
      <div className="button-groups mt-6 ml-32 ">
        {/* タイプ選択ボタン */}
        <ButtonGroup className="mr-6">
          {['ESFP', 'ESTP', 'ISFP', 'ISTP'].map((type) => (
            <Button
              key={type}
              onClick={() => toggleType(type)}
              variant={selectedTypes.includes(type) ? 'contained' : 'outlined'}
              sx={buttonStyle(selectedTypes.includes(type))}
            >
              {type}
            </Button>
          ))}
        </ButtonGroup>
        {/* 状態選択ボタン */}
        <ButtonGroup>
          {['公式', '非公式'].map((status) => (
            <Button
              key={status}
              onClick={() => toggleStatus(status)}
              variant={
                selectedStatus.includes(status) ? 'contained' : 'outlined'
              }
              sx={buttonStyle(selectedStatus.includes(status))}
            >
              {status}
            </Button>
          ))}
        </ButtonGroup>
      </div>
      {/* 説明テキストを追加 */}
      <p style={{ color: '#2EA9DF', marginTop: '20px', marginLeft: '130px' }}>
        ボタンを選択・選択解除することでデータベースをフィルタリングすることができます。
      </p>
      {/* 既存のグラフ表示コード */}
      <div className="my-8 ml-2" style={{ width: '98%', height: '100%' }}>
        <Bar options={options} data={chartData} />
      </div>
    </>
  );
}

export default Se;
