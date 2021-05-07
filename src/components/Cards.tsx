import React from 'react';

// Elemtes
import { Card, Grid } from './elements';

type cardsType = {
  isFirst?: boolean;
  cardsInfo: any;
};
// 카드목록 컴포넌트
const Cards = (props: cardsType) => {
  const { isFirst, cardsInfo } = props;
  const { first, second } = cardsInfo;

  // 첫 슬라이드의 카드 목록이면 4열로 보여주기
  if (isFirst) {
    return (
      <>
        {first.map((info, idx) => {
          return <Card key={idx} width="22.5%" cardTitle={info.label} cardDescription={info.description} />;
        })}
      </>
    );
  }

  // 두번째 슬라이드 3열 카드 보여주기
  return (
    <Grid height="100%">
      <Grid $wrap height="200%" jc="space-between" padding="0 0 2rem 0">
        {second.map((info, idx) => {
          return (
            <Card key={idx} width="30.8%" height="23%" cardTitle={info.label} cardDescription={info.description} />
          );
        })}
      </Grid>
    </Grid>
  );
};

Cards.defaultProps = {
  isFirst: false,
};

export default Cards;
