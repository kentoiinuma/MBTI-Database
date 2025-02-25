import React, { useState, useEffect, useMemo, useCallback } from 'react';
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
import { getApiUrl } from '../utils/apiUrl';

// Chart.js の設定登録
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// ■ 定数定義 ■
const MBTI_TYPES = [
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
];

const DEFAULT_INDICATORS = { EI: '', SN: '', TF: '', JP: '' };

const FUNCTION_TO_TYPES = {
  Se: ['ESFP', 'ESTP', 'ISFP', 'ISTP'],
  Si: ['ESFJ', 'ESTJ', 'ISFJ', 'ISTJ'],
  Ne: ['ENFP', 'ENTP', 'INFP', 'INTP'],
  Ni: ['ENFJ', 'ENTJ', 'INFJ', 'INTJ'],
  Fe: ['ESFJ', 'ISFJ', 'ENFJ', 'INFJ'],
  Fi: ['ESFP', 'ISFP', 'ENFP', 'INFP'],
  Te: ['ESTJ', 'ISTJ', 'ENTJ', 'INTJ'],
  Ti: ['ESTP', 'ISTP', 'ENTP', 'INTP'],
};

const PERCEPTION_FUNCTIONS = ['Se', 'Si', 'Ne', 'Ni'];
const JUDGMENT_FUNCTIONS = ['Te', 'Ti', 'Fe', 'Fi'];
const CONTENT_TYPES = ['アニメ', '音楽'];

const initialChartData = {
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
};

// ■ MUI テーマ設定 ■
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

