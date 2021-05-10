import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'src/redux/modules';
import { convertWeaterInfo } from 'src/shared/common';
import styled from 'styled-components';
import { Card, Grid, Title } from './elements';

const Corona = (props) => {
  const [allNewCaseDes, setallNewCaseDes] = useState(null);
  const [bigRegionNewCaseDes, setBigRegionNewCaseDes] = useState(null);
  // const [allNewCaseDes, setallNewCaseDes] = useState(null)
  const { coronaCurrentBigRegionNewCaseCount, coronaAllNewCaseCount } = useSelector(
    (state: RootState) => state.weather.weatherInfo,
  );

  useEffect(() => {
    setallNewCaseDes(convertWeaterInfo('corona', coronaAllNewCaseCount));
    setBigRegionNewCaseDes(convertWeaterInfo('corona', coronaCurrentBigRegionNewCaseCount));
  }, []);
  return (
    <Container>
      <Title>코로나 지수</Title>
      <div>그림</div>
      <CardWrapper>
        <Card width="30%" height="150px" cardTitle="전국 신규 확진자" cardDescription={allNewCaseDes} />
        <Card width="30%" height="150px" cardTitle="지역 신규 확진자" cardDescription={bigRegionNewCaseDes} />
        {/*  <Card width="30%" height="150px" cardTitle="모레" cardDescription={afterTomorrow} /> */}
      </CardWrapper>
    </Container>
  );
};

const Container = styled.div`
  width: ${(props) => props.theme.view.width};
  height: 100%;
  ${(props) => props.theme.flex.column};
  justify-content: space-around;
`;

const CardWrapper = styled.div`
  width: 100%;
  height: 50%;
  ${(props) => props.theme.border_box};
  ${(props) => props.theme.flex.row};
  justify-content: space-around;
  padding: 1rem;
`;

export default Corona;
