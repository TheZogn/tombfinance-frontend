import React, { useMemo } from 'react';
import Page from '../../components/Page';
import HomeImage from '../../assets/img/home.png';
import CashImage from '../../assets/img/crypto_ZGNOmb_cash.svg';
import Image from 'material-ui-image';
import { createGlobalStyle } from 'styled-components';
import CountUp from 'react-countup';
import CardIcon from '../../components/CardIcon';
import TokenSymbol from '../../components/TokenSymbol';
import useZGNOmbStats from '../../hooks/useZGNOmbStats';
import useLpStats from '../../hooks/useLpStats';
import useModal from '../../hooks/useModal';
import useZap from '../../hooks/useZap';
import useBondStats from '../../hooks/useBondStats';
import useZGNShareStats from '../../hooks/useZGNShareStats';
import useTotalValueLocked from '../../hooks/useTotalValueLocked';
import { ZGNOmb as ZGNOmbTesting, ZGNShare as ZGNShareTesting } from '../../ZGNOmb-finance/deployments/deployments.testing.json';
import { ZGNOmb as ZGNOmbProd, ZGNShare as ZGNShareProd } from '../../ZGNOmb-finance/deployments/deployments.mainnet.json';

import MetamaskFox from '../../assets/img/metamask-fox.svg';

import { Box, Button, Card, CardContent, Grid, Paper } from '@material-ui/core';
import ZapModal from '../Bank/components/ZapModal';

import { makeStyles } from '@material-ui/core/styles';
import useZGNOmbFinance from '../../hooks/useZGNOmbFinance';

const BackgroundImage = createGlobalStyle`
  body {
    background: url(${HomeImage}) no-repeat !important;
    background-size: cover !important;
  }
`;

const useStyles = makeStyles((theme) => ({
  button: {
    [theme.breakpoints.down('415')]: {
      marginTop: '10px',
    },
  },
}));