// ■ Styled Button コンポーネント ■
const StyledButton = styled(Button)(({ theme, selected }) => ({
  backgroundColor: selected ? '#2EA9DF' : '#fff',
  borderColor: '#2EA9DF',
  color: selected ? '#fff' : '#2EA9DF',
  '&:hover': {
    backgroundColor: selected ? '#2387c1' : '#f0f0f0',
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
  // ■ ステート定義 ■
  const [chartData, setChartData] = useState(initialChartData);
  const [selectedFunctions, setSelectedFunctions] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState(MBTI_TYPES);
  const [contentType, setContentType] = useState('アニメ');
  const [selectedIndicators, setSelectedIndicators] = useState(DEFAULT_INDICATORS);
  const [chartHeight, setChartHeight] = useState(400);
  const [loading, setLoading] = useState(true);

  // API URL を useMemo でキャッシュ
  const API_URL = useMemo(() => getApiUrl(), []);

  // ■ MBTI タイプ更新用関数 ■
  const updateMBTITypes = (indicators) => {
    const filteredTypes = MBTI_TYPES.filter((type) => {
      return (
        (!indicators.EI || type.includes(indicators.EI)) &&
        (!indicators.SN || type.includes(indicators.SN)) &&
        (!indicators.TF || type.includes(indicators.TF)) &&
        (!indicators.JP || type.includes(indicators.JP))
      );
    });
    setSelectedTypes(filteredTypes);
  };

  // ■ 心理機能トグル処理 ■
  const toggleFunction = (func) => {
    setSelectedFunctions((prev) => {
      const newSelectedFunctions = prev.includes(func)
        ? prev.filter((f) => f !== func)
        : [...prev, func];
      // 心理機能選択に基づいて MBTI タイプを更新
      const newSelectedTypes =
        newSelectedFunctions.length > 0
          ? Array.from(new Set(newSelectedFunctions.flatMap((f) => FUNCTION_TO_TYPES[f])))
          : MBTI_TYPES;
      setSelectedTypes(newSelectedTypes);
      return newSelectedFunctions;
    });
    // 指標選択はリセット
    setSelectedIndicators(DEFAULT_INDICATORS);
  };

  // MBTI タイプトグル処理
  const toggleType = (type) => {
    if (selectedFunctions.length > 0 || Object.values(selectedIndicators).some((v) => v !== '')) {
      // 心理機能または指標が選択されている場合は、そのタイプのみ選択
      setSelectedTypes([type]);
      setSelectedFunctions([]);
      setSelectedIndicators(DEFAULT_INDICATORS);
    } else if (selectedTypes.length === MBTI_TYPES.length) {
      // 初期状態（全MBTIタイプが選択されている状態）なら、クリックされたタイプだけを選択する
      setSelectedTypes([type]);
    } else {
      // それ以外の場合はトグル（選択済みなら外す、未選択なら追加する）
      setSelectedTypes((prev) =>
        prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
      );
    }
  };

  // ■ 指標ボタンのクリックハンドラ ■
  const handleIndicatorClick = (group, indicator) => {
    setSelectedIndicators((prev) => {
      const newIndicators = { ...prev, [group]: prev[group] === indicator ? '' : indicator };
      updateMBTITypes(newIndicators);
      return newIndicators;
    });
    // 心理機能選択は解除
    setSelectedFunctions([]);
  };

  // ■ データフェッチ＆チャート更新の副作用 ■
  useEffect(() => {
    const fetchData = async () => {
      const typesToUse = selectedTypes.length > 0 ? selectedTypes : [];
      setLoading(true);
      const queryParams = new URLSearchParams({
        mbti_types: typesToUse,
        media_type: contentType === 'アニメ' ? 'anime' : 'music',
      });
      try {
        const statisticsRes = await fetch(`${API_URL}/media_works/statistics?${queryParams}`);
        const statisticsData = await statisticsRes.json();
        const sortedData = Object.entries(statisticsData).sort(
          ([, aValue], [, bValue]) => bValue - aValue
        );
        setChartData((prevChartData) => ({
          labels: sortedData.map(([key]) => key),
          datasets: [
            {
              ...prevChartData.datasets[0],
              label: contentType,
              data: sortedData.map(([, value]) => value),
            },
          ],
        }));
      } catch (error) {
        console.error('Database.jsx / fetchData: API 呼び出し中にエラーが発生しました:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedTypes, selectedFunctions, contentType, API_URL]);

  // ■ チャート高さの計算を useCallback でメモ化 ■
  const calculateChartHeight = useCallback(() => {
    const baseHeight = 400; // 基本高さ（px）
    const additionalHeightPerData = 30; // 1作品あたりの追加高さ（px）
    return baseHeight + chartData.labels.length * additionalHeightPerData;
  }, [chartData.labels.length]);

  // chartData 更新時に高さ再計算
  useEffect(() => {
    setChartHeight(calculateChartHeight());
  }, [calculateChartHeight]);

  // ※ responsiveHeight 関数をシンプルに、chartHeight をそのまま返す
  const responsiveHeight = () => chartHeight;

  // ■ Chart.js オプション設定 ■
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

  return (
    <ThemeProvider theme={theme}>
      <div className="w-full max-w-full px-4 mx-auto md:max-w-7xl">
        {/* コンテンツタイプ選択 */}
        <div className="flex justify-center mt-4 mb-4 md:mt-5 md:mb-5">
          <ButtonGroup>
            {CONTENT_TYPES.map((type) => (
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
            グラフで表されたデータベースをフィルタリングして、気になるMBTIタイプ・
            心理機能・4つの指標の好きな作品を見てみましょう🙌
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
            {PERCEPTION_FUNCTIONS.map((func) => (
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
            {JUDGMENT_FUNCTIONS.map((func) => (
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

        {/* MBTI タイプ選択ボタン */}
        <div className="flex flex-wrap justify-center mt-4 gap-2 md:mt-6 md:gap-4">
          {[
            MBTI_TYPES.slice(0, 4),
            MBTI_TYPES.slice(4, 8),
            MBTI_TYPES.slice(8, 12),
            MBTI_TYPES.slice(12, 16),
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

        {/* グラフ表示エリア */}
        <div className="my-6 w-full" style={{ height: responsiveHeight() }}>
          {loading ? (
            // spinner を中央に配置するために flex コンテナを使用
            <div className="flex items-center justify-center h-full">
              <div className="loading loading-spinner loading-lg text-custom"></div>
            </div>
          ) : (
            <div style={{ overflowY: 'auto', height: '100%' }}>
              <Bar options={options} data={chartData} />
            </div>
          )}
        </div>
      </div>
    </ThemeProvider>
  );
}

export default Database;
