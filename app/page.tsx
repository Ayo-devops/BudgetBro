import Header from './components/Header'
import BalanceCard from './components/BalanceCard'
import QuickActions from './components/QuickActions'
import TransactionList from './components/TransactionList'

export default function Home() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#faf7f2', padding: '1.5rem' }}>
      <Header />
      <BalanceCard />
      <QuickActions />
      <TransactionList />
    </div>
  )
}