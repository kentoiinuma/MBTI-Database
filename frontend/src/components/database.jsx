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
import { styled } from '@mui/material/styles';

// Chart.jsの設定を登録
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

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

// スタイル付きのButtonコンポーネントを作成
const StyledButton = styled(Button)(({ theme, selected }) => ({
  backgroundColor: selected ? '#2EA9DF' : '#fff',
  borderColor: '#2EA9DF',
  color: selected ? '#fff' : '#2EA9DF',
  '&:hover': {
    backgroundColor: selected ? '#2387c1' : '#f0f0f0', // 非選択時のホバー色を薄いグレーに変更
    borderColor: '#2EA9DF',
    color: selected ? '#fff' : '#2EA9DF',
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
}));

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
    'ESTP',
    'ESFP',
    'ISTP',
    'ISFP',
    'ESTJ',
    'ESFJ',
    'ISTJ',
    'ISFJ',
    'ENTP',
    'ENFP',
    'INTP',
    'INFP',
    'ENTJ',
    'ENFJ',
    'INTJ',
    'INFJ',
  ]);

  // コンテンツタイプを管理するステート
  const [contentType, setContentType] = useState('アニメ');

  // 指標の選択状態を理するステート
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
          ? [...new Set(newSelectedFunctions.flatMap((f) => functionToTypes[f]))]
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
    if (selectedFunctions.length > 0 || Object.values(selectedIndicators).some((v) => v !== '')) {
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
    setSelectedFunctions([]); // 心理機能選択を解除
  };

  const updateMBTITypes = (indicators) => {
    const filteredTypes = [
      'ESTP',
      'ESFP',
      'ISTP',
      'ISFP',
      'ESTJ',
      'ESFJ',
      'ISTJ',
      'ISFJ',
      'ENTP',
      'ENFP',
      'INTP',
      'INFP',
      'ENTJ',
      'ENFJ',
      'INTJ',
      'INFJ',
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

  // データをフェッチしてグラフを更新する副作用
  useEffect(() => {
    const fetchData = async () => {
      const typesToUse = selectedTypes.length > 0 ? selectedTypes : [];

      // クエリパラメータを設定
      const queryParams = new URLSearchParams({
        mbti_types: typesToUse,
        media_type: contentType === 'アニメ' ? 'anime' : 'music',
      });

      try {
        // データをフェッチしてグラフを更新
        const response = await fetch(`${API_URL}/api/v1/media_works/statistics?${queryParams}`);
        const data = await response.json();
        const sortedData = Object.entries(data).sort((a, b) => b[1] - a[1]);
        setChartData((prevChartData) => ({
          labels: sortedData.map((item) => item[0]),
          datasets: [
            {
              ...prevChartData.datasets[0],
              label: contentType,
              data: sortedData.map((item) => item[1]),
            },
          ],
        }));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [selectedTypes, selectedFunctions, contentType, API_URL]);

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

  // 心理機能の配列を2つのグループに分ける
  const perceptionFunctions = ['Se', 'Si', 'Ne', 'Ni'];
  const judgmentFunctions = ['Te', 'Ti', 'Fe', 'Fi'];

  return (
    <ThemeProvider theme={theme}>
      <div className="w-full max-w-full px-4 mx-auto md:max-w-7xl">
        {/* コンテンツタイプ選択ボタン */}
        <div className="flex justify-center mt-4 mb-4 md:mt-5 md:mb-5">
          <ButtonGroup>
            {['アニメ', '音楽'].map((type) => (
              <StyledButton
                key={type}
                onClick={() => setContentType(type)}
                variant={contentType === type ? 'contained' : 'outlined'}
                selected={contentType === type}
              >
                {type}
              </StyledButton>
            ))}
          </ButtonGroup>
        </div>

        {/* 説明テキスト */}
        <div className="text-center mx-0 mt-4 mb-4 md:mx-16 md:mt-5 md:mb-5">
          <p>
            グラフで表されたデータベースをフィルタリングして、気になる4つの指標・心理機能・MBTIタイプの好きな作品を見てみましょう！
          </p>
        </div>

        {/* 指標選択ボタン */}
        <div className="flex flex-wrap justify-center mt-4 md:mt-6">
          {['EI', 'SN', 'TF', 'JP'].map((group) => (
            <ButtonGroup key={group} className="mx-1 mb-2 md:mx-2">
              {group.split('').map((letter) => (
                <StyledButton
                  key={letter}
                  onClick={() => handleIndicatorClick(group, letter)}
                  variant={selectedIndicators[group] === letter ? 'contained' : 'outlined'}
                  selected={selectedIndicators[group] === letter}
                >
                  {letter}
                </StyledButton>
              ))}
            </ButtonGroup>
          ))}
        </div>

        {/* 心理機能選択ボタン */}
        <div className="flex flex-wrap justify-center mt-4 md:mt-6">
          <ButtonGroup className="mb-2 mx-1 md:mb-4 md:mx-2">
            {perceptionFunctions.map((func) => (
              <StyledButton
                key={func}
                onClick={() => toggleFunction(func)}
                variant={selectedFunctions.includes(func) ? 'contained' : 'outlined'}
                selected={selectedFunctions.includes(func)}
              >
                {func}
              </StyledButton>
            ))}
          </ButtonGroup>
          <ButtonGroup className="mb-2 mx-1 md:mb-4 md:mx-2">
            {judgmentFunctions.map((func) => (
              <StyledButton
                key={func}
                onClick={() => toggleFunction(func)}
                variant={selectedFunctions.includes(func) ? 'contained' : 'outlined'}
                selected={selectedFunctions.includes(func)}
              >
                {func}
              </StyledButton>
            ))}
          </ButtonGroup>
        </div>

        {/* MBTIタイプ選択ボタン */}
        <div className="flex flex-wrap justify-center mt-4 gap-2 md:mt-6 md:gap-4">
          {[
            ['ESTP', 'ESFP', 'ISTP', 'ISFP'],
            ['ESTJ', 'ESFJ', 'ISTJ', 'ISFJ'],
            ['ENTP', 'ENFP', 'INTP', 'INFP'],
            ['ENTJ', 'ENFJ', 'INTJ', 'INFJ'],
          ].map((group, index) => (
            <ButtonGroup key={index} className="mb-2">
              {group.map((type) => (
                <StyledButton
                  key={type}
                  onClick={() => toggleType(type)}
                  variant={selectedTypes.includes(type) ? 'contained' : 'outlined'}
                  selected={selectedTypes.includes(type)}
                >
                  {type}
                </StyledButton>
              ))}
            </ButtonGroup>
          ))}
        </div>

        {/* グラフ表示 */}
        <div className="my-6 w-full h-[400px] md:my-8 md:h-[600px]">
          <Bar options={options} data={chartData} />
        </div>
      </div>
    </ThemeProvider>
  );
}

export default Database;
