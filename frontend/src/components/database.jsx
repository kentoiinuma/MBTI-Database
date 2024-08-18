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
import { createTheme, ThemeProvider } from '@mui/material/styles';

// Chart.jsの設定を登録
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

const theme = createTheme({
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
  },
});

function Database() {
  // グラフのデータを管理するステート
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'アニメ',
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
  } else if (window.location.origin === 'https://www.mbti-database.com') {
    API_URL = 'https://api.mbti-database.com';
  } else {
    // デフォルトのURL
    API_URL = 'http://localhost:3000';
  }

  // 心理機能の選択状態を管理するステート
  const [selectedFunctions, setSelectedFunctions] = useState([]);

  // MBTIタイプの選択状態を管理するステート
  const [selectedTypes, setSelectedTypes] = useState([
    'ESFP',
    'ESTP',
    'ISFP',
    'ISTP',
    'ESFJ',
    'ESTJ',
    'ISFJ',
    'ISTJ',
    'ENFP',
    'ENTP',
    'INFP',
    'INTP',
    'ENFJ',
    'ENTJ',
    'INFJ',
    'INTJ',
  ]);

  // コンテンツタイプを管理するステート
  const [contentType, setContentType] = useState('アニメ');

  // 指標の選択状態を管理するステート
  const [selectedIndicators, setSelectedIndicators] = useState({
    EI: '',
    SN: '',
    TF: '',
    JP: '',
  });

  // 心理機能とMBTIタイプの対応を定義
  const functionToTypes = {
    Se: ['ESFP', 'ESTP', 'ISFP', 'ISTP'],
    Si: ['ESFJ', 'ESTJ', 'ISFJ', 'ISTJ'],
    Ne: ['ENFP', 'ENTP', 'INFP', 'INTP'],
    Ni: ['ENFJ', 'ENTJ', 'INFJ', 'INTJ'],
    Fe: ['ESFJ', 'ISFJ', 'ENFJ', 'INFJ'],
    Fi: ['ESFP', 'ISFP', 'ENFP', 'INFP'],
    Te: ['ESTJ', 'ISTJ', 'ENTJ', 'INTJ'],
    Ti: ['ESTP', 'ISTP', 'ENTP', 'INTP'],
  };

  // 心理機能の選択状態を切り替える関数
  const toggleFunction = (func) => {
    setSelectedFunctions((prev) => {
      let newSelectedFunctions;
      if (prev.includes(func)) {
        newSelectedFunctions = prev.filter((f) => f !== func);
      } else {
        newSelectedFunctions = [...prev, func];
      }

      // 選択された心理機能に基づいてMBTIタイプを更新
      const newSelectedTypes =
        newSelectedFunctions.length > 0
          ? [
              ...new Set(
                newSelectedFunctions.flatMap((f) => functionToTypes[f]),
              ),
            ]
          : [];
      setSelectedTypes(newSelectedTypes);

      return newSelectedFunctions;
    });
    setSelectedIndicators({
      EI: '',
      SN: '',
      TF: '',
      JP: '',
    });
  };

  // MBTIタイプの選択状態を切り替える関数
  const toggleType = (type) => {
    if (
      selectedFunctions.length > 0 ||
      Object.values(selectedIndicators).some((v) => v !== '')
    ) {
      // 心理機能または指標が選択されている場合
      setSelectedTypes([type]);
      setSelectedFunctions([]);
      setSelectedIndicators({
        EI: '',
        SN: '',
        TF: '',
        JP: '',
      });
    } else {
      // 心理機能も指標も選択されていない場合
      setSelectedTypes((prev) => {
        if (prev.includes(type)) {
          return prev.filter((t) => t !== type);
        } else {
          return [...prev, type];
        }
      });
    }
  };

  // 指標ボタンのクリックハンドラ
  const handleIndicatorClick = (group, indicator) => {
    setSelectedIndicators((prev) => {
      const newIndicators = { ...prev };
      if (prev[group] === indicator) {
        newIndicators[group] = '';
      } else {
        newIndicators[group] = indicator;
      }
      updateMBTITypes(newIndicators);
      return newIndicators;
    });
    setSelectedFunctions([]); // 心理機能の選択を解除
  };

  const updateMBTITypes = (indicators) => {
    const filteredTypes = [
      'ESFP',
      'ESTP',
      'ISFP',
      'ISTP',
      'ESFJ',
      'ESTJ',
      'ISFJ',
      'ISTJ',
      'ENFP',
      'ENTP',
      'INFP',
      'INTP',
      'ENFJ',
      'ENTJ',
      'INFJ',
      'INTJ',
    ].filter((type) => {
      return (
        (!indicators.EI || type.includes(indicators.EI)) &&
        (!indicators.SN || type.includes(indicators.SN)) &&
        (!indicators.TF || type.includes(indicators.TF)) &&
        (!indicators.JP || type.includes(indicators.JP))
      );
    });
    setSelectedTypes(filteredTypes);
  };

  // データをフェッチするための副作用
  useEffect(() => {
    const fetchData = async () => {
      const typesToUse = selectedTypes.length > 0 ? selectedTypes : [];

      // クエリパラメータを設定
      const queryParams = new URLSearchParams({
        mbti_types: typesToUse,
        media_type: contentType === 'アニメ' ? 'anime' : 'music',
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
            label: contentType,
            data: sortedData.map((item) => item[1]),
          },
        ],
      });
    };

    fetchData();
  }, [selectedTypes, selectedFunctions, contentType]);

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

  // ボタンのスタイルを定義
  const buttonStyle = (selected) => ({
    backgroundColor: selected ? '#2EA9DF' : '#fff',
    borderColor: '#2EA9DF',
    color: selected ? '#fff' : '#2EA9DF',
    '&:hover': {
      backgroundColor: selected ? '#2387c1' : '#fff',
      borderColor: '#2387c1',
    },
    '&.MuiButton-outlined': {
      color: '#2EA9DF',
      borderColor: '#2EA9DF',
    },
    '&.Mui-disabled': {
      backgroundColor: selected ? '#2EA9DF' : '#fff',
      color: selected ? '#fff' : '#2EA9DF',
      opacity: 1,
    },
  });

  // 心理機能の配列を2つのグループに分ける
  const perceptionFunctions = ['Se', 'Si', 'Ne', 'Ni'];
  const judgmentFunctions = ['Fe', 'Fi', 'Te', 'Ti'];

  return (
    <ThemeProvider theme={theme}>
      <>
        {/* 説明テキストを追加 */}
        <p className="text-[#2EA9DF] mt-5 mb-5 ml-32">
          ボタンを選択・選択解除することでデータベースをフィルタリングすることができま。心理機能またはMBTIタイプを選択してください。
        </p>

        {/* コンテンツタイプ選択ボタン */}
        <div className="ml-32">
          <ButtonGroup className="mb-4">
            {['アニメ', '音楽アーティスト'].map((type) => (
              <Button
                key={type}
                onClick={() => setContentType(type)}
                variant={contentType === type ? 'contained' : 'outlined'}
                sx={buttonStyle(contentType === type)}
              >
                {type}
              </Button>
            ))}
          </ButtonGroup>
        </div>

        {/* 指標選択ボタン */}
        <div className="button-groups mt-6 ml-32">
          {['EI', 'SN', 'TF', 'JP'].map((group) => (
            <ButtonGroup key={group} className="mr-4">
              {group.split('').map((letter) => (
                <Button
                  key={letter}
                  onClick={() => handleIndicatorClick(group, letter)}
                  variant={
                    selectedIndicators[group] === letter
                      ? 'contained'
                      : 'outlined'
                  }
                  sx={buttonStyle(selectedIndicators[group] === letter)}
                >
                  {letter}
                </Button>
              ))}
            </ButtonGroup>
          ))}
        </div>

        {/* 心理機能選択ボタン */}
        <div className="button-groups mt-6 ml-32">
          <ButtonGroup className="mb-4 mr-4">
            {perceptionFunctions.map((func) => (
              <Button
                key={func}
                onClick={() => toggleFunction(func)}
                variant={
                  selectedFunctions.includes(func) ? 'contained' : 'outlined'
                }
                sx={{
                  ...buttonStyle(selectedFunctions.includes(func)),
                  textTransform: 'none',
                }}
              >
                {func}
              </Button>
            ))}
          </ButtonGroup>
          <ButtonGroup className="mb-4">
            {judgmentFunctions.map((func) => (
              <Button
                key={func}
                onClick={() => toggleFunction(func)}
                variant={
                  selectedFunctions.includes(func) ? 'contained' : 'outlined'
                }
                sx={{
                  ...buttonStyle(selectedFunctions.includes(func)),
                  textTransform: 'none',
                }}
              >
                {func}
              </Button>
            ))}
          </ButtonGroup>
        </div>

        {/* MBTIタイプ選択ボタン */}
        <div className="button-groups mt-6 ml-32">
          <ButtonGroup>
            {[
              'ESFP',
              'ESTP',
              'ISFP',
              'ISTP',
              'ESFJ',
              'ESTJ',
              'ISFJ',
              'ISTJ',
              'ENFP',
              'ENTP',
              'INFP',
              'INTP',
              'ENFJ',
              'ENTJ',
              'INFJ',
              'INTJ',
            ].map((type) => (
              <Button
                key={type}
                onClick={() => toggleType(type)}
                variant={
                  selectedTypes.includes(type) ? 'contained' : 'outlined'
                }
                sx={buttonStyle(selectedTypes.includes(type))}
              >
                {type}
              </Button>
            ))}
          </ButtonGroup>
        </div>

        {/* グラフ表示 */}
        <div className="my-8 ml-2" style={{ width: '98%', height: '100%' }}>
          <Bar options={options} data={chartData} />
        </div>
      </>
    </ThemeProvider>
  );
}

export default Database;