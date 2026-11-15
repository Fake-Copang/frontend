import { useMemo } from 'react';
import { useWallet, useCheckIn, useChargeWallet } from '../hooks/useWallet';
import { useOrders } from '../hooks/useOrders';
import { computeWeeklySavings } from '../lib/orderUtils';
import { DAILY_GRANT } from '../api/wallet';
import './MyWallet.css';

const CHARGE_OPTIONS = [100_000, 500_000, 1_000_000];

function SavingsCard({ orders }) {
  const { thisWeek, lastWeek, diff } = useMemo(() => computeWeeklySavings(orders), [orders]);

  if (thisWeek === 0 && lastWeek === 0) {
    return (
      <section className="wallet-card">
        <h3>이번 주 절약 리포트</h3>
        <p className="wallet-card__muted">이번 주에는 아직 가상 주문이 없어요.</p>
      </section>
    );
  }

  let compareText = '저번 주와 같아요';
  let compareClass = 'savings__compare';
  if (diff > 0) {
    compareText = `▲ 저번 주보다 ${diff.toLocaleString()}원 더 아꼈어요`;
    compareClass += ' savings__compare--up';
  } else if (diff < 0) {
    compareText = `▼ 저번 주보다 ${Math.abs(diff).toLocaleString()}원 덜 아꼈어요`;
    compareClass += ' savings__compare--down';
  }

  return (
    <section className="wallet-card">
      <h3>이번 주 절약 리포트</h3>
      <p className="savings__main">이번 주에 {thisWeek.toLocaleString()}원 아꼈어요!</p>
      <p className={compareClass}>{compareText}</p>
      <p className="wallet-card__muted">저번 주 {lastWeek.toLocaleString()}원</p>
    </section>
  );
}

export default function MyWallet() {
  const { data: wallet, isLoading, isError } = useWallet();
  const { data: orders } = useOrders();
  const { mutate: runCheckIn, isPending: isCheckingIn } = useCheckIn();
  const { mutate: runCharge, isPending: isCharging } = useChargeWallet();

  if (isLoading) return <div className="wallet-page"><p className="wallet-page__status">불러오는 중이에요...</p></div>;
  if (isError || !wallet) {
    return <div className="wallet-page"><p className="wallet-page__status">지갑 정보를 불러오지 못했어요.</p></div>;
  }

  return (
    <div className="wallet-page">
      <h2 className="wallet-page__title">내 지갑</h2>

      <section className="wallet-card wallet-card--balance">
        <p className="wallet-card__label">내 가상 잔액</p>
        <p className="wallet-card__balance">{wallet.balance.toLocaleString()}원</p>
      </section>

      <section className="wallet-card">
        <h3>출석체크</h3>
        <p className="wallet-card__muted">하루에 한 번, 가상 포인트를 받을 수 있어요.</p>
        <button
          type="button"
          className="btn-primary"
          disabled={wallet.checkedInToday || isCheckingIn}
          onClick={() => runCheckIn()}
        >
          {wallet.checkedInToday ? '오늘은 이미 받았어요' : `출석체크하고 ${DAILY_GRANT.toLocaleString()}원 받기`}
        </button>
      </section>

      <section className="wallet-card">
        <h3>무료 충전</h3>
        <p className="wallet-card__muted">실제 결제 없이 원하는 만큼 충전할 수 있어요.</p>
        <div className="wallet-card__row">
          {CHARGE_OPTIONS.map((amount) => (
            <button
              key={amount}
              type="button"
              className="btn-outline"
              disabled={isCharging}
              onClick={() => runCharge(amount)}
            >
              {`+${amount.toLocaleString()}원 충전`}
            </button>
          ))}
        </div>
      </section>

      <SavingsCard orders={orders ?? []} />
    </div>
  );
}