const Home = () => {
  const classes = useStyles();
  const TVL = useTotalValueLocked();
  const ZGNOmbFtmLpStats = useLpStats('ZGNOmb-FTM-LP');
  const ZGNShareFtmLpStats = useLpStats('ZGNShare-FTM-LP');
  const ZGNOmbStats = useZGNOmbStats();
  const ZGNShareStats = useZGNShareStats();
  const tBondStats = useBondStats();
  const ZGNOmbFinance = useZGNOmbFinance();

  let ZGNOmb;
  let ZGNShare;
  if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    ZGNOmb = ZGNOmbTesting;
    ZGNShare = ZGNShareTesting;
  } else {
    ZGNOmb = ZGNOmbProd;
    ZGNShare = ZGNShareProd;
  }

  const buyZGNOmbAddress = 'https://spookyswap.finance/swap?outputCurrency=' + ZGNOmb.address;
  const buyZGNShareAddress = 'https://spookyswap.finance/swap?outputCurrency=' + ZGNShare.address;

  const ZGNOmbLPStats = useMemo(() => (ZGNOmbFtmLpStats ? ZGNOmbFtmLpStats : null), [ZGNOmbFtmLpStats]);
  const ZGNShareLPStats = useMemo(() => (ZGNShareFtmLpStats ? ZGNShareFtmLpStats : null), [ZGNShareFtmLpStats]);
  const ZGNOmbPriceInDollars = useMemo(
    () => (ZGNOmbStats ? Number(ZGNOmbStats.priceInDollars).toFixed(2) : null),
    [ZGNOmbStats],
  );
  const ZGNOmbPriceInFTM = useMemo(() => (ZGNOmbStats ? Number(ZGNOmbStats.tokenInFtm).toFixed(2) : null), [ZGNOmbStats]);
  const ZGNOmbCirculatingSupply = useMemo(() => (ZGNOmbStats ? String(ZGNOmbStats.circulatingSupply) : null), [ZGNOmbStats]);
  const ZGNOmbTotalSupply = useMemo(() => (ZGNOmbStats ? String(ZGNOmbStats.totalSupply) : null), [ZGNOmbStats]);

  const ZGNSharePriceInDollars = useMemo(
    () => (ZGNShareStats ? Number(ZGNShareStats.priceInDollars).toFixed(2) : null),
    [ZGNShareStats],
  );
  const ZGNSharePriceInFTM = useMemo(
    () => (ZGNShareStats ? Number(ZGNShareStats.tokenInFtm).toFixed(2) : null),
    [ZGNShareStats],
  );
  const ZGNShareCirculatingSupply = useMemo(
    () => (ZGNShareStats ? String(ZGNShareStats.circulatingSupply) : null),
    [ZGNShareStats],
  );
  const ZGNShareTotalSupply = useMemo(() => (ZGNShareStats ? String(ZGNShareStats.totalSupply) : null), [ZGNShareStats]);

  const tBondPriceInDollars = useMemo(
    () => (tBondStats ? Number(tBondStats.priceInDollars).toFixed(2) : null),
    [tBondStats],
  );
  const tBondPriceInFTM = useMemo(() => (tBondStats ? Number(tBondStats.tokenInFtm).toFixed(2) : null), [tBondStats]);
  const tBondCirculatingSupply = useMemo(
    () => (tBondStats ? String(tBondStats.circulatingSupply) : null),
    [tBondStats],
  );
  const tBondTotalSupply = useMemo(() => (tBondStats ? String(tBondStats.totalSupply) : null), [tBondStats]);

  const ZGNOmbLpZap = useZap({ depositTokenName: 'ZGNOmb-FTM-LP' });
  const ZGNShareLpZap = useZap({ depositTokenName: 'ZGNShare-FTM-LP' });

  const [onPresentZGNOmbZap, onDissmissZGNOmbZap] = useModal(
    <ZapModal
      decimals={18}
      onConfirm={(zappingToken, tokenName, amount) => {
        if (Number(amount) <= 0 || isNaN(Number(amount))) return;
        ZGNOmbLpZap.onZap(zappingToken, tokenName, amount);
        onDissmissZGNOmbZap();
      }}
      tokenName={'ZGNOmb-FTM-LP'}
    />,
  );

  const [onPresentZGNShareZap, onDissmissZGNShareZap] = useModal(
    <ZapModal
      decimals={18}
      onConfirm={(zappingToken, tokenName, amount) => {
        if (Number(amount) <= 0 || isNaN(Number(amount))) return;
        ZGNShareLpZap.onZap(zappingToken, tokenName, amount);
        onDissmissZGNShareZap();
      }}
      tokenName={'ZGNShare-FTM-LP'}
    />,
  );

  return (
    <Page>
      <BackgroundImage />
      <Grid container spacing={3}>
        {/* Logo */}
        <Grid container item xs={12} sm={4} justify="center">
          {/* <Paper>xs=6 sm=3</Paper> */}
          <Image color="none" style={{ width: '300px', paddingTop: '0px' }} src={CashImage} />
        </Grid>
        {/* Explanation text */}
        <Grid item xs={12} sm={8}>
          <Paper>
            <Box p={4}>
              <h2>Welcome to ZGNOmb Finance</h2>
              <p>The first algorithmic stablecoin on Fantom Opera, pegged to the price of 1 FTM via seigniorage.</p>
              <p>
                Stake your ZGNShare in the Masonry to earn inflationary ZGNOmb rewards or provide liquidity on pairs and
                start earning today!
              </p>
            </Box>
          </Paper>
        </Grid>

        {/* TVL */}
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent align="center">
              <h2>Total Value Locked</h2>
              <CountUp style={{ fontSize: '25px' }} end={TVL} separator="," prefix="$" />
            </CardContent>
          </Card>
        </Grid>

        {/* Wallet */}
        <Grid item xs={12} sm={8}>
          <Card style={{ height: '100%' }}>
            <CardContent align="center" style={{ marginTop: '2.5%' }}>
              {/* <h2 style={{ marginBottom: '20px' }}>Wallet Balance</h2> */}
              <Button color="primary" href="/masonry" variant="contained" style={{ marginRight: '10px' }}>
                Stake Now
              </Button>
              <Button href="/cemetery" variant="contained" className={classes.button} style={{ marginRight: '10px' }}>
                Farm Now
              </Button>
              <Button
                color="primary"
                target="_blank"
                href={buyZGNOmbAddress}
                variant="contained"
                style={{ marginRight: '10px' }}
              >
                Buy ZGNOmb
              </Button>
              <Button variant="contained" target="_blank" href={buyZGNShareAddress} className={classes.button}>
                Buy ZGNShare
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* ZGNOmb */}
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent align="center" style={{ position: 'relative' }}>
              <h2>ZGNOmb</h2>
              <Button
                onClick={() => {
                  ZGNOmbFinance.watchAssetInMetamask('ZGNOmb');
                }}
                color="primary"
                variant="outlined"
                style={{ position: 'absolute', top: '10px', right: '10px' }}
              >
                +&nbsp;
                <img alt="metamask fox" style={{ width: '20px' }} src={MetamaskFox} />
              </Button>
              <Box mt={2}>
                <CardIcon>
                  <TokenSymbol symbol="ZGNOmb" />
                </CardIcon>
              </Box>
              Current Price
              <Box>
                <span style={{ fontSize: '30px' }}>{ZGNOmbPriceInFTM ? ZGNOmbPriceInFTM : '-.--'} FTM</span>
              </Box>
              <Box>
                <span style={{ fontSize: '16px', alignContent: 'flex-start' }}>
                  ${ZGNOmbPriceInDollars ? ZGNOmbPriceInDollars : '-.--'}
                </span>
              </Box>
              <span style={{ fontSize: '12px' }}>
                Market Cap: ${(ZGNOmbCirculatingSupply * ZGNOmbPriceInDollars).toFixed(2)} <br />
                Circulating Supply: {ZGNOmbCirculatingSupply} <br />
                Total Supply: {ZGNOmbTotalSupply}
              </span>
            </CardContent>
          </Card>
        </Grid>

        {/* ZGNShare */}
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent align="center" style={{ position: 'relative' }}>
              <h2>ZGNShare</h2>
              <Button
                onClick={() => {
                  ZGNOmbFinance.watchAssetInMetamask('ZGNShare');
                }}
                color="primary"
                variant="outlined"
                style={{ position: 'absolute', top: '10px', right: '10px' }}
              >
                +&nbsp;
                <img alt="metamask fox" style={{ width: '20px' }} src={MetamaskFox} />
              </Button>
              <Box mt={2}>
                <CardIcon>
                  <TokenSymbol symbol="ZGNShare" />
                </CardIcon>
              </Box>
              Current Price
              <Box>
                <span style={{ fontSize: '30px' }}>{ZGNSharePriceInFTM ? ZGNSharePriceInFTM : '-.--'} FTM</span>
              </Box>
              <Box>
                <span style={{ fontSize: '16px' }}>${ZGNSharePriceInDollars ? ZGNSharePriceInDollars : '-.--'}</span>
              </Box>
              <span style={{ fontSize: '12px' }}>
                Market Cap: ${(ZGNShareCirculatingSupply * ZGNSharePriceInDollars).toFixed(2)} <br />
                Circulating Supply: {ZGNShareCirculatingSupply} <br />
                Total Supply: {ZGNShareTotalSupply}
              </span>
            </CardContent>
          </Card>
        </Grid>

        {/* TBOND */}
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent align="center" style={{ position: 'relative' }}>
              <h2>TBOND</h2>
              <Button
                onClick={() => {
                  ZGNOmbFinance.watchAssetInMetamask('TBOND');
                }}
                color="primary"
                variant="outlined"
                style={{ position: 'absolute', top: '10px', right: '10px' }}
              >
                +&nbsp;
                <img alt="metamask fox" style={{ width: '20px' }} src={MetamaskFox} />
              </Button>
              <Box mt={2}>
                <CardIcon>
                  <TokenSymbol symbol="TBOND" />
                </CardIcon>
              </Box>
              Current Price
              <Box>
                <span style={{ fontSize: '30px' }}>{tBondPriceInFTM ? tBondPriceInFTM : '-.--'} FTM</span>
              </Box>
              <Box>
                <span style={{ fontSize: '16px' }}>${tBondPriceInDollars ? tBondPriceInDollars : '-.--'}</span>
              </Box>
              <span style={{ fontSize: '12px' }}>
                Market Cap: ${(tBondCirculatingSupply * tBondPriceInDollars).toFixed(2)} <br />
                Circulating Supply: {tBondCirculatingSupply} <br />
                Total Supply: {tBondTotalSupply}
              </span>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card>
            <CardContent align="center">
              <h2>ZGNOmb-FTM Spooky LP</h2>
              <Box mt={2}>
                <CardIcon>
                  <TokenSymbol symbol="ZGNOmb-FTM-LP" />
                </CardIcon>
              </Box>
              <Box mt={2}>
                <Button color="primary" onClick={onPresentZGNOmbZap} variant="contained">
                  Zap In
                </Button>
              </Box>
              <Box mt={2}>
                <span style={{ fontSize: '26px' }}>
                  {ZGNOmbLPStats?.tokenAmount ? ZGNOmbLPStats?.tokenAmount : '-.--'} ZGNOmb /{' '}
                  {ZGNOmbLPStats?.ftmAmount ? ZGNOmbLPStats?.ftmAmount : '-.--'} FTM
                </span>
              </Box>
              <Box>${ZGNOmbLPStats?.priceOfOne ? ZGNOmbLPStats.priceOfOne : '-.--'}</Box>
              <span style={{ fontSize: '12px' }}>
                Liquidity: ${ZGNOmbLPStats?.totalLiquidity ? ZGNOmbLPStats.totalLiquidity : '-.--'} <br />
                Total supply: {ZGNOmbLPStats?.totalSupply ? ZGNOmbLPStats.totalSupply : '-.--'}
              </span>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card>
            <CardContent align="center">
              <h2>ZGNShare-FTM Spooky LP</h2>
              <Box mt={2}>
                <CardIcon>
                  <TokenSymbol symbol="ZGNShare-FTM-LP" />
                </CardIcon>
              </Box>
              <Box mt={2}>
                <Button
                  color="primary"
                  onClick={onPresentZGNShareZap}
                  variant="contained"
                >
                  Zap In
                </Button>
              </Box>
              <Box mt={2}>
                <span style={{ fontSize: '26px' }}>
                  {ZGNShareLPStats?.tokenAmount ? ZGNShareLPStats?.tokenAmount : '-.--'} ZGNShare /{' '}
                  {ZGNShareLPStats?.ftmAmount ? ZGNShareLPStats?.ftmAmount : '-.--'} FTM
                </span>
              </Box>
              <Box>${ZGNShareLPStats?.priceOfOne ? ZGNShareLPStats.priceOfOne : '-.--'}</Box>
              <span style={{ fontSize: '12px' }}>
                Liquidity: ${ZGNShareLPStats?.totalLiquidity ? ZGNShareLPStats.totalLiquidity : '-.--'}
                <br />
                Total supply: {ZGNShareLPStats?.totalSupply ? ZGNShareLPStats.totalSupply : '-.--'}
              </span>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Page>
  );
};

export default Home;